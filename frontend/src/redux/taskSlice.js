import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  tasks: [],
  personTasksOfId: [],
  userTasks: [],
  modTasks: [],
  adminTasks: [],
  openTaskModal: {
    open: false,
    task: {},
  },
  singleTask: {},
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ dispatch, title, description }, { rejectWithValue }) => {
    try {
      const result = apiClient(dispatch, "tasks/create-task", "POST", {
        body: JSON.stringify({ title, description }),
      });
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update-task",
  async (
    { dispatch, taskId, title, description, status, userId, action },
    { rejectWithValue }
  ) => {
    try {
      const result = apiClient(
        dispatch,
        `tasks/update-task/${taskId}/${userId}/${action}`,
        "PUT",
        {
          body: JSON.stringify({ title, description, status }),
        }
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTask = createAsyncThunk(
  "task/get-task",
  async ({ dispatch, taskId, userId, action }, { rejectWithValue }) => {
    try {
      const result = apiClient(
        dispatch,
        `tasks/get-task/${taskId}/${userId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "task/get-all-tasks",
  async ({ dispatch }) => {
    try {
      const result = apiClient(dispatch, "tasks/get-all-tasks", "GET");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete-task",
  async ({ dispatch, taskId, userId, action }, { rejectWithValue }) => {
    try {
      const result = apiClient(
        dispatch,
        `tasks/delete-task/${taskId}/${userId}/${action}`,
        "DELETE"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllTasksOfUser = createAsyncThunk(
  "task/get-all-tasks-of-user",
  async ({ dispatch, userId, action }, { rejectWithValue }) => {
    try {
      const result = apiClient(
        dispatch,
        `tasks/get-all-tasks-of-user/${userId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setOpenTaskModal: (state, action) => {
      state.openTaskModal.open = action.payload.open;
      state.openTaskModal.task = action.payload.task;
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = [...state.tasks, action.payload.data];
        state.personTasksOfId = [...state.personTasksOfId, action.payload.data];
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTask.fulfilled, (state) => {
        state.loading = false;
        state.singleTask = action.payload;
      })
      .addCase(getTask.rejected, (state) => {
        state.loading = false;
        state.singleTask = {};
      })
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.userTasks = action.payload.data.filter(
          (task) => task.owner.role.name === import.meta.env.VITE_USER_ROLE
        );
        state.modTasks = action.payload.data.filter(
          (task) => task.owner.role.name === import.meta.env.VITE_MOD_ROLE
        );
        state.adminTasks = action.payload.data.filter(
          (task) => task.owner.role.name === import.meta.env.VITE_ADMIN_ROLE
        );
      })
      .addCase(getAllTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetching tasks";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) => {
          if (task._id === action.payload.data._id) {
            return {
              ...task,
              title: action.payload.data.title || "",
              description: action.payload.data.description || "",
              status: action.payload.data.status || "",
            };
          }
          return task;
        });
        state.personTasksOfId = state.personTasksOfId.map((task) => {
          if (task._id === action.payload.data._id) {
            return {
              ...task,
              title: action.payload.data.title || "",
              description: action.payload.data.description || "",
              status: action.payload.data.status || "",
            };
          }
          return task;
        });
      })
      .addCase(updateTask.rejected, (state) => {
        state.loading = false;
        state.error = "Error updating task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.personTasksOfId = state.personTasksOfId.filter(
          (task) => task._id !== action.payload.data._id
        );
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.data._id
        );
      })
      .addCase(deleteTask.rejected, (state) => {
        state.loading = false;
        state.error = "Error deleting task";
      })
      .addCase(getAllTasksOfUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTasksOfUser.fulfilled, (state, action) => {
        state.loading = false;
        state.personTasksOfId = action.payload.data || [];
      })
      .addCase(getAllTasksOfUser.rejected, (state) => {
        state.loading = false;
        state.personTasksOfId = [];
        state.error = "Error fetching tasks";
      });
  },
});

export const { setOpenTaskModal, removeTask } = taskSlice.actions;
export default taskSlice;
