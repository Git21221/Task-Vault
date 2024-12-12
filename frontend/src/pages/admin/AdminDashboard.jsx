import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "../../redux/taskSlice";
import { getAllUsers } from "../../redux/userSlice";
import AddTask from "../../components/AddTask";
import { Card, Grid, Typography, Box } from "@mui/material";
import { getAllMods } from "../../redux/modSlice";

function AdminDashboard() {
  const { tasks } = useSelector((state) => state.task);
  const { users } = useSelector((state) => state.user);
  const { mods } = useSelector((state) => state.mod);
  console.log(mods);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTasks({dispatch}));
    dispatch(getAllUsers({dispatch}));
    dispatch(getAllMods({dispatch}));
  }, [dispatch]);

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      color: "primary",
    },
    {
      label: "Completed Tasks",
      value: tasks.filter((task) => task.status === "completed").length,
      color: "success",
    },
    {
      label: "Pending Tasks",
      value: tasks.filter((task) => task.status === "in-progress").length,
      color: "warning",
    },
    {
      label: "Created Tasks",
      value: tasks.filter((task) => task.status === "created").length,
      color: "info",
    },
    {
      label: "Total Users",
      value: users.length,
      color: "info",
    },
    {
      label: "Total Mods",
      value: mods.length,
      color: "info",
    },
  ];

  return (
    <Box sx={{ padding: "24px" }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#3B82F6" }}
      >
        Admin Dashboard
      </Typography>

      {/* Add Task */}
      <Box sx={{ mb: 4 }}>
        <AddTask />
      </Box>

      {/* Statistics */}
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                padding: "16px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: (theme) => theme.palette[stat.color].main }}
              >
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
