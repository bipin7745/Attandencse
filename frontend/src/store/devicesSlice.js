import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";

// Fetch all devices
export const fetchDevices = createAsyncThunk(
  "devices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/device");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch devices"
      );
    }
  }
);

// Add device
export const addDevice = createAsyncThunk(
  "devices/add",
  async (device, { rejectWithValue }) => {
    try {
      const res = await api.post("/device", device);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add device"
      );
    }
  }
);

// Update device
export const updateDevice = createAsyncThunk(
  "devices/update",
  async ({ id, updatedDevice }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/device/${id}`, updatedDevice);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update device"
      );
    }
  }
);

// Delete device
export const deleteDevice = createAsyncThunk(
  "devices/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/device/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete device"
      );
    }
  }
);

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices.push(action.payload);
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.devices.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) state.devices[index] = action.payload;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = state.devices.filter((d) => d._id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default devicesSlice.reducer;
