// components/WAStatus.tsx
import { useEffect, useState } from "react";

const WA_URL = "https://be-school.kiraproject.id/wa";

export default function WAStatus() {
  const [status, setStatus] = useState<{ isReady: boolean; hasQR: boolean } | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await fetch(`${WA_URL}/status`);
      const json = await res.json();
      setStatus(json);

      // Kalau ada QR, langsung fetch gambarnya
      if (json.hasQR) {
        fetchQR();
      } else {
        setQrImage(null);
      }
    } catch {
      setStatus(null);
    }
  };

  const fetchQR = async () => {
    try {
      const res = await fetch(`${WA_URL}/qr`);
      const json = await res.json();
      if (json.success) setQrImage(json.qrImage);
    } catch {}
  };

  // Poll status setiap 3 detik
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-white uppercase tracking-tight">WhatsApp Gateway</h3>
          <p className="text-xs text-zinc-500 mt-1">Status koneksi WA untuk kirim rekap otomatis</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase ${
          status?.isReady 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full ${status?.isReady ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          {status?.isReady ? 'Terhubung' : 'Tidak Aktif'}
        </div>
      </div>

      {/* QR Code — muncul saat belum login */}
      {!status?.isReady && qrImage && (
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="text-sm text-zinc-400 text-center">
            Scan QR ini dengan WhatsApp di HP kamu
          </p>
          <div className="p-4 bg-white rounded-2xl shadow-xl">
            <img src={qrImage} alt="WA QR Code" className="w-48 h-48" />
          </div>
          <p className="text-[10px] text-zinc-600 text-center">
            Buka WA → Linked Devices → Link a Device
          </p>
        </div>
      )}

      {!status?.isReady && !qrImage && (
        <div className="py-6 text-center text-zinc-600 text-sm">
          Menunggu QR Code dari server...
        </div>
      )}

      {status?.isReady && (
        <div className="py-4 text-center text-emerald-400 text-sm font-bold">
          ✅ WhatsApp sudah terhubung dan siap kirim pesan
        </div>
      )}
    </div>
  );
}