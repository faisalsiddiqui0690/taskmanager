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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium"
          >
            &larr; Back
          </button>
        </div>
        <TaskForm users={users} onSubmit={handle} submitLabel="Create Task" />
      </div>
    </div>
  );
}
