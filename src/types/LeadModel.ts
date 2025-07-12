
export interface ErrorResponse {
  message?: string;
}

export interface Lead {
  lead_id: number;
  customer_name: string;
  customer_phone_number: string;
  customer_email: string;
  interested_project_id: number;
  interested_project_name: string;
  lead_source_id: number;
  created_date: string;
  created_time: string;
  updated_date: string;
  updated_time: string;
  assigned_id: number;
  assigned_name: string;
  assigned_emp_number: string;
  assigned_priority: string;
  follow_up_feedback: string | null;
  next_action: string | null;
  assigned_date: string;
  assigned_time: string;
  booked: string;
  lead_added_user_type: string;
  lead_added_user_id: number;
  assigned_user_type: number;
  status_id: number;
  sqft: number | null;
  budget: string | null;
  status_name: string;
}

export interface LeadUpdate {
  update_id: number;
  lead_id: number;
  update_date: string;
  update_time: string;
  feedback: string;
  next_action: string;
  updated_by_emp_type: number;
  updated_by_emp_id: number;
  updated_by_emp_name: string;
  updated_emp_phone: string;
  status_id: number | null;
  lead_added_user_id: number;
  lead_added_user_type: number;
  status_name: string | null;
}

export interface LeadsResponse {
  status: string;
  results: Lead[];
}

export interface LeadUpdatesResponse {
  results: LeadUpdate[];
}

export interface LeadStatus {
  status_id: number;
  status_name: string;
  is_default: number;
}

export interface LeadStatusResponse {
  status: string;
  results: LeadStatus[];
}

export interface LeadSource {
  lead_source_id: number;
  lead_source_name: string;
  created_date: string;
  updated_date: string;
}

export interface LeadSourceResponse {
  status: string;
  results: LeadSource[];
}

export interface LeadState {
  leads: Lead[] | null;
  leadUpdates: LeadUpdate[] | null;
  bookedLeads: Lead[] | null;
  leadStatuses: LeadStatus[] | null;
  leadSources: LeadSource[] | null;
  loading: boolean;
  error: string | null;
}

export interface InsertLeadResponse {
  status: string;
  message: string;
  lead_id: number;
}

export interface AssignLeadResponse {
  status: string;
  message: string;
  data: Lead;
}

export interface BookingDoneResponse {
  status: string;
  message: string;
  lead_id: number;
  booked_id:number;
}


export interface UpdateLeadByEmployeeResponse {
  status: string;
  message: string;
}
