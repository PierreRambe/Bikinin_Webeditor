"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { X, Loader2, Check, ChevronRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type PaymentMethod = "qris" | "bank" | "gopay" | "ovo" | "dana";
type PlanKey = "free" | "pro" | "enterprise";

const PLAN_CONFIG: Record<PlanKey, { name: string; price: number; period: string }> = {
  free:       { name: "Free",    price: 0,       period: "selamanya" },
  pro:        { name: "Starter", price: 49_000,  period: "bulan"     },
  enterprise: { name: "Pro",     price: 99_000,  period: "bulan"     },
};

const PAYMENT_OPTIONS = [
  { key: "qris"  as PaymentMethod, name: "QRIS",          description: "Scan QR dari aplikasi apapun", icon: "⬛" },
  { key: "bank"  as PaymentMethod, name: "Transfer Bank", description: "BCA, Mandiri, BNI, BRI",       icon: "🏦" },
  { key: "gopay" as PaymentMethod, name: "GoPay",         description: "Bayar via GoPay",              icon: "💚" },
  { key: "ovo"   as PaymentMethod, name: "OVO",           description: "Bayar via OVO",                icon: "💜" },
  { key: "dana"  as PaymentMethod, name: "Dana",          description: "Bayar via Dana",               icon: "💙" },
];

const TAX_RATE = 0.11;

const PLAN_DOT_CLASS: Record<PlanKey, string> = {
  free:       "bg-[#4CAF7D]",
  pro:        "bg-[#A87C4F]",
  enterprise: "bg-[#6B4226]",
};

interface ExtraModule { label: string; amount: number }

function PaymentContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const planKey      = (searchParams.get("plan") ?? "pro") as PlanKey;
  const plan         = PLAN_CONFIG[planKey] ?? PLAN_CONFIG.pro;

  const subscribed  = searchParams.get("subscribed") === "1";

  const [method,  setMethod]  = useState<PaymentMethod>("qris");
  const [loading, setLoading] = useState(false);
  const [dark,    setDark]    = useState(false);
  const [extras,  setExtras]  = useState<ExtraModule[]>([]);
  const [profile, setProfile] = useState({ name: "", job: "", email: "" });

  useEffect(() => {
    setDark(localStorage.getItem("bikinin-dark") === "true");

    // Read extra modules/assets saved by the dashboard
    try {
      const raw = sessionStorage.getItem("bikinin-extras");
      if (raw) setExtras(JSON.parse(raw) as ExtraModule[]);
    } catch { /* ignore */ }
  }, []);

  const extrasTotal        = extras.reduce((a, e) => a + e.amount, 0);
  // If already subscribed, plan fee is Rp 0 — only charge extras
  const effectivePlanPrice = subscribed ? 0 : plan.price;
  const subtotal           = effectivePlanPrice + extrasTotal;
  const tax                = subtotal === 0 ? 0 : Math.round(subtotal * TAX_RATE);
  const total              = subtotal + tax;

  const isFreeAndNoExtras = effectivePlanPrice === 0 && extrasTotal === 0;
  const needsProfile      = !isFreeAndNoExtras;
  const profileFilled     = profile.name.trim() !== "" && profile.job.trim() !== "" && profile.email.trim() !== "";
  const canPay            = !needsProfile || profileFilled;

  const handlePay = async () => {
    if (isFreeAndNoExtras) {
      sessionStorage.removeItem("bikinin-extras");
      localStorage.setItem("bikinin-plan", planKey);
      if (subscribed) {
        sessionStorage.setItem("payment-method", "Langganan Aktif");
        sessionStorage.setItem("payment-total", "0");
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        router.push("/success");
      } else {
        router.push("/dashboard");
      }
      return;
    }
    setLoading(true);
    sessionStorage.setItem("payment-method", method);
    sessionStorage.setItem("payment-total", String(total));
    sessionStorage.setItem("user-name",  profile.name.trim());
    sessionStorage.setItem("user-job",   profile.job.trim());
    sessionStorage.setItem("user-email", profile.email.trim());
    sessionStorage.removeItem("bikinin-extras");
    localStorage.setItem("bikinin-plan", planKey);
    await new Promise(r => setTimeout(r, 1800));
    router.push("/success");
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 relative transition-colors duration-200",
      dark ? "bg-[#0A0907]" : "bg-[#F0EDE6]"
    )}>
      <div className={cn("fixed inset-0 -z-10", dark ? "bg-[#0A0907]" : "bg-[#F0EDE6]")} />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#A87C4F]/6 blur-3xl pointer-events-none" />

      <div className={cn(
        "payment-modal-shadow w-full max-w-[480px] rounded-2xl overflow-hidden animate-fade-up relative z-10",
        dark ? "bg-[#131110]" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn(
          "px-6 py-4 flex items-center justify-between border-b",
          dark ? "bg-[#1A1612] border-white/6" : "bg-[#FBF7F2] border-[#EAE6D8]"
        )}>
          <div className="flex items-center gap-3">
            <Logo theme={dark ? "dark" : "light"} size="sm" />
            <div className={cn("w-px h-5", dark ? "bg-white/10" : "bg-[#EAE6D8]")} />
            <div>
              <h2 className={cn("section-heading text-[17px]", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                Langganan {plan.name}
              </h2>
              <p className={cn("text-[11px] mt-0.5", dark ? "text-white/40" : "text-[#8A8070]")}>
                {plan.price === 0 ? "Gratis selamanya" : `Rp ${plan.price.toLocaleString("id-ID")}/${plan.period}`}
              </p>
            </div>
          </div>
          {/* Cancel → landing page */}
          <Link
            href="/"
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              dark ? "bg-white/8 hover:bg-white/14 text-white/60" : "bg-[#EAE6D8] hover:bg-[#DDD8CC] text-[#5A5248]"
            )}
            aria-label="Batal, kembali ke beranda"
          >
            <X size={14} />
          </Link>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Plan badge */}
          <div className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl border",
            dark ? "bg-[#A87C4F]/8 border-[#A87C4F]/20" : "bg-[#FBF7F2] border-[#EAE6D8]"
          )}>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={cn("w-2.5 h-2.5 rounded-full flex-none", PLAN_DOT_CLASS[planKey])} />
              <span className={cn("text-[13px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                Paket {plan.name}
              </span>
              {subscribed && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#4CAF7D]/12 text-[#4CAF7D]">
                  ✓ Sudah Berlangganan
                </span>
              )}
            </div>
            <span className={cn("text-[13px] font-bold", effectivePlanPrice === 0 ? "text-[#4CAF7D]" : "text-[#A87C4F]")}>
              {subscribed ? "Rp 0" : plan.price === 0 ? "Gratis" : `Rp ${plan.price.toLocaleString("id-ID")}`}
            </span>
          </div>

          {/* Extra modules (from dashboard) */}
          {extras.length > 0 && (
            <div className="space-y-2">
              <p className="section-eyebrow">MODUL & ASET TAMBAHAN</p>
              {extras.map(e => (
                <div key={e.label} className="flex items-center justify-between">
                  <span className={cn("text-[13px]", dark ? "text-white/55" : "text-[#5A5248]")}>{e.label}</span>
                  <span className={cn("text-[13px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
                    {e.amount === 0 ? <span className="text-[#4CAF7D]">Gratis</span> : `Rp ${e.amount.toLocaleString("id-ID")}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          {extras.length > 0 && <div className={cn("h-px", dark ? "bg-white/6" : "bg-[#EAE6D8]")} />}

          {/* Tax — only if there's something to pay */}
          {!isFreeAndNoExtras && (
            <div className="flex items-center justify-between">
              <span className={cn("text-[12px]", dark ? "text-white/40" : "text-[#8A8070]")}>PPN 11%</span>
              <span className={cn("text-[12px]", dark ? "text-white/40" : "text-[#8A8070]")}>
                Rp {tax.toLocaleString("id-ID")}
              </span>
            </div>
          )}

          {/* Total */}
          <div className={cn(
            "flex items-center justify-between px-4 py-3.5 rounded-xl border",
            dark ? "bg-[#A87C4F]/10 border-[#A87C4F]/20" : "bg-[#FBF7F2] border-[#EAE6D8]"
          )}>
            <span className={cn("text-[14px] font-semibold", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>
              Total Pembayaran
            </span>
            <span className="section-heading text-[20px] text-[#A87C4F]">
              {total === 0 ? "Gratis" : `Rp ${total.toLocaleString("id-ID")}`}
            </span>
          </div>

          {/* Profile form — only if there's something to pay */}
          {needsProfile && (
            <div>
              <p className="section-eyebrow mb-3">DATA PENERIMA WEBSITE</p>
              <div className="space-y-2.5">
                {[
                  { key: "name"  as const, placeholder: "Nama Lengkap",              type: "text"  },
                  { key: "job"   as const, placeholder: "Pekerjaan / Bidang Usaha",  type: "text"  },
                  { key: "email" as const, placeholder: "Email aktif (penerima link website)", type: "email" },
                ].map(f => (
                  <input
                    key={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={profile[f.key]}
                    onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-[13px] outline-none transition-all",
                      dark
                        ? "bg-white/4 border-white/10 text-[#F0EDE8] placeholder:text-white/25 focus:border-[#A87C4F]/60"
                        : "bg-white border-[#EAE6D8] text-[#1C1C1C] placeholder:text-[#B0A898] focus:border-[#A87C4F]"
                    )}
                  />
                ))}
                <p className={cn("text-[11px]", dark ? "text-white/25" : "text-[#B0A898]")}>
                  Link website akan dikirim ke email di atas setelah pembayaran.
                </p>
              </div>
            </div>
          )}

          {/* Payment method — only if there's something to pay */}
          {!isFreeAndNoExtras && (
            <div>
              <p className="section-eyebrow mb-3">METODE PEMBAYARAN</p>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setMethod(opt.key)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-150",
                      method === opt.key
                        ? dark ? "border-[#A87C4F]/60 bg-[#A87C4F]/10" : "border-[#A87C4F] bg-[#FBF7F2]"
                        : dark ? "border-white/8 bg-white/3 hover:border-white/16" : "border-[#EAE6D8] bg-white hover:border-[#C9A47A]/50"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-none transition-all",
                      method === opt.key ? "border-[#A87C4F] bg-[#A87C4F]" : dark ? "border-white/20" : "border-[#D0C8B8]"
                    )}>
                      {method === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-base leading-none">{opt.icon}</span>
                    <div className="flex-1">
                      <p className={cn("text-[13px] font-medium", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}>{opt.name}</p>
                      <p className={cn("text-[11px]", dark ? "text-white/35" : "text-[#8A8070]")}>{opt.description}</p>
                    </div>
                    {method === opt.key && <ChevronRight size={14} className="text-[#A87C4F] flex-none" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handlePay}
            disabled={loading || !canPay}
            className="pay-btn-shadow w-full py-3.5 rounded-full font-semibold text-[15px] text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 bg-[#A87C4F] hover:bg-[#9A7045] active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Memproses...</>
            ) : isFreeAndNoExtras && subscribed ? (
              <><Check size={15} /> Publikasikan Sekarang</>
            ) : isFreeAndNoExtras ? (
              <><Check size={15} /> Mulai Gratis Sekarang</>
            ) : (
              <><Check size={15} /> Bayar Rp {total.toLocaleString("id-ID")}</>
            )}
          </button>

          {/* Back to landing */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 text-[12px] transition-colors",
                dark ? "text-white/30 hover:text-white/60" : "text-[#8A8070] hover:text-[#A87C4F]"
              )}
            >
              <ArrowLeft size={12} /> Kembali ke beranda
            </Link>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#4CAF7D]" />
              <p className={cn("text-[11px]", dark ? "text-white/30" : "text-[#8A8070]")}>
                SSL 256-bit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0EDE6]" />}>
      <PaymentContent />
    </Suspense>
  );
}
