import axios from "axios";

const API_URL = "http://localhost:5000";

// 🔹 Axios Instance with Auth Token
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 🔹 Sign-up API
export const signup = async (userData) => {
  return axiosInstance.post("/signup", userData);
};

// 🔹 Login API
export const login = async (userData) => {
  return axiosInstance.post("/login", userData);
};

// 🔹 Fetch Protected Data
export const getProtectedData = async () => {
  return axiosInstance.get("/protected");
};
