// utils/contestUtils.js
export const addRegisteredAttribute = (contests, userId) => {
    if (!contests) return [];
    
    return contests.map(contest => ({
      ...contest,
      registered: contest.registeredUsers?.includes(userId) || false
    }));
  };

  export const getVerdictMessage = (verdict) => {
    const verdictMessages = {
      3: "accepted",
      4: "Wrong Answer",
      5: "Time Limit Exceeded",
      6: "Compilation Error",
      7: "Runtime Error",
      13: "Internal Server Error",
      14: "Execution Time Limit Exceeded",
      15: "Memory Limit Exceeded (MLE)",
    };
  
    return verdictMessages[verdict] || "Unknown Error";
  };