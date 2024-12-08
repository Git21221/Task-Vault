import { logout } from "../authSlice";

export const logoutMiddleware = (store) => (next) => (action) => {
  if (action?.payload?.code === 403 || action?.payload?.code === 401 || action?.type === "users/get-user/rejected") {
    store.dispatch(logout());
  }
  return next(action);
};
