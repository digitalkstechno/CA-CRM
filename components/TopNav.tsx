'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export function TopNav() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch pending count on mount
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const data = await api.get('/clients?limit=9999');
        const count = data.clients.filter((c: any) => c.paymentStatus === 'PENDING').length;
        setPendingCount(count);
      } catch (error) {
        // silent fail
      }
    };
    fetchPendingCount();
  }, []);

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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl" ref={ref}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search clients, phone, email..."
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-10 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          )}

          {open && query.trim().length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {loading ? (
                <div className="px-4 py-6 text-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                results.map(c => (
                  <Link
                    key={c._id}
                    href={`/clients/${c._id}`}
                    onClick={() => { setQuery(''); setOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.paymentStatus === 'CLEAR' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {c.paymentStatus}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No clients found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/clients" className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <Bell size={22} />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold px-0.5">
              {pendingCount}
            </span>
          )}
        </Link>

        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm select-none">
          A
        </div>
      </div>
    </header>
  );
}
