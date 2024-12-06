import express from "express";
import "dotenv/config";
import cors from "cors";
import { userRouter } from "./routes/user.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { modRouter } from "./routes/mod.route.js";
import cookieParser from "cookie-parser";
import { taskRouter } from "./routes/task.route.js";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<center><h1>Hello World!</h1></center>");
});

app.use("/api/v1/users", userRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/mod", modRouter);

app.use("/api/v1/tasks", taskRouter);