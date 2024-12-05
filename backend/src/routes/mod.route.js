import { Router } from "express";
import { loginModerator, registerModerator } from "../controller/mod.controller.js";

const modRouter = Router();

modRouter.post("/register", registerModerator);
modRouter.post("/login", loginModerator);

export { modRouter };