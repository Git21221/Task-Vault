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
taskRouter.get("/get-all-tasks", verifyJWT, getAllTasksOfPerson); // role wise get all the task (eg: admin will get all tasks of user and mod, user will get only his tasks, and mod will get all suers tasks).
taskRouter.get(
  "/get-all-tasks-of-user/:userId/:actionType",
  verifyJWT,
  verifyRoleAndPermission,
  getTasksOfUser
); // get all the tasks of a particular user regardless of the role, if the permission is allowed.

export { taskRouter };
