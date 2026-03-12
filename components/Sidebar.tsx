"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'My Tasks', href: '/tasks', icon: '📋' },
    { label: 'New Task', href: '/tasks/create', icon: '➕' },
    { label: 'Employees', href: '/employees', icon: '👥' },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 flex-col h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                )}
              >
                <span className={clsx(
                  "mr-3 text-lg transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-50 uppercase">
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 text-center">Version 1.0.0 Pro</p>
        </div>
      </div>
    </aside>
  );
}
