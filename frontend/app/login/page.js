'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Login Failed', { description: err.response?.data?.message || "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md vercel-panel p-8">
        <h1 className="text-2xl font-semibold mb-6  text-center">Welcome back</h1>
        <p className="text-[#403d39] text-sm text-center mb-8">Enter your credentials to access your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#403d39]">Email Address</label>
            <input 
              type="email" 
              required 
              className="vercel-input" 
              placeholder="you@domain.com" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              suppressHydrationWarning
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#403d39]">Password</label>
            <input 
              type="password" 
              required 
              className="vercel-input" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              suppressHydrationWarning
            />
          </div>
          <button disabled={loading} className="vercel-btn w-full mt-4 !py-3">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#403d39]">
          Don't have an account?{' '}
          <Link href="/signup" className=" hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
