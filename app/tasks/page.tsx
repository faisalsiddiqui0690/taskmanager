"use client";

import { useState } from 'react';
import useTasks from '../../hooks/useTasks';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import Loader from '../../components/Loader';

export default function TasksPage() {
  const { tasks, users, loading, update, remove } = useTasks();
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [page, setPage] = useState(1);
  const perPage = 5;

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Tasks</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {editing && (
        <div className="mb-4">
          <h2 className="text-xl">Edit task</h2>
          <TaskForm
            users={users}
            initial={editing}
            submitLabel="Update"
            onSubmit={async (data) => {
              await update(editing._id, data);
              setEditing(null);
            }}
          />
        </div>
      )}
      <div className="space-y-2">
        {tasks
          .filter((t) => {
            if (filter !== 'all' && t.status !== filter) return false;
            if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
          })
          .slice((page - 1) * perPage, page * perPage)
          .map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              onEdit={() => setEditing(t)}
              onDelete={() => remove(t._id)}
            />
          ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page * perPage >= tasks.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
