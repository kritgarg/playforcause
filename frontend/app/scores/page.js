'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
export default function ScoresPage() {
  const { user, refreshUser } = useAuth();
  const [scores, setScores] = useState([]);
  const [formData, setFormData] = useState({ score: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try { const res = await api.get('/scores'); setScores(res.data); } catch (err) {} finally { setFetchLoading(false); }
    };
    if (user) { 
      refreshUser(); 
      if (user.subscriptionStatus !== 'ACTIVE') {
        toast.error('Subscribe first', { description: 'You need an active subscription to log scores.' });
        router.push('/membership');
      } else {
        fetchData(); 
      }
    } else { 
      setFetchLoading(false); 
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/scores', { score: parseInt(formData.score), date: formData.date });
      toast.success('Score logged successfully');
      setFormData({ ...formData, score: '' });
      const res = await api.get('/scores');
      setScores(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Logging failed'); } finally { setLoading(false); }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-black mb-4 tracking-tight text-inherit">Post Score</h1>
          <p className="text-[#403d39] font-bold text-sm">Enter your performance metrics. The system maintains only your 5 latest entries.</p>
        </div>

        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#FFB703] drop-shadow-[2px_2px_0px_black]" />
            <p className="mt-4 font-black text-xl text-black">Retrieving Metrics...</p>
          </div>
        ) : user?.subscriptionStatus !== 'ACTIVE' ? (
          <div className="vercel-panel p-8 text-center bg-[#FFFCF2] border-4 border-black border-dashed pb-10">
            <h2 className="text-2xl font-black mb-3">Subscription Required</h2>
            <p className="text-[#403d39] font-bold text-base mb-8">You need an active subscription to participate in scoring and draws.</p>
            <Link href="/membership" className="vercel-btn !px-8">View Plans</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <div className="vercel-panel p-6">
                 <h2 className="text-xl font-black mb-6">New Entry</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-[#403d39] uppercase tracking-wider">Score (1-45)</label>
                      <input 
                        type="number" min="1" max="45" required 
                        className="vercel-input" 
                        value={formData.score} 
                        onChange={(e)=>setFormData({...formData, score:e.target.value})}
                        suppressHydrationWarning
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-[#403d39] uppercase tracking-wider">Date</label>
                      <input 
                        type="date" required 
                        className="vercel-input" 
                        value={formData.date} 
                        onChange={(e)=>setFormData({...formData, date:e.target.value})}
                        suppressHydrationWarning
                      />
                    </div>
                    <button disabled={loading} className="vercel-btn w-full mt-6">
                      {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'SUBMIT SCORE'}
                    </button>
                 </form>
               </div>
            </div>

            <div>
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black">Recent Entries</h2>
                  <span className="text-sm font-black text-white bg-black px-3 py-1 rounded-full">{scores.length}/5 Slots</span>
               </div>
               
               <div className="space-y-4">
                 {scores.length > 0 ? scores.map((s,i) => (
                    <div key={i} className="vercel-panel p-5 flex items-center justify-between">
                      <div>
                         <p className="text-[#403d39] font-bold text-xs uppercase tracking-wider mb-1">Date</p>
                         <p className="text-lg font-black text-black">{new Date(s.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[#403d39] font-bold text-xs uppercase tracking-wider mb-1">Score</p>
                         <p className="text-3xl font-black text-[#FFB703] drop-shadow-[2px_2px_0px_black] tracking-tight leading-none">{s.score}</p>
                      </div>
                    </div>
                 )) : (
                   <div className="border-4 border-dashed border-black rounded-2xl text-center py-10 bg-white">
                      <p className="text-base font-black text-[#403d39]">No entries found.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
