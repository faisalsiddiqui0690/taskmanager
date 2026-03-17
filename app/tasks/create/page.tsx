"use client";

import { useRouter } from 'next/navigation';
import TaskForm from '../../../components/TaskForm';
import useTasks from '../../../hooks/useTasks';

export default function CreateTaskPage() {
  const { create, users } = useTasks();
  const router = useRouter();

  const handle = async (data: any) => {
    await create(data);
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 font-bold transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        <TaskForm users={users} onSubmit={handle} submitLabel="Create New Task" />
      </div>
    </div>
  );
}
