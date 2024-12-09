import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice";
import { logoutMiddleware } from "../redux/middlewares/logoutMiddleware";
import { loginMiddleware } from "../redux/middlewares/loginMiddleware";
import taskSlice from "../redux/taskSlice";
import userSlice from "../redux/userSlice";
import modSlice from "../redux/modSlice";
import adminSlice from "../redux/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    task: taskSlice.reducer,
    user: userSlice.reducer,
    mod: modSlice.reducer,
    admin: adminSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logoutMiddleware, loginMiddleware),
});
