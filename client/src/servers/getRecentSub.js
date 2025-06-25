import axios from "axios";

export const getRecentSub = async (user, token) => {
  const URL = `https://byteblitz-backend.onrender.com/api/v1/user/getrecentsubmission/${user.username}`;
  const response = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data.submissions;
};
