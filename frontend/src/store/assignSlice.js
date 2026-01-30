import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../middleware/api";

//  Assign asset to user
export const assignAssetToUser = createAsyncThunk(
  "assign/assignAssetToUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/assign", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data.assignment; // backend returns {assignment, message}
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error assigning asset"
      );
    }
  }
);

//  Fetch all assigned assets
export const fetchAssignedAssets = createAsyncThunk(
  "assign/fetchAssignedAssets",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/assign/assigned");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching assigned assets"
      );
    }
  }
);
export const fetchaAssignedDefective  = createAsyncThunk(
  "assign/fetchaAssignedDefective",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/assign/defective");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching assigned assets"
      );
    }
  }
);

//  Update assigned asset

export const updateAssignedAsset = createAsyncThunk(
  "assign/updateAssignedAsset",
  async ({ id, assetId, userId, assignedQty }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/assign/${id}`,
        { assetId, userId, assignedQty },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return data.assignment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating assignment");
    }
  }
);

//  Delete assigned asset
export const deleteAssignedAsset = createAsyncThunk(
  "assign/deleteAssignedAsset",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assign/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting assignment"
      );
    }
  }
);

export const fetchAssignmentByAssetAndUser = createAsyncThunk(
  "assign/fetchAssignmentByAssetAndUser",
  async (assetId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/assign/my-assets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching assignment"
      );
    }
  }
);
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

const assignSlice = createSlice({
  name: "assign",
  initialState: {
    assignedAssets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAssignedAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignedAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedAssets = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAssignedAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchaAssignedDefective.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchaAssignedDefective.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedAssets = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchaAssignedDefective.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ASSIGN
      .addCase(assignAssetToUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignAssetToUser.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedAssets.push(action.payload);
      })
      .addCase(assignAssetToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAssignedAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssignedAsset.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignedAssets.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.assignedAssets[index] = action.payload;
        }
      })
      .addCase(updateAssignedAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAssignedAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssignedAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedAssets = state.assignedAssets.filter(
          (a) => a._id !== action.payload
        );
      })
      .addCase(deleteAssignedAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignmentByAssetAndUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignmentByAssetAndUser.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedAssets = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAssignmentByAssetAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearAssignment } = assignSlice.actions;
export default assignSlice.reducer;
