import { Router } from "express";
import {deleteUser, loginUser, registerUser, updateProfile} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

export const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/update-profile/:userId/:profile_action_update", verifyJWT, verifyRoleAndPermission, updateProfile);
userRouter.delete("/delete-user/:userId", deleteUser);