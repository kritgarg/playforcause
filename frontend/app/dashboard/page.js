'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profRes = await api.get('/auth/profile');
        setProfile(profRes.data);
        const winRes = await api.get('/winners');
        setWinnings(winRes.data);
      } catch (err) { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b-4 border-black">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-2">Welcome Back!</h1>
            <p className="text-[#403d39] font-bold text-lg">{profile?.name || 'Loading'} / Platform Overview</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white border-4 border-black rounded-full px-6 py-3 shadow-[4px_4px_0px_black] transform rotate-1">
             <div className={`w-3 h-3 rounded-full border-2 border-black ${profile?.subscriptionStatus === 'ACTIVE' ? 'bg-[#FFB703]' : 'bg-[#EF476F]'}`}></div>
             <p className="text-sm font-black text-black tracking-wide uppercase">Plan: {profile?.planType || 'None'}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#FFB703] drop-shadow-[2px_2px_0px_black]" />
            <p className="mt-4 font-black text-xl text-black">Loading your stats...</p>
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
               <StatCard 
                 title="Subscription" 
                 value={profile?.subscriptionStatus || 'INACTIVE'} 
                 sub={profile?.planType ? `Active ${profile.planType}` : 'No Active Plan'} 
               />
               <StatCard 
                 title="Charity Impact" 
                 value={profile?.charity?.name || 'Unlinked'} 
                 sub={`${profile?.contributionPercent || 10}% Yield Contribution`} 
               />
               <StatCard 
                 title="Recent Activity" 
                 value={profile?.scores?.length || '0'} 
                 sub="Scores Logged (Max 5)" 
               />
               <StatCard 
                 title="Performance" 
                 value={profile?.scores?.length > 0 ? (profile.scores.reduce((acc, s) => acc + s.score, 0) / profile.scores.length).toFixed(1) : '0.0'} 
                 sub="Avg Score Current Form" 
                 highlight
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Left Column - Reward History */}
               <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-3xl font-black text-black">Reward History</h2>
                  
                  <div className="flex flex-col gap-4">
                    {winnings.length > 0 ? winnings.map((w,i)=>(
                      <div key={i} className="flex items-center justify-between bg-white border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_black] hover:-translate-y-1 transition-transform">
                         <div className="flex items-center gap-4">
                            <div className="bg-[#FFFCF2] border-2 border-black w-14 h-14 rounded-full flex flex-col items-center justify-center">
                               <span className="font-black text-xl">{w.matchCount}</span>
                            </div>
                            <div>
                              <p className="text-xl font-black text-black">Matches Found</p>
                              <p className="text-sm font-bold text-[#403d39] tracking-wider">{w.draw?.month}</p>
                            </div>
                         </div>
                         <div className={`px-4 py-2 rounded-xl font-black uppercase tracking-wider border-4 border-black ${w.status === 'PAID' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0px_black]' : 'bg-[#E8E5D7] text-[#403d39]'}`}>
                           {w.status}
                         </div>
                      </div>
                    )) : (
                      <div className="bg-[#FFFCF2] border-4 border-black rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                        <p className="text-xl font-black text-black mb-2">No rewards yet.</p>
                        <p className="text-base font-bold text-[#403d39]">Enter your scores to participate in the next draw.</p>
                      </div>
                    )}
                  </div>
               </div>
               
               {/* Right Column - Recent Scores */}
               <div className="space-y-6">
                  <h2 className="text-3xl font-black text-black">Log</h2>
                  
                  <div className="vercel-panel bg-white p-6">
                    <div className="flex flex-col gap-1">
                      {profile?.scores?.map((s,i)=>(
                        <div key={i} className="flex items-center justify-between py-4 border-b-2 border-solid border-[#E8E5D7] last:border-0 group">
                           <div className="flex items-center gap-4">
                              <span className="text-3xl font-black text-[#FFB703] drop-shadow-[2px_2px_0px_black] group-hover:scale-110 transition-transform">{s.score}</span>
                           </div>
                           <span className="text-sm font-bold text-[#403d39] px-3 py-1 bg-[#FFFCF2] border-2 border-black rounded-full">{new Date(s.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {(!profile?.scores || profile.scores.length === 0) && (
                         <div className="py-8 text-center text-[#403d39] font-bold">
                           <p>No scores logged.</p>
                         </div>
                      )}
                    </div>
                    
                    <Link href="/scores" className="mt-6 vercel-btn w-full !bg-black !text-white hover:!bg-[#FF9E00] flex items-center justify-between !px-6">
                       <span>Add New Score</span>
                       <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, sub, highlight }) {
  return (
    <div className={`p-6 rounded-2xl border-4 border-black hover:-translate-y-2 hover:rotate-1 transition-transform ${highlight ? 'bg-[#FFB703] shadow-[4px_4px_0px_black]' : 'bg-white shadow-[4px_4px_0px_#2d2a26]'}`}>
      <p className={`font-black uppercase tracking-wider text-sm mb-4 ${highlight ? 'text-black' : 'text-[#403d39]'}`}>{title}</p>
      <h3 className="text-3xl font-black text-black mb-1 truncate leading-none">{value}</h3>
      <p className={`font-bold text-xs truncate mt-3 ${highlight ? 'text-black' : 'text-[#403d39]'}`}>{sub}</p>
    </div>
  );
}
