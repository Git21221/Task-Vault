import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { getAllRoles, updateUserRole } from "../../redux/adminSlice";
import { deleteUser, getAllUsers, removeUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

function UserManagementByMod() {
  const { users } = useSelector((state) => state.user);
  const { roles } = useSelector((state) => state.admin); // Fetch roles from state
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correct placement of useNavigate hook
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [updatedRoles, setUpdatedRoles] = useState({}); // Track role changes for each user

  useEffect(() => {
    dispatch(getAllRoles({dispatch,}));
    dispatch(getAllUsers({dispatch,}));
  }, [dispatch]); // Fetch roles on component mount

  // Filtered users based on search and role
  const filteredUsers = users.filter((user) => {
    return (
      (!search || user.fullName.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedRole ||
        user.updatedRoles.some((role) => role.name === selectedRole))
    );
  });

  // Handle role change for a user
  const handleRoleChange = (userId, newRoleId) => {
    setUpdatedRoles((prev) => ({
      ...prev,
      [userId]: newRoleId,
    }));
  };

  // Handle role update
  const handleRoleUpdate = (userId) => {
    if (updatedRoles[userId]) {
      dispatch(
        updateUserRole({
          userId,
          roleId: updatedRoles[userId],
          action: import.meta.env.VITE_ROLE_UPDATE,
        })
      ).then((res) => {
        if (res.payload.code < 300) dispatch(removeUser({ id: userId }));
      });
      setUpdatedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId]; // Remove after update
        return updated;
      });
    }
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(
        deleteUser({ userId, action: import.meta.env.VITE_PROFILE_DELETE })
      );
    }
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Management
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

      {/* User Table */}
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
          {filteredUsers.map((user) => (
            <TableRow
              className="cursor-pointer"
              key={user._id}
              onClick={(e) => {
                e.stopPropagation(); // Prevent other handlers from interfering
                navigate(`user/${user._id}`);
              }}
            >
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={
                    updatedRoles[user._id] || user.updatedRoles[0]?._id || ""
                  }
                  onClick={(e) => e.stopPropagation()} // Stop propagation here
                  onChange={(e) => {
                    handleRoleChange(user._id, e.target.value);
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                {user.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((permission, index) => (
                    <Typography key={index} variant="body2">
                      {permission}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Permissions Assigned
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {updatedRoles[user._id] && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when updating role
                      handleRoleUpdate(user._id);
                    }}
                  >
                    Update
                  </Button>
                )}
                <Button
                  color="error"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click when deleting user
                    handleDelete(user._id);
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

export default UserManagementByMod;
