import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice.js";
import {
  createRojnama as createRojnamaRequest,
  approveRojnama as approveRojnamaRequest,
  getCaseRecords,
  getNeedsCorrection,
  getPendingRojnamas,
  getRojnama,
  resubmitRojnama as resubmitRojnamaRequest,
  sendRemark as sendRemarkRequest,
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

// Load the Rojnama records visible for one case.
export const fetchCaseRecords = createAsyncThunk(
  "rojnama/fetchCaseRecords",
  async (caseId, { rejectWithValue }) => {
    try {
      return await getCaseRecords(caseId);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load case Rojnama records."),
      );
    }
  },
);

// Load submitted Rojnamas waiting for clerk review.
export const fetchPendingRojnamas = createAsyncThunk(
  "rojnama/fetchPendingRojnamas",
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingRojnamas();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load pending Rojnamas."),
      );
    }
  },
);

export const fetchNeedsCorrection = createAsyncThunk(
  "rojnama/fetchNeedsCorrection",
  async (_, { rejectWithValue }) => {
    try {
      return await getNeedsCorrection();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load Rojnamas needing correction."),
      );
    }
  },
);

export const resubmitRojnama = createAsyncThunk(
  "rojnama/resubmitRojnama",
  async (id, { rejectWithValue }) => {
    try {
      return await resubmitRojnamaRequest(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to resubmit the Rojnama."),
      );
    }
  },
);

// Send a clerk correction remark for a submitted Rojnama.
export const sendRemark = createAsyncThunk(
  "rojnama/sendRemark",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      return await sendRemarkRequest(id, text);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to send the remark."),
      );
    }
  },
);

// Approve a submitted Rojnama and add it to the case records.
export const approveRojnama = createAsyncThunk(
  "rojnama/approveRojnama",
  async (id, { rejectWithValue }) => {
    try {
      return await approveRojnamaRequest(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to approve the Rojnama."),
      );
    }
  },
);

const initialState = {
  current: null,
  status: "idle",
  error: null,
  records: [],
  recordsCase: null,
  recordsStatus: "idle",
  recordsError: null,
  pending: [],
  pendingStatus: "idle",
  pendingError: null,
  actionStatus: "idle",
  actionError: null,
  needsCorrection: [],
  needsCorrectionStatus: "idle",
  needsCorrectionError: null,
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
      .addCase(fetchCaseRecords.pending, (state) => {
        state.recordsStatus = "loading";
        state.recordsError = null;
      })
      .addCase(fetchCaseRecords.fulfilled, (state, action) => {
        state.records = action.payload.rojnamas;
        state.recordsCase = action.payload.case;
        state.recordsStatus = "succeeded";
      })
      .addCase(fetchCaseRecords.rejected, (state, action) => {
        state.recordsStatus = "failed";
        state.recordsError =
          action.payload || "Unable to load case Rojnama records.";
      })
      .addCase(fetchPendingRojnamas.pending, (state) => {
        state.pendingStatus = "loading";
        state.pendingError = null;
      })
      .addCase(fetchPendingRojnamas.fulfilled, (state, action) => {
        state.pending = action.payload;
        state.pendingStatus = "succeeded";
      })
      .addCase(fetchPendingRojnamas.rejected, (state, action) => {
        state.pendingStatus = "failed";
        state.pendingError =
          action.payload || "Unable to load pending Rojnamas.";
      })
      .addCase(fetchNeedsCorrection.pending, (state) => {
        state.needsCorrectionStatus = "loading";
        state.needsCorrectionError = null;
      })
      .addCase(fetchNeedsCorrection.fulfilled, (state, action) => {
        state.needsCorrection = action.payload;
        state.needsCorrectionStatus = "succeeded";
      })
      .addCase(fetchNeedsCorrection.rejected, (state, action) => {
        state.needsCorrectionStatus = "failed";
        state.needsCorrectionError =
          action.payload || "Unable to load Rojnamas needing correction.";
      })
      .addCase(resubmitRojnama.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(resubmitRojnama.fulfilled, (state, action) => {
        state.current = action.payload;
        state.actionStatus = "succeeded";
      })
      .addCase(resubmitRojnama.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Unable to resubmit the Rojnama.";
      })
      .addCase(sendRemark.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(sendRemark.fulfilled, (state, action) => {
        state.current = action.payload;
        state.actionStatus = "succeeded";
      })
      .addCase(sendRemark.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Unable to send the remark.";
      })
      .addCase(approveRojnama.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(approveRojnama.fulfilled, (state, action) => {
        state.current = action.payload;
        state.actionStatus = "succeeded";
      })
      .addCase(approveRojnama.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Unable to approve the Rojnama.";
      })
      .addCase(logout, () => initialState);
  },
});

export default rojnamaSlice.reducer;
