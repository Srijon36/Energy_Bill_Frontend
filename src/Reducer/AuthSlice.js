import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

// ── LOGIN ────────────────────────────────────
export const login = createAsyncThunk(
  "auth/login",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post("logins/create-login", userInput);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  }
);

// ── REGISTER ─────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post("registers/create-register", userInput);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );
    }
  }
);

// ── SEND OTP ─────────────────────────────────
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("forgot-password/send-otp", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── VERIFY OTP ───────────────────────────────
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await api.post("forgot-password/verify-otp", { email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── RESET PASSWORD ───────────────────────────
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post("forgot-password/reset-password", {
        resetToken,
        newPassword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── SLICE ────────────────────────────────────
const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    user: null,
    token: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("energy_token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;

        sessionStorage.setItem(
          "energy_token",
          JSON.stringify({
            token: payload.token,
            user: payload.user,
          })
        );
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// ✅ EXPORT ACTION FIRST
export const { logout } = AuthSlice.actions;

// ── LOGOUT USER (AFTER logout is defined) ─────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    sessionStorage.removeItem("energy_token");
    dispatch(logout());
  }
);

// ✅ EXPORT REDUCER
export default AuthSlice.reducer;