// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil");
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-5 rounded-xl border p-4 text-sm shadow-sm",
//         isSuccess ? "border-green-500/30 bg-green-900/20 text-green-200" : "border-red-500/30 bg-red-900/20 text-red-200"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line leading-relaxed">{message}</div>
//         <button type="button" onClick={onClose} className="ml-3 text-lg font-bold">✕</button>
//       </div>
//     </motion.div>
//   );
// };

// const IDelete = () => <span aria-hidden className="inline-block align-middle select-none w-4 text-center">🗑️</span>;

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
//   const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
//   return { alert, showAlert, hideAlert };
// };

// interface CommentItem {
//   id: number;
//   name: string;
//   email: string;
//   comment: string;
//   rating: number;
//   createdAt: string;
//   schoolId: number;
// }

// const API_BASE = "https://be-school.kiraproject.id/rating";

// export default function KomentarMain() {
//   const [comments, setComments] = useState<CommentItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const { alert, showAlert, hideAlert } = useAlert();

//   const fetchData = async () => {
//     if (!schoolId) {
//       showAlert("School ID tidak ditemukan");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
//       setComments(json.data);
//     } catch (err: any) {
//       showAlert(`Gagal memuat komentar: ${err.message}`);
//       setComments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (schoolId) fetchData();
//   }, [schoolId]);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Gagal menghapus");
//       showAlert("Komentar berhasil dihapus");
//       await fetchData();
//     } catch (err: any) {
//       showAlert(`Gagal menghapus: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hitung rata-rata rating
//   const averageRating = comments.length > 0
//     ? (comments.reduce((sum, item) => sum + item.rating, 0) / comments.length).toFixed(1)
//     : "0.0";

//   const totalComments = comments.length;

//   return (
//     <div className="space-y-6 py-4">
//       <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
//         <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//         {/* Tampilan rata-rata rating */}
//         <div className="mb-6 flex flex-wrap items-center justify-start gap-4">
//           <div className="flex items-center gap-3 bg-black/30 px-5 py-3 rounded-xl border border-white/10">
//             <div className="text-3xl font-bold text-yellow-400">
//               {averageRating}
//             </div>
//             <div className="flex flex-col">
//               <div className="text-yellow-400 text-lg leading-none">
//                 {"★".repeat(Math.round(Number(averageRating)))}
//                 {"☆".repeat(5 - Math.round(Number(averageRating)))}
//               </div>
//               <div className="text-xs text-white/60">Rata-rata Rating</div>
//             </div>
//           </div>
//           <div>
//             <p className="text-sm text-white/60 mt-1">
//               Total {totalComments} ulasan
//             </p>
//           </div>

//         </div>

//         {loading ? (
//           <div className="py-12 text-center text-white/60 flex items-center justify-center gap-3">
//             <FaSpinner className="animate-spin" /> Memuat...
//           </div>
//         ) : comments.length === 0 ? (
//           <div className="py-12 text-center text-white/50">Belum ada komentar untuk sekolah ini.</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {comments.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/30 transition group"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="font-semibold text-lg text-white group-hover:text-white/90 transition">
//                     {item.name}
//                   </div>
//                   <div className="flex items-center gap-1 text-yellow-400 text-lg">
//                     {"★".repeat(item.rating)}
//                     {"☆".repeat(5 - item.rating)}
//                   </div>
//                 </div>

//                 <div className="text-xs text-gray-400 mb-3">
//                   {new Date(item.createdAt).toLocaleString("id-ID", {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>

//                 <p className="text-sm text-white/80 line-clamp-5 flex-1">{item.comment}</p>

//                 <div className="mt-5 pt-4 border-t border-white/10">
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     disabled={loading}
//                     className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/20 px-4 py-2.5 text-sm text-red-300 hover:bg-red-600/40 transition disabled:opacity-50"
//                   >
//                     <IDelete /> Hapus Komentar
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Loader2,
  MessageCircleCode,
  MessageSquare,
  Quote,
  Star,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// === TYPES ===
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

// === ALERT SYSTEM ===
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-8 right-8 z-[99999] p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-center gap-4 ${
        isSuccess ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSuccess ? "bg-blue-500/20" : "bg-red-500/20"}`}>
        {isSuccess ? "✓" : "!"}
      </div>
      <div className="text-sm font-bold tracking-tight">{message}</div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
    </motion.div>
  );
};

export default function KomentarMain() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  };

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setComments(json.data || []);
    } catch (err) {
      showAlert("Gagal menarik data ulasan dari pusat data.");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus ulasan ini secara permanen?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showAlert("Ulasan berhasil dimusnahkan");
      fetchData();
    } catch (err) {
      showAlert("Gagal menghapus ulasan.");
      setLoading(false);
    }
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, item) => sum + item.rating, 0) / comments.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen space-y-10">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={() => setAlert({ ...alert, isVisible: false })} />}
      </AnimatePresence>

      {/* Hero Stats Section */}
      <div className="relative group border-b border-white/5 pb-11">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
              <MessageCircleCode size={14} /> Feedback Management
            </div>
            <h1 className="text-4xl uppercase font-black text-white tracking-tighter">
              Review <span className="text-blue-600 italic">&</span> Feedback
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Kelola ulasan dan masukan</p>
          </div>

          <div className="flex flex-wrap md:justify-center gap-6">
            <div className="bg-black/40 border border-white/10 rounded-3xl py-4 px-6 flex items-center gap-5 backdrop-blur-xl">
              <div className="text-4xl font-black text-blue-500 tracking-tighter">{averageRating}</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(Number(averageRating)) ? "#3b82f6" : "transparent"} 
                    className={i < Math.round(Number(averageRating)) ? "text-blue-500" : "text-zinc-700"} />
                  ))}
                </div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Avg Rating</div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-3xl py-4 px-6 flex items-center gap-5 backdrop-blur-xl">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">{comments.length}</div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Testimonials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Grid */}
      {loading && comments.length === 0 ? (
        <div className="py-40 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Synchronizing data...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-32 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <MessageSquare size={32} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Hening...</h3>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Belum ada suara dari audiens saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comments.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              className="group bg-white/[0.03] border border-white/10 rounded-[32px] p-8 hover:bg-blue-600/[0.03] hover:border-blue-500/30 transition-all duration-500 relative"
            >
              {/* Star Badge */}
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-2xl bg-[#0B1220] border border-white/10 flex flex-col items-center justify-center shadow-2xl">
                 <span className="text-xs font-black text-blue-500 leading-none">{item.rating}</span>
                 <Star size={10} fill="#3b82f6" className="text-blue-500 mt-0.5" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center font-black text-white text-lg shadow-lg`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-black truncate tracking-tight uppercase italic text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
                    <Calendar size={10} />
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="relative h-[120px] overflow-hidden">
                <Quote size={24} className="text-blue-500/20 absolute -left-2 -top-2" />
                <p className="text-zinc-400 text-sm leading-relaxed font-medium pl-4 line-clamp-5">
                  {item.comment}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 transition-opacity">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  <Trash2 size={14} /> Delete Feedback
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}