import schedule from 'node-schedule';
import { Contests } from '../models/constests.model.js';
import { Leaderboard } from "../models/LeaderBoard.model.js";
import { Problems } from "../models/problems.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Function to update contest status
const updateContestStatus = async (contestId, status) => {
  try {
    await Contests.updateOne({ contestId }, { $set: { status } });
    console.log(`Contest ${contestId} status updated to ${status}`);
  } catch (error) {
    console.error(`Error updating contest status: ${error.message}`);
  }
};

const completePostContestProcessing = async (contestId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get the leaderboard with all necessary data
    const leaderboard = await Leaderboard.findOne({ contestId })
      .populate({
        path: 'users.userId',
        select: 'rating maxRating submissions'
      })
      .session(session);

    if (!leaderboard) {
      throw new Error('Contest not found');
    }

    // Extract problem IDs
    const problemIds = leaderboard.problemScore.map(prob => prob.problemId);
    
    // 2. Unhide problems
    await Problems.updateMany(
      { problemId: { $in: problemIds } },
      { $set: { hidden: false } },
      { session }
    );

    // Prepare user data with defaults
    const users = leaderboard.users.map(user => ({
      userId: user.userId._id,
      rating: Number(user.userId.rating) || 1000,
      maxRating: Number(user.userId.maxRating) || 1000,
      score: user.score,
      submissions: user.userId.submissions || [],
      rank: user.rank
    }));

    // 3. Calculate new ratings with validation
    const newRatings = computeNewRatings(users);
    
    // Validate ratings before proceeding
    newRatings.forEach(rating => {
      if (isNaN(rating.newRating)) {
        throw new Error(`Invalid rating calculated for user ${rating.userId}`);
      }
    });

    // Prepare bulk operations
    const userBulkOps = [];

    newRatings.forEach(({ userId, newRating }) => {
      const user = users.find(u => u.userId.equals(userId));
      const ratingChange = newRating - (user?.rating || 1000);
      const updatedMaxRating = Math.max(user?.maxRating || 1000, newRating);

      userBulkOps.push({
        updateOne: {
          filter: { _id: userId },
          update: {
            $set: { 
              rating: newRating,
              maxRating: updatedMaxRating,
              "submissions.$[elem].hidden": false
            },
            $push: {
              contests: {
                contestId: contestId,
                rank: user?.rank || 0,
                ratingChange: ratingChange,
                newRating: newRating
              }
            }
          },
          arrayFilters: [{
            "elem.problemId": { $in: problemIds }
          }]
        }
      });
    });

    // 4. Execute updates
    const bulkWriteResult = await User.bulkWrite(userBulkOps, { session });
    console.log(`Updated ${bulkWriteResult.modifiedCount} users`);

    // 5. Mark leaderboard as processed
    await Leaderboard.updateOne(
      { contestId },
      { $set: { ratingsUpdated: true, problemsUnhidden: true } },
      { session }
    );

    await session.commitTransaction();
    console.log(`Successfully processed contest ${contestId}`);
    return { 
      success: true,
      usersUpdated: bulkWriteResult.modifiedCount
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Post-contest processing failed:', {
      contestId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    await session.endSession();
  }
};
// Enhanced rating calculation with tie handling  
function computeNewRatings(users) {
  if (!users.length) return [];

  const n = users.length;
  let newRatings = [];

  // Sort users by score in descending order
  users.sort((a, b) => b.score - a.score);

  // Assign ranks, handling ties
  let rank = 1;
  for (let i = 0; i < n; i++) {
    if (i > 0 && users[i].score < users[i - 1].score) {
      rank = i + 1;
    }
    users[i].rank = rank;
  }

  // Group users by rank for tie handling
  const rankGroups = {};
  users.forEach(user => {
    if (!rankGroups[user.rank]) {
      rankGroups[user.rank] = [];
    }
    rankGroups[user.rank].push(user);
  });

  // Calculate new ratings with tie consideration
  users.forEach((user) => {
    const { userId, rating: R_A = 0, rank: rank_A } = user;
    
    // Skip users with no rating (0 or undefined)
    if (!R_A) {
      newRatings.push({ userId, newRating: 0, ratingChange: 0 });
      return;
    }

    const group = rankGroups[rank_A];
    const groupSize = group.length;
    const groupStartIndex = rank_A - 1;
    const groupEndIndex = groupStartIndex + groupSize - 1;

    // Calculate average position for tied users
    const averageRank = (groupStartIndex + groupEndIndex) / 2 + 1;
    const S_A = (n - averageRank) / Math.max(1, n - 1);

    // Dynamic K-factor based on rating
    let baseK;
    if (R_A < 1000) {
      baseK = 600; // Higher K-factor for beginners to boost them faster
    } else if (R_A < 2000) {
      baseK = 400; // Standard K-factor for intermediate
    } else {
      baseK = 200; // Lower K-factor for experts
    }

    // Compute expected score against all other users
    let E_A = users.reduce((sum, { rating: R_B = 0 }) => {
      // Only consider users with actual ratings
      return R_B ? sum + 1 / (1 + Math.pow(10, (R_B - R_A) / 400)) : sum;
    }, 0) / n;

    // Calculate rating change with positive bias for beginners
    let ratingChange = baseK * (S_A - E_A);
    
    // Special handling for beginners (<1000 rating)
    if (R_A < 1000) {
      // Ensure minimum positive change for beginners
      const minGain = 10; // Minimum positive change
      ratingChange = Math.max(ratingChange, minGain);
      
      // Cap maximum loss for beginners
      const maxLoss = -20; // Maximum negative change
      ratingChange = Math.max(ratingChange, maxLoss);
    } else {
      // Standard rating change limits for others
      ratingChange = Math.max(-100, Math.min(100, ratingChange));
    }

    // Calculate new rating
    let newRating = Math.round(R_A + ratingChange);
    
    // Ensure minimum rating of 100
    newRating = Math.max(100, newRating);

    // For beginners, ensure they don't drop below their starting point
    if (R_A < 1000) {
      newRating = Math.max(newRating, R_A);
    }

    newRatings.push({ 
      userId, 
      newRating,
      ratingChange: Number(ratingChange.toFixed(1))
    });
  });

  return newRatings;
}

// Function to schedule contest updates
export const scheduleContestUpdates = (contest, io) => {
  const { contestId, startTime, endTime } = contest;
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Schedule status update to "running" at startTime
  schedule.scheduleJob(startDate, async () => {
    try {
      console.log(`Contest ${contestId} is now running`);
      await updateContestStatus(contestId, 'running');

      if (io && typeof io.emit === 'function') {
        io.emit('contest_started', { message: 'Contest has started!' });
      }
    } catch (error) {
      console.error(`Error in contest start handler: ${error.message}`);
    }
  });

  // Schedule status update to "ended" at endTime
  schedule.scheduleJob(endDate, async () => {
    try {
      console.log(`Contest ${contestId} has ended`);
      await updateContestStatus(contestId, 'ended');

      if (io && typeof io.emit === 'function') {
        io.emit('contest_ended', { message: 'Contest has ended!' });

        // Disconnect all clients
        io.sockets.sockets.forEach((socket) => {
          socket.disconnect(true);
        });
      }

      // Execute post-contest operations sequentially
      await completePostContestProcessing(contestId);
      // await makeProblemsUnhidden(contestId);  // Uncomment when implemented
      // await unhideUserSubmissions(contestId); // Uncomment when implemented
      
      console.log(`All post-contest operations completed for ${contestId}`);
    } catch (error) {
      console.error(`Error in contest end handler: ${error.message}`);
      // Consider adding retry logic or admin notification here
    }
  });
};

// Function to reschedule all contests on server start
export const rescheduleAllContests = async (io) => {
  const contests = await Contests.find({
    $or: [{ status: 'upcoming' }, { status: 'running' }],
  });

  contests.forEach((contest) => {
    scheduleContestUpdates(contest, io);
  });
};