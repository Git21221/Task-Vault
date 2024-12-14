import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  theme: {},
  sidebar: false,
  count: 0,
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
    reRender: (state) => {
      state.count = state.count + 1;
    },
  },
})

export const { showLoader, hideLoader, toggleSidebar, reRender } = uiSlice.actions;
export default uiSlice;