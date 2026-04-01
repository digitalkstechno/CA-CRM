'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Login page — render without shell
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans">
      <Sidebar />
      <div className="pl-64">
        <TopNav />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
