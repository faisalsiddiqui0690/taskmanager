"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import useAuth from '../hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'My Tasks',
      href: '/tasks',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    navItems.push({
      label: 'New Task',
      href: '/tasks/create',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    });
  }

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    navItems.push({
      label: 'Users',
      href: '/users',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    });
  }

  return (
    <aside className="hidden md:flex w-64 flex-col h-[calc(100vh-64px)] sticky top-16 bg-[#080b12] border-r border-white/[0.06] flex-shrink-0">

      {/* Top glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 blur-2xl pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="relative flex-1 px-3 py-6 overflow-y-auto space-y-1">

        {/* Section label */}
        <p className="px-3 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
          Main Menu
        </p>

        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              )}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full" />
              )}

              {/* Icon */}
              <span className={clsx(
                'flex-shrink-0 transition-colors duration-200',
                isActive
                  ? 'text-blue-400'
                  : 'text-slate-600 group-hover:text-slate-300'
              )}>
                {item.icon}
              </span>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Active dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── FOOTER ── */}
      <div className="relative px-3 py-4 border-t border-white/[0.06]">
        {/* Version card */}
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500/15 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Task Manager</p>
              <p className="text-[10px] text-slate-600">v1.0.0 Pro</p>
            </div>
          </div>

          {/* Online indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}