import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/oauth",
  // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);

export const updateProfile = async (userData) => {
  return await axios.post("/api/v1/user/update-profile", userData);
};

export const deleteUser = async (email) => {
  return await axios.delete(`/api/v1/user/delete?email=${email}`);
};
