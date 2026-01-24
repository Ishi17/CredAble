'use client';

import {
  useLOSStyles,
  BankAdminSection,
  CredAbleAIAssistantSection,
  AIBusinessRulesSection,
  ReadyToTransformSection,
} from '@/components/los-sections';
import { PersonaHero } from '@/components/persona-hero';

export default function ForBankTransformationTeamsPage() {
  useLOSStyles();

  return (
    <div className="h-screen bg-[#0a0f1a] text-white pt-16 overflow-y-auto" style={{ scrollSnapType: 'y mandatory' }}>
      {/* Ambient Intelligence Hero */}
      <PersonaHero persona="bank-transformation" />

      {/* 1. Bank Admin: Configure Programs Instantly */}
      <BankAdminSection />

      {/* 2. CredAble AI Assistant */}
      <CredAbleAIAssistantSection />

      {/* 3. AI-Powered Business Rules Engine */}
      <AIBusinessRulesSection />

      {/* Closing CTA */}
      <ReadyToTransformSection />
    </div>
  );
}
