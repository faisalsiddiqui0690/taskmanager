"use client";

import useTasks from '../../hooks/useTasks';
import Loader from '../../components/Loader';
import TaskCard from '../../components/TaskCard';

export default function DashboardPage() {
  const { tasks, loading } = useTasks();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          Total tasks: {total}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Completed: {completed}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Pending: {pending}
        </div>
      </div>
      <h2 className="text-xl mb-2">Recent tasks</h2>
      <div className="space-y-2">
        {tasks.slice(0, 5).map((t) => (
          <TaskCard key={t._id} task={t} />
        ))}
      </div>
    </div>
  );
}
