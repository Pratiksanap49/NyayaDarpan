import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import hearingReducer from "../features/hearings/hearingSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hearings: hearingReducer,
  },
});

export default store;
