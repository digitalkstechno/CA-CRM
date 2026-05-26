'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { motion } from 'motion/react';
import { Users, ArrowRight, FileText, UserPlus, Shield } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

type Client = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: 'CLEAR' | 'PENDING';
  serviceEnabled: boolean;
  createdAt: string;
  documents: any[];
  familyMembers: any[];
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get('/clients?limit=20');
        setClients(data.clients || []);
      } catch (error) {
        // silent fail
      }
    };
    fetchClients();
  }, []);

  const recent = [...clients].reverse().slice(0, 5);
  const clearClients = clients.filter(c => c.paymentStatus === 'CLEAR');

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-400 font-bold mt-2 tracking-wide uppercase text-[10px]">System Overview • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/clients" className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Manage Clients
          </Link>
          <Link href="/clients?add=true" className="bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Add New Client
          </Link>
        </div>
      </div>

      <DashboardStats clients={clients} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Users size={120} />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Clients</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Latest activity in your database</p>
            </div>
            <Link href="/clients" className="bg-slate-50 text-slate-400 p-2 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all group">
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2 relative z-10">
            {recent.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold">No clients found yet.</p>
                <Link href="/clients" className="text-blue-600 font-bold text-sm mt-3 inline-block hover:underline">Start by adding a client</Link>
              </div>
            )}
            {recent.map((client, i) => {
              const totalDocs = client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0);
              return (
                <motion.div
                  key={client._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/clients/${client._id}`} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">{client.name}</p>
                      <p className="text-xs font-semibold text-slate-400 tracking-tight mt-0.5">{client.phone}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <UserPlus size={14} className="text-slate-300" /> {client.familyMembers.length} members
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <FileText size={14} className="text-slate-300" /> {totalDocs} docs
                        </span>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-lg font-bold text-[10px] tracking-tight border",
                        client.paymentStatus === 'CLEAR'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-500 border-rose-100'
                      )}>
                        {client.paymentStatus}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-900">Verified Clients</h3>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Shield size={18} />
              </div>
            </div>

            {clearClients.length === 0 ? (
              <div className="py-20 text-center px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-sm font-bold text-slate-300 italic">No clear payments recorded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clearClients.slice(0, 8).map(c => (
                  <Link key={c._id} href={`/clients/${c._id}`} className="flex items-center gap-4 hover:bg-slate-50 rounded-xl p-2 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{c.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{c.documents.length + c.familyMembers.reduce((a, m) => a + m.documents.length, 0)} files stored</p>
                    </div>
                  </Link>
                ))}
                {clearClients.length > 8 && (
                  <Link href="/clients" className="text-xs text-blue-600 font-bold hover:underline block text-center pt-4 tracking-tight">
                    View all {clearClients.length} verified clients
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
