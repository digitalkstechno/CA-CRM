'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, Eye, EyeOff, Lock, User, ArrowRight, CheckCircle2, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { BrandLogo } from '@/components/BrandLogo';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(form.username.trim(), form.password);
    if (ok) {
      router.replace('/');
    } else {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, text: 'Instant Document Processing', color: 'text-amber-500' },
    { icon: Globe, text: 'Real-time WhatsApp Integration', color: 'text-emerald-500' },
    { icon: Shield, text: 'Enterprise Grade Security', color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-40" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[900px] grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative z-10"
      >
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-50 border-r border-slate-100 relative min-h-[550px]">
          <div className="relative z-10">
            <BrandLogo size="lg" className="mb-12" />
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <p className="text-slate-600 text-base font-medium max-w-xs mb-4">
                Professional system for CAs. <br />
                Secure, fast, and intuitive.
              </p>
              <p className="text-slate-500 text-xs font-semibold mb-10 leading-relaxed">
                Automatic WhatsApp message send when client message flow and all client docs share easy
              </p>
            </motion.div>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all cursor-default">
                  <b.icon size={18} className={b.color} />
                  <span className="font-semibold text-slate-700 text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
            © 2024 CA Flow Portal
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Login</h3>
            <p className="text-slate-500 font-medium text-sm mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 ml-1">Email or Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-600 font-bold bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <div className="flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span className="font-bold text-[10px] text-slate-900 uppercase">Secure Access</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
