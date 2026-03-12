"use client";

import { TaskType } from '../hooks/useTasks';
import clsx from 'clsx';

interface Props {
  task: TaskType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  return (
    <div
      className={clsx('p-4 rounded shadow-sm', {
        'bg-green-50': task.status === 'completed',
        'bg-white': task.status === 'pending',
      })}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="space-x-2">
          {onEdit && (
            <button onClick={onEdit} className="text-blue-500 hover:underline">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-500 hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
      {task.description && <p className="mt-2 text-sm">{task.description}</p>}
      <div className="mt-2 text-xs text-gray-500">
        Priority: {task.priority} | Due: {task.dueDate?.split('T')[0] || '—'}
      </div>
    </div>
  );
}
