'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Pencil, X, Check, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

type StaffItem = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
      >
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Staff?</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

function AddEditModal({
  item,
  onClose,
  onSave,
}: {
  item?: StaffItem | null;
  onClose: () => void;
  onSave: (data: { name: string; email: string; password?: string }) => Promise<void>;
}) {
  const [name, setName] = useState(item?.name || '');
  const [email, setEmail] = useState(item?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (!item && !password.trim()) return;
    setLoading(true);
    try {
      await onSave({ name: name.trim(), email: email.trim(), password: password || undefined });
      onClose();
    } catch (err: any) {
      toast(err.message || 'Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {item ? 'Edit Staff' : 'Add Staff'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              placeholder="Enter staff name"
              required
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>

          {!item && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
            </div>
          )}

          {item && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-100"
            >
              {loading ? (item ? 'Saving...' : 'Adding...') : (item ? 'Save Changes' : 'Add Staff')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<StaffItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/staff');
      setStaff(data);
    } catch {
      toast('Failed to load staff', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAdd = async (data: { name: string; email: string; password?: string }) => {
    await api.post('/staff', data);
    toast('Staff added successfully');
    fetchStaff();
  };

  const handleEdit = async (data: { name: string; email: string; password?: string }) => {
    if (!editItem) return;
    await api.put(`/staff/${editItem._id}`, data);
    toast('Staff updated successfully');
    fetchStaff();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/staff/${deleteId}`);
      toast('Staff deleted', 'error');
      setDeleteId(null);
      fetchStaff();
    } catch (err: any) {
      toast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <>
      {showAdd && (
        <AddEditModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
      {editItem && (
        <AddEditModal item={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} />
      )}
      {deleteId && (
        <ConfirmModal
          message={`This will remove the staff member from the system. They will no longer be able to log in.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mb-4 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage staff accounts and their access to the system.
                <span className="ml-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {staff.length} staff
                </span>
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdd(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-100"
            >
              <Plus size={18} /> Add Staff
            </motion.button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{staff.length}</span> staff members
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-blue-600 text-sm font-medium">Loading...</span>
            </div>
          ) : staff.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-blue-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No staff added yet.</p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-3 text-blue-600 font-bold text-sm hover:underline"
              >
                + Add your first staff member
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Role</th>
                  <th className="px-6 py-4 text-center">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {staff.map((item) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <User size={16} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">Staff Member</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{item.email}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {item.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}