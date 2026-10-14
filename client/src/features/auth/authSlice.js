import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AUTH_STORAGE_KEYS } from "../../constants/app.js";
import api from "../../services/api.js";
import { loginRequest } from "../../services/authService.js";

const storages = [localStorage, sessionStorage];

const clearAuthStorage = () => {
  for (const storage of storages) {
    storage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    storage.removeItem(AUTH_STORAGE_KEYS.USER);
  }
};

const getStoredAuth = () => {
  for (const storage of storages) {
    const token = storage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const storedUser = storage.getItem(AUTH_STORAGE_KEYS.USER);

    if (!token) {
      continue;
    }

    let user = null;

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        storage.removeItem(AUTH_STORAGE_KEYS.USER);
      }
    }

    return { storage, token, user };
  }

  return { storage: null, token: null, user: null };
};

const storedAuth = getStoredAuth();

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ role, roleId, password, remember }, { rejectWithValue }) => {
    try {
      const data = await loginRequest({ role, roleId, password });
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
      storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));

      return { token: data.token, user: data.user };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Cannot reach the server. Please try again.",
        isNetworkError: !error.response,
      });
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    const currentAuth = getStoredAuth();

    if (!currentAuth.token) {
      return null;
    }

    try {
      const response = await api.get("/auth/me");
      currentAuth.storage.setItem(
        AUTH_STORAGE_KEYS.USER,
        JSON.stringify(response.data),
      );

      return { token: currentAuth.token, user: response.data };
    } catch (error) {
      clearAuthStorage();
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  loading: Boolean(storedAuth.token),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAuthStorage();
      state.user = null;
      state.token = null;
      state.loading = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || {
          message: "Cannot reach the server. Please try again.",
          isNetworkError: true,
        };
      })
      .addCase(restoreSession.pending, (state) => {
        state.loading = Boolean(state.token);
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
        state.loading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
