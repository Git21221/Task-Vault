import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  mod: {},
  mods: [],
  singleMod: {},
  loading: false,
  error: null,
};

export const getAllMods = createAsyncThunk(
  "mod/getAllMods",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiClient("mod/get-all-mods", "GET");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMod = createAsyncThunk(
  "mod/deleteMod",
  async ({ modId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        `mod/delete-mod/${modId}/${action}`,
        "DELETE"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const modSignup = createAsyncThunk(
  "mod/modSignup",
  async (data, { rejectWithValue }) => {
    try {
      const result = await apiClient("mod/signup", "POST", {
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSingleMod = createAsyncThunk(
  "mod/getSingleMod",
  async ({ modId, action }, { rejectWithValue }) => {
    try {
      const result = await apiClient(
        `mod/get-mod-profile/${modId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const modSlice = createSlice({
  name: "mod",
  initialState,
  reducers: {
    removeMod: (state, action) => {
      state.mods = state.mods.filter((mod) => mod._id !== action.payload._id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMods.fulfilled, (state, action) => {
        state.loading = false;
        state.mods = action.payload.data;
      })
      .addCase(getAllMods.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.mods = [];
      })
      .addCase(deleteMod.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMod.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.mods = state.mods.filter(
          (mod) => mod._id !== action.payload.data._id
        );
      })
      .addCase(deleteMod.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getSingleMod.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleMod.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.singleMod = action.payload.data[0];
      })
      .addCase(getSingleMod.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { removeMod } = modSlice.actions;
export default modSlice;
