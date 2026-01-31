'use client';

import {
  useLOSStyles,
  CreditManagerDashboardSection,
  CAMSection,
  RiskIntelligenceSection,
  AISummarySection,
  PortfolioBenchmarkingSection,
  ReadyToTransformSection,
} from '@/components/los-sections';
import { PersonaHero } from '@/components/persona-hero';

export default function ForCreditManagersPage() {
  useLOSStyles();

  return (
    <div className="h-screen bg-[#0a0f1a] text-white pt-[104px] overflow-y-auto" style={{ scrollSnapType: 'y mandatory' }}>
      {/* Ambient Intelligence Hero */}
      <PersonaHero persona="credit-managers" />

      {/* 1. Credit Manager Dashboard */}
      <CreditManagerDashboardSection />

      {/* 2. CAM in Seconds */}
      <CAMSection />

      {/* 3. Risk Intelligence */}
      <RiskIntelligenceSection />

      {/* 4. AI Summary Generator + Decision Recommendations */}
      <AISummarySection />

      {/* 5. Portfolio Benchmarking */}
      <PortfolioBenchmarkingSection />

      {/* Closing CTA */}
      <ReadyToTransformSection />
    </div>
  );
}
