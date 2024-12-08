import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice";
import { logoutMiddleware } from "../redux/middlewares/logoutMiddleware";
import { loginMiddleware } from "../redux/middlewares/loginMiddleware";
import taskSlice from "../redux/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    task: taskSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logoutMiddleware, loginMiddleware),
});
