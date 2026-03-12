"use client";

import { TaskType } from '../hooks/useTasks';
import clsx from 'clsx';

interface Props {
  task: TaskType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const priorityColors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    High: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className={clsx(
          "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
          priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Low
        )}>
          {task.priority || 'Low'} Priority
        </span>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Edit Task"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Task"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
        <div className="flex items-center text-[11px] font-semibold text-gray-400">
          <span className="mr-1">📅</span>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </div>

        <div className={clsx(
          "px-2 py-1 rounded-lg text-[10px] font-black uppercase",
          task.status === 'completed' ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"
        )}>
          {task.status === 'completed' ? '✓ Done' : 'Pending'}
        </div>
      </div>
    </div>
  );
}
