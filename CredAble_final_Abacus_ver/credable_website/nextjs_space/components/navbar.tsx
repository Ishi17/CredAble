'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLosDropdownOpen, setIsLosDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const losSubLinks = [
    { href: '/los-platform', label: 'About' },
    { href: '/los-platform/for-credit-managers', label: 'For Credit Managers' },
    { href: '/los-platform/for-bank-transformation-teams', label: 'For Bank Transformation Teams' },
    { href: '/los-platform/for-borrowers', label: 'For Borrowers' },
    { href: '/los-platform/for-relationship-managers', label: 'For Relationship managers' },
  ];

  const otherLinks = [
    { href: '/', label: 'Home' },
    { href: '/demo', label: 'Demo' },
    { href: '/ai-brain', label: 'AI Brain' },
  ];

  const isLosActive = pathname.startsWith('/los-platform');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLosDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLosDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsLosDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/credable-logo.png"
            alt="CredAble"
            width={110 * 0.7}
            height={32 * 0.7}
            className="opacity-100"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Home */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-orange-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </Link>

          {/* LOS Platform Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsLosDropdownOpen(!isLosDropdownOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isLosActive ? 'text-orange-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              LOS Platform
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isLosDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isLosDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                {losSubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsLosDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === link.href
                        ? 'text-orange-400 bg-slate-800/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Demo & AI Brain */}
          {otherLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? 'text-orange-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0f1a] px-6 py-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium ${
              pathname === '/' ? 'text-orange-400' : 'text-slate-400'
            }`}
          >
            Home
          </Link>

          {/* LOS Platform Expandable */}
          <div>
            <button
              onClick={() => setIsLosDropdownOpen(!isLosDropdownOpen)}
              className={`flex items-center justify-between w-full py-2 text-sm font-medium ${
                isLosActive ? 'text-orange-400' : 'text-slate-400'
              }`}
            >
              LOS Platform
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isLosDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isLosDropdownOpen && (
              <div className="pl-4 border-l border-slate-700 ml-2">
                {losSubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsLosDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block py-2 text-sm ${
                      pathname === link.href ? 'text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                pathname === link.href ? 'text-orange-400' : 'text-slate-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
