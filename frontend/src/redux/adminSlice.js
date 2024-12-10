import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  admins: [],
  roles: [],
  admin: {},
  singleUser: {},
  loading: false,
  progress: 0,
  error: null,
};

export const getAllRoles = createAsyncThunk(
  "admin/get-all-roles",
  async ({dispatch}, { rejectWithValue }) => {
    try {
      const result = await apiClient(dispatch, "admin/get-all-roles", "GET");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/update-user-role",
  async ({ dispatch, userId, action, roleId }, { rejectWithValue }) => {
    console.log(userId, action, roleId);
    try {
      const result = await apiClient(
        dispatch,
        `admin/update-role-of-person/${userId}/${action}`,
        "PATCH",
        {
          body: JSON.stringify({ roleId }),
        }
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSingleUser = createAsyncThunk(
  "admin/get-single-user",
  async ({ dispatch, userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        dispatch,
        `users/get-user-profile/${userId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminSignup = createAsyncThunk(
  "admin/admin-signup",
  async ({dispatch, data}, { rejectWithValue }) => {
    try {
      const result = await apiClient(dispatch, "admin/signup", "POST", {
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
        state.progress = 100;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.roles = [];
        state.progress = 100;
      })
      .addCase(adminSignup.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(adminSignup.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action.payload.message;
        }
        state.progress = 100;
      })
      .addCase(adminSignup.rejected, (state, action) => {
        state.error = action.payload.message;
        state.loading = false;
        state.progress = 100;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = 100;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.progress = 100;
      })
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload.data;
        state.progress = 100;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.singleUser = {};
        state.progress = 100;
      });
  },
});

export default adminSlice;
