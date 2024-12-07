import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  userRole: null,
};

export const userSignin = createAsyncThunk("auth/userSignin", async (data, thunkAPI) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_DEV_SERVER_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

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
    });
    builder.addCase(userSignin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
  }
});

export default authSlice;