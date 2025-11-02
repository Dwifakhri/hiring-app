export interface Jobs {
  id: number;
  department: string;
  status: string;
  salary_range: { min: number; max: number };
  job_name: string;
  job_type: string;
  job_description: string;
  number_candidates: number;
  company: string;
  location: string;
  created_date: string;
  profile_configuration: {
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
  phone: string;
  country_code: string;
  domicile: string;
  gender: string;
  linkedin: string;
  birth: string;
  photo_profile: string;
}
