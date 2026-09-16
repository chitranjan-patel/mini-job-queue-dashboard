import { useState } from 'react';
import type { Job, JobStatus } from '../types/job';
import { Play, Check, XCircle, Trash2, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (id: string, status: JobStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function JobCard({ job, onUpdateStatus, onDelete }: JobCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (status: JobStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(job.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    try {
      await onDelete(job.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const statusStyles = {
    pending: 'text-amber-500 dark:text-[#facc15] bg-amber-50 dark:bg-[rgba(250,204,21,0.08)] border-amber-200 dark:border-[rgba(250,204,21,0.22)]',
    running: 'text-blue-500 dark:text-[#60a5fa] bg-blue-50 dark:bg-[rgba(59,130,246,0.08)] border-blue-200 dark:border-[rgba(59,130,246,0.22)]',
    completed: 'text-emerald-500 dark:text-[#34d399] bg-emerald-50 dark:bg-[rgba(34,197,94,0.08)] border-emerald-200 dark:border-[rgba(34,197,94,0.22)]',
    failed: 'text-red-500 dark:text-[#f87171] bg-red-50 dark:bg-[rgba(239,68,68,0.08)] border-red-200 dark:border-[rgba(239,68,68,0.22)]',
  };

  return (
    <>
      <div className="glass-card min-h-[128px] p-[22px] rounded-[17px] flex flex-col h-full group z-0">
        <div className="flex justify-between items-start mb-5 gap-3">
          <div className="overflow-hidden">
            <h3 className="font-semibold text-slate-900 dark:text-[#f8fafc] truncate text-[14px] transition-colors duration-300">{job.title}</h3>
            <p className="mt-[4px] text-[12px] text-slate-500 dark:text-[#64748b] truncate max-w-full transition-colors duration-300">
              ID: {job.id.substring(0, 8)}...
            </p>
          </div>
          <span className={clsx('px-[10px] py-[6px] text-[10px] font-bold rounded-[7px] border uppercase tracking-[0.05em] shrink-0 transition-colors duration-300', statusStyles[job.status])}>
            {job.status}
          </span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center px-[10px] py-[5px] rounded-[7px] bg-purple-50 dark:bg-[rgba(168,85,247,0.10)] border border-purple-200 dark:border-[rgba(168,85,247,0.18)] text-purple-600 dark:text-[#c084fc] text-[11px] font-semibold transition-colors duration-300">
            {job.type}
          </span>
          <span className="text-slate-500 dark:text-[#64748b] text-[11px] flex items-center gap-1 transition-colors duration-300">
            <Clock size={12} />
            {new Date(job.createdAt).toLocaleString(undefined, { 
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </span>
        </div>

        <div className="mt-auto pt-[15px] flex justify-between items-center border-t border-slate-100 dark:border-[rgba(148,163,184,0.08)] transition-colors duration-300">
          <div className="flex gap-[8px]">
            {job.status === 'pending' && (
              <button
                onClick={() => handleUpdate('running')}
                disabled={isUpdating}
                className="h-[34px] inline-flex items-center gap-[6px] px-[12px] rounded-[8px] text-[12px] font-semibold transition-all duration-200 text-blue-600 dark:text-[#60a5fa] bg-blue-50 dark:bg-[rgba(59,130,246,0.08)] border border-blue-200 dark:border-[rgba(59,130,246,0.20)] hover:bg-blue-100 dark:hover:bg-[rgba(59,130,246,0.16)] hover:border-blue-300 dark:hover:border-[rgba(59,130,246,0.40)] disabled:opacity-50"
              >
                <Play size={12} fill="currentColor" /> Run
              </button>
            )}
            {job.status === 'running' && (
              <>
                <button
                  onClick={() => handleUpdate('completed')}
                  disabled={isUpdating}
                  className="h-[34px] inline-flex items-center gap-[6px] px-[12px] rounded-[8px] text-[12px] font-semibold transition-all duration-200 text-emerald-600 dark:text-[#34d399] bg-emerald-50 dark:bg-[rgba(34,197,94,0.08)] border border-emerald-200 dark:border-[rgba(34,197,94,0.20)] hover:bg-emerald-100 dark:hover:bg-[rgba(34,197,94,0.15)] disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={3} /> Complete
                </button>
                <button
                  onClick={() => handleUpdate('failed')}
                  disabled={isUpdating}
                  className="h-[34px] inline-flex items-center gap-[6px] px-[12px] rounded-[8px] text-[12px] font-semibold transition-all duration-200 text-red-600 dark:text-[#f87171] bg-red-50 dark:bg-[rgba(239,68,68,0.08)] border border-red-200 dark:border-[rgba(239,68,68,0.20)] hover:bg-red-100 dark:hover:bg-[rgba(239,68,68,0.15)] disabled:opacity-50"
                >
                  <XCircle size={14} /> Fail
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-[34px] h-[34px] inline-flex items-center justify-center rounded-[8px] border border-transparent text-slate-400 dark:text-[#64748b] hover:text-red-500 dark:hover:text-[#f87171] hover:bg-red-50 dark:hover:bg-[rgba(239,68,68,0.08)] hover:border-red-200 dark:hover:border-[rgba(239,68,68,0.15)] disabled:opacity-50 transition-all duration-200"
            title="Delete job"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-slate-900/40 dark:bg-[rgba(2,6,23,0.75)] backdrop-blur-[8px]">
          <div className="w-[min(100%,470px)] p-[26px] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] rounded-[18px] bg-white dark:bg-gradient-to-br dark:from-[#121c2e] dark:to-[#0d1524] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.50)] animate-slide-up">
            <h3 className="m-[0_0_6px] text-slate-900 dark:text-[#f8fafc] text-[20px] font-bold">Delete Job?</h3>
            <p className="m-[0_0_22px] text-slate-500 dark:text-[#64748b] text-[13px]">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-[#cbd5e1]">"{job.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-[9px] mt-[24px]">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="h-[42px] px-[17px] border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[9px] bg-white dark:bg-[#10192a] text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#172237] cursor-pointer text-[13px] font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="h-[42px] px-[17px] border-0 rounded-[9px] bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white text-[13px] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(220,38,38,0.25)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(220,38,38,0.35)] active:translate-y-0 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
