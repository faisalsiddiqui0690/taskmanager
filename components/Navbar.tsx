"use client";

import useAuth from '../hooks/useAuth';
import Link from 'next/link';

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xs">TP</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
            TaskPilot
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {user && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800 leading-none">{user.name}</span>
              <div className="flex items-center gap-1 mt-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <span className="text-[10px] font-bold uppercase tracking-wide">Verified</span>
              </div>
            </div>
          )}

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition">Login</Link>
              <Link href="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
