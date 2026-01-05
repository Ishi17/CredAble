"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const consoleElRef = useRef<HTMLDivElement>(null);
  const handshakeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultStripRef = useRef<HTMLDivElement>(null);
  const openResultsBtnRef = useRef<HTMLButtonElement>(null);

  const aiTimelineRef = useRef<HTMLDivElement>(null);
  const aiTimelineRowRef = useRef<HTMLDivElement>(null);
  const aiTLTitleRef = useRef<HTMLDivElement>(null);
  const aiTLBodyRef = useRef<HTMLDivElement>(null);

  const aiOptionsElRef = useRef<HTMLDivElement>(null);
  const aiOptionsGridRef = useRef<HTMLDivElement>(null);

  const resultsModalRef = useRef<HTMLDivElement>(null);
  const explainListRef = useRef<HTMLDivElement>(null);
  const modalTimelineMountRef = useRef<HTMLDivElement>(null);
  const modalOptionsMountRef = useRef<HTMLDivElement>(null);

  const [resDecision, setResDecision] = useState("");
  const [resScore, setResScore] = useState("");
  const [resConditions, setResConditions] = useState("");
  const [lastCompanyForModal, setLastCompanyForModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0); // 0=intro, 1=ready, 2=running
  const [demoInput, setDemoInput] = useState("");
  const demoCompany = "Tata Motors";
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

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


  // Smooth scroll to console section
  const scrollToConsole = () => {
    const consoleCard = document.querySelector(".console-card");
    if (consoleCard) {
      consoleCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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
    div.innerHTML = `<span class="console-arrow">→</span> <span class="${cls}">${escapeHtml(text)}</span>`;
    consoleElRef.current.appendChild(div);
    consoleElRef.current.scrollTop = consoleElRef.current.scrollHeight;
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

    log(
      `Live signals — Revenue trend: ${revenue}%`,
      revenue < 0 ? "bad" : "good"
    );
    log(
      `Live signals — Counterparty concentration: ${concentration}%`,
      concentration > 65 ? "bad" : "strong"
    );
    log(
      `Live signals — Cashflow volatility index: ${volatility}`,
      volatility > 22 ? "bad" : "strong"
    );
    log(
      `Live signals — DSCR estimate: ${dscr.toFixed(2)}`,
      dscr < 1.1 ? "bad" : "good"
    );
  }

  function monthLabelsLast6() {
    const labels: string[] = [];
    const d = new Date();
    d.setDate(1);
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      labels.push(
        m.toLocaleString(undefined, { month: "short" }).toUpperCase()
      );
    }
    return labels;
  }

  function buildTimeline(company: string) {
    const labels = monthLabelsLast6();
    const h = hash(company);

    return labels.map((lab, idx) => {
      const seed = (h + idx * 9973) % 100000;

      const inflowTrend = clamp((seed % 29) - 14, -18, 18);
      const gstDelayDays = seed % 3 === 0 ? seed % 11 : 0;
      const concentration = clamp(35 + (seed % 55), 30, 90);
      const volatility = clamp(10 + (seed % 25), 8, 35);

      let status = "good";
      if (
        gstDelayDays >= 7 ||
        concentration >= 70 ||
        volatility >= 26 ||
        inflowTrend <= -10
      )
        status = "bad";
      else if (
        gstDelayDays > 0 ||
        concentration >= 60 ||
        volatility >= 22 ||
        inflowTrend < 0
      )
        status = "warn";

      return {
        label: lab,
        status,
        inflowTrend,
        gstDelayDays,
        concentration,
        volatility,
      };
    });
  }

  function renderTimeline(company: string) {
    if (!aiTimelineRowRef.current || !aiTLTitleRef.current || !aiTLBodyRef.current)
      return;

    const months = buildTimeline(company);
    aiTimelineRowRef.current.innerHTML = "";

    const makeCard = (m: any) => {
      const wrap = document.createElement("div");
      wrap.className = `tl-node ${m.status}`;
      wrap.innerHTML = `
        <div class="tl-point"></div>
        <div class="tl-card">
          <div class="tl-month">${m.label}</div>
          <div class="tl-lines">
            <div>Cash inflow trend: <strong>${m.inflowTrend}%</strong></div>
            <div>GST compliance: <strong>${
              m.gstDelayDays === 0 ? "On-time" : `${m.gstDelayDays} day delay`
            }</strong></div>
            <div>Concentration: <strong>${m.concentration}%</strong></div>
            <div>Volatility index: <strong>${m.volatility}</strong></div>
          </div>
        </div>
      `;
      return wrap;
    };

    // Always render all months in horizontal scrollable layout
    months.forEach((m) => aiTimelineRowRef.current?.appendChild(makeCard(m)));
    aiTLTitleRef.current.textContent = "Behaviour over time";
    aiTLBodyRef.current.innerHTML = "Behaviour-over-time informing today's decision.";

    if (aiTimelineRef.current) aiTimelineRef.current.style.display = "block";
  }

  type OptionData = {
    tag: string;
    title: string;
    limit: string;
    tenor: string;
    pricing: string;
    controls: string;
  };

  function renderOptions(options: OptionData[]) {
    if (!aiOptionsGridRef.current || !aiOptionsElRef.current) return;

    aiOptionsGridRef.current.innerHTML = "";
    options.forEach((o, idx) => {
      const card = document.createElement("div");
      card.className = "ai-option";
      card.innerHTML = `
        <div class="ai-option-rank">
          <span>Option ${idx + 1}</span>
          <span class="ai-pill">${escapeHtml(o.tag)}</span>
        </div>
        <div class="ai-option-name">${escapeHtml(o.title)}</div>
        <div class="ai-option-lines">
          <div><strong>Limit:</strong> ${escapeHtml(o.limit)}</div>
          <div><strong>Tenor:</strong> ${escapeHtml(o.tenor)}</div>
          <div><strong>Pricing:</strong> ${escapeHtml(o.pricing)}</div>
          <div><strong>Controls:</strong> ${escapeHtml(o.controls)}</div>
        </div>
      `;
      aiOptionsGridRef.current?.appendChild(card);
    });
    aiOptionsElRef.current.style.display = "block";
  }

  function renderExplainability(mode: number) {
    if (!explainListRef.current) return;

    const items =
      mode === 0
        ? [
            { t: "Stable inflows over 6 months", s: "+9%" },
            { t: "Concentration within policy threshold", s: "+6%" },
            { t: "Low volatility & consistent GST compliance", s: "+5%" },
            { t: "No round-tripping detected", s: "+3%" },
          ]
        : mode === 1
        ? [
            { t: "Moderate concentration in top buyers", s: "−9%" },
            { t: "DSCR close to policy floor", s: "−7%" },
            { t: "GST timing variance detected", s: "−4%" },
            { t: "Mitigated by escrow + invoice assignment", s: "+6%" },
          ]
        : [
            { t: "High volatility in cashflows", s: "−12%" },
            { t: "Related-party transfer patterns", s: "−10%" },
            { t: "Concentration above policy threshold", s: "−8%" },
            { t: "Insufficient explainable buffers", s: "−6%" },
          ];

    explainListRef.current.innerHTML = "";
    items.forEach((x) => {
      const div = document.createElement("div");
      div.className = "explain-item";
      div.innerHTML = `<strong>${escapeHtml(x.s)}</strong> — ${escapeHtml(x.t)}`;
      explainListRef.current?.appendChild(div);
    });
  }

  function openModal() {
    if (!resultsModalRef.current || !modalTimelineMountRef.current || !modalOptionsMountRef.current) return;

    const modalCompany = document.getElementById("modalCompany");
    if (modalCompany) {
      modalCompany.textContent = lastCompanyForModal ? `— ${lastCompanyForModal}` : "";
    }

    const mDecision = document.getElementById("mDecision");
    const mScore = document.getElementById("mScore");
    const mConditions = document.getElementById("mConditions");

    if (mDecision) mDecision.textContent = resDecision;
    if (mScore) mScore.textContent = resScore;
    if (mConditions) mConditions.textContent = resConditions;

    // Move nodes into modal
    if (aiTimelineRef.current) {
      modalTimelineMountRef.current.appendChild(aiTimelineRef.current);
      aiTimelineRef.current.style.display = "block";
    }
    if (aiOptionsElRef.current) {
      modalOptionsMountRef.current.appendChild(aiOptionsElRef.current);
      aiOptionsElRef.current.style.display = "block";
    }

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

  function runAI(name?: string) {
    const company = (name || "Sample Manufacturing Pvt Ltd").trim();

    if (consoleElRef.current) consoleElRef.current.innerHTML = "";
    if (handshakeRef.current) {
      handshakeRef.current.style.display = "none";
      handshakeRef.current.style.pointerEvents = "none";
    }
    if (openResultsBtnRef.current) openResultsBtnRef.current.style.display = "none";
    if (resultStripRef.current) resultStripRef.current.style.display = "none";

    if (aiTimelineRef.current) aiTimelineRef.current.style.display = "none";
    if (aiOptionsElRef.current) aiOptionsElRef.current.style.display = "none";

    log(`Starting analysis: ${company}`, "strong");
    log("Loading policy pack: SME + Supply Chain");
    log("Building financial reasoning graph…");

    setTimeout(() => log("Parsing bank statement…"), 450);
    setTimeout(() => log("Reconciling GST filings…"), 900);
    setTimeout(() => log("Mapping director network…", "strong"), 1350);

    setTimeout(() => {
      const h = hash(company);
      const mode = h % 3;
      let options: OptionData[] = [];

      if (mode === 0) {
        options = [
          {
            tag: "Best fit",
            title: "Working Capital OD",
            limit: "₹50L",
            tenor: "12 months",
            pricing: "MCLR + 2.25%",
            controls: "Standard covenants",
          },
          {
            tag: "Lower risk",
            title: "OD + Escrow",
            limit: "₹60L",
            tenor: "12 months",
            pricing: "MCLR + 2.00%",
            controls: "Escrow on top 3 buyers",
          },
          {
            tag: "Faster drawdowns",
            title: "Invoice Finance Line",
            limit: "₹40L",
            tenor: "90–120 days",
            pricing: "1.2% per 30 days",
            controls: "Invoice assignment + anchor validation",
          },
        ];
        setResDecision("APPROVE");
        setResScore("742 (Low)");
        setResConditions("Standard covenants");
        log("Decision: APPROVE", "good");
      }

      if (mode === 1) {
        options = [
          {
            tag: "Best fit",
            title: "OD with Controls",
            limit: "₹45L",
            tenor: "12 months",
            pricing: "MCLR + 2.75%",
            controls: "Escrow + invoice assignment",
          },
          {
            tag: "Lower risk",
            title: "Invoice Finance (Anchor-led)",
            limit: "₹55L",
            tenor: "90 days",
            pricing: "1.35% per 30 days",
            controls: "Anchor confirmation + concentration cap",
          },
          {
            tag: "Conservative",
            title: "Term Loan Lite",
            limit: "₹30L",
            tenor: "24 months",
            pricing: "MCLR + 3.10%",
            controls: "DSCR covenant + quarterly review",
          },
        ];
        setResDecision("CONDITIONAL APPROVAL");
        setResScore("712 (Moderate-Low)");
        setResConditions("Escrow + Invoice Assignment");
        log("Decision: CONDITIONAL APPROVAL", "strong");
        log("Conditions: Escrow + invoice assignment", "strong");
      }

      if (mode === 2) {
        options = [
          {
            tag: "If reconsidered",
            title: "Small OD + Hard Controls",
            limit: "₹15L",
            tenor: "6 months",
            pricing: "MCLR + 4.25%",
            controls: "100% escrow + weekly monitoring",
          },
          {
            tag: "Alternative",
            title: "Secured Against FD",
            limit: "₹25L",
            tenor: "12 months",
            pricing: "FD rate + 2.0%",
            controls: "Lien on FD + auto-sweep",
          },
          {
            tag: "Non-fund",
            title: "LC/BG Only",
            limit: "₹20L",
            tenor: "Per transaction",
            pricing: "As per schedule",
            controls: "Collateral + margin + approvals",
          },
        ];
        setResDecision("DECLINE");
        setResScore("608 (Elevated)");
        setResConditions("Related-party + volatility flags");
        log("Decision: DECLINE", "bad");
        log("Reason: Related-party risk + cashflow volatility", "bad");
      }

      log("Generating AI recommended sanction structures…", "strong");

      setTimeout(() => {
        renderOptions(options);
        renderTimeline(company);
        renderExplainability(mode);

        if (resultStripRef.current) resultStripRef.current.style.display = "flex";
        if (openResultsBtnRef.current) openResultsBtnRef.current.style.display = "block";

        if (aiTimelineRef.current) aiTimelineRef.current.style.display = "none";
        if (aiOptionsElRef.current) aiOptionsElRef.current.style.display = "none";

        setLastCompanyForModal(company);
        log("Results ready. Open Full Results for complete output.", "good");
      }, 650);
    }, 1900);
  }

  // Live typing
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

  // Typewriter effect
  useEffect(() => {
    const currentMessage = MESSAGES[typewriterIndex];

    // Tuning knobs
    const typeDelay = 60;         // faster typing
    const deleteDelay = 30;       // faster delete
    const pauseAfterType = 600;   // shorter pause
    const pauseAfterDelete = 120; // quicker transition

    const tick = () => {
      const isDeleting = isDeletingRef.current;
      const charIndex = charIndexRef.current;

      const nextIndex = isDeleting ? charIndex - 1 : charIndex + 1;
      charIndexRef.current = nextIndex;

      setTypewriterText(currentMessage.slice(0, nextIndex));

      // Fully typed → pause → start deleting
      if (!isDeleting && nextIndex >= currentMessage.length) {
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        typeTimeoutRef.current = setTimeout(() => {
          isDeletingRef.current = true;
          tick();
        }, pauseAfterType);
        return;
      }

      // Fully deleted → pause → next message
      if (isDeleting && nextIndex <= 0) {
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        typeTimeoutRef.current = setTimeout(() => {
          isDeletingRef.current = false;
          charIndexRef.current = 0;
          setTypewriterIndex((prev) => (prev + 1) % MESSAGES.length);
        }, pauseAfterDelete);
        return;
      }

      // Continue typing/deleting
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
      typeTimeoutRef.current = setTimeout(
        tick,
        isDeleting ? deleteDelay : typeDelay
      );
    };

  tick();

  // Cleanup so it doesn't "speed up" from stacked timers
  return () => {
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
  };
}, [typewriterIndex]);


  return (
    <>
      <canvas ref={canvasRef} id="aiBg"></canvas>

      <header>
        <div className="nav">
          <div className="logo">
            <Image
              src="/credable-logo.png"
              alt="CredAble"
              width={130}
              height={26}
              priority
            />
          </div>
          <div className="nav-actions" style={{ display: 'flex', gap: '10px' }}>
            <Link href="/ai-brain" className="btn btn-ghost">
              View AI Brain
            </Link>
            <button
              className="btn btn-primary"
              type="button"
              onClick={scrollToConsole}
            >
              Launch Demo
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          {/* TOP: HERO TEXT */}
          <div className="hero-text">
            <div className="eyebrow">AI-Native Working Capital</div>
            <h1>CredAble is an AI Operating System for Business Credit.</h1>
            <p className="typewriter-container">
              {typewriterText}<span className="typewriter-cursor">|</span>
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
                      <div className="ai-palette-title">
                        Try CredAble's AI Credit Engine
                      </div>
                    </div>
                    
                    <div className="demo-instructions">
                      <p className="demo-lead">
                        Experience instant credit analysis powered by AI. We'll guide you through analyzing a sample company.
                      </p>
                      
                      <div className="demo-steps">
                        <div className="demo-step">
                          <div className="step-number">1</div>
                          <div className="step-content">
                            <h4>Click "Start Demo" below</h4>
                            <p>We'll prepare the AI engine with a sample company</p>
                          </div>
                        </div>
                        <div className="demo-step">
                          <div className="step-number">2</div>
                          <div className="step-content">
                            <h4>Run the analysis</h4>
                            <p>Watch the AI analyze cashflows, compliance, and risk in real-time</p>
                          </div>
                        </div>
                        <div className="demo-step">
                          <div className="step-number">3</div>
                          <div className="step-content">
                            <h4>Explore the results</h4>
                            <p>View sanction structures, risk scores, and explainable insights</p>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-large"
                        type="button"
                        onClick={() => setDemoStep(1)}
                      >
                        Start Demo →
                      </button>

                      <div className="demo-features">
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
                      <div className="ai-badge">STEP 2 OF 3</div>
                      <div className="ai-palette-title">
                        Type the company name
                      </div>
                    </div>

                    <div className="demo-company-display">
                      <div className="demo-instruction">
                        <strong>This demo uses Tata Motors as an example</strong> of what CredAble's technology analyzes. To continue, type the company name exactly as shown below:
                      </div>
                      
                      <div className="demo-company-card">
                        <div className="company-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                        </div>
                        <div className="company-details">
                          <div className="company-name">{demoCompany}</div>
                          <div className="company-meta">Automotive • Manufacturing • India</div>
                        </div>
                      </div>

                      <div className="demo-action-box">
                        <p className="action-instruction">
                          Type <strong>"{demoCompany}"</strong> in the field below:
                        </p>
                        <div className="demo-input-wrapper">
                          <input
                            type="text"
                            className="demo-input-field"
                            placeholder="Type the company name..."
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && demoInput.toLowerCase() === demoCompany.toLowerCase()) {
                                setDemoStep(2);
                                runAI(demoCompany);
                              }
                            }}
                          />
                          <button
                            className="btn btn-primary btn-large"
                            type="button"
                            disabled={demoInput.toLowerCase() !== demoCompany.toLowerCase()}
                            onClick={() => {
                              setDemoStep(2);
                              runAI(demoCompany);
                            }}
                          >
                            ▶ Run Analysis
                          </button>
                        </div>
                        {demoInput && demoInput.toLowerCase() !== demoCompany.toLowerCase() && (
                          <div className="demo-hint-error">
                            Please type "{demoCompany}" exactly as shown above
                          </div>
                        )}
                      </div>

                      <div className="demo-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="16" x2="12" y2="12"/>
                          <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        <span>The AI will analyze cashflows, GST compliance, concentration risk, and more</span>
                      </div>
                    </div>
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="demo-running">
                    <div className="ai-palette-top">
                      <div className="ai-badge">ANALYZING</div>
                      <div className="ai-palette-title">
                        AI engine running...
                      </div>
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
            <div
              className="ai-result"
              id="resultStrip"
              ref={resultStripRef}
              style={{ display: "none" }}
            >
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
      </main>

      {/* FULL RESULTS MODAL */}
      <div
        className="modal-backdrop"
        id="resultsModal"
        ref={resultsModalRef}
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === resultsModalRef.current) closeModal();
        }}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-label="Full AI Results">
          <div className="modal-header">
            <div className="modal-title">
              Full AI Results <span className="modal-sub" id="modalCompany"></span>
            </div>
            <button
              className="modal-close"
              id="closeResults"
              type="button"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-single-col">
              <div className="modal-card">
                <div className="card-title">Decision Summary</div>
                <div className="summary-row">
                  <div className="summary-item">
                    <div className="result-label">Decision</div>
                    <div className="result-value" id="mDecision">
                      {resDecision}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="result-label">Risk Score</div>
                    <div className="result-value" id="mScore">
                      {resScore}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="result-label">Conditions</div>
                    <div className="result-value" id="mConditions">
                      {resConditions}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-card" id="modalTimelineMount" ref={modalTimelineMountRef}>
                <div className="card-title">Behaviour Over Time</div>
              </div>

              <div className="modal-card" id="modalOptionsMount" ref={modalOptionsMountRef}>
                <div className="card-title">AI Recommended Structures</div>
              </div>

              <div className="modal-card">
                <div className="card-title">Explainability</div>
                <div className="explain-list" id="explainList" ref={explainListRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden mounts (rendered by JS, moved into modal on open) */}
      <div className="hidden-mount">
        <div className="ai-timeline" id="aiTimeline" ref={aiTimelineRef} style={{ display: "none" }}>
          <div className="ai-timeline-head">
            <div className="ai-timeline-title">Behaviour over time</div>
            <div className="ai-timeline-sub">
              Past 6 months signals informing today's decision (not a future loan forecast).
            </div>
          </div>

          <div className="ai-timeline-row" id="aiTimelineRow" ref={aiTimelineRowRef}></div>

          <div className="ai-timeline-detail" id="aiTimelineDetail">
            <div className="ai-timeline-detail-title" id="aiTLTitle" ref={aiTLTitleRef}>
              Hover a month
            </div>
            <div className="ai-timeline-detail-body" id="aiTLBody" ref={aiTLBodyRef}>
              See cashflow + compliance + concentration signals month-by-month.
            </div>
          </div>
        </div>

        <div className="ai-options" id="aiOptions" ref={aiOptionsElRef} style={{ display: "none" }}>
          <div className="ai-options-head">
            <div className="ai-options-title">AI Recommended Structures</div>
            <div className="ai-options-sub">
              Three sanction structures ranked by risk-adjusted fit.
            </div>
          </div>

          <div className="ai-options-grid" id="aiOptionsGrid" ref={aiOptionsGridRef}></div>

          <div className="ai-options-foot">
            <span className="ai-options-note">
              All recommendations are explainable and policy-linked.
            </span>
          </div>
        </div>
      </div>
      {/* Floating Chat Pill */}
      <div className={`chat-pill ${isChatExpanded ? 'chat-pill-expanded' : ''}`}>
        <input
          className="chat-pill-input"
          placeholder="Ask CredAble"
          onFocus={() => setIsChatExpanded(true)}
          onBlur={() => setIsChatExpanded(false)}
        />
        <button className="chat-pill-send">↑</button>
      </div>
    </>
  );
}