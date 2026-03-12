"use client";

import { useState, FormEvent } from 'react';
import { TaskType } from '../hooks/useTasks';

interface Props {
  initial?: Partial<TaskType>;
  users?: { id: number; name: string }[];
  onSubmit: (task: Partial<TaskType>) => Promise<any>;
  submitLabel?: string;
}

export default function TaskForm({ initial = {}, users = [], onSubmit, submitLabel = 'Save' }: Props) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [priority, setPriority] = useState(initial.priority || 'Low');
  const [dueDate, setDueDate] = useState(initial.dueDate?.split('T')[0] || '');
  const [assignedTo, setAssignedTo] = useState(initial.assignedTo?.toString() || '');

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, priority, dueDate, assignedTo: assignedTo ? parseInt(assignedTo) : undefined });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="mt-1 block w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 block w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Due date</label>
          <input
            type="date"
            className="mt-1 block w-full border rounded p-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Assign To</label>
          <select
            className="mt-1 block w-full border rounded p-2"
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
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
