import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice"; // Adjust the path as needed
import authReducer  from "../store/authStore";

const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer
    },
});

export default store;
