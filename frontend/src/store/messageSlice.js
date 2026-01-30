import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api"; 


export const fetchMessagesByProject = createAsyncThunk(
  "message/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get("/messages", {
        params: { projectId }, 
      });
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);


export const sendMessage = createAsyncThunk(
  "message/send",
  async ({ text, projectId, replyTo }, { rejectWithValue }) => {
    try {
      const res = await api.post("/messages", {
        text,
        projectId,
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

const messageSlice = createSlice({
  name: "message",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch messages */
      .addCase(fetchMessagesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMessagesByProject.rejected, (state, action) => {
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

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
