import { Router } from "express";
import { deleteMod, getAllMods, getModProfile, loginModerator, registerModerator, updateModProfile } from "../controller/mod.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

const modRouter = Router();

modRouter.post("/signup", registerModerator);
modRouter.post("/login", loginModerator);
modRouter.put("/update-profile-mod/:userId/:actionType", verifyJWT, verifyRoleAndPermission, updateModProfile);
modRouter.delete("/delete-mod/:userId/:actionType", verifyJWT, verifyRoleAndPermission, deleteMod);
modRouter.get("/get-mod-profile/:userId/:actionType", verifyJWT, verifyRoleAndPermission, getModProfile);
modRouter.get("/get-all-mods", verifyJWT, getAllMods);
export { modRouter };