'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export function TopNav() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchClients = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await api.get(`/clients/search?q=${encodeURIComponent(query.trim())}&limit=10`);
        setResults(data);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchClients, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl" ref={ref}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300" size={18} />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Quick search (name, phone, email)..."
            className="w-full bg-slate-50/80 border border-transparent rounded-2xl py-2.5 pl-11 pr-10 text-sm focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all duration-300 outline-none placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          )}

          {open && query.trim().length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              {loading ? (
                <div className="px-4 py-8 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                  <p className="text-xs font-bold text-slate-400">Searching Database...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2 space-y-1">
                  {results.map(c => (
                    <Link
                      key={c._id}
                      href={`/clients/${c._id}`}
                      onClick={() => { setQuery(''); setOpen(false); }}
                      className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{c.name}</p>
                        <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">{c.phone}</p>
                      </div>
                      <div className={cn(
                        "text-[10px] font-black tracking-tighter px-2.5 py-1 rounded-lg uppercase",
                        c.paymentStatus === 'CLEAR' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      )}>
                        {c.paymentStatus}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-slate-200 mb-2 flex justify-center">
                    <Search size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 pl-5 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">Admin User</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200 select-none transform hover:scale-105 transition-transform cursor-pointer">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
