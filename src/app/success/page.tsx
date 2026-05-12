"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, RotateCcw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

function useTransactionId() {
  const [id, setId] = useState("");
  useEffect(() => {
    setId(`BKN-2025-${Math.floor(Math.random() * 90_000 + 10_000)}`);
  }, []);
  return id;
}

/* Fixed confetti positions — no dynamic inline styles needed */
const CONFETTI = [
  { cls: "left-[10%] top-[14%] w-[7px] h-[7px] bg-[#A87C4F]",  delay: 0   },
  { cls: "left-[16%] top-[24%] w-[5px] h-[5px] bg-[#C9A47A]",  delay: 70  },
  { cls: "left-[6%]  top-[38%] w-[4px] h-[4px] bg-[#A87C4F]",  delay: 140 },
  { cls: "left-[88%] top-[18%] w-[5px] h-[5px] bg-[#C9A47A]",  delay: 210 },
  { cls: "left-[92%] top-[32%] w-[7px] h-[7px] bg-[#A87C4F]",  delay: 280 },
  { cls: "left-[84%] top-[72%] w-[5px] h-[5px] bg-[#C9A47A]",  delay: 350 },
  { cls: "left-[90%] top-[82%] w-[8px] h-[8px] bg-[#A87C4F]",  delay: 420 },
  { cls: "left-[20%] top-[80%] w-[5px] h-[5px] bg-[#C9A47A]",  delay: 490 },
] as const;

const fadeUp = (delay: number) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function SuccessPage() {
  const [dark, setDark]           = useState(false);
  const [payMethod, setPayMethod] = useState("QRIS");
  const [payTotal, setPayTotal]   = useState("1.554.000");
  const [drawn, setDrawn]         = useState(false);
  const [userName, setUserName]   = useState("");
  const [userEmail, setUserEmail] = useState("");
  const txId = useTransactionId();
  const today = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });

  useEffect(() => {
    setDark(localStorage.getItem("bikinin-dark") === "true");
    const method = sessionStorage.getItem("payment-method") ?? "QRIS";
    const total  = sessionStorage.getItem("payment-total");
    setPayMethod(method.toUpperCase());
    if (total) setPayTotal(Number(total).toLocaleString("id-ID"));
    setUserName(sessionStorage.getItem("user-name")  ?? "");
    setUserEmail(sessionStorage.getItem("user-email") ?? "");
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const rows = [
    ...(userName  ? [{ label: "Nama",             value: userName,         green: false }] : []),
    ...(userEmail ? [{ label: "Email",            value: userEmail,        green: false }] : []),
    { label: "ID Transaksi",      value: txId || "—",            green: false },
    { label: "Metode Pembayaran", value: payMethod,               green: false },
    { label: "Total Dibayar",     value: `Rp ${payTotal}`,        green: false },
    { label: "Tanggal",           value: today,                   green: false },
    { label: "Status",            value: "✓ Lunas",               green: true  },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-200",
      dark ? "bg-[#0E0C0A]" : "bg-white"
    )}>
      {/* Background glow */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        dark
          ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(168,124,79,0.08)_0%,transparent_70%)]"
          : "bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(245,245,220,0.8)_0%,transparent_70%)]"
      )} />

      {/* Confetti dots — static positions, animated via Framer Motion */}
      {CONFETTI.map((dot, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full pointer-events-none opacity-30", dot.cls)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.4, delay: dot.delay / 1000, ease: "backOut" }}
        />
      ))}

      {/* Navbar */}
      <header className={cn(
        "flex-none h-16 flex items-center justify-between px-6 border-b z-10",
        dark ? "bg-[#0E0C0A]/80 border-white/6 backdrop-blur-sm"
             : "bg-white/80 border-[#EAE6D8] backdrop-blur-sm"
      )}>
        <Logo size="md" theme={dark ? "dark" : "light"} />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4CAF7D]" />
          <span className="text-[13px] font-medium text-[#4CAF7D]">Pembayaran Berhasil</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center relative z-10">

        {/* Checkmark — spring scale */}
        <motion.div
          className="mb-10"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
        >
          <div className="relative inline-flex">
            <div className="absolute inset-[-18px] rounded-full bg-[#A87C4F]/10" />
            <div className="success-check-glow w-[88px] h-[88px] rounded-full bg-[#A87C4F] flex items-center justify-center relative z-10">
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <path
                  className={cn("check-path", drawn && "drawn")}
                  d="M10 22L18 30L34 14"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className={cn("section-heading text-[42px] lg:text-[50px] leading-tight mb-3", dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]")}
          {...fadeUp(0.18)}
        >
          {userName ? `Hei, ${userName.split(" ")[0]}!` : "Website Kamu Sedang Diproses!"}
        </motion.h1>

        {/* Sub */}
        <motion.p
          className={cn("text-[16px] leading-relaxed max-w-[480px] mb-6", dark ? "text-[#6A6460]" : "text-[#5A5248]")}
          {...fadeUp(0.28)}
        >
          {userName ? "Website kamu sedang diproses." : "Detail akses dan instruksi selanjutnya"}{" "}
          {userEmail
            ? <>Link akses akan dikirim ke <span className={cn("font-semibold", dark ? "text-[#C9A47A]" : "text-[#1C1C1C]")}>{userEmail}</span> dalam</>
            : <>Instruksi selanjutnya telah kami kirimkan ke email Anda. Website aktif dalam</>
          }{" "}
          <span className={cn("font-semibold", dark ? "text-[#C9A47A]" : "text-[#1C1C1C]")}>1×24 jam</span>.
        </motion.p>

        {/* Email badge */}
        <motion.div
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-8",
            dark ? "border-[#A87C4F]/30 bg-[#A87C4F]/8 text-[#C9A47A]"
                 : "border-[#A87C4F]/30 bg-[#FBF7F2] text-[#A87C4F]"
          )}
          {...fadeUp(0.36)}
        >
          <CheckCircle2 size={14} />
          <span className="text-[13px] font-medium">
            {userEmail ? `Link dikirim ke ${userEmail}` : "Email konfirmasi dikirim"}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          {...fadeUp(0.44)}
        >
          <Link href="/dashboard" className="btn-primary px-8">
            Kembali ke Dashboard
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            className={cn(
              "text-[13px] flex items-center gap-1.5 transition-colors",
              dark ? "text-[#6A6460] hover:text-[#C9A47A]" : "text-[#8A8070] hover:text-[#A87C4F]"
            )}
          >
            <RotateCcw size={12} />
            Tidak dapat email? Kirim ulang
          </button>
        </motion.div>

        {/* Transaction card */}
        <motion.div
          className={cn(
            "success-card-shadow mt-10 rounded-2xl border w-full max-w-sm text-left",
            dark ? "bg-[#131110] border-white/6" : "bg-white border-[#EAE6D8]"
          )}
          {...fadeUp(0.54)}
        >
          <div className={cn("px-5 py-3 border-b", dark ? "border-white/6" : "border-[#EAE6D8]")}>
            <p className="section-eyebrow">DETAIL TRANSAKSI</p>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {rows.map(row => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className={cn("text-[12px]", dark ? "text-white/40" : "text-[#8A8070]")}>
                  {row.label}
                </span>
                <span className={cn(
                  "text-[12px] font-medium",
                  row.green ? "text-[#4CAF7D]" : dark ? "text-[#F0EDE8]" : "text-[#1C1C1C]"
                )}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
