import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api"; // ✅ use API middleware

/* ================= FETCH TASK MESSAGES ================= */
export const fetchMessagesByTask = createAsyncThunk(
  "taskMessage/fetchByTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/taskmessage`, {
        params: { taskId }, // cleaner query params
      });
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch task messages"
      );
    }
  }
);

/* ================= SEND TASK MESSAGE ================= */
export const sendMessage = createAsyncThunk(
  "taskMessage/send",
  async ({ text, taskId, replyTo }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/taskmessage`, {
        text,
        taskId,
        replyTo,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message"
      );
    }
  }
);

/* ================= SLICE ================= */
const taskMessageSlice = createSlice({
  name: "taskMessage",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskMessages: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch messages */
      .addCase(fetchMessagesByTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByTask.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMessagesByTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Send message */
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.list.push(action.payload); // instant UI update
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTaskMessages } = taskMessageSlice.actions;
export default taskMessageSlice.reducer;
