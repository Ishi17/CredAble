'use client';

import {
  useLOSStyles,
  BorrowerJourneySection,
  DocumentIntelligenceSection,
  AIQuestionsSection,
  ReadyToTransformSection,
} from '@/components/los-sections';
import { PersonaHero } from '@/components/persona-hero';

export default function ForBorrowersPage() {
  useLOSStyles();

  return (
    <div className="h-screen bg-[#0a0f1a] text-white pt-[104px] overflow-y-auto" style={{ scrollSnapType: 'y mandatory' }}>
      {/* Ambient Intelligence Hero */}
      <PersonaHero persona="borrowers" />

      {/* 1. Borrower Journey */}
      <BorrowerJourneySection />

      {/* 2. Real-Time Document Intelligence */}
      <DocumentIntelligenceSection />

      {/* 3. AI Questions */}
      <AIQuestionsSection />

      {/* Closing CTA */}
      <ReadyToTransformSection />
    </div>
  );
}
