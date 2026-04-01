'use client';

import React, { createContext, useContext, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type AuthCtx = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthCtx>({ isLoggedIn: false, login: async () => false, logout: () => {}, loading: true });

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 30) {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!getCookie('vault_token');
    }
    return false;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Try admin login first
      let res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        // If admin login fails, try staff login
        res = await fetch(`${API_URL}/staff/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username, password }),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setCookie('vault_token', data.token);
        setCookie('user_role', data.role || 'admin');
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    deleteCookie('vault_token');
    deleteCookie('user_role');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
