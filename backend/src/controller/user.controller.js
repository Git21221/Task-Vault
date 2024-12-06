import mongoose from "mongoose";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.util.js";
import { apiResponse } from "../utils/apiResponse.util.js";
import { asyncFunctionHandler } from "../utils/asyncFunctionHandler.util.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessRefreshToken.util.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/refreshAccessToken.util.js";

//controller for registering a user
export const registerUser = asyncFunctionHandler(async (req, res) => {
  const { fullName, email, password } = req?.body;

  //-----------sanitize inputs------------->
  if (!fullName || !email || !password)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "All fields are required"));
  //-----------sanitization done------------->

  //-----------validate inputs------------->
  //check if password is min 6 length
  if (typeof password !== "string" || password.length < 6)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Password must be atleast 6 characters long")
      );
  //check if password is max 20 length
  if (typeof password !== "string" || password.length > 20)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Password must be atmost 20 characters long")
      );
  //check if email is valid
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return res.status(400).json(new apiErrorHandler(400, "Invalid email"));

  //first name and last name should be string and 50 chars only
  if (typeof fullName !== "string" || fullName.length > 50)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Full name should be string and 50 chars only")
      );
  //-----------validation done------------->

  //create a unique username (randomly generated)
  const username = `${Math.floor(Math.random() * 10000000)}_${Date.now()}`;
  //check if user exists
  //check if email exists
  const existedUserEmail = await User.find({ email }, { new: true });

  if (existedUserEmail.length !== 0) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(400, "Someone already exists with that email id!")
      );
  }
  //check if username exists
  const existedUsername = await User.find({ username }, { new: true });
  if (existedUsername.length !== 0) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(400, "Someone already exists with that username!")
      );
  }
  //hash password
  // const hashedPassword = await bcrypt.hash(password, 10);
  //create user
  //update role for user
  const role = await Role.findOne({ name: process.env.USER_ROLE });
  if (!role) {
    return res
      .status(500)
      .json(
        new apiErrorHandler(
          500,
          "Role not found for some unknown internal reason!"
        )
      );
  }
  // user has no permissions initially
  const user = await User.create({
    fullName,
    email,
    password,
    username,
    role: role._id,
    persissions: [],
  });
  //check if user is created successfully
  if (!user)
    return res
      .status(500)
      .json(
        new apiErrorHandler(
          500,
          "User not created for some unknown internal reason!"
        )
      );
  //send response
  return res
    .status(201)
    .json(new apiResponse(201, "User created successfully", user));
});

//controller for login a user
export const loginUser = asyncFunctionHandler(async (req, res) => {
  const { email, password } = req?.body;
  //-----------sanitize inputs------------->
  if (!email || !password)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "All fields are required"));
  //-----------sanitization done------------->
  //-----------validate inputs------------->
  //check if password is min 6 length
  if (typeof password !== "string" || password.length < 6)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Password must be atleast 6 characters long")
      );
  //check if password is max 20 length
  if (typeof password !== "string" || password.length > 20)
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Password must be atmost 20 characters long")
      );
  const user = await User.findOne({
    email,
  });

  if (!user)
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "User not found with that username or email")
      );
  //check if password matches
  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched)
    return res.status(401).json(new apiErrorHandler(401, "Invalid password"));
  //generate access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select("-password -_id"); //remove password and refresh token from response
  //send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new apiResponse(200, "User logged in successfully", loggedInUser));
});

//controller to update a user
export const updateUserProfile = asyncFunctionHandler(async (req, res) => {
  const { fullName, email, password, username } = req?.body;
  const { userId } = req?.params;
  const loggedInUserId = req?.user?._id;
  const role = req?.role;
  if (!loggedInUserId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));

  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have permission to update admin profile"
        )
      );

  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json(new apiErrorHandler(404, "User not found"));
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (password) user.password = password;
  if (username) user.username = username;
  const userAfterSave = await user.save();
  if (!userAfterSave)
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "User not updated for some unknown reason")
      );
  return res
    .status(200)
    .json(new apiResponse(200, "User updated successfully", user));
});

//controller to delete a user
export const deleteUser = asyncFunctionHandler(async (req, res) => {
  const loggedInUserId = req?.user?._id;
  if (!loggedInUserId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  const { userId } = req?.params;
  const role = req?.role;
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have permission to delete user profile"
        )
      );
  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json(new apiErrorHandler(404, "User not found"));
  const deletedUser = await user.deleteOne();
  if (!deletedUser)
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "User not deleted for some unknown reason")
      );
  return res
    .status(200)
    .json(new apiResponse(200, "User deleted successfully", user));
});

export const getUserProfile = asyncFunctionHandler(async (req, res) => {
  const { userId } = req?.params;
  const loggedInUserId = req?.user?._id;
  const role = req?.role;
  if (!loggedInUserId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have permission to get user profile"
        )
      );

  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));

  const userFullProfile = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "userRole",
      },
    },
    {
      $lookup: {
        from: "permissions",
        localField: "permissions",
        foreignField: "_id",
        as: "permissions",
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);
  if (!userFullProfile)
    return res.status(404).json(new apiErrorHandler(404, "User not found"));
  return res
    .status(200)
    .json(new apiResponse(200, "User profile", userFullProfile));
});

export const getAllUsers = asyncFunctionHandler(async (req, res) => {
  const loggedInUserId = req?.user?._id;
  if (!loggedInUserId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  const roleOfLoggedInUser = await User.aggregate([
    {
      $match: {
        _id: loggedInUserId,
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
  ]);

  const users = await User.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "updatedRoles",
      },
    },
    {
      $lookup: {
        from: "permissions",
        localField: "permissions",
        foreignField: "_id",
        as: "permissions",
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $gt: [{ $size: "$updatedRoles" }, 0] }, // Ensure updatedRoles[0] exists
            { $eq: [{ $arrayElemAt: ["$updatedRoles.name", 0] }, "user"] },
          ],
        },
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);
  if (!users)
    return res.status(404).json(new apiErrorHandler(404, "Users not found"));
  const roleName = roleOfLoggedInUser[0]?.role[0]?.name;
  if (
    roleName === process.env.ADMIN_ROLE ||
    roleName === process.env.MODERATOR_ROLE
  ) {
    return res.status(200).json(new apiResponse(200, "All Users", users));
  }
  return res.status(401).json(new apiErrorHandler(401, "You don't have permission to get all users"));
});

