

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  userCounts: UserCount[] | null;

}

export interface LoginRequest {
  mobile: string;
  password: string;
}


export interface User {
  id: number;
  user_type: number;
  name: string;
  mobile: string;
  email: string;
  photo: string | null;
  status: number;
  created_date: string;
  created_time: string;
  updated_date: string;
  updated_time: string;
  state: string;
  city: string;
  location: string;
  address: string;
  pincode: string;
  gst_number: string;
  rera_number: string;
  created_by: string;
  created_user_id: number;
  company_name: string;
  company_number: string;
  company_address: string;
  representative_name: string;
  pan_card_number: string;
  aadhar_number: string;
  feedback: string | null;
}


export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}


export interface ErrorResponse {
  message?: string;
}



export interface UserCountResponse {
  message: string;
  data: UserCount[];
}

export interface UserCount {
  user_type: string;
  count: number;
}

export interface UsersResponse {
  message: string;
  data: User[];
}

export interface UserState {
  userCounts: UserCount[] | null;
  users: User[] | null;
  selectedUser: User | null; 
  loading: boolean;
  error: string | null;
}