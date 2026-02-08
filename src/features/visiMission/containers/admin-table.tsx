// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";

// // Theme Tokens
// const THEME_TOKENS: Record<any, any> = {
//   smkn13: {
//     "--brand-primary": "#10b981",
//     "--brand-primaryText": "#ffffff",
//     "--brand-accent": "#f59e0b",
//     "--brand-bg": "#0a0a0a",
//     "--brand-surface": "rgba(24,24,27,0.8)",
//     "--brand-surfaceText": "#f3f4f6",
//     "--brand-subtle": "#27272a",
//     "--brand-pop": "#3b82f6",
//   },
// };

// if (typeof document !== 'undefined') {
//   document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');
// }

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// // Alert Hook & Component
// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

//   const showAlert = useCallback((msg: string) => {
//     setAlert({ message: msg, isVisible: true });
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: "", isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-4 rounded-xl border p-4 text-sm",
//         isSuccess
//           ? "border-green-500/30 bg-green-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             "ml-4",
//             isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
//           )}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // Icons
// const Icon = ({ label }: { label: string }) => (
//   <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;

// // Input & TextArea Components
// const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50",
//       className
//     )}
//   />
// );

// const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 resize-y min-h-[100px]",
//       className
//     )}
//   />
// );

// // ListEditor untuk Misi (dengan urut naik/turun)
// interface ListEditorProps {
//   items: string[];
//   onChange: (list: string[]) => void;
//   onDelete: (index: number) => void;
//   placeholder?: string;
// }

// const ListEditor: React.FC<ListEditorProps> = ({
//   items,
//   onChange,
//   onDelete,
//   placeholder = "Masukkan misi...",
// }) => {
//   const setAt = (index: number, value: string) => {
//     const copy = [...items];
//     copy[index] = value;
//     onChange(copy);
//   };

//   const add = () => onChange([...items, ""]);
//   const up = (index: number) => {
//     if (index <= 0) return;
//     const copy = [...items];
//     [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
//     onChange(copy);
//   };
//   const down = (index: number) => {
//     if (index >= items.length - 1) return;
//     const copy = [...items];
//     [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
//     onChange(copy);
//   };

//   return (
//     <div className="space-y-3">
//       {items.map((text, index) => (
//         <div key={index} className="flex items-center gap-2">
//           <Input
//             value={text}
//             onChange={(e) => setAt(index, e.target.value)}
//             placeholder={placeholder}
//           />
//           <button type="button" onClick={() => up(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
//             ↑
//           </button>
//           <button type="button" onClick={() => down(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
//             ↓
//           </button>
//           <button
//             type="button"
//             onClick={() => onDelete(index)}
//             className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
//           >
//             Hapus
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={add}
//         className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
//       >
//         Tambah Misi
//       </button>
//     </div>
//   );
// };

// // Interface data
// interface VisiMisi {
//   id?: number;
//   vision: string;
//   missions: string[];
//   pillars: string[];
//   kpis: Array<{ indicator: string; target: number }>;
// }

// const DEFAULT_VISIMISI: VisiMisi = {
//   vision: "",
//   missions: [],
//   pillars: [],
//   kpis: [],
// };

// export function VisiMisi() {
//   const [data, setData] = useState<VisiMisi>(DEFAULT_VISIMISI);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   // Ambil schoolData dari hook useSchool
//   const schoolData = useSchool();
//   const schoolId = schoolData?.data[0]?.id;

//   const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

//   // Fetch data saat mount
//   useEffect(() => {
//     // 1. Jika schoolId belum ada, kita diam saja (masih loading school)
//     if (!schoolId) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const json = await res.json();
//         const records = json.success ? json.data : json;

//         if (Array.isArray(records) && records.length > 0) {
//           const record = records[0];
//           setData({
//             id: record.id,
//             vision: record.vision || "",
//             missions: Array.isArray(record.missions) ? record.missions : [],
//             pillars: Array.isArray(record.pillars) ? record.pillars : [],
//             kpis: Array.isArray(record.kpis)
//               ? record.kpis.map((k: any) => ({
//                   indicator: k.indicator || k.name || "",
//                   target: Number(k.target) || 0,
//                 }))
//               : [],
//           });
//         } else {
//           setData(DEFAULT_VISIMISI);
//         }
//       } catch (err) {
//         console.error("Fetch visi misi error:", err);
//         showAlert("Gagal memuat data visi misi");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [schoolId, showAlert]); // useEffect akan jalan ulang otomatis saat schoolId terisi

//   const update = (patch: Partial<VisiMisi>) => setData((prev) => ({ ...prev, ...patch }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!schoolId) {
//       showAlert("School ID tidak tersedia");
//       return;
//     }

//     setSaving(true);

//     // Validasi minimal
//     if (!data.vision.trim()) {
//       showAlert("Visi wajib diisi");
//       setSaving(false);
//       return;
//     }
//     if (data.missions.some((m) => !m.trim())) {
//       showAlert("Semua misi harus diisi");
//       setSaving(false);
//       return;
//     }

//     try {
//       const payload = {
//         vision: data.vision,
//         missions: data.missions,
//         pillars: data.pillars,
//         kpis: data.kpis,
//         schoolId,
//       };

//       let res: Response;

//       if (data.id) {
//         // UPDATE existing
//         res = await fetch(`${BASE_URL}/${data.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         // CREATE new
//         res = await fetch(BASE_URL, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) {
//         const errJson = await res.json().catch(() => ({}));
//         throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
//       }

//       const result = await res.json();

//       // Jika create, ambil id baru dari response
//       if (!data.id && result.data?.id) {
//         update({ id: result.data.id });
//       }

//       showAlert("Visi, Misi, Pilar & KPI berhasil disimpan!");
//     } catch (err: any) {
//       showAlert(`Gagal menyimpan: ${err.message}`);
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading || !schoolId) {
//     return (
//       <div className="text-center h-[60vh] flex items-center justify-center bg-white/5 rounded-xl border border-white/30 py-10 text-white/70">
//         Memuat data sekolah...
//       </div>
//     );
//   }

//   return (
//     <>
//     <div>
//       <AnimatePresence>
//         {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       </AnimatePresence>


//       <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex justify-start pt-4">
//             <button
//               type="submit"
//               disabled={saving}
//               onClick={() => handleSubmit}
//               className={clsx(
//                 "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
//                 saving
//                   ? "bg-emerald-700/50 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-500"
//               )}
//             >
//               <ISave />
//               {saving
//                 ? "Menyimpan..."
//                 : data.id
//                 ? "Perbarui Visi & Misi"
//                 : "Simpan Visi & Misi"}
//             </button>
//         </div>
//         <div className="space-y-3 bg-white/5 uppercase border border-white/30 rounded-xl py-6 mt-4 px-6">
//           {/* Visi */}
//           <div className="spacee-y-6">
//             <div className="mb-3 text-sm font-semibold text-white">Visi Sekolah</div>
//             <TextArea
//               rows={4}
//               value={data.vision}
//               onChange={(e) => update({ vision: e.target.value })}
//               placeholder="Tuliskan visi sekolah..."
//               disabled={saving}
//             />
//           </div>

//           {/* Misi */}
//           <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
//             <div className="mb-3 text-sm font-semibold text-white">Misi (multi baris)</div>
//             <ListEditor
//               items={data.missions}
//               onChange={(missions) => update({ missions })}
//               onDelete={(idx) => update({ missions: data.missions.filter((_, i) => i !== idx) })}
//               placeholder="Masukkan misi sekolah..."
//             />
//           </div>

//           {/* Pilar */}
//           <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
//             <div className="mb-3 text-sm font-semibold text-white">Pilar</div>
//             <div className="space-y-3">
//               {data.pillars.map((pillar, idx) => (
//                 <div key={idx} className="flex items-center gap-3">
//                   <Input
//                     value={pillar}
//                     onChange={(e) => {
//                       const newPillars = [...data.pillars];
//                       newPillars[idx] = e.target.value;
//                       update({ pillars: newPillars });
//                     }}
//                     placeholder="Nama pilar"
//                     disabled={saving}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => update({ pillars: data.pillars.filter((_, i) => i !== idx) })}
//                     className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20"
//                     disabled={saving}
//                   >
//                     Hapus
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => update({ pillars: [...data.pillars, ""] })}
//                 className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
//                 disabled={saving}
//               >
//                 Tambah Pilar
//               </button>
//             </div>
//           </div>

//           {/* KPI */}
//           <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
//             <div className="mb-3 text-sm font-semibold text-white">Indikator Kinerja (KPI)</div>
//             <div className="space-y-4">
//               {data.kpis.map((kpi, idx) => (
//                 <div key={idx} className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]">
//                   <Input
//                     value={kpi.indicator}
//                     onChange={(e) => {
//                       const newKpis = [...data.kpis];
//                       newKpis[idx].indicator = e.target.value;
//                       update({ kpis: newKpis });
//                     }}
//                     placeholder="Nama indikator / KPI"
//                     disabled={saving}
//                   />
//                   <Input
//                     type="text"
//                     value={kpi.target.toString()}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if (/^\d*$/.test(val)) {
//                         const newKpis = [...data.kpis];
//                         newKpis[idx].target = val === "" ? 0 : Number(val);
//                         update({ kpis: newKpis });
//                       }
//                     }}
//                     placeholder="Target"
//                     className="md:w-32"
//                     disabled={saving}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => update({ kpis: data.kpis.filter((_, i) => i !== idx) })}
//                     className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20 md:self-start"
//                     disabled={saving}
//                   >
//                     Hapus
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => update({ kpis: [...data.kpis, { indicator: "", target: 0 }] })}
//                 className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
//                 disabled={saving}
//               >
//                 Tambah KPI
//               </button>
//             </div>
//           </div>

//         </div>
//       </form>
//     </div>
//     </>
//   );
// }


import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Save, 
  Target, 
  Rocket, 
  ShieldCheck, 
  BarChart3, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Info,
  Sparkles
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={clsx(
        "fixed top-6 right-6 z-[100] min-w-[320px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
        isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
      )}
    >
      <div className="flex items-center justify-between gap-4 font-bold tracking-tight">
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-50">✕</button>
      </div>
    </motion.div>
  );
};

// === UI COMPONENTS ===
const Card = ({ children, title, icon: Icon, className }: any) => (
  <div className={clsx("bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/20 transition-all", className)}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">{title}</h3>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-600" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full rounded-[2rem] border border-white/5 bg-white/5 px-6 py-5 text-lg font-medium text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-700 min-h-[160px] italic leading-relaxed" />
);

// === INTERFACE ===
interface VisiMisi {
  id?: number;
  vision: string;
  missions: string[];
  pillars: string[];
  kpis: Array<{ indicator: string; target: number }>;
}

const DEFAULT_VISIMISI: VisiMisi = { vision: "", missions: [], pillars: [], kpis: [] };

export function VisiMisi() {
  const [data, setData] = useState<VisiMisi>(DEFAULT_VISIMISI);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const { data: schoolResponse } = useSchool();
  const schoolId = schoolResponse?.[0]?.id;
  const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

  useEffect(() => {
    if (!schoolId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
        const json = await res.json();
        const records = json.success ? json.data : json;
        if (Array.isArray(records) && records.length > 0) {
          setData({
            ...records[0],
            missions: records[0].missions || [],
            pillars: records[0].pillars || [],
            kpis: (records[0].kpis || []).map((k: any) => ({ indicator: k.indicator || k.name || "", target: Number(k.target) || 0 }))
          });
        }
      } catch (err) { showAlert("Gagal sinkronisasi data"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [schoolId, showAlert]);

  const update = (patch: Partial<VisiMisi>) => setData(p => ({ ...p, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setSaving(true);
    try {
      const payload = { ...data, schoolId };
      const res = await fetch(data.id ? `${BASE_URL}/${data.id}` : BASE_URL, {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      if (!data.id && result.data?.id) update({ id: result.data.id });
      showAlert("Visi & Misi Berhasil Disinkronkan");
    } catch (err) { showAlert("Gagal menyimpan data"); }
    finally { setSaving(false); }
  };

  if (loading || !schoolId) return <div className="p-20 text-center font-black tracking-widest text-zinc-700 animate-pulse">BOOTING STRATEGY SYSTEM...</div>;

  return (
    <div className="pb-20">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={16} className="text-blue-500 fill-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Institutional Strategy</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              Visi & <span className="text-blue-600">Misi</span> Sekolah
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Tujuan jangka panjang</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          >
            {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
            <span className="uppercase tracking-widest text-sm">{saving ? "Saving..." : "Deploy Strategy"}</span>
          </button>
        </header>

        {/* --- BENTO GRID --- */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* VISI - Main Bento (Span 12) */}
          <Card title="Core Vision" icon={Target} className="md:col-span-12 !bg-blue-600/5 !border-blue-600/20">
            <TextArea 
              value={data.vision} 
              onChange={(e) => update({ vision: e.target.value })} 
              placeholder="E.g. Menjadi institusi pendidikan vokasi kelas dunia yang menghasilkan pemimpin masa depan..."
            />
            <div className="mt-4 flex items-center gap-2 text-blue-500/60 text-xs font-bold italic">
              <Info size={14} />
              <span>Visi harus bersifat jangka panjang, inspiratif, dan mudah diingat.</span>
            </div>
          </Card>

          {/* MISI - (Span 7) */}
          <Card title="Strategic Missions" icon={Rocket} className="md:col-span-7">
            <div className="space-y-4">
              {data.missions.map((m, idx) => (
                <div key={idx} className="flex gap-3 group/item">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => {
                      if (idx === 0) return;
                      const copy = [...data.missions];
                      [copy[idx-1], copy[idx]] = [copy[idx], copy[idx-1]];
                      update({ missions: copy });
                    }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => {
                      if (idx === data.missions.length -1) return;
                      const copy = [...data.missions];
                      [copy[idx+1], copy[idx]] = [copy[idx], copy[idx+1]];
                      update({ missions: copy });
                    }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowDown size={14}/></button>
                  </div>
                  <Input 
                    value={m} 
                    onChange={(e) => {
                      const copy = [...data.missions];
                      copy[idx] = e.target.value;
                      update({ missions: copy });
                    }}
                    placeholder={`Misi poin ke-${idx + 1}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => update({ missions: data.missions.filter((_, i) => i !== idx) })}
                    className="p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ missions: [...data.missions, ""] })}
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-zinc-500 hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Tambah Misi Baru
              </button>
            </div>
          </Card>

          {/* PILLARS - (Span 5) */}
          <Card title="Foundational Pillars" icon={ShieldCheck} className="md:col-span-5">
            <div className="space-y-3">
              {data.pillars.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input 
                    value={p} 
                    onChange={(e) => {
                      const copy = [...data.pillars];
                      copy[idx] = e.target.value;
                      update({ pillars: copy });
                    }}
                    placeholder="Contoh: Integritas"
                  />
                  <button 
                    type="button"
                    onClick={() => update({ pillars: data.pillars.filter((_, i) => i !== idx) })}
                    className="text-zinc-600 hover:text-red-500 p-2"
                  ><Trash2 size={16}/></button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ pillars: [...data.pillars, ""] })}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-black uppercase tracking-widest transition-all"
              >+ Tambah Pilar</button>
            </div>
          </Card>

          {/* KPI - (Span 12) */}
          <Card title="Key Performance Indicators (KPI)" icon={BarChart3} className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.kpis.map((k, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-[1.5rem] border border-white/5 group/kpi">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Indicator Name</p>
                    <Input 
                      value={k.indicator}
                      onChange={(e) => {
                        const copy = [...data.kpis];
                        copy[idx].indicator = e.target.value;
                        update({ kpis: copy });
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Target %</p>
                    <Input 
                      type="number"
                      value={k.target}
                      onChange={(e) => {
                        const copy = [...data.kpis];
                        copy[idx].target = Number(e.target.value);
                        update({ kpis: copy });
                      }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => update({ kpis: data.kpis.filter((_, i) => i !== idx) })}
                    className="self-end mb-1 p-3 text-zinc-700 hover:text-red-500 transition-colors"
                  ><Trash2 size={18}/></button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ kpis: [...data.kpis, { indicator: "", target: 0 }] })}
                className="h-full min-h-[80px] rounded-[1.5rem] border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 text-zinc-600 hover:text-blue-500 transition-all font-black text-xs uppercase tracking-[0.2em]"
              >+ Add New KPI Metric</button>
            </div>
          </Card>

        </motion.div>
      </form>
    </div>
  );
}