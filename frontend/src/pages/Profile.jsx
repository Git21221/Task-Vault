import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Box,
} from "@mui/material";
import { deleteAdminProfile, getSingleUser } from "../redux/adminSlice";
import { deleteUser, updateProfile } from "../redux/userSlice";
import { updateProfile as updateProfileAuth } from "../redux/authSlice";
import { updateProfile as updateProfileAdmin } from "../redux/adminSlice";
import { deleteMod } from "../redux/modSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, userRole } = useSelector((state) => state.auth);
  const { singleUser } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getSingleUser({
        dispatch,
        userId: user._id,
        action: import.meta.env.VITE_PROFILE_READ,
      })
    );
  }, [dispatch, user._id]);

  useEffect(() => {
    if (singleUser) {
      setEditableUser({
        fullName: singleUser.fullName || "",
        email: singleUser.email || "",
      });
    }
  }, [singleUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    dispatch(
      updateProfile({
        dispatch,
        data: editableUser,
        userId: user._id,
        action: import.meta.env.VITE_PROFILE_UPDATE,
      })
    );
    dispatch(updateProfileAuth({ data: editableUser }));
    dispatch(updateProfileAdmin({ data: editableUser }));
    setIsEditing(false);
  };

  const handleProfileDelete = () => {
    userRole === import.meta.env.VITE_ADMIN_ROLE
      ? dispatch(
          deleteAdminProfile({
            dispatch,
            adminId: user._id,
            action: import.meta.env.VITE_PROFILE_DELETE,
          })
        )
      : userRole === import.meta.env.VITE_MOD_ROLE
      ? dispatch(
          deleteMod({
            dispatch,
            modId: user._id,
            action: import.meta.env.VITE_PROFILE_DELETE,
          })
        )
      : dispatch(
          deleteUser({
            dispatch,
            userId: user._id,
            action: import.meta.env.VITE_PROFILE_DELETE,
          })
        );

    navigate("/signin");
  };

  const permissionLabels = {
    "task:action:read": "Can read task",
    "task:action:delete": "Can delete task",
    "task:action:update": "Can update task",
    "profile:action:read": "Can read profile",
    "profile:action:delete": "Can delete profile",
    "profile:action:update": "Can update profile",
    "role:action:update": "Can update role",
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "background.default" }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                Full Name
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="fullName"
                  value={editableUser.fullName}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography variant="body2">
                  {singleUser?.fullName || "N/A"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                Email
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="email"
                  value={editableUser.email}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography variant="body2">
                  {singleUser?.email || "N/A"}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Typography variant="body1" color="text.secondary">
            Role
          </Typography>
          <Typography variant="body2">
            {singleUser?.userRole?.[0]?.name || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Permissions
          </Typography>
          {singleUser?.permissions && singleUser.permissions.length > 0 ? (
            <Grid container spacing={1}>
              {singleUser.permissions.map((permission, idx) => {
                const permissionKey = Object.keys(permission)[1];
                const permissionValue = permission[permissionKey];
                const permissionLabel = `${permissionKey}:${permissionValue}`;

                return (
                  <Grid item key={idx}>
                    <Chip
                      label={
                        permissionLabels[permissionLabel] ||
                        "Unknown Permission"
                      }
                      color="primary"
                      size="small"
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No Permissions Assigned
            </Typography>
          )}
        </CardContent>
      </Card>

      {isEditing ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={{ mr: 2 }}
        >
          Update Profile
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit}
          sx={{ mr: 2 }}
        >
          Edit Profile
        </Button>
      )}
      <Button variant="outlined" color="error" onClick={handleProfileDelete}>
        Delete Profile
      </Button>
    </Box>
  );
}

export default Profile;
