"use client";

import useTasks from '../../../hooks/useTasks';
import Loader from '../../../components/Loader';

export default function EmployeesPage() {
  const { users, loading } = useTasks();

  if (loading) return <Loader />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <span className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">👥</span>
        Team Members
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-110 transition-transform">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{u.name}</h3>
                <p className="text-sm text-slate-400 font-medium">{u.email}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Member</span>
              <button className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors">
                View Tasks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
