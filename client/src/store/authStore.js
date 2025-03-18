import { configureStore, createSlice } from "@reduxjs/toolkit";

// Retrieve User & Token from LocalStorage
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

// Decode JWT & Check Expiry
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return decoded.exp * 1000 > Date.now(); // Check if token is expired
  } catch (error) {
    return false;
  }
};

// Initial State
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: isTokenValid(storedToken) ? storedToken : null,
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Export Actions
export const { loginSuccess, logout } = authSlice.actions;

// Create Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// Custom Hook for Dispatch
export const useAppDispatch = () => store.dispatch;
