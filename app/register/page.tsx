"use client";

import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input
            className="mt-1 w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="mt-1 w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="mt-1 w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
