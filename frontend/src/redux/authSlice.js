import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";
import Cookies from "js-cookie";

const initialState = {
  user: {},
  token: null,
  loading: false,
  error: null,
  userRole: null,
  isLoggedIn: false,
};

export const userSignin = createAsyncThunk(
  "auth/userSignin",
  async ({ dispatch, data }, { rejectWithValue }) => {
    try {
      const result = apiClient(dispatch, "users/login", "POST", {
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const userSignup = createAsyncThunk(
  "auth/userSignup",
  async ({ dispatch, data }, { rejectWithValue }) => {
    try {
      const result = apiClient(dispatch, "users/signup", "POST", {
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
  async ({ dispatch, userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        dispatch,
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
  async ({ dispatch }, { rejectWithValue }) => {
    try {
      const token = await apiClient(dispatch, "validate-token", "GET");
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
      Cookies.remove("accessToken");
    },
    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        fullName: action.payload.data.fullName,
        email: action.payload.data.email,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        if (action.payload.code < 300) {
          state.loading = false;
          state.user = action.payload.data;
          state.userRole = action.payload.role;
          action.payload.data.userRole[0]
            ? (state.isLoggedIn = true)
            : (state.isLoggedIn = false);
        } else {
          state.loading = false;
          state.isLoggedIn = false;
          state.error = action.payload.error.message;
        }
      })
      .addCase(userSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
        state.isLoggedIn = false;
      })
      .addCase(userSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        if (action.payload.code > 300) {
          state.loading = false;
          state.error = action.payload.error.message;
        }
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
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code < 300) {
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload.error;
      });
  },
});

export default authSlice;
export const { logout, login, updateProfile } = authSlice.actions;
