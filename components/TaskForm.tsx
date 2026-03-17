"use client";

import { useState, FormEvent } from 'react';
import { TaskType } from '../hooks/useTasks';

interface Props {
  initial?: Partial<TaskType>;
  users?: { id: number; name: string }[];
  onSubmit: (task: Partial<TaskType>) => Promise<any>;
  submitLabel?: string;
}

export default function TaskForm({
  initial = {},
  users = [],
  onSubmit,
  submitLabel = 'Save Task',
}: Props) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [priority, setPriority] = useState(initial.priority || 'Low');
  const [dueDate, setDueDate] = useState(initial.dueDate?.split('T')[0] || '');
  const [assignedTo, setAssignedTo] = useState(initial.assignedTo?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!initial.title;

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        dueDate,
        assignedTo: assignedTo ? parseInt(assignedTo) : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Priority dot colour — fully static classes so Tailwind includes them
  const priorityDot =
    priority === 'High' ? 'bg-rose-400' :
      priority === 'Medium' ? 'bg-amber-400' :
        'bg-emerald-400';

  return (
    <div className="relative bg-[#0f1623] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* ── HEADER ── */}
      <div className="relative px-8 pt-8 pb-7 border-b border-white/[0.06] bg-white/[0.02]">
        {/* Glow blob */}
        <div className="absolute top-0 right-0 w-48 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start gap-4">
          {/* Icon tile */}
          <div className="w-11 h-11 bg-blue-500/15 border border-blue-500/25 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            {isEdit ? (
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>

          <div>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                {isEdit ? 'Edit Task' : 'New Task'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {isEdit ? 'Update Task Details' : 'Create New Task'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fill out the details below to {isEdit ? 'update the assigned work.' : 'assign work to your team.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <form onSubmit={handle} className="px-8 py-8 space-y-7">

        {/* Task Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Task Title
          </label>
          <input
            className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            placeholder="e.g. Design homepage UI"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h12" />
            </svg>
            Description
          </label>
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 min-h-[120px] resize-none"
            placeholder="Describe the task in detail…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Row — Priority · Due Date · Assign To */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Priority
            </label>
            <div className="relative">
              {/* Live-coloured priority dot */}
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${priorityDot}`} />
              <select
                className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl pl-8 pr-8 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="Low" style={{ background: '#0f1623', color: '#86efac' }}>Low</option>
                <option value="Medium" style={{ background: '#0f1623', color: '#fcd34d' }}>Medium</option>
                <option value="High" style={{ background: '#0f1623', color: '#fca5a5' }}>High</option>
              </select>
              {/* Chevron */}
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due Date
            </label>
            <input
              type="date"
              className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 [color-scheme:dark]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assign To
            </label>
            <div className="relative">
              <select
                className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-4 pr-9 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="" style={{ background: '#0f1623', color: '#64748b' }}>Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} style={{ background: '#0f1623', color: '#e2e8f0' }}>
                    {u.name}
                  </option>
                ))}
              </select>
              {/* Chevron */}
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">

          {/* Left hint */}
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">All changes are saved immediately.</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              inline-flex items-center gap-2
              px-7 py-3 rounded-xl text-sm font-bold text-white
              bg-blue-600 hover:bg-blue-500
              border border-blue-500/50
              shadow-lg shadow-blue-900/30
              transition-all duration-200 active:scale-[0.97]
              ${isSubmitting
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:-translate-y-0.5 hover:shadow-blue-700/40'}
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                {submitLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}