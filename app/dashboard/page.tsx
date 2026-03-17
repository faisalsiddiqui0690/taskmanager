"use client";

import { useState } from 'react';
import useTasks from '../../hooks/useTasks';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import TaskCard from '../../components/TaskCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { tasks, loading, users, update } = useTasks();
  const { user } = useAuth();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const efficiency = total > 0 ? Math.round((completed / total) * 100) : 100;

  // Filter tasks based on user role
  const myTasks = tasks.filter(t => t.assignedTo?.toString() === user?.id?.toString());
  const assignedByMe = tasks.filter(t => t.userId?.toString() === user?.id?.toString() && t.assignedTo?.toString() !== user?.id?.toString());
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-200 pb-16 font-sans">

      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">

        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* Left text */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                  Dashboard
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Good day,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {user?.name || 'User'}
                </span>
              </h1>

              <p className="mt-4 text-base text-slate-400 max-w-xl leading-relaxed">
                You have{' '}
                <span className="text-white font-semibold">{pending} tasks pending</span>
                {' '}and{' '}
                <span className="text-emerald-400 font-semibold">{completed} completed</span>
                . Keep the momentum going.
              </p>
            </div>

            {/* CTA */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link
                href="/tasks/create"
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Assign New Task
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            label="Total Tasks"
            value={total}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
              </svg>
            }
            iconBg="bg-slate-700"
            iconColor="text-slate-300"
            accent="border-slate-700"
          />
          <StatCard
            label="Completed"
            value={completed}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            }
            iconBg="bg-emerald-500/15"
            iconColor="text-emerald-400"
            valueColor="text-emerald-400"
            accent="border-emerald-500/20"
            glow="shadow-emerald-900/20"
          />
          <StatCard
            label="In Progress"
            value={pending}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconBg="bg-amber-500/15"
            iconColor="text-amber-400"
            valueColor="text-amber-400"
            accent="border-amber-500/20"
            glow="shadow-amber-900/20"
          />
          <StatCard
            label="Efficiency"
            value={`${efficiency}%`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            iconBg="bg-blue-500/15"
            iconColor="text-blue-400"
            valueColor="text-blue-400"
            accent="border-blue-500/20"
            glow="shadow-blue-900/20"
            extra={
              <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000"
                  style={{ width: `${efficiency}%` }}
                />
              </div>
            }
          />
        </div>

        {/* ── GRID LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT MAIN ── */}
          <div className="lg:col-span-8 space-y-10">

            {/* Assigned to Me */}
            <section>
              <SectionHeader
                icon={
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                iconBg="bg-blue-500/10"
                title="Assigned to Me"
                action={<Link href="/tasks" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>}
              />
              {myTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myTasks.slice(0, 4).map((t) => (
                    <TaskCard 
                      key={t.id || (t as any)._id} 
                      task={t} 
                      onStatusChange={async (status) => { await update(t.id || (t as any)._id, { status }); }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tasks assigned to you yet." />
              )}
            </section>

            {/* Assigned by Me (Tracking Delegated Work) */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && assignedByMe.length > 0 && (
              <section>
                <SectionHeader
                  icon={
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  iconBg="bg-indigo-500/10"
                  title="Tracking: Assigned to Others"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedByMe.slice(0, 4).map((t) => (
                    <TaskCard key={t.id || (t as any)._id} task={t} />
                  ))}
                </div>
              </section>
            )}

            {/* Global Activity (Only for Super Admin) */}
            {user?.role === 'super_admin' && (
              <section>
                <SectionHeader
                  icon={
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  iconBg="bg-emerald-500/10"
                  title="Global Task Activity"
                />
                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.slice(0, 4).map((t) => (
                      <TaskCard key={t.id || (t as any)._id} task={t} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No global activity found." />
                )}
              </section>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Team Members */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-200">Team Members</span>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  {users.length}
                </span>
              </div>

              {/* List */}
              <div className="p-2 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {users.length > 0 ? users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-default"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300 flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate transition-colors">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>

                    {/* Online dot */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 text-center py-6">No team members found.</p>
                )}
              </div>

              {/* Footer */}
              {user?.role === 'super_admin' && (
                <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Team
                  </button>
                </div>
              )}
            </div>

            {/* Overview Card */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Progress Overview</p>

              <div className="space-y-4">
                <ProgressRow label="Completed" value={completed} total={total} color="bg-emerald-500" />
                <ProgressRow label="In Progress" value={pending} total={total} color="bg-amber-500" />
                <ProgressRow label="Efficiency" value={efficiency} total={100} color="bg-blue-500" suffix="%" />
              </div>
            </div>

            {/* Tip Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/20 p-5">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Pro Tip</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Keep your tasks updated! Closing completed items helps your team stay synchronized and boosts overall efficiency.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, iconBg, iconColor,
  valueColor = 'text-white', accent = 'border-white/10',
  glow = '', extra = null,
}: any) {
  return (
    <div className={`bg-white/[0.03] border ${accent} rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.055] hover:-translate-y-0.5 hover:shadow-xl ${glow} transition-all duration-200 cursor-default`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>{value}</p>
      {extra}
    </div>
  );
}

function SectionHeader({ icon, iconBg, title, action }: any) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">{title}</h2>
      </div>
      {action && action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-2 border-dashed border-white/[0.07] rounded-2xl p-10 text-center bg-white/[0.01]">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

function ProgressRow({ label, value, total, color, suffix = '' }: any) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-300">{value}{suffix}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}