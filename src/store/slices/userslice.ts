// features/user/userSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import ngrokAxiosInstance from "../../hooks/AxiosInstance";
import { ErrorResponse, UserCount, UserCountResponse, User, UsersResponse, UserState } from "../../types/UserModel";

const initialState: UserState = {
  userCounts: null,
  users: null, 
  selectedUser: null,
  loading: false,
  error: null,
};

export const getTypesCount = createAsyncThunk<
  UserCount[],
  { admin_user_id: number; admin_user_type: number },
  { rejectValue: string }
>(
  "user/getTypesCount",
  async ({ admin_user_id, admin_user_type }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await ngrokAxiosInstance.get<UserCountResponse>(
        `/api/v1/getTypesCount?admin_user_id=${admin_user_id}&admin_user_type=${admin_user_type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Get types count error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("User count service not found");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(axiosError.response.data?.message || "Failed to fetch user counts");
        }
      }
      return rejectWithValue("Network error. Please check your connection and try again.");
    }
  }
);

export const getUsersByType = createAsyncThunk<
  User[],
  { admin_user_id: number; emp_user_type: number },
  { rejectValue: string }
>(
  "user/getUsersByType",
  async ({ admin_user_id, emp_user_type }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await ngrokAxiosInstance.get<UsersResponse>(
        `http://localhost:3000/api/v1/getUsersTypesByBuilder?admin_user_id=${admin_user_id}&emp_user_type=${emp_user_type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Get users by type error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("Users not found for this type");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(axiosError.response.data?.message || "Failed to fetch users");
        }
      }
      return rejectWithValue("Network error. Please check your connection and try again.");
    }
  }
);

export const getUserById = createAsyncThunk<
  User,
  { admin_user_id: number; emp_user_type: number; emp_user_id: number },
  { rejectValue: string }
>(
  "user/getUserById",
  async ({ admin_user_id, emp_user_type, emp_user_id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const response = await ngrokAxiosInstance.get<UsersResponse>(
        `http://localhost:3000/api/v1/getUsersTypesByBuilder?admin_user_id=${admin_user_id}&emp_user_type=${emp_user_type}&emp_user_id=${emp_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.data || response.data.data.length === 0) {
        return rejectWithValue("User not found");
      }

      return response.data.data[0]; // Return the first user
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Get user by ID error:", axiosError);
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            return rejectWithValue("Unauthorized: Invalid or expired token");
          case 404:
            return rejectWithValue("User not found");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(axiosError.response.data?.message || "Failed to fetch user details");
        }
      }
      return rejectWithValue("Network error. Please check your connection and try again.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = null;
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(getTypesCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTypesCount.fulfilled, (state, action) => {
        state.loading = false;
        state.userCounts = action.payload;
      })
      .addCase(getTypesCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
    
      .addCase(getUsersByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersByType.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsersByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

        .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;