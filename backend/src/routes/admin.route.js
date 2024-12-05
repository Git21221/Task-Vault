import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controller/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

export { adminRouter };