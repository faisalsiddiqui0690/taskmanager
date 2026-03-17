import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export interface TaskType {
  _id: string;
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'started' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  userId?: number;
  assignedTo?: number;
  Assigner?: { id: number; name: string };
  Assignee?: { id: number; name: string };
  createdAt?: string;
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
        Swal.fire({ icon: 'error', title: 'Error', text: tasksData.error || 'Unable to load tasks', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      }

      // Fetch users
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || []);
      }
    } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load data', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
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
      Swal.fire({ icon: 'success', title: 'Task created', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Create failed', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
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
      Swal.fire({ icon: 'success', title: 'Task updated', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Update failed', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    }
    return data;
  }

  async function remove(id: string) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTasks((t) => t.filter((x) => x._id !== id));
      Swal.fire({ icon: 'success', title: 'Task deleted', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Delete failed', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    }
    return res;
  }

  useEffect(() => {
    load();
  }, []);

  return { tasks, users, loading, load, create, update, remove };
}

