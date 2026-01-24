import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-5 rounded-xl border p-4 text-sm shadow-sm",
        isSuccess ? "border-green-500/30 bg-green-900/20 text-green-200" : "border-red-500/30 bg-red-900/20 text-red-200"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line leading-relaxed">{message}</div>
        <button type="button" onClick={onClose} className="ml-3 text-lg font-bold">✕</button>
      </div>
    </motion.div>
  );
};

const IDelete = () => <span aria-hidden className="inline-block align-middle select-none w-4 text-center">🗑️</span>;

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

interface CommentItem {
  id: number;
  name: string;
  email: string;
  comment: string;
  rating: number;
  createdAt: string;
  schoolId: number;
}

const API_BASE = "https://be-school.kiraproject.id/rating";

export default function KomentarMain() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const { alert, showAlert, hideAlert } = useAlert();

  const fetchData = async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
      setComments(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat komentar: ${err.message}`);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Komentar berhasil dihapus");
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hitung rata-rata rating
  const averageRating = comments.length > 0
    ? (comments.reduce((sum, item) => sum + item.rating, 0) / comments.length).toFixed(1)
    : "0.0";

  const totalComments = comments.length;

  return (
    <div className="space-y-6 py-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
        <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

        {/* Tampilan rata-rata rating */}
        <div className="mb-6 flex flex-wrap items-center justify-start gap-4">
          <div className="flex items-center gap-3 bg-black/30 px-5 py-3 rounded-xl border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">
              {averageRating}
            </div>
            <div className="flex flex-col">
              <div className="text-yellow-400 text-lg leading-none">
                {"★".repeat(Math.round(Number(averageRating)))}
                {"☆".repeat(5 - Math.round(Number(averageRating)))}
              </div>
              <div className="text-xs text-white/60">Rata-rata Rating</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/60 mt-1">
              Total {totalComments} ulasan
            </p>
          </div>

        </div>

        {loading ? (
          <div className="py-12 text-center text-white/60 flex items-center justify-center gap-3">
            <FaSpinner className="animate-spin" /> Memuat...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-white/50">Belum ada komentar untuk sekolah ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/30 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-lg text-white group-hover:text-white/90 transition">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-lg">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </div>
                </div>

                <div className="text-xs text-gray-400 mb-3">
                  {new Date(item.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <p className="text-sm text-white/80 line-clamp-5 flex-1">{item.comment}</p>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/20 px-4 py-2.5 text-sm text-red-300 hover:bg-red-600/40 transition disabled:opacity-50"
                  >
                    <IDelete /> Hapus Komentar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}