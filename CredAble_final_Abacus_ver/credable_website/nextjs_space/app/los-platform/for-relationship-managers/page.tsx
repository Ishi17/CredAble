'use client';

import {
  useLOSStyles,
  RiskIntelligenceSection,
  AISummarySection,
  ReadyToTransformSection,
} from '@/components/los-sections';
import { PersonaHero } from '@/components/persona-hero';

export default function ForRelationshipManagersPage() {
  useLOSStyles();

  return (
    <div className="h-screen bg-[#0a0f1a] text-white pt-16 overflow-y-auto" style={{ scrollSnapType: 'y mandatory' }}>
      {/* Ambient Intelligence Hero */}
      <PersonaHero persona="relationship-managers" />

      {/* 1. Risk Intelligence */}
      <RiskIntelligenceSection />

      {/* 2. AI Summary Generator + Decision Recommendations */}
      <AISummarySection />

      {/* Closing CTA */}
      <ReadyToTransformSection />
    </div>
  );
}
