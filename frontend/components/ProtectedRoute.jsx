'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, adminOnly]);

  if (loading || !user || (adminOnly && user.role !== 'ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-16 h-16 animate-spin text-[#FFB703] drop-shadow-[4px_4px_0px_black]" />
        <p className="mt-6 font-black text-2xl text-black">Verifying Access...</p>
      </div>
    );
  }

  return children;
}
