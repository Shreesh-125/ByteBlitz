import schedule from 'node-schedule';
import { Contests } from '../models/constests.model.js';

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
export const scheduleContestUpdates = (contest, io) => {
  const { contestId, startTime, endTime } = contest;

  // Convert startTime and endTime to Date objects if they are strings
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Schedule status update to "running" at startTime
  schedule.scheduleJob(startDate, () => {
    console.log(`Contest ${contestId} is now running`);
    updateContestStatus(contestId, 'running');

    // Emit contest_started event
    io.emit('contest_started', { message: 'Contest has started!' });
  });

  // Schedule status update to "ended" at endTime
  schedule.scheduleJob(endDate, () => {
    console.log(`Contest ${contestId} has ended`);
    updateContestStatus(contestId, 'ended');

    // Emit contest_ended event and disconnect all clients
    io.emit('contest_ended', { message: 'Contest has ended!' });

    // Disconnect all clients
    io.sockets.sockets.forEach((socket) => {
      socket.disconnect(true);
    });
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