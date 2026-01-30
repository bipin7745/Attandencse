// src/store/requestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api"; // use middleware

// Create a request
export const createRequest = createAsyncThunk(
  "request/createRequest",
  async ({ assignmentId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/request", {
        assignmentId,
        reason,
      });
      return data.request;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all requests
export const fetchRequests = createAsyncThunk(
  "request/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("request");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const approveDeviceRequest = createAsyncThunk(
  "request/approveDeviceRequest",
  async ({ id, status, feedback }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/request/accept/${id}`, { statusType: status, feedback });
      return data.request;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectDeviceRequest = createAsyncThunk(
  "request/rejectDeviceRequest",
  async ({ id, feedback }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/request/reject/${id}`, { feedback });
      return data.request;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const requestSlice = createSlice({
  name: "request",
  initialState: {
    loading: false,
    requests: [],
    success: false,
    error: null,
  },
  reducers: {
    resetRequest: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.requests.unshift(action.payload); // add new request on top
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     .addCase(approveDeviceRequest.pending, (state) => { state.loading = true; })
      .addCase(approveDeviceRequest.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.requests.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.requests[idx] = action.payload;
      })
      .addCase(approveDeviceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectDeviceRequest.pending, (state) => { state.loading = true; })
      .addCase(rejectDeviceRequest.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.requests.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.requests[idx] = action.payload;
      })
      .addCase(rejectDeviceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRequest } = requestSlice.actions;
export default requestSlice.reducer;
