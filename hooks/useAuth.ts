import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  loading: boolean;
}

export default function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setState({ user: data.user, loading: false });
        } else {
          setState({ user: null, loading: false });
        }
      } catch (err) {
        setState({ user: null, loading: false });
      }
    }
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setState({ user: data.user, loading: false });
    } else {
      throw new Error(data.error || 'Login failed');
    }
  }

  async function register(name: string, email: string, password: string, role: string = 'employee') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setState({ user: data.user, loading: false });
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  }

  async function logout() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    await fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setState({ user: null, loading: false });
    router.push('/login');
  }

  return { ...state, login, register, logout };
}
