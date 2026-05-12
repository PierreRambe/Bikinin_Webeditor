"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Harga", href: "/#harga" },
  { label: "Template", href: "/portfolio" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bikinin-dark") === "true";
    setDarkMode(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bikinin-dark", String(next));
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[68px] transition-all duration-300",
          scrolled
            ? "bg-white/92 dark:bg-[#0E0C0A]/92 backdrop-blur-xl border-b border-[#E8E4D4]/80 dark:border-white/8 shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Logo theme={darkMode ? "dark" : "light"} size="md" />

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className={cn(
                "relative flex items-center w-[60px] h-[30px] rounded-full px-1 transition-all duration-300 border",
                darkMode
                  ? "bg-[#1A1612] border-[#A87C4F]/30"
                  : "bg-[#F0EDE6] border-[#E0D9CC]"
              )}
            >
              <span
                className={cn(
                  "absolute flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#A87C4F] transition-all duration-300 shadow-sm",
                  darkMode ? "translate-x-[30px]" : "translate-x-0"
                )}
              />
              <Sun
                size={12}
                className={cn(
                  "absolute left-[8px] z-10 transition-opacity duration-200",
                  darkMode ? "opacity-30 text-[#F0EDE8]" : "opacity-100 text-white"
                )}
              />
              <Moon
                size={12}
                className={cn(
                  "absolute right-[7px] z-10 transition-opacity duration-200",
                  darkMode ? "opacity-100 text-[#C9A47A]" : "opacity-25 text-[#5A5A5A]"
                )}
              />
            </button>

            {/* CTA */}
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold bg-[#A87C4F] text-white hover:bg-[#9A7045] transition-all duration-200 shadow-[0_2px_12px_rgba(168,124,79,0.35)]"
            >
              Buat Website
              <ArrowRight size={13} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                darkMode
                  ? "text-[#F0EDE8] hover:bg-white/8"
                  : "text-[#1C1C1C] hover:bg-[#F0EDE6]"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            "fixed inset-0 z-40 pt-[68px] animate-fade-in",
            darkMode ? "bg-[#0E0C0A]" : "bg-white"
          )}
        >
          <nav className="flex flex-col p-6 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-[17px] font-medium py-3.5 border-b transition-colors",
                  darkMode
                    ? "text-[#F0EDE8] border-white/8 hover:text-[#C9A47A]"
                    : "text-[#1C1C1C] border-[#F0EDE6] hover:text-[#A87C4F]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/dashboard"
                className="btn-primary text-center justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Buat Website Sekarang
                <ArrowRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
