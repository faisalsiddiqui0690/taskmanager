"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) router.replace('/dashboard');
      else router.replace('/login');
    }
  }, [user, loading, router]);

  return <div className="p-4">Loading…</div>;
}
