'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Pencil, X, Check, Calendar, GripVertical, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

type ItrYearItem = {
  _id: string;
  year: string;
  isActive: boolean;
  order: number;
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete ITR Year?</h3>
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
  item?: ItrYearItem | null;
  onClose: () => void;
  onSave: (data: { year: string; isActive: boolean; order: number }) => Promise<void>;
}) {
  const [year, setYear] = useState(item?.year || '');
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [order, setOrder] = useState(item?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim()) return;
    setLoading(true);
    try {
      await onSave({ year: year.trim(), isActive, order: Number(order) });
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Calendar size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {item ? 'Edit ITR Year' : 'Add ITR Year'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year *</label>
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              autoFocus
              placeholder="e.g. 2025-26"
              required
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Format: YYYY-YY (e.g. 2025-26)</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              min={0}
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Lower number = appears first in dropdown</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400 mt-0.5">Inactive years won't appear in document upload</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="transition-transform active:scale-95"
            >
              {isActive
                ? <ToggleRight size={36} className="text-indigo-600" />
                : <ToggleLeft size={36} className="text-gray-300" />
              }
            </button>
          </div>

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
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {loading ? (item ? 'Saving...' : 'Adding...') : (item ? 'Save Changes' : 'Add Year')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ItrYearsPage() {
  const [years, setYears] = useState<ItrYearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<ItrYearItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchYears = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/itr-years');
      setYears(data);
    } catch {
      toast('Failed to load ITR years', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleAdd = async (data: { year: string; isActive: boolean; order: number }) => {
    await api.post('/itr-years', data);
    toast('ITR Year added successfully');
    fetchYears();
  };

  const handleEdit = async (data: { year: string; isActive: boolean; order: number }) => {
    if (!editItem) return;
    await api.put(`/itr-years/${editItem._id}`, data);
    toast('ITR Year updated successfully');
    fetchYears();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/itr-years/${deleteId}`);
      toast('ITR Year deleted', 'error');
      setDeleteId(null);
      fetchYears();
    } catch (err: any) {
      toast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleToggleActive = async (item: ItrYearItem) => {
    try {
      await api.put(`/itr-years/${item._id}`, { isActive: !item.isActive });
      toast(`${item.year} ${!item.isActive ? 'activated' : 'deactivated'}`);
      fetchYears();
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const activeCount = years.filter(y => y.isActive).length;

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
          message={`This will remove the ITR year "${years.find(y => y._id === deleteId)?.year}" from the system. Existing documents using this year won't be affected.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="max-w-3xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">ITR Years</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage assessment years available in document upload.
                <span className="ml-2 inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {activeCount} active
                </span>
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdd(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-indigo-100"
            >
              <Plus size={18} /> Add Year
            </motion.button>
          </div>
        </div>

        {/* Tip Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <div className="text-amber-500 text-xl mt-0.5">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-800">How it works</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Only <strong>Active</strong> years appear in the ITR Year dropdown when uploading documents.
              Inactive years are hidden but existing documents are unaffected. Lower sort order = appears first.
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{years.length}</span> years total
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-indigo-600 text-sm font-medium">Loading...</span>
            </div>
          ) : years.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-indigo-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No ITR years added yet.</p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-3 text-indigo-600 font-bold text-sm hover:underline"
              >
                + Add your first year
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">In Dropdown</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {years.map((item) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <Calendar size={16} className="text-indigo-500" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">ITR {item.year}</p>
                            <p className="text-xs text-gray-400">Assessment Year</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">
                          {item.order}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {item.isActive
                            ? <ToggleRight size={28} className="text-indigo-600 hover:text-indigo-700 transition-colors" />
                            : <ToggleLeft size={28} className="text-gray-300 hover:text-gray-400 transition-colors" />
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            VISIBLE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            HIDDEN
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
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

        {/* Quick Add Common Years */}
        {years.length === 0 && !loading && (
          <div className="mt-6 bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <p className="text-sm font-bold text-indigo-800 mb-3">Quick Add Common Years</p>
            <div className="flex flex-wrap gap-2">
              {['2025-26', '2024-25', '2023-24', '2022-23', '2021-22', '2020-21'].map((y, i) => (
                <button
                  key={y}
                  onClick={() => handleAdd({ year: y, isActive: true, order: i })}
                  className="px-4 py-2 bg-white rounded-xl border border-indigo-200 text-indigo-700 text-sm font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
