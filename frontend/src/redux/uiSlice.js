import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  theme: {},
  sidebar: false
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
  },
})

export const { showLoader, hideLoader, toggleSidebar } = uiSlice.actions;
export default uiSlice;