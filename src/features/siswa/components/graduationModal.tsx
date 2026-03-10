// src/components/student/GraduationModal.tsx
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { GraduationData } from "../type";

interface GraduationModalProps {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: (data: GraduationData) => Promise<void>;
  isProcessing: boolean;
}

export default function GraduationModal({
  open,
  onClose,
  selectedCount,
  onConfirm,
  isProcessing,
}: GraduationModalProps) {
  const [gradData, setGradData] = useState<GraduationData>({
    year: new Date().getFullYear(),
    note: "",
    batch: "",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    if (!gradData.batch || gradData.batch.length !== 4 || !/^\d{4}$/.test(gradData.batch)) {
      alert("Batch harus 4 digit angka (contoh: 2024)");
      return;
    }
    await onConfirm(gradData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                Konfirmasi Kelulusan
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {selectedCount} siswa akan dipindahkan ke daftar Alumni
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Tahun Lulus
              </label>
              <input
                type="number"
                value={gradData.year}
                onChange={(e) => setGradData({ ...gradData, year: Number(e.target.value) })}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Batch / Angkatan
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="2024"
                value={gradData.batch}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setGradData({ ...gradData, batch: val });
                }}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Keterangan
              </label>
              <textarea
                value={gradData.note}
                onChange={(e) => setGradData({ ...gradData, note: e.target.value })}
                placeholder="Contoh: Angkatan 12 - The Guardians"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-amber-500 outline-none h-28"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="mt-8 w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-2xl transition-all disabled:opacity-60 shadow-lg shadow-amber-600/30"
          >
            {isProcessing ? "Memproses..." : "Luluskan Sekarang"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}