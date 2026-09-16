import { useState, useMemo, useEffect } from 'react';
import { useJobs } from '../hooks/useJobs';
import { JobCard } from './JobCard';
import { JobForm } from './JobForm';
import type { JobStatus } from '../types/job';
import { AlertCircle, RefreshCw, Plus, LayoutGrid, CheckCircle2, XCircle, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';

export function Dashboard() {
  const { jobs, isLoading, error, createJob, updateJobStatus, deleteJob, refreshJobs } = useJobs();
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const counts = useMemo(() => {
    return {
      pending: jobs.filter(j => j.status === 'pending').length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (filter === 'all') return jobs;
    return jobs.filter(j => j.status === filter);
  }, [jobs, filter]);

  return (
    <div className="min-h-screen pt-8 pb-12 px-6 lg:px-10 animate-fade-in relative transition-colors duration-300">
      <div className="max-w-[1450px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[clamp(30px,3vw,44px)] font-extrabold text-slate-900 dark:text-[#f8fafc] leading-[1.1] tracking-[-0.04em] transition-colors duration-300">
              Mini Job Queue Dashboard
            </h1>
            <p className="text-[15px] font-normal text-slate-600 dark:text-[#94a3b8] mt-1 transition-colors duration-300">Manage and monitor background processing tasks</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={toggleTheme}
              className="w-[46px] h-[46px] flex items-center justify-center border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[12px] bg-white dark:bg-[rgba(17,26,43,0.8)] text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#172237] hover:border-slate-300 dark:hover:border-[rgba(59,130,246,0.35)] transition-all duration-200"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={refreshJobs}
              className="w-[46px] h-[46px] flex items-center justify-center border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[12px] bg-white dark:bg-[rgba(17,26,43,0.8)] text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#172237] hover:border-slate-300 dark:hover:border-[rgba(59,130,246,0.35)] transition-all duration-200"
              title="Refresh jobs"
            >
              <RefreshCw size={20} className={clsx("transition-transform duration-500", isLoading && "animate-spin")} />
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="h-[46px] flex items-center gap-[9px] px-5 border-0 rounded-[11px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-[14px] font-semibold cursor-pointer shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:-translate-y-[1px] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] active:translate-y-0 transition-all duration-200"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create Job
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-7 p-[13px_16px] bg-red-50 dark:bg-[rgba(239,68,68,0.07)] border border-red-200 dark:border-[rgba(239,68,68,0.20)] rounded-[10px] text-red-600 dark:text-[#fca5a5] text-[13px] flex items-center gap-3 transition-colors duration-300">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Status Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7 relative z-10">
          {[
            { label: 'Pending', count: counts.pending, icon: LayoutGrid, color: 'text-amber-500 dark:text-[#facc15]', bg: 'bg-amber-50 dark:bg-[rgba(250,204,21,0.08)]', glowClass: 'dark:after:bg-[rgba(250,204,21,0.05)]' },
            { label: 'Running', count: counts.running, icon: RefreshCw, color: 'text-blue-500 dark:text-[#60a5fa]', bg: 'bg-blue-50 dark:bg-[rgba(59,130,246,0.09)]', glowClass: 'dark:after:bg-[rgba(59,130,246,0.05)]' },
            { label: 'Completed', count: counts.completed, icon: CheckCircle2, color: 'text-emerald-500 dark:text-[#22c55e]', bg: 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.09)]', glowClass: 'dark:after:bg-[rgba(34,197,94,0.05)]' },
            { label: 'Failed', count: counts.failed, icon: XCircle, color: 'text-red-500 dark:text-[#f87171]', bg: 'bg-red-50 dark:bg-[rgba(239,68,68,0.09)]', glowClass: 'dark:after:bg-[rgba(239,68,68,0.05)]' },
          ].map((stat, i) => (
            <div 
              key={stat.label} 
              className={clsx("glass-card min-h-[128px] p-[22px] overflow-hidden rounded-[17px] flex flex-col justify-between relative cursor-default after:content-[''] after:absolute after:w-[130px] after:h-[130px] after:-right-[60px] after:-bottom-[75px] after:rounded-full after:blur-[10px] z-0", stat.glowClass)}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between z-10 relative">
                <span className="text-slate-500 dark:text-[#94a3b8] text-[14px] font-medium transition-colors duration-300">{stat.label}</span>
                <div className={clsx('w-[44px] h-[44px] flex items-center justify-center rounded-[12px] border border-slate-100 dark:border-[rgba(255,255,255,0.08)] transition-colors duration-300', stat.bg, stat.color)}>
                  <stat.icon size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div className="z-10 relative">
                <div className="mt-2.5 text-[34px] leading-none font-bold text-slate-900 dark:text-[#f8fafc] transition-colors duration-300">{stat.count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 mb-5 relative z-10">
          <div className="flex flex-wrap gap-[9px]">
            {(['all', 'pending', 'running', 'completed', 'failed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={clsx(
                  'h-[40px] px-[17px] border rounded-[10px] text-[13px] font-medium capitalize transition-all duration-200',
                  filter === status 
                    ? 'text-white border-transparent bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_7px_20px_rgba(37,99,235,0.22)]' 
                    : 'bg-white dark:bg-[#111a2b] border-slate-200 dark:border-[rgba(148,163,184,0.14)] text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:border-slate-300 dark:hover:border-[rgba(59,130,246,0.3)] hover:bg-slate-50 dark:hover:bg-[#162136]'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Job Grid */}
        {isLoading && jobs.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center relative z-10">
            <div className="w-[30px] h-[30px] border-[3px] border-slate-200 dark:border-[rgba(148,163,184,0.15)] border-t-[#3b82f6] dark:border-t-[#3b82f6] rounded-full animate-spin"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-[70px] px-5 text-center relative z-10">
            <div className="text-slate-700 dark:text-[#cbd5e1] text-[16px] font-semibold mb-1.5 transition-colors duration-300">No jobs found</div>
            <p className="text-slate-500 dark:text-[#64748b] text-[13px] max-w-sm mx-auto transition-colors duration-300">
              {filter === 'all' ? "The queue is completely empty. Create a new job to get started." : `There are no ${filter} jobs at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {filteredJobs.map((job, i) => (
              <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${(i % 10) * 50}ms` }}>
                <JobCard 
                  job={job} 
                  onUpdateStatus={updateJobStatus} 
                  onDelete={deleteJob} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <JobForm 
          onSubmit={createJob} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
