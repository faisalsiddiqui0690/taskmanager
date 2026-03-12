"use client";

import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { logout, user } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <div className="font-bold text-xl text-gray-900 dark:text-white">TaskManager</div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDark((d) => !d)}
          className="px-2 py-1 border rounded"
        >
          {dark ? 'Light' : 'Dark'}
        </button>
        {user && <span className="text-gray-700 dark:text-gray-200">Hi, {user.name}</span>}
        {user && (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
