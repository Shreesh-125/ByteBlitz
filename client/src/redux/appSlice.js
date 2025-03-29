import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false, // Load from localStorage
    loading: false,
    user: JSON.parse(localStorage.getItem("user")) || null, // Load from localStorage
    token: localStorage.getItem("token") || null, // Load token from localStorage
  },
  reducers: {
    // Theme actions
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); // Persist theme state
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload; // Explicitly set theme
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); // Persist theme state
    },

    // User actions
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Persist user data
      localStorage.setItem("token", action.payload.token); // Persist token
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user"); // Clear user from localStorage
      localStorage.removeItem("token"); // Clear token from localStorage
    },

    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setLoading, setUser, logoutUser } =
  appSlice.actions;
export default appSlice.reducer;
export const selectUser = (state) => state.app.user;