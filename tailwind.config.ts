import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bikinin Brand Tokens
        cream: {
          DEFAULT: "#F5F5DC",
          50: "#FDFDF7",
          100: "#FAFAEE",
          200: "#F5F5DC",
          300: "#EEEED0",
          400: "#E8E8BE",
        },
        bronze: {
          DEFAULT: "#A87C4F",
          light: "#C9A47A",
          dark: "#8A6440",
          50: "#FBF6F0",
          100: "#F0E4D0",
        },
        charcoal: {
          DEFAULT: "#1C1C1C",
          muted: "#5A5A5A",
          soft: "#8A8A8A",
        },
        espresso: {
          DEFAULT: "#1A0F0A",
          mid: "#2C1A12",
          light: "#3D2318",
        },
        border: {
          subtle: "#E8E4D4",
        },
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.25" }],
        "display-sm": ["1.75rem", { lineHeight: "1.3" }],
      },
      boxShadow: {
        "bronze-sm": "0 2px 8px rgba(168,124,79,0.15)",
        "bronze-md": "0 4px 20px rgba(168,124,79,0.20)",
        "bronze-lg": "0 8px 32px rgba(168,124,79,0.35)",
        "bronze-xl": "0 16px 48px rgba(168,124,79,0.40)",
        "card": "0 4px 20px rgba(28,28,28,0.08)",
        "card-hover": "0 8px 32px rgba(28,28,28,0.12)",
        "modal": "0 32px 80px rgba(28,28,28,0.25), 0 4px 20px rgba(168,124,79,0.10)",
        "glass": "0 8px 24px rgba(168,124,79,0.18), inset 0 1px 0 rgba(255,255,255,0.65)",
      },
      backgroundImage: {
        "gradient-cream": "radial-gradient(ellipse at 60% 40%, #FFFFFF 0%, #F5F5DC 100%)",
        "gradient-hero": "radial-gradient(ellipse at 40% 50%, #FFFFFF 20%, #F5F5DC 100%)",
        "gradient-dark": "radial-gradient(ellipse at 50% 30%, #2C1A12 0%, #1A0F0A 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "slide-right": "slideRight 0.3s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-4px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-12px) rotate(-2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
