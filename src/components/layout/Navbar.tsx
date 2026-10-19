import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, PRIMARY_CTA } from '../../data/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavbarProps {
  onNavigate?: (href: string) => void;
  currentHash?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentHash = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm shadow-slate-200/50 py-3.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick('#home', e)}
            className="group flex items-center gap-1.5 text-xl font-bold tracking-tight text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-transform duration-200 hover:scale-[1.02]"
            aria-label="SameerDev Home"
          >
            <span className="font-extrabold tracking-tight">
              Sameer<span className="text-blue-600 transition-colors duration-200 group-hover:text-blue-700">Dev</span>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" aria-hidden="true" />
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium"
            aria-label="Primary Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentHash === item.href || (item.href === '#home' && !currentHash);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  className={`relative py-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm group ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Subtle hover underline */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 scale-x-100'
                        : 'bg-slate-300 scale-x-0 group-hover:scale-x-75 group-hover:bg-blue-500/70'
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA (Blue modern button) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={PRIMARY_CTA.href}
              onClick={(e) => handleLinkClick(PRIMARY_CTA.href, e)}
              className="group relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white whitespace-nowrap"
            >
              <span>{PRIMARY_CTA.label}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="md:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white/98 backdrop-blur-xl border-t border-slate-200 z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = currentHash === item.href || (item.href === '#home' && !currentHash);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`text-base font-medium py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold border border-blue-200'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.6)]" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-200 mt-6">
            <a
              href={PRIMARY_CTA.href}
              onClick={(e) => handleLinkClick(PRIMARY_CTA.href, e)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>{PRIMARY_CTA.label}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
