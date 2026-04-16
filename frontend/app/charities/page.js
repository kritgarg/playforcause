'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CharitiesPage() {
  const { user, refreshUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [selectedPercent, setSelectedPercent] = useState(10);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try { const res = await api.get('/charities'); setCharities(res.data); } catch (err) {} finally { setLoading(false); }
    };
    fetchCharities();
  }, []);

  const openSelection = (c) => {
    if (!user) { window.location.href = '/login'; return; }
    setSelectedCharity(c);
    setSelectedPercent(user.contributionPercent || 10);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = async () => {
    setUpdating(true);
    try {
      await api.patch('/auth/charity', { charityId: selectedCharity.id, contributionPercent: selectedPercent });
      await refreshUser();
      toast.success('Charity linked successfully');
      setIsModalOpen(false);
    } catch (err) { toast.error('Failed to link charity'); } finally { setUpdating(false); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Select Your Impact</h1>
        <p className="text-[#403d39] font-bold text-lg max-w-2xl">Minimum 10% of your yields will be routed to the selected cause. You can adjust this percentage upward to increase your impact.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#FFB703] drop-shadow-[2px_2px_0px_black]" />
          <p className="mt-4 font-black text-xl text-black">Loading Charities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div 
              key={charity.id} 
              className={`vercel-panel bg-white p-6 flex flex-col transform hover:-rotate-1 transition-transform ${user?.charityId === charity.id ? 'border-[6px] border-[#FFB703]' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-black leading-tight text-black">{charity.name}</h2>
                {user?.charityId === charity.id && (
                  <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-black ml-2 uppercase tracking-wide border-2 border-black">Active</span>
                )}
              </div>
              <p className="text-[#403d39] font-bold text-base mb-8 flex-grow">{charity.description}</p>
              
              <button 
                onClick={() => openSelection(charity)} 
                className={user?.charityId === charity.id ? 'vercel-btn-secondary w-full' : 'vercel-btn w-full !bg-[#FFB703] !text-black'}
              >
                {user?.charityId === charity.id ? 'Manage Support' : 'Support Cause'}
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedCharity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
           <div className="vercel-panel !bg-[#FFFDF0] border-4 border-black w-full max-w-md p-8 relative shadow-[8px_8px_0px_black]">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 text-black bg-[#FFB703] border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-black hover:scale-110 transition-transform"
              >
                ✕
              </button>
              
              <h3 className="text-2xl font-black mb-2 text-black">Support {selectedCharity.name}</h3>
              <p className="text-[#403d39] font-bold text-sm mb-6">Select the percentage of your yields to allocate to this charity.</p>

              <div className="space-y-4 mb-8">
                <label className="text-sm font-black text-black uppercase tracking-wider">Contribution Percentage</label>
                <div className="flex gap-2">
                   {[10, 15, 20, 25, 30].map(opt => (
                     <button 
                      key={opt} 
                      onClick={() => setSelectedPercent(opt)} 
                      className={`flex-1 py-3 rounded-xl border-2 border-black font-black transition-all ${selectedPercent === opt ? 'bg-[#FFB703] text-black shadow-[2px_2px_0px_black] -translate-y-1' : 'bg-white text-black hover:bg-[#FFFDF0]'}`}
                     >
                       {opt}%
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="vercel-btn-secondary flex-1 shadow-[2px_2px_0px_black]">Cancel</button>
                 <button 
                  onClick={handleConfirmSelection} 
                  disabled={updating} 
                  className="vercel-btn flex-1 shadow-[2px_2px_0px_black]"
                 >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
