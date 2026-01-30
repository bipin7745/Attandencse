import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";

export const fetchIpAddresses = createAsyncThunk(
  "ip/fetch",
  async () => {
    const res = await api.get("/ip");
    return res.data;
  }
);

export const saveIpAddress = createAsyncThunk(
  "ip/save",
  async (ip, { rejectWithValue }) => {
    try {
      const res = await api.post("/ip", { ip });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateIpAddress = createAsyncThunk(
  "ip/update",
  async ({ id, ip }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/ip/${id}`, { ip });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const ipSlice = createSlice({
  name: "ip",
  initialState: {
    loading: false,
    message: "",
    error: "",
    ipList: [],
  },
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIpAddresses.fulfilled, (state, action) => {
        state.ipList = action.payload;
      })
      .addCase(saveIpAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveIpAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "IP Address saved successfully";
        state.ipList.push(action.payload);
      })
      .addCase(saveIpAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIpAddress.fulfilled, (state, action) => {
        state.ipList = state.ipList.map((ip) =>
          ip._id === action.payload._id ? action.payload : ip
        );
      });
  },
});

export default ipSlice.reducer;
