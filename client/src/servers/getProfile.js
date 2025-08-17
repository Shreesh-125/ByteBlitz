import axios from "axios";

export const getProfile = async (username) => {  // No `user` or `token` needed
  const URL = `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/${username}`;
  
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error);
    return null;
  }
};
