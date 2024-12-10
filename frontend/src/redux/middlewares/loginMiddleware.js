import { login } from "../authSlice";

export const loginMiddleware = (store) => (next) => (action) => {
  if(action.type === "users/get-user/fulfilled" || action.type === "users/verify-token/fulfilled"){
    if(action.payload.code === 200){
      store.dispatch(login(action?.payload));
    }
  }
  return next(action);
};