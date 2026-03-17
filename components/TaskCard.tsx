"use client";

import { TaskType } from '../hooks/useTasks';
import useAuth from '../hooks/useAuth';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  task: TaskType;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: 'pending' | 'started' | 'completed') => Promise<void>;
}

const PRIORITY_CONFIG = {
  Low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  High: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-400' },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const priority = (task.priority as keyof typeof PRIORITY_CONFIG) || 'Low';
  const p = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Low;

  const isCompleted = task.status === 'completed';
  const isStarted = task.status === 'started';
  const isPending = task.status === 'pending';

  const isAssignee = user?.id?.toString() === task.assignedTo?.toString();

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  // Check if overdue
  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  const handleStatusUpdate = async (newStatus: 'started' | 'completed') => {
    if (onStatusChange) {
      setIsUpdating(true);
      try {
        await onStatusChange(newStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const canEdit = (user?.role === 'admin' || user?.role === 'super_admin');

  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.055] hover:border-white/[0.13] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 transition-all duration-200 overflow-hidden flex flex-col gap-4">

      {/* Hover glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/0 group-hover:bg-blue-500/8 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />

      {/* Status overlay tints */}
      {isCompleted && <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none rounded-2xl" />}
      {isStarted && <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none rounded-2xl" />}

      {/* ── TOP ROW: Priority badge + actions ── */}
      <div className="flex items-start justify-between gap-3">

        {/* Priority badge */}
        <span className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border',
          p.bg, p.border, p.text
        )}>
          <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', p.dot)} />
          {priority} Priority
        </span>

        {/* Edit / Delete — visible ONLY for admins or super admins */}
        {(canEdit && (onEdit || onDelete)) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                title="Edit Task"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 transition-all duration-150 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                title="Delete Task"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 transition-all duration-150 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── TITLE + DESCRIPTION ── */}
      <div className="flex-1">
        <h3 className={clsx(
          'font-bold text-base leading-snug mb-2 transition-colors duration-200',
          isCompleted ? 'text-slate-500 line-through' : 'text-white group-hover:text-blue-300'
        )}>
          {task.title}
        </h3>

        {task.description && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Due date (Restored) */}
        <div className={clsx(
          'mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider',
          isOverdue ? 'text-rose-400' : 'text-slate-500'
        )}>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate
            ? <>{isOverdue && <span className="text-rose-400">Overdue · </span>}{formattedDate}</>
            : <span className="text-slate-600">No deadline</span>
          }
        </div>
      </div>

      {/* ── ASSIGNMENT INFO ── */}
      <div className="grid grid-cols-2 gap-4 text-[10px] font-semibold tracking-wide uppercase">
        <div className="space-y-1.5 flex flex-col">
          <span className="text-slate-600">Assigned By</span>
          <div className="flex items-center gap-1.5 text-blue-400/80 bg-blue-500/5 border border-blue-500/10 rounded-md px-2 py-1 truncate">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{task.Assigner?.name || 'Unknown'}</span>
          </div>
        </div>
        <div className="space-y-1.5 flex flex-col">
          <span className="text-slate-600">Assigned To</span>
          <div className="flex items-center gap-1.5 text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 rounded-md px-2 py-1 truncate">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{task.Assignee?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">

        {/* Workflow Actions */}
        {isAssignee && !isCompleted && (
          <div className="flex items-center gap-2">
            {isPending && (
              <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('started')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? '...' : 'Start Task'}
              </button>
            )}
            {isStarted && (
              <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('completed')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? '...' : 'Submit'}
              </button>
            )}
          </div>
        )}

        {/* Status badge */}
        <span className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border flex-shrink-0',
          isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          isStarted ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          'bg-white/[0.04] border-white/[0.08] text-slate-500'
        )}>
          {isCompleted ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </>
          ) : isStarted ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Started
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
              Pending
            </>
          )}
        </span>
      </div>
    </div>
  );
}