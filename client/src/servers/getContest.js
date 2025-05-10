import axios from "axios";

export const getAllContestWithPagination = async (page = 1, limit = 10) => {
  try {

    const response = await axios.get(
      `/api/v1/contest?page=${page}&limit=${limit}`
    );
    const transformContestData = (data) => {
      return data.contests.map((contest) => ({
        contestId: contest.contestId, // Assuming contestId exists in API response
        registeredUsers: contest.registeredUser.map((user) => user), // Extract usernames if available
        startTime: new Date(contest.startTime),
        status: contest.status,
      }));
    };
    const data = transformContestData(response.data);
    console.log(data);

    return data; // Returns contests with pagination metadata
  } catch (error) {
    console.error("Error fetching contests:", error);
    return null; // Return null in case of an error
  }
};

export const registerUser= async({contestId,userId})=>{
  const response=await axios.get(`/api/v1/contest/register/${contestId}/${userId}`);
  return response;
}


export const getUserContests= async (username)=>{
  const response = await axios.get(`/api/v1/user/${username}/contests`);
  return response.data.contests;
}