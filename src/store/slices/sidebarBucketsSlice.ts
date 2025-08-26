import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";

type Buckets = {
  total_today_assigned: number;
  open: number;
  in_progress: number;
  today_followups: number;
  site_visit_scheduled: number;
  site_visit_done: number;
  won: number;
  lost: number;
  today_activity: number; // optional for parent badge
};

export const fetchSidebarBuckets = createAsyncThunk(
  "sidebarBuckets/fetch",
  async ({ assigned_user_type, assigned_id }: { assigned_user_type: number; assigned_id: number }) => {

    const { data } = await ngrokAxiosInstance.get("/api/lead-notifications/sidebar-counts", {
      params: { assigned_user_type, assigned_id },
    });
    return (data?.counts ?? {}) as Partial<Buckets>;
  }
);
const initialState: Buckets = {
  total_today_assigned: 0,
  open: 0,
  in_progress: 0,
  today_followups: 0,
  site_visit_scheduled: 0,
  site_visit_done: 0,
  won: 0,
  lost: 0,
  today_activity: 0,
};

const sidebarBucketsSlice = createSlice({
  name: "sidebarBuckets",
  initialState,
  reducers: {
    clearBucket(state, action: PayloadAction<keyof Buckets>) {
      state[action.payload] = 0;
    },
    clearAllBuckets(state) {
      Object.keys(state).forEach((k) => {
        // @ts-ignore
        state[k] = 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSidebarBuckets.fulfilled, (state, action) => {
      const incoming = action.payload;
      Object.assign(state, { ...initialState, ...incoming });
    });
  },
});

export const { clearBucket, clearAllBuckets } = sidebarBucketsSlice.actions;
export default sidebarBucketsSlice.reducer;
