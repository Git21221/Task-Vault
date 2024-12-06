import { Router } from "express";
import {
  deleteAdmin,
  getAdminProfile,
  getAllPermissionsByRole,
  loginAdmin,
  registerAdmin,
  updateAdminProfile,
  updateModeratorRoleByAdmin,
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

const adminRouter = Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.put(
  "/update-profile-admin/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  updateAdminProfile
);
adminRouter.delete(
  "/delete-admin/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  deleteAdmin
);
adminRouter.get(
  "/get-admin-profile/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  getAdminProfile
);

//can be accessed by admin, moderator and users
adminRouter.get("/get-all-permissions", verifyJWT, getAllPermissionsByRole);
adminRouter.put("/update-permissions-of-role", verifyJWT, updateModeratorRoleByAdmin);
export { adminRouter };
