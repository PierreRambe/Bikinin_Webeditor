import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bikinin — Bangun Website Profesional Tanpa Koding",
  description: "Website eksklusif untuk UMKM dan Profesional Indonesia. Buat website premium tanpa koding dalam 5 menit.",
  keywords: ["website builder", "UMKM", "no-code", "website Indonesia", "Bikinin"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Bikinin — Bangun Website Profesional Tanpa Koding",
    description: "Website eksklusif untuk UMKM dan Profesional Indonesia.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        {/* Prevent dark mode flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('bikinin-dark')==='true'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
