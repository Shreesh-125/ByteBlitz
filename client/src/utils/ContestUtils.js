// utils/contestUtils.js
export const addRegisteredAttribute = (contests, userId) => {
    if (!contests) return [];
    
    return contests.map(contest => ({
      ...contest,
      registered: contest.registeredUsers?.includes(userId) || false
    }));
  };