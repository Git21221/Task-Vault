import { Router } from "express";
import { deleteMod, getModProfile, loginModerator, registerModerator, updateModProfile } from "../controller/mod.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

const modRouter = Router();

modRouter.post("/register", registerModerator);
modRouter.post("/login", loginModerator);
modRouter.put("/update-profile-mod/:userId/:actionType", verifyJWT, verifyRoleAndPermission, updateModProfile);
modRouter.delete("/delete-mod/:userId/:actionType", verifyJWT, verifyRoleAndPermission, deleteMod);
modRouter.get("/get-mod-profile/:userId/:actionType", verifyJWT, verifyRoleAndPermission, getModProfile);

export { modRouter };