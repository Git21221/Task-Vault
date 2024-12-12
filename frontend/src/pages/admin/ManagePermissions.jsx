import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPermissionByRole,
  getAllPermissions,
  updatePermissionOfRole,
} from "../../redux/adminSlice";
import {
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Tooltip,
} from "@mui/material";

function ManagePermissions() {
  const { roleWisePermissions, allPermissions } = useSelector(
    (state) => state.admin
  );
  console.log(roleWisePermissions);
  const dispatch = useDispatch();

  const [roleUpdates, setRoleUpdates] = useState({}); // Track updated permissions for roles

  useEffect(() => {
    dispatch(getAllPermissionByRole({dispatch}));
    dispatch(getAllPermissions({dispatch}));
  }, [dispatch]);

  // Initialize roleUpdates when roleWisePermissions changes
  useEffect(() => {
    if (roleWisePermissions.length) {
      const initialUpdates = roleWisePermissions.reduce((acc, role) => {
        acc[role._id] = role.permissions.map((perm) => perm._id);
        return acc;
      }, {});
      setRoleUpdates(initialUpdates);
    }
  }, [roleWisePermissions]);

  // Handle checkbox toggle
  const handlePermissionToggle = (roleId, permissionId) => {
    setRoleUpdates((prev) => {
      const updatedPermissions = prev[roleId]?.includes(permissionId)
        ? prev[roleId].filter((id) => id !== permissionId) // Remove permission
        : [...(prev[roleId] || []), permissionId]; // Add permission

      return {
        ...prev,
        [roleId]: updatedPermissions,
      };
    });
  };

  // Handle Update Button
  const handleUpdate = (roleId) => {
    const permissionsToUpdate = roleUpdates[roleId];
    dispatch(updatePermissionOfRole({ dispatch, roleId, permissions: permissionsToUpdate }));
  };

  // Human-readable label for permissions
  const getPermissionLabel = (permission) => {
    if (permission.task) {
      return `Task: ${permission.task.split(":")[1]}`;
    }
    if (permission.profile) {
      return `Profile: ${permission.profile.split(":")[1]}`;
    }
    if (permission.role) {
      return `Role: ${permission.role.split(":")[1]}`;
    }
    return "Unknown Permission";
  };

  return (
    <Grid container spacing={3} padding={3}>
      {roleWisePermissions.map((role) => (
        <Grid item xs={12} md={6} lg={4} key={role._id}>
          <Paper
            elevation={3}
            style={{
              padding: "16px",
              backgroundColor: role.name === import.meta.env.VITE_ADMIN_ROLE ? "#f0f4ff" : "#fff",
              border: role.name === import.meta.env.VITE_ADMIN_ROLE ? "2px solid #2196f3" : "none",
            }}
          >
            <Typography
              variant="h6"
              style={{
                color: role.name === import.meta.env.VITE_ADMIN_ROLE ? "#1976d2" : "#000",
                fontWeight: "bold",
              }}
              gutterBottom
            >
              {role.name.charAt(0).toUpperCase() + role.name.slice(1)} Role
            </Typography>
            <div style={{ overflowY: "auto" }}>
              {allPermissions.map((permission) => (
                <Tooltip
                  key={permission._id}
                  title={
                    role.name === import.meta.env.VITE_ADMIN_ROLE || role.name === import.meta.env.VITE_USER_ROLE
                      ? "Editing not allowed for this role"
                      : ""
                  }
                >
                  <span>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={roleUpdates[role._id]?.includes(permission._id) || false}
                          onChange={() =>
                            handlePermissionToggle(role._id, permission._id)
                          }
                          disabled={role.name === import.meta.env.VITE_ADMIN_ROLE || role.name === import.meta.env.VITE_USER_ROLE}
                        />
                      }
                      label={getPermissionLabel(permission)}
                    />
                  </span>
                </Tooltip>
              ))}
            </div>
            {role.name !== import.meta.env.VITE_ADMIN_ROLE && role.name !== import.meta.env.VITE_USER_ROLE && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
                onClick={() => handleUpdate(role._id)}
              >
                Update {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </Button>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default ManagePermissions;
