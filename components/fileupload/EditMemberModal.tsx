'use client';

import React, { useState } from 'react';
import { FamilyMember } from '@/lib/store';
import { X } from 'lucide-react';

export default function EditMemberModal({ member, onClose, onSave }: {
  member: FamilyMember;
  onClose: () => void;
  onSave: (data: Omit<FamilyMember, '_id' | 'documents'>) => Promise<void>;
}) {
  const [name, setName] = useState(member.name);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSave({ name, relation: '', phone: '', email: '' });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Edit Family Member</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
              <div className="relative group">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center cursor-pointer select-none">i</span>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-10 bg-gray-800 text-white text-[11px] rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                  Max 22 characters allowed
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
                </div>
              </div>
              <span className={`ml-auto text-[11px] font-semibold ${name.length >= 22 ? 'text-red-500' : 'text-gray-400'}`}>{name.length}/22</span>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} maxLength={22}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
