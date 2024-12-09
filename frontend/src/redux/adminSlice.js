import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  admins: [],
  roles: [],
  admin: {},
  singleUser: {},
  loading: false,
  error: null,
};

export const getAllRoles = createAsyncThunk(
  "admin/get-all-roles",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiClient("admin/get-all-roles", "GET");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/update-user-role",
  async ({ userId, action, roleId }, { rejectWithValue }) => {
    console.log(userId, action, roleId);
    try {
      const result = await apiClient(
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
  async ({ userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
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
  async (data, { rejectWithValue }) => {
    try {
      const result = await apiClient("admin/signup", "POST", {
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
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.roles = [];
      })
      .addCase(adminSignup.pending, (state) => {
        state.loading = true;
      }).addCase(adminSignup.fulfilled, (state, action) => {
        state.loading = false;
        if(action.payload.code > 300){
          state.error = action.payload.message;
        }
      }).addCase(adminSignup.rejected, (state, action) => {
        state.error = action.payload.message;
        state.loading = false;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload.data;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.singleUser = {};
      });
  },
});

export default adminSlice;
