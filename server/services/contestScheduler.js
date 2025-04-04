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
    // 1. Get the leaderboard with all necessary data in one query
    const leaderboard = await Leaderboard.findOne({ contestId })
      .populate({
        path: 'users.userId',
        select: 'rating maxRating submissions'
      })
      .session(session);

    if (!leaderboard) {
      throw new Error('Contest not found');
    }

    // Extract all problem IDs from the leaderboard
    const problemIds = leaderboard.problemScore.map(prob => prob.problemId);
    
    // 2. Update all problems to unhidden in bulk
    await Problems.updateMany(
      { problemId: { $in: problemIds } },
      { $set: { hidden: false } },
      { session }
    );

    // Prepare data for rating updates and submission unhiding
    const users = leaderboard.users.map(user => ({
      userId: user.userId._id,
      rating: user.userId.rating || 1000,
      maxRating:user.userId.maxRating,
      score: user.score,
      submissions: user.userId.submissions || []
    }));

    // 3. Calculate new ratings
    const newRatings = computeNewRatings(users);

    // Prepare bulk operations for:
    // - Rating updates
    // - Submission unhiding
    const userBulkOps = [];

    newRatings.forEach(({ userId, newRating }) => {
      // Find the user's current maxRating
      const user = users.find(u => u.userId.equals(userId));
      const currentMaxRating = user?.maxRating || 1000;
      const updatedMaxRating = Math.max(currentMaxRating, newRating);

      // Prepare rating update
      userBulkOps.push({
        updateOne: {
          filter: { _id: userId },
          update: {
            $set: { 
              rating: newRating,
              maxRating: updatedMaxRating
            },
            // Unhide all contest submissions
            $set: {
              "submissions.$[elem].hidden": false
            },
            // Add contest history
            $push: {
              contests: {
                contestId: leaderboard._id,
                rank: leaderboard.users.find(u => u.userId.equals(userId))?.rank || 0,
                ratingChange: newRating - (user?.rating || 1000),
                newRating
              }
            }
          },
          arrayFilters: [{
            "elem.problemId": { $in: problemIds }
          }]
        }
      });
    });

    // 4. Execute all user updates in a single bulk operation
    await User.bulkWrite(userBulkOps, { session });

    // 5. Mark leaderboard as processed
    await Leaderboard.updateOne(
      { contestId },
      { $set: { ratingsUpdated: true, problemsUnhidden: true } },
      { session }
    );

    await session.commitTransaction();
    console.log(`Post-contest processing completed for contest ${contestId}`);
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in post-contest processing:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

// Enhanced rating calculation with tie handling  
function computeNewRatings(users) {
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
  users.forEach(({ userId, rating: R_A, rank: rank_A }) => {
    const group = rankGroups[rank_A];
    const groupSize = group.length;
    const groupStartIndex = rank_A - 1;
    const groupEndIndex = groupStartIndex + groupSize - 1;

    // Calculate average position for tied users
    const averageRank = (groupStartIndex + groupEndIndex) / 2 + 1;
    const S_A = (n - averageRank) / (n - 1);

    let baseK = R_A >= 1000 ? 400 : 200;

    // Compute expected score against all other users
    let E_A = users.reduce((sum, { rating: R_B }) => {
      return sum + 1 / (1 + Math.pow(10, (R_B - R_A) / 400));
    }, 0) / n;

    // Calculate initial rating change
    let ratingChange = baseK * (S_A - E_A);

    // Adjust K factor based on performance
    let K = ratingChange > 0 ? baseK * 1.5 : baseK / 1.5;
    ratingChange = K * (S_A - E_A);

    // Protection for beginners (rating < 1000)
    if (R_A < 1000 && ratingChange < 0) {
      ratingChange = 0; // Or reduced penalty: ratingChange = ratingChange / 2;
    }

    // Cap extreme rating changes
    ratingChange = Math.max(-400, Math.min(400, ratingChange));

    let newRating = Math.round(R_A + ratingChange);
    
    // Ensure minimum rating
    newRating = Math.max(100, newRating);

    newRatings.push({ userId, newRating });
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