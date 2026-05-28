import Link from "next/link";
import { ArrowRight, Zap, Palette, Smartphone, Lock, Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/* ── Feature Strip ── */
const FEATURES = [
  { icon: <Zap size={15} />, label: "Setup dalam 5 Menit" },
  { icon: <Palette size={15} />, label: "50+ Template Premium" },
  { icon: <Smartphone size={15} />, label: "Mobile Responsive" },
  { icon: <Lock size={15} />, label: "SSL & Domain Gratis" },
];

export function FeatureStrip() {
  return (
    <div className="w-full bg-white dark:bg-[#0E0C0A] border-t border-b border-[#EAE6D8] dark:border-white/6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-y-3 py-5">
          {FEATURES.map((f, i) => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-[#A87C4F] dark:text-[#C9A47A]">{f.icon}</span>
              <span className="text-[13px] font-medium text-[#3A3A3A] dark:text-[#C8C0B0] whitespace-nowrap">
                {f.label}
              </span>
              {i < FEATURES.length - 1 && (
                <div className="hidden lg:block w-px h-4 bg-[#E0D9CC] dark:bg-white/10 ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── How It Works ── */
const STEPS = [
  {
    num: "01",
    title: "Pilih Section",
    desc: "Ketuk section yang kamu inginkan — Navbar, Hero, Galeri, Kontak. Workspace kosong jadi starting point yang bebas.",
  },
  {
    num: "02",
    title: "Atur Konten",
    desc: "Isi konten, upload foto, dan sesuaikan tampilan sesuai brand kamu. Semua real-time tanpa perlu reload.",
  },
  {
    num: "03",
    title: "Publikasikan",
    desc: "Bayar sekali, website langsung online dengan domain .id dan SSL gratis. Tanpa biaya bulanan tersembunyi.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="fitur"
      className="relative overflow-hidden bg-[#F8F6F0] dark:bg-[#0A0907] py-24 transition-colors duration-200"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 dots-pattern opacity-100 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A87C4F]/6 dark:bg-[#A87C4F]/9 blur-3xl animate-drift-a pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#C9A47A]/5 dark:bg-[#C9A47A]/7 blur-3xl animate-drift-b pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F6F0] dark:from-[#0A0907] via-transparent to-[#F8F6F0] dark:to-[#0A0907] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-eyebrow mb-4">CARA KERJA</p>
          <h2 className="section-heading text-[38px] lg:text-[46px] text-[#1C1C1C] dark:text-[#F0EDE8] mb-4">
            Tiga Langkah Menuju
            <br />
            Website Impian
          </h2>
          <p className="text-[16px] text-[#5A5A5A] dark:text-[#6A6460] max-w-md mx-auto">
            Tidak perlu pengetahuan teknis apapun. Serius.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {i < STEPS.length - 1 && (
                <div className="step-connector hidden md:block" />
              )}
              <div className="card-light rounded-2xl p-8 h-full transition-all duration-200 hover:shadow-md group">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="step-badge">
                    <span className="text-white text-[11px] font-bold">{step.num}</span>
                  </div>
                  <div className="flex-1 h-px bg-[#EAE6D8] dark:bg-white/6" />
                </div>

                <h3 className="section-heading text-[20px] text-[#1C1C1C] dark:text-[#F0EDE8] mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#5A5A5A] dark:text-[#6A6460] leading-relaxed">
                  {step.desc}
                </p>

                {/* Bronze accent */}
                <div className="w-8 h-0.5 bg-[#A87C4F] mt-6 rounded-full transition-all duration-300 group-hover:w-14" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/dashboard" className="btn-primary">
            Coba Sekarang — Gratis
            <ArrowRight size={16} />
          </Link>
          <p className="text-[12px] text-[#8A8A8A] dark:text-[#5A5048] mt-3">
            Tidak perlu kartu kredit · Setup dalam 5 menit
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing Section ── */
const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "1x ",
    desc: "Mulai membangun website tanpa biaya apapun",
    dragLimit: "1 halaman",
    features: [
      "Semua section & aset dasar gratis",
      "Drag & drop builder lengkap",
      "Subdomain bikinin.id",
      "SSL & hosting gratis",
      "1 halaman website",
    ],
    popular: false,
    cta: "Mulai Gratis",
    href: "/payment?plan=free",
  },
  {
    name: "Starter",
    price: 39_000,
    period: "bulan",
    desc: "Untuk UMKM & profesional yang ingin tampil lebih",
    dragLimit: "3 halaman",
    features: [
      "Semua fitur Free",
      "Custom domain .id",
      "3 halaman website",
      "Analytics & statistik pengunjung",
      "Integrasi WhatsApp & media sosial",
      "Hapus branding Bikinin",
    ],
    popular: true,
    cta: "Mulai Starter",
    href: "/payment?plan=pro",
  },
  {
    name: "Pro",
    price: 89_000,
    period: "bulan",
    desc: "Untuk bisnis yang butuh fitur lengkap tanpa batas",
    dragLimit: "Tak terbatas",
    features: [
      "Semua fitur Starter",
      "Halaman & section tak terbatas",
      "Toko online & e-commerce",
      "Analytics lanjutan & konversi",
      "Support prioritas 24/7",
      "Custom branding & domain",
    ],
    popular: false,
    cta: "Mulai Pro",
    href: "/payment?plan=enterprise",
  },
];

export function PricingSection() {
  return (
    <section
      id="harga"
      className="relative overflow-hidden py-24 bg-white dark:bg-[#0E0C0A] transition-colors duration-200"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 dots-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 rounded-full bg-[#A87C4F]/5 dark:bg-[#A87C4F]/8 blur-3xl animate-orb-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#C9A47A]/5 dark:bg-[#C9A47A]/7 blur-3xl animate-drift-c pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#A87C4F]/4 dark:bg-[#A87C4F]/6 blur-3xl animate-drift-b pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#0E0C0A] via-transparent to-white dark:to-[#0E0C0A] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-4">HARGA</p>
          <h2 className="section-heading text-[38px] lg:text-[46px] text-[#1C1C1C] dark:text-[#F0EDE8] mb-4">
            Pilih Paket yang
            <br />
            Sesuai Kebutuhanmu
          </h2>
          <p className="text-[16px] text-[#5A5A5A] dark:text-[#6A6460]">
            Mulai gratis, upgrade kapan saja. Tidak ada kontrak jangka panjang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`group rounded-2xl p-8 flex flex-col relative pricing-card ${
                plan.popular
                  ? "pricing-popular pricing-card-popular mt-4 md:-mt-4 md:mb-4"
                  : "pricing-default pricing-card-default"
              }`}
            >
              {/* Shimmer beam — clipped inside its own overflow:hidden wrapper */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-[1]">
                <div className="pricing-shine" />
              </div>

              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-max z-10">
                  <span className="whitespace-nowrap bg-white text-[#A87C4F] text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full shadow-sm block">
                    PALING POPULER
                  </span>
                </div>
              )}

              {/* Plan name + desc */}
              <div className="mb-5 relative z-[2]">
                <h3
                  className={`section-heading text-[20px] mb-1 ${
                    plan.popular ? "text-white" : "text-[#1C1C1C] dark:text-[#F0EDE8]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`text-[13px] ${plan.popular ? "text-white/65" : "text-[#5A5A5A] dark:text-[#6A6460]"}`}>
                  {plan.desc}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-current/10 relative z-[2]">
                <div className="transition-transform duration-300 group-hover:scale-[1.05] origin-left inline-block">
                  {plan.price === 0 ? (
                    <span className={`section-heading text-[34px] ${plan.popular ? "text-white" : "text-[#1C1C1C] dark:text-[#F0EDE8]"}`}>
                      Gratis
                    </span>
                  ) : (
                    <>
                      <span className={`section-heading text-[34px] ${plan.popular ? "text-white" : "text-[#1C1C1C] dark:text-[#F0EDE8]"}`}>
                        Rp {plan.price.toLocaleString("id-ID")}
                      </span>
                      <span className={`text-[12px] ml-1.5 ${plan.popular ? "text-white/50" : "text-[#8A8A8A] dark:text-[#5A5048]"}`}>
                        /{plan.period}
                      </span>
                    </>
                  )}
                </div>
                <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  plan.popular
                    ? "bg-white/15 text-white"
                    : "bg-[#A87C4F]/10 text-[#A87C4F] dark:bg-[#A87C4F]/15 dark:text-[#C9A47A]"
                }`}>
                  {plan.dragLimit}
                </div>
              </div>

              {/* Feature list with staggered slide */}
              <ul className="flex flex-col gap-3 mb-8 flex-1 relative z-[2]">
                {plan.features.map((f, fi) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2.5 transition-transform duration-200 group-hover:translate-x-1.5 stagger-${fi}`}
                  >
                    <Check
                      size={14}
                      className={`flex-none transition-transform duration-200 group-hover:scale-110 ${plan.popular ? "text-white/80" : "text-[#A87C4F]"}`}
                    />
                    <span className={`text-[13px] ${plan.popular ? "text-white/85" : "text-[#4A4A4A] dark:text-[#9A9080]"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Link
                href={plan.href}
                className={`relative z-[2] text-center py-3.5 rounded-full font-semibold text-[14px] transition-all duration-300 group-hover:shadow-lg ${
                  plan.popular
                    ? "bg-white text-[#A87C4F] hover:bg-[#F8F6F0]"
                    : "pricing-btn-default bg-[#A87C4F] text-white hover:bg-[#9A7045]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
const PRODUK_LINKS = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Harga", href: "/#harga" },
  { label: "Template", href: "/portfolio" },
];

export function Footer() {
  return (
    <footer className="footer-bg text-[#F0EDE8] transition-colors duration-200">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#A87C4F]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">

          {/* Brand */}
          <div className="max-w-sm">
            <Logo theme="dark" size="md" className="mb-5" />
            <p className="text-[14px] text-[#F0EDE8]/40 leading-relaxed mb-7">
              Membantu UMKM dan Profesional Indonesia membangun kehadiran digital
              yang profesional dan terpercaya.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#A87C4F]/30 bg-[#A87C4F]/10 text-[#C9A47A] text-[12px] font-semibold hover:bg-[#A87C4F]/20 hover:border-[#A87C4F]/50 transition-all duration-200"
            >
              Mulai Buat Website
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Produk */}
          <div className="min-w-[140px]">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A87C4F]/70 mb-5">
              Produk
            </p>
            <ul className="flex flex-col gap-3.5">
              {PRODUK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="group flex items-center gap-2.5 text-[13px] text-[#F0EDE8]/45 hover:text-[#F0EDE8] transition-colors duration-150"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#A87C4F]/40 group-hover:bg-[#A87C4F] transition-colors duration-150 flex-none" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-[#F0EDE8]/25">
            © 2025 Bikinin. All rights reserved.
          </p>
          <p className="text-[12px] text-[#F0EDE8]/25">
            Dibuat dengan ❤️ di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
