'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Pencil, Search, X, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/Toast';

type Master = {
  _id: string;
  name: string;
  type: 'relation' | 'category' | 'status' | 'other';
  isActive: boolean;
  createdAt: string;
};

function AddMasterModal({ onClose, onSave }: { onClose: () => void; onSave: (master: Omit<Master, '_id' | 'createdAt' | 'isActive'>) => Promise<void> }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSave({ name, type: 'other' });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add Document Category</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Passport, Driving License"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditMasterModal({ master, onClose, onSave }: { master: Master; onClose: () => void; onSave: (data: Partial<Master>) => Promise<void> }) {
  const [form, setForm] = useState({ name: master.name, isActive: master.isActive });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    await onSave({ ...form, type: 'other' });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Document Category</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
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

export default function MasterPage() {
  const { getMasters, createMaster, updateMaster, deleteMaster } = useStore();
  const { toast } = useToast();
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editMaster, setEditMaster] = useState<Master | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter] = useState<Master['type'] | 'all'>('other');

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      setLoading(true);
      const data = await getMasters();
      setMasters(data);
    } catch (error) {
      toast('Failed to fetch masters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (masterData: Omit<Master, '_id' | 'createdAt' | 'isActive'>) => {
    try {
      await createMaster(masterData);
      toast('Master entry created successfully');
      fetchMasters();
    } catch (error: any) {
      toast(error.message || 'Failed to create master entry', 'error');
    }
  };

  const handleUpdate = async (id: string, masterData: Partial<Master>) => {
    try {
      await updateMaster(id, masterData);
      toast('Master entry updated successfully');
      fetchMasters();
    } catch (error: any) {
      toast(error.message || 'Failed to update master entry', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMaster(id);
      toast('Master entry deleted successfully');
      fetchMasters();
    } catch (error: any) {
      toast(error.message || 'Failed to delete master entry', 'error');
    }
  };

  const filteredMasters = masters.filter(master => {
    const matchesSearch = master.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || master.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Document Categories</h2>
        <p className="text-gray-500 mt-2">Manage custom document categories shown in the "Other" option when uploading documents.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-80 bg-gray-50 rounded-2xl py-3 pl-11 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-gray-100"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-100"
              >
                <Plus size={18} /> Add Category
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                  <th className="px-8 py-6">Category Name</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Created</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-blue-600 text-sm font-medium">Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filteredMasters.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <p className="text-gray-400 text-sm">{search ? 'No categories found matching your search.' : 'No custom categories added yet.'}</p>
                      {!search && (
                        <button onClick={() => setShowAdd(true)} className="mt-3 text-blue-600 font-bold text-sm hover:underline">+ Add your first category</button>
                      )}
                    </td>
                  </tr>
                )}
                {!loading && filteredMasters.map((master) => (
                  <tr key={master._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900">{master.name}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {master.isActive ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                        <span className={`text-xs font-bold ${master.isActive ? 'text-green-700' : 'text-red-600'}`}>
                          {master.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 font-medium">{master.createdAt}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditMaster(master)}
                          className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(master._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {showAdd && <AddMasterModal onClose={() => setShowAdd(false)} onSave={handleCreate} />}
      {editMaster && (
        <EditMasterModal
          master={editMaster}
          onClose={() => setEditMaster(null)}
          onSave={(data) => handleUpdate(editMaster._id, data)}
        />
      )}
    </div>
  );
}