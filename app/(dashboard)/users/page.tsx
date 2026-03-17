"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTasks from '../../../hooks/useTasks';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';

export default function UsersPage() {
  const { users, loading, load: refreshUsers } = useTasks() as any; // Assuming refreshUsers might exist or needs to be added
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && currentUser && currentUser.role === 'employee') {
      router.push('/dashboard');
    }
  }, [currentUser, loading, router]);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  if (loading || (currentUser && currentUser.role === 'employee')) return <Loader />;

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      await Swal.fire({
        icon: 'success',
        title: 'User Created',
        text: `${name} has been added as ${role}.`,
        timer: 2000,
        showConfirmButton: false
      });

      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('employee');
      
      // Refresh user list if refreshUsers exists in hook
      if (refreshUsers) refreshUsers();
      else window.location.reload(); 

    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-200 pb-16">
      {/* Background glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Management</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Team Management</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your organization's members and roles</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Member
          </button>
        </div>

        {/* USERS GRID */}
        {users.length === 0 ? (
          <div className="border-2 border-dashed border-white/[0.07] rounded-2xl p-16 text-center bg-white/[0.01]">
            <p className="text-slate-500 font-medium text-sm">No members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((u: any, index: number) => (
              <MemberCard key={u.id} user={u} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Team Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="employee" className="bg-[#0f172a]">Employee</option>
                  {currentUser?.role === 'super_admin' && <option value="admin" className="bg-[#0f172a]">Admin</option>}
                </select>
              </div>
              <button disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4 transition-all active:scale-[0.98] disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const AVATAR_STYLES = [
  { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-300' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-300' },
];

function MemberCard({ user: u, index }: any) {
  const style = AVATAR_STYLES[index % AVATAR_STYLES.length];
  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.055] transition-all duration-200">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${style.bg} border ${style.border} rounded-xl flex items-center justify-center text-lg font-bold ${style.text}`}>
          {u.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate">{u.name}</h3>
          <p className="text-xs text-slate-500 truncate">{u.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          Active
        </span>
        <span className="inline-flex items-center bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
          {u.role?.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
