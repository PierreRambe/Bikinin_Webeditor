"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  {
    id: "toko-kopi",
    name: "Kopi Nusantara",
    category: "Kafe & Restoran",
    desc: "Website kafe premium dengan menu interaktif dan reservasi online.",
    color: "#6B4226",
    colorText: "text-[#6B4226]",
    colorBgAlpha: "bg-[#6B422612]",
    colorBg: "bg-[#6B4226]",
    accent: "#C9A47A",
    tag: "Populer",
    modules: ["Navbar", "Hero", "Menu", "Galeri", "Reservasi", "Kontak"],
    preview: {
      nav: "Kopi Nusantara",
      hero: "Setiap Tegukan, Sebuah Cerita",
      sub: "Kopi pilihan dari penjuru Nusantara",
      btn: "Reservasi Meja",
      items: ["Arabica Aceh", "Robusta Toraja", "Liberica Bengkulu"],
    },
  },
  {
    id: "toko-fashion",
    name: "Batik Lestari",
    category: "Fashion & Retail",
    desc: "Toko online batik modern dengan galeri produk dan WhatsApp checkout.",
    color: "#8B4513",
    colorText: "text-[#8B4513]",
    colorBgAlpha: "bg-[#8B451312]",
    colorBg: "bg-[#8B4513]",
    accent: "#D4A853",
    tag: "Terlaris",
    modules: ["Navbar", "Hero", "Galeri Produk", "Tentang", "Kontak"],
    preview: {
      nav: "Batik Lestari",
      hero: "Koleksi Batik Modern",
      sub: "Warisan budaya untuk generasi kini",
      btn: "Lihat Koleksi",
      items: ["Batik Parang", "Batik Kawung", "Batik Mega Mendung"],
    },
  },
  {
    id: "jasa-konsultan",
    name: "Konsultan Digital",
    category: "Jasa & Profesional",
    desc: "Landing page profesional untuk konsultan bisnis dengan booking online.",
    color: "#2C3E50",
    colorText: "text-[#2C3E50]",
    colorBgAlpha: "bg-[#2C3E5012]",
    colorBg: "bg-[#2C3E50]",
    accent: "#A87C4F",
    tag: "Baru",
    modules: ["Navbar", "Hero", "Layanan", "Testimoni", "Kontak"],
    preview: {
      nav: "Bima Consulting",
      hero: "Solusi Bisnis Digital",
      sub: "Kami bantu bisnis Anda tumbuh secara digital",
      btn: "Konsultasi Gratis",
      items: ["Strategi Digital", "Branding & Desain", "SEO & Marketing"],
    },
  },
  {
    id: "studio-foto",
    name: "Lensa Studio",
    category: "Fotografi & Kreatif",
    desc: "Portfolio studio foto dengan galeri masonry dan paket harga.",
    color: "#1A1A2E",
    colorText: "text-[#1A1A2E]",
    colorBgAlpha: "bg-[#1A1A2E12]",
    colorBg: "bg-[#1A1A2E]",
    accent: "#C9A47A",
    tag: "",
    modules: ["Navbar", "Hero", "Portofolio", "Paket", "Kontak"],
    preview: {
      nav: "Lensa Studio",
      hero: "Abadikan Momen Terbaik",
      sub: "Fotografer profesional untuk wedding, produk & event",
      btn: "Lihat Portofolio",
      items: ["Wedding Package", "Product Photography", "Event Coverage"],
    },
  },
  {
    id: "klinik",
    name: "Klinik Sehat",
    category: "Kesehatan & Medis",
    desc: "Website klinik modern dengan jadwal dokter dan booking appointment.",
    color: "#0D7377",
    colorText: "text-[#0D7377]",
    colorBgAlpha: "bg-[#0D737712]",
    colorBg: "bg-[#0D7377]",
    accent: "#4CAF7D",
    tag: "",
    modules: ["Navbar", "Hero", "Dokter", "Jadwal", "Booking", "Kontak"],
    preview: {
      nav: "Klinik Sehat",
      hero: "Kesehatan Anda, Prioritas Kami",
      sub: "Layanan kesehatan terpercaya di kota Anda",
      btn: "Buat Janji",
      items: ["Dokter Umum", "Dokter Spesialis", "Konsultasi Online"],
    },
  },
  {
    id: "gym",
    name: "FitLife Gym",
    category: "Olahraga & Kebugaran",
    desc: "Website gym dengan program latihan, kelas, dan membership online.",
    color: "#1C1C1C",
    colorText: "text-[#1C1C1C]",
    colorBgAlpha: "bg-[#1C1C1C12]",
    colorBg: "bg-[#1C1C1C]",
    accent: "#A87C4F",
    tag: "",
    modules: ["Navbar", "Hero", "Program", "Jadwal Kelas", "Membership", "Kontak"],
    preview: {
      nav: "FitLife Gym",
      hero: "Mulai Perjalanan Sehatmu",
      sub: "Fasilitas lengkap, instruktur berpengalaman",
      btn: "Coba 7 Hari Gratis",
      items: ["Zumba Class", "CrossFit", "Yoga & Pilates"],
    },
  },
];

function WebsitePreview({ ex, dark }: { ex: typeof EXAMPLES[0]; dark: boolean }) {
  return (
    <div className={cn(
      "rounded-xl overflow-hidden border transition-all duration-200 group-hover:shadow-lg",
      dark ? "border-white/8" : "border-[#EAE6D8]"
    )}>
      {/* Browser chrome */}
      <div className={cn("flex items-center gap-2 px-3 h-8", dark ? "bg-[#1A1612]" : "bg-[#F0EDE6]")}>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#FF6058]" />
          <span className="w-2 h-2 rounded-full bg-[#FFBB33]" />
          <span className="w-2 h-2 rounded-full bg-[#61C554]" />
        </div>
        <div className={cn("flex-1 mx-2 px-2 py-0.5 rounded text-[9px]", dark ? "bg-[#0E0C0A] text-white/30" : "bg-white text-[#8A8070]")}>
          🔒 bikinin.id/{ex.id}
        </div>
      </div>

      {/* Mini navbar */}
      <div className="flex items-center justify-between px-4 h-8 bg-white border-b border-[#EAE6D8]">
        <span className={cn("text-[11px] font-semibold", ex.colorText)}>{ex.preview.nav}</span>
        <div className="flex gap-3">
          {["Beranda","Layanan","Kontak"].map(l => (
            <span key={l} className="text-[8px] text-[#8A8070]">{l}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className={cn("px-4 py-4", ex.colorBgAlpha)}>
        <p className={cn("text-[13px] font-semibold leading-tight mb-1", ex.colorText)}>
          {ex.preview.hero}
        </p>
        <p className="text-[9px] text-[#8A8070] mb-3">{ex.preview.sub}</p>
        <button
          type="button"
          className={cn("px-3 py-1 rounded-full text-[9px] font-bold text-white cursor-default", ex.colorBg)}
        >
          {ex.preview.btn}
        </button>
      </div>

      {/* Items */}
      <div className="px-4 py-3 bg-white">
        <div className="grid grid-cols-3 gap-1.5">
          {ex.preview.items.map(item => (
            <div key={item} className="rounded-lg p-2 text-[8px] font-medium text-center text-[#5A5248] border border-[#EAE6D8]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    setDark(localStorage.getItem("bikinin-dark") === "true");
  }, []);

  const categories = ["Semua", ...Array.from(new Set(EXAMPLES.map(e => e.category)))];
  const filtered = filter === "Semua" ? EXAMPLES : EXAMPLES.filter(e => e.category === filter);

  return (
    <div className={cn("min-h-screen transition-colors duration-200", dark ? "bg-[#0E0C0A]" : "bg-white")}>
      {/* Navbar */}
      <header className={cn(
        "sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b backdrop-blur-sm",
        dark ? "bg-[#0E0C0A]/90 border-white/6" : "bg-white/90 border-[#EAE6D8]"
      )}>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
              dark ? "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20" : "border-[#E0D9CC] text-[#8A8070] hover:text-[#A87C4F] hover:border-[#A87C4F]/30"
            )}
          >
            <ArrowLeft size={13} /> Beranda
          </Link>
          <Logo size="md" theme={dark ? "dark" : "light"} />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = !dark;
              setDark(next);
              document.documentElement.classList.toggle("dark", next);
              localStorage.setItem("bikinin-dark", String(next));
            }}
            className={cn(
              "p-2 rounded-full transition-colors",
              dark ? "text-[#C9A47A] hover:bg-white/8" : "text-[#8A8070] hover:bg-[#F0EDE6]"
            )}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/dashboard" className="btn-primary px-5 py-2 text-[13px]">
            Buat Website
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-4">CONTOH WEBSITE</p>
          <h1 className={cn("section-heading text-[38px] lg:text-[50px] mb-4", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
            Inspirasi Website
            <br />
            untuk Bisnis Anda
          </h1>
          <p className={cn("text-[16px] max-w-md mx-auto", dark ? "text-[#6A6460]" : "text-[#5A5A5A]")}>
            Semua template ini bisa Anda buat sendiri dengan Bikinin — tanpa koding, dalam 5 menit.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[12px] font-medium transition-all border",
                filter === cat
                  ? "bg-[#A87C4F] text-white border-[#A87C4F]"
                  : dark
                    ? "border-white/10 text-white/50 hover:border-[#A87C4F]/40 hover:text-[#C9A47A]"
                    : "border-[#EAE6D8] text-[#5A5248] hover:border-[#A87C4F]/50 hover:text-[#A87C4F]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ex => (
            <div
              key={ex.id}
              className={cn(
                "group rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1",
                dark ? "bg-[#131110] border-white/6 hover:border-[#A87C4F]/30" : "bg-white border-[#EAE6D8] hover:border-[#A87C4F]/30 hover:shadow-lg"
              )}
            >
              {/* Preview */}
              <div className="p-4 pb-0">
                <WebsitePreview ex={ex} dark={dark} />
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={cn("text-[15px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                        {ex.name}
                      </h3>
                      {ex.tag && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A87C4F]/12 text-[#A87C4F]">
                          {ex.tag}
                        </span>
                      )}
                    </div>
                    <p className={cn("text-[11px]", dark ? "text-white/35" : "text-[#8A8070]")}>{ex.category}</p>
                  </div>
                  <ExternalLink size={14} className={cn("flex-none mt-0.5", dark ? "text-white/20" : "text-[#C0B8A8]")} />
                </div>

                <p className={cn("text-[12px] leading-relaxed mb-4", dark ? "text-[#6A6460]" : "text-[#5A5248]")}>
                  {ex.desc}
                </p>

                {/* Modules */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {ex.modules.map(m => (
                    <span key={m} className={cn(
                      "text-[9px] font-medium px-2 py-0.5 rounded-full border",
                      dark ? "border-white/8 text-white/35" : "border-[#EAE6D8] text-[#8A8070]"
                    )}>
                      {m}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/dashboard?template=${ex.id}`}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[12px] font-semibold transition-all",
                    "bg-[#A87C4F] text-white hover:bg-[#9A7045]"
                  )}
                >
                  Pakai Template Ini
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={cn(
          "mt-16 text-center rounded-2xl p-10 border",
          dark ? "bg-[#131110] border-white/6" : "bg-[#FBF7F2] border-[#EAE6D8]"
        )}>
          <p className="section-eyebrow mb-3">MULAI SEKARANG</p>
          <h2 className={cn("section-heading text-[28px] mb-3", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
            Tidak menemukan yang cocok?
          </h2>
          <p className={cn("text-[14px] mb-6 max-w-sm mx-auto", dark ? "text-[#6A6460]" : "text-[#5A5248]")}>
            Buat website custom sesuai keinginan Anda dengan editor drag & drop kami.
          </p>
          <Link href="/dashboard" className="btn-primary">
            Buat dari Nol
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
