
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ngrokAxiosInstance from '../../hooks/AxiosInstance';
import { Project, ProjectsResponse } from '../../types/ProjectModel';

interface ProjectState {
  ongoingProjects: Project[];
  upcomingProjects: Project[];
  allProjects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  ongoingProjects: [],
  upcomingProjects: [],
  allProjects: [],
  selectedProject: null,
  loading: false,
  error: null,
};


export const fetchOngoingProjects = createAsyncThunk<
  ProjectsResponse,
  { admin_user_type: number; admin_user_id: number },
  { rejectValue: string }
>(
  'projects/fetchOngoingProjects',
  async ({ admin_user_type, admin_user_id }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token found. Please log in.");
    }
    try {
      const response = await ngrokAxiosInstance.get<ProjectsResponse>(
        `/api/v1/ongoingprojects?admin_user_type=${admin_user_type}&admin_user_id=${admin_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ongoing projects');
    }
  }
);

export const fetchUpcomingProjects = createAsyncThunk<
  ProjectsResponse,
  { admin_user_type: number; admin_user_id: number },
  { rejectValue: string }
>(
  'projects/fetchUpcomingProjects',
  async ({ admin_user_type, admin_user_id }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token found. Please log in.");
    }
    try {
      const response = await ngrokAxiosInstance.get<ProjectsResponse>(
        `/api/v1/upcomingproperties?admin_user_type=${admin_user_type}&admin_user_id=${admin_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming projects');
    }
  }
);


export const fetchAllProjects = createAsyncThunk<
  ProjectsResponse,
  { admin_user_type: number; admin_user_id: number },
  { rejectValue: string }
>(
  'projects/fetchAllProjects',
  async ({ admin_user_type, admin_user_id }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token found. Please log in.");
    }
    try {
      const response = await ngrokAxiosInstance.get<ProjectsResponse>(
        `/api/v1/properties?admin_user_type=${admin_user_type}&admin_user_id=${admin_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all projects');
    }
  }
);


export const fetchProjectById = createAsyncThunk<
  Project,
  { property_id: number; admin_user_type: number; admin_user_id: number },
  { rejectValue: string }
>(
  'projects/fetchProjectById',
  async ({ property_id, admin_user_type, admin_user_id }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token found. Please log in.");
    }
    try {
      const response = await ngrokAxiosInstance.get<Project>(
        `/api/v1/propertiesbyId?property_id=${property_id}&admin_user_type=${admin_user_type}&admin_user_id=${admin_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project by ID');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjects(state) {
      state.ongoingProjects = [];
      state.upcomingProjects = [];
      state.allProjects = [];
      state.selectedProject = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(fetchOngoingProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOngoingProjects.fulfilled, (state, action: PayloadAction<ProjectsResponse>) => {
        state.loading = false;
        state.ongoingProjects = action.payload.data;
      })
      .addCase(fetchOngoingProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
    
      .addCase(fetchUpcomingProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingProjects.fulfilled, (state, action: PayloadAction<ProjectsResponse>) => {
        state.loading = false;
        state.upcomingProjects = action.payload.data;
      })
      .addCase(fetchUpcomingProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action: PayloadAction<ProjectsResponse>) => {
        state.loading = false;
        state.allProjects = action.payload.data;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
     
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;