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
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">New Task</h1>
      <TaskForm users={users} onSubmit={handle} />
    </div>
  );
}
