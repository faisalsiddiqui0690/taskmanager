"use client";

import useAuth from '../hooks/useAuth';
import Link from 'next/link';

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-[#080b12]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center px-6">

      {/* Subtle bottom glow line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-6">

        {/* ── LOGO ── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 active:scale-95"
        >
          {/* Icon tile */}
          <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors duration-200">
            <span className="text-blue-400 font-black text-xs tracking-tight">TP</span>
          </div>

          {/* Wordmark */}
          <span className="font-extrabold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            TaskPilot
          </span>
        </Link>

        {/* ── RIGHT SIDE ── */}
        <div className="flex items-center gap-4">

          {/* User info — logged in */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              {/* Name + role */}
              <div className="text-right">
                <p className="text-sm font-bold text-slate-200 leading-none">{user.name}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                    {user.role?.replace('_', ' ') || 'Member'}
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 bg-blue-500/15 border border-blue-500/25 rounded-xl flex items-center justify-center text-sm font-extrabold text-blue-300 flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/[0.08]" />
            </div>
          )}

          {/* Logged in: Logout button */}
          {user ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.07] hover:border-rose-500/25 transition-all duration-200 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          ) : (
            /* Logged out: Login + Sign Up */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl border border-blue-500/50 shadow-lg shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Sign Up
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}