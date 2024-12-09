import { Router } from "express";
import {
  deleteAdmin,
  getAdminProfile,
  getAllPermissionsByRole,
  getAllRoles,
  loginAdmin,
  promoteAndDemotePersonRoleByAdmin,
  registerAdmin,
  updateAdminProfile,
  updateModeratorPermissionByAdmin,
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

const adminRouter = Router();

adminRouter.post("/signup", registerAdmin);
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
adminRouter.put(
  "/update-permissions-of-role",
  verifyJWT,
  updateModeratorPermissionByAdmin
);
adminRouter.patch(
  "/update-role-of-person/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  promoteAndDemotePersonRoleByAdmin
);
adminRouter.get("/get-all-roles", verifyJWT, getAllRoles);
export { adminRouter };
