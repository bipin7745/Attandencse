import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";

// Fetch attendance
export const fetchAttendance = createAsyncThunk(
  "attendance/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`attendance/user`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed",
      );
    }
  },
);

// Check-In
export const checkInAttendance = createAsyncThunk(
  "attendance/checkIn",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post(`attendance/check-in`, payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Check-in failed");
    }
  },
);

// Check-Out
export const checkOutAttendance = createAsyncThunk(
  "attendance/checkOut",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post(`attendance/check-out`, payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Check-out failed",
      );
    }
  },
);

export const fetchAllAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("attendance/all");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed",
      );
    }
  },
);
export const updateAttendanceStatus = createAsyncThunk(
  "attendance/updateStatus",
  async ({ id, status, reason }, thunkAPI) => {
    try {
      const res = await api.put(`attendance/status/${id}`, { status, reason });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed",
      );
    }
  },
);
export const sendAttendanceRequest = createAsyncThunk(
  "attendance/sendRequest",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("attendance/request", payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Request failed",
      );
    }
  },
);
export const fetchAttendanceByDate = createAsyncThunk(
  "attendance/fetchByDate",
  async (date, thunkAPI) => {
    try {
      const res = await api.get(`attendance/user?date=${date}`); // Adjust API as per your backend
      return res.data.data; // Assuming API returns single attendance object in data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed",
      );
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearAttendanceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // 👈 API data directly
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.attendanceByDate = null;
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceByDate = action.payload;
      })
      .addCase(fetchAttendanceByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendAttendanceRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendAttendanceRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendAttendanceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkInAttendance.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload._id);

        if (idx !== -1) state.list[idx] = action.payload;
        else state.list.unshift(action.payload);
      })

      .addCase(checkOutAttendance.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
