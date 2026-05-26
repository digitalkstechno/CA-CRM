'use client';

import React from 'react';
import { Users, FileText, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

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

export function DashboardStats({ clients }: { clients: Client[] }) {

  const totalDocs = clients.reduce((acc, c) => {
    const memberDocs = c.familyMembers.reduce((a, m) => a + m.documents.length, 0);
    return acc + c.documents.length + memberDocs;
  }, 0);

  const totalMembers = clients.reduce((acc, c) => acc + c.familyMembers.length, 0);
  const pendingPayments = clients.filter(c => c.paymentStatus === 'PENDING').length;

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50/50', delay: 0 },
    { label: 'Family Members', value: totalMembers, icon: UserPlus, color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50/50', delay: 0.1 },
    { label: 'Total Documents', value: totalDocs, icon: FileText, color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50/50', delay: 0.2 },
    { label: 'Pending Payments', value: pendingPayments, icon: AlertCircle, color: 'from-rose-500 to-rose-700', bg: 'bg-rose-50/50', delay: 0.3 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: stat.delay, type: 'spring', stiffness: 100 }}
          className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex items-center gap-6 hover-card relative overflow-hidden group"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] -mr-8 -mt-8 rounded-full transition-opacity duration-500`} />

          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon size={26} className="drop-shadow-sm" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-extrabold mb-1.5">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
