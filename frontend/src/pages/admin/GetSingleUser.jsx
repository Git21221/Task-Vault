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
import { getSingleUser } from "../../redux/adminSlice";
import { deleteTask, getAllTasksOfUser } from "../../redux/taskSlice";
import { deleteUser } from "../../redux/userSlice";

function GetSingleUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleUser } = useSelector((state) => state.admin);
  const { personTasksOfId: tasks } = useSelector((state) => state.task);
  const { openTaskModal } = useSelector((state) => state.task);
  const { id } = useParams();
  const [hoveredTask, setHoveredTask] = useState(null);

  useEffect(() => {
    dispatch(
      getSingleUser({
        dispatch,
        userId: id,
        action: import.meta.env.VITE_PROFILE_READ,
      })
    );
    dispatch(
      getAllTasksOfUser({
        dispatch,
        userId: id,
        action: import.meta.env.VITE_TASK_READ,
      })
    );
  }, [dispatch, id]);

  const handleDeleteUser = () => {
    dispatch(
      deleteUser({
        dispatch,
        userId: id,
        action: import.meta.env.VITE_PROFILE_DELETE,
      })
    );
    navigate(-1);
    // API call to delete the user
  };

  const handleDeleteTask = (taskId) => {
    dispatch(
      deleteTask({
        dispatch,
        taskId,
        userId: id,
        action: import.meta.env.VITE_TASK_DELETE,
      })
    );
    // API call to delete the task
  };

  const handleViewTask = (taskId) => {
    dispatch(openTaskModal)
    // Logic to navigate or display task details
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* User Details */}
      {singleUser && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom>
            {singleUser.fullName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {singleUser.email}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Role: {singleUser.userRole?.[0]?.name || "No role assigned"}
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleDeleteUser}
          >
            Delete Profile
          </Button>
        </Paper>
      )}

      {/* Tasks Section */}
      <Typography variant="h5" gutterBottom>
        Assigned Tasks
      </Typography>
      {tasks && tasks.length > 0 ? (
        <List>
          {tasks.map((task, index) => (
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
              {index < tasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tasks assigned to this user.
        </Typography>
      )}
    </Box>
  );
}

export default GetSingleUser;
