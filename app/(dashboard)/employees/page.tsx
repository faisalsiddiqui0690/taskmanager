"use client";

import useTasks from '../../../hooks/useTasks';
import Loader from '../../../components/Loader';

export default function EmployeesPage() {
  const { users, loading } = useTasks();

  if (loading) return <Loader />;

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                People
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Team Members
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {users.length} {users.length === 1 ? 'member' : 'members'} in your organisation
            </p>
          </div>

          {/* Total badge */}
          <div className="flex-shrink-0 flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4">
            <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{users.length}</p>
              <p className="text-xs text-slate-500 font-medium">Total Members</p>
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        {users.length === 0 ? (
          <div className="border-2 border-dashed border-white/[0.07] rounded-2xl p-16 text-center bg-white/[0.01]">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-sm">No team members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((u, index) => (
              <MemberCard key={u.id} user={u} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Avatar colour palette — cycles through accents ──────────────────────────
const AVATAR_STYLES = [
  { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-300' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-300' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-300' },
  { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-300' },
  { bg: 'bg-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-300' },
];

function MemberCard({ user: u, index }: { user: any; index: number }) {
  const style = AVATAR_STYLES[index % AVATAR_STYLES.length];

  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.055] hover:border-white/[0.13] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 transition-all duration-200 cursor-default overflow-hidden">

      {/* Subtle top-left glow on hover */}
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />

      {/* ── Avatar + Name row ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`relative w-14 h-14 ${style.bg} border ${style.border} rounded-2xl flex items-center justify-center text-lg font-extrabold ${style.text} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          {u.name.charAt(0).toUpperCase()}

          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#080b12] rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate group-hover:text-blue-300 transition-colors duration-200">
            {u.name}
          </h3>
          <p className="text-xs text-slate-500 truncate mt-0.5">{u.email}</p>
        </div>
      </div>

      {/* ── Role badge + divider ── */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active Member
        </span>
        {u.role && (
          <span className="inline-flex items-center bg-white/[0.05] border border-white/[0.08] text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-lg capitalize">
            {u.role.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-white/[0.06] mb-5" />

      {/* ── Footer ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs truncate max-w-[120px]">{u.email}</span>
        </div>

        <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View Tasks
        </button>
      </div>
    </div>
  );
}