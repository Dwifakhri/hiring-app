import { create } from 'zustand';
import { Jobs } from '@/types/jobs';
import { mockupJobsList } from '@/database/jobs/mockupJobList';

interface JobsState {
  jobs: Jobs[];
  initializeJobs: () => void;
  getJobs: () => Jobs[];
  getJobById: (id: number) => Jobs | undefined;
  createJob: (job: Jobs) => void;
  updateJob: (id: number, job: Partial<Jobs>) => void;
  deleteJob: (id: number) => void;
}

const STORAGE_KEY = 'hiring-app-jobs';

// Helper to load jobs from localStorage
const loadJobsFromStorage = (): Jobs[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing jobs from localStorage:', error);
    }
  }
  return [];
};

// Helper to save jobs to localStorage
const saveJobsToStorage = (jobs: Jobs[]) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error);
  }
};

// Initialize jobs with mockup data (add empty applications array)
const initializeMockupJobs = (): Jobs[] => {
  return mockupJobsList.map((job) => ({
    ...job,
  }));
};

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],

  // Initialize jobs from localStorage or mockup data
  initializeJobs: () => {
    const storedJobs = loadJobsFromStorage();

    if (storedJobs.length > 0) {
      set({ jobs: storedJobs });
    } else {
      const initialJobs = initializeMockupJobs();
      set({ jobs: initialJobs });
      saveJobsToStorage(initialJobs);
    }
  },

  // Get all jobs
  getJobs: () => {
    return get().jobs;
  },

  // Get job by ID
  getJobById: (id: number) => {
    return get().jobs.find((job) => job.id === id);
  },

  // Create new job
  createJob: (job: Jobs) => {
    const currentJobs = get().jobs;
    const newJobs = [...currentJobs, job];
    set({ jobs: newJobs });
    saveJobsToStorage(newJobs);
  },

  // Update existing job
  updateJob: (id: number, updatedJob: Partial<Jobs>) => {
    const currentJobs = get().jobs;
    const newJobs = currentJobs.map((job) =>
      job.id === id ? { ...job, ...updatedJob } : job
    );
    set({ jobs: newJobs });
    saveJobsToStorage(newJobs);
  },

  // Delete job
  deleteJob: (id: number) => {
    const currentJobs = get().jobs;
    const newJobs = currentJobs.filter((job) => job.id !== id);
    set({ jobs: newJobs });
    saveJobsToStorage(newJobs);
  },
}));
