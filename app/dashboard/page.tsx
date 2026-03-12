"use client";

import { useState, useEffect } from 'react';
import useTasks, { TaskType } from '../../hooks/useTasks';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import TaskCard from '../../components/TaskCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { tasks, loading, users } = useTasks();
  const { user, logout } = useAuth();
  const router = useRouter();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;

  // My Tasks: tasks where the current user is the assignee
  const myTasks = tasks.filter(t => t.assignedTo?.toString() === user?.id?.toString());

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden bg-slate-900 pt-16 pb-16 shadow-inner">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-indigo-300">{user?.name || 'User'}</span>!
              </h1>
              <p className="mt-4 text-lg text-indigo-100 max-w-2xl font-medium">
                You have <span className="text-white font-bold">{pending} pending tasks</span> to focus on today. Let's make it productive!
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/tasks/create" className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                + Assign New Task
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard label="Total Projects" value={total} color="bg-white" icon="📁" />
          <StatsCard label="Completed" value={completed} color="bg-emerald-500" valueColor="text-white" labelColor="text-emerald-100" icon="✅" />
          <StatsCard label="In Progress" value={pending} color="bg-amber-500" valueColor="text-white" labelColor="text-amber-100" icon="⏳" />
          <StatsCard label="My Efficiency" value={`${total > 0 ? Math.round((completed/total)*100) : 100}%`} color="bg-indigo-600" valueColor="text-white" labelColor="text-indigo-100" icon="📈" />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* My Tasks Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">🎯</span>
                  Assigned to Me
                </h2>
                <Link href="/tasks" className="text-sm font-bold text-indigo-600 hover:underline">View all</Link>
              </div>
              {myTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myTasks.slice(0, 4).map((t) => (
                    <TaskCard key={t.id || (t as any)._id} task={t} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <p className="text-slate-400 font-medium">No tasks assigned to you yet.</p>
                </div>
              )}
            </section>

            {/* Recent Global Tasks */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">🌐</span>
                  Recent Activity
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.slice(0, 4).map((t) => (
                  <TaskCard key={t.id || (t as any)._id} task={t} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Team Members / Employee Details */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-800">Team Members</h2>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{users.length}</span>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {users.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-100 to-blue-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 text-center">
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Manage Team</button>
              </div>
            </section>

            {/* Quick Tips */}
            <section className="bg-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <h3 className="font-bold text-indigo-100 mb-2">Pro Tip</h3>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                Keep your tasks updated! Closing completed items helps your team stay synchronized.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color, icon, valueColor = "text-slate-900", labelColor = "text-slate-500" }: any) {
  return (
    <div className={`${color} rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between h-32 transform transition hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-black uppercase tracking-wider ${labelColor}`}>{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-black ${valueColor}`}>{value}</p>
    </div>
  );
}
