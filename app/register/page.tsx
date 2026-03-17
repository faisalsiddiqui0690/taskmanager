"use client";

import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password, role);
      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Successfully registered user.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      router.push('/dashboard');
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message,
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md">

        {/* Top glow line */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="bg-white/[0.035] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">

          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center border-b border-white/[0.06]">

            {/* Logo mark */}
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                Task Manager
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create an Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Join TaskPilot today to get started
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handle} className="space-y-4">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Register as
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-4 pr-9 py-2.5 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="employee" style={{ background: '#0f1623', color: '#e2e8f0' }}>Employee</option>
                    <option value="admin" style={{ background: '#0f1623', color: '#e2e8f0' }}>Admin</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1">* Admin registration requires Super Admin session</p>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full flex items-center justify-center gap-2
                    py-3 px-4 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500
                    shadow-lg shadow-blue-900/30
                    border border-blue-500/50
                    transition-all duration-200
                    active:scale-[0.98]
                    ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-blue-700/40'}
                  `}
                >
                  {isSubmitting ? 'Creating Account...' : 'Register Account'}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
    </div>
  );
}
