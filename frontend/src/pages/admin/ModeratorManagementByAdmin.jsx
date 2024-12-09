import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { deleteMod, getAllMods, removeMod } from "../../redux/modSlice";
import { getAllRoles, updateUserRole } from "../../redux/adminSlice";
import { useNavigate } from "react-router-dom";

function ModeratorManagementByAdmin() {
  const { mods } = useSelector((state) => state.mod);
  const { roles } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [updatedRoles, setUpdatedRoles] = useState({}); // Track role changes for each mod

  useEffect(() => {
    dispatch(getAllMods());
    dispatch(getAllRoles());
  }, [dispatch]);

  // Permissions mapping for human-readable values
  const permissionLabels = {
    "task:action:read": "Can read task",
    "task:action:delete": "Can delete task",
    "task:action:update": "Can update task",
    "profile:action:read": "Can read profile",
    "profile:action:delete": "Can delete profile",
    "profile:action:update": "Can update profile",
    "role:action:update": "Can update role",
  };

  // Filtered moderators based on search and role
  const filteredMods = mods.filter((mod) => {
    return (
      (!search || mod.fullName.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedRole ||
        mod.updatedRoles.some((role) => role.name === selectedRole))
    );
  });

  // Handle role change for a mod
  const handleRoleChange = (modId, newRoleId) => {
    setUpdatedRoles((prev) => ({
      ...prev,
      [modId]: newRoleId,
    }));
  };

  // Handle role update
  const handleRoleUpdate = (modId) => {
    if (updatedRoles[modId]) {
      dispatch(
        updateUserRole({
          userId: modId,
          roleId: updatedRoles[modId],
          action: import.meta.env.VITE_ROLE_UPDATE,
        })
      ).then((res) => {
        if (res.payload.code < 300) dispatch(removeMod({ _id: modId }));
      });
      dispatch(
        setUpdatedRoles((prev) => {
          const updated = { ...prev };
          delete updated[modId]; // Remove after update
          return updated;
        })
      );
    }
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Moderator Management
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Search by name"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role._id} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table>
        <TableHead>
          <TableRow className="bg-blue-50">
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMods.map((mod) => (
            <TableRow
              className="cursor-pointer"
              key={mod._id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`mod/${mod._id}`);
              }}
            >
              <TableCell>{mod.fullName}</TableCell>
              <TableCell>{mod.email}</TableCell>
              <TableCell>
                <Select
                  value={
                    updatedRoles[mod._id] || mod.updatedRoles[0]?._id || ""
                  }
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleRoleChange(mod._id, e.target.value)}
                >
                  {roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                {mod.permissions && mod.permissions.length > 0 ? (
                  mod.permissions.map((permission, idx) => {
                    console.log(permission);
                    const permissionKey = Object.keys(permission)[1];
                    const permissionValue = permission[permissionKey];
                    const permissionLabel = `${permissionKey}:${permissionValue}`;

                    return (
                      <Typography key={idx} variant="body2">
                        {permissionLabels[permissionLabel] ||
                          "Unknown Permission"}
                      </Typography>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Permissions Assigned
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {updatedRoles[mod._id] && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleUpdate(mod._id);
                    }}
                  >
                    Update
                  </Button>
                )}
                <Button
                  color="error"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add delete functionality here
                    alert(`Delete functionality for moderator ${mod._id}`);
                    dispatch(deleteMod({modId: mod._id, action: import.meta.env.VITE_PROFILE_DELETE}));
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default ModeratorManagementByAdmin;
