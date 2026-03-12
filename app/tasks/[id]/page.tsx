"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '../../../components/TaskForm';
import Loader from '../../../components/Loader';
import useTasks from '../../../hooks/useTasks';

export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { users } = useTasks();

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tasks/${id}`);
      const data = await res.json();
      setTask(data.task);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!task) return <p>Not found</p>;

  const handleUpdate = async (updates: any) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    router.push('/tasks');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">Edit Task</h1>
      <TaskForm users={users} initial={task} onSubmit={handleUpdate} submitLabel="Update Task" />
    </div>
  );
}
