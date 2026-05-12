export function BrowserMockup() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-[#131110] shadow-[0_24px_60px_rgba(28,28,28,0.14),_0_4px_20px_rgba(168,124,79,0.08)]">
      {/* Chrome bar */}
      <div className="bg-[#F0EDE6] dark:bg-[#1A1612] px-4 h-10 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF6058]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBB33]" />
          <span className="w-3 h-3 rounded-full bg-[#61C554]" />
        </div>
        <div className="flex-1 max-w-[320px] mx-auto">
          <div className="bg-white dark:bg-[#0E0C0A] rounded-lg px-3 py-1 flex items-center gap-1.5">
            <span className="text-[10px] text-[#4CAF7D]">🔒</span>
            <span className="text-[11px] text-[#8A8070] dark:text-[#6A6460] font-medium">
              bikinin.id/preview/toko-saya
            </span>
          </div>
        </div>
      </div>

      {/* Website preview content */}
      <div className="bg-[#F8F6F0] dark:bg-[#0E0C0A]">
        {/* Mini navbar */}
        <div className="bg-white dark:bg-[#131110] px-5 h-10 flex items-center justify-between border-b border-[#EAE6D8] dark:border-white/6">
          <span className="text-[14px] text-[#A87C4F] font-serif-display">
            Toko Saya
          </span>
          <div className="hidden sm:flex gap-4">
            {["Produk", "Tentang", "Kontak"].map((l) => (
              <span key={l} className="text-[10px] text-[#8A8070] dark:text-[#6A6460]">{l}</span>
            ))}
          </div>
        </div>

        {/* Mini hero */}
        <div className="bg-[#F8F4EC] dark:bg-[#1A1612] px-5 py-5">
          <p className="text-[18px] text-[#1C1C1C] dark:text-[#F0EDE8] mb-1 leading-tight font-serif-display">
            Produk Terbaik
            <br />
            Untuk Anda
          </p>
          <p className="text-[10px] text-[#8A8070] dark:text-[#6A6460] mb-4">
            Kualitas premium, harga terjangkau
          </p>
          <button
            type="button"
            className="bg-[#A87C4F] text-white text-[10px] font-semibold px-4 py-1.5 rounded-full cursor-default"
          >
            Lihat Produk
          </button>
        </div>

        {/* Product grid */}
        <div className="p-4">
          <p className="text-[10px] font-semibold text-[#8A8070] dark:text-[#6A6460] mb-3 tracking-wider uppercase">
            Produk Kami
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { name: "Produk 1", price: "Rp 175.000" },
              { name: "Produk 2", price: "Rp 350.000" },
              { name: "Produk 3", price: "Rp 525.000" },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-white dark:bg-[#1A1612] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="bg-[#F0EDE6] dark:bg-[#231F1A] h-16" />
                <div className="p-2">
                  <p className="text-[10px] font-medium text-[#1C1C1C] dark:text-[#F0EDE8]">{p.name}</p>
                  <p className="text-[10px] font-bold text-[#A87C4F]">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact bar */}
        <div className="bg-white dark:bg-[#131110] border-t border-[#EAE6D8] dark:border-white/6 px-5 py-3 flex items-center justify-between">
          <span className="text-[10px] text-[#8A8070] dark:text-[#6A6460]">✉ hello@tokosaya.id</span>
          <span className="text-[10px] text-[#8A8070] dark:text-[#6A6460]">📱 +62 812 3456 7890</span>
        </div>
      </div>
    </div>
  );
}
