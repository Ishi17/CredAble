'use client';

import Link from 'next/link';
import { useEffect, useRef, ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  Brain,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Zap,
  BarChart3,
  FileCheck,
  AlertTriangle,
  Target,
  Sparkles,
} from 'lucide-react';

// Reveal section wrapper with IntersectionObserver
export function RevealSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true;
          el.classList.add('los-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`los-section scroll-snap-align-start los-fullscreen ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        filter: 'blur(6px)',
        transition: 'opacity 600ms ease-out, transform 600ms ease-out, filter 600ms ease-out',
      }}
    >
      <div className="w-full">{children}</div>
    </section>
  );
}

// Hook to inject LOS styles
export function useLOSStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .los-revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
        filter: blur(0) !important;
      }
      .scroll-snap-align-start {
        scroll-snap-align: start;
      }
      .los-fullscreen {
        min-height: 100vh;
        display: flex;
        align-items: center;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

// Why CredAble Section
export function WhyCredAbleSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why CredAble</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Built by credit professionals, for credit professionals. Our platform understands the nuances of business
          lending.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: 'Faster Decisions', desc: 'Reduce loan processing time from weeks to hours with AI-driven automation.' },
            { icon: Shield, title: 'Lower Risk', desc: 'Advanced analytics identify hidden risks and improve portfolio quality.' },
            { icon: TrendingUp, title: 'Better Outcomes', desc: 'Data-driven insights lead to more accurate credit decisions and fewer defaults.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-orange-500/30 transition-all"
            >
              <item.icon className="text-orange-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// Bank Admin Section
export function BankAdminSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div id="how-it-works" className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Bank Admin: Configure Programs Instantly</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Empower your operations team to create and modify lending programs without IT dependency. Define eligibility
          criteria, set limits, configure workflows—all through an intuitive interface.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'Create new lending programs in minutes',
            'Set custom eligibility rules and criteria',
            'Configure approval workflows and limits',
            'Manage document requirements dynamically',
            'Real-time program performance monitoring',
            'Role-based access control',
          ].map((item, idx) => (
            <div key={idx} className="ai-trace-card flex items-start gap-3 bg-slate-800/30 rounded-xl p-4">
              <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// CredAble AI Assistant Section
export function CredAbleAIAssistantSection() {
  return (
    <RevealSection className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">CredAble AI Assistant</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Your intelligent co-pilot for credit analysis. Ask questions in natural language, get instant insights, and
          accelerate your workflow.
        </p>
        <div className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">What you can ask:</h3>
              <ul className="space-y-3 text-slate-300">
                <li>"What is the debt service coverage ratio for this borrower?"</li>
                <li>"Summarize the key risks in this application"</li>
                <li>"Compare this company to industry benchmarks"</li>
                <li>"Flag any inconsistencies in the financials"</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">How it helps:</h3>
              <ul className="space-y-3 text-slate-300">
                <li>Instant answers from application documents</li>
                <li>Automated ratio calculations</li>
                <li>Cross-reference multiple data sources</li>
                <li>Generate draft commentary and notes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// AI-Powered Business Rules Engine Section
export function AIBusinessRulesSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">AI-Powered Business Rules Engine</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Define complex credit policies using natural language. Our AI translates your requirements into executable
          rules that adapt and improve over time.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Natural Language Rules', desc: 'Write policies in plain English—no coding required.' },
            { title: 'Adaptive Learning', desc: 'Rules improve based on outcomes and exceptions.' },
            { title: 'Full Audit Trail', desc: 'Every decision is logged and explainable.' },
          ].map((item, idx) => (
            <div key={idx} className="ai-trace-card bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// Borrower Journey Section
export function BorrowerJourneySection() {
  return (
    <RevealSection className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Borrower Journey</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          A seamless digital experience for your borrowers—from application to disbursement.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          {[
            { step: '1', title: 'Apply', desc: 'Simple online application with smart forms' },
            { step: '2', title: 'Upload', desc: 'Drag-and-drop document submission' },
            { step: '3', title: 'Track', desc: 'Real-time status updates and notifications' },
            { step: '4', title: 'Approve', desc: 'Digital acceptance and e-signatures' },
            { step: '5', title: 'Disburse', desc: 'Automated fund transfer and documentation' },
          ].map((item, idx) => (
            <div key={idx} className="ai-trace-card flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// Real-Time Document Intelligence Section
export function DocumentIntelligenceSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Real-Time Document Intelligence</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Upload any document—our AI extracts, validates, and structures the data instantly.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="ai-trace-card bg-slate-800/30 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Supported Documents</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2"><FileCheck className="text-green-400" size={16} /> Financial statements & audited reports</li>
              <li className="flex items-center gap-2"><FileCheck className="text-green-400" size={16} /> Bank statements (any format)</li>
              <li className="flex items-center gap-2"><FileCheck className="text-green-400" size={16} /> Tax returns & GST filings</li>
              <li className="flex items-center gap-2"><FileCheck className="text-green-400" size={16} /> KYC documents & registrations</li>
              <li className="flex items-center gap-2"><FileCheck className="text-green-400" size={16} /> Contracts & agreements</li>
            </ul>
          </div>
          <div className="ai-trace-card bg-slate-800/30 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-orange-400">AI Capabilities</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> Auto-extraction of key data points</li>
              <li className="flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> Cross-document validation</li>
              <li className="flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> Fraud & anomaly detection</li>
              <li className="flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> Missing document alerts</li>
              <li className="flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> Automated data reconciliation</li>
            </ul>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// AI Questions Section
export function AIQuestionsSection() {
  return (
    <RevealSection className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">AI Questions</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Our AI proactively identifies gaps and raises intelligent questions to complete the credit picture.
        </p>
        <div className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="space-y-4">
            {[
              'Why did receivables increase 40% while revenue only grew 15%?',
              'The inventory turnover has declined for 3 consecutive years—what is the reason?',
              'There is a mismatch between GST filings and reported revenue. Please clarify.',
              'Related party transactions need additional documentation.',
            ].map((q, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-900/50 rounded-xl p-4">
                <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={18} />
                <span className="text-slate-300">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// Credit Manager Dashboard Section
export function CreditManagerDashboardSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Credit Manager Dashboard</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          A unified view of your entire pipeline—from applications in progress to portfolio performance.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Applications', value: 'Pipeline View', desc: 'Track every application status' },
            { label: 'Pending', value: 'Action Items', desc: 'Prioritized task queue' },
            { label: 'Approved', value: 'This Month', desc: 'Real-time approval metrics' },
            { label: 'Portfolio', value: 'Health Score', desc: 'Risk-weighted analysis' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center"
            >
              <p className="text-slate-400 text-sm mb-1">{item.label}</p>
              <p className="text-xl font-bold text-orange-400 mb-1">{item.value}</p>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// CAM in Seconds Section
export function CAMSection() {
  return (
    <RevealSection className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">CAM in Seconds</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Generate comprehensive Credit Assessment Memorandums automatically. What used to take hours now takes seconds.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Auto-Generated Sections</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Executive Summary</li>
              <li>• Business Overview & Industry Analysis</li>
              <li>• Financial Analysis & Ratios</li>
              <li>• Cash Flow Assessment</li>
              <li>• Collateral Evaluation</li>
              <li>• Risk Factors & Mitigants</li>
              <li>• Recommendation & Terms</li>
            </ul>
          </div>
          <div className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Benefits</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="text-green-400 mt-1" size={16} /> Consistent quality across all CAMs
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-400 mt-1" size={16} /> Regulatory-compliant format
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-400 mt-1" size={16} /> Easy customization and editing
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-400 mt-1" size={16} /> Version control and audit trail
              </li>
            </ul>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// Risk Intelligence Section
export function RiskIntelligenceSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Risk Intelligence</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Advanced risk scoring that goes beyond traditional models. Our AI identifies patterns humans might miss.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Predictive Scoring', desc: 'ML models trained on thousands of credit outcomes to predict default probability.' },
            { title: 'Early Warning Signals', desc: 'Continuous monitoring identifies deteriorating credits before they become problems.' },
            { title: 'Fraud Detection', desc: 'Pattern recognition identifies suspicious applications and document anomalies.' },
          ].map((item, idx) => (
            <div key={idx} className="ai-trace-card bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// AI Summary Generator + Decision Recommendations Section
export function AISummarySection() {
  return (
    <RevealSection className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">AI Summary Generator + Decision Recommendations</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Let AI do the heavy lifting. Get concise summaries and data-driven recommendations for every application.
        </p>
        <div className="ai-trace-card bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">AI Summary Includes:</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Key strengths and concerns</li>
                <li>• Financial health indicators</li>
                <li>• Comparison to similar borrowers</li>
                <li>• Industry and market context</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">Decision Support:</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Approve / Decline / Refer recommendation</li>
                <li>• Suggested terms and conditions</li>
                <li>• Covenant recommendations</li>
                <li>• Collateral requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// Portfolio Benchmarking Section
export function PortfolioBenchmarkingSection() {
  return (
    <RevealSection className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-orange-400" size={28} />
          <h2 className="text-3xl md:text-4xl font-bold">Portfolio Benchmarking</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          Compare your portfolio against industry benchmarks and peer institutions. Identify concentration risks and opportunities.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'Industry concentration analysis',
            'Geographic distribution mapping',
            'Vintage analysis and cohort tracking',
            'Peer comparison metrics',
            'Risk-adjusted return analysis',
            'Regulatory compliance scoring',
          ].map((item, idx) => (
            <div key={idx} className="ai-trace-card flex items-start gap-3 bg-slate-800/30 rounded-xl p-4">
              <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// Ready to Transform CTA Section
export function ReadyToTransformSection() {
  return (
    <RevealSection className="py-24 px-6 bg-gradient-to-b from-slate-900/30 to-[#0a0f1a]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Lending Operations?</h2>
        <p className="text-xl text-slate-400 mb-10">
          Join leading banks and financial institutions who are already using CredAble to make smarter, faster credit decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demo"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-5 rounded-full text-xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
          >
            Book a Demo
            <ArrowRight size={24} />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium px-10 py-5 rounded-full text-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </RevealSection>
  );
}
