

export interface AroundThis {
  title: string;
  distance: string;
  create_date: string;
}

export interface Size {
  build_up_area: string;
  carpet_area: string;
  floor_plan: string;
  create_date: string;
}

export interface Project {
  property_id: number;
  project_name: string;
  property_type: string;
  property_subtype: string;
  builder_name: string;
  state: string;
  city: string;
  locality: string;
  brochure: string;
  price_sheet: string;
  construction_status: string;
  possession_end_date: string | null;
  upcoming_project: string;
  posted_by: string;
  user_id: string;
  created_date: string;
  sizes: Size[];
  around_this: AroundThis[];
}

export interface ProjectsResponse {
  message: string;
  data: Project[];
}