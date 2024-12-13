import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { getSingleMod } from "../../redux/modSlice"; // Action for getting a single mod
import { deleteTask, getAllTasksOfUser } from "../../redux/taskSlice"; // Assuming mod's tasks are managed the same way
import { deleteMod } from "../../redux/modSlice"; // Action for deleting a moderator

function GetSingleMod() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleMod } = useSelector((state) => state.mod);
  const { personTasksOfId: modTasks } = useSelector((state) => state.task); // Assuming tasks are fetched similarly
  const { id } = useParams();
  const [hoveredTask, setHoveredTask] = useState(null);

  useEffect(() => {
    dispatch(
      getSingleMod({
        dispatch,
        modId: id,
        action: import.meta.env.VITE_PROFILE_READ, // Assuming this is to view mod's profile
      })
    );
    dispatch(
      getAllTasksOfUser({
        dispatch,
        userId: id,
        action: import.meta.env.VITE_TASK_READ, // Assuming this is to view mod's tasks
      })
    );
  }, [dispatch, id]);

  const handleDeleteMod = () => {
    dispatch(
      deleteMod({
        dispatch,
        modId: id,
        action: import.meta.env.VITE_PROFILE_DELETE,
      })
    );
    navigate(-1);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(
      deleteTask({
        dispatch,
        taskId,
        modId: id,
        action: import.meta.env.VITE_TASK_DELETE,
      })
    );
  };

  const handleViewTask = (taskId) => {
    
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Moderator Details */}
      {singleMod && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom>
            {singleMod.fullName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {singleMod.email}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Role: {singleMod.modRole?.[0]?.name || "No role assigned"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Permissions:
            <ul>
              {singleMod.permissions &&
                singleMod.permissions.map((perm, index) => (
                  <li key={index}>
                    {perm.task
                      ? perm.task === "action:read"
                        ? "Can read task"
                        : perm.task === "action:delete"
                        ? "Can delete task"
                        : perm.task === "action:update"
                        ? "Can update task"
                        : perm.task
                      : perm.profile
                      ? perm.profile === "action:read"
                        ? "Can read profile"
                        : perm.profile === "action:delete"
                        ? "Can delete profile"
                        : perm.profile === "action:update"
                        ? "Can update profile"
                        : perm.profile
                      : perm.role
                      ? perm.role === "action:update"
                        ? "Can update role"
                        : perm.role
                      : "Unknown Permission"}
                  </li>
                ))}
            </ul>
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleDeleteMod}
          >
            Delete Moderator
          </Button>
        </Paper>
      )}

      {/* Tasks Section */}
      <Typography variant="h5" gutterBottom>
        Assigned Tasks
      </Typography>
      {modTasks && modTasks.length > 0 ? (
        <List>
          {modTasks.map((task, index) => (
            <React.Fragment key={task._id}>
              <ListItem
                alignItems="flex-start"
                onMouseEnter={() => setHoveredTask(task._id)}
                onMouseLeave={() => setHoveredTask(null)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={<Typography variant="h6">{task.title}</Typography>}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status: {task.status}
                      </Typography>
                      {task.description && (
                        <Typography variant="body2" color="text.secondary">
                          Description: {task.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Created At: {new Date(task.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                {hoveredTask === task._id && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewTask(task._id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </ListItem>
              {index < modTasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tasks assigned to this moderator.
        </Typography>
      )}
    </Box>
  );
}

export default GetSingleMod;
