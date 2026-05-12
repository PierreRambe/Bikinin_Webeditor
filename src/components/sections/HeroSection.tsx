"use client";

import Link from "next/link";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { BrowserMockup } from "@/components/ui/BrowserMockup";

const TRUST_BADGES = ["SSL Gratis", "Setup 5 Menit", "Tanpa Koding"];
const AVATAR_BG_CLASSES = ["bg-[#A87C4F]", "bg-[#C9A47A]", "bg-[#8A6440]", "bg-[#B8904F]"];

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-[68px] flex items-center overflow-hidden bg-white dark:bg-[#0E0C0A] transition-colors duration-200">
      {/* Gradients & texture */}
      <div className="hero-bg-gradient absolute inset-0 pointer-events-none" />
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Decorative orbs */}
      <div className="absolute top-14 right-[5%] w-[460px] h-[460px] rounded-full bg-[#A87C4F]/8 dark:bg-[#A87C4F]/13 blur-[110px] animate-drift-a pointer-events-none" />
      <div className="absolute bottom-12 left-[3%] w-[380px] h-[380px] rounded-full bg-[#C9A47A]/7 dark:bg-[#C9A47A]/10 blur-[90px] animate-drift-b pointer-events-none" />
      <div className="absolute top-1/2 left-[28%] w-72 h-72 rounded-full bg-[#E8C49A]/6 dark:bg-[#A87C4F]/8 blur-3xl animate-drift-c pointer-events-none" />
      <div className="absolute bottom-1/3 right-[24%] w-56 h-56 rounded-full bg-[#A87C4F]/5 dark:bg-[#C9A47A]/8 blur-2xl animate-orb-pulse pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* LEFT — Text */}
        <div className="flex flex-col items-start">
          {/* Badge */}
          <div className="badge mb-7 animate-fade-up">
            ✦&nbsp; No-Code · Premium · UMKM Ready
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-[#1C1C1C] dark:text-[#F0EDE8] mb-5 animate-fade-up delay-80">
            Bangun Kehadiran
            <br />
            Digital yang
            <br />
            <span className="text-[#A87C4F]">Profesional</span>
          </h1>

          {/* Sub */}
          <p className="text-[17px] lg:text-[18px] text-[#5A5A5A] dark:text-[#6A6460] leading-relaxed mb-8 max-w-[480px] animate-fade-up delay-160">
            Website eksklusif untuk UMKM dan Profesional Indonesia.{" "}
            <span className="font-medium text-[#1C1C1C] dark:text-[#C9A47A]">
              Tanpa koding, tanpa ribet.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-9 animate-fade-up delay-240">
            <Link href="/dashboard" className="btn-primary text-[14px]">
              Mulai Buat Website
              <ArrowRight size={16} />
            </Link>
            <Link href="/portfolio" className="btn-ghost text-[14px] py-3">
              Lihat Contoh →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-7 animate-fade-up delay-320">
            {TRUST_BADGES.map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-[13px] text-[#5A5A5A] dark:text-[#6A6460]">
                <CheckCircle2 size={13} className="text-[#4CAF7D]" />
                {b}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 animate-fade-up delay-400">
            <div className="flex -space-x-2">
              {AVATAR_BG_CLASSES.map((bgClass, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white dark:border-[#0E0C0A] flex items-center justify-center text-[10px] font-bold text-white ${bgClass}`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#A87C4F" stroke="none" />
                ))}
              </div>
              <p className="text-[12px] text-[#5A5A5A] dark:text-[#6A6460]">
                Dipercaya{" "}
                <span className="font-semibold text-[#1C1C1C] dark:text-[#C9A47A]">2.000+</span>
                {" "}UMKM di Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Browser mockup */}
        <div className="relative flex justify-center lg:justify-end animate-fade-up delay-160">
          <div className="hero-mockup-shadow" />
          <div className="hero-mockup-wrapper relative w-full max-w-[640px] animate-float">
            <BrowserMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
