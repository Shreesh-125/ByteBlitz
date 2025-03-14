import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';
import schedule from 'node-schedule';

// Problem Schema
const problemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true, ref: 'problems' },
  problemTitle: { type: String, required: true },
  solvedBy: { type: Number, required: true },
  attemptedBy: { type: Number, required: true },
});

// Contest Schema
const contestSchema = new mongoose.Schema({
  contestId: { type: Number, unique: true },
  problems: { type: [problemSchema], required: true },
  submissions: { type: [String], required: true },
  registeredUser: { type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }], default: [] 
  },
 
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ['upcoming', 'running', 'ended'],
    default: 'upcoming',
  },
});

// Apply AutoIncrement Plugin to Contest ID
contestSchema.plugin(AutoIncrement(mongoose), { inc_field: 'contestId' });

// Export Contest Model
export const Contests = mongoose.model('Contests', contestSchema);

// Function to update contest status
const updateContestStatus = async (contestId, status) => {
  try {
    await Contests.updateOne({ contestId }, { $set: { status } });
    console.log(`Contest ${contestId} status updated to ${status}`);
  } catch (error) {
    console.error(`Error updating contest status: ${error.message}`);
  }
};

// Function to schedule contest updates
// Function to schedule contest updates
export const scheduleContestUpdates = (contest) => {
  const { contestId, startTime, endTime } = contest;

  // Convert startTime and endTime to Date objects if they are strings
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);


  // Schedule status update to "running" at startTime
  schedule.scheduleJob(startDate, () => {
    console.log(`Contest ${contestId} is now running`);
    updateContestStatus(contestId, 'running');
  });

  // Schedule status update to "ended" at endTime
  schedule.scheduleJob(endDate, () => {
    console.log(`Contest ${contestId} has ended`);
    updateContestStatus(contestId, 'ended');
  });
};

// Function to reschedule all contests on server start
const rescheduleAllContests = async () => {
  const contests = await Contests.find({
    $or: [{ status: 'upcoming' }, { status: 'running' }],
  });
  
  contests.forEach((contest) => {
    scheduleContestUpdates(contest);
  });
};

// Call this function when your server starts
rescheduleAllContests();