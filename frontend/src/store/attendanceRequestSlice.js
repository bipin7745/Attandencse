import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";

// SEND ATTENDANCE REQUEST
export const sendAttendanceRequest = createAsyncThunk(
  "attendanceRequest/send",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("requestlist/request", payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Request failed",
      );
    }
  },
);

// FETCH ALL REQUESTS
export const fetchAllRequests = createAsyncThunk(
  "attendanceRequest/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("requestlist");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed",
      );
    }
  },
);
export const fetchMyRequests = createAsyncThunk(
  "attendanceRequest/fetchMy",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("requestlist/my-requests");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed",
      );
    }
  },
);
export const approveRequest = createAsyncThunk(
  "attendanceRequest/approve",
  async (id, thunkAPI) => {
    try {
      const res = await api.put(`requestlist/${id}/approve`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Approve failed",
      );
    }
  },
);

// REJECT REQUEST
export const rejectRequest = createAsyncThunk(
  "attendanceRequest/reject",
  async (id, thunkAPI) => {
    try {
      const res = await api.put(`requestlist/${id}/reject`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Reject failed",
      );
    }
  },
);

const attendanceRequestSlice = createSlice({
  name: "attendanceRequest",
  initialState: {
    list: [],
    loading: false,
    error: null,
    requestSuccess: false,
  },
  reducers: {
    resetRequestSuccess(state) {
      state.requestSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // SEND REQUEST
        .addCase(sendAttendanceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requestSuccess = false;
      })
      .addCase(sendAttendanceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestSuccess = true;
        // Replace if exists, else add
        const idx = state.list.findIndex((r) => r._id === action.payload._id);
        if (idx >= 0) state.list[idx] = action.payload;
        else state.list.unshift(action.payload);
      })
      .addCase(sendAttendanceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH ALL
      .addCase(fetchAllRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.list = state.list.map((r) =>
            r._id === action.payload.data._id ? action.payload.data : r,
          );
        }
      })

      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.list = state.list.map((r) =>
          r._id === action.payload.data._id ? action.payload.data : r,
        );
      });
  },
});

export const { resetRequestSuccess } = attendanceRequestSlice.actions;
export default attendanceRequestSlice.reducer;
