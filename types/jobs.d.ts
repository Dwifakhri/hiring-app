export interface Jobs {
  id: number;
  status: string;
  salary_min: number;
  salary_max: number;
  job_name: string;
  job_type: string;
  job_description: string;
  number_candidates: number;
  company: string;
  location: string;
  created_date: string;
  has_applied: boolean;
  profile_config: {
    full_name: string;
    email: string;
    photo_profile: string;
    gender: string;
    domicile: string;
    phone: string;
    linkedin: string;
    birth: string;
  };
  applicants: Applicant[];
}

export interface Applicant {
  id: number;
  full_name: string;
  email: string;
  photo_profile: string;
  gender: string;
  domicile: string;
  phone: string;
  linkedin: string;
  birth: string;
}
