'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Brain, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';

const TOTAL_STEPS = 3;
const SCROLL_THRESHOLD = 80;
const COOLDOWN_MS = 900;

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const scrollDelta = useRef(0);
  const isLocked = useRef(false);
  const lastStepTime = useRef(0);

  // Animate progress smoothly when step changes
  useEffect(() => {
    const targetProgress = (currentStep - 1) / (TOTAL_STEPS - 1);
    let animationId: number;
    
    const animate = () => {
      setAnimatedProgress(prev => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.01) return targetProgress;
        animationId = requestAnimationFrame(animate);
        return prev + diff * 0.15;
      });
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [currentStep]);

  const changeStep = useCallback((direction: number) => {
    const now = Date.now();
    if (isLocked.current || now - lastStepTime.current < COOLDOWN_MS) return;
    
    const nextStep = Math.min(TOTAL_STEPS, Math.max(1, currentStep + direction));
    if (nextStep !== currentStep) {
      isLocked.current = true;
      lastStepTime.current = now;
      setCurrentStep(nextStep);
      
      // Keep lock active for full cooldown to block momentum
      setTimeout(() => {
        isLocked.current = false;
        scrollDelta.current = 0; // Clear any accumulated delta after cooldown
      }, COOLDOWN_MS);
    }
  }, [currentStep]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Ignore all input during cooldown and reset accumulated delta
      if (isLocked.current) {
        scrollDelta.current = 0;
        return;
      }
      
      scrollDelta.current += e.deltaY;
      
      if (Math.abs(scrollDelta.current) >= SCROLL_THRESHOLD) {
        const direction = scrollDelta.current > 0 ? 1 : -1;
        scrollDelta.current = 0; // Reset before step change
        changeStep(direction);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [changeStep]);

  // Touch support for mobile
  const touchStart = useRef(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isLocked.current) {
        touchStart.current = e.touches[0].clientY; // Reset touch origin during lock
        return;
      }
      
      const delta = touchStart.current - e.touches[0].clientY;
      if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        const direction = delta > 0 ? 1 : -1;
        touchStart.current = e.touches[0].clientY; // Reset before step change
        changeStep(direction);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [changeStep]);

  const scrollProgress = animatedProgress;

  const cards = [
    { icon: Brain, word: 'Perceive', desc: 'Neural networks that understand complex financial patterns.' },
    { icon: Zap, word: 'Process', desc: 'Instant analysis of supplier data and invoices.' },
    { icon: Shield, word: 'Protect', desc: 'Advanced anomaly detection and risk modeling.' },
    { icon: TrendingUp, word: 'Evolve', desc: 'Algorithms that improve with every transaction.' }
  ];

  // Layer transitions: 0-0.5 = Layer1->2, 0.5-1 = Layer2->3
  const layer1to2 = Math.min(1, scrollProgress * 2);
  const layer2to3 = Math.max(0, (scrollProgress - 0.5) * 2);

  // Corner positions for Layer 2 (inset from edges)
  const cornerPositions = [
    { x: -28, y: -22 }, // top-left
    { x: 28, y: -22 },  // top-right
    { x: -28, y: 22 },  // bottom-left
    { x: 28, y: 22 }    // bottom-right
  ];

  return (
    <div className="h-screen bg-[#0a0f1a] text-white overflow-hidden">
      {/* Neural background */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        {[...Array(40)].map((_, i) => (
          <circle
            key={i}
            cx={`${(i * 13.7) % 90 + 5}%`}
            cy={`${(i * 17.3) % 85 + 7}%`}
            r={2}
            fill="url(#grad)"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>

      {/* Step container - no native scroll */}
      <div ref={containerRef} className="h-full overflow-hidden relative z-10">
        <div className="h-full">
          
          {/* Fixed content layer */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            
            {/* Layer 1: Hero headline with inline words */}
            <div
              className="text-center transition-all duration-700 px-4"
              style={{ opacity: 1 - layer1to2 * 1.5 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 flex flex-wrap justify-center items-baseline gap-x-4 md:gap-x-6 gap-y-2">
                <span className="inline-block text-slate-400">We</span>
                {cards.map((card, idx) => {
                  const colors = [
                    'from-blue-400 to-cyan-400',
                    'from-cyan-400 to-teal-400',
                    'from-teal-400 to-orange-400',
                    'from-orange-400 to-orange-500'
                  ];
                  return (
                    <span
                      key={`word-${idx}`}
                      className={`inline-block bg-gradient-to-r ${colors[idx]} bg-clip-text text-transparent transition-all duration-700`}
                      style={{
                        transform: `translateY(${layer1to2 * -20}px)`,
                        opacity: layer2to3 > 0.5 ? 0 : 1,
                      }}
                    >
                      {card.word}
                    </span>
                  );
                })}
                <span className="inline-block text-slate-400">.</span>
              </h1>
              <p className="text-xl text-slate-400">AI that reasons through every credit decision.</p>
            </div>

            {/* Layer 2 & 3: Cards that move to corners then converge */}
            {cards.map((card, idx) => {
              const corner = cornerPositions[idx];
              
              // Layer 2: Move to corners
              const toCornerX = corner.x * layer1to2;
              const toCornerY = corner.y * layer1to2;
              
              // Layer 3: Converge to center
              const toCenterX = toCornerX * (1 - layer2to3);
              const toCenterY = toCornerY * (1 - layer2to3);
              
              // Card visibility and size
              const cardOpacity = layer1to2;
              const cardScale = 0.6 + layer1to2 * 0.4 - layer2to3 * 0.3;
              const showDesc = layer1to2 > 0.5 && layer2to3 < 0.7;

              const colors = [
                'from-blue-400 to-cyan-400',
                'from-cyan-400 to-teal-400',
                'from-teal-400 to-orange-400',
                'from-orange-400 to-orange-500'
              ];

              return (
                <div
                  key={idx}
                  className="absolute transition-all duration-500 ease-out pointer-events-auto"
                  style={{
                    transform: `translate(${toCenterX}vw, ${toCenterY}vh) scale(${cardScale})`,
                    opacity: cardOpacity,
                  }}
                >
                  <div 
                    className={`bg-slate-900/70 backdrop-blur border border-white/10 rounded-2xl p-6 w-56 
                      transform-gpu
                      shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,255,255,0.06)]
                      transition-all duration-300 ease-out
                      hover:-translate-y-1 hover:scale-[1.02]
                      hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_26px_70px_rgba(255,255,255,0.10),0_0_50px_rgba(255,255,255,0.08)]
                      hover:border-white/20
                      ${layer2to3 > 0.8 ? 'opacity-0' : ''}`}
                  >
                    <card.icon className="text-orange-400 mb-3" size={28} />
                    <h3 className={`text-xl font-bold bg-gradient-to-r ${colors[idx]} bg-clip-text text-transparent mb-2`}>
                      {card.word}
                    </h3>
                    <p className={`text-slate-400 text-sm transition-opacity duration-300 ${showDesc ? 'opacity-100' : 'opacity-0'}`}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Layer 3: Launch Demo Button (appears when cards converge) */}
            <div
              className="absolute transition-all duration-500 pointer-events-auto flex flex-col items-center gap-4"
              style={{
                opacity: layer2to3 > 0.7 ? (layer2to3 - 0.7) * 3.33 : 0,
                transform: `scale(${layer2to3 > 0.7 ? 0.8 + (layer2to3 - 0.7) * 0.67 : 0.8})`,
              }}
            >
              <Link
                href="/demo"
                className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-5 rounded-full text-xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
              >
                Launch Demo
                <ArrowRight size={24} />
              </Link>
              <Link
                href="/los-platform"
                className="flex items-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-medium px-6 py-3 rounded-full text-sm shadow-lg shadow-white/5 hover:shadow-white/10 transition-all backdrop-blur"
              >
                Learn about our Loan Origination System Platform
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Step indicators */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => {
                  if (!isLocked.current) {
                    setCurrentStep(step);
                    scrollDelta.current = 0;
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 pointer-events-auto ${
                  currentStep === step ? 'bg-orange-400 w-6' : 'bg-slate-600 w-2 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}