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

  const filtered = tasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-200 pb-16">

      {/* ── Background glows ── */}
      <div className="fixed top-0 right-0 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

          {/* Title */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Tasks</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">My Tasks</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {pending} pending · {completed} completed · {total} total
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks…"
                className="w-full sm:w-60 bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Filter select */}
            <div className="relative">
              <select
                className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-4 pr-9 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
                value={filter}
                onChange={(e) => { setFilter(e.target.value as any); setPage(1); }}
              >
                <option value="all" style={{ background: '#0f1623', color: '#e2e8f0' }}>All Status</option>
                <option value="pending" style={{ background: '#0f1623', color: '#fcd34d' }}>Pending</option>
                <option value="completed" style={{ background: '#0f1623', color: '#86efac' }}>Completed</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── MINI STATS ROW ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Total',
              value: total,
              dot: 'bg-slate-500',
              color: 'text-white',
            },
            {
              label: 'Pending',
              value: pending,
              dot: 'bg-amber-400',
              color: 'text-amber-400',
            },
            {
              label: 'Completed',
              value: completed,
              dot: 'bg-emerald-400',
              color: 'text-emerald-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{s.label}</span>
              </div>
              <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* ── EDIT FORM MODAL ── */}
        {editing && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setEditing(null)}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center bg-[#0f1623] border border-white/[0.10] hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-full transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
          </div>
        )}

        {/* ── TASK GRID ── */}
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-white/[0.07] rounded-2xl p-16 text-center bg-white/[0.01]">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No tasks found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No tasks match your current filters. Try adjusting your search or create a new task to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((t) => (
              <TaskCard
                key={t.id || (t as any)._id}
                task={t}
                onEdit={() => setEditing(t)}
                onDelete={() => remove(t.id || (t as any)._id)}
                onStatusChange={async (status) => { await update(t.id || (t as any)._id, { status }); }}
              />
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">

            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.14] rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-150 ${p === page
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                      : 'bg-white/[0.03] border border-white/[0.07] text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.14] rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}