import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.util.js";
import { apiResponse } from "../utils/apiResponse.util.js";
import { asyncFunctionHandler } from "../utils/asyncFunctionHandler.util.js";

export const createTask = asyncFunctionHandler(async (req, res) => {
  const { title, description } = req?.body;
  const userId = req?.user?._id;
  if (!title)
    return res.status(400).json(new apiErrorHandler(400, "Title is required"));
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));

  const task = await Task.create({
    title,
    description: description || "",
    status: "created",
    owner: userId,
  });
  if (!task)
    return res.status(500).json(new apiErrorHandler(500, "Task not created"));

  return res.status(201).json(new apiResponse(201, "Task created", task));
});

export const updateTask = asyncFunctionHandler(async (req, res) => {
  const { title, description, status } = req?.body;
  const taskId = req?.params?.taskId;
  const userId = req?.user?._id;
  const role = req?.role;
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
  if (!role)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "You don't have a permission to update task")
      );
  const updatedTask = await Task.findById(taskId);
  if (!updatedTask)
    return res.status(404).json(new apiErrorHandler(404, "Task not found"));

  updatedTask.title = title || updatedTask.title;
  updatedTask.description = description || updatedTask.description;
  updatedTask.status = status || updatedTask.status;
  const savedTask = await updatedTask.save();
  if (!savedTask)
    return res.status(500).json(new apiErrorHandler(500, "Task not updated"));
  return res.status(200).json(new apiResponse(200, "Task updated", savedTask));
});

export const deleteTask = asyncFunctionHandler(async (req, res) => {
  const taskId = req?.params?.taskId;
  const userId = req?.user?._id;
  const role = req?.role;
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
  if (!role)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "You don't have a permission to delete task")
      );
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask)
    return res.status(404).json(new apiErrorHandler(404, "Task not found"));
  return res
    .status(200)
    .json(new apiResponse(200, "Task deleted", deletedTask));
});

export const getTask = asyncFunctionHandler(async (req, res) => {
  const taskId = req?.params?.taskId;
  const requestedPersonTask = req?.params?.userId;
  const userId = req?.user?._id;
  const role = req?.role;
  if (!requestedPersonTask)
    return res.status(400).json(new apiErrorHandler(400, "User not found"));
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
  if (!role)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "You don't have a permission to read task")
      );
  const task = await Task.findById(taskId);
  if (!task)
    return res.status(404).json(new apiErrorHandler(404, "Task not found"));
  const taskWithAggregation = await Task.aggregate([
    {
      $match: { _id: task?._id },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(new apiResponse(200, "Task found", taskWithAggregation));
});

export const getAllTasksOfPerson = asyncFunctionHandler(async (req, res) => {
  const loggedInPersonId = req?.user._id;
  if (!loggedInPersonId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
  const person = await User.aggregate([
    {
      $match: { _id: loggedInPersonId },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
  ]);
  if (!person)
    return res.status(404).json(new apiErrorHandler(404, "Person not found"));
  const roleName = person[0]?.role[0]?.name;
  let allTasksForAdmin, allTasksForModerator, allTasksForUser;
  switch (roleName) {
    case process.env.ADMIN_ROLE:
      allTasksForAdmin = await Task.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
              {
                $lookup: {
                  from: "roles",
                  localField: "role",
                  foreignField: "_id",
                  as: "role",
                },
              },
              {
                $addFields: {
                  role: { $arrayElemAt: ["$role", 0] },
                }
              }
            ],
          },
        },
        {
          $addFields: {
            owner: { $arrayElemAt: ["$owner", 0] },
          },
        },
      ]);

    case process.env.MODERATOR_ROLE:
      allTasksForModerator = await Task.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $addFields: {
            owner: { $arrayElemAt: ["$owner", 0] },
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "owner.role",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $addFields: {
            role: { $arrayElemAt: ["$role", 0] },
          },
        },
        {
          $match: {
            "role.name": { $ne: process.env.ADMIN_ROLE },
          },
        },
      ]);

    case process.env.USER_ROLE:
      allTasksForUser = await Task.aggregate([
        {
          $match: {
            owner: loggedInPersonId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $addFields: {
            owner: { $arrayElemAt: ["$owner", 0] },
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "owner.role",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $addFields: {
            role: { $arrayElemAt: ["$role", 0] },
          },
        },
        {
          $match: {
            $and: [
              {
                "role.name": { $ne: process.env.ADMIN_ROLE },
              },
              {
                "role.name": { $ne: process.env.MODERATOR_ROLE },
              },
            ],
          },
        },
      ]);
  }

  if (roleName === process.env.ADMIN_ROLE)
    return res
      .status(200)
      .json(new apiResponse(200, "All tasks for admin", allTasksForAdmin));
  if (roleName === process.env.MODERATOR_ROLE)
    return res
      .status(200)
      .json(
        new apiResponse(200, "All tasks for moderator", allTasksForModerator)
      );
  if (roleName === process.env.USER_ROLE)
    return res
      .status(200)
      .json(new apiResponse(200, "All tasks for user", allTasksForUser));
  return res
    .status(500)
    .json(new apiErrorHandler(500, "Issue in fetching tasks"));
});

export const getTasksOfUser = asyncFunctionHandler(async (req, res) => {
  const userId = req?.params?.userId;
  const loggedInPersonId = req?.user._id;
  const role = req?.role;
  if (!loggedInPersonId)
    return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
  if (!role)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "You don't have a permission to read tasks")
      );

  const person = await Task.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    }
  ]);
  if (!person)
    return res.status(404).json(new apiErrorHandler(404, "Person not found"));
  return res
    .status(200)
    .json(new apiResponse(200, "Tasks found", person));
});
