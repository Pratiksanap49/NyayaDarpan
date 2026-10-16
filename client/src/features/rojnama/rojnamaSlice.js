import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice.js";
import {
  createRojnama as createRojnamaRequest,
  getRojnama,
  submitRojnama as submitRojnamaRequest,
  updateRojnama,
} from "../../services/rojnamaService.js";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

// Create a new draft Rojnama for a hearing.
export const createDraft = createAsyncThunk(
  "rojnama/createDraft",
  async (data, { rejectWithValue }) => {
    try {
      return await createRojnamaRequest(data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to create the Rojnama draft."),
      );
    }
  },
);

// Load one Rojnama for the form.
export const fetchRojnama = createAsyncThunk(
  "rojnama/fetchRojnama",
  async (id, { rejectWithValue }) => {
    try {
      return await getRojnama(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load the Rojnama."),
      );
    }
  },
);

// Save editable Rojnama fields without changing its status.
export const saveDraft = createAsyncThunk(
  "rojnama/saveDraft",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateRojnama(id, data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to save the Rojnama draft."),
      );
    }
  },
);

// Submit a completed draft to the clerk.
export const submitRojnama = createAsyncThunk(
  "rojnama/submitRojnama",
  async (id, { rejectWithValue }) => {
    try {
      return await submitRojnamaRequest(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to submit the Rojnama."),
      );
    }
  },
);

const initialState = {
  current: null,
  status: "idle",
  error: null,
};

const rojnamaSlice = createSlice({
  name: "rojnama",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDraft.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "succeeded";
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to create the Rojnama draft.";
      })
      .addCase(fetchRojnama.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRojnama.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRojnama.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load the Rojnama.";
      })
      .addCase(saveDraft.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "succeeded";
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to save the Rojnama draft.";
      })
      .addCase(submitRojnama.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitRojnama.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "succeeded";
      })
      .addCase(submitRojnama.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to submit the Rojnama.";
      })
      .addCase(logout, () => initialState);
  },
});

export default rojnamaSlice.reducer;
