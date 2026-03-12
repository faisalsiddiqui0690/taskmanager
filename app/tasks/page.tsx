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
  const perPage = 6;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">📋</span>
            My Tasks
          </h1>
          <div className="flex gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700 w-full sm:w-64 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-bold text-slate-700 cursor-pointer transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {editing && (
          <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg border border-indigo-100 relative max-w-2xl mx-auto">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition">✕</button>
            <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-600">✏️</span> Edit Task
            </h2>
            <TaskForm
              users={users}
              initial={editing}
              submitLabel="Save Changes"
              onSubmit={async (data) => {
                await update(editing.id || editing._id, data);
                setEditing(null);
              }}
            />
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks
              .filter((t) => {
                if (filter !== 'all' && t.status !== filter) return false;
                if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
                return true;
              })
              .slice((page - 1) * perPage, page * perPage)
              .map((t) => (
                <TaskCard
                  key={t.id || (t as any)._id}
                  task={t}
                  onEdit={() => setEditing(t)}
                  onDelete={() => remove(t.id || (t as any)._id)}
                />
              ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No tasks found</h3>
            <p className="text-slate-400 font-medium max-w-md mx-auto">You don't have any tasks matching your filters. Adjust your search or click 'New Task' to get started!</p>
          </div>
        )}

        {tasks.length > perPage && (
          <div className="flex justify-center mt-12 space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
            >
              Previous
            </button>
            <div className="flex items-center px-4 font-bold text-slate-500 bg-slate-100 rounded-xl">
              Page {page}
            </div>
            <button
              disabled={page * perPage >= tasks.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
