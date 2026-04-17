'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ role: '', subscriptionStatus: '' });

  // Charity Modal
  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [charityForm, setCharityForm] = useState({ name: '', description: '' });

  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    if (!user || user.role !== 'ADMIN') return;
    setLoading(true);
    try {
      if (activeTab === 'users') { const res = await api.get('/subscriptions/admin/users'); setUsers(res.data); }
      else if (activeTab === 'charities') { const res = await api.get('/charities'); setCharities(res.data); }
      else if (activeTab === 'winners') { const res = await api.get('/winners/admin'); setWinners(res.data); }
    } catch (err) {} finally { setLoading(false); }
  };

  const handleRunDraw = async () => {
    setActionLoading(true); 
    try { 
      const res = await api.post('/draws/admin/run'); 
      setIsDrawModalOpen(false); 
      toast.success('Draw Complete', { description: `Matches found: ${res.data.winnersCount}` });
    } catch (err) { toast.error('Draw failed'); } finally { setActionLoading(false); }
  };

  const openUserModal = (u) => { setSelectedUser(u); setUserForm({ role: u.role, subscriptionStatus: u.subscriptionStatus }); setIsUserModalOpen(true); };
  const handleUserSubmit = async (e) => {
    e.preventDefault(); setActionLoading(true);
    try { await api.patch(`/subscriptions/admin/users/${selectedUser.id}`, userForm); setIsUserModalOpen(false); toast.success('User Updated'); fetchData(); } 
    catch (err) { toast.error('Update failed'); } finally { setActionLoading(false); }
  };

  const openCharityModal = (c = null) => {
    setSelectedCharity(c);
    setCharityForm(c ? { name: c.name, description: c.description } : { name: '', description: '' });
    setIsCharityModalOpen(true);
  };

  const handleCharitySubmit = async (e) => {
    e.preventDefault(); setActionLoading(true);
    try {
      if (selectedCharity) {
        await api.put(`/charities/admin/${selectedCharity.id}`, charityForm);
        toast.success('Charity Updated');
      } else {
        await api.post('/charities/admin', charityForm);
        toast.success('Charity Added');
      }
      setIsCharityModalOpen(false);
      fetchData();
    } catch (err) { toast.error('Operation failed'); } finally { setActionLoading(false); }
  };

  const handleDeleteCharity = async (id) => {
    if (!confirm('Are you sure you want to delete this charity?')) return;
    try { await api.delete(`/charities/admin/${id}`); toast.success('Charity Deleted'); fetchData(); } catch(err) { toast.error('Failed to delete'); }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-semibold  tracking-tight">System Admin</h1>
            <p className="text-[#403d39] text-sm mt-1">Manage users, view platform metrics, and run draws.</p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'charities' && (
              <button onClick={() => openCharityModal()} className="vercel-btn-secondary !px-4 hover:! border-white">
                Add Charity
              </button>
            )}
            <button onClick={() => setIsDrawModalOpen(true)} className="vercel-btn !px-6">
              Execute Monthly Draw
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-[#333] pb-px">
          <Tab active={activeTab === 'users'} onClick={()=>setActiveTab('users')} label="Users" />
          <Tab active={activeTab === 'charities'} onClick={()=>setActiveTab('charities')} label="Charities" />
          <Tab active={activeTab === 'winners'} onClick={()=>setActiveTab('winners')} label="Winners" />
        </div>

        <div className="vercel-panel overflow-hidden border-[#333]">
          {loading ? (
             <div className="p-12 text-center text-[#403d39] text-sm">Loading data...</div>
          ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               {activeTab === 'users' && (
                 <>
                   <thead className="border-b border-[#333] text-[#403d39]">
                     <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Charity</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#333]">
                     {users.map(u => (
                       <tr key={u.id}>
                          <td className="px-6 py-4">
                             <p className=" font-medium">{u.name || 'Agent'}</p>
                             <p className="text-[#403d39] text-xs">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`text-xs px-2 py-1 rounded bg-[#111] border border-[#333] ${u.subscriptionStatus === 'ACTIVE' ? '' : 'text-[#403d39]'}`}>
                                {u.subscriptionStatus}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-[#403d39]">{u.charity?.name || '-'}</td>
                          <td className="px-6 py-4 text-[#403d39]">{u.role}</td>
                          <td className="px-6 py-4 text-right">
                             <button onClick={() => openUserModal(u)} className="text-xs  hover:underline">Edit</button>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </>
               )}

               {activeTab === 'charities' && (
                 <>
                   <thead className="border-b border-[#333] text-[#403d39]">
                     <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Description</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#333]">
                     {charities.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-[#403d39]">No charities found.</td></tr>}
                     {charities.map(c => (
                       <tr key={c.id}>
                          <td className="px-6 py-4  font-medium">{c.name}</td>
                          <td className="px-6 py-4 text-[#403d39] max-w-sm truncate">{c.description}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                             <button onClick={() => openCharityModal(c)} className="text-xs  hover:underline">Edit</button>
                             <button onClick={() => handleDeleteCharity(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </>
               )}

               {activeTab === 'winners' && (
                 <>
                   <thead className="border-b border-[#333] text-[#403d39]">
                     <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Matches</th>
                        <th className="px-6 py-4 font-medium">Draw Month</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#333]">
                     {winners.length === 0 && <tr><td colSpan="4" className="px-6 py-4 text-center text-[#403d39]">No winners found.</td></tr>}
                     {winners.map(w => (
                       <tr key={w.id}>
                          <td className="px-6 py-4 ">{w.user?.name || w.user?.email}</td>
                          <td className="px-6 py-4 ">{w.matchCount}</td>
                          <td className="px-6 py-4 text-[#403d39]">{w.draw?.month}</td>
                          <td className="px-6 py-4">
                             <span className="text-xs px-2 py-1 rounded bg-[#111] border border-[#333] text-[#403d39]">
                                {w.status}
                             </span>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </>
               )}
             </table>
           </div>
          )}
        </div>
      </div>

      {isUserModalOpen && (
        <ModalWrapper onClose={()=>setIsUserModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-2 ">Edit User Parameter</h3>
          <p className="text-[#403d39] text-sm mb-6">Modify system access and subscription state.</p>
          <form onSubmit={handleUserSubmit} className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-[#403d39]">Role Level</label>
                <select 
                  className="vercel-input" 
                  value={userForm.role} 
                  onChange={(e)=>setUserForm({...userForm, role:e.target.value})} 
                  disabled={selectedUser?.id === user?.id}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-[#403d39]">Subscription Status</label>
                <select 
                  className="vercel-input" 
                  value={userForm.subscriptionStatus} 
                  onChange={(e)=>setUserForm({...userForm, subscriptionStatus:e.target.value})} 
                  disabled={selectedUser?.id === user?.id}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
             </div>
             <div className="pt-4 flex gap-3">
               <button type="button" onClick={()=>setIsUserModalOpen(false)} className="vercel-btn-secondary flex-1">Cancel</button>
               <button type="submit" className="vercel-btn flex-1" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save Changes'}</button>
             </div>
          </form>
        </ModalWrapper>
      )}

      {isCharityModalOpen && (
        <ModalWrapper onClose={()=>setIsCharityModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-2 ">{selectedCharity ? 'Edit Charity' : 'Add Charity'}</h3>
          <p className="text-[#403d39] text-sm mb-6">Enter the charity details below.</p>
          <form onSubmit={handleCharitySubmit} className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-[#403d39]">Name</label>
                <input 
                  type="text" required
                  className="vercel-input" 
                  value={charityForm.name} 
                  onChange={(e)=>setCharityForm({...charityForm, name:e.target.value})} 
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-[#403d39]">Description</label>
                <textarea 
                  required rows="3"
                  className="vercel-input resize-none" 
                  value={charityForm.description} 
                  onChange={(e)=>setCharityForm({...charityForm, description:e.target.value})} 
                ></textarea>
             </div>
             <div className="pt-4 flex gap-3">
               <button type="button" onClick={()=>setIsCharityModalOpen(false)} className="vercel-btn-secondary flex-1">Cancel</button>
               <button type="submit" className="vercel-btn flex-1" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save Charity'}</button>
             </div>
          </form>
        </ModalWrapper>
      )}
      
      {isDrawModalOpen && (
         <ModalWrapper onClose={()=>setIsDrawModalOpen(false)}>
            <div className="text-center mb-6">
               <h3 className="text-lg font-semibold mb-2 ">Execute Draw</h3>
               <p className="text-[#403d39] text-sm">This action cannot be undone. It will trigger the draw calculation across all active users.</p>
            </div>
            <div className="flex gap-3">
               <button onClick={()=>setIsDrawModalOpen(false)} className="vercel-btn-secondary flex-1">Cancel</button>
               <button onClick={handleRunDraw} disabled={actionLoading} className="vercel-btn flex-1 bg-white text-black hover:bg-[#EAEAEA]">
                  {actionLoading ? 'Running...' : 'Confirm'}
               </button>
            </div>
         </ModalWrapper>
      )}
    </ProtectedRoute>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="vercel-panel !bg-[#0a0a0a] w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#403d39] hover:">✕</button>
        {children}
      </div>
    </div>
  );
}

function Tab({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${active ? 'border-white ' : 'border-transparent text-[#403d39] hover:text-[#ccc]'}`}
    >
      {label}
    </button>
  );
}
