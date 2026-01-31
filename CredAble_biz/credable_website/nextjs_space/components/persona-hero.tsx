'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Gauge, ShieldCheck, TrendingUp, Scale, GitBranch, Settings, Plug, Cloud, Lock, Upload, MessageCircle, CheckCircle, Clock, Loader, Flag, Star, User, Activity, Lightbulb } from 'lucide-react';
import { RevealSection } from './los-sections';
import { ScrollDownPrompt } from './scroll-down-prompt';

// Persona configurations
export type PersonaType = 'credit-managers' | 'bank-transformation' | 'borrowers' | 'relationship-managers';

const personaConfig = {
  'credit-managers': {
    systemPreface: 'Initialising credit intelligence for Credit Managers…',
    goal: 'Faster, Smarter Credit Decisions',
    context: 'Risk clarity, structure alignment, and policy confidence — in minutes.',
    intelligenceStatement: 'CredAble continuously evaluates borrower risk, structure fit, and policy alignment — surfacing only what matters for the decision at hand.',
    chips: ['Risk clarity', 'Policy alignment', 'Decision speed'],
    icons: [
      { Icon: FileText, position: 'top-[15%] left-[8%]', animation: 'persona-drift-1', size: 48 },
      { Icon: Gauge, position: 'top-[25%] right-[12%]', animation: 'persona-drift-2', size: 44 },
      { Icon: ShieldCheck, position: 'bottom-[30%] left-[5%]', animation: 'persona-drift-3', size: 40 },
      { Icon: TrendingUp, position: 'bottom-[20%] right-[8%]', animation: 'persona-drift-4', size: 46 },
      { Icon: Scale, position: 'top-[60%] right-[5%]', animation: 'persona-drift-5', size: 42 },
    ],
    motionType: 'analytical',
  },
  'bank-transformation': {
    systemPreface: 'Configuring intelligent lending workflows…',
    goal: 'Modernize Lending Without Rebuilding Everything',
    context: 'Launch and scale programs with AI-first configuration, automation, and control.',
    intelligenceStatement: 'CredAble enables rapid program rollout with governance-grade controls — across products, geographies, and policies.',
    chips: ['Program setup', 'Rules orchestration', 'Governance'],
    icons: [
      { Icon: GitBranch, position: 'top-[18%] left-[6%]', animation: 'persona-linear-1', size: 46 },
      { Icon: Settings, position: 'top-[30%] right-[10%]', animation: 'persona-linear-2', size: 44 },
      { Icon: Plug, position: 'bottom-[35%] left-[10%]', animation: 'persona-linear-3', size: 40 },
      { Icon: Cloud, position: 'bottom-[25%] right-[6%]', animation: 'persona-linear-4', size: 48 },
      { Icon: Lock, position: 'top-[55%] left-[3%]', animation: 'persona-linear-5', size: 38 },
    ],
    motionType: 'system',
  },
  'borrowers': {
    systemPreface: 'Guiding borrower journey in real time…',
    goal: 'A Faster, Clearer Borrowing Experience',
    context: 'Real-time guidance, instant validation, and fewer follow-ups.',
    intelligenceStatement: 'CredAble reduces friction by validating documents instantly and guiding applicants at the moment they need help — so applications complete faster and cleaner.',
    chips: ['Completion', 'Accuracy', 'Transparency'],
    icons: [
      { Icon: Upload, position: 'top-[20%] left-[10%]', animation: 'persona-settle-1', size: 44 },
      { Icon: MessageCircle, position: 'top-[35%] right-[8%]', animation: 'persona-settle-2', size: 40 },
      { Icon: CheckCircle, position: 'bottom-[35%] left-[6%]', animation: 'persona-settle-3', size: 42 },
      { Icon: Loader, position: 'bottom-[22%] right-[12%]', animation: 'persona-settle-4', size: 38 },
      { Icon: Clock, position: 'top-[60%] right-[4%]', animation: 'persona-settle-5', size: 36 },
    ],
    motionType: 'guidance',
  },
  'relationship-managers': {
    systemPreface: 'Activating relationship intelligence…',
    goal: 'Stronger Conversations. Better Credit Outcomes.',
    context: 'Instant visibility into risk, structures, and next actions.',
    intelligenceStatement: "CredAble surfaces the borrower's health signals, risks, and structure fit — enabling proactive engagement and better client discussions.",
    chips: ['Visibility', 'Proactive action', 'Structure fit'],
    icons: [
      { Icon: Flag, position: 'top-[18%] left-[5%]', animation: 'persona-horizontal-1', size: 42 },
      { Icon: Star, position: 'top-[28%] right-[8%]', animation: 'persona-horizontal-2', size: 38 },
      { Icon: User, position: 'bottom-[32%] left-[8%]', animation: 'persona-horizontal-3', size: 44 },
      { Icon: Activity, position: 'bottom-[20%] right-[6%]', animation: 'persona-horizontal-4', size: 40 },
      { Icon: Lightbulb, position: 'top-[55%] right-[3%]', animation: 'persona-horizontal-5', size: 36 },
    ],
    motionType: 'situational',
  },
};

const aiPipeline = ['Perception', 'Understanding', 'Reasoning', 'Judgment', 'Action'];

type PersonaHeroProps = {
  persona: PersonaType;
  /** When true, scroll prompt shows across all sections; otherwise only in hero */
  showScrollPromptInAllSections?: boolean;
};

export function PersonaHero({ persona, showScrollPromptInAllSections = false }: PersonaHeroProps) {
  const config = personaConfig[persona];
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger intelligence cue animation after mount
    const timer = setTimeout(() => setAnimationComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RevealSection className="py-20 px-6 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Ambient Icon Field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {config.icons.map(({ Icon, position, animation, size }, idx) => (
          <div
            key={idx}
            className={`absolute ${position} opacity-[0.10] ${animation}`}
            style={{ willChange: 'transform, opacity' }}
          >
            <Icon size={size} className="text-orange-400" strokeWidth={1} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/los-platform"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to LOS Platform
        </Link>

        {/* System Preface */}
        <p className="text-sm font-mono text-orange-400/80 mb-4 tracking-wide">
          {config.systemPreface}
        </p>

        {/* Goal Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {config.goal}
          </span>
        </h1>

        {/* Context Line */}
        <p className="text-xl text-slate-300 mb-6 leading-relaxed">
          {config.context}
        </p>

        {/* Intelligence Statement */}
        <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-3xl">
          {config.intelligenceStatement}
        </p>

        {/* AI Focus Chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {config.chips.map((chip, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-full text-sm font-medium bg-orange-500/10 border border-orange-500/20 text-orange-300"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Live Intelligence Cue */}
        <div className="border-t border-slate-700/50 pt-6">
          <p className="text-xs text-slate-500 mb-2">Powered by CredAble AI Brain</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {aiPipeline.map((step, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span
                  className={`text-slate-400 transition-all duration-500 ${
                    animationComplete ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {step}
                </span>
                {idx < aiPipeline.length - 1 && (
                  <span
                    className={`text-orange-500/60 transition-all duration-500 ${
                      animationComplete ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: `${idx * 150 + 75}ms` }}
                  >
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ScrollDownPrompt showInAllSections={showScrollPromptInAllSections} />

      {/* Hero-specific animation styles */}
      <style jsx>{`
        /* Analytical Intelligence - Credit Managers */
        .persona-drift-1 {
          animation: driftVertical1 8s ease-in-out infinite, scalePulse 6s ease-in-out infinite;
        }
        .persona-drift-2 {
          animation: driftVertical2 10s ease-in-out infinite, scalePulse 7s ease-in-out infinite 1s;
        }
        .persona-drift-3 {
          animation: driftVertical1 9s ease-in-out infinite reverse, glowLock 8s ease-in-out infinite;
        }
        .persona-drift-4 {
          animation: driftVertical2 7s ease-in-out infinite, scalePulse 8s ease-in-out infinite 2s;
        }
        .persona-drift-5 {
          animation: driftVertical1 11s ease-in-out infinite, glowLock 6s ease-in-out infinite 4s;
        }

        /* System Intelligence - Bank Transformation */
        .persona-linear-1 {
          animation: linearDrift 10s linear infinite;
        }
        .persona-linear-2 {
          animation: linearDrift 12s linear infinite reverse;
        }
        .persona-linear-3 {
          animation: linearDrift 8s linear infinite;
        }
        .persona-linear-4 {
          animation: linearDrift 11s linear infinite reverse;
        }
        .persona-linear-5 {
          animation: linearDrift 9s linear infinite;
        }

        /* Guidance Intelligence - Borrowers */
        .persona-settle-1 {
          animation: settleIn 6s ease-out forwards, fadeSettle 8s ease-in-out infinite 6s;
        }
        .persona-settle-2 {
          animation: settleIn 7s ease-out forwards 0.5s, fadeSettle 9s ease-in-out infinite 7s;
        }
        .persona-settle-3 {
          animation: settleIn 6.5s ease-out forwards 1s, fadeSettle 10s ease-in-out infinite 7.5s;
        }
        .persona-settle-4 {
          animation: settleIn 7.5s ease-out forwards 1.5s, fadeSettle 8s ease-in-out infinite 9s;
        }
        .persona-settle-5 {
          animation: settleIn 8s ease-out forwards 2s, fadeSettle 9s ease-in-out infinite 10s;
        }

        /* Situational Awareness - Relationship Managers */
        .persona-horizontal-1 {
          animation: horizontalDrift 9s ease-in-out infinite, alertGlow 7s ease-in-out infinite;
        }
        .persona-horizontal-2 {
          animation: horizontalDrift 11s ease-in-out infinite reverse;
        }
        .persona-horizontal-3 {
          animation: horizontalDrift 10s ease-in-out infinite;
        }
        .persona-horizontal-4 {
          animation: horizontalDrift 8s ease-in-out infinite reverse, alertGlow 8s ease-in-out infinite 3s;
        }
        .persona-horizontal-5 {
          animation: horizontalDrift 12s ease-in-out infinite;
        }

        /* Keyframes */
        @keyframes driftVertical1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes driftVertical2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-2deg); }
        }
        @keyframes scalePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes glowLock {
          0%, 85%, 100% { filter: drop-shadow(0 0 0 transparent); opacity: 0.10; }
          90% { filter: drop-shadow(0 0 8px rgba(251, 146, 60, 0.4)); opacity: 0.18; }
        }
        @keyframes linearDrift {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(8px) translateY(-5px); }
          50% { transform: translateX(0) translateY(-10px); }
          75% { transform: translateX(-8px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes settleIn {
          0% { transform: translateY(-20px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 0.10; }
        }
        @keyframes fadeSettle {
          0%, 100% { opacity: 0.10; }
          50% { opacity: 0.06; }
        }
        @keyframes horizontalDrift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        @keyframes alertGlow {
          0%, 80%, 100% { filter: drop-shadow(0 0 0 transparent); }
          85% { filter: drop-shadow(0 0 6px rgba(251, 146, 60, 0.35)); }
        }
      `}</style>
    </RevealSection>
  );
}
