'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import {
  Shield, Zap, Globe, MessageSquare, CheckCircle2,
  ArrowRight, Play, Check, X, Menu, Phone,
  ChevronDown, Star, Clock, Award, Users,
  Send, Paperclip, Smile, Search, Download,
  FileText, BarChart3, Receipt, Database,
  LayoutDashboard, Lock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { BrandLogo } from '@/components/BrandLogo';

const inter = Inter({ subsets: ['latin'] });

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <BrandLogo className={className} size="md" />
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-semibold text-[#0A1628]/70 hover:text-[#0A1628] transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#0A1628] px-4 py-2 hover:bg-slate-100 rounded-full transition-all">
            Login
          </Link>
          <Link href="/login" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-100 transition-all flex items-center gap-2 group">
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[#0A1628]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white mt-4 rounded-3xl overflow-hidden shadow-xl border border-slate-100"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-base font-bold text-[#0A1628]/70 py-2 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login" className="w-full text-center py-3 font-bold text-[#0A1628]">Login</Link>
                <Link href="/login" className="w-full text-center py-4 bg-[#2563EB] text-white rounded-2xl font-bold">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const WhatsAppDemoPhone = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [step, setStep] = useState(0);

  const script = [
    { type: 'client', text: 'Mujhe GST Report chahiye' },
    { type: 'bot', text: 'Sure! Aapka GST Report taiyar hai 📄' },
    {
      type: 'bot',
      isDocs: true,
      docs: [
        { name: 'GST Report.pdf', size: '245 KB' },
        { name: 'ITR Copy.pdf', size: '180 KB' },
        { name: 'Balance Sheet.pdf', size: '1.2 MB' },
        { name: 'Tax Invoice.pdf', size: '45 KB' }
      ]
    },
    { type: 'client', text: 'Thank you! Bahut fast hai 🙏' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (step < script.length) {
        setMessages(prev => [...prev, script[step]]);
        setStep(prev => prev + 1);
      } else {
        setTimeout(() => {
          setMessages([]);
          setStep(0);
        }, 3000);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Floating Pills */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-8 bg-white shadow-xl px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-lg">🛡️</span>
        <span className="text-xs font-bold text-[#0A1628]">Secure & Safe</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/2 -right-12 bg-white shadow-xl px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-lg">⚡</span>
        <span className="text-xs font-bold text-[#0A1628]">Instant Delivery</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-8 -right-4 bg-white shadow-xl px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-lg">☁️</span>
        <span className="text-xs font-bold text-[#0A1628]">24x7 Access</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -top-4 -left-12 bg-white shadow-xl px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-lg">😊</span>
        <span className="text-xs font-bold text-[#0A1628]">Happy Clients</span>
      </motion.div>

      {/* Phone Body */}
      <div className="relative bg-[#0A1628] rounded-[3rem] p-3 shadow-2xl overflow-hidden border-[8px] border-[#0A1628]">
        {/* Screen */}
        <div className="bg-[#ECE5DD] h-[520px] rounded-[2.2rem] flex flex-col overflow-hidden relative">
          {/* Header */}
          <div className="bg-[#2563EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0">
              <div className="w-full h-full bg-[#0A1628] rounded-full flex items-center justify-center font-bold text-white text-[10px]">CA</div>
            </div>
            <div className="flex-1">
              <h4 className="text-white text-sm font-bold leading-tight">CA Flow <span className="text-[10px] bg-white/20 px-1 rounded">✓</span></h4>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                <span className="text-white/80 text-[10px]">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, x: m.type === 'client' ? 20 : -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  m.type === 'client' ? "ml-auto items-end" : "mr-auto"
                )}
              >
                {m.isDocs ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {m.docs.map((doc: any, j: number) => (
                      <div key={j} className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-red-500"><FileText size={16} /></div>
                          <span className="text-[9px] font-bold text-slate-800 truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-400">{doc.size}</span>
                          <div className="text-[#2563EB]"><Download size={10} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={cn(
                    "p-2.5 rounded-2xl text-xs font-medium shadow-sm",
                    m.type === 'client'
                      ? "bg-[#DCF8C6] text-slate-800 rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none"
                  )}>
                    {m.text}
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-[8px] text-slate-400">10:45 AM</span>
                      {m.type === 'client' && <div className="text-blue-500 font-bold">✓✓</div>}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-white p-2 flex items-center gap-2 border-t border-slate-200">
            <div className="bg-slate-100 rounded-full h-8 flex-1 flex items-center px-3">
              <span className="text-[10px] text-slate-400">Type a message...</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
              <Send size={14} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollingLogos = () => {
  const logos = ["Sharma & Associates", "Mehta CA Firm", "Patel Consultants", "Gupta & Co.", "Joshi Tax Services"];
  const doubleLogos = [...logos, ...logos, ...logos];

  return (
    <div className="bg-[#F8FAFC] py-8 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Trusted by 500+ CA firms across India</p>
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap"
          >
            {doubleLogos.map((logo, i) => (
              <span key={i} className="text-2xl font-black text-slate-200 uppercase tracking-tighter hover:text-slate-400 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center items-center gap-2 mt-8">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <span className="text-sm font-bold text-slate-500">4.9/5 from 200+ reviews</span>
        </div>
      </div>
    </div>
  );
};

const StepsSection = () => {
  const steps = [
    { icon: "💬", title: "Client Sends a Message", desc: "Client types the document name on WhatsApp — no app to install, no login needed" },
    { icon: "⚙️", title: "CA Flow Processes Request", desc: "Our AI reads the message, identifies the document, and fetches it from your secure vault" },
    { icon: "📁", title: "Document is Fetched", desc: "The exact file — GST report, ITR, balance sheet — is retrieved and prepared for delivery" },
    { icon: "📲", title: "Instant WhatsApp Delivery", desc: "The document is sent back to the client on WhatsApp in seconds, with a delivery receipt" },
  ];

  return (
    <div id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 blur-[120px] rounded-full -z-10" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-4">Simple. Automated. Brilliant.</h2>
          <p className="text-slate-500 font-medium text-lg">4 steps from client request to document delivery — in under 10 seconds</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-1 border-t-2 border-dashed border-slate-100 -z-10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="h-full bg-[#2563EB]/20"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:border-green-100 transition-all group"
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl mb-6 relative group-hover:bg-green-50 transition-colors">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {i + 1}
                </div>
              </div>
              <h4 className="text-xl font-bold text-[#0A1628] mb-3 leading-tight">{step.title}</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhatsAppSimulator = () => {
  const [messages, setMessages] = useState<any[]>([
    { type: 'bot', text: 'Namaste! Main CA Flow hoon. Kaunsa document chahiye aapko? 😊' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chips = [
    "GST Report maangna hai",
    "ITR Copy chahiye",
    "Balance Sheet bhejo",
    "Tax Invoice do"
  ];

  const responseMap: Record<string, string[]> = {
    "gst": ["GST Report Q3 2024.pdf", "GST Filing Summary.pdf"],
    "itr": ["ITR Copy AY2024-25.pdf"],
    "balance": ["Balance Sheet FY2024.pdf", "P&L Statement.pdf"],
    "invoice": ["Tax Invoice #1042.pdf", "Tax Invoice #1043.pdf"],
    "default": ["CA Flow Document.pdf"]
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { type: 'client', text }]);
    setIsTyping(true);

    // Simulate thinking
    await new Promise(r => setTimeout(r, 1500));
    setIsTyping(false);

    const lower = text.toLowerCase();
    let keyword = "default";
    if (lower.includes("gst")) keyword = "gst";
    else if (lower.includes("itr")) keyword = "itr";
    else if (lower.includes("balance") || lower.includes("sheet")) keyword = "balance";
    else if (lower.includes("invoice")) keyword = "invoice";

    if (keyword === "default" && !lower.includes("hello") && !lower.includes("hi")) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Ek second... main aapka document dhundh raha hoon 🔍' }]);
      await new Promise(r => setTimeout(r, 1000));
    }

    const files = responseMap[keyword];
    setMessages(prev => [
      ...prev,
      { type: 'bot', text: `Sure! Aapka ${keyword.toUpperCase()} taiyar hai ✅` },
      { type: 'bot', isDocs: true, docs: files.map(f => ({ name: f, size: '245 KB' })) }
    ]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div id="demo" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-4">See CA Flow in Action — Live</h2>
          <p className="text-slate-500 font-medium text-lg">Type a document request below just like your client would on WhatsApp</p>
        </div>

        <div className="max-w-[480px] mx-auto">
          <div className="bg-[#0A1628] rounded-[3rem] p-4 shadow-2xl border-4 border-[#2563EB]/30 relative">
            {/* WhatsApp Interface */}
            <div className="bg-[#ECE5DD] h-[580px] rounded-[2rem] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-[#2563EB] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-[#0A1628]">CA</div>
                  <div className="text-white">
                    <p className="font-bold text-sm flex items-center gap-1">CA Flow <span className="text-[10px] bg-[#25D366] rounded-full p-0.5"><Check size={8} className="text-white" /></span></p>
                    <span className="text-[10px] flex items-center gap-1"><div className="w-1 h-1 bg-[#25D366] rounded-full" /> Online</span>
                  </div>
                </div>
                <div className="flex gap-4 text-white/80">
                  <Phone size={18} />
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar-thin">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex flex-col", m.type === 'client' ? "items-end" : "items-start")}
                  >
                    {m.isDocs ? (
                      <div className="space-y-2 w-full max-w-[80%]">
                        {m.docs.map((doc: any, j: number) => (
                          <div key={j} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><FileText size={20} /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.size}</p>
                            </div>
                            <button className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-full"><Download size={18} /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={cn(
                        "p-3 rounded-2xl text-sm font-medium shadow-sm max-w-[85%]",
                        m.type === 'client' ? "bg-[#DCF8C6] rounded-tr-none" : "bg-white rounded-tl-none"
                      )}>
                        {m.text}
                        <div className="text-[9px] text-slate-400 text-right mt-1">10:45 AM</div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl w-fit">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom UI */}
              <div className="bg-white p-4">
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                  {chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="whitespace-nowrap bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-[#2563EB]/10 hover:border-[#2563EB]/30 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-3 flex items-center justify-between">
                    <input
                      placeholder="Type a message..."
                      className="bg-transparent text-sm outline-none w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSend(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <div className="flex gap-3 text-slate-400">
                      <Paperclip size={18} />
                      <Smile size={18} />
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <Send size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
            {/* Clear Button */}
            <button
              onClick={() => {
                setMessages([{ type: 'bot', text: 'Namaste! Main CA Flow hoon. Kaunsa document chahiye aapko? 😊' }]);
                setIsTyping(false);
              }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-slate-400 font-bold text-xs hover:text-[#0A1628] uppercase tracking-widest transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: isYearly ? "799" : "999",
      features: ["Up to 50 Clients", "500 Documents/mo", "WhatsApp Bot", "Email Support"],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: isYearly ? "1,999" : "2,499",
      features: ["Up to 200 Clients", "5,000 Documents/mo", "WhatsApp Bot", "Full Audit Trail", "Custom Branding"],
      cta: "Start Free",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited Clients", "Unlimited Documents", "WhatsApp Bot", "Priority Support", "Dedicated Manager", "SLA Guarantee"],
      cta: "Contact Us",
      popular: false
    }
  ];

  return (
    <div id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-6">Simple, Transparent Pricing</h2>
          <p className="text-slate-500 font-medium text-lg">One plan for everything you need to scale your CA firm.</p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-[2.5rem] border bg-[#0A1628] border-[#0A1628] shadow-2xl relative z-10 text-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              Full Access Plan
            </div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-[#2563EB]">All-In-One CRM</h3>

            <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-semibold">CA Flow CRM (Annual)</span>
                <span className="text-2xl font-black">₹9,999</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-semibold">WhatsApp API & Platform</span>
                <span className="text-2xl font-black">₹14,999</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-8 justify-center">
              <span className="text-5xl font-black text-white">₹24,998</span>
              <span className="text-sm font-medium text-white/50">/year</span>
            </div>

            <div className="space-y-4 mb-10">
              {["Unlimited Clients", "WhatsApp Automation", "Full Audit Trail", "Custom Branding", "Priority Support"].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#2563EB]/20">
                    <Check size={12} className="text-[#2563EB]" />
                  </div>
                  <span className="text-sm font-semibold opacity-90">{f}</span>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="block w-full text-center py-4 rounded-2xl font-black text-sm transition-all bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    { q: "Do clients need to install any app?", a: "No, clients use WhatsApp which they already have. They just send a message to your verified business number." },
    { q: "How are documents stored securely?", a: "We use bank-grade 256-bit AES encryption. Documents are stored in a secure cloud vault, and only verified clients can access their own data." },
    { q: "Can I use my existing WhatsApp number?", a: "Yes, we can help you onboard your existing official number to the WhatsApp Business API for CA Flow." },
    { q: "What document formats are supported?", a: "PDF, JPG, PNG, Excel, and more. Most common requested files like ITR, Balance Sheets, and GST reports are typically shared as PDFs." },
    { q: "How long does setup take?", a: "Our team handles the setup. It usually takes under 10 minutes to upload your first set of client documents and go live." }
  ];

  return (
    <div className="py-24 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black text-[#0A1628] mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between group"
              >
                <span className={cn("font-bold transition-colors", openIdx === i ? "text-[#2563EB]" : "text-[#0A1628]")}>{faq.q}</span>
                <div className={cn("transition-transform duration-300", openIdx === i ? "rotate-180 text-[#2563EB]" : "text-slate-400 group-hover:text-slate-900")}>
                  <ChevronDown size={20} />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-6 text-slate-500 text-sm font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Page Component ---

export default function LandingPage() {
  return (
    <div className={cn("min-h-screen bg-slate-50 overflow-x-hidden", inter.className)}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-[120px] opacity-40 animate-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-[#0A1628] uppercase tracking-widest">Now Live — WhatsApp Automation for CA Firms</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#0A1628] leading-[1] tracking-tighter mb-8">
              "Aapka Client, <br />
              <span className="text-[#2563EB]">Apne Documents</span>, <br />
              Jab Chahe, Jahan Chahe!"
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mb-10">
              Ab aapke clients ko documents ke liye call ya wait karne ki zaroorat nahi. WhatsApp par message bhejo aur apne documents turant pao.
            </p>

            <div className="flex flex-wrap items-center gap-10 mb-12">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#0A1628]">500+</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CA Firms</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#0A1628]">50,000+</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Docs Sent</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#0A1628]">4.9★</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                Get Started Now <ArrowRight size={22} />
              </Link>
              <button className="bg-white border border-slate-200 text-[#0A1628] px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#0A1628]/5 flex items-center justify-center group-hover:bg-[#0A1628] group-hover:text-white transition-all"><Play size={14} fill="currentColor" /></div>
                Watch 2-min Demo
              </button>
            </div>
            <p className="mt-6 text-sm font-bold text-slate-400 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#2563EB]" /> Professional Setup · 24x7 Support
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <WhatsAppDemoPhone />
          </motion.div>
        </div>
      </section>

      <ScrollingLogos />

      {/* Problem vs Solution */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Old Way */}
            <motion.div
              whileInView={{ x: [-100, 0], opacity: [0, 1] }}
              className="bg-white p-10 rounded-[3rem] border border-red-50 relative group hover:border-red-200 transition-all"
            >
              <div className="absolute top-6 right-6 text-red-100 group-hover:text-red-500/20 transition-colors">
                <X size={100} strokeWidth={4} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10">The Old Way <br /><span className="text-red-500">Without CA Flow</span></h3>
              <div className="space-y-6 relative z-10">
                {[
                  "Clients call repeatedly for documents",
                  "Staff wastes hours on manual sharing",
                  "Documents sent on personal WhatsApp — no tracking",
                  "No record of what was shared and when",
                  "Clients feel frustrated & unprofessional service"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <X size={14} className="text-red-500" />
                    </div>
                    <span className="text-slate-500 font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* New Way */}
            <motion.div
              whileInView={{ x: [100, 0], opacity: [0, 1] }}
              className="bg-[#0A1628] p-10 rounded-[3rem] border border-blue-500/20 relative group hover:border-blue-500/50 transition-all text-white shadow-2xl"
            >
              <div className="absolute top-6 right-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                <Check size={100} strokeWidth={4} />
              </div>
              <h3 className="text-2xl font-black mb-8 relative z-10">The New Way <br /><span className="text-[#2563EB]">With CA Flow</span></h3>
              <div className="space-y-6 relative z-10">
                {[
                  "Clients self-serve documents 24x7 on WhatsApp",
                  "Zero manual effort from your team",
                  "Branded, professional document delivery",
                  "Full audit trail — who got what and when",
                  "Clients trust your firm more, refer others"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-[#2563EB]" />
                    </div>
                    <span className="text-slate-300 font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StepsSection />

      <WhatsAppSimulator />

      {/* Features Deep Dive */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-4">Everything Your CA Firm Needs</h2>
            <p className="text-slate-500 font-medium text-lg">Powerful tools built specifically for professional accounting practices.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Bank-Grade Security", desc: "All documents encrypted end-to-end. Only verified clients access their own files.", color: "text-blue-500" },
              { icon: Zap, title: "Instant Delivery", desc: "From request to receipt in under 10 seconds. No delays, no excuses.", color: "text-amber-500" },
              { icon: Database, title: "Cloud Document Vault", desc: "Upload once, deliver forever. Organize by client, year, or document type.", color: "text-purple-500" },
              { icon: BarChart3, title: "Full Audit Trail", desc: "Every document sent is logged — who, what, when. Perfect for compliance.", color: "text-emerald-500" },
              { icon: MessageSquare, title: "Smart AI Assistant", desc: "Understands natural language requests in Hindi and English both.", color: "text-indigo-500" },
              { icon: Phone, title: "No App for Clients", desc: "Clients use WhatsApp they already have. Zero onboarding friction.", color: "text-[#25D366]" }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="p-10 bg-[#F8FAFC] rounded-[2.5rem] border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 px-3 group-hover:scale-110 transition-transform", f.color)}>
                  <f.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-[#0A1628] mb-3">{f.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="flex-1 sticky top-32 h-fit">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-8">Why 500+ CA Firms Switched to CA Flow</h2>
            <div className="space-y-10">
              {[
                { icon: Clock, title: "Time Bachaye", desc: "Save 3–4 hours daily on document requests" },
                { icon: Award, title: "Productivity Badhaye", desc: "Staff focuses on high-value CA work, not fetching files" },
                { icon: Shield, title: "Professional Image", desc: "Branded delivery makes your firm look premium" },
                { icon: Users, title: "Client Trust Banaye", desc: "Fast, reliable service = more referrals" }
              ].map((b, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-50 flex items-center justify-center shrink-0 text-[#2563EB]">
                    <b.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">{b.title}</h4>
                    <p className="text-slate-500 font-medium">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-8">
            {[
              { val: "3–4 hrs", label: "saved per day", color: "bg-blue-600" },
              { val: "90%", label: "reduction in calls", color: "bg-emerald-600" },
              { val: "10 sec", label: "avg delivery time", color: "bg-[#0A1628]" },
              { val: "98%", label: "client satisfaction", color: "bg-[#2563EB]" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                className={cn("p-12 rounded-[3rem] text-white", stat.color)}
              >
                <p className="text-5xl md:text-7xl font-black mb-2">{stat.val}</p>
                <p className="text-lg font-bold opacity-75 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-16 text-center">CA Firms Love CA Flow</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { q: "Clients used to call 5–6 times a week for documents. Now they WhatsApp CA Flow and get it in seconds. Best investment for our firm.", name: "Rajesh Mehta", firm: "Mehta & Associates", city: "Ahmedabad" },
              { q: "Professional image badh gayi hai. Clients impressed hote hain jab itna fast documents milte hain.", name: "Priya Sharma", firm: "Sharma Tax Consultants", city: "Surat" },
              { q: "Setup liya 10 minutes mein, aur next day se clients khud documents le rahe the. No training needed.", name: "Amit Patel", firm: "Patel CA Firm", city: "Mumbai" }
            ].map((t, i) => (
              <div key={i} className="p-10 bg-[#F8FAFC] rounded-[3rem] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-6 font-black tracking-tight uppercase">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-lg font-medium text-slate-800 italic mb-10 leading-relaxed">"{t.q}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0A1628] text-white rounded-full flex items-center justify-center font-bold">{t.name[0]}</div>
                  <div>
                    <p className="font-black text-slate-900">{t.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.firm}, {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <FAQSection />

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto bg-[#0A1628] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6">Smart CA Firms ki Pehchaan,<br /><span className="text-[#2563EB]">Automation</span> ke saath!</h2>
            <p className="text-xl text-white/60 font-medium mb-12 max-w-2xl mx-auto">Join 500+ CA firms delivering documents the modern way.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/20">
                Get Started Now
              </Link>
              <button className="bg-transparent border-2 border-white/20 hover:border-white text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
                <MessageSquare size={22} fill="currentColor" /> Talk to Us on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <Logo className="mb-6" />
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Documents. Automation. Flow.<br />Making accounting digital first.</p>
              <div className="flex gap-4">
                {[Globe, MessageSquare, Shield].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-black text-[#0A1628] mb-6 uppercase tracking-widest text-[10px]">Product</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-slate-900 cursor-pointer">Features</li>
                <li className="hover:text-slate-900 cursor-pointer">Pricing</li>
                <li className="hover:text-slate-900 cursor-pointer">Demo</li>
                <li className="hover:text-slate-900 cursor-pointer">Changelog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[#0A1628] mb-6 uppercase tracking-widest text-[10px]">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-slate-900 cursor-pointer">About</li>
                <li className="hover:text-slate-900 cursor-pointer">Blog</li>
                <li className="hover:text-slate-900 cursor-pointer">Careers</li>
                <li className="hover:text-slate-900 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[#0A1628] mb-6 uppercase tracking-widest text-[10px]">Legal</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-slate-900 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-slate-900 cursor-pointer">Terms of Service</li>
                <li className="hover:text-slate-900 cursor-pointer">Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2024 CA Flow. Made with ❤️ for CA Firms in India</p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <span>GST Compliant</span>
              <span>ISO Certified</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar { width: 2px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
