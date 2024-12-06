import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

export const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put(
  "/update-profile/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  updateUserProfile
);
userRouter.delete("/delete-user/:userId/:actionType", deleteUser);
userRouter.get(
  "/get-user-profile/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  getUserProfile
);
userRouter.get("/get-all-users", verifyJWT, getAllUsers);
