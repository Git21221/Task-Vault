import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  userRole: null,
  isLoggedIn: false,
};

export const userSignin = createAsyncThunk(
  "auth/userSignin",
  async (data, rejectWithValue) => {
    try {
      const result = apiClient("users/login", "POST", {
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const getCurrentPerson = createAsyncThunk(
  "users/get-user",
  async ({ userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        `users/get-user-profile/${userId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const verifyToken = createAsyncThunk(
  "users/verify-token",
  async (_, { rejectWithValue }) => {
    try {
      const token = apiClient("validate-token", "GET");
      return token;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload.code === 200) {
        state.user = action.payload.data;
        state.isLoggedIn = true;
        state.userRole = action?.payload?.role;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.userRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.userRole = action.payload.role;
        action.payload.data.userRole[0]
          ? (state.isLoggedIn = true)
          : (state.isLoggedIn = false);
      })
      .addCase(userSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.isLoggedIn = false;
      })
      .addCase(getCurrentPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentPerson.fulfilled, (state, action) => {
        if (action.payload.status < 300) {
          state.loading = false;
          state.user = action.payload.data;
          state.userRole = action.payload.role;
          action.payload.data.userRole[0]
            ? (state.isLoggedIn = true)
            : (state.isLoggedIn = false);
        }
      })
      .addCase(getCurrentPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.isLoggedIn = false;
      });
  },
});

export default authSlice;
export const { logout, login } = authSlice.actions;
