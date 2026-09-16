import { useState, useEffect, useCallback } from 'react';
import type { Job, CreateJobData, JobStatus } from '../types/job';
import { jobApi } from '../services/jobApi';
import axios from 'axios';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await jobApi.getJobs();
      setJobs(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs. Is the backend running?');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(true);
    
    // Auto-polling every 10 seconds to keep tabs synchronized (Bonus requirement)
    const interval = setInterval(() => {
      fetchJobs(false);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const createJob = async (data: CreateJobData) => {
    try {
      const newJob = await jobApi.createJob(data);
      setJobs(prev => [newJob, ...prev]);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create job';
      throw new Error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const updateJobStatus = async (id: string, status: JobStatus) => {
    try {
      await jobApi.updateJobStatus(id, status);
      setJobs(prev => prev.map(job => (job.id === id ? { ...job, status } : job)));
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        // Race condition or invalid transition from backend
        setError(err.response.data.message || 'Job status changed elsewhere. Refreshing...');
        await fetchJobs(false);
      } else {
        setError(err.response?.data?.message || 'Failed to update job status');
      }
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await jobApi.deleteJob(id);
      setJobs(prev => prev.filter(job => job.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
      throw err;
    }
  };

  return {
    jobs,
    isLoading,
    error,
    createJob,
    updateJobStatus,
    deleteJob,
    refreshJobs: () => fetchJobs(true),
  };
}
