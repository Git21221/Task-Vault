import { Task } from "../models/task.model";
import { apiErrorHandler } from "../utils/apiErrorHandler.util";
import { apiResponse } from "../utils/apiResponse.util";
import { asyncFunctionHandler } from "../utils/asyncFunctionHandler.util";

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
  const userId = req?.user?._id;
  const role = req?.role;
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
  const userId = req?.user?._id;

});
