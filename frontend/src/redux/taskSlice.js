import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

const initialState = {
  tasks: [],
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
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const result = apiClient("tasks/create-task", "POST", {
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
    { taskId, title, description, userId, action },
    { rejectWithValue }
  ) => {
    try {
      const result = apiClient(
        `tasks/update-task/${taskId}/${userId}/${action}`,
        "PUT",
        {
          body: JSON.stringify({ title, description }),
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
  async ({ taskId, userId, action }, { rejectWithValue }) => {
    try {
      const result = apiClient(
        `tasks/get-task/${taskId}/${userId}/${action}`,
        "GET"
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllTasks = createAsyncThunk("task/get-all-tasks", async () => {
  try {
    const result = apiClient("tasks/get-all-tasks", "GET");
    return result;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setOpenTaskModal: (state, action) => {
      state.openTaskModal.open = action.payload.open;
      state.openTaskModal.task = action.payload.task;
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
      })
      .addCase(getAllTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetching tasks";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.loading = false;
        state.tasks = state.tasks.map((task) => {
          if (task._id === action.payload.data._id) {
            return {
              ...task,
              title: action.payload.data.title || "",
              description: action.payload.data.description || "",
            };
          }
          return task;
        });
      })
      .addCase(updateTask.rejected, (state) => {
        state.loading = false;
        state.error = "Error updating task";
      });
  },
});

export const { setOpenTaskModal } = taskSlice.actions;
export default taskSlice;
