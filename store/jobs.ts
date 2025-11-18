import { create } from 'zustand';
import { Jobs } from '@/types/jobs';
import { api } from '@/lib/axios';
import { getErrorResponse } from '@/utils/getErrorResponse';

interface JobsState {
  jobs: Jobs[];
  meta: object | null;
  isLoading: boolean;
  isLoadingAction: boolean;
  jobDetail: Jobs | null;
  error: string | null;
  fetchJobs: (params?: {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    search?: string;
  }) => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  createJob: (job: CreateJobInput) => Promise<void>;
  applyForJob: (job: ApplyJob, id: string) => Promise<void>;
  clearError: () => void;
}

interface CreateJobInput {
  salary_min: number;
  salary_max: number;
  job_name: string;
  job_type: string;
  job_description: string;
  number_candidates: number;
  company: string;
  location: string;
  status?: string;
  profile_config?: {
    gender?: string;
    domicile?: string;
    phone?: string;
    linkedin?: string;
    birth?: string;
  };
}

interface ApplyJob {
  full_name: string;
  photo_profile: string;
  birth: string;
  gender: string;
  domicile: string;
  phone: string;
  email: string;
  country_code: string;
  linkedin: string;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  meta: null,
  jobDetail: null,
  isLoading: true,
  isLoadingAction: false,
  error: null,

  // Fetch all jobs with pagination
  fetchJobs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 100),
        sort: params.sort || 'desc',
        search: params.search || '',
      });

      const response = await api.get(`/jobs?${queryParams}`);

      const result = await response.data;

      set({ jobs: result.data, meta: result.meta, isLoading: false });
    } catch (error) {
      getErrorResponse(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single job by ID (async from API)
  fetchJobById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/jobs/${id}`);

      const result = await response.data;

      set({ jobDetail: result, isLoading: false, error: null });
    } catch (error) {
      const message = getErrorResponse(error);
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new job
  createJob: async (job: CreateJobInput) => {
    set({ isLoadingAction: true, error: null });
    try {
      const response = await api.post('/jobs', job);

      const result = await response.data.job;

      // Add new job to the store
      const currentJobs = get().jobs;
      set({
        jobs: [result, ...currentJobs],
        meta: result.meta,
      });
      return result;
    } catch (error) {
      const message = getErrorResponse(error);
      throw new Error(message);
    } finally {
      set({ isLoadingAction: false });
    }
  },

  // Apply for job
  applyForJob: async (payload: ApplyJob, id: string) => {
    set({ isLoadingAction: true, error: null });
    try {
      const response = await api.post(`/jobs/${id}/application`, payload);

      return response.data;
    } catch (error) {
      const message = getErrorResponse(error);
      throw new Error(message);
    } finally {
      set({ isLoadingAction: false });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
