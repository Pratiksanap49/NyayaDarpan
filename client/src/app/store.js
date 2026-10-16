import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import hearingReducer from "../features/hearings/hearingSlice.js";
import rojnamaReducer from "../features/rojnama/rojnamaSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hearings: hearingReducer,
    rojnama: rojnamaReducer,
  },
});

export default store;
