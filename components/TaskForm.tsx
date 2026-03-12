"use client";

import { useState, FormEvent } from 'react';
import { TaskType } from '../hooks/useTasks';

interface Props {
  initial?: Partial<TaskType>;
  users?: { id: number; name: string }[];
  onSubmit: (task: Partial<TaskType>) => Promise<any>;
  submitLabel?: string;
}

export default function TaskForm({ initial = {}, users = [], onSubmit, submitLabel = 'Save Task' }: Props) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [priority, setPriority] = useState(initial.priority || 'Low');
  const [dueDate, setDueDate] = useState(initial.dueDate?.split('T')[0] || '');
  const [assignedTo, setAssignedTo] = useState(initial.assignedTo?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, priority, dueDate, assignedTo: assignedTo ? parseInt(assignedTo) : undefined });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 p-6">
        <h2 className="text-xl font-bold text-white">{initial.title ? 'Edit Task' : 'Create New Task'}</h2>
        <p className="text-indigo-100 text-sm mt-1">Fill out the details below to assign work.</p>
      </div>
      <form onSubmit={handle} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-gray-800"
            placeholder="E.g., Design homepage UI"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-gray-800 min-h-[120px]"
            placeholder="Describe the task details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-gray-800 bg-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="Low">Low 🟢</option>
              <option value="Medium">Medium 🟡</option>
              <option value="High">High 🔴</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-gray-800"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To 👤</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-gray-800 bg-white"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
