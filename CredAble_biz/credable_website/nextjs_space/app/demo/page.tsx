"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Types for the new AI Decision Brief
type MonthData = {
  label: string;
  status: string;
  inflowTrend: number;
  gstDelayDays: number;
  concentration: number;
  volatility: number;
  sentiment: "supportive" | "cautionary" | "neutral";
};

type OptionData = {
  tag: string;
  title: string;
  limit: string;
  tenor: string;
  pricing: string;
  controls: string;
  reasoning: string;
};

type DecisionBriefData = {
  borrowerName: string;
  dataSources: string[];
  decision: "Approved" | "Conditional" | "Declined";
  riskPosture: "Low" | "Moderate" | "High";
  riskQualifier: string;
  primaryStrengths: string[];
  primaryRisks: string[];
  aiConfidence: "Low" | "Medium" | "High";
  confidenceNote: string;
};

type EvidenceSummary = {
  title: string;
  summaryPoints: string[];
  tableData: { label: string; value: string }[];
};

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const consoleElRef = useRef<HTMLDivElement>(null);
  const handshakeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultStripRef = useRef<HTMLDivElement>(null);
  const openResultsBtnRef = useRef<HTMLButtonElement>(null);

  const resultsModalRef = useRef<HTMLDivElement>(null);

  const [resDecision, setResDecision] = useState("");
  const [resScore, setResScore] = useState("");
  const [resConditions, setResConditions] = useState("");
  const [lastCompanyForModal, setLastCompanyForModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for AI Decision Brief
  const [decisionBrief, setDecisionBrief] = useState<DecisionBriefData | null>(null);
  const [timelineData, setTimelineData] = useState<MonthData[]>([]);
  const [optionsData, setOptionsData] = useState<OptionData[]>([]);
  const [evidenceSummaries, setEvidenceSummaries] = useState<EvidenceSummary[]>([]);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const [aiTakeaway, setAiTakeaway] = useState("");

  const [demoStep, setDemoStep] = useState(0); // 0=intro, 1=ready, 2=running
  const [demoInput, setDemoInput] = useState("");
  const demoCompany = "ACME Traders";

  const [showDemoMouse, setShowDemoMouse] = useState(false);
  const [demoTypingDone, setDemoTypingDone] = useState(false);

  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);

  const liveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTextRef = useRef("");

  const MESSAGES = [
    "Ingest unstructured financial data.",
    "Reason across cashflows, networks and policy.",
    "Generate lender-grade decisions in seconds.",
  ];
  const typeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDeletingRef = useRef(false);
  const charIndexRef = useRef(0);

  // Helpers
  function escapeHtml(s: string) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function log(text: string, cls = "") {
    if (!consoleElRef.current) return;
    const div = document.createElement("div");
    div.className = "console-line";
    div.innerHTML = `<span class="console-arrow">→</span> <span class="${cls}">${escapeHtml(
      text
    )}</span>`;
    consoleElRef.current.appendChild(div);
    //consoleElRef.current.scrollTop = consoleElRef.current.scrollHeight;
  }

  function resetToListening() {
    if (consoleElRef.current) consoleElRef.current.innerHTML = "";
    if (resultStripRef.current) resultStripRef.current.style.display = "none";
    if (openResultsBtnRef.current) openResultsBtnRef.current.style.display = "none";
    log("AI status: active", "good");
    log("Waiting for business input…");
  }

  function hash(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
  }

  function previewSignals(name: string) {
    const h = hash(name);
    const revenue = (h % 18) - 7;
    const concentration = 30 + (h % 55);
    const volatility = 8 + (h % 22);
    const dscr = (90 + (h % 45)) / 100;

    log(`Live signals — Revenue trend: ${revenue}%`, revenue < 0 ? "bad" : "good");
    log(
      `Live signals — Counterparty concentration: ${concentration}%`,
      concentration > 65 ? "bad" : "strong"
    );
    log(
      `Live signals — Cashflow volatility index: ${volatility}`,
      volatility > 22 ? "bad" : "strong"
    );
    log(`Live signals — DSCR estimate: ${dscr.toFixed(2)}`, dscr < 1.1 ? "bad" : "good");
  }

  function monthLabelsLast6() {
    const labels: string[] = [];
    const months = ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"];
    return months;
  }

  function buildTimeline(company: string): MonthData[] {
    const labels = monthLabelsLast6();
    const h = hash(company);

    return labels.map((lab, idx) => {
      const seed = (h + idx * 9973) % 100000;

      const inflowTrend = clamp((seed % 29) - 14, -18, 18);
      const gstDelayDays = seed % 3 === 0 ? seed % 11 : 0;
      const concentration = clamp(35 + (seed % 55), 30, 90);
      const volatility = clamp(10 + (seed % 25), 8, 35);

      let status = "good";
      let sentiment: "supportive" | "cautionary" | "neutral" = "supportive";
      
      if (
        gstDelayDays >= 7 ||
        concentration >= 70 ||
        volatility >= 26 ||
        inflowTrend <= -10
      ) {
        status = "bad";
        sentiment = "cautionary";
      } else if (
        gstDelayDays > 0 ||
        concentration >= 60 ||
        volatility >= 22 ||
        inflowTrend < 0
      ) {
        status = "warn";
        sentiment = "neutral";
      }

      return {
        label: lab,
        status,
        inflowTrend,
        gstDelayDays,
        concentration,
        volatility,
        sentiment,
      };
    });
  }

  function generateAiTakeaway(timeline: MonthData[]): string {
    const negativeMonths = timeline.filter(m => m.inflowTrend < 0);
    const positiveRecent = timeline.slice(-2).filter(m => m.inflowTrend > 0);
    
    if (negativeMonths.length >= 2 && positiveRecent.length > 0) {
      return "AI observed temporary inflow stress in Oct–Dec offset by recovery in January.";
    } else if (negativeMonths.length === 0) {
      return "AI observed consistent positive cashflow momentum across all observed months.";
    } else if (negativeMonths.length >= 3) {
      return "Signals indicate sustained cashflow pressure requiring enhanced monitoring.";
    }
    return "Risk is driven by mixed signals with moderate volatility in recent months.";
  }

  function generateDecisionBrief(company: string, mode: number): DecisionBriefData {
    if (mode === 0) {
      return {
        borrowerName: company,
        dataSources: ["Banking (6 months)", "GST Returns", "Bureau Score"],
        decision: "Approved",
        riskPosture: "Low",
        riskQualifier: "Stable operating metrics",
        primaryStrengths: [
          "Consistent inflows aligned with business scale",
          "Strong GST compliance track record"
        ],
        primaryRisks: [
          "Moderate buyer concentration (within threshold)"
        ],
        aiConfidence: "High",
        confidenceNote: "Consistent with 87% of comparable approved cases"
      };
    } else if (mode === 1) {
      return {
        borrowerName: company,
        dataSources: ["Banking (6 months)", "GST Returns", "Bureau Score"],
        decision: "Conditional",
        riskPosture: "Moderate",
        riskQualifier: "Concentration exposure identified",
        primaryStrengths: [
          "Established trading history with anchors",
          "EMI servicing discipline maintained"
        ],
        primaryRisks: [
          "Top 3 buyers represent 68% of receivables",
          "DSCR approaching policy floor"
        ],
        aiConfidence: "Medium",
        confidenceNote: "Consistent with 72% of conditionally approved cases"
      };
    } else {
      return {
        borrowerName: company,
        dataSources: ["Banking (6 months)", "GST Returns", "Bureau Score"],
        decision: "Declined",
        riskPosture: "High",
        riskQualifier: "Multiple policy breaches detected",
        primaryStrengths: [
          "Active business operations confirmed"
        ],
        primaryRisks: [
          "Related-party transfer patterns flagged",
          "Cashflow volatility exceeds policy threshold"
        ],
        aiConfidence: "High",
        confidenceNote: "Risk profile matches 91% of declined applications"
      };
    }
  }

  function generateOptions(mode: number): OptionData[] {
    if (mode === 0) {
      return [
        {
          tag: "Best Fit",
          title: "Working Capital OD",
          limit: "₹50L",
          tenor: "12 months",
          pricing: "MCLR + 2.25%",
          controls: "Standard covenants",
          reasoning: "Matches observed cashflow stability and historical approvals."
        },
        {
          tag: "Lower Risk",
          title: "OD + Escrow",
          limit: "₹60L",
          tenor: "12 months",
          pricing: "MCLR + 2.00%",
          controls: "Escrow on top 3 buyers",
          reasoning: "Escrow mitigates buyer concentration exposure."
        },
        {
          tag: "Faster Drawdowns",
          title: "Invoice Finance Line",
          limit: "₹40L",
          tenor: "90–120 days",
          pricing: "1.2% per 30 days",
          controls: "Invoice assignment + anchor validation",
          reasoning: "Optimized for short-cycle liquidity with higher monitoring."
        },
      ];
    } else if (mode === 1) {
      return [
        {
          tag: "Best Fit",
          title: "OD with Controls",
          limit: "₹45L",
          tenor: "12 months",
          pricing: "MCLR + 2.75%",
          controls: "Escrow + invoice assignment",
          reasoning: "Matches observed cashflow stability and historical approvals."
        },
        {
          tag: "Lower Risk",
          title: "Invoice Finance (Anchor-led)",
          limit: "₹55L",
          tenor: "90 days",
          pricing: "1.35% per 30 days",
          controls: "Anchor confirmation + concentration cap",
          reasoning: "Escrow mitigates buyer concentration exposure."
        },
        {
          tag: "Faster Drawdowns",
          title: "Term Loan Lite",
          limit: "₹30L",
          tenor: "24 months",
          pricing: "MCLR + 3.10%",
          controls: "DSCR covenant + quarterly review",
          reasoning: "Optimized for short-cycle liquidity with higher monitoring."
        },
      ];
    } else {
      return [
        {
          tag: "Best Fit",
          title: "Small OD + Hard Controls",
          limit: "₹15L",
          tenor: "6 months",
          pricing: "MCLR + 4.25%",
          controls: "100% escrow + weekly monitoring",
          reasoning: "Matches observed cashflow stability and historical approvals."
        },
        {
          tag: "Lower Risk",
          title: "Secured Against FD",
          limit: "₹25L",
          tenor: "12 months",
          pricing: "FD rate + 2.0%",
          controls: "Lien on FD + auto-sweep",
          reasoning: "Escrow mitigates buyer concentration exposure."
        },
        {
          tag: "Faster Drawdowns",
          title: "LC/BG Only",
          limit: "₹20L",
          tenor: "Per transaction",
          pricing: "As per schedule",
          controls: "Collateral + margin + approvals",
          reasoning: "Optimized for short-cycle liquidity with higher monitoring."
        },
      ];
    }
  }

  function generateEvidenceSummaries(mode: number): EvidenceSummary[] {
    const bankingSummary: EvidenceSummary = {
      title: "Banking Behaviour",
      summaryPoints: mode === 0
        ? [
            "Active circulation aligned with business scale",
            "EMI servicing disciplined",
            "Liquidity buffers adequate in all months",
            "No overdraft breaches detected"
          ]
        : mode === 1
        ? [
            "Active circulation aligned with business scale",
            "EMI servicing disciplined",
            "Liquidity buffers thin in stress months",
            "OD utilisation signals working capital strain"
          ]
        : [
            "Irregular inflow patterns detected",
            "EMI servicing shows occasional delays",
            "Liquidity buffers critically low",
            "Related-party transfers flagged"
          ],
      tableData: [
        { label: "Avg Monthly Inflow", value: mode === 0 ? "₹1.2Cr" : mode === 1 ? "₹85L" : "₹45L" },
        { label: "Avg Monthly Outflow", value: mode === 0 ? "₹1.05Cr" : mode === 1 ? "₹78L" : "₹52L" },
        { label: "EMI Bounce Rate", value: mode === 0 ? "0%" : mode === 1 ? "8%" : "23%" },
        { label: "OD Utilisation", value: mode === 0 ? "45%" : mode === 1 ? "72%" : "94%" },
        { label: "Min Balance Maintained", value: mode === 0 ? "Yes" : mode === 1 ? "Mostly" : "No" },
      ]
    };

    const gstSummary: EvidenceSummary = {
      title: "GST Compliance",
      summaryPoints: mode === 0
        ? [
            "All returns filed on time",
            "Input-output ratio within expected range",
            "No discrepancies with banking turnover"
          ]
        : mode === 1
        ? [
            "Minor filing delays in 2 months",
            "Input credit accumulation observed",
            "Turnover variance within 10% tolerance"
          ]
        : [
            "Filing delays in 4 of 6 months",
            "Significant input-output mismatch",
            "Turnover gap exceeds policy threshold"
          ],
      tableData: [
        { label: "GST Turnover (6M)", value: mode === 0 ? "₹6.8Cr" : mode === 1 ? "₹4.9Cr" : "₹2.1Cr" },
        { label: "Bank Turnover (6M)", value: mode === 0 ? "₹7.2Cr" : mode === 1 ? "₹5.1Cr" : "₹2.7Cr" },
        { label: "Variance", value: mode === 0 ? "5.5%" : mode === 1 ? "3.9%" : "22%" },
        { label: "On-time Filings", value: mode === 0 ? "6/6" : mode === 1 ? "4/6" : "2/6" },
      ]
    };

    const bureauSummary: EvidenceSummary = {
      title: "Bureau Profile",
      summaryPoints: mode === 0
        ? [
            "No delinquencies in last 24 months",
            "Credit utilisation healthy",
            "No adverse remarks"
          ]
        : mode === 1
        ? [
            "One 30-day past due in last 12 months",
            "Credit utilisation elevated",
            "Director DPD history clear"
          ]
        : [
            "Multiple 60+ DPD instances",
            "Credit utilisation at limit",
            "Director guarantees under stress"
          ],
      tableData: [
        { label: "CIBIL Score", value: mode === 0 ? "782" : mode === 1 ? "698" : "612" },
        { label: "Active Loans", value: mode === 0 ? "2" : mode === 1 ? "4" : "6" },
        { label: "Max DPD (12M)", value: mode === 0 ? "0" : mode === 1 ? "30" : "90" },
        { label: "Total Exposure", value: mode === 0 ? "₹1.2Cr" : mode === 1 ? "₹2.8Cr" : "₹4.5Cr" },
      ]
    };

    const financialsSummary: EvidenceSummary = {
      title: "Financial Statements",
      summaryPoints: mode === 0
        ? [
            "Revenue growth 12% YoY",
            "EBITDA margin healthy at 14%",
            "Net worth adequate for exposure"
          ]
        : mode === 1
        ? [
            "Revenue flat YoY",
            "EBITDA margin compressed to 8%",
            "Working capital cycle elongated"
          ]
        : [
            "Revenue decline 18% YoY",
            "EBITDA margin negative",
            "Net worth erosion detected"
          ],
      tableData: [
        { label: "Revenue (FY)", value: mode === 0 ? "₹28Cr" : mode === 1 ? "₹16Cr" : "₹8Cr" },
        { label: "EBITDA Margin", value: mode === 0 ? "14%" : mode === 1 ? "8%" : "-2%" },
        { label: "DSCR", value: mode === 0 ? "1.8x" : mode === 1 ? "1.15x" : "0.7x" },
        { label: "Current Ratio", value: mode === 0 ? "1.6" : mode === 1 ? "1.1" : "0.8" },
      ]
    };

    return [bankingSummary, gstSummary, bureauSummary, financialsSummary];
  }

  function openModal() {
    if (!resultsModalRef.current) return;
    setExpandedEvidence({});
    resultsModalRef.current.classList.add("open");
    resultsModalRef.current.setAttribute("aria-hidden", "false");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (!resultsModalRef.current) return;
    resultsModalRef.current.classList.remove("open");
    resultsModalRef.current.setAttribute("aria-hidden", "true");
    setIsModalOpen(false);
  }

  function toggleEvidence(title: string) {
    setExpandedEvidence(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  }

  function runAI(name?: string) {
    const company = (name || "Sample Manufacturing Pvt Ltd").trim();

    if (consoleElRef.current) consoleElRef.current.innerHTML = "";
    if (handshakeRef.current) {
      handshakeRef.current.style.display = "none";
      handshakeRef.current.style.pointerEvents = "none";
    }
    if (openResultsBtnRef.current) openResultsBtnRef.current.style.display = "none";
    if (resultStripRef.current) resultStripRef.current.style.display = "none";

    log(`Starting analysis: ${company}`, "strong");
    log("Loading policy pack: SME + Supply Chain");
    log("Building financial reasoning graph…");

    setTimeout(() => log("Parsing bank statement…"), 450);
    setTimeout(() => log("Reconciling GST filings…"), 900);
    setTimeout(() => log("Mapping director network…", "strong"), 1350);

    setTimeout(() => {
      const h = hash(company);
      const mode = h % 3;

      // Generate timeline data
      const timeline = buildTimeline(company);
      setTimelineData(timeline);
      setAiTakeaway(generateAiTakeaway(timeline));

      // Generate decision brief
      const brief = generateDecisionBrief(company, mode);
      setDecisionBrief(brief);

      // Generate options
      const options = generateOptions(mode);
      setOptionsData(options);

      // Generate evidence summaries
      const evidence = generateEvidenceSummaries(mode);
      setEvidenceSummaries(evidence);

      if (mode === 0) {
        setResDecision("APPROVE");
        setResScore("742 (Low)");
        setResConditions("Standard covenants");
        log("Decision: APPROVE", "good");
      }

      if (mode === 1) {
        setResDecision("CONDITIONAL APPROVAL");
        setResScore("712 (Moderate-Low)");
        setResConditions("Escrow + Invoice Assignment");
        log("Decision: CONDITIONAL APPROVAL", "strong");
        log("Conditions: Escrow + invoice assignment", "strong");
      }

      if (mode === 2) {
        setResDecision("DECLINE");
        setResScore("608 (Elevated)");
        setResConditions("Related-party + volatility flags");
        log("Decision: DECLINE", "bad");
        log("Reason: Related-party risk + cashflow volatility", "bad");
      }

      log("Generating AI recommended sanction structures…", "strong");

      setTimeout(() => {
        if (resultStripRef.current) resultStripRef.current.style.display = "flex";
        if (openResultsBtnRef.current) openResultsBtnRef.current.style.display = "block";

        setLastCompanyForModal(company);
        log("Results ready. Open Full Results for complete output.", "good");
      }, 650);
    }, 1900);
  }

  // Live typing (kept as-is; not used in guided demo)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    if (v === lastTextRef.current) return;
    lastTextRef.current = v;

    if (liveTimerRef.current) clearTimeout(liveTimerRef.current);

    liveTimerRef.current = setTimeout(() => {
      resetToListening();
      if (v.length >= 3) {
        log(`Interpreting: "${v}"`, "strong");
        previewSignals(v);
        log("Press Enter to run full decision.", "strong");
      } else {
        log("Type 3+ characters to surface live signals…");
      }
    }, 250);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputRef.current) runAI(inputRef.current.value);
    }
  };

  // AI Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number, DPR: number;

    function resize() {
      if (!canvas || !ctx) return;
      DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      W = canvas.width = Math.floor(window.innerWidth * DPR);
      H = canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", resize);
    resize();

    const N = 70;
    const nodes = Array.from({ length: N }).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35 * DPR,
      vy: (Math.random() - 0.5) * 0.35 * DPR,
      r: (Math.random() * 1.6 + 0.6) * DPR,
    }));

    let animationId: number;

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        if (!a) continue;
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        for (let j = i + 1; j < N; j++) {
          const b = nodes[j];
          if (!b) continue;
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max = 160 * DPR * (160 * DPR);

          if (d2 < max) {
            const t = 1 - d2 / max;
            ctx.globalAlpha = 0.2 * t;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineWidth = 1 * DPR;
            ctx.strokeStyle = "rgba(40,60,90,1)";
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 0.55;
      for (const n of nodes) {
        if (!n) continue;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(20,30,50,1)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Modal event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Initialize
  useEffect(() => {
    resetToListening();
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 250);
  }, []);

  // Guided demo typing + mouse click (Step 1)
  useEffect(() => {
    if (demoStep !== 1) return;

    setDemoInput("");
    setDemoTypingDone(false);
    setShowDemoMouse(false);

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < demoCompany.length) {
        setDemoInput(demoCompany.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setDemoTypingDone(true);

        setTimeout(() => {
          setShowDemoMouse(true);

          setTimeout(() => {
            setShowDemoMouse(false);
            setDemoStep(2);
            runAI(demoCompany);
          }, 900);
        }, 350);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [demoStep]);

  // Typewriter effect
  useEffect(() => {
    const currentMessage = MESSAGES[typewriterIndex];

    const typeDelay = 60;
    const deleteDelay = 30;
    const pauseAfterType = 600;
    const pauseAfterDelete = 120;

    const tick = () => {
      const isDeleting = isDeletingRef.current;
      const charIndex = charIndexRef.current;

      const nextIndex = isDeleting ? charIndex - 1 : charIndex + 1;
      charIndexRef.current = nextIndex;

      setTypewriterText(currentMessage.slice(0, nextIndex));

      if (!isDeleting && nextIndex >= currentMessage.length) {
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        typeTimeoutRef.current = setTimeout(() => {
          isDeletingRef.current = true;
          tick();
        }, pauseAfterType);
        return;
      }

      if (isDeleting && nextIndex <= 0) {
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        typeTimeoutRef.current = setTimeout(() => {
          isDeletingRef.current = false;
          charIndexRef.current = 0;
          setTypewriterIndex((prev) => (prev + 1) % MESSAGES.length);
        }, pauseAfterDelete);
        return;
      }

      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
      typeTimeoutRef.current = setTimeout(tick, isDeleting ? deleteDelay : typeDelay);
    };

    tick();

    return () => {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    };
  }, [typewriterIndex]);

  return (
    <>
      <canvas ref={canvasRef} id="aiBg"></canvas>

      <main className="pt-[104px]">
        <section className="hero">
          {/* TOP: HERO TEXT */}
          <div className="hero-text">
            <div className="eyebrow">AI-Native Working Capital</div>
            <h1>CredAble is an AI Operating System for Business Credit.</h1>
            <p className="typewriter-container">
              {typewriterText}
              <span className="typewriter-cursor">|</span>
            </p>
          </div>

          {/* CENTER: AI CONSOLE */}
          <div className="console-card">
            <div className="console-header">
              <div className="console-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="console-title">credable://ai-credit-engine</span>
            </div>

            {/* GUIDED DEMO INTERFACE */}
            <div className="ai-handshake" id="handshake" ref={handshakeRef}>
              <div className="ai-handshake-inner ai-palette">
                {demoStep === 0 && (
                  <div className="demo-intro">
                    <div className="ai-palette-top">
                      <div className="ai-badge">LIVE DEMO</div>
                      <div className="ai-palette-title">Try CredAble's AI Credit Engine</div>
                    </div>

                    {/* Better spacing for the intro copy */}
                    <div className="demo-instructions demo-instructions-spaced">
                      <p className="demo-lead demo-lead-spaced">
                        Experience instant credit analysis powered by AI.
                        <span className="demo-lead-break" />
                        We'll guide you through analyzing a sample company.
                      </p>

                      <button
                        className="btn btn-primary btn-large"
                        type="button"
                        onClick={() => setDemoStep(1)}
                      >
                        Start Demo →
                      </button>

                      <div className="demo-features demo-features-spaced">
                        <span className="proof-pill">No signup required</span>
                        <span className="proof-pill">Takes 30 seconds</span>
                        <span className="proof-pill">Full AI analysis</span>
                      </div>
                    </div>
                  </div>
                )}

                {demoStep === 1 && (
                  <div className="demo-ready">
                    <div className="ai-palette-top">
                      <div className="ai-badge">PREPARING</div>
                      <div className="ai-palette-title">Entering company details...</div>
                    </div>

                    <div className="demo-company-display">
                      <div className="demo-company-card">
                        <div className="company-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        <div className="company-details">
                          <div className="company-name">{demoCompany}</div>
                          <div className="company-meta">Automotive • Manufacturing • India</div>
                        </div>
                      </div>

                      <div className="demo-action-box">
                        <div className="demo-input-wrapper demo-input-wrapper-relative">
                          <input
                            type="text"
                            className="demo-input-field"
                            value={demoInput}
                            readOnly
                            style={{ caretColor: "var(--koi-orange)" }}
                          />

                          {/* Start Analysis button uses SAME orange styling as Start Demo */}
                          <button
                            className="btn btn-primary btn-large"
                            type="button"
                            disabled={!demoTypingDone}
                            onClick={() => {
                              setShowDemoMouse(false);
                              setDemoStep(2);
                              runAI(demoCompany);
                            }}
                          >
                            ▶ Start Analysis
                          </button>

                          {/* Animated mouse that "clicks" Start Analysis */}
                          {showDemoMouse && (
                            <div className="demo-mouse demo-mouse-click" aria-hidden="true">
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/cursor.png"
                                alt=""
                                className="demo-mouse-icon"
                                draggable={false}
                              />
                              <div className="demo-mouse-ripple" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="demo-running">
                    <div className="ai-palette-top">
                      <div className="ai-badge">ANALYZING</div>
                      <div className="ai-palette-title">AI engine running...</div>
                    </div>
                    <div className="demo-progress">
                      <p>Watch the real-time analysis below ↓</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI CONSOLE OUTPUT */}
            <div className="console-body" id="console" ref={consoleElRef}></div>

            {/* Button shows AFTER analysis */}
            <button
              className="btn btn-ghost full-results-btn"
              id="openResults"
              ref={openResultsBtnRef}
              type="button"
              style={{ display: "none" }}
              onClick={openModal}
            >
              View Full Results
            </button>

            {/* Decision strip always in console */}
            <div className="ai-result" id="resultStrip" ref={resultStripRef} style={{ display: "none" }}>
              <div className="result-item">
                <div className="result-label">Decision</div>
                <div className="result-value" id="resDecision">
                  {resDecision}
                </div>
              </div>
              <div className="result-item">
                <div className="result-label">Risk Score</div>
                <div className="result-value" id="resScore">
                  {resScore}
                </div>
              </div>
              <div className="result-item">
                <div className="result-label">Conditions</div>
                <div className="result-value" id="resConditions">
                  {resConditions}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAM CoPilot Section */}
        <section className="cam-copilot-section">
          <h2 className="cam-copilot-header">Try Out Our CAM CoPilot</h2>
          <div className="cam-copilot-container">
            <iframe
              src="https://credablecamcopilot.lovable.app/auth"
              className="cam-copilot-iframe"
              title="CredAble CAM CoPilot"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </section>
      </main>

      {/* AI DECISION BRIEF MODAL - 5 Layer Structure */}
      <div
        className="modal-backdrop ai-brief-modal"
        id="resultsModal"
        ref={resultsModalRef}
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === resultsModalRef.current) closeModal();
        }}
      >
        <div className="modal ai-brief-container" role="dialog" aria-modal="true" aria-label="AI Decision Brief">
          {/* Sticky Header */}
          <div className="modal-header ai-brief-header">
            <div className="modal-title">
              AI Decision Brief {lastCompanyForModal && <span className="modal-sub">— {lastCompanyForModal}</span>}
            </div>
            <button className="modal-close" type="button" onClick={closeModal}>✕</button>
          </div>

          {/* Snap-Scroll Container */}
          <div className="ai-brief-scroll-container">
            
            {/* SECTION 1: AI Decision Brief */}
            <section className="ai-brief-section ai-brief-section-1">
              <div className="ai-brief-card ai-brief-verdict">
                <div className="ai-brief-section-label">AI Credit Decision Brief</div>
                
                {decisionBrief && (
                  <>
                    <div className="ai-brief-meta">
                      <div className="ai-brief-borrower">{decisionBrief.borrowerName}</div>
                      <div className="ai-brief-sources">
                        Data sources: {decisionBrief.dataSources.join(" • ")}
                      </div>
                    </div>

                    <div className="ai-brief-decision-row">
                      <div className={`ai-brief-decision-badge ${decisionBrief.decision.toLowerCase()}`}>
                        {decisionBrief.decision}
                      </div>
                      <div className={`ai-brief-risk-badge ${decisionBrief.riskPosture.toLowerCase()}`}>
                        {decisionBrief.riskPosture} Risk
                        <span className="ai-brief-risk-qualifier">({decisionBrief.riskQualifier})</span>
                      </div>
                    </div>

                    <div className="ai-brief-signals-grid">
                      <div className="ai-brief-signal-box strengths">
                        <div className="ai-brief-signal-label">Primary Strengths</div>
                        <ul className="ai-brief-signal-list">
                          {decisionBrief.primaryStrengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="ai-brief-signal-box risks">
                        <div className="ai-brief-signal-label">Primary Risks</div>
                        <ul className="ai-brief-signal-list">
                          {decisionBrief.primaryRisks.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="ai-brief-confidence">
                      <span className={`ai-brief-confidence-badge ${decisionBrief.aiConfidence.toLowerCase()}`}>
                        AI Confidence: {decisionBrief.aiConfidence}
                      </span>
                      <span className="ai-brief-confidence-note">{decisionBrief.confidenceNote}</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* SECTION 2: Decision Signals (Behaviour Over Time) */}
            <section className="ai-brief-section ai-brief-section-2">
              <div className="ai-brief-card">
                <div className="ai-brief-section-label">Decision Signals — Behaviour Over Time</div>
                <div className="ai-brief-section-sublabel">Past 6 months signals informing today's decision. Observations only.</div>
                
                <div className="ai-brief-timeline-row">
                  {timelineData.map((month, idx) => (
                    <div key={idx} className={`ai-brief-timeline-card ${month.status}`}>
                      <div className="ai-brief-timeline-month">{month.label}</div>
                      <div className="ai-brief-timeline-metrics">
                        <div className="ai-brief-metric">
                          <span className="ai-brief-metric-label">Net inflow</span>
                          <span className={`ai-brief-metric-value ${month.inflowTrend >= 0 ? 'positive' : 'negative'}`}>
                            {month.inflowTrend >= 0 ? '+' : ''}{month.inflowTrend}%
                          </span>
                        </div>
                        <div className="ai-brief-metric">
                          <span className="ai-brief-metric-label">GST</span>
                          <span className={`ai-brief-metric-value ${month.gstDelayDays === 0 ? 'positive' : 'negative'}`}>
                            {month.gstDelayDays === 0 ? 'On-time' : `${month.gstDelayDays}d late`}
                          </span>
                        </div>
                        <div className="ai-brief-metric">
                          <span className="ai-brief-metric-label">Concentration</span>
                          <span className={`ai-brief-metric-value ${month.concentration < 60 ? 'positive' : month.concentration < 70 ? 'neutral' : 'negative'}`}>
                            {month.concentration}%
                          </span>
                        </div>
                        <div className="ai-brief-metric">
                          <span className="ai-brief-metric-label">Volatility</span>
                          <span className={`ai-brief-metric-value ${month.volatility < 22 ? 'positive' : month.volatility < 26 ? 'neutral' : 'negative'}`}>
                            {month.volatility}
                          </span>
                        </div>
                      </div>
                      <div className={`ai-brief-timeline-sentiment ${month.sentiment}`}>
                        {month.sentiment === 'supportive' ? '✓' : month.sentiment === 'cautionary' ? '⚠' : '–'} {month.sentiment}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ai-brief-takeaway">
                  <span className="ai-brief-takeaway-icon">💡</span>
                  <span className="ai-brief-takeaway-text">{aiTakeaway}</span>
                </div>
              </div>
            </section>

            {/* SECTION 3: AI-Recommended Structures */}
            <section className="ai-brief-section ai-brief-section-3">
              <div className="ai-brief-card">
                <div className="ai-brief-section-label">AI-Recommended Structures</div>
                <div className="ai-brief-section-sublabel">Three sanction structures ranked by risk-adjusted fit.</div>
                
                <div className="ai-brief-options-grid">
                  {optionsData.map((option, idx) => (
                    <div key={idx} className="ai-brief-option-card">
                      <div className="ai-brief-option-header">
                        <span className="ai-brief-option-number">Option {idx + 1}</span>
                        <span className={`ai-brief-option-tag ${option.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                          {option.tag}
                        </span>
                      </div>
                      <div className="ai-brief-option-title">{option.title}</div>
                      <div className="ai-brief-option-details">
                        <div><strong>Limit:</strong> {option.limit}</div>
                        <div><strong>Tenor:</strong> {option.tenor}</div>
                        <div><strong>Pricing:</strong> {option.pricing}</div>
                        <div><strong>Controls:</strong> {option.controls}</div>
                      </div>
                      <div className="ai-brief-option-reasoning">
                        <em>{option.reasoning}</em>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ai-brief-options-note">
                  All recommendations are explainable and policy-linked.
                </div>
              </div>
            </section>

            {/* SECTION 4: Evidence Summaries (Expandable) */}
            <section className="ai-brief-section ai-brief-section-4">
              <div className="ai-brief-card">
                <div className="ai-brief-section-label">Evidence Summaries</div>
                <div className="ai-brief-section-sublabel">AI-synthesized insights. Expand to view underlying data.</div>
                
                <div className="ai-brief-evidence-list">
                  {evidenceSummaries.map((evidence, idx) => (
                    <div key={idx} className="ai-brief-evidence-item">
                      <div className="ai-brief-evidence-header">
                        <div className="ai-brief-evidence-title">{evidence.title} — AI Summary</div>
                      </div>
                      <ul className="ai-brief-evidence-summary">
                        {evidence.summaryPoints.map((point, pidx) => (
                          <li key={pidx}>{point}</li>
                        ))}
                      </ul>
                      <button 
                        className="ai-brief-evidence-toggle"
                        onClick={() => toggleEvidence(evidence.title)}
                      >
                        👉 {expandedEvidence[evidence.title] ? 'Hide underlying evidence' : 'View underlying evidence'}
                      </button>
                      
                      {expandedEvidence[evidence.title] && (
                        <div className="ai-brief-evidence-table">
                          <table>
                            <tbody>
                              {evidence.tableData.map((row, ridx) => (
                                <tr key={ridx}>
                                  <td className="ai-brief-table-label">{row.label}</td>
                                  <td className="ai-brief-table-value">{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: Full CAM & Audit View */}
            <section className="ai-brief-section ai-brief-section-5">
              <div className="ai-brief-card ai-brief-cam-section">
                <div className="ai-brief-section-label">Regulatory & Audit View (CAM)</div>
                <div className="ai-brief-cam-helper">CAM auto-generated by CredAble AI and available for audit.</div>
                
                <div className="ai-brief-cam-content">
                  <div className="ai-brief-cam-narrative">
                    <h4>Credit Assessment Memorandum</h4>
                    <div className="ai-brief-cam-summary">
                      <p><strong>Borrower:</strong> {lastCompanyForModal || 'N/A'}</p>
                      <p><strong>Assessment Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                      <p><strong>Decision:</strong> {resDecision}</p>
                      <p><strong>Risk Score:</strong> {resScore}</p>
                      <p><strong>Conditions:</strong> {resConditions}</p>
                    </div>
                    
                    <h5>Executive Summary</h5>
                    <p className="ai-brief-cam-text">
                      Based on comprehensive analysis of banking data (6 months), GST returns, and bureau profile, the AI system has assessed the creditworthiness of {lastCompanyForModal || 'the borrower'}. The decision of <strong>{resDecision}</strong> is consistent with policy thresholds and historical approval patterns for similar risk profiles.
                    </p>

                    <h5>Data Sources Analyzed</h5>
                    <ul className="ai-brief-cam-sources">
                      <li>Bank Statement Analysis (6 months rolling)</li>
                      <li>GST Returns & Compliance History</li>
                      <li>Bureau Score & Credit History</li>
                      <li>Financial Statements (Latest Available)</li>
                      <li>Director/Promoter Network Analysis</li>
                    </ul>

                    <h5>Risk Assessment</h5>
                    <div className="ai-brief-cam-table-wrapper">
                      <table className="ai-brief-cam-table">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Observed</th>
                            <th>Policy Threshold</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Cashflow Stability</td>
                            <td>{decisionBrief?.riskPosture === 'Low' ? 'Stable' : decisionBrief?.riskPosture === 'Moderate' ? 'Variable' : 'Unstable'}</td>
                            <td>Stable/Variable</td>
                            <td className={decisionBrief?.riskPosture === 'High' ? 'status-fail' : 'status-pass'}>
                              {decisionBrief?.riskPosture === 'High' ? 'Breach' : 'Pass'}
                            </td>
                          </tr>
                          <tr>
                            <td>GST Compliance</td>
                            <td>{decisionBrief?.decision === 'Approved' ? '100%' : decisionBrief?.decision === 'Conditional' ? '67%' : '33%'}</td>
                            <td>≥80%</td>
                            <td className={decisionBrief?.decision === 'Declined' ? 'status-fail' : 'status-pass'}>
                              {decisionBrief?.decision === 'Declined' ? 'Breach' : 'Pass'}
                            </td>
                          </tr>
                          <tr>
                            <td>Bureau Score</td>
                            <td>{decisionBrief?.decision === 'Approved' ? '782' : decisionBrief?.decision === 'Conditional' ? '698' : '612'}</td>
                            <td>≥650</td>
                            <td className={decisionBrief?.decision === 'Declined' ? 'status-fail' : 'status-pass'}>
                              {decisionBrief?.decision === 'Declined' ? 'Review' : 'Pass'}
                            </td>
                          </tr>
                          <tr>
                            <td>Concentration Risk</td>
                            <td>{decisionBrief?.decision === 'Approved' ? '45%' : decisionBrief?.decision === 'Conditional' ? '68%' : '82%'}</td>
                            <td>≤70%</td>
                            <td className={decisionBrief?.decision === 'Declined' ? 'status-fail' : 'status-pass'}>
                              {decisionBrief?.decision === 'Declined' ? 'Breach' : 'Pass'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="ai-brief-cam-actions">
                    <button 
                      className="ai-brief-cam-download"
                      onClick={() => {
                        alert(`CAM Report for ${lastCompanyForModal || 'Borrower'}\n\nIn production, this would generate a comprehensive PDF including:\n• Full decision narrative\n• All underlying data tables\n• Risk matrices\n• Compliance checklist\n\nDocument ready for regulatory audit.`);
                      }}
                    >
                      📄 Download Full CAM (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
