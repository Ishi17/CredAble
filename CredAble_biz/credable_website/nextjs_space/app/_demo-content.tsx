'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DemoContent() {
  const [displayedText, setDisplayedText] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const fullText = 'Tata Motors wants to onboard a supplier. The supplier has provided 24 months of GST invoices, 18 months of bank statements, and audited financials for the last 3 years...';
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <Link href="/home" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <Image src="/credable-logo.png" alt="CredAble" width={120} height={35} className="opacity-90" />
        </div>
        <Link href="/ai-brain" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
          Explore AI Brain →
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CredAble is an AI Operating System
          </h1>
          <p className="text-slate-500 text-lg">for Working Capital and Supply Chain Finance</p>
        </div>

        {/* Chat Pill */}
        <div
          className={`chat-pill ${isChatExpanded ? 'chat-pill-expanded' : ''}`}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '16px 24px',
            border: '1px solid rgba(71, 85, 105, 0.4)',
            maxWidth: isChatExpanded ? '580px' : '480px',
            width: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isChatExpanded
              ? '0 18px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(249, 115, 22, 0.2)'
              : '0 12px 40px rgba(0,0,0,0.3)',
            borderColor: isChatExpanded ? 'rgba(249, 115, 22, 0.4)' : 'rgba(71, 85, 105, 0.4)'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #F97316 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ask CredAble AI anything..."
              className="flex-1 bg-transparent border-none outline-none text-slate-300 placeholder-slate-500"
              onFocus={() => setIsChatExpanded(true)}
              onBlur={() => setIsChatExpanded(false)}
            />
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Demo Console */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '700px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Live Demo</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          {displayedText}
          <span className="inline-block w-0.5 h-4 bg-orange-400 ml-1 animate-pulse" />
        </p>
      </div>
    </div>
  );
}
