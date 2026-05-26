'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    theme?: 'light' | 'dark';
}

export function BrandLogo({ className, size = 'md', showText = true, theme = 'light' }: BrandLogoProps) {
    const sizes = {
        sm: { icon: 'w-8 h-8', text: 'text-lg', dot: 'w-1.5 h-1.5' },
        md: { icon: 'w-11 h-11', text: 'text-xl', dot: 'w-2 h-2' },
        lg: { icon: 'w-16 h-16', text: 'text-3xl', dot: 'w-3 h-3' },
        xl: { icon: 'w-24 h-24', text: 'text-5xl', dot: 'w-4 h-4' }
    };

    const currentSize = sizes[size];

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div
                className={cn(
                    currentSize.icon,
                    "bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <span className="font-black tracking-tighter relative z-10 select-none" style={{ fontSize: size === 'xl' ? '2.5rem' : size === 'lg' ? '1.8rem' : '1.2rem' }}>
                    CA
                </span>
                <div className={cn(currentSize.dot, "absolute bottom-2 right-2 bg-blue-400 rounded-full animate-pulse")} />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <h1 className={cn(
                        currentSize.text,
                        "font-black tracking-tight leading-none",
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                    )}>
                        CA <span className="text-blue-600">Flow</span>
                    </h1>
                    {size !== 'sm' && (
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-1.5">Management</p>
                    )}
                </div>
            )}
        </div>
    );
}
