import { useState } from 'react';
import type { CreateJobData } from '../types/job';
import { X } from 'lucide-react';

interface JobFormProps {
  onSubmit: (data: CreateJobData) => Promise<boolean>;
  onClose: () => void;
}

export function JobForm({ onSubmit, onClose }: JobFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('data-processing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title, type });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-slate-900/40 dark:bg-[rgba(2,6,23,0.75)] backdrop-blur-[8px] animate-fade-in">
      <div className="w-[min(100%,470px)] p-[26px] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] rounded-[18px] bg-white dark:bg-gradient-to-br dark:from-[#121c2e] dark:to-[#0d1524] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.50)] animate-slide-up relative">
        <button 
          onClick={onClose}
          className="absolute top-[26px] right-[26px] text-slate-400 dark:text-[#64748b] hover:text-slate-900 dark:hover:text-[#f8fafc] transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="m-[0_0_6px] text-slate-900 dark:text-[#f8fafc] text-[20px] font-bold">Create New Job</h2>
        <p className="m-[0_0_22px] text-slate-500 dark:text-[#64748b] text-[13px]">Add a new task to the processing queue.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-[17px]">
            <label htmlFor="title" className="block mb-[7px] text-slate-700 dark:text-[#cbd5e1] text-[12px] font-semibold">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[44px] px-[13px] border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[9px] bg-slate-50 dark:bg-[#0b1322] text-slate-900 dark:text-[#f8fafc] text-[13px] outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-[#475569] focus:border-blue-500 dark:focus:border-[rgba(59,130,246,0.55)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
              placeholder="e.g. Process May 2026 Invoices"
              required
              autoFocus
            />
          </div>

          <div className="mb-[17px]">
            <label htmlFor="type" className="block mb-[7px] text-slate-700 dark:text-[#cbd5e1] text-[12px] font-semibold">
              Job Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-[44px] px-[13px] border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[9px] bg-slate-50 dark:bg-[#0b1322] text-slate-900 dark:text-[#f8fafc] text-[13px] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[rgba(59,130,246,0.55)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] appearance-none cursor-pointer"
              >
                <option value="data-processing">Data Processing</option>
                <option value="report-generation">Report Generation</option>
                <option value="email-campaign">Email Campaign</option>
                <option value="system-backup">System Backup</option>
                <option value="image-optimization">Image Optimization</option>
              </select>
              <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-[#64748b]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-[9px] mt-[24px]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[42px] px-[17px] border border-slate-200 dark:border-[rgba(148,163,184,0.14)] rounded-[9px] bg-white dark:bg-[#10192a] text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#172237] cursor-pointer text-[13px] font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="h-[42px] flex items-center gap-[6px] px-[17px] border-0 rounded-[9px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-[13px] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.25)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-[14px] h-[14px] border-[2px] border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
