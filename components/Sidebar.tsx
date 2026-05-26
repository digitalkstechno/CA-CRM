'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, HelpCircle, Shield, LogOut, Settings, DatabaseZapIcon, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clients', href: '/clients' },
  // { icon: HelpCircle, label: 'Help Center', href: '/help' },
];

const adminNavItems = [
  { icon: Database, label: 'Other', href: '/masters' },
  { icon: DatabaseZapIcon, label: 'ITR Years', href: '/settings/itr-years' },
  { icon: Settings, label: 'Staff Management', href: '/settings/staff' },
];

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

import { BrandLogo } from './BrandLogo';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    setIsAdmin(getCookie('user_role') === 'admin');
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200/60 flex flex-col z-50 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.02)]">
      <div className="p-8">
        <BrandLogo />
      </div>

      <div className="flex-1 px-6 py-4 space-y-8 overflow-y-auto">
        <div className="space-y-1.5">
          <div className="px-3 pb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</span>
          </div>
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'bg-blue-600/5 text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <item.icon size={20} className={cn(
                  'transition-all duration-300',
                  isActive ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-900 group-hover:scale-110'
                )} />
                <span className={cn(
                  "font-semibold text-sm transition-transform duration-300",
                  isActive ? "translate-x-1" : "group-hover:translate-x-1"
                )}>{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="space-y-1.5 pt-4">
            <div className="px-3 pb-3 border-t border-slate-100 pt-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Administration</span>
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'bg-blue-600/5 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <item.icon size={20} className={cn(
                    'transition-all duration-300',
                    isActive ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-900 group-hover:scale-110'
                  )} />
                  <span className={cn(
                    "font-semibold text-sm transition-transform duration-300",
                    isActive ? "translate-x-1" : "group-hover:translate-x-1"
                  )}>{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 group font-semibold text-sm"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-rose-600 transition-transform group-hover:-translate-x-1" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
