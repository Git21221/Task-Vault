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
import { Permission } from "../models/permission.model.js";

//controller for registering an admin
export const registerAdmin = asyncFunctionHandler(async (req, res) => {
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
  const username = `${Math.floor(Math.random() * 1000000)}_${Date.now()}`;
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
  //create Admin
  //update role for admin
  const role = await Role.findOne({ name: process.env.ADMIN_ROLE });
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

  //admin has persmissions to do everything except task update, task create, profile create, profile update

  const per = await Role.find({
    name: {
      $in: [process.env.ADMIN_ROLE],
    },
  });
  const permissions = per[0].permissions;
  const admin = await User.create({
    fullName,
    email,
    password,
    username,
    role: role._id,
    permissions,
  });
  //check if admin is created successfully
  if (!admin)
    return res
      .status(500)
      .json(
        new apiErrorHandler(
          500,
          "Admin not created for some unknown internal reason!"
        )
      );
  //send response
  return res
    .status(201)
    .json(new apiResponse(201, "Admin created successfully", admin));
});

//controller for login a admin
export const loginAdmin = asyncFunctionHandler(async (req, res) => {
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
  const admin = await User.findOne({
    email,
  });

  if (!admin)
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "Admin not found with that username or email")
      );
  //check if password matches
  const isPasswordMatched = await admin.isPasswordCorrect(password);
  if (!isPasswordMatched)
    return res.status(401).json(new apiErrorHandler(401, "Invalid password"));
  //generate access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );
  const loggedInAdmin = await User.findById(admin._id).select("-password -_id"); //remove password and refresh token from response
  //send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new apiResponse(200, "Admin logged in successfully", loggedInAdmin));
});

//controller for updating admin profile
export const updateAdminProfile = asyncFunctionHandler(async (req, res) => {
  const { fullName, email, password, username } = req?.body;
  const { userId } = req?.params;
  const loggedInAdminId = req?.user?._id;
  const role = req?.role;
  //-----------sanitize inputs------------->
  if (!loggedInAdminId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to update admin profile"
        )
      );
  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));
  const admin = await User.findById(userId);
  if (!admin)
    return res.status(404).json(new apiErrorHandler(404, "Admin not found"));
  if (fullName) admin.fullName = fullName;
  if (email) admin.email = email;
  if (password) admin.password = password;
  if (username) admin.username = username;
  const adminAfterSave = await admin.save();
  if (!adminAfterSave)
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "Admin not updated for some unknown reason")
      );
  return res
    .status(200)
    .json(new apiResponse(200, "Admin updated successfully", admin));
});

//delete admin
export const deleteAdmin = asyncFunctionHandler(async (req, res) => {
  const { userId } = req?.params;
  const role = req?.role;
  const loggedInAdminId = req?.user?._id;
  if (!loggedInAdminId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role)
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to delete an admin"
        )
      );
  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));
  const admin = await User.findById(userId);
  if (!admin)
    return res.status(404).json(new apiErrorHandler(404, "Admin not found"));
  const deleteAdmin = await admin.deleteOne();
  if (!deleteAdmin)
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "Admin not deleted for some unknown reason")
      );
  return res
    .status(200)
    .json(new apiResponse(200, "Admin deleted successfully"));
});

//controller for getting admin profile
export const getAdminProfile = asyncFunctionHandler(async (req, res) => {
  const { userId } = req?.params;
  const loggedInAdminId = req?.user?._id;
  const role = req?.role;
  if (!loggedInAdminId)
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  if (!role) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(
          401,
          "You don't have the permission to get admin profile"
        )
      );
  }
  if (!userId)
    return res
      .status(400)
      .json(new apiErrorHandler(400, "User id is required"));

  const adminFullProfile = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "adminRole",
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
  if (!adminFullProfile)
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "Admin not found for some unknown reason")
      );

  return res
    .status(200)
    .json(new apiResponse(200, "Admin found", adminFullProfile));
});

//controller for getting all permissions by role regardless of the role of the logged in user
export const getAllPermissionsByRole = asyncFunctionHandler(
  async (req, res) => {
    const loggedInAdminId = req?.user?._id;
    const admin = await User.aggregate([
      {
        $match: {
          _id: loggedInAdminId,
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
    const roleName = admin[0]?.role[0]?.name;
    let allPersmissionsByRoleForAdmin,
      allPersmissionsByRoleForModerator,
      allPermissionsByRoleForUser;
    switch (roleName) {
      case process.env.ADMIN_ROLE:
        allPersmissionsByRoleForAdmin = await Role.aggregate([
          {
            $lookup: {
              from: "permissions",
              localField: "permissions",
              foreignField: "_id",
              as: "permissions",
            },
          },
        ]);
        break;
      case process.env.MODERATOR_ROLE:
        allPersmissionsByRoleForModerator = await Role.aggregate([
          {
            $match: {
              name: { $ne: process.env.ADMIN_ROLE },
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
        ]);
        break;
      case process.env.USER_ROLE:
        allPermissionsByRoleForUser = await Role.aggregate([
          {
            $match: {
              $and: [
                { name: { $ne: process.env.ADMIN_ROLE } },
                { name: { $ne: process.env.MODERATOR_ROLE } },
              ],
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
        ]);
        break;
    }

    if (roleName === process.env.ADMIN_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Permissions found",
            allPersmissionsByRoleForAdmin
          )
        );
    if (roleName === process.env.MODERATOR_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Permissions found",
            allPersmissionsByRoleForModerator
          )
        );
    if (roleName === process.env.USER_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(200, "Permissions found", allPermissionsByRoleForUser)
        );

    return res
      .status(500)
      .json(new apiErrorHandler(500, "Permissions not found"));
  }
);

export const getAllPermissions = asyncFunctionHandler(async (req, res) => {
  const loggedInAdminId = req?.user?._id;
  const admin = await User.aggregate([
    {
      $match: {
        _id: loggedInAdminId,
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
  const roleName = admin[0]?.role[0]?.name;
  if (roleName === process.env.ADMIN_ROLE) {
    const allPermissions = await Permission.aggregate([
      {
        $project: {
          task: 1,
          profile: 1,
          role: 1,
        },
      },
    ]);
    if (!allPermissions)
      return res
        .status(500)
        .json(
          new apiErrorHandler(
            500,
            "Permissions not found for some unknown reason"
          )
        );
    return res
      .status(200)
      .json(new apiResponse(200, "Permissions found", allPermissions));
  }
});

//only moderator role permissions will be updated by admin
export const updateModeratorPermissionByAdmin = asyncFunctionHandler(
  async (req, res) => {
    const loggedInAdminId = req?.user?._id;
    const admin = await User.aggregate([
      {
        $match: {
          _id: loggedInAdminId,
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
        $lookup: {
          from: "permissions",
          localField: "permissions",
          foreignField: "_id",
          as: "permissions",
        },
      },
    ]);
    const roleName = admin[0]?.role[0]?.name;

    if (roleName === process.env.ADMIN_ROLE) {
      const { roleId, permissions } = req?.body;
      if (permissions.length === 0)
        return res
          .status(400)
          .json(
            new apiErrorHandler(400, "Permissions are required to update role")
          );
      const role = await Role.findById(new mongoose.Types.ObjectId(roleId)); //also findByIdAndUpdate can be used
      if (!role)
        return res.status(404).json(new apiErrorHandler(404, "Role not found"));
      //only moderator can be updated by admin
      if (role.name === process.env.MODERATOR_ROLE) {
        const adminPermissions = admin[0]?.permissions.map((perm) =>
          perm._id.toString()
        );

        role.permissions = permissions
          .filter((permission) => adminPermissions.includes(permission)) // Only keep valid permissions
          .map((permission) => new mongoose.Types.ObjectId(permission)); // Convert to ObjectId //in frontend permissions initial array should contain the initial permissions
        let updatedRole = await role.save();
        if (!updatedRole)
          return res
            .status(500)
            .json(
              new apiErrorHandler(
                500,
                "Role not updated for some unknown reason"
              )
            );
            updatedRole = await Role.aggregate([
              {
                $match: { _id: new mongoose.Types.ObjectId(roleId) },
              },
              {
                $lookup: {
                  from: "permissions",
                  localField: "permissions",
                  foreignField: "_id",
                  as: "permissions",
                },
              },
            ])
        return res.status(200).json(new apiResponse(200, "Role updated", updatedRole));
      }
    }
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "You don't have the permission to update role")
      );
  }
);

//controller for promoting or demoting a person role with permissisons by admin
export const promoteAndDemotePersonRoleByAdmin = asyncFunctionHandler(
  async (req, res) => {
    const { userId } = req?.params;
    const loggedInAdminId = req?.user?._id;
    const role = req?.role;
    const { roleId } = req?.body; // the role to which the user is to be promoted or demoted
    if (!loggedInAdminId)
      return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
    if (!role)
      return res
        .status(401)
        .json(
          new apiErrorHandler(
            401,
            "You don't have the permission to promote a user"
          )
        );
    if (!userId)
      return res
        .status(400)
        .json(new apiErrorHandler(400, "User id is required"));
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user)
      return res.status(404).json(new apiErrorHandler(404, "User not found"));
    const userRoleAggregation = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
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
    if (!userRoleAggregation)
      return res
        .status(500)
        .json(
          new apiErrorHandler(
            500,
            "User role not found in promoteAPersonRoleByAdmin"
          )
        );
    const userRole = userRoleAggregation[0]?.role[0]?.name;
    if (userRole === process.env.ADMIN_ROLE)
      return res
        .status(400)
        .json(new apiErrorHandler(400, "Admin cannot be promoted or demoted"));

    const RoleTobeUpdated = await Role.findById(
      new mongoose.Types.ObjectId(roleId)
    );
    if (!RoleTobeUpdated)
      return res.status(404).json(new apiErrorHandler(404, "Role not found"));
    if (userRole === RoleTobeUpdated.name)
      return res
        .status(400)
        .json(
          new apiErrorHandler(
            400,
            "User is already in the same role. No need to update"
          )
        );
    user.role = new mongoose.Types.ObjectId(roleId); //user role updated
    user.permissions = RoleTobeUpdated.permissions; //user permissions updated
    const userAfterSave = await user.save();
    if (!userAfterSave)
      return res
        .status(500)
        .json(
          new apiErrorHandler(500, "User not updated for some unknown reason")
        );
    return res
      .status(200)
      .json(new apiResponse(200, "User role updated", user));
  }
);

export const getAllRoles = asyncFunctionHandler(async (req, res) => {
  const loggedInAdminId = req?.user?._id;
  const admin = await User.aggregate([
    {
      $match: {
        _id: loggedInAdminId,
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
  const roleName = admin[0]?.role[0]?.name;
  if (roleName === process.env.ADMIN_ROLE) {
    const allRoles = await Role.find({});
    if (!allRoles)
      return res
        .status(500)
        .json(
          new apiErrorHandler(500, "Roles not found for some unknown reason")
        );
    return res.status(200).json(new apiResponse(200, "Roles found", allRoles));
  }
  return res
    .status(401)
    .json(
      new apiErrorHandler(401, "You don't have the permission to get all roles")
    );
});
