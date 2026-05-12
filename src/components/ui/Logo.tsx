"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "wordmark" | "icon";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-[18px]", gap: "gap-1.5" },
  md: { icon: 30, text: "text-[22px]", gap: "gap-2" },
  lg: { icon: 38, text: "text-[28px]", gap: "gap-2.5" },
};

export function Logo({
  variant = "full",
  theme = "light",
  size = "md",
  href = "/",
  className,
}: LogoProps) {
  const s = sizes[size];

  const IconMark = () => (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Badge background */}
      <rect
        x="1" y="1"
        width="30" height="30"
        rx="8"
        fill={theme === "dark" ? "#7A5C38" : "#A87C4F"}
      />
      {/* Subtle inner highlight at top */}
      <rect
        x="1" y="1"
        width="30" height="15"
        rx="8"
        fill="white"
        fillOpacity="0.06"
      />

      {/* Geometric B letterform — evenodd hollows out the bow interiors */}
      <path
        fillRule="evenodd"
        d="
          M8 7L13 7Q23 7 23 12Q23 16.5 13 16.5
          Q25.5 16.5 25.5 21.5Q25.5 26 13 26L8 26Z
          M13 9.5Q21 9.5 21 12Q21 14.5 13 14.5Z
          M13 19Q23 19 23 21.5Q23 23.5 13 23.5Z
        "
        fill="white"
      />

      {/* Tiny sparkle dot — top right of badge */}
      <circle cx="26" cy="6" r="1.5" fill="white" fillOpacity="0.5" />
    </svg>
  );

  const WordMark = () => (
    <span
      className={cn(
        "font-serif-display leading-none select-none tracking-tight",
        s.text,
        theme === "dark" ? "text-[#C9A47A]" : "text-[#A87C4F]"
      )}
    >
      bikinin
    </span>
  );

  const content = (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      {variant !== "wordmark" && <IconMark />}
      {variant !== "icon" && <WordMark />}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-[#A87C4F] focus:ring-offset-2 rounded-lg">
      {content}
    </Link>
  );
}
