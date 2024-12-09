import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasksOfPerson,
  getTask,
  getTasksOfUser,
  updateTask,
} from "../controller/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyRoleAndPermission } from "../middleware/role.middleware.js";

const taskRouter = Router();

taskRouter.post("/create-task", verifyJWT, createTask);
taskRouter.put(
  "/update-task/:taskId/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  updateTask
);
taskRouter.delete(
  "/delete-task/:taskId/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  deleteTask
);
taskRouter.get(
  "/get-task/:taskId/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  getTask
);
taskRouter.get("/get-all-tasks", verifyJWT, getAllTasksOfPerson);
taskRouter.get(
  "/get-all-tasks-of-user/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  getTasksOfUser
);

export { taskRouter };
