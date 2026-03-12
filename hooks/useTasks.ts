import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export interface TaskType {
  _id: string;
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  userId?: number;
  assignedTo?: number;
  Assigner?: { id: number; name: string };
  Assignee?: { id: number; name: string };
}


export default function useTasks() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks');
      const tasksData = await tasksRes.json();
      if (tasksRes.ok) {
        // Handle id vs _id
        const formatted = (tasksData.tasks || []).map((t: any) => ({ ...t, _id: t.id.toString() }));
        setTasks(formatted);
      } else {
        toast.error(tasksData.error || 'Unable to load tasks');
      }

      // Fetch users
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || []);
      }
    } catch (e: any) {
      toast.error('Failed to load data');
    }
    setLoading(false);
  }

  async function create(task: Partial<TaskType>) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    if (res.ok) {
      const newTask = { ...data.task, _id: data.task.id.toString() };
      setTasks((t) => [newTask, ...t]);
      toast.success('Task created');
    } else {
      toast.error(data.error || 'Create failed');
    }
    return data;
  }

  async function update(id: string, updates: Partial<TaskType>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (res.ok && data.task) {
      const updatedTask = { ...data.task, _id: data.task.id.toString() };
      setTasks((t) => t.map((x) => (x._id === id ? updatedTask : x)));
      toast.success('Task updated');
    } else {
      toast.error(data.error || 'Update failed');
    }
    return data;
  }

  async function remove(id: string) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTasks((t) => t.filter((x) => x._id !== id));
      toast.success('Task deleted');
    } else {
      toast.error('Delete failed');
    }
    return res;
  }

  useEffect(() => {
    load();
  }, []);

  return { tasks, users, loading, load, create, update, remove };
}

