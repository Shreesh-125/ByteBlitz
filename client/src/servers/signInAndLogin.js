import axios from "axios";

const API_URL = "https://byteblitz-backend.onrender.com/api/v1/user";

// Signup API
export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// Login API
export const login = async (userData) => {
  console.log(userData);
  const response = await axios.post(`${API_URL}/login`, userData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};
