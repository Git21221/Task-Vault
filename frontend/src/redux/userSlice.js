import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  user: {},
  loading: false,
  error: null,
  users: [],
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async ({ dispatch }, { rejectWithValue }) => {
    try {
      const result = await apiClient(dispatch, "users/get-all-users", "GET");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ dispatch, userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        dispatch,
        `users/delete-user/${userId}/${action}`,
        "DELETE"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ dispatch, data, userId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        dispatch,
        `users/update-profile/${userId}/${action}`,
        "PUT",
        {
          body: JSON.stringify(data),
        }
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.users = [];
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.data._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { removeUser } = userSlice.actions;
export default userSlice;
