'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  RevealSection,
  useLOSStyles,
  WhyCredAbleSection,
  ReadyToTransformSection,
} from '@/components/los-sections';

const personaCards = [
  { href: '/los-platform/for-credit-managers', title: 'For Credit Managers' },
  { href: '/los-platform/for-bank-transformation-teams', title: 'For Bank Transformation Teams' },
  { href: '/los-platform/for-borrowers', title: 'For Borrowers' },
  { href: '/los-platform/for-relationship-managers', title: 'For Relationship managers' },
];

export default function LOSPlatformPage() {
  useLOSStyles();

  return (
    <div
      className="h-screen bg-[#0a0f1a] text-white pt-16 overflow-y-auto"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* Hero Section */}
      <section className="py-20 px-6 scroll-snap-align-start los-fullscreen">
        <div className="max-w-5xl mx-auto text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Loan Origination System (LOS)
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            The intelligent platform that transforms how banks process, analyze, and approve business credit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              Book a Demo
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-full text-lg transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Explore what CredAble Does - Persona Cards */}
      <RevealSection className="py-20 px-6 bg-slate-900/30">
        <div id="how-it-works" className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore what CredAble Does
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personaCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                aria-label={card.title}
                className="ai-trace-card group block bg-slate-800/50 border border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:bg-slate-800/70 hover:border-orange-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0f1a]"
              >
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-400 mt-2 text-sm">
                  Learn how CredAble empowers {card.title.toLowerCase().replace('for ', '')} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Why CredAble - STAYS ON ABOUT PAGE */}
      <WhyCredAbleSection />

      {/* Closing Section - STAYS ON ABOUT PAGE */}
      <ReadyToTransformSection />
    </div>
  );
}