import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice.js";
import { getStats, getTodaySchedule } from "../../services/hearingService.js";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

// Fetch the authenticated user's schedule for today.
export const fetchSchedule = createAsyncThunk(
  "hearings/fetchSchedule",
  async (_, { rejectWithValue }) => {
    try {
      return await getTodaySchedule();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load today's schedule."),
      );
    }
  },
);

// Fetch the authenticated user's hearing and pending-case statistics.
export const fetchStats = createAsyncThunk(
  "hearings/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getStats();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load today's statistics."),
      );
    }
  },
);

const initialState = {
  schedule: [],
  stats: null,
  status: "idle",
  error: null,
};

const hearingSlice = createSlice({
  name: "hearings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load today's schedule.";
      })
      .addCase(fetchStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load today's statistics.";
      })
      .addCase(logout, () => initialState);
  },
});

export default hearingSlice.reducer;
