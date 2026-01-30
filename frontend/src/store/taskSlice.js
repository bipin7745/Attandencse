// src/store/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";


export const fetchTasksByProject = createAsyncThunk(
  "task/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
  }
);


export const fetchTaskById = createAsyncThunk(
  "task/fetchById",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch task");
    }
  }
);

/* ================= CREATE TASK ================= */
export const createTask = createAsyncThunk(
  "task/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", taskData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create task"
      );
    }
  }
);


/* ================= TASK SLICE ================= */
const taskSlice = createSlice({
  name: "task",
  initialState: {
    list: [],
    currentTask: null,
    loading: false,
    error: null,
    creating: false,
  },
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks by project
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single task
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentTask = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.creating = false;
        state.list.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
