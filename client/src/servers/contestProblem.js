import axios from "axios";

export const getContestProblem = async (contestId) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/${contestId}/problems`);
  return response.data;
};

export const getProblemInfo = async ({ problemId, contestId }) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/${contestId}/problems/${problemId}`
  );
  return response.data;
};

export const submitContestProblem = async (submissionData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/${submissionData.problemId}/submitcode`
  );
  return response.data;
};

export const checkRegisteredUser = async ({ contestId, userId }) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/checkregistered`, {
    contestId,
    userId,
  });
  return response.data;
};

export const getContestStatus = async (contestId) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/getStatus/${contestId}`);
  return response.data;
};

export const fetchLeaderboard = async (contestId) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/contest/${contestId}/leaderboard`);
  return response.data;
};
