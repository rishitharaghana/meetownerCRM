import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";

export interface Notification {
  lead_id: number;
  customer_name: string;
  project_name: string;
  status: string;
  state: string;
  city: string;
  assigned_date: string | null;
  assigned_time: string | null;
}

export interface NotificationResponse {
  results: Notification[];
  count: number;
}

export interface ErrorResponse {
  message: string;
}

export interface NotificationState {
  notifications: Notification[] | null;
  notificationCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: null,
  notificationCount: 0,
  loading: false,
  error: null,
};

export const fetchLeadNotifications = createAsyncThunk<
  NotificationResponse,
  { assigned_user_type: number; assigned_id: number },
  { rejectValue: string }
>(
  "notification/fetchLeadNotifications",
  async ({ assigned_user_type, assigned_id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await ngrokAxiosInstance.get<NotificationResponse>(
        `/api/v1/leads/notifications?assigned_user_type=${assigned_user_type}&assigned_id=${assigned_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Fetch lead notifications error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 400:
            return rejectWithValue("Invalid parameters provided");
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("No notifications found");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(
              axiosError.response.data?.message || "Failed to fetch notifications"
            );
        }
      }
      return rejectWithValue(
        "Network error. Please check your connection and try again."
      );
    }
  }
);

export const clearNotification = createAsyncThunk<
  { message: string; lead_id: number },
  { lead_id: number },
  { rejectValue: string }
>(
  "notification/clearNotification",
  async ({ lead_id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await ngrokAxiosInstance.post<{ message: string }>(
        `/api/v1/leads/clear-notifications`,
        { lead_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      return { message: response.data.message, lead_id };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Clear notification error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 400:
            return rejectWithValue("Invalid lead ID provided");
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("Notification not found");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(
              axiosError.response.data?.message || "Failed to clear notification"
            );
        }
      }
      return rejectWithValue(
        "Network error. Please check your connection and try again."
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = null;
      state.notificationCount = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadNotifications.fulfilled, (state, action: PayloadAction<NotificationResponse>) => {
        state.loading = false;
        state.notifications = action.payload.results;
        state.notificationCount = action.payload.count;
      })
      .addCase(fetchLeadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(clearNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearNotification.fulfilled, (state, action: PayloadAction<{ message: string; lead_id: number }>) => {
        state.loading = false;
        if (state.notifications) {
          state.notifications = state.notifications.filter(
            (notification) => notification.lead_id !== action.payload.lead_id
          );
          state.notificationCount = state.notifications.length;
        }
      })
      .addCase(clearNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearNotifications, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;