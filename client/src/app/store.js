import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
