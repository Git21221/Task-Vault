import { Role } from "../models/role.model.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.util.js";
import { apiResponse } from "../utils/apiResponse.util.js";
import { asyncFunctionHandler } from "../utils/asyncFunctionHandler.util.js";
import { User } from "../models/user.model.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/refreshAccessToken.util.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessRefreshToken.util.js";
import mongoose from "mongoose";

//controller for registering an moderator
export const registerModerator = asyncFunctionHandler(async (req, res) => {
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

  //create a unique modname (randomly generated)
  const username = `${Math.floor(Math.random() * 1000000)}_${Date.now()}`;
  //check if mod exists
  //check if email exists
  const existedmodEmail = await User.find({ email }, { new: true });

  if (existedmodEmail.length !== 0) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "Someone already exists with that email id!")
      );
  }
  //check if modname exists
  const existedmodname = await User.find({ username }, { new: true });
  if (existedmodname.length !== 0) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "Someone already exists with that username!")
      );
  }
  //hash password
  // const hashedPassword = await bcrypt.hash(password, 10);
  //create moderator
  //update role for moderator
  const role = await Role.findOne({ name: process.env.MODERATOR_ROLE });
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
  const per = await Role.find({
    name: {
      $in: [process.env.MODERATOR_ROLE],
    },
  });
  //add moderator permissions
  const permissions = per[0].permissions;

  const moderator = await User.create({
    fullName,
    email,
    password,
    username,
    role: role._id,
    permissions,
  });
  //check if moderator is created successfully
  if (!moderator)
    return res
      .status(500)
      .json(
        new apiErrorHandler(
          500,
          "Moderator not created for some unknown internal reason!"
        )
      );
  //send response
  return res
    .status(201)
    .json(new apiResponse(201, "Moderator created successfully", moderator));
});

//controller for login a mod
export const loginModerator = asyncFunctionHandler(async (req, res) => {
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
  const mod = await User.findOne({
    email,
  });

  if (!mod)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "Moderator not found with that modname or email"
        )
      );
  //check if password matches
  const isPasswordMatched = await mod.isPasswordCorrect(password);
  if (!isPasswordMatched)
    return res.status(401).json(new apiErrorHandler(401, "Invalid password"));
  //generate access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    mod._id
  );
  const loggedInmod = await User.findById(mod._id).select("-password -_id"); //remove password and refresh token from response
  //send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
      new apiResponse(200, "Moderator logged in successfully", loggedInmod)
    );
});

//controller to update a mod
export const updateModProfile = asyncFunctionHandler(async (req, res) => {
  const { fullName, email, password, username } = req?.body;
  const userId = req?.params?.userId;
  const loggedInModId = req?.user?._id;
  const role = req?.role;
  if (!loggedInModId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to update moderator profile"
        )
      );
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "User id not found"));

  const mod = await User.findById(userId);
  if (!mod)
    return res
      .status(404)
      .json(new apiErrorHandler(404, "Moderator not found"));
  if (fullName) mod.fullName = fullName;
  if (email) mod.email = email;
  if (password) mod.password = password;
  if (username) mod.username = username;
  const modAfterSave = await mod.save();
  if (!modAfterSave)
    return res
      .status(500)
      .json(new apiErrorHandler(500, "Issue in updating moderator profile"));
  return res.status(200).json(new apiResponse(200, "Moderator updated", mod));
});

export const deleteMod = asyncFunctionHandler(async (req, res) => {
  const loggedInModId = req?.user?._id;
  const role = req?.role;
  const { userId } = req?.params;
  if (!loggedInModId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to delete moderator"
        )
      );
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "User id not found"));

  const mod = await User.findById(userId);
  if (!mod)
    return res
      .status(404)
      .json(new apiErrorHandler(404, "Moderator not found"));
  const modAfterDelete = await mod.deleteOne();
  if (!modAfterDelete.acknowledged || modAfterDelete.deletedCount !== 1)
    return res
      .status(500)
      .json(new apiErrorHandler(500, "Issue in deleting moderator"));
  return res.status(200).json(new apiResponse(200, "Moderator deleted", mod));
});

export const getModProfile = asyncFunctionHandler(async (req, res) => {
  const { userId } = req?.params;
  const loggedInModId = req?.user?._id;
  const role = req?.role;
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to get moderator profile"
        )
      );
  if (!loggedInModId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!userId)
    return res.status(400).json(new apiErrorHandler(400, "User id not found"));
  const modFullProfile = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "modRole",
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
  if (!modFullProfile)
    return res
      .status(500)
      .json(new apiErrorHandler(500, "Issue in aggregating moderator profile"));
  return res
    .status(200)
    .json(new apiResponse(200, "Moderator profile", modFullProfile));
});

export const getAllMods = asyncFunctionHandler(async (req, res) => {
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
            {
              $eq: [
                { $arrayElemAt: ["$updatedRoles.name", 0] },
                process.env.MODERATOR_ROLE,
              ],
            },
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
    return res
      .status(404)
      .json(new apiErrorHandler(404, "Moderator not found"));
  const roleName = roleOfLoggedInUser[0]?.role[0]?.name;
  if (roleName === process.env.ADMIN_ROLE) {
    return res.status(200).json(new apiResponse(200, "All Moderators", users));
  }
  return res
    .status(401)
    .json(
      new apiErrorHandler(401, "You don't have permission to get all mods")
    );
});
