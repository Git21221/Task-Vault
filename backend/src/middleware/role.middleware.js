import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.util.js";
import { asyncFunctionHandler } from "../utils/asyncFunctionHandler.util.js";

export const verifyRoleAndPermission = asyncFunctionHandler(
  async (req, res, next) => {
    try {
      //take id from the user object stored in req,
      //take id from params
      //now check if the id from req.user is in the order admin -> mod -> user and id from params is in the order user -> mod -> admin
      //now admin/mod/user can do all the things that have a permission

      // <------------ check loggedin person ------------>
      const loggedInPerson = req?.user?._id;

      const action = req?.params?.actionType;

      if (!action)
        return res
          .status(400)
          .json(new apiErrorHandler(400, "Action not found"));
      const decodedActionType = action?.split("_")[0]; //profile, task, role

      const decodedAction = `${action?.split("_")[1]}:${action?.split("_")[2]}`; //update, delete, read
      if (!loggedInPerson)
        return res
          .status(401)
          .json(
            new apiErrorHandler(401, "Unauthorized in role middleware line 23")
          );
      const user = await User.findById(loggedInPerson);

      if (!user)
        return res.status(404).json(new apiErrorHandler(404, "User not found"));

      // <------------ check role of loggedin Person------------>
      const userWithRole = await User.aggregate([
        {
          $match: { _id: user?._id },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "userRole",
          },
        },
      ]);

      if (!userWithRole)
        return res
          .status(500)
          .json(
            new apiErrorHandler(500, "Issue in aggregating user with role")
          );

      //loggedin
      const userWithRoleName = userWithRole[0]?.userRole[0]?.name;

      //now I have role of loggedin person, let's check if he is higher than req.params or not
      // <------------ check role of the requested person ------------>
      const requestedPersonRole = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req?.params?.userId) },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "userRole",
          },
        },
      ]);

      if (!requestedPersonRole) {
        return res
          .status(500)
          .json(
            new apiErrorHandler(
              500,
              "Issue in aggregating requested person with role"
            )
          );
      }
      const requestedPersonRoleName = requestedPersonRole[0].userRole[0].name;
      console.log("requestedPersonRoleName", requestedPersonRoleName);

      switch (userWithRoleName) {
        case process.env.ADMIN_ROLE:
          //check if requested person role name is "admin", if so then check only himself can change it's own things, not others

          if (userWithRoleName === requestedPersonRoleName) {
            if (loggedInPerson.toString() === req.params.userId) {
              req.role = userWithRole[0];
            } else {
              req.role = null;
            }
          }

          //check if requested person role name is "moderator" or "user", if so then check the loggedin person persmissions

          if (
            requestedPersonRoleName === process.env.MODERATOR_ROLE ||
            requestedPersonRoleName === process.env.USER_ROLE
          ) {
            //now check for the permissions on the loggedin person, not the role
            const adminPermissions = await User.aggregate([
              {
                $match: { _id: loggedInPerson },
              },
              {
                $lookup: {
                  from: "permissions",
                  localField: "permissions",
                  foreignField: "_id",
                  as: "userPermissions",
                },
              },
            ]);
            // console.log("adminPermissions", adminPermissions[0]);
            //check for permissions
            let flag = true;
            adminPermissions[0]?.userPermissions?.forEach((permission) => {
              if (flag === true) {
                if (Object.keys(permission).includes(decodedActionType)) {
                  if (permission[decodedActionType].includes(decodedAction)) {
                    req.role = userWithRole[0];
                    flag = false;
                    console.log(permission[decodedActionType]);
                  } else {
                    req.role = null;
                  }
                } else {
                  req.role = null;
                }
              }
            });
          }

          break;

        case process.env.MODERATOR_ROLE:
          //check if requested person role name is "admin", if so then just deny the request
          if (requestedPersonRoleName === process.env.ADMIN_ROLE) {
            req.role = null;
          }
          //check if requested person role name is "moderator", if so then check the only himself can change his own things
          if (userWithRoleName === requestedPersonRoleName) {
            if (loggedInPerson.toString() === req.params.userId) {
              req.role = userWithRole[0];
            } else {
              req.role = null;
            }
          }

          //check if requested person role name is "user", if so then check the loggedin person persmissions

          if (requestedPersonRoleName === process.env.USER_ROLE) {
            //now check for the permissions on the loggedin person, not the role
            const adminPermissions = await User.aggregate([
              {
                $match: { _id: loggedInPerson },
              },
              {
                $lookup: {
                  from: "permissions",
                  localField: "permissions",
                  foreignField: "_id",
                  as: "userPermissions",
                },
              },
            ]);

            //check for permissions
            let flag = true;
            adminPermissions[0]?.userPermissions?.forEach((permission) => {
              if (flag === true) {
                if (Object.keys(permission).includes(decodedActionType)) {
                  if (permission[decodedActionType].includes(decodedAction)) {
                    req.role = userWithRole[0];
                    flag = false;
                  } else {
                    req.role = null;
                  }
                } else {
                  req.role = null;
                }
              }
            });
          }

          break;

        case process.env.USER_ROLE:
          //check if requested person role name is "admin", if so then just deny the request
          if (requestedPersonRoleName === process.env.ADMIN_ROLE) {
            req.role = null;
          }
          //check if requested person role name is "moderator", if so then just deny the request
          if (requestedPersonRoleName === process.env.MODERATOR_ROLE) {
            req.role = null;
          }
          //check if requested person role name is "user", if so then check the only himself can change his own things
          if (userWithRoleName === requestedPersonRoleName) {
            if (loggedInPerson.toString() === req.params.userId) {
              req.role = userWithRole[0];
            } else {
              req.role = null;
            }
          } else {
            req.role = null;
          }

          break;
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json(
          new apiErrorHandler(401, "Unauthorized in role middleware line 217")
        );
    }
  }
);
