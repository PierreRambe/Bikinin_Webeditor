"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ marginBottom: 16 }}>Terjadi Kesalahan</h2>
          <button onClick={reset} style={{ padding: "8px 24px", background: "#A87C4F", color: "#fff", border: "none", borderRadius: 999, cursor: "pointer", fontWeight: 600 }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
