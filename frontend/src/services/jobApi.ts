import axios from 'axios';
import type { Job, CreateJobData, JobStatus } from '../types/job';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobApi = {
  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get('');
    return response.data;
  },

  createJob: async (data: CreateJobData): Promise<Job> => {
    const response = await apiClient.post('', data);
    return response.data;
  },

  updateJobStatus: async (id: string, status: JobStatus): Promise<void> => {
    await apiClient.patch(`/${id}/status`, { status });
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },
};
