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
  async (data, thunkAPI) => {
    try {
      const result = await apiClient("users/login", "POST", {
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userSignin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userSignin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.userRole = action.payload.data.userRole[0].name;
      action.payload.data.userRole[0]
        ? (state.isLoggedIn = true)
        : (state.isLoggedIn = false);
    });
    builder.addCase(userSignin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
  },
});

export default authSlice;
