
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";
import { ErrorResponse, Lead, LeadsResponse, LeadUpdate, LeadUpdatesResponse, LeadState } from "../../types/LeadModel";

const initialState: LeadState = {
  leads: null,
  leadUpdates: null,
  loading: false,
  error: null,
};

export const getLeadsByUser = createAsyncThunk<
  Lead[],
  {
    lead_added_user_type: number;
    lead_added_user_id: number;
    assigned_user_type?: number;
    assigned_id?: number;
    status_id: number;
  },
  { rejectValue: string }
>(
  "lead/getLeadsByUser",
  async (
    { lead_added_user_type, lead_added_user_id, assigned_user_type, assigned_id, status_id },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const queryParams = new URLSearchParams({
        lead_added_user_type: lead_added_user_type.toString(),
        lead_added_user_id: lead_added_user_id.toString(),
        status_id: status_id.toString(),
        ...(assigned_user_type && { assigned_user_type: assigned_user_type.toString() }),
        ...(assigned_id && { assigned_id: assigned_id.toString() }),
      });

      const response = await ngrokAxiosInstance.get<LeadsResponse>(
        `http://localhost:3000/api/v1/getLeadsByUser?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.results || response.data.results.length === 0) {
        return rejectWithValue("No leads found");
      }

      return response.data.results;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Get leads by user error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("No leads found for this user");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(axiosError.response.data?.message || "Failed to fetch leads");
        }
      }
      return rejectWithValue("Network error. Please check your connection and try again.");
    }
  }
);

export const getLeadUpdatesByLeadId = createAsyncThunk<
  LeadUpdate[],
  {
    lead_id: number;
    lead_added_user_type: number;
    lead_added_user_id: number;
  },
  { rejectValue: string }
>(
  "lead/getLeadUpdatesByLeadId",
  async ({ lead_id, lead_added_user_type, lead_added_user_id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const queryParams = new URLSearchParams({
        lead_id: lead_id.toString(),
        lead_added_user_type: lead_added_user_type.toString(),
        lead_added_user_id: lead_added_user_id.toString(),
      });

      const response = await ngrokAxiosInstance.get<LeadUpdatesResponse>(
        `http://localhost:3000/api/v1/leads/getLeadUpdatesByLeadId?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.results || response.data.results.length === 0) {
        return rejectWithValue("No lead updates found");
      }

      return response.data.results;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Get lead updates by lead ID error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("No updates found for this lead");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(axiosError.response.data?.message || "Failed to fetch lead updates");
        }
      }
      return rejectWithValue("Network error. Please check your connection and try again.");
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    clearLeads: (state) => {
      state.leads = null;
      state.leadUpdates = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeadsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeadsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(getLeadsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(getLeadUpdatesByLeadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeadUpdatesByLeadId.fulfilled, (state, action) => {
        state.loading = false;
        state.leadUpdates = action.payload;
      })
      .addCase(getLeadUpdatesByLeadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearLeads } = leadSlice.actions;
export default leadSlice.reducer;