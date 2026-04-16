'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SubscribePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (planType) => {
    setLoading(true);
    try {
      await api.post('/subscriptions/subscribe', { planType });
      await refreshUser();
      toast.success('Subscription activated successfully');
      router.push('/dashboard');
    } catch (err) { toast.error('Failed to activate subscription'); } finally { setLoading(false); }
  };

  if (user?.subscriptionStatus === 'ACTIVE') {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto pt-10">
          <div className="vercel-panel p-12 text-center max-w-xl mx-auto mt-20 border-4 border-black bg-white">
             <div className="w-20 h-20 bg-[#FFB703] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_black] transform rotate-3">
                <span className="text-3xl">⭐</span>
             </div>
             <h1 className="text-4xl font-black mb-2 tracking-tight text-black">Active Membership</h1>
             <p className="text-[#403d39] font-bold text-base mb-8">Your {user.planType} plan is locked in and operational!</p>
             <div className="bg-[#FFFDF0] border-4 border-black rounded-2xl p-6 text-left shadow-[4px_4px_0px_black]">
               <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-black pb-4">
                 <span className="text-[#403d39] font-black text-sm uppercase tracking-widest">Plan Tier</span>
                 <span className="text-black text-xl font-black">{user.planType}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[#403d39] font-black text-sm uppercase tracking-widest">Valid Until</span>
                 <span className="text-black text-xl font-black">{user.renewalDate ? new Date(user.renewalDate).toLocaleDateString() : 'Active'}</span>
               </div>
             </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto pt-10">
        <div className="text-center mb-16">
           <h1 className="text-5xl font-black mb-4 tracking-tight drop-shadow-[2px_2px_0px_white]">Level Up Your Impact</h1>
           <p className="text-[#403d39] font-bold text-lg max-w-lg mx-auto">Choose your mission tier to support your charity and enter the monthly reward draws.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <PlanCard 
             title="The Amateur" 
             price="$29" 
             period="/ month"
             features={['Access to monthly draws','Log up to 5 scores','Select standard charity','Email support']} 
             onSelect={()=>handleSubscribe('MONTHLY')} 
             loading={loading} 
           />
           <PlanCard 
             title="The Pro" 
             price="$299" 
             period="/ year"
             features={['Everything in Amateur','Save ~$50 yearly','Priority draw processing','Verified status badge']} 
             onSelect={()=>handleSubscribe('YEARLY')} 
             loading={loading} 
             highlight
           />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function PlanCard({ title, price, period, features, onSelect, loading, highlight }) {
  return (
    <div className={`vercel-panel p-8 flex flex-col transform transition-transform hover:-translate-y-2 ${highlight ? 'border-4 border-black bg-[#FFB703]' : 'bg-white'}`}>
      <div className="inline-flex max-w-max px-3 py-1 bg-black text-white rounded-full text-xs font-black uppercase tracking-wider mb-4 border-2 border-black">
        {highlight ? 'Popular Choice ✨' : 'Starter Plan 🚀'}
      </div>
      <h3 className="text-3xl font-black mb-1">{title}</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-5xl font-black tracking-tight">{price}</span>
        <span className={`${highlight ? 'text-black' : 'text-[#403d39]'} font-bold`}>{period}</span>
      </div>

      <ul className="space-y-4 flex-grow mb-10">
        {features.map((f, i)=>(
          <li key={i} className="flex gap-3 font-bold text-base items-start">
            <span className="text-xl">✅</span>
            <span className={highlight ? 'text-black' : 'text-[#403d39]'}>{f}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onSelect} 
        disabled={loading} 
        className={highlight ? 'vercel-btn !bg-white !text-black w-full !py-4 !text-lg shadow-[4px_4px_0px_black]' : 'vercel-btn-secondary w-full !py-4 !text-lg'}
      >
        {loading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : 'Select Plan'}
      </button>
    </div>
  );
}
