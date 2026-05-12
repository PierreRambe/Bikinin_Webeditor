"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls, motion, AnimatePresence } from "framer-motion";
import {
  Eye, Send, Moon, Sun, GripVertical, Plus, Trash2, Wand2,
  Monitor, Smartphone, Settings2, Layers, X, Check, ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/* ─── Types ── */
type ModuleKey = "navbar" | "hero" | "gallery" | "about" | "contact" | "footer";
type PlanKey = "free" | "pro" | "enterprise";

const PLAN_META: Record<PlanKey, { label: string; color: string; limit: string; bg: string }> = {
  free:       { label: "GRATIS",      color: "#4CAF7D", limit: "10 fitur",      bg: "#4CAF7D15" },
  pro:        { label: "PRO",         color: "#A87C4F", limit: "50 fitur",      bg: "#A87C4F15" },
  enterprise: { label: "ENTERPRISE",  color: "#8B4513", limit: "Tak terbatas",  bg: "#8B451315" },
};

const PLAN_BADGE_CLASS: Record<PlanKey, string> = {
  free:       "text-[#4CAF7D] border-[#4CAF7D40] bg-[#4CAF7D15]",
  pro:        "text-[#A87C4F] border-[#A87C4F40] bg-[#A87C4F15]",
  enterprise: "text-[#8B4513] border-[#8B451340] bg-[#8B451315]",
};

interface Module {
  key: ModuleKey;
  label: string;
  icon: string;
  price: number;
  active: boolean;
}

/* ─── Constants ── */
const INITIAL_MODULES: Module[] = [
  { key: "navbar",  label: "Navbar",        icon: "≡", price: 0,       active: true  },
  { key: "hero",    label: "Hero Section",  icon: "◉", price: 0,       active: true  },
  { key: "gallery", label: "Galeri Produk", icon: "⊞", price: 250_000, active: true  },
  { key: "about",   label: "Tentang Kami",  icon: "ℹ", price: 150_000, active: false },
  { key: "contact", label: "Kontak",        icon: "✉", price: 200_000, active: true  },
  { key: "footer",  label: "Footer",        icon: "▭", price: 0,       active: false },
];

const STEPS = ["Pilih Modul", "Atur Konten", "Publikasi"] as const;
type ViewMode = "desktop" | "mobile";

interface DroppedAsset { id: string; label: string; icon: string; price: number }

const ASSET_CATEGORIES = [
  {
    group: "Foto & Media",
    items: [
      { label: "Hero Banner",    icon: "🖼",  price: 0,      desc: "Gambar besar di bagian atas" },
      { label: "Foto Produk",    icon: "📸",  price: 0,      desc: "Grid foto produk 2×2" },
      { label: "Pola Latar",     icon: "✦",   price: 0,      desc: "Background pattern dekoratif" },
      { label: "Video Embed",    icon: "▶",   price: 50_000, desc: "Embed YouTube/Vimeo" },
    ],
  },
  {
    group: "Teks & Layout",
    items: [
      { label: "Heading Besar",  icon: "T",   price: 0,      desc: "Judul section besar" },
      { label: "Paragraf",       icon: "¶",   price: 0,      desc: "Blok teks deskripsi" },
      { label: "Kartu Konten",   icon: "◻",   price: 0,      desc: "Card dengan ikon + teks" },
      { label: "Garis Pemisah",  icon: "─",   price: 0,      desc: "Divider dekoratif" },
    ],
  },
  {
    group: "Interaktif",
    items: [
      { label: "Tombol CTA",     icon: "⬛",  price: 0,      desc: "Call-to-action button" },
      { label: "Chat WhatsApp",  icon: "💬",  price: 25_000, desc: "Floating WA button" },
      { label: "Form Kontak",    icon: "📋",  price: 50_000, desc: "Form nama + email + pesan" },
      { label: "Newsletter",     icon: "📧",  price: 50_000, desc: "Form subscribe email" },
    ],
  },
  {
    group: "Produk & Toko",
    items: [
      { label: "Kartu Produk",   icon: "📦",  price: 50_000, desc: "Produk dengan harga & CTA" },
      { label: "Label Harga",    icon: "🏷",  price: 25_000, desc: "Badge diskon / harga khusus" },
      { label: "Rating Bintang", icon: "⭐",  price: 25_000, desc: "Review bintang 1–5" },
      { label: "Tombol Beli",    icon: "🛒",  price: 50_000, desc: "Add to cart / order sekarang" },
    ],
  },
  {
    group: "Social Proof",
    items: [
      { label: "Testimoni",      icon: "💬",  price: 25_000, desc: "Kartu review pelanggan" },
      { label: "Statistik",      icon: "📊",  price: 50_000, desc: "Angka pencapaian animasi" },
      { label: "Logo Klien",     icon: "🏆",  price: 25_000, desc: "Grid logo brand / mitra" },
      { label: "Peta Lokasi",    icon: "📍",  price: 50_000, desc: "Embed Google Maps" },
    ],
  },
] as const;

const ALL_MODULES: Module[] = [
  { key: "navbar",  label: "Navbar",        icon: "≡", price: 0,       active: false },
  { key: "hero",    label: "Hero Section",  icon: "◉", price: 0,       active: false },
  { key: "gallery", label: "Galeri Produk", icon: "⊞", price: 250_000, active: false },
  { key: "about",   label: "Tentang Kami",  icon: "ℹ", price: 150_000, active: false },
  { key: "contact", label: "Kontak",        icon: "✉", price: 200_000, active: false },
  { key: "footer",  label: "Footer",        icon: "▭", price: 0,       active: false },
];

/* ─── Default module content ── */
const DEFAULT_CONTENT: Record<ModuleKey, Record<string, string>> = {
  navbar:  { brandName: "Toko Saya" },
  hero:    { title: "Produk Terbaik Untuk Anda", subtitle: "Kualitas premium, harga terjangkau", btnText: "Lihat Produk" },
  gallery: { sectionTitle: "Produk Kami" },
  about:   { title: "Tentang Kami", body: "Kami adalah UMKM yang berkomitmen memberikan produk terbaik dengan pelayanan prima." },
  contact: { email: "hello@tokosaya.id", phone: "+62 812 3456 7890" },
  footer:  { copyright: "© 2025 Toko Saya · Powered by Bikinin" },
};

/* ─── Template configurations ── */
type TemplateData = {
  modules: Partial<Record<ModuleKey, boolean>>;
  content: Partial<Record<ModuleKey, Record<string, string>>>;
};

const TEMPLATE_DATA: Record<string, TemplateData> = {
  "toko-kopi": {
    modules: { navbar: true, hero: true, gallery: true, about: false, contact: true, footer: true },
    content: {
      navbar:  { brandName: "Kopi Nusantara" },
      hero:    { title: "Setiap Tegukan, Sebuah Cerita", subtitle: "Kopi pilihan dari penjuru Nusantara", btnText: "Reservasi Meja" },
      gallery: { sectionTitle: "Menu Kami" },
      contact: { email: "kopi@nusantara.id", phone: "+62 812 0000 0001" },
      footer:  { copyright: "© 2025 Kopi Nusantara · Powered by Bikinin" },
    },
  },
  "toko-fashion": {
    modules: { navbar: true, hero: true, gallery: true, about: true, contact: true, footer: false },
    content: {
      navbar:  { brandName: "Batik Lestari" },
      hero:    { title: "Koleksi Batik Modern", subtitle: "Warisan budaya untuk generasi kini", btnText: "Lihat Koleksi" },
      gallery: { sectionTitle: "Koleksi Batik" },
      about:   { title: "Tentang Kami", body: "Batik Lestari hadir membawa warisan budaya Indonesia ke era modern dengan sentuhan kontemporer." },
      contact: { email: "batik@lestari.id", phone: "+62 812 0000 0002" },
    },
  },
  "jasa-konsultan": {
    modules: { navbar: true, hero: true, gallery: false, about: true, contact: true, footer: false },
    content: {
      navbar:  { brandName: "Bima Consulting" },
      hero:    { title: "Solusi Bisnis Digital", subtitle: "Kami bantu bisnis Anda tumbuh secara digital", btnText: "Konsultasi Gratis" },
      about:   { title: "Layanan Kami", body: "Kami menyediakan layanan konsultasi bisnis digital komprehensif untuk membantu UMKM dan startup berkembang." },
      contact: { email: "info@bimaconsulting.id", phone: "+62 812 0000 0003" },
    },
  },
  "studio-foto": {
    modules: { navbar: true, hero: true, gallery: true, about: false, contact: true, footer: false },
    content: {
      navbar:  { brandName: "Lensa Studio" },
      hero:    { title: "Abadikan Momen Terbaik", subtitle: "Fotografer profesional untuk wedding, produk & event", btnText: "Lihat Portofolio" },
      gallery: { sectionTitle: "Portofolio Kami" },
      contact: { email: "studio@lensa.id", phone: "+62 812 0000 0004" },
    },
  },
  "klinik": {
    modules: { navbar: true, hero: true, gallery: false, about: true, contact: true, footer: false },
    content: {
      navbar:  { brandName: "Klinik Sehat" },
      hero:    { title: "Kesehatan Anda, Prioritas Kami", subtitle: "Layanan kesehatan terpercaya di kota Anda", btnText: "Buat Janji" },
      about:   { title: "Tentang Klinik", body: "Klinik Sehat hadir dengan dokter berpengalaman dan fasilitas modern untuk melayani kesehatan Anda." },
      contact: { email: "info@kliniksehat.id", phone: "+62 812 0000 0005" },
    },
  },
  "gym": {
    modules: { navbar: true, hero: true, gallery: false, about: true, contact: true, footer: false },
    content: {
      navbar:  { brandName: "FitLife Gym" },
      hero:    { title: "Mulai Perjalanan Sehatmu", subtitle: "Fasilitas lengkap, instruktur berpengalaman", btnText: "Coba 7 Hari Gratis" },
      about:   { title: "Mengapa FitLife?", body: "FitLife Gym menawarkan fasilitas gym lengkap dengan instruktur bersertifikat dan berbagai kelas kebugaran." },
      contact: { email: "info@fitlifegym.id", phone: "+62 812 0000 0006" },
    },
  },
};

const TEMPLATE_EXAMPLES = [
  { id: "toko-kopi",      name: "Kopi Nusantara",    category: "Kafe & Restoran",      colorBg: "bg-[#6B422618]", colorText: "text-[#6B4226]", colorDot: "bg-[#6B4226]", tag: "Populer",  preview: { hero: "Setiap Tegukan, Sebuah Cerita",   sub: "Kopi pilihan dari penjuru Nusantara"            } },
  { id: "toko-fashion",   name: "Batik Lestari",     category: "Fashion & Retail",     colorBg: "bg-[#8B451318]", colorText: "text-[#8B4513]", colorDot: "bg-[#8B4513]", tag: "Terlaris", preview: { hero: "Koleksi Batik Modern",             sub: "Warisan budaya untuk generasi kini"             } },
  { id: "jasa-konsultan", name: "Konsultan Digital", category: "Jasa & Profesional",   colorBg: "bg-[#2C3E5018]", colorText: "text-[#2C3E50]", colorDot: "bg-[#2C3E50]", tag: "Baru",     preview: { hero: "Solusi Bisnis Digital",            sub: "Kami bantu bisnis Anda tumbuh secara digital"  } },
  { id: "studio-foto",    name: "Lensa Studio",      category: "Fotografi & Kreatif",  colorBg: "bg-[#1A1A2E18]", colorText: "text-[#1A1A2E]", colorDot: "bg-[#1A1A2E]", tag: "",         preview: { hero: "Abadikan Momen Terbaik",          sub: "Fotografer profesional untuk wedding & event"  } },
  { id: "klinik",         name: "Klinik Sehat",      category: "Kesehatan & Medis",    colorBg: "bg-[#0D737718]", colorText: "text-[#0D7377]", colorDot: "bg-[#0D7377]", tag: "",         preview: { hero: "Kesehatan Anda, Prioritas Kami",  sub: "Layanan kesehatan terpercaya di kota Anda"     } },
  { id: "gym",            name: "FitLife Gym",        category: "Olahraga & Kebugaran", colorBg: "bg-[#1C1C1C18]", colorText: "text-[#1C1C1C]", colorDot: "bg-[#1C1C1C]", tag: "",         preview: { hero: "Mulai Perjalanan Sehatmu",        sub: "Fasilitas lengkap, instruktur berpengalaman"   } },
];

/* ─── Editable text helper ── */
function EditableText({
  value, field, isEditable, onSave, className, multiline = false,
}: {
  value: string;
  field: string;
  isEditable: boolean;
  onSave: (f: string, v: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  if (!isEditable) return <span className={className}>{value}</span>;
  const inputClass = cn(className, "bg-transparent outline-none ring-1 ring-[#A87C4F]/50 rounded-sm px-0.5 cursor-text");
  if (multiline) {
    return (
      <textarea
        aria-label={field}
        defaultValue={value}
        onBlur={e => onSave(field, e.target.value)}
        onClick={e => e.stopPropagation()}
        rows={2}
        className={cn(inputClass, "resize-none w-full block")}
      />
    );
  }
  return (
    <input
      aria-label={field}
      type="text"
      defaultValue={value}
      onBlur={e => onSave(field, e.target.value)}
      onClick={e => e.stopPropagation()}
      className={cn(inputClass, "w-full block min-w-0")}
    />
  );
}

/* ─── Draggable module row ── */
function ModuleRow({
  module,
  isSelected,
  dark,
  onSelect,
  onToggle,
}: {
  module: Module;
  isSelected: boolean;
  dark: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={module}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "module-item flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 select-none",
        isSelected && module.active
          ? dark
            ? "border-[#A87C4F]/50 bg-[#A87C4F]/10"
            : "border-[#A87C4F]/50 bg-[#FBF7F2]"
          : module.active
          ? dark
            ? "border-white/8 bg-white/3"
            : "border-[#EAE6D8] bg-[#FAF8F4]"
          : dark
          ? "border-white/5 bg-transparent hover:border-white/10"
          : "border-[#EAE6D8] bg-white hover:border-[#D0C8B8]"
      )}
      whileDrag={{
        scale: 1.02,
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,0.5)"
          : "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 50,
      }}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        type="button"
        className={cn(
          "flex-none cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors",
          dark
            ? "text-white/20 hover:text-white/50"
            : "text-[#C0B8A8] hover:text-[#8A8070]"
        )}
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
        }}
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      <span className="text-[14px] w-5 text-center text-[#A87C4F] pointer-events-none">
        {module.icon}
      </span>

      <span
        className={cn(
          "flex-1 text-[12px] font-medium pointer-events-none",
          dark ? "text-[#F0EDE8]" : "text-[#2A2520]",
          !module.active && (dark ? "opacity-40" : "opacity-50")
        )}
      >
        {module.label}
      </span>

      {module.price > 0 && (
        <span className={cn("text-[10px] pointer-events-none", dark ? "text-white/25" : "text-[#B0A898]")}>
          +{(module.price / 1_000).toFixed(0)}k
        </span>
      )}

      {/* Toggle */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cn(
          "w-8 h-[18px] rounded-full relative transition-all duration-200 flex-none",
          module.active ? "bg-[#A87C4F]" : dark ? "bg-white/10" : "bg-[#DDD8CC]"
        )}
        aria-label={`${module.active ? "Nonaktifkan" : "Aktifkan"} ${module.label}`}
      >
        <span
          className={cn(
            "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-200",
            module.active ? "left-[16px]" : "left-[2px]"
          )}
        />
      </button>
    </Reorder.Item>
  );
}

/* ─── Module preview blocks ── */
function ModulePreview({
  moduleKey, isSelected, dark, label, content, onContentChange,
}: {
  moduleKey: ModuleKey;
  isSelected: boolean;
  dark: boolean;
  label: string;
  content: Record<string, string>;
  onContentChange: (field: string, value: string) => void;
}) {
  const ring = isSelected ? "ring-1 ring-[#A87C4F] ring-inset" : "";
  const label_tag = isSelected && (
    <span className="absolute top-0 left-0 text-[8px] bg-[#A87C4F] text-white px-2 py-0.5 rounded-br-lg z-10">
      {label} · <span className="opacity-75">klik teks untuk edit</span>
    </span>
  );

  if (moduleKey === "navbar") return (
    <div className={cn("flex items-center justify-between px-5 h-10 border-b relative", dark ? "bg-[#131110] border-white/6" : "bg-white border-[#EAE6D8]", ring)}>
      {label_tag}
      <EditableText
        value={content.brandName ?? "Toko Saya"}
        field="brandName"
        isEditable={isSelected}
        onSave={onContentChange}
        className="text-[13px] font-serif-display text-[#A87C4F]"
      />
      <div className="flex gap-4">
        {["Produk","Tentang","Kontak"].map(l => (
          <span key={l} className={cn("text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>{l}</span>
        ))}
      </div>
    </div>
  );

  if (moduleKey === "hero") return (
    <div className={cn("px-5 py-7 relative", dark ? "bg-[#1A1612]" : "bg-[#F8F4EC]", ring)}>
      {label_tag}
      <EditableText
        value={content.title ?? "Produk Terbaik Untuk Anda"}
        field="title"
        isEditable={isSelected}
        onSave={onContentChange}
        className={cn("text-[16px] font-serif-display mb-1 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}
      />
      <EditableText
        value={content.subtitle ?? "Kualitas premium, harga terjangkau"}
        field="subtitle"
        isEditable={isSelected}
        onSave={onContentChange}
        className={cn("text-[10px] mb-4 block", dark ? "text-white/35" : "text-[#8A8070]")}
      />
      <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-semibold", dark ? "bg-[#F0EDE8] text-[#1C1C1C]" : "bg-[#A87C4F] text-white")}>
        <EditableText
          value={content.btnText ?? "Lihat Produk"}
          field="btnText"
          isEditable={isSelected}
          onSave={onContentChange}
        />
      </span>
    </div>
  );

  if (moduleKey === "gallery") return (
    <div className={cn("p-4 relative", ring)}>
      {label_tag}
      <EditableText
        value={content.sectionTitle ?? "Produk Kami"}
        field="sectionTitle"
        isEditable={isSelected}
        onSave={onContentChange}
        className={cn("text-[10px] font-semibold uppercase tracking-wider mb-3 block", dark ? "text-white/30" : "text-[#8A8070]")}
      />
      <div className="grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className={cn("rounded-lg overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]", dark ? "bg-[#1A1612]" : "bg-white")}>
            <div className={cn("h-11", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")} />
            <div className="p-1.5">
              <p className={cn("text-[9px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Produk {i}</p>
              <p className="text-[9px] font-bold text-[#A87C4F]">Rp {i * 175}.000</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (moduleKey === "about") return (
    <div className={cn("px-5 py-5 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
      {label_tag}
      <EditableText
        value={content.title ?? "Tentang Kami"}
        field="title"
        isEditable={isSelected}
        onSave={onContentChange}
        className={cn("text-[13px] font-serif-display mb-1.5 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}
      />
      <EditableText
        value={content.body ?? "Kami adalah UMKM yang berkomitmen memberikan produk terbaik dengan pelayanan prima."}
        field="body"
        isEditable={isSelected}
        onSave={onContentChange}
        multiline
        className={cn("text-[10px] leading-relaxed block", dark ? "text-white/35" : "text-[#8A8070]")}
      />
    </div>
  );

  if (moduleKey === "contact") return (
    <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
      {label_tag}
      <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2", dark ? "text-white/30" : "text-[#8A8070]")}>Hubungi Kami</p>
      <div className="flex flex-wrap gap-4">
        <span className={cn("text-[10px] flex items-center gap-1", dark ? "text-white/35" : "text-[#5A5248]")}>
          ✉{" "}
          <EditableText
            value={content.email ?? "hello@tokosaya.id"}
            field="email"
            isEditable={isSelected}
            onSave={onContentChange}
            className={cn("text-[10px]", dark ? "text-white/35" : "text-[#5A5248]")}
          />
        </span>
        <span className={cn("text-[10px] flex items-center gap-1", dark ? "text-white/35" : "text-[#5A5248]")}>
          📱{" "}
          <EditableText
            value={content.phone ?? "+62 812 3456 7890"}
            field="phone"
            isEditable={isSelected}
            onSave={onContentChange}
            className={cn("text-[10px]", dark ? "text-white/35" : "text-[#5A5248]")}
          />
        </span>
      </div>
    </div>
  );

  if (moduleKey === "footer") return (
    <div className={cn("px-5 py-3.5 border-t relative", dark ? "border-white/6 bg-[#0A0907]" : "border-[#EAE6D8] bg-[#1C1C1C]", ring)}>
      {label_tag}
      <EditableText
        value={content.copyright ?? "© 2025 Toko Saya · Powered by Bikinin"}
        field="copyright"
        isEditable={isSelected}
        onSave={onContentChange}
        className="text-[10px] text-white/30"
      />
    </div>
  );

  return null;
}

/* ─── Asset visual previews ── */
function AssetPreview({ label, dark }: { label: string; dark: boolean }) {
  if (label === "Hero Banner") return (
    <div className={cn("relative overflow-hidden h-[110px]", dark ? "bg-gradient-to-br from-[#231F1A] to-[#1A1612]" : "bg-gradient-to-br from-[#FBF7F2] to-[#F0EDE6]")}>
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div>
          <p className={cn("text-[9px] font-bold uppercase tracking-widest mb-1", dark ? "text-[#A87C4F]/60" : "text-[#A87C4F]/70")}>BANNER UTAMA</p>
          <p className={cn("text-[14px] font-semibold mb-0.5", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Gambar Hero Full-Width</p>
          <p className={cn("text-[9px]", dark ? "text-white/30" : "text-[#8A8070]")}>Upload gambar 1920 × 600 px</p>
        </div>
        <div className={cn("w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center", dark ? "border-white/15" : "border-[#D0C8B8]")}>
          <span className="text-[24px]">🖼</span>
        </div>
      </div>
    </div>
  );

  if (label === "Foto Produk") return (
    <div className={cn("p-4", dark ? "bg-[#0E0C0A]" : "bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-2.5", dark ? "text-white/25" : "text-[#8A8070]")}>GALERI FOTO PRODUK</p>
      <div className="grid grid-cols-3 gap-2">
        {["📸","🖼","📷","🎨","🖌","📸"].map((emoji, i) => (
          <div key={i} className={cn("aspect-square rounded-lg flex items-center justify-center text-[18px]", dark ? "bg-[#1A1612]" : "bg-[#F0EDE6]")}>{emoji}</div>
        ))}
      </div>
    </div>
  );

  if (label === "Pola Latar") return (
    <div className={cn("h-16 relative overflow-hidden", dark ? "bg-[#0A0907]" : "bg-[#F8F4EC]")}>
      <div className={cn("absolute inset-0 [background-size:14px_14px]", dark ? "[background-image:radial-gradient(circle,_rgba(168,124,79,0.2)_1px,_transparent_1px)]" : "[background-image:radial-gradient(circle,_rgba(168,124,79,0.12)_1px,_transparent_1px)]")} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-[11px] font-medium px-3 py-1 rounded-full border", dark ? "border-white/10 text-white/30 bg-[#0A0907]/60" : "border-[#D0C8B8] text-[#8A8070] bg-white/60")}>Pola Latar Dekoratif</span>
      </div>
    </div>
  );

  if (label === "Video Embed") return (
    <div className={cn("p-4", dark ? "bg-[#131110]" : "bg-white")}>
      <div className={cn("rounded-xl overflow-hidden relative flex items-center justify-center h-[80px]", dark ? "bg-[#1A1612]" : "bg-[#F0EDE6]")}>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", dark ? "bg-[#A87C4F]/20 border-[#A87C4F]/30" : "bg-[#A87C4F]/15 border-[#A87C4F]/25")}>
          <span className="text-[16px] ml-0.5">▶</span>
        </div>
        <div className="absolute bottom-2 left-3 right-3 h-1 rounded-full bg-white/10">
          <div className="w-1/3 h-full rounded-full bg-[#A87C4F]/60" />
        </div>
        <p className="absolute top-2 right-3 text-[8px] text-white/40">0:00 / 3:24</p>
      </div>
      <p className={cn("text-[9px] mt-2", dark ? "text-white/25" : "text-[#C0B8A8]")}>YouTube / Vimeo embed</p>
    </div>
  );

  if (label === "Heading Besar") return (
    <div className={cn("px-5 py-5 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-2", dark ? "text-[#A87C4F]/50" : "text-[#A87C4F]/60")}>JUDUL SECTION</p>
      <p className={cn("text-[22px] font-serif-display leading-tight mb-1", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Judul Halaman Utama</p>
      <p className={cn("text-[11px]", dark ? "text-white/30" : "text-[#8A8070]")}>Subtitle atau tagline singkat</p>
    </div>
  );

  if (label === "Paragraf") return (
    <div className={cn("px-5 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className="space-y-1.5">
        {(["w-full", "w-[92%]", "w-[96%]", "w-[68%]"] as const).map((wClass, i) => (
          <div key={i} className={cn("h-2 rounded-full", dark ? "bg-white/8" : "bg-[#E8E4D8]", wClass)} />
        ))}
      </div>
      <p className={cn("text-[9px] mt-2.5", dark ? "text-white/20" : "text-[#C0B8A8]")}>Teks deskripsi produk / layanan Anda</p>
    </div>
  );

  if (label === "Kartu Konten") return (
    <div className={cn("p-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className="grid grid-cols-3 gap-2">
        {[{icon:"⚡",title:"Cepat"},{icon:"🎨",title:"Indah"},{icon:"🔒",title:"Aman"}].map(card => (
          <div key={card.title} className={cn("rounded-xl p-3 text-center border", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <span className="text-[18px] block mb-1.5">{card.icon}</span>
            <p className={cn("text-[10px] font-semibold mb-1", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>{card.title}</p>
            <div className={cn("h-1 rounded-full mb-1", dark ? "bg-white/8" : "bg-[#E8E4D8]")} />
            <div className={cn("w-3/4 h-1 rounded-full mx-auto", dark ? "bg-white/5" : "bg-[#E8E4D8]")} />
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Garis Pemisah") return (
    <div className={cn("px-5 py-4 border-t flex items-center gap-3", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className={cn("flex-1 h-px", dark ? "bg-white/8" : "bg-[#EAE6D8]")} />
      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center flex-none", dark ? "border-white/12" : "border-[#D0C8B8]")}>
        <div className={cn("w-2 h-2 rounded-full", dark ? "bg-white/15" : "bg-[#C0B8A8]")} />
      </div>
      <div className={cn("flex-1 h-px", dark ? "bg-white/8" : "bg-[#EAE6D8]")} />
    </div>
  );

  if (label === "Tombol CTA") return (
    <div className={cn("px-5 py-5 border-t flex flex-wrap items-center justify-center gap-3", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <button type="button" className="px-6 py-2.5 rounded-full text-[12px] font-semibold bg-[#A87C4F] text-white cursor-default shadow-sm">Mulai Sekarang</button>
      <button type="button" className={cn("px-6 py-2.5 rounded-full text-[12px] font-semibold border cursor-default", dark ? "border-white/12 text-white/55" : "border-[#DDD8CC] text-[#5A5248]")}>Pelajari Lebih</button>
    </div>
  );

  if (label === "Chat WhatsApp") return (
    <div className={cn("px-4 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] mb-3", dark ? "text-white/25" : "text-[#C0B8A8]")}>Floating button · posisi kanan bawah halaman</p>
      <div className="flex justify-end">
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white cursor-default shadow-lg text-[12px] font-semibold">
          <span>💬</span> Chat WhatsApp
        </button>
      </div>
    </div>
  );

  if (label === "Form Kontak") return (
    <div className={cn("px-4 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[11px] font-semibold mb-3", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Hubungi Kami</p>
      <div className="space-y-2">
        {["Nama Lengkap", "Email Anda", "Pesan Anda"].map((ph, i) => (
          <div key={ph} className={cn("rounded-lg border px-3 flex items-center", i === 2 ? "h-12" : "h-7", dark ? "border-white/8 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <p className={cn("text-[9px]", dark ? "text-white/20" : "text-[#C0B8A8]")}>{ph}</p>
          </div>
        ))}
        <button type="button" className="w-full py-2 rounded-lg bg-[#A87C4F] text-white text-[11px] font-semibold cursor-default">Kirim Pesan →</button>
      </div>
    </div>
  );

  if (label === "Newsletter") return (
    <div className={cn("px-4 py-5 border-t text-center", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FBF7F2]")}>
      <p className={cn("text-[12px] font-semibold mb-1", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Dapatkan Update & Promo</p>
      <p className={cn("text-[9px] mb-3", dark ? "text-white/30" : "text-[#8A8070]")}>Daftar newsletter — gratis!</p>
      <div className="flex gap-2">
        <div className={cn("flex-1 h-8 rounded-lg border flex items-center px-3", dark ? "border-white/8 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
          <p className={cn("text-[9px]", dark ? "text-white/20" : "text-[#C0B8A8]")}>Email Anda...</p>
        </div>
        <button type="button" className="px-4 h-8 rounded-lg bg-[#A87C4F] text-white text-[9px] font-bold cursor-default">Daftar</button>
      </div>
    </div>
  );

  if (label === "Kartu Produk") return (
    <div className={cn("p-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3", dark ? "text-white/25" : "text-[#8A8070]")}>PRODUK PILIHAN</p>
      <div className="grid grid-cols-2 gap-3">
        {[{name:"Produk A",price:"Rp 175.000"},{name:"Produk B",price:"Rp 225.000"}].map(p => (
          <div key={p.name} className={cn("rounded-xl border overflow-hidden", dark ? "border-white/8 bg-[#1A1612]" : "border-[#EAE6D8]")}>
            <div className={cn("h-14 flex items-center justify-center text-[24px]", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")}>📦</div>
            <div className="p-2.5">
              <p className={cn("text-[11px] font-semibold mb-0.5", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>{p.name}</p>
              <p className="text-[11px] font-bold text-[#A87C4F] mb-2">{p.price}</p>
              <button type="button" className="w-full py-1 rounded-lg bg-[#A87C4F] text-white text-[9px] font-semibold cursor-default">Beli</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Label Harga") return (
    <div className={cn("px-5 py-4 border-t flex items-center gap-4", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div>
        <p className={cn("text-[9px] line-through mb-0.5", dark ? "text-white/25" : "text-[#C0B8A8]")}>Rp 300.000</p>
        <p className="text-[20px] font-bold text-[#A87C4F]">Rp 175.000</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold inline-block mt-1">HEMAT 42%</span>
      </div>
      <div className={cn("flex-1 rounded-xl border p-3", dark ? "border-[#A87C4F]/20 bg-[#A87C4F]/8" : "border-[#A87C4F]/20 bg-[#FBF7F2]")}>
        <p className="text-[8px] font-bold text-[#A87C4F] mb-0.5">HARGA SPESIAL</p>
        <p className={cn("text-[9px]", dark ? "text-[#C9A47A]/60" : "text-[#A87C4F]/70")}>Berlaku s/d akhir bulan</p>
      </div>
    </div>
  );

  if (label === "Rating Bintang") return (
    <div className={cn("px-5 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => <span key={i} className={i <= 4 ? "text-yellow-400 text-[15px]" : "text-[#D0C8B8] text-[15px]"}>★</span>)}
        </div>
        <span className={cn("text-[13px] font-bold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>4.8</span>
        <span className={cn("text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>(128 ulasan)</span>
      </div>
      <div className="space-y-1">
        {[{stars:5,pct:78,wClass:"w-[78%]"},{stars:4,pct:15,wClass:"w-[15%]"},{stars:3,pct:7,wClass:"w-[7%]"}].map(r => (
          <div key={r.stars} className="flex items-center gap-2">
            <span className={cn("text-[9px] w-6 text-right", dark ? "text-white/25" : "text-[#8A8070]")}>{r.stars}★</span>
            <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", dark ? "bg-white/8" : "bg-[#E8E4D8]")}>
              <div className={cn("h-full rounded-full bg-yellow-400", r.wClass)} />
            </div>
            <span className={cn("text-[9px] w-6", dark ? "text-white/25" : "text-[#8A8070]")}>{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Tombol Beli") return (
    <div className={cn("px-5 py-4 border-t flex items-center gap-3", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <button type="button" className="flex-1 py-2.5 rounded-xl bg-[#A87C4F] text-white text-[12px] font-semibold flex items-center justify-center gap-2 cursor-default">
        <span>🛒</span> Beli Sekarang
      </button>
      <button type="button" className={cn("px-4 py-2.5 rounded-xl border text-[12px] font-medium cursor-default", dark ? "border-white/10 text-white/50" : "border-[#DDD8CC] text-[#5A5248]")}>
        + Keranjang
      </button>
    </div>
  );

  if (label === "Testimoni") return (
    <div className={cn("p-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3", dark ? "text-white/25" : "text-[#8A8070]")}>APA KATA PELANGGAN</p>
      <div className="grid grid-cols-2 gap-2">
        {[{name:"Budi S.",text:"Produk sangat berkualitas!",stars:5},{name:"Sari A.",text:"Pengiriman cepat, recommended.",stars:4}].map(t => (
          <div key={t.name} className={cn("rounded-xl p-3 border", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <div className="flex gap-0.5 mb-1.5">
              {[1,2,3,4,5].map(i => <span key={i} className={i <= t.stars ? "text-yellow-400 text-[10px]" : "text-[#D0C8B8] text-[10px]"}>★</span>)}
            </div>
            <p className={cn("text-[9px] mb-2 leading-relaxed", dark ? "text-white/45" : "text-[#5A5248]")}>{t.text}</p>
            <p className={cn("text-[9px] font-semibold", dark ? "text-[#C9A47A]" : "text-[#A87C4F]")}>{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Statistik") return (
    <div className={cn("px-4 py-5 border-t", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FBF7F2]")}>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[{num:"1.2k+",label:"Pelanggan"},{num:"98%",label:"Puas"},{num:"4.9★",label:"Rating"}].map(s => (
          <div key={s.label}>
            <p className={cn("text-[18px] font-bold", dark ? "text-[#C9A47A]" : "text-[#A87C4F]")}>{s.num}</p>
            <p className={cn("text-[9px]", dark ? "text-white/30" : "text-[#8A8070]")}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Logo Klien") return (
    <div className={cn("px-4 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3 text-center", dark ? "text-white/25" : "text-[#8A8070]")}>DIPERCAYA OLEH</p>
      <div className="grid grid-cols-4 gap-2">
        {["Brand A","Mitra B","Klien C","Brand D"].map(b => (
          <div key={b} className={cn("rounded-lg border flex items-center justify-center h-9", dark ? "border-white/8 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <p className={cn("text-[8px] font-semibold", dark ? "text-white/25" : "text-[#C0B8A8]")}>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Peta Lokasi") return (
    <div className={cn("px-4 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className={cn("rounded-xl overflow-hidden relative border h-[90px]", dark ? "border-white/8" : "border-[#EAE6D8]")}>
        <div className={cn("absolute inset-0", dark ? "bg-[#1A2030]" : "bg-[#E8F0DC]")}>
          <div className="absolute inset-0 opacity-30">
            <div className={cn("absolute h-px w-full top-1/2", dark ? "bg-white/20" : "bg-[#C0C8A8]")} />
            <div className={cn("absolute w-px h-full left-1/3", dark ? "bg-white/10" : "bg-[#C0C8A8]")} />
            <div className={cn("absolute w-px h-full left-2/3", dark ? "bg-white/10" : "bg-[#C0C8A8]")} />
            <div className={cn("absolute h-px w-full top-1/4", dark ? "bg-white/6" : "bg-[#C0C8A8]/50")} />
            <div className={cn("absolute h-px w-full top-3/4", dark ? "bg-white/6" : "bg-[#C0C8A8]/50")} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#A87C4F] flex items-center justify-center text-white text-[14px] shadow-lg">📍</div>
              <div className="w-0.5 h-2 bg-[#A87C4F]" />
              <div className="w-1.5 h-0.5 rounded-full bg-[#A87C4F]/50" />
            </div>
          </div>
        </div>
        <p className={cn("absolute bottom-1.5 left-3 text-[8px] font-medium", dark ? "text-white/30" : "text-[#5A5248]/60")}>Lokasi Toko · Google Maps</p>
      </div>
    </div>
  );

  return (
    <div className={cn("px-5 py-4 border-t flex items-center gap-3", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <span className="text-[20px]">📦</span>
      <p className={cn("text-[12px] font-medium", dark ? "text-[#F0EDE8]/80" : "text-[#2A2520]")}>{label}</p>
    </div>
  );
}

/* ─── Main page ── */
export default function DashboardPage() {
  const router = useRouter();

  const [modules, setModules]             = useState<Module[]>(INITIAL_MODULES);
  const [dark, setDark]                   = useState(false);
  const [plan, setPlan]                   = useState<PlanKey>("free");
  const [isSubscribed, setIsSubscribed]   = useState(false);
  const [currentStep, setCurrentStep]     = useState(0);
  const [selected, setSelected]           = useState<ModuleKey | null>("hero");
  const [viewMode, setViewMode]           = useState<ViewMode>("desktop");
  const [activeTab, setActiveTab]         = useState<"modules" | "assets" | "templates">("modules");
  const [showAddModal, setShowAddModal]   = useState(false);
  const [droppedAssets, setDroppedAssets] = useState<DroppedAsset[]>([]);
  const [draggedAsset, setDraggedAsset]   = useState<DroppedAsset | null>(null);
  const [moduleContent, setModuleContent] = useState<Record<ModuleKey, Record<string, string>>>(
    { ...DEFAULT_CONTENT }
  );
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bikinin-dark") === "true";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);

    const p = localStorage.getItem("bikinin-plan") as PlanKey | null;
    if (p && ["free", "pro", "enterprise"].includes(p)) {
      setPlan(p);
      if (p === "pro" || p === "enterprise") setIsSubscribed(true);
    }

    // Apply template from URL if present
    const templateId = new URLSearchParams(window.location.search).get("template");
    if (templateId && TEMPLATE_DATA[templateId]) {
      const tmpl = TEMPLATE_DATA[templateId];
      setModules(INITIAL_MODULES.map(m => ({
        ...m,
        active: tmpl.modules[m.key] !== undefined ? (tmpl.modules[m.key] as boolean) : m.active,
      })));
      if (tmpl.content) {
        setModuleContent(prev => {
          const next = { ...prev };
          for (const [key, val] of Object.entries(tmpl.content)) {
            next[key as ModuleKey] = { ...prev[key as ModuleKey], ...val };
          }
          return next;
        });
      }
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bikinin-dark", String(next));
  };

  const toggleModule = (key: ModuleKey) =>
    setModules(prev => prev.map(m => m.key === key ? { ...m, active: !m.active } : m));

  const removeAsset = (id: string) =>
    setDroppedAssets(prev => prev.filter(a => a.id !== id));

  const handleModuleContentChange = (moduleKey: ModuleKey, field: string, value: string) => {
    setModuleContent(prev => ({
      ...prev,
      [moduleKey]: { ...prev[moduleKey], [field]: value },
    }));
  };

  const applyTemplate = (templateId: string) => {
    if (!TEMPLATE_DATA[templateId]) return;
    const tmpl = TEMPLATE_DATA[templateId];
    setModules(INITIAL_MODULES.map(m => ({
      ...m,
      active: tmpl.modules[m.key] !== undefined ? (tmpl.modules[m.key] as boolean) : m.active,
    })));
    if (tmpl.content) {
      setModuleContent(prev => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(tmpl.content)) {
          next[key as ModuleKey] = { ...prev[key as ModuleKey], ...val };
        }
        return next;
      });
    }
    setActiveTab("modules");
  };

  // Add-on cost only — subscription price is handled in payment page
  const addOnPrice =
    modules.filter(m => m.active && m.price > 0).reduce((a, m) => a + m.price, 0) +
    droppedAssets.filter(a => a.price > 0).reduce((a, x) => a + x.price, 0);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${Math.min((addOnPrice / 1_500_000) * 100, 100)}%`;
    }
  }, [addOnPrice]);

  const activeModules = modules.filter(m => m.active);

  const handlePublish = () => {
    const extras = [
      ...modules.filter(m => m.active && m.price > 0).map(m => ({ label: m.label, amount: m.price })),
      ...droppedAssets.filter(a => a.price > 0).map(a => ({ label: a.label, amount: a.price })),
    ];
    sessionStorage.setItem("bikinin-extras", JSON.stringify(extras));
  };

  const onPublishClick = () => {
    setCurrentStep(2);
    handlePublish();
    if (isSubscribed && addOnPrice === 0) {
      // Already subscribed, no extras — publish directly without re-payment
      sessionStorage.setItem("payment-method", "Langganan Aktif");
      sessionStorage.setItem("payment-total", "0");
      router.push("/success");
    } else {
      const subscribedParam = isSubscribed ? "&subscribed=1" : "";
      router.push(`/payment?plan=${plan}${subscribedParam}`);
    }
  };

  return (
    <div className={cn("h-screen flex flex-col overflow-hidden", dark ? "bg-[#0A0907]" : "bg-[#EDEBE4]")}>

      {/* ─── TOP BAR ─── */}
      <header className={cn(
        "flex-none h-14 grid grid-cols-[1fr_auto_1fr] items-center px-5 border-b z-20",
        dark ? "bg-[#131110] border-white/6" : "bg-white border-[#E0D9CC]"
      )}>

        {/* ── Left: Logo + Plan + Back ── */}
        <div className="flex items-center gap-2.5">
          <Logo theme={dark ? "dark" : "light"} size="sm" />

          <div className={cn("w-px h-4", dark ? "bg-white/10" : "bg-[#E0D9CC]")} />

          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border",
            PLAN_BADGE_CLASS[plan]
          )}>
            {PLAN_META[plan].label}
          </span>

          {currentStep === 0 ? (
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                dark
                  ? "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  : "border-[#E0D9CC] text-[#8A8070] hover:text-[#A87C4F] hover:border-[#A87C4F]/30"
              )}
            >
              <ArrowLeft size={11} /> Beranda
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s - 1)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                dark
                  ? "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  : "border-[#E0D9CC] text-[#8A8070] hover:text-[#A87C4F] hover:border-[#A87C4F]/30"
              )}
            >
              <ArrowLeft size={11} /> Kembali
            </button>
          )}
        </div>

        {/* ── Center: Step indicator ── */}
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(i)}
              className="flex items-center gap-2"
            >
              {/* Step circle */}
              <motion.div
                animate={{
                  backgroundColor: i === currentStep ? "#A87C4F" : "transparent",
                  color: i === currentStep ? "#fff" : dark ? "rgba(255,255,255,0.30)" : "#B0A898",
                }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border flex-none",
                  i === currentStep
                    ? "border-[#A87C4F]"
                    : i < currentStep
                    ? "border-[#A87C4F]"
                    : dark ? "border-white/15" : "border-[#DDD8CC]"
                )}
              >
                {i < currentStep ? <Check size={9} /> : i + 1}
              </motion.div>

              {/* Step label */}
              <span className={cn(
                "text-[12px] font-medium whitespace-nowrap transition-colors duration-200",
                i === currentStep
                  ? (dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")
                  : i < currentStep
                  ? "text-[#A87C4F]"
                  : (dark ? "text-white/30" : "text-[#C0B8A8]")
              )}>
                {step}
              </span>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: i < currentStep ? "#A87C4F" : dark ? "rgba(255,255,255,0.12)" : "#E0D9CC",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-px mx-1"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center justify-end gap-2">
          {/* View mode toggle */}
          <div className={cn(
            "flex items-center rounded-lg p-0.5",
            dark ? "bg-white/6" : "bg-[#F0EDE6]"
          )}>
            {([["desktop", <Monitor key="m" size={13} />], ["mobile", <Smartphone key="s" size={13} />]] as const).map(([mode, icon]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === mode
                    ? dark ? "bg-[#231F1A] text-[#F0EDE8]" : "bg-white text-[#1C1C1C] shadow-sm"
                    : dark ? "text-white/30 hover:text-white/60" : "text-[#8A8070] hover:text-[#4A4540]"
                )}
                aria-label={mode}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className={cn("w-px h-5", dark ? "bg-white/10" : "bg-[#E0D9CC]")} />

          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all",
              dark
                ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                : "border-[#E0D9CC] text-[#5A5248] hover:border-[#A87C4F]/40 bg-white"
            )}
          >
            <Eye size={12} /> Preview
          </button>

          <button
            type="button"
            onClick={onPublishClick}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all",
              dark
                ? "bg-[#F0EDE8] text-[#1C1C1C] hover:bg-white"
                : "bg-[#A87C4F] text-white hover:bg-[#9A7045] publish-btn-shadow"
            )}
          >
            <Send size={11} /> Publikasikan
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className={cn(
          "w-[264px] flex-none flex flex-col border-r overflow-hidden",
          dark ? "bg-[#131110] border-white/6" : "bg-white border-[#E0D9CC]"
        )}>
          {/* Tabs */}
          <div className={cn("flex border-b", dark ? "border-white/6" : "border-[#E0D9CC]")}>
            {([["modules", <Layers key="l" size={12} />, "Modul"], ["assets", <Settings2 key="s" size={12} />, "Aset"], ["templates", <Wand2 key="t" size={12} />, "Template"]] as const).map(([tab, icon, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold border-b-2 transition-all",
                  activeTab === tab
                    ? "border-[#A87C4F] text-[#A87C4F]"
                    : dark ? "border-transparent text-white/30 hover:text-white/50" : "border-transparent text-[#8A8070] hover:text-[#4A4540]"
                )}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {activeTab === "modules" && (
            <>
              {/* Module list header */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#A87C4F] mb-0.5">
                  MODUL WEBSITE
                </p>
                <p className={cn("text-[10px]", dark ? "text-white/30" : "text-[#A0998A]")}>
                  Seret untuk urut ulang · toggle aktifkan
                </p>
              </div>

              {/* Draggable module list */}
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <Reorder.Group
                  axis="y"
                  values={modules}
                  onReorder={setModules}
                  className="flex flex-col gap-1.5"
                >
                  {modules.map(m => (
                    <ModuleRow
                      key={m.key}
                      module={m}
                      isSelected={selected === m.key}
                      dark={dark}
                      onSelect={() => setSelected(m.key)}
                      onToggle={() => toggleModule(m.key)}
                    />
                  ))}
                </Reorder.Group>

                {/* Add module button */}
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className={cn(
                    "w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed text-[11px] font-medium transition-all",
                    dark
                      ? "border-white/10 text-white/25 hover:border-[#A87C4F]/40 hover:text-[#A87C4F]"
                      : "border-[#DDD8CC] text-[#B0A898] hover:border-[#A87C4F]/50 hover:text-[#A87C4F]"
                  )}
                >
                  <Plus size={12} /> Tambah Modul
                </button>
              </div>

              {/* Cost estimator */}
              <div className="px-3 pb-3">
                <div className={cn(
                  "rounded-xl p-4 border",
                  dark ? "bg-[#A87C4F]/8 border-[#A87C4F]/20" : "bg-[#FBF7F2] border-[#E8DFD0]"
                )}>
                  <p className={cn("text-[10px] font-bold tracking-[0.14em] uppercase mb-1", dark ? "text-white/30" : "text-[#8A8070]")}>
                    ADD-ON BIAYA
                  </p>
                  <p className={cn("text-[22px] leading-tight font-serif-display mb-0.5", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                    {addOnPrice === 0 ? "Gratis" : `Rp ${addOnPrice.toLocaleString("id-ID")}`}
                  </p>
                  <p className={cn("text-[9px] mb-2", dark ? "text-white/25" : "text-[#B0A898]")}>
                    di luar biaya berlangganan
                  </p>
                  <div className={cn("w-full h-1 rounded-full mb-2", dark ? "bg-white/8" : "bg-[#E8DFD0]")}>
                    <div
                      ref={progressRef}
                      className="h-full rounded-full bg-[#A87C4F] transition-all duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                    <p className={cn("text-[10px]", dark ? "text-white/28" : "text-[#8A8070]")}>
                      {activeModules.length} modul · {droppedAssets.length} aset
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "assets" && (
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <p className={cn("text-[10px] font-bold tracking-[0.16em] uppercase mb-3 pt-4 px-1", dark ? "text-white/30" : "text-[#8A8070]")}>
                SERET KE CANVAS
              </p>
              {ASSET_CATEGORIES.map(cat => (
                <div key={cat.group} className="mb-4">
                  <p className={cn("text-[9px] font-bold tracking-[0.14em] uppercase px-1 mb-1.5", dark ? "text-[#A87C4F]/60" : "text-[#A87C4F]/70")}>
                    {cat.group}
                  </p>
                  <div className="flex flex-col gap-1">
                    {cat.items.map(asset => (
                      <div
                        key={asset.label}
                        draggable
                        onDragStart={() => setDraggedAsset({ id: crypto.randomUUID(), label: asset.label, icon: asset.icon, price: asset.price })}
                        onDragEnd={() => setDraggedAsset(null)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all select-none",
                          dark
                            ? "border-white/6 bg-white/2 hover:border-[#A87C4F]/40 hover:bg-[#A87C4F]/8"
                            : "border-[#EAE6D8] bg-[#FAF8F4] hover:border-[#A87C4F]/40 hover:bg-[#FBF7F2]"
                        )}
                      >
                        <span className="text-[14px] w-5 text-center leading-none">{asset.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-[11px] font-medium leading-tight truncate", dark ? "text-[#F0EDE8]/80" : "text-[#2A2520]")}>
                            {asset.label}
                          </p>
                          <p className={cn("text-[9px] leading-tight", dark ? "text-white/25" : "text-[#B0A898]")}>
                            {asset.desc}
                          </p>
                        </div>
                        <span className={cn("text-[9px] font-semibold flex-none", asset.price > 0 ? "text-[#A87C4F]" : "text-[#4CAF7D]")}>
                          {asset.price > 0 ? `+${(asset.price / 1_000).toFixed(0)}k` : "Free"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "templates" && (
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <p className={cn("text-[10px] font-bold tracking-[0.16em] uppercase mb-3 pt-4 px-1", dark ? "text-white/30" : "text-[#8A8070]")}>
                PILIH TEMPLATE
              </p>
              <div className="flex flex-col gap-2">
                {TEMPLATE_EXAMPLES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl.id)}
                    className={cn(
                      "w-full text-left rounded-xl border overflow-hidden transition-all hover:-translate-y-0.5",
                      dark ? "border-white/8 hover:border-[#A87C4F]/40" : "border-[#EAE6D8] hover:border-[#A87C4F]/40 hover:shadow-sm"
                    )}
                  >
                    <div className={cn("px-3 py-2.5", tmpl.colorBg)}>
                      <p className={cn("text-[11px] font-semibold leading-tight truncate", tmpl.colorText)}>
                        {tmpl.preview.hero}
                      </p>
                      <p className="text-[9px] text-[#8A8070] mt-0.5 truncate">{tmpl.preview.sub}</p>
                    </div>
                    <div className={cn("px-3 py-2 flex items-center gap-2", dark ? "bg-[#0E0C0A]" : "bg-white")}>
                      <div className={cn("w-2 h-2 rounded-full flex-none", tmpl.colorDot)} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[11px] font-medium truncate", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                          {tmpl.name}
                        </p>
                        <p className={cn("text-[9px]", dark ? "text-white/30" : "text-[#8A8070]")}>{tmpl.category}</p>
                      </div>
                      {tmpl.tag && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#A87C4F]/12 text-[#A87C4F]">
                          {tmpl.tag}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dark mode toggle */}
          <div className={cn("px-4 py-3 border-t flex items-center justify-between", dark ? "border-white/6" : "border-[#E0D9CC]")}>
            <button
              type="button"
              onClick={toggleDark}
              className="flex items-center gap-2 w-full"
            >
              <span className={cn("flex items-center gap-2 text-[12px] font-medium flex-1", dark ? "text-[#F0EDE8]/50" : "text-[#5A5248]")}>
                {dark ? <Moon size={13} /> : <Sun size={13} />}
                Mode Gelap
              </span>
              <div className={cn("w-9 h-[18px] rounded-full relative transition-all duration-300 flex-none", dark ? "bg-[#A87C4F]" : "bg-[#DDD8CC]")}>
                <span className={cn("absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-300", dark ? "left-[18px]" : "left-[2px]")} />
              </div>
            </button>
          </div>
        </aside>

        {/* ─── LIVE PREVIEW ─── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className={cn(
            "flex-none h-9 flex items-center justify-between px-5 border-b",
            dark ? "border-white/6 bg-[#0E0C0A]" : "border-[#E0D9CC] bg-[#F5F2EA]"
          )}>
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#A87C4F]">
              LIVE PREVIEW
            </span>
            <div className="flex items-center gap-2">
              {selected && (
                <span className={cn("text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>
                  Dipilih: <span className="text-[#A87C4F] font-medium">{modules.find(m => m.key === selected)?.label}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded transition-colors",
                  dark ? "text-white/25 hover:text-white/50" : "text-[#8A8070] hover:text-[#4A4540]"
                )}
              >
                Batal pilih
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className={cn(
            "flex-1 flex items-start justify-center overflow-auto",
            dark ? "bg-[#070604]" : "bg-[#E3DFD5]",
            viewMode === "desktop" ? "p-8" : "p-8 pt-10"
          )}>
            <div
              className={cn(
                "preview-canvas overflow-hidden rounded-xl transition-all duration-300 min-h-[540px]",
                dark ? "bg-[#0E0C0A]" : "bg-white",
                viewMode === "desktop" ? "w-full max-w-[860px]" : "w-[375px]"
              )}
            >
              {/* Browser chrome */}
              <div className={cn("flex items-center gap-3 px-4 h-9", dark ? "bg-[#1A1612]" : "bg-[#F0EDE6]")}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6058]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBB33]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#61C554]" />
                </div>
                <div className={cn("flex-1 max-w-xs mx-auto px-3 py-1 rounded-md text-[10px] font-medium", dark ? "bg-[#0E0C0A] text-white/30" : "bg-white text-[#8A8070]")}>
                  🔒 bikinin.id/preview/toko-saya
                </div>
              </div>

              {/* Rendered modules */}
              <div
                className={cn(dark ? "bg-[#0E0C0A]" : "bg-[#F8F6F0]")}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (draggedAsset) {
                    setDroppedAssets(prev => [...prev, draggedAsset]);
                    setDraggedAsset(null);
                  }
                }}
              >
                {modules
                  .filter(m => m.active)
                  .map(m => (
                    <div
                      key={m.key}
                      onClick={() => setSelected(m.key)}
                      className="relative cursor-pointer group"
                    >
                      <ModulePreview
                        moduleKey={m.key}
                        isSelected={selected === m.key}
                        dark={dark}
                        label={m.label}
                        content={moduleContent[m.key]}
                        onContentChange={(field, value) => handleModuleContentChange(m.key, field, value)}
                      />
                      {selected === m.key && m.price !== 0 && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); toggleModule(m.key); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          title="Nonaktifkan modul"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  ))}

                {/* Dropped assets */}
                {droppedAssets.map(asset => (
                  <div key={asset.id} className="relative group">
                    <AssetPreview label={asset.label} dark={dark} />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full",
                        asset.price > 0
                          ? "bg-[#A87C4F] text-white"
                          : "bg-[#4CAF7D] text-white"
                      )}>
                        {asset.price > 0 ? `+Rp ${asset.price.toLocaleString("id-ID")}` : "Gratis"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAsset(asset.id)}
                        aria-label="Hapus aset"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Drop zone */}
                <div
                  className={cn(
                    "flex items-center justify-center py-5 border-2 border-dashed mx-4 my-4 rounded-xl text-[11px] transition-colors",
                    dark ? "border-white/6 text-white/20" : "border-[#E0D9CC] text-[#C0B8A8]"
                  )}
                >
                  Seret aset dari panel kiri ke sini
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── ADD MODULE MODAL ─── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className={cn(
                "fixed z-50 left-1/2 top-1/2 w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden",
                dark ? "bg-[#131110] border-white/8" : "bg-white border-[#EAE6D8]"
              )}
              initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1,    x: "-50%", y: "-50%" }}
              exit={{   opacity: 0, scale: 0.92,  x: "-50%", y: "-50%" }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              {/* Header */}
              <div className={cn("flex items-center justify-between px-5 py-4 border-b", dark ? "border-white/6" : "border-[#EAE6D8]")}>
                <div>
                  <p className="section-eyebrow">TAMBAH MODUL</p>
                  <p className={cn("text-[11px] mt-0.5", dark ? "text-white/30" : "text-[#8A8070]")}>Pilih modul untuk ditambahkan ke website</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Tutup"
                  className={cn("w-7 h-7 rounded-full flex items-center justify-center transition-colors", dark ? "bg-white/8 hover:bg-white/14 text-white/50" : "bg-[#F0EDE6] hover:bg-[#E8E4D8] text-[#5A5248]")}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Module list */}
              <div className="p-4 flex flex-col gap-2">
                {ALL_MODULES.map(mod => {
                  const alreadyAdded = modules.some(m => m.key === mod.key && m.active);
                  return (
                    <button
                      key={mod.key}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => {
                        if (!alreadyAdded) {
                          setModules(prev => prev.map(m => m.key === mod.key ? { ...m, active: true } : m));
                          setShowAddModal(false);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                        alreadyAdded
                          ? dark ? "border-white/5 opacity-35 cursor-not-allowed" : "border-[#EAE6D8] opacity-40 cursor-not-allowed"
                          : dark
                            ? "border-white/8 hover:border-[#A87C4F]/50 hover:bg-[#A87C4F]/8"
                            : "border-[#EAE6D8] hover:border-[#A87C4F]/50 hover:bg-[#FBF7F2]"
                      )}
                    >
                      <span className="text-[16px] w-6 text-center text-[#A87C4F]">{mod.icon}</span>
                      <div className="flex-1">
                        <p className={cn("text-[13px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>{mod.label}</p>
                        <p className={cn("text-[11px]", dark ? "text-white/30" : "text-[#8A8070]")}>
                          {mod.price > 0 ? `+Rp ${(mod.price / 1_000).toFixed(0)}k` : "Gratis"}
                        </p>
                      </div>
                      {alreadyAdded
                        ? <span className={cn("text-[10px] font-medium", dark ? "text-white/25" : "text-[#C0B8A8]")}>Sudah ada</span>
                        : <Plus size={14} className="text-[#A87C4F]" />
                      }
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
