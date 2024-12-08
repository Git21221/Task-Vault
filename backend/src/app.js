import express from "express";
import "dotenv/config";
import cors from "cors";
import { userRouter } from "./routes/user.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { modRouter } from "./routes/mod.route.js";
import cookieParser from "cookie-parser";
import { taskRouter } from "./routes/task.route.js";
import { validateAccessToken } from "./controller/user.controller.js";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.DEVELOPMENT_ENVIRONMENT === "true"
        ? process.env.DEV_CORS_ORIGIN
        : process.env.PROD_CORS_ORIGIN,
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

app.get("/api/v1/validate-token", validateAccessToken);
