"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls, motion } from "framer-motion";
import {
  Eye, Send, Moon, Sun, GripVertical, Plus, Wand2,
  Monitor, Smartphone, Settings2, Layers, X, Check, ArrowLeft, Menu,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/* ─── Types ── */
type ModuleKey = "navbar" | "hero" | "gallery" | "about" | "contact" | "footer";
type PlanKey = "free" | "pro" | "enterprise";

const PLAN_META: Record<PlanKey, { label: string; color: string; limit: string; bg: string }> = {
  free:       { label: "GRATIS",   color: "#4CAF7D", limit: "Gratis selamanya", bg: "#4CAF7D15" },
  pro:        { label: "STARTER",  color: "#A87C4F", limit: "Semua fitur",      bg: "#A87C4F15" },
  enterprise: { label: "PRO",      color: "#8B4513", limit: "Tak terbatas",     bg: "#8B451315" },
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
  { key: "navbar",  label: "Navbar",        icon: "≡", price: 0, active: false },
  { key: "hero",    label: "Hero Section",  icon: "◉", price: 0, active: false },
  { key: "gallery", label: "Galeri Produk", icon: "⊞", price: 0, active: false },
  { key: "about",   label: "Tentang Kami",  icon: "ℹ", price: 0, active: false },
  { key: "contact", label: "Kontak",        icon: "✉", price: 0, active: false },
  { key: "footer",  label: "Footer",        icon: "▭", price: 0, active: false },
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
      { label: "Video Embed",    icon: "▶",   price: 0,      desc: "Embed YouTube/Vimeo" },
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
      { label: "Chat WhatsApp",  icon: "💬",  price: 0,      desc: "Floating WA button" },
      { label: "Form Kontak",    icon: "📋",  price: 25_000, desc: "Form nama + email + pesan" },
      { label: "Newsletter",     icon: "📧",  price: 25_000, desc: "Form subscribe email" },
    ],
  },
  {
    group: "Produk & Toko",
    items: [
      { label: "Kartu Produk",   icon: "📦",  price: 0,      desc: "Produk dengan harga & CTA" },
      { label: "Label Harga",    icon: "🏷",  price: 0,      desc: "Badge diskon / harga khusus" },
      { label: "Rating Bintang", icon: "⭐",  price: 0,      desc: "Review bintang 1–5" },
      { label: "Tombol Beli",    icon: "🛒",  price: 25_000, desc: "Add to cart / order sekarang" },
    ],
  },
  {
    group: "Social Proof",
    items: [
      { label: "Testimoni",      icon: "💬",  price: 0,      desc: "Kartu review pelanggan" },
      { label: "Statistik",      icon: "📊",  price: 25_000, desc: "Angka pencapaian animasi" },
      { label: "Logo Klien",     icon: "🏆",  price: 0,      desc: "Grid logo brand / mitra" },
      { label: "Peta Lokasi",    icon: "📍",  price: 25_000, desc: "Embed Google Maps" },
    ],
  },
] as const;

const ALL_MODULES: Module[] = [
  { key: "navbar",  label: "Navbar",        icon: "≡", price: 0, active: false },
  { key: "hero",    label: "Hero Section",  icon: "◉", price: 0, active: false },
  { key: "gallery", label: "Galeri Produk", icon: "⊞", price: 0, active: false },
  { key: "about",   label: "Tentang Kami",  icon: "ℹ", price: 0, active: false },
  { key: "contact", label: "Kontak",        icon: "✉", price: 0, active: false },
  { key: "footer",  label: "Footer",        icon: "▭", price: 0, active: false },
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

/* ─── Design variants per module ── */
const MODULE_DESIGN_VARIANTS: Record<ModuleKey, Array<{ id: number; name: string }>> = {
  navbar:  [{ id: 1, name: "Klasik" }, { id: 2, name: "Tengah" }, { id: 3, name: "Minimal" }, { id: 4, name: "Solid" }],
  hero:    [{ id: 1, name: "Standar" }, { id: 2, name: "Tengah" }, { id: 3, name: "Split" }, { id: 4, name: "Bold" }],
  gallery: [{ id: 1, name: "Grid 4" }, { id: 2, name: "Grid 2" }, { id: 3, name: "Featured" }, { id: 4, name: "List" }],
  about:   [{ id: 1, name: "Simpel" }, { id: 2, name: "Split" }, { id: 3, name: "Tengah" }, { id: 4, name: "Kartu" }],
  contact: [{ id: 1, name: "Simpel" }, { id: 2, name: "Kartu" }, { id: 3, name: "Form" }, { id: 4, name: "CTA" }],
  footer:  [{ id: 1, name: "Minimal" }, { id: 2, name: "Dua Kolom" }, { id: 3, name: "Lengkap" }],
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
  module, isSelected, dark, onSelect, onToggle, setDraggedModule, currentDesign, onDesignChange,
}: {
  module: Module;
  isSelected: boolean;
  dark: boolean;
  onSelect: () => void;
  onToggle: () => void;
  setDraggedModule: (key: ModuleKey | null) => void;
  currentDesign: number;
  onDesignChange: (variant: number) => void;
}) {
  const controls = useDragControls();
  const variants = MODULE_DESIGN_VARIANTS[module.key];

  return (
    <Reorder.Item
      value={module}
      dragListener={false}
      dragControls={controls}
      style={{ touchAction: "none" }}
      className={cn(
        "module-item flex flex-col rounded-xl border transition-all duration-150 select-none overflow-hidden",
        module.active
          ? isSelected
            ? dark ? "border-[#A87C4F]/60 bg-[#A87C4F]/12" : "border-[#A87C4F]/60 bg-[#FBF7F2]"
            : dark ? "border-[#A87C4F]/35 bg-[#A87C4F]/7" : "border-[#A87C4F]/40 bg-[#FBF7F2]/80"
          : dark
            ? "border-white/10 border-dashed hover:border-[#A87C4F]/35 hover:bg-[#A87C4F]/5"
            : "border-[#DDD8CC] border-dashed hover:border-[#A87C4F]/45 hover:bg-[#FBF7F2]"
      )}
      whileDrag={{ scale: 1.02, boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50 }}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
        onClick={module.active ? onSelect : onToggle}
      >
        {module.active ? (
          <button
            type="button"
            style={{ touchAction: "none" }}
            className={cn("flex-none cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors", dark ? "text-white/20 hover:text-white/50" : "text-[#C0B8A8] hover:text-[#8A8070]")}
            onPointerDown={(e) => { e.stopPropagation(); controls.start(e); }}
            aria-label="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
        ) : (
          <div className={cn("flex-none p-0.5", dark ? "text-white/12" : "text-[#DDD8CC]")}>
            <GripVertical size={14} />
          </div>
        )}

        {!module.active ? (
          <div
            className="flex items-center gap-2 flex-1 min-w-0 md:cursor-grab"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("text/plain", `module:${module.key}`); setDraggedModule(module.key); }}
            onDragEnd={() => setDraggedModule(null)}
          >
            <ModuleThumbnail moduleKey={module.key} dark={dark} />
            <span className={cn("flex-1 text-[12px] font-medium pointer-events-none truncate", dark ? "text-white/40" : "text-[#8A8070]")}>{module.label}</span>
            <Plus size={13} className={cn("flex-none pointer-events-none shrink-0", dark ? "text-white/25" : "text-[#C0B8A8]")} />
          </div>
        ) : (
          <>
            <ModuleThumbnail moduleKey={module.key} dark={dark} />
            <span className={cn("flex-1 text-[12px] font-medium pointer-events-none truncate", dark ? "text-[#F0EDE8]" : "text-[#2A2520]")}>{module.label}</span>
            <span className="flex-none w-[18px] h-[18px] rounded-full bg-[#A87C4F] flex items-center justify-center pointer-events-none shrink-0">
              <Check size={10} className="text-white" />
            </span>
          </>
        )}
      </div>

      {/* Design variant picker — only when active */}
      {module.active && (
        <div className={cn("px-3 pb-2.5 pt-0", dark ? "" : "")}>
          <p className={cn("text-[8px] font-bold tracking-[0.12em] uppercase mb-1.5", dark ? "text-white/30" : "text-[#B0A898]")}>
            Desain
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {variants.map(v => (
              <div key={v.id} className="flex flex-col items-center gap-0.5">
                <DesignVariantThumb
                  moduleKey={module.key}
                  variant={v.id}
                  selected={currentDesign === v.id}
                  dark={dark}
                  onClick={() => onDesignChange(v.id)}
                />
                <span className={cn("text-[7px] font-medium", currentDesign === v.id ? "text-[#A87C4F]" : dark ? "text-white/25" : "text-[#B0A898]")}>
                  {v.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Reorder.Item>
  );
}

/* ─── Module preview blocks ── */
function ModulePreview({
  moduleKey, isSelected, dark, label, content, onContentChange, designVariant = 1,
}: {
  moduleKey: ModuleKey;
  isSelected: boolean;
  dark: boolean;
  label: string;
  content: Record<string, string>;
  onContentChange: (field: string, value: string) => void;
  designVariant?: number;
}) {
  const ring = isSelected ? "ring-1 ring-[#A87C4F] ring-inset" : "";
  const label_tag = isSelected && (
    <span className="absolute top-0 left-0 text-[8px] bg-[#A87C4F] text-white px-2 py-0.5 rounded-br-lg z-10">
      {label} · <span className="opacity-75">klik teks untuk edit</span>
    </span>
  );

  /* ── NAVBAR ── */
  if (moduleKey === "navbar") {
    if (designVariant === 2) return (
      <div className={cn("flex flex-col items-center border-b relative pt-2 pb-1", dark ? "bg-[#131110] border-white/6" : "bg-white border-[#EAE6D8]", ring)}>
        {label_tag}
        <EditableText value={content.brandName ?? "Toko Saya"} field="brandName" isEditable={isSelected} onSave={onContentChange} className="text-[13px] font-serif-display text-[#A87C4F] mb-1" />
        <div className="flex gap-5">
          {["Produk","Tentang","Kontak"].map(l => <span key={l} className={cn("text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>{l}</span>)}
        </div>
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("flex items-center justify-between px-5 h-10 border-b relative", dark ? "bg-[#131110] border-white/6" : "bg-white border-[#EAE6D8]", ring)}>
        {label_tag}
        <EditableText value={content.brandName ?? "Toko Saya"} field="brandName" isEditable={isSelected} onSave={onContentChange} className="text-[13px] font-serif-display text-[#A87C4F]" />
        <div className={cn("flex items-center gap-1", dark ? "text-white/40" : "text-[#8A8070]")}>
          <span className="text-[18px] leading-none">≡</span>
        </div>
      </div>
    );
    if (designVariant === 4) return (
      <div className={cn("flex items-center justify-between px-5 h-10 relative", "bg-[#A87C4F]", ring)}>
        {label_tag}
        <EditableText value={content.brandName ?? "Toko Saya"} field="brandName" isEditable={isSelected} onSave={onContentChange} className="text-[13px] font-serif-display text-white" />
        <div className="flex gap-4">
          {["Produk","Tentang","Kontak"].map(l => <span key={l} className="text-[10px] text-white/70">{l}</span>)}
        </div>
      </div>
    );
    return (
      <div className={cn("flex items-center justify-between px-5 h-10 border-b relative", dark ? "bg-[#131110] border-white/6" : "bg-white border-[#EAE6D8]", ring)}>
        {label_tag}
        <EditableText value={content.brandName ?? "Toko Saya"} field="brandName" isEditable={isSelected} onSave={onContentChange} className="text-[13px] font-serif-display text-[#A87C4F]" />
        <div className="flex gap-4">
          {["Produk","Tentang","Kontak"].map(l => <span key={l} className={cn("text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>{l}</span>)}
        </div>
      </div>
    );
  }

  /* ── HERO ── */
  if (moduleKey === "hero") {
    if (designVariant === 2) return (
      <div className={cn("px-5 py-8 relative text-center", dark ? "bg-[#1A1612]" : "bg-[#F8F4EC]", ring)}>
        {label_tag}
        <EditableText value={content.title ?? "Produk Terbaik Untuk Anda"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[18px] font-serif-display mb-2 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
        <EditableText value={content.subtitle ?? "Kualitas premium, harga terjangkau"} field="subtitle" isEditable={isSelected} onSave={onContentChange} className={cn("text-[10px] mb-4 block", dark ? "text-white/60" : "text-[#8A8070]")} />
        <div className="flex justify-center">
          <span className={cn("inline-flex items-center px-6 py-2 rounded-full text-[10px] font-semibold", dark ? "bg-[#C9A47A] text-white" : "bg-[#A87C4F] text-white")}>
            <EditableText value={content.btnText ?? "Lihat Produk"} field="btnText" isEditable={isSelected} onSave={onContentChange} />
          </span>
        </div>
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("flex relative min-h-[90px]", ring)}>
        {label_tag}
        <div className={cn("flex-1 px-5 py-6 flex flex-col justify-center", dark ? "bg-[#1A1612]" : "bg-[#F8F4EC]")}>
          <EditableText value={content.title ?? "Produk Terbaik Untuk Anda"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[14px] font-serif-display mb-1 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
          <EditableText value={content.subtitle ?? "Kualitas premium, harga terjangkau"} field="subtitle" isEditable={isSelected} onSave={onContentChange} className={cn("text-[9px] mb-3 block", dark ? "text-white/55" : "text-[#8A8070]")} />
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[9px] font-semibold self-start", dark ? "bg-[#C9A47A] text-white" : "bg-[#A87C4F] text-white")}>
            <EditableText value={content.btnText ?? "Lihat Produk"} field="btnText" isEditable={isSelected} onSave={onContentChange} />
          </span>
        </div>
        <div className={cn("w-[38%] flex items-center justify-center", dark ? "bg-[#231F1A]" : "bg-[#E8DFD0]")}>
          <span className={cn("text-[28px]", dark ? "opacity-20" : "opacity-30")}>🖼</span>
        </div>
      </div>
    );
    if (designVariant === 4) return (
      <div className={cn("px-5 py-8 relative", dark ? "bg-[#0A0907]" : "bg-[#1C1C1C]", ring)}>
        {label_tag}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-0.5 bg-[#A87C4F]" />
          <span className="text-[9px] font-bold tracking-widest text-[#A87C4F] uppercase">Premium</span>
        </div>
        <EditableText value={content.title ?? "Produk Terbaik Untuk Anda"} field="title" isEditable={isSelected} onSave={onContentChange} className="text-[18px] font-serif-display mb-2 block text-white" />
        <EditableText value={content.subtitle ?? "Kualitas premium, harga terjangkau"} field="subtitle" isEditable={isSelected} onSave={onContentChange} className="text-[10px] mb-4 block text-white/50" />
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-semibold bg-[#A87C4F] text-white">
          <EditableText value={content.btnText ?? "Lihat Produk"} field="btnText" isEditable={isSelected} onSave={onContentChange} />
        </span>
      </div>
    );
    return (
      <div className={cn("px-5 py-7 relative", dark ? "bg-[#1A1612]" : "bg-[#F8F4EC]", ring)}>
        {label_tag}
        <EditableText value={content.title ?? "Produk Terbaik Untuk Anda"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[16px] font-serif-display mb-1 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
        <EditableText value={content.subtitle ?? "Kualitas premium, harga terjangkau"} field="subtitle" isEditable={isSelected} onSave={onContentChange} className={cn("text-[10px] mb-4 block", dark ? "text-white/60" : "text-[#8A8070]")} />
        <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-semibold", dark ? "bg-[#C9A47A] text-white" : "bg-[#A87C4F] text-white")}>
          <EditableText value={content.btnText ?? "Lihat Produk"} field="btnText" isEditable={isSelected} onSave={onContentChange} />
        </span>
      </div>
    );
  }

  /* ── GALLERY ── */
  if (moduleKey === "gallery") {
    const title = <EditableText value={content.sectionTitle ?? "Produk Kami"} field="sectionTitle" isEditable={isSelected} onSave={onContentChange} className={cn("text-[10px] font-semibold uppercase tracking-wider mb-3 block", dark ? "text-white/55" : "text-[#8A8070]")} />;
    if (designVariant === 2) return (
      <div className={cn("p-4 relative", ring)}>
        {label_tag}
        {title}
        <div className="grid grid-cols-2 gap-3">
          {[1,2].map(i => (
            <div key={i} className={cn("rounded-xl overflow-hidden shadow-sm", dark ? "bg-[#1A1612]" : "bg-white")}>
              <div className={cn("h-20", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")} />
              <div className="p-2">
                <p className={cn("text-[10px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Produk {i}</p>
                <p className="text-[10px] font-bold text-[#A87C4F]">Rp {i * 250}.000</p>
                <button type="button" className="mt-1.5 w-full py-1 rounded-lg bg-[#A87C4F]/15 text-[#A87C4F] text-[9px] font-semibold cursor-default">Beli</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("p-4 relative", ring)}>
        {label_tag}
        {title}
        <div className="grid grid-cols-3 gap-2">
          <div className={cn("col-span-2 row-span-2 rounded-xl overflow-hidden", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")}>
            <div className="h-28 flex items-end p-2">
              <div>
                <p className={cn("text-[9px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Produk Utama</p>
                <p className="text-[9px] font-bold text-[#A87C4F]">Rp 450.000</p>
              </div>
            </div>
          </div>
          {[1,2,3].map(i => (
            <div key={i} className={cn("rounded-xl overflow-hidden", dark ? "bg-[#1A1612]" : "bg-white")}>
              <div className={cn("h-12", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")} />
              <p className={cn("text-[7px] font-bold text-[#A87C4F] px-1.5 py-1", )}>Rp {i * 120}.000</p>
            </div>
          ))}
        </div>
      </div>
    );
    if (designVariant === 4) return (
      <div className={cn("p-4 relative", ring)}>
        {label_tag}
        {title}
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className={cn("flex items-center gap-3 rounded-xl border p-2", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-white")}>
              <div className={cn("w-10 h-10 rounded-lg flex-none", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")} />
              <div className="flex-1">
                <p className={cn("text-[10px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Produk {i}</p>
                <p className="text-[9px] font-bold text-[#A87C4F]">Rp {i * 175}.000</p>
              </div>
              <button type="button" className="px-2 py-1 rounded-lg bg-[#A87C4F] text-white text-[8px] font-bold cursor-default">Beli</button>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <div className={cn("p-4 relative", ring)}>
        {label_tag}
        {title}
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
  }

  /* ── ABOUT ── */
  if (moduleKey === "about") {
    if (designVariant === 2) return (
      <div className={cn("px-5 py-5 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <div className="flex gap-4">
          <div className="flex-1">
            <EditableText value={content.title ?? "Tentang Kami"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[13px] font-serif-display mb-1.5 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
            <EditableText value={content.body ?? "Kami adalah UMKM yang berkomitmen memberikan produk terbaik."} field="body" isEditable={isSelected} onSave={onContentChange} multiline className={cn("text-[9px] leading-relaxed block", dark ? "text-white/55" : "text-[#8A8070]")} />
          </div>
          <div className="flex flex-col gap-2 flex-none">
            {[{icon:"⚡",t:"Cepat"},{icon:"🎨",t:"Indah"},{icon:"🔒",t:"Aman"}].map(f => (
              <div key={f.t} className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-lg", dark ? "bg-white/5" : "bg-[#F8F4EC]")}>
                <span className="text-[12px]">{f.icon}</span>
                <span className={cn("text-[9px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("px-5 py-6 border-t relative text-center", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <EditableText value={content.title ?? "Tentang Kami"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[15px] font-serif-display mb-1.5 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
        <EditableText value={content.body ?? "Kami adalah UMKM yang berkomitmen memberikan produk terbaik dengan pelayanan prima."} field="body" isEditable={isSelected} onSave={onContentChange} multiline className={cn("text-[9px] leading-relaxed block mb-4", dark ? "text-white/55" : "text-[#8A8070]")} />
        <div className="flex justify-center gap-6">
          {[{n:"200+",l:"Produk"},{n:"1k+",l:"Pelanggan"},{n:"98%",l:"Puas"}].map(s => (
            <div key={s.l}>
              <p className={cn("text-[16px] font-bold", dark ? "text-[#C9A47A]" : "text-[#A87C4F]")}>{s.n}</p>
              <p className={cn("text-[8px]", dark ? "text-white/50" : "text-[#8A8070]")}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    );
    if (designVariant === 4) return (
      <div className={cn("py-5 border-t relative flex gap-0", dark ? "border-white/6" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <div className="w-1 bg-[#A87C4F] rounded-full flex-none mx-4" />
        <div className={cn("flex-1 pr-5", dark ? "bg-[#1A1612]" : "")}>
          <EditableText value={content.title ?? "Tentang Kami"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[13px] font-serif-display mb-1.5 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
          <EditableText value={content.body ?? "Kami adalah UMKM yang berkomitmen memberikan produk terbaik dengan pelayanan prima."} field="body" isEditable={isSelected} onSave={onContentChange} multiline className={cn("text-[9px] leading-relaxed block", dark ? "text-white/55" : "text-[#8A8070]")} />
        </div>
      </div>
    );
    return (
      <div className={cn("px-5 py-5 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <EditableText value={content.title ?? "Tentang Kami"} field="title" isEditable={isSelected} onSave={onContentChange} className={cn("text-[13px] font-serif-display mb-1.5 block", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")} />
        <EditableText value={content.body ?? "Kami adalah UMKM yang berkomitmen memberikan produk terbaik dengan pelayanan prima."} field="body" isEditable={isSelected} onSave={onContentChange} multiline className={cn("text-[10px] leading-relaxed block", dark ? "text-white/65" : "text-[#8A8070]")} />
      </div>
    );
  }

  /* ── CONTACT ── */
  if (moduleKey === "contact") {
    if (designVariant === 2) return (
      <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-3", dark ? "text-white/55" : "text-[#8A8070]")}>Hubungi Kami</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "✉", label: "Email", val: content.email ?? "hello@tokosaya.id", field: "email" },
            { icon: "📱", label: "Telepon", val: content.phone ?? "+62 812 3456 7890", field: "phone" },
          ].map(c => (
            <div key={c.field} className={cn("rounded-xl border p-3 flex flex-col gap-1", dark ? "border-white/8 bg-[#0E0C0A]" : "border-[#E8DFD0] bg-[#FBF7F2]")}>
              <span className="text-[14px]">{c.icon}</span>
              <p className={cn("text-[8px] font-bold uppercase tracking-wide", dark ? "text-white/40" : "text-[#8A8070]")}>{c.label}</p>
              <EditableText value={c.val} field={c.field} isEditable={isSelected} onSave={onContentChange} className={cn("text-[9px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#2A2520]")} />
            </div>
          ))}
        </div>
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <p className={cn("text-[11px] font-serif-display mb-3", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Kirim Pesan</p>
        <div className="space-y-2">
          {["Nama Lengkap", "Email Anda"].map(ph => (
            <div key={ph} className={cn("h-7 rounded-lg border px-3 flex items-center", dark ? "border-white/8 bg-[#0E0C0A]" : "border-[#E8DFD0] bg-white")}>
              <p className={cn("text-[9px]", dark ? "text-white/20" : "text-[#C0B8A8]")}>{ph}</p>
            </div>
          ))}
          <button type="button" className="w-full py-1.5 rounded-lg bg-[#A87C4F] text-white text-[10px] font-semibold cursor-default">Kirim →</button>
        </div>
      </div>
    );
    if (designVariant === 4) return (
      <div className={cn("px-5 py-6 border-t relative text-center", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <p className={cn("text-[14px] font-serif-display mb-1", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Ada yang bisa kami bantu?</p>
        <p className={cn("text-[9px] mb-4", dark ? "text-white/45" : "text-[#8A8070]")}>Tim kami siap membantu Anda</p>
        <div className="flex justify-center gap-3">
          <button type="button" className="px-4 py-2 rounded-full bg-[#A87C4F] text-white text-[10px] font-semibold cursor-default">✉ Email Kami</button>
          <button type="button" className={cn("px-4 py-2 rounded-full text-[10px] font-semibold border cursor-default", dark ? "border-white/15 text-white/60" : "border-[#DDD8CC] text-[#5A5248]")}>📱 WhatsApp</button>
        </div>
      </div>
    );
    return (
      <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8]", ring)}>
        {label_tag}
        <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2", dark ? "text-white/55" : "text-[#8A8070]")}>Hubungi Kami</p>
        <div className="flex flex-wrap gap-4">
          <span className={cn("text-[10px] flex items-center gap-1", dark ? "text-white/75" : "text-[#5A5248]")}>
            ✉{" "}
            <EditableText value={content.email ?? "hello@tokosaya.id"} field="email" isEditable={isSelected} onSave={onContentChange} className={cn("text-[10px]", dark ? "text-white/75" : "text-[#5A5248]")} />
          </span>
          <span className={cn("text-[10px] flex items-center gap-1", dark ? "text-white/75" : "text-[#5A5248]")}>
            📱{" "}
            <EditableText value={content.phone ?? "+62 812 3456 7890"} field="phone" isEditable={isSelected} onSave={onContentChange} className={cn("text-[10px]", dark ? "text-white/75" : "text-[#5A5248]")} />
          </span>
        </div>
      </div>
    );
  }

  /* ── FOOTER ── */
  if (moduleKey === "footer") {
    if (designVariant === 2) return (
      <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#0A0907]" : "border-[#EAE6D8] bg-[#1C1C1C]", ring)}>
        {label_tag}
        <div className="flex items-start justify-between mb-3">
          <span className="text-[11px] font-serif-display text-[#A87C4F]">{content.brandName ?? "Toko Saya"}</span>
          <div className="flex gap-3">
            {["Produk","Tentang","Kontak"].map(l => <span key={l} className="text-[8px] text-white/30">{l}</span>)}
          </div>
        </div>
        <div className={cn("h-px mb-2", dark ? "bg-white/6" : "bg-white/10")} />
        <EditableText value={content.copyright ?? "© 2025 Toko Saya · Powered by Bikinin"} field="copyright" isEditable={isSelected} onSave={onContentChange} className="text-[9px] text-white/25" />
      </div>
    );
    if (designVariant === 3) return (
      <div className={cn("px-5 py-4 border-t relative", dark ? "border-white/6 bg-[#0A0907]" : "border-[#EAE6D8] bg-[#1C1C1C]", ring)}>
        {label_tag}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <p className="text-[10px] font-serif-display text-[#A87C4F] mb-1">{content.brandName ?? "Toko Saya"}</p>
            <p className="text-[8px] text-white/30 leading-relaxed">Produk berkualitas untuk semua.</p>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Menu</p>
            {["Produk","Tentang","Kontak"].map(l => <p key={l} className="text-[8px] text-white/25">{l}</p>)}
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Sosial</p>
            {["Instagram","TikTok","WhatsApp"].map(l => <p key={l} className="text-[8px] text-white/25">{l}</p>)}
          </div>
        </div>
        <div className={cn("h-px mb-2", dark ? "bg-white/6" : "bg-white/10")} />
        <EditableText value={content.copyright ?? "© 2025 Toko Saya · Powered by Bikinin"} field="copyright" isEditable={isSelected} onSave={onContentChange} className="text-[8px] text-white/20" />
      </div>
    );
    return (
      <div className={cn("px-5 py-3.5 border-t relative", dark ? "border-white/6 bg-[#0A0907]" : "border-[#EAE6D8] bg-[#1C1C1C]", ring)}>
        {label_tag}
        <EditableText value={content.copyright ?? "© 2025 Toko Saya · Powered by Bikinin"} field="copyright" isEditable={isSelected} onSave={onContentChange} className="text-[10px] text-white/30" />
      </div>
    );
  }

  return null;
}

/* ─── Design variant tiny thumbnails (sidebar picker) ── */
function DesignVariantThumb({ moduleKey, variant, selected, dark, onClick }: {
  moduleKey: ModuleKey; variant: number; selected: boolean; dark: boolean; onClick: () => void;
}) {
  const base = cn(
    "w-[52px] h-[38px] rounded-lg border-2 overflow-hidden cursor-pointer transition-all shrink-0 flex flex-col",
    selected
      ? "border-[#A87C4F]"
      : dark ? "border-white/10 hover:border-white/25" : "border-[#DDD8CC] hover:border-[#A87C4F]/40"
  );
  const bg  = dark ? "bg-[#0E0C0A]" : "bg-white";
  const bg2 = dark ? "bg-[#1A1612]" : "bg-[#F8F4EC]";
  const ln  = dark ? "bg-white/20" : "bg-[#C0B8A8]";
  const ln2 = dark ? "bg-white/10" : "bg-[#DDD8CC]";
  const acc = "bg-[#A87C4F]";

  /* NAVBAR */
  if (moduleKey === "navbar") {
    if (variant === 2) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col items-center justify-center h-full gap-1 px-1">
          <div className={cn("w-8 h-1 rounded-sm", acc)} style={{opacity:.5}} />
          <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className={cn("w-2 h-0.5 rounded-sm",ln2)}/>)}</div>
        </div>
      </div>
    );
    if (variant === 3) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex items-center justify-between h-full px-1.5">
          <div className={cn("w-5 h-1 rounded-sm", acc)} style={{opacity:.5}} />
          <div className="flex flex-col gap-0.5">{[0,1,2].map(i=><div key={i} className={cn("w-2.5 h-0.5 rounded-sm",ln2)}/>)}</div>
        </div>
      </div>
    );
    if (variant === 4) return (
      <div className={cn(base,"border-[#A87C4F]/40","bg-[#A87C4F]")} onClick={onClick}>
        <div className="flex items-center justify-between h-full px-1.5">
          <div className="w-5 h-1 rounded-sm bg-white/70" />
          <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-0.5 rounded-sm bg-white/40"/>)}</div>
        </div>
      </div>
    );
    return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex items-center justify-between h-full px-1.5">
          <div className={cn("w-5 h-1 rounded-sm", acc)} style={{opacity:.5}} />
          <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className={cn("w-1.5 h-0.5 rounded-sm",ln2)}/>)}</div>
        </div>
      </div>
    );
  }

  /* HERO */
  if (moduleKey === "hero") {
    if (variant === 2) return (
      <div className={cn(base, bg2)} onClick={onClick}>
        <div className="flex flex-col items-center justify-center h-full gap-0.5 px-1">
          <div className={cn("w-8 h-1 rounded-sm", ln)} />
          <div className={cn("w-5 h-0.5 rounded-sm", ln2)} />
          <div className={cn("w-4 h-1 rounded-full mt-0.5", acc)} style={{opacity:.65}} />
        </div>
      </div>
    );
    if (variant === 3) return (
      <div className={cn(base,"overflow-hidden flex-row")} onClick={onClick}>
        <div className={cn("flex-1 flex flex-col justify-center px-1 gap-0.5", bg2)}>
          <div className={cn("w-5 h-1 rounded-sm", ln)} />
          <div className={cn("w-3 h-0.5 rounded-sm", ln2)} />
          <div className={cn("w-3 h-1 rounded-full mt-0.5", acc)} style={{opacity:.6}} />
        </div>
        <div className={cn("w-[38%]", dark ? "bg-[#231F1A]" : "bg-[#E8DFD0]")} />
      </div>
    );
    if (variant === 4) return (
      <div className={cn(base, dark ? "bg-[#0A0907]" : "bg-[#1C1C1C]")} onClick={onClick}>
        <div className="flex flex-col justify-center h-full px-1.5 gap-0.5">
          <div className="w-7 h-1 rounded-sm bg-white/50" />
          <div className="w-5 h-0.5 rounded-sm bg-white/20" />
          <div className={cn("w-4 h-1 rounded-full mt-0.5", acc)} style={{opacity:.8}} />
        </div>
      </div>
    );
    return (
      <div className={cn(base, bg2)} onClick={onClick}>
        <div className="flex flex-col justify-center h-full px-1.5 gap-0.5">
          <div className={cn("w-7 h-1 rounded-sm", ln)} />
          <div className={cn("w-5 h-0.5 rounded-sm", ln2)} />
          <div className={cn("w-4 h-1 rounded-full mt-0.5", acc)} style={{opacity:.65}} />
        </div>
      </div>
    );
  }

  /* GALLERY */
  if (moduleKey === "gallery") {
    if (variant === 2) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="p-1 grid grid-cols-2 gap-0.5 h-full">
          {[0,1].map(i=><div key={i} className={cn("rounded-sm",dark?"bg-[#231F1A]":"bg-[#F0EDE6]")}/>)}
        </div>
      </div>
    );
    if (variant === 3) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="p-1 grid grid-cols-3 gap-0.5 h-full">
          <div className={cn("col-span-2 row-span-2 rounded-sm",dark?"bg-[#231F1A]":"bg-[#F0EDE6]")} />
          {[0,1,2].map(i=><div key={i} className={cn("rounded-sm",dark?"bg-[#1A1612]":"bg-[#E8DFD0]")}/>)}
        </div>
      </div>
    );
    if (variant === 4) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="p-1 flex flex-col gap-0.5 h-full justify-around">
          {[0,1,2].map(i=>(
            <div key={i} className="flex items-center gap-0.5">
              <div className={cn("w-3 h-3 rounded-sm flex-none",dark?"bg-[#231F1A]":"bg-[#F0EDE6]")}/>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className={cn("h-0.5 rounded-sm w-full",ln2)}/>
                <div className={cn("h-0.5 rounded-sm w-2/3",ln2)}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="p-1 grid grid-cols-4 gap-0.5 h-full">
          {[0,1,2,3].map(i=><div key={i} className={cn("rounded-sm",dark?"bg-[#231F1A]":"bg-[#F0EDE6]")}/>)}
        </div>
      </div>
    );
  }

  /* ABOUT */
  if (moduleKey === "about") {
    if (variant === 2) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex gap-1 h-full p-1.5">
          <div className="flex-1 flex flex-col justify-center gap-0.5">
            <div className={cn("h-1 rounded-sm w-5",ln)}/>
            <div className={cn("h-0.5 rounded-sm w-full",ln2)}/>
            <div className={cn("h-0.5 rounded-sm w-4/5",ln2)}/>
          </div>
          <div className="flex flex-col gap-0.5 justify-center">
            {[0,1,2].map(i=><div key={i} className={cn("w-4 h-2 rounded-sm",dark?"bg-white/8":"bg-[#F0EDE6]")}/>)}
          </div>
        </div>
      </div>
    );
    if (variant === 3) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col items-center justify-center h-full gap-0.5 px-1">
          <div className={cn("h-1 rounded-sm w-6",ln)}/>
          <div className={cn("h-0.5 rounded-sm w-full",ln2)}/>
          <div className="flex gap-1 mt-0.5">
            {[0,1,2].map(i=><div key={i} className={cn("w-3 h-2 rounded-sm",dark?"bg-[#A87C4F]/15":"bg-[#A87C4F]/10")}/>)}
          </div>
        </div>
      </div>
    );
    if (variant === 4) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex h-full">
          <div className={cn("w-1 rounded-sm flex-none m-1.5", acc)} style={{opacity:.7}}/>
          <div className="flex flex-col justify-center gap-0.5 flex-1 pr-1.5">
            <div className={cn("h-1 rounded-sm w-5",ln)}/>
            <div className={cn("h-0.5 rounded-sm w-full",ln2)}/>
            <div className={cn("h-0.5 rounded-sm w-3/4",ln2)}/>
          </div>
        </div>
      </div>
    );
    return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col justify-center h-full px-1.5 gap-0.5">
          <div className={cn("h-1 rounded-sm w-5",ln)}/>
          <div className={cn("h-0.5 rounded-sm w-full",ln2)}/>
          <div className={cn("h-0.5 rounded-sm w-4/5",ln2)}/>
        </div>
      </div>
    );
  }

  /* CONTACT */
  if (moduleKey === "contact") {
    if (variant === 2) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="p-1 grid grid-cols-2 gap-0.5 h-full">
          {[0,1].map(i=>(
            <div key={i} className={cn("rounded-sm flex flex-col justify-center items-center gap-0.5 p-0.5",dark?"bg-[#1A1612]":"bg-[#F8F4EC]")}>
              <div className={cn("w-1.5 h-1.5 rounded-sm",acc)} style={{opacity:.5}}/>
              <div className={cn("w-4 h-0.5 rounded-sm",ln2)}/>
            </div>
          ))}
        </div>
      </div>
    );
    if (variant === 3) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col justify-center h-full px-1.5 gap-0.5">
          {[0,1].map(i=><div key={i} className={cn("h-2 rounded-sm border",dark?"border-white/8 bg-[#1A1612]":"border-[#EAE6D8] bg-[#FAF8F4]")}/>)}
          <div className={cn("h-2 rounded-sm mt-0.5",acc)} style={{opacity:.7}}/>
        </div>
      </div>
    );
    if (variant === 4) return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col items-center justify-center h-full gap-1 px-1">
          <div className={cn("h-0.5 rounded-sm w-6",ln2)}/>
          <div className="flex gap-1">
            <div className={cn("w-5 h-2 rounded-full",acc)} style={{opacity:.7}}/>
            <div className={cn("w-5 h-2 rounded-full border",dark?"border-white/15":"border-[#DDD8CC]")}/>
          </div>
        </div>
      </div>
    );
    return (
      <div className={cn(base, bg)} onClick={onClick}>
        <div className="flex flex-col justify-center h-full px-1.5 gap-1">
          <div className="flex items-center gap-0.5"><div className={cn("w-1 h-1 rounded-sm",acc)} style={{opacity:.5}}/><div className={cn("w-5 h-0.5 rounded-sm",ln2)}/></div>
          <div className="flex items-center gap-0.5"><div className={cn("w-1 h-1 rounded-sm",acc)} style={{opacity:.35}}/><div className={cn("w-4 h-0.5 rounded-sm",ln2)}/></div>
        </div>
      </div>
    );
  }

  /* FOOTER */
  if (variant === 2) return (
    <div className={cn(base, dark ? "bg-[#0A0907]" : "bg-[#1C1C1C]")} onClick={onClick}>
      <div className="flex items-center justify-between h-3/4 px-1.5">
        <div className="w-4 h-0.5 rounded-sm bg-[#A87C4F]/50"/>
        <div className="flex gap-0.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-0.5 rounded-sm bg-white/15"/>)}</div>
      </div>
      <div className="h-px bg-white/8 mx-1" />
      <div className="px-1.5 flex items-center h-1/4"><div className="w-8 h-0.5 rounded-sm bg-white/15"/></div>
    </div>
  );
  if (variant === 3) return (
    <div className={cn(base, dark ? "bg-[#0A0907]" : "bg-[#1C1C1C]")} onClick={onClick}>
      <div className="p-1 grid grid-cols-3 gap-0.5 h-3/4">
        {[0,1,2].map(i=>(
          <div key={i} className="flex flex-col gap-0.5">
            <div className={cn("h-0.5 rounded-sm",i===0?"bg-[#A87C4F]/50":"bg-white/15")}/>
            {[0,1].map(j=><div key={j} className="h-0.5 rounded-sm bg-white/8"/>)}
          </div>
        ))}
      </div>
      <div className="h-px bg-white/8 mx-1"/>
      <div className="px-1.5 flex items-center h-1/4"><div className="w-8 h-0.5 rounded-sm bg-white/15"/></div>
    </div>
  );
  return (
    <div className={cn(base, dark ? "bg-[#0A0907]" : "bg-[#1C1C1C]")} onClick={onClick}>
      <div className="flex items-center justify-center h-full px-1.5">
        <div className="w-full h-0.5 rounded-sm bg-white/20"/>
      </div>
    </div>
  );
}

/* ─── Module thumbnail previews ── */
function ModuleThumbnail({ moduleKey, dark }: { moduleKey: ModuleKey; dark: boolean }) {
  const base = "w-11 h-8 rounded-md overflow-hidden flex-none border shrink-0";

  if (moduleKey === "navbar") return (
    <div className={cn(base, dark ? "bg-[#0A0907] border-white/8" : "bg-[#F0EDE6] border-[#DDD8CC]")}>
      <div className="h-full flex items-center px-1.5 gap-1">
        <div className="w-4 h-1 rounded-sm bg-[#A87C4F]/60" />
        <div className="flex gap-0.5 ml-auto">
          {[0, 1, 2].map(i => (
            <div key={i} className={cn("w-1.5 h-0.5 rounded-sm", dark ? "bg-white/20" : "bg-[#B0A898]")} />
          ))}
        </div>
      </div>
    </div>
  );

  if (moduleKey === "hero") return (
    <div className={cn(base, dark ? "bg-[#1A1612] border-white/8" : "bg-[#F8F4EC] border-[#DDD8CC]")}>
      <div className="h-full flex flex-col justify-center px-1.5 gap-0.5">
        <div className={cn("w-7 h-1 rounded-sm", dark ? "bg-white/55" : "bg-[#1C1C1C]/55")} />
        <div className={cn("w-5 h-0.5 rounded-sm", dark ? "bg-white/20" : "bg-[#8A8070]/35")} />
        <div className="mt-0.5">
          <div className="w-3.5 h-1 rounded-full bg-[#A87C4F]/65" />
        </div>
      </div>
    </div>
  );

  if (moduleKey === "gallery") return (
    <div className={cn(base, dark ? "bg-[#131110] border-white/8" : "bg-white border-[#DDD8CC]")}>
      <div className="h-full p-1 grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn("rounded-sm", dark ? "bg-[#231F1A]" : "bg-[#F0EDE6]")} />
        ))}
      </div>
    </div>
  );

  if (moduleKey === "about") return (
    <div className={cn(base, dark ? "bg-[#1A1612] border-white/8" : "bg-white border-[#DDD8CC]")}>
      <div className="h-full flex flex-col justify-center px-1.5 gap-0.5">
        <div className={cn("w-5 h-1 rounded-sm", dark ? "bg-white/50" : "bg-[#1C1C1C]/50")} />
        <div className={cn("w-7 h-0.5 rounded-sm", dark ? "bg-white/18" : "bg-[#8A8070]/25")} />
        <div className={cn("w-6 h-0.5 rounded-sm", dark ? "bg-white/18" : "bg-[#8A8070]/25")} />
      </div>
    </div>
  );

  if (moduleKey === "contact") return (
    <div className={cn(base, dark ? "bg-[#1A1612] border-white/8" : "bg-white border-[#DDD8CC]")}>
      <div className="h-full flex flex-col justify-center px-1.5 gap-1">
        <div className="flex items-center gap-0.5">
          <div className="w-1 h-1 rounded-sm bg-[#A87C4F]/55" />
          <div className={cn("w-5 h-0.5 rounded-sm", dark ? "bg-white/25" : "bg-[#8A8070]/35")} />
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-1 h-1 rounded-sm bg-[#A87C4F]/35" />
          <div className={cn("w-4 h-0.5 rounded-sm", dark ? "bg-white/25" : "bg-[#8A8070]/35")} />
        </div>
      </div>
    </div>
  );

  if (moduleKey === "footer") return (
    <div className={cn(base, "border-0", dark ? "bg-[#0A0907]" : "bg-[#1A1A1A]")}>
      <div className="h-full flex items-center justify-center px-1.5">
        <div className="w-full h-0.5 rounded-sm bg-white/20" />
      </div>
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
          <p className={cn("text-[9px]", dark ? "text-white/55" : "text-[#8A8070]")}>Upload gambar 1920 × 600 px</p>
        </div>
        <div className={cn("w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center", dark ? "border-white/15" : "border-[#D0C8B8]")}>
          <span className="text-[24px]">🖼</span>
        </div>
      </div>
    </div>
  );

  if (label === "Foto Produk") return (
    <div className={cn("p-4", dark ? "bg-[#0E0C0A]" : "bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-2.5", dark ? "text-white/55" : "text-[#8A8070]")}>GALERI FOTO PRODUK</p>
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
      <p className={cn("text-[9px] mt-2", dark ? "text-white/55" : "text-[#C0B8A8]")}>YouTube / Vimeo embed</p>
    </div>
  );

  if (label === "Heading Besar") return (
    <div className={cn("px-5 py-5 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-2", dark ? "text-[#C9A47A]" : "text-[#A87C4F]/60")}>JUDUL SECTION</p>
      <p className={cn("text-[22px] font-serif-display leading-tight mb-1", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>Judul Halaman Utama</p>
      <p className={cn("text-[11px]", dark ? "text-white/60" : "text-[#8A8070]")}>Subtitle atau tagline singkat</p>
    </div>
  );

  if (label === "Paragraf") return (
    <div className={cn("px-5 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <div className="space-y-1.5">
        {(["w-full", "w-[92%]", "w-[96%]", "w-[68%]"] as const).map((wClass, i) => (
          <div key={i} className={cn("h-2 rounded-full", dark ? "bg-white/8" : "bg-[#E8E4D8]", wClass)} />
        ))}
      </div>
      <p className={cn("text-[9px] mt-2.5", dark ? "text-white/50" : "text-[#C0B8A8]")}>Teks deskripsi produk / layanan Anda</p>
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
      <p className={cn("text-[9px] mb-3", dark ? "text-white/55" : "text-[#C0B8A8]")}>Floating button · posisi kanan bawah halaman</p>
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
      <p className={cn("text-[9px] mb-3", dark ? "text-white/60" : "text-[#8A8070]")}>Daftar newsletter — gratis!</p>
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
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3", dark ? "text-white/55" : "text-[#8A8070]")}>PRODUK PILIHAN</p>
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
        <p className={cn("text-[9px] line-through mb-0.5", dark ? "text-white/45" : "text-[#C0B8A8]")}>Rp 300.000</p>
        <p className="text-[20px] font-bold text-[#A87C4F]">Rp 175.000</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold inline-block mt-1">HEMAT 42%</span>
      </div>
      <div className={cn("flex-1 rounded-xl border p-3", dark ? "border-[#A87C4F]/20 bg-[#A87C4F]/8" : "border-[#A87C4F]/20 bg-[#FBF7F2]")}>
        <p className="text-[8px] font-bold text-[#A87C4F] mb-0.5">HARGA SPESIAL</p>
        <p className={cn("text-[9px]", dark ? "text-[#C9A47A]" : "text-[#A87C4F]/70")}>Berlaku s/d akhir bulan</p>
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
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3", dark ? "text-white/55" : "text-[#8A8070]")}>APA KATA PELANGGAN</p>
      <div className="grid grid-cols-2 gap-2">
        {[{name:"Budi S.",text:"Produk sangat berkualitas!",stars:5},{name:"Sari A.",text:"Pengiriman cepat, recommended.",stars:4}].map(t => (
          <div key={t.name} className={cn("rounded-xl p-3 border", dark ? "border-white/6 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <div className="flex gap-0.5 mb-1.5">
              {[1,2,3,4,5].map(i => <span key={i} className={i <= t.stars ? "text-yellow-400 text-[10px]" : "text-[#D0C8B8] text-[10px]"}>★</span>)}
            </div>
            <p className={cn("text-[9px] mb-2 leading-relaxed", dark ? "text-white/70" : "text-[#5A5248]")}>{t.text}</p>
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
            <p className={cn("text-[9px]", dark ? "text-white/60" : "text-[#8A8070]")}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (label === "Logo Klien") return (
    <div className={cn("px-4 py-4 border-t", dark ? "border-white/6 bg-[#131110]" : "border-[#EAE6D8] bg-white")}>
      <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-3 text-center", dark ? "text-white/55" : "text-[#8A8070]")}>DIPERCAYA OLEH</p>
      <div className="grid grid-cols-4 gap-2">
        {["Brand A","Mitra B","Klien C","Brand D"].map(b => (
          <div key={b} className={cn("rounded-lg border flex items-center justify-center h-9", dark ? "border-white/8 bg-[#1A1612]" : "border-[#EAE6D8] bg-[#FAF8F4]")}>
            <p className={cn("text-[8px] font-semibold", dark ? "text-white/50" : "text-[#C0B8A8]")}>{b}</p>
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
  const [droppedAssets, setDroppedAssets] = useState<DroppedAsset[]>([]);
  const [draggedAsset, setDraggedAsset]   = useState<DroppedAsset | null>(null);
  const [draggedModule, setDraggedModule] = useState<ModuleKey | null>(null);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [moduleContent, setModuleContent] = useState<Record<ModuleKey, Record<string, string>>>(
    { ...DEFAULT_CONTENT }
  );
  const [moduleDesigns, setModuleDesigns] = useState<Record<ModuleKey, number>>(
    { navbar: 1, hero: 1, gallery: 1, about: 1, contact: 1, footer: 1 }
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

  const addAsset = (asset: { label: string; icon: string; price: number }) => {
    setDroppedAssets(prev => [...prev, { id: crypto.randomUUID(), label: asset.label, icon: asset.icon, price: asset.price }]);
    if (typeof window !== "undefined" && window.innerWidth < 768) setSidebarOpen(false);
  };

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
        "flex-none h-14 border-b z-20",
        "flex items-center gap-2 px-3",
        "md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0 md:px-5",
        dark ? "bg-[#131110] border-white/6" : "bg-white border-[#E0D9CC]"
      )}>

        {/* ── Left ── */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger — mobile/tablet only */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(s => !s)}
            className={cn(
              "md:hidden flex-none p-1.5 rounded-lg transition-colors",
              dark ? "text-white/50 hover:text-white/80 hover:bg-white/6" : "text-[#5A5248] hover:text-[#1C1C1C] hover:bg-[#F0EDE6]"
            )}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo icon only on mobile, full on md+ */}
          <span className="md:hidden flex-none">
            <Logo variant="icon" theme={dark ? "dark" : "light"} size="sm" />
          </span>
          <span className="hidden md:inline-flex flex-none">
            <Logo theme={dark ? "dark" : "light"} size="sm" />
          </span>

          {/* Divider + badge + back link — desktop only */}
          <div className={cn("hidden md:block w-px h-4 flex-none", dark ? "bg-white/10" : "bg-[#E0D9CC]")} />

          <span className={cn(
            "hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border flex-none",
            PLAN_BADGE_CLASS[plan]
          )}>
            {PLAN_META[plan].label}
          </span>

          {currentStep === 0 ? (
            <Link
              href="/"
              className={cn(
                "hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
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
                "hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                dark
                  ? "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  : "border-[#E0D9CC] text-[#8A8070] hover:text-[#A87C4F] hover:border-[#A87C4F]/30"
              )}
            >
              <ArrowLeft size={11} /> Kembali
            </button>
          )}

          {/* Current step name — mobile only, replaces full step indicator */}
          <span className={cn(
            "md:hidden text-[12px] font-semibold truncate",
            dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]"
          )}>
            {STEPS[currentStep]}
          </span>
        </div>

        {/* ── Center: Step indicator — desktop only ── */}
        <div className="hidden md:flex items-center gap-1">
          {STEPS.map((step, i) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(i)}
              className="flex items-center gap-2"
            >
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
        <div className="flex items-center justify-end gap-1.5 md:gap-2 flex-none">
          {/* Step dots — mobile only progress indicator */}
          <div className="md:hidden flex items-center gap-1.5 mr-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                aria-label={`Langkah ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === currentStep
                    ? "w-4 h-1.5 bg-[#A87C4F]"
                    : i < currentStep
                    ? "w-1.5 h-1.5 bg-[#A87C4F]/50"
                    : cn("w-1.5 h-1.5", dark ? "bg-white/20" : "bg-[#D0C8B8]")
                )}
              />
            ))}
          </div>

          {/* View mode toggle — desktop only */}
          <div className={cn(
            "hidden md:flex items-center rounded-lg p-0.5",
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

          <div className={cn("hidden md:block w-px h-5", dark ? "bg-white/10" : "bg-[#E0D9CC]")} />

          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={cn(
              "hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all",
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
              "flex items-center gap-1.5 rounded-full font-semibold transition-all",
              "px-2.5 py-1.5 text-[11px] md:px-4 md:text-[12px]",
              dark
                ? "bg-[#F0EDE8] text-[#1C1C1C] hover:bg-white"
                : "bg-[#A87C4F] text-white hover:bg-[#9A7045] publish-btn-shadow"
            )}
          >
            <Send size={11} />
            <span className="hidden sm:inline">Publikasikan</span>
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-x-0 bottom-0 top-14 z-20 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className={cn(
          "flex flex-col border-r overflow-hidden",
          "fixed top-14 left-0 z-30 h-[calc(100%-3.5rem)] w-[264px]",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0 md:h-auto md:flex-none md:w-[264px] md:z-auto",
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
                  SECTIONS
                </p>
                <p className={cn("text-[10px]", dark ? "text-white/55" : "text-[#A0998A]")}>
                  Ketuk atau seret ke canvas · tahan untuk urut
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
                      setDraggedModule={setDraggedModule}
                      currentDesign={moduleDesigns[m.key]}
                      onDesignChange={(v) => setModuleDesigns(prev => ({ ...prev, [m.key]: v }))}
                    />
                  ))}
                </Reorder.Group>
              </div>

              {/* Cost estimator */}
              <div className="px-3 pb-3">
                <div className={cn(
                  "rounded-xl p-4 border",
                  dark ? "bg-[#A87C4F]/8 border-[#A87C4F]/20" : "bg-[#FBF7F2] border-[#E8DFD0]"
                )}>
                  <p className={cn("text-[10px] font-bold tracking-[0.14em] uppercase mb-1", dark ? "text-white/55" : "text-[#8A8070]")}>
                    ADD-ON BIAYA
                  </p>
                  <p className={cn("text-[22px] leading-tight font-serif-display mb-0.5", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                    {addOnPrice === 0 ? "Gratis" : `Rp ${addOnPrice.toLocaleString("id-ID")}`}
                  </p>
                  <p className={cn("text-[9px] mb-2", dark ? "text-white/50" : "text-[#B0A898]")}>
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
                    <p className={cn("text-[10px]", dark ? "text-white/60" : "text-[#8A8070]")}>
                      {activeModules.length} modul · {droppedAssets.length} aset
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "assets" && (
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <p className={cn("text-[10px] font-bold tracking-[0.16em] uppercase mb-3 pt-4 px-1", dark ? "text-white/55" : "text-[#8A8070]")}>
                ASET
              </p>
              {ASSET_CATEGORIES.map(cat => (
                <div key={cat.group} className="mb-4">
                  <p className={cn("text-[9px] font-bold tracking-[0.14em] uppercase px-1 mb-1.5", dark ? "text-[#C9A47A]" : "text-[#A87C4F]/70")}>
                    {cat.group}
                  </p>
                  <div className="flex flex-col gap-1">
                    {cat.items.map(asset => (
                      <div
                        key={asset.label}
                        draggable
                        onClick={() => addAsset(asset)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", asset.label);
                          setDraggedAsset({ id: crypto.randomUUID(), label: asset.label, icon: asset.icon, price: asset.price });
                        }}
                        onDragEnd={() => setDraggedAsset(null)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all select-none cursor-pointer active:scale-[0.98]",
                          "md:cursor-grab md:active:cursor-grabbing",
                          dark
                            ? "border-white/6 bg-white/2 hover:border-[#A87C4F]/30 hover:bg-[#A87C4F]/6"
                            : "border-[#EAE6D8] bg-[#FAF8F4] hover:border-[#A87C4F]/40 hover:bg-[#FBF7F2]"
                        )}
                      >
                        <span className="text-[14px] w-5 text-center leading-none flex-none">{asset.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-[11px] font-medium leading-tight truncate", dark ? "text-[#F0EDE8]" : "text-[#2A2520]")}>
                            {asset.label}
                          </p>
                          <p className={cn("text-[9px] leading-tight", dark ? "text-white/50" : "text-[#B0A898]")}>
                            {asset.desc}
                          </p>
                        </div>
                        <span className={cn(
                          "text-[9px] font-semibold flex-none px-1.5 py-0.5 rounded-full",
                          asset.price > 0
                            ? dark ? "bg-[#A87C4F]/20 text-[#C9A47A]" : "bg-[#A87C4F]/10 text-[#A87C4F]"
                            : dark ? "bg-[#4CAF7D]/20 text-[#4CAF7D]" : "bg-[#4CAF7D]/10 text-[#4CAF7D]"
                        )}>
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
              <p className={cn("text-[10px] font-bold tracking-[0.16em] uppercase mb-3 pt-4 px-1", dark ? "text-white/55" : "text-[#8A8070]")}>
                PILIH TEMPLATE
              </p>
              <div className="flex flex-col gap-2">
                {TEMPLATE_EXAMPLES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl.id)}
                    className={cn(
                      "w-full text-left rounded-xl border overflow-hidden transition-all active:scale-[0.98]",
                      dark ? "border-white/8 hover:border-[#A87C4F]/40" : "border-[#EAE6D8] hover:border-[#A87C4F]/40 hover:shadow-sm"
                    )}
                  >
                    <div className={cn("px-3 py-2.5", tmpl.colorBg)}>
                      <p className={cn("text-[11px] font-semibold leading-tight truncate", tmpl.colorText)}>
                        {tmpl.preview.hero}
                      </p>
                      <p className={cn("text-[9px] mt-0.5 truncate", dark ? "text-white/55" : "text-[#8A8070]")}>{tmpl.preview.sub}</p>
                    </div>
                    <div className={cn("px-3 py-2 flex items-center gap-2", dark ? "bg-[#0E0C0A]" : "bg-white")}>
                      <div className={cn("w-2 h-2 rounded-full flex-none", tmpl.colorDot)} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[11px] font-medium truncate", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                          {tmpl.name}
                        </p>
                        <p className={cn("text-[9px]", dark ? "text-white/55" : "text-[#8A8070]")}>{tmpl.category}</p>
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
            "flex-none h-9 flex items-center justify-between px-3 md:px-5 border-b",
            dark ? "border-white/6 bg-[#0E0C0A]" : "border-[#E0D9CC] bg-[#F5F2EA]"
          )}>
            <div className="flex items-center gap-2">
              {/* Open sidebar button — mobile only, shows when sidebar is closed */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={cn(
                  "md:hidden flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors",
                  dark ? "text-[#A87C4F] hover:bg-white/6" : "text-[#A87C4F] hover:bg-[#F0EDE6]"
                )}
              >
                <Layers size={11} /> Panel
              </button>
              <span className="hidden md:inline text-[10px] font-bold tracking-[0.16em] uppercase text-[#A87C4F]">
                LIVE PREVIEW
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selected && (
                <span className={cn("hidden sm:inline text-[10px]", dark ? "text-white/30" : "text-[#8A8070]")}>
                  Dipilih: <span className="text-[#A87C4F] font-medium">{modules.find(m => m.key === selected)?.label}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded transition-colors",
                  dark ? "text-white/50 hover:text-white/80" : "text-[#8A8070] hover:text-[#4A4540]"
                )}
              >
                Batal pilih
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div
            className={cn(
              "flex-1 flex items-start justify-center overflow-auto",
              dark ? "bg-[#070604]" : "bg-[#E3DFD5]",
              viewMode === "desktop" ? "p-3 md:p-8" : "p-3 pt-6 md:p-8 md:pt-10"
            )}
            onDragOver={e => e.preventDefault()}
          >
            <div
              className={cn(
                "preview-canvas overflow-hidden rounded-xl transition-all duration-300 min-h-[360px] md:min-h-[540px]",
                dark ? "bg-[#0E0C0A]" : "bg-white",
                viewMode === "desktop" ? "w-full max-w-[860px]" : "w-full max-w-[375px]"
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
                  const text = e.dataTransfer.getData("text/plain");
                  if (text.startsWith("module:")) {
                    const key = text.replace("module:", "") as ModuleKey;
                    setModules(prev => prev.map(m => m.key === key ? { ...m, active: true } : m));
                    setDraggedModule(null);
                  } else if (text) {
                    for (const cat of ASSET_CATEGORIES) {
                      const item = cat.items.find(a => a.label === text);
                      if (item) {
                        setDroppedAssets(prev => [...prev, { id: crypto.randomUUID(), label: item.label, icon: item.icon, price: item.price }]);
                        break;
                      }
                    }
                    setDraggedAsset(null);
                  }
                }}
              >
                {/* Empty state */}
                {modules.filter(m => m.active).length === 0 && droppedAssets.length === 0 && !draggedModule && (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                      dark ? "bg-white/5" : "bg-[#A87C4F]/8"
                    )}>
                      <Layers size={24} className={cn(dark ? "text-white/20" : "text-[#A87C4F]/40")} />
                    </div>
                    <p className={cn("text-[13px] font-medium mb-1.5", dark ? "text-white/50" : "text-[#5A5248]")}>
                      Workspace kosong
                    </p>
                    <p className={cn("text-[11px] max-w-[200px] leading-relaxed", dark ? "text-white/25" : "text-[#A0998A]")}>
                      Ketuk atau seret section ke sini untuk membangun website kamu
                    </p>
                  </div>
                )}

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
                        designVariant={moduleDesigns[m.key]}
                      />
                      {/* Remove button - touch-friendly (always partially visible) */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); toggleModule(m.key); if (selected === m.key) setSelected(null); }}
                        className={cn(
                          "absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all z-20",
                          "bg-black/30 hover:bg-red-500/90 text-white",
                          "md:opacity-0 md:group-hover:opacity-100 opacity-60"
                        )}
                        aria-label={`Hapus ${m.label}`}
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ))}

                {/* Dropped assets */}
                {droppedAssets.map(asset => (
                  <div key={asset.id} className="relative group">
                    <AssetPreview label={asset.label} dark={dark} />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      {asset.price > 0 && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A87C4F] text-white">
                          +Rp {asset.price.toLocaleString("id-ID")}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAsset(asset.id)}
                        aria-label="Hapus aset"
                        className={cn(
                          "w-6 h-6 rounded-full bg-black/30 hover:bg-red-500/90 text-white flex items-center justify-center transition-all",
                          "md:opacity-0 md:group-hover:opacity-100 opacity-60"
                        )}
                      >
                        <X size={9} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Drop zone */}
                {(modules.filter(m => m.active).length > 0 || droppedAssets.length > 0 || draggedModule !== null || draggedAsset !== null) && (
                  <div
                    className={cn(
                      "flex items-center justify-center py-4 border-2 border-dashed mx-4 my-3 rounded-xl text-[11px] transition-colors",
                      draggedModule || draggedAsset
                        ? dark ? "border-[#A87C4F]/40 bg-[#A87C4F]/5 text-[#C9A47A]" : "border-[#A87C4F]/40 bg-[#FBF7F2] text-[#A87C4F]"
                        : dark ? "border-white/6 text-white/20" : "border-[#E0D9CC] text-[#C0B8A8]"
                    )}
                  >
                    <span className="hidden md:inline">
                      {draggedModule ? "Lepaskan di sini untuk menambahkan section" : "Seret aset dari panel kiri ke sini"}
                    </span>
                    <span className="md:hidden">Buka panel → Aset untuk menambahkan</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
