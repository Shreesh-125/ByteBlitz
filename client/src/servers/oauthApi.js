import axios from "axios";

const api = axios.create({
  baseURL: "https://byteblitz-backend.onrender.com/api/v1/oauth",
  // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);

export const updateProfile = async (userData) => {
  console.log(userData)
  return await axios.post("/api/v1/user/update-profile", userData);
};

export const deleteUser = async (email) => {
  return await axios.delete(`/api/v1/user/delete?email=${email}`);
};
