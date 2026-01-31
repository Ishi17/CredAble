'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

type ScrollDownPromptProps = {
  /** When true, show at bottom of viewport until user is near page bottom (all sections). When false, show only in hero (top 60% of first viewport). */
  showInAllSections?: boolean;
};

export function ScrollDownPrompt({ showInAllSections = false }: ScrollDownPromptProps = {}) {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // When showInAllSections: use overflow div if present (persona pages); else window
    const scrollContainer =
      showInAllSections &&
      typeof document !== 'undefined' &&
      (() => {
        const el = document.querySelector('.overflow-y-auto, [style*="overflow-y-auto"]') as HTMLElement | null;
        return el && el.scrollHeight > el.clientHeight ? el : null;
      })();
    scrollContainerRef.current = scrollContainer ?? null;

    const onScroll = () => {
      if (showInAllSections) {
        const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
        const scrollHeight = scrollContainer ? scrollContainer.scrollHeight : document.documentElement.scrollHeight;
        const clientHeight = scrollContainer ? scrollContainer.clientHeight : window.innerHeight;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 120;
        setShow(!nearBottom);
      } else {
        setShow(window.scrollY < window.innerHeight * 0.6);
      }
    };

    onScroll(); // initial check

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [showInAllSections]);

  if (!show) return null;

  const content = (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const el = scrollContainerRef.current;
        const delta = typeof window !== 'undefined' ? window.innerHeight : 800;
        if (el) {
          el.scrollBy({ top: delta, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: delta, behavior: 'smooth' });
        }
      }}
      className="fixed left-1/2 -translate-x-1/2 bottom-20 flex flex-col items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors animate-bounce cursor-pointer z-[999]"
      aria-label="Scroll down"
    >
      <span className="text-xs uppercase tracking-widest text-orange-400/80">Scroll</span>
      <ChevronDown size={32} strokeWidth={2} className="text-orange-500" />
    </a>
  );

  // Portal to document.body so position:fixed is viewport-relative (parent transform/overflow won't clip it)
  if (typeof document !== 'undefined' && mounted) {
    return createPortal(content, document.body);
  }
  return content;
}
