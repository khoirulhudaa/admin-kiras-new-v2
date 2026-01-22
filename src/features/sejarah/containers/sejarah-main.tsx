// import { AnimatePresence, motion } from "framer-motion";
// import React, { useState, useEffect, useCallback } from "react";

// // Theme Tokens
// const THEME_TOKENS: Record<string, React.CSSProperties> = {
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

// // Apply theme
// if (typeof document !== "undefined") {
//   document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
//     .map(([k, v]) => `${k}: ${v};`)
//     .join("");
// }

// // Utility: clsx
// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// // Custom useAlert Hook
// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

//   const showAlert = useCallback((message: string) => {
//     setAlert({ message, isVisible: true });
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: "", isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// // Alert Component
// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.includes("successfully");

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

// // Mini Icons
// const Icon = ({ label }: { label: string }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;

// // Utility Components
// interface FieldProps {
//   label?: string;
//   hint?: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   className?: string;
// }

// const Input: React.FC<InputProps> = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//   className?: string;
// }

// const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// // Data Interface
// interface Sejarah {
//   stats: {
//     tahunBerdiri: number;
//     jumlahKepsek: number;
//     kompetensiKeahlian: number;
//   };
//   timeline: Array<{
//     id?: number;
//     year: string;
//     title: string;
//     text: string;
//     detailUrl: string;
//     sortOrder?: number;
//   }>;
//   kepsek: Array<{
//     id?: number;
//     name: string;
//     period: string;
//     foto?: string | File;
//     sortOrder?: number;
//   }>;
//   catatanKS: {
//     title: string;
//     text: string;
//     updated: string;
//   } | null;
//   serverTimelineIndices: number[];
//   serverKepsekIndices: number[];
// }

// // Default Data
// const DEFAULT_SEJARAH: Sejarah = {
//   stats: {
//     tahunBerdiri: 1976,
//     jumlahKepsek: 12,
//     kompetensiKeahlian: 8,
//   },
//   timeline: [],
//   kepsek: [],
//   catatanKS: null,
//   serverTimelineIndices: [],
//   serverKepsekIndices: [],
// };

// // Timeline Editor
// interface TimelineEditorProps {
//   items: Sejarah["timeline"];
//   onChange: (list: Sejarah["timeline"]) => void;
//   onDelete: (index: number) => void;
//   disabled: boolean;
// }

// const TimelineEditor: React.FC<TimelineEditorProps> = ({ items, onChange, onDelete, disabled }) => {
//   const setAt = (index: number, field: keyof Sejarah["timeline"][0], value: string) => {
//     const copy = [...items];
//     copy[index] = { ...copy[index], [field]: value };
//     onChange(copy);
//   };

//   const add = () => onChange([...items, { year: "", title: "", text: "", detailUrl: "#", sortOrder: items.length }]);

//   const up = (index: number) => {
//     if (index <= 0) return;
//     const copy = [...items];
//     [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
//     copy.forEach((item, i) => (item.sortOrder = i));
//     onChange(copy);
//   };

//   const down = (index: number) => {
//     if (index >= items.length - 1) return;
//     const copy = [...items];
//     [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
//     copy.forEach((item, i) => (item.sortOrder = i));
//     onChange(copy);
//   };

//   return (
//     <div className="space-y-2">
//       {items.map((item, index) => (
//         <div key={index} className="grid gap-2 md:grid-cols-2">
//           <Field label="Tahun">
//             <Input
//               value={item.year}
//               onChange={(e) => setAt(index, "year", e.target.value)}
//               placeholder="Tahun"
//               disabled={disabled}
//             />
//           </Field>
//           <Field label="Judul">
//             <Input
//               value={item.title}
//               onChange={(e) => setAt(index, "title", e.target.value)}
//               placeholder="Judul"
//               disabled={disabled}
//             />
//           </Field>
//           <Field label="Deskripsi" className="md:col-span-2">
//             <TextArea
//               value={item.text}
//               onChange={(e) => setAt(index, "text", e.target.value)}
//               placeholder="Deskripsi"
//               rows={3}
//               disabled={disabled}
//             />
//           </Field>
//           <Field label="Detail URL" className="md:col-span-2">
//             <Input
//               value={item.detailUrl}
//               onChange={(e) => setAt(index, "detailUrl", e.target.value)}
//               placeholder="Detail URL"
//               disabled={disabled}
//             />
//           </Field>
//           <div className="md:col-span-2 flex gap-2 justify-end">
//             <button
//               type="button"
//               onClick={() => up(index)}
//               className="rounded-lg border border-white/20 px-2 py-1 text-xs"
//               disabled={disabled}
//             >
//               ↑
//             </button>
//             <button
//               type="button"
//               onClick={() => down(index)}
//               className="rounded-lg border border-white/20 px-2 py-1 text-xs"
//               disabled={disabled}
//             >
//               ↓
//             </button>
//             <button
//               type="button"
//               onClick={() => onDelete(index)}
//               className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
//               disabled={disabled}
//             >
//               Hapus
//             </button>
//           </div>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={add}
//         className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300"
//         disabled={disabled}
//       >
//         Tambah Timeline
//       </button>
//     </div>
//   );
// };

// // Kepsek Editor
// interface KepsekEditorProps {
//   items: Sejarah["kepsek"];
//   onChange: (list: Sejarah["kepsek"]) => void;
//   onDelete: (index: number) => void;
//   disabled: boolean;
// }

// const KepsekEditor: React.FC<KepsekEditorProps> = ({ items, onChange, onDelete, disabled }) => {
//   const setAt = (index: number, field: keyof Sejarah["kepsek"][0], value: string | File) => {
//     const copy = [...items];
//     copy[index] = { ...copy[index], [field]: value };
//     onChange(copy);
//   };

//   const add = () => onChange([...items, { name: "", period: "", sortOrder: items.length }]);

//   const up = (index: number) => {
//     if (index <= 0) return;
//     const copy = [...items];
//     [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
//     copy.forEach((item, i) => (item.sortOrder = i));
//     onChange(copy);
//   };

//   const down = (index: number) => {
//     if (index >= items.length - 1) return;
//     const copy = [...items];
//     [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
//     copy.forEach((item, i) => (item.sortOrder = i));
//     onChange(copy);
//   };

//   return (
//     <div className="space-y-2">
//       {items.map((item, index) => (
//         <div key={index} className="grid gap-2 md:grid-cols-2">
//           <Field label="Nama">
//             <Input
//               value={item.name}
//               onChange={(e) => setAt(index, "name", e.target.value)}
//               placeholder="Nama Kepala Sekolah"
//               disabled={disabled}
//             />
//           </Field>
//           <Field label="Periode">
//             <Input
//               value={item.period}
//               onChange={(e) => setAt(index, "period", e.target.value)}
//               placeholder="Periode (e.g., 2020 - Sekarang)"
//               disabled={disabled}
//             />
//           </Field>
//           <Field label="Foto" className="md:col-span-2">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   setAt(index, "foto", e.target.files[0]);
//                 }
//               }}
//               disabled={disabled}
//               className="w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//             />
//             {item.foto && typeof item.foto === "string" && (
//               <div className="mt-2">
//                 <img src={'https://dev.kiraproject.id'+item.foto} alt="Preview" className="h-20 w-20 object-cover rounded" />
//               </div>
//             )}
//           </Field>
//           <div className="md:col-span-2 flex gap-2 justify-end">
//             <button
//               type="button"
//               onClick={() => up(index)}
//               className="rounded-lg border border-white/20 px-2 py-1 text-xs"
//               disabled={disabled}
//             >
//               ↑
//             </button>
//             <button
//               type="button"
//               onClick={() => down(index)}
//               className="rounded-lg border border-white/20 px-2 py-1 text-xs"
//               disabled={disabled}
//             >
//               ↓
//             </button>
//             <button
//               type="button"
//               onClick={() => onDelete(index)}
//               className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
//               disabled={disabled}
//             >
//               Hapus
//             </button>
//           </div>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={add}
//         className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300"
//         disabled={disabled}
//       >
//         Tambah Kepala Sekolah
//       </button>
//     </div>
//   );
// };

// export function Sejarah() {
//   const [local, setLocal] = useState<Sejarah>(DEFAULT_SEJARAH);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const BASE_URL = "https://dev.kiraproject.id/api/sejarah";
//   const getToken = () => localStorage.getItem("token");

//   // Common headers with token
//   const getHeaders = () => {
//     const token = getToken();
//     return {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(BASE_URL, {
//           headers: getHeaders(),
//         });
//         if (!response.ok) throw new Error("Failed to fetch data");
//         const data = await response.json();
//         setLocal({
//           stats: data.stats ?? DEFAULT_SEJARAH.stats, // Fallback to default stats if API response is missing stats
//           timeline: data.timeline?.map((item: any, i: number) => ({ ...item, sortOrder: i })) ?? [],
//           kepsek: data.kepsek?.map((item: any, i: number) => ({ ...item, sortOrder: i })) ?? [],
//           catatanKS: data.catatanKS ?? null,
//           serverTimelineIndices: Array.from({ length: data.timeline?.length ?? 0 }, (_, i) => i),
//           serverKepsekIndices: Array.from({ length: data.kepsek?.length ?? 0 }, (_, i) => i),
//         });
//       } catch (err) {
//         showAlert("Failed to load data from API");
//         console.error(err);
//         // Ensure local.stats is initialized even on error
//         setLocal(DEFAULT_SEJARAH);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [showAlert]);

//   const touch = (patch: Partial<Sejarah>) => {
//     setLocal({ ...local, ...patch });
//   };

//   // Stats Handlers
//   const setStats = (field: keyof Sejarah["stats"], value: number) => {
//     touch({ stats: { ...local.stats, [field]: value } });
//   };

//   const handleSubmitStats = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/stats`, {
//         method: "POST",
//         headers: { ...getHeaders(), "Content-Type": "application/json" },
//         body: JSON.stringify(local.stats),
//       });
//       if (!response.ok) throw new Error("Failed to save stats");
//       showAlert("Stats saved successfully!");
//     } catch (err) {
//       showAlert("Failed to save stats");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Timeline Handlers
//   const setTimeline = (list: Sejarah["timeline"]) => touch({ timeline: list });

//   const handleDeleteTimeline = async (index: number) => {
//     const item = local.timeline[index];
//     if (!local.serverTimelineIndices.includes(index) || !item.id) {
//       // Item is local-only, delete from state
//       setTimeline(local.timeline.filter((_, idx) => idx !== index));
//       showAlert("Timeline deleted successfully");
//       return;
//     }

//     // Item exists on server, attempt API delete
//     try {
//       const response = await fetch(`${BASE_URL}/timeline/${item.id}`, {
//         method: "DELETE",
//         headers: getHeaders(),
//       });
//       if (!response.ok) throw new Error("Failed to delete timeline");
//       setTimeline(local.timeline.filter((_, idx) => idx !== index));
//       touch({ serverTimelineIndices: local.serverTimelineIndices.filter((i) => i !== index) });
//       showAlert("Timeline deleted successfully");
//     } catch (err) {
//       showAlert("Failed to delete timeline");
//       console.error(err);
//     }
//   };

//   const handleSubmitTimeline = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       for (const [index, item] of local.timeline.entries()) {
//         if (!local.serverTimelineIndices.includes(index)) {
//           // New item, use POST
//           const response = await fetch(`${BASE_URL}/timeline`, {
//             method: "POST",
//             headers: { ...getHeaders(), "Content-Type": "application/json" },
//             body: JSON.stringify({
//               year: item.year,
//               title: item.title,
//               text: item.text,
//               detailUrl: item.detailUrl,
//               sortOrder: item.sortOrder,
//             }),
//           });
//           if (!response.ok) throw new Error("Failed to save timeline");
//           const data = await response.json();
//           item.id = data.id; // Update with server-assigned ID
//         } else if (item.id) {
//           // Existing item, use PUT
//           const response = await fetch(`${BASE_URL}/timeline/${item.id}`, {
//             method: "PUT",
//             headers: { ...getHeaders(), "Content-Type": "application/json" },
//             body: JSON.stringify({
//               title: item.title,
//               text: item.text,
//             }),
//           });
//           if (!response.ok) throw new Error("Failed to update timeline");
//         }
//       }
//       touch({
//         serverTimelineIndices: Array.from({ length: local.timeline.length }, (_, i) => i),
//       });
//       showAlert("Timeline saved successfully!");
//     } catch (err) {
//       showAlert("Failed to save timeline");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Kepsek Handlers
//   const setKepsek = (list: Sejarah["kepsek"]) => touch({ kepsek: list });

//   const handleDeleteKepsek = async (index: number) => {
//     const item = local.kepsek[index];
//     if (!local.serverKepsekIndices.includes(index) || !item.id) {
//       // Item is local-only, delete from state
//       setKepsek(local.kepsek.filter((_, idx) => idx !== index));
//       showAlert("Kepala Sekolah deleted successfully");
//       return;
//     }

//     // Item exists on server, attempt API delete
//     try {
//       const response = await fetch(`${BASE_URL}/kepsek/${item.id}`, {
//         method: "DELETE",
//         headers: getHeaders(),
//       });
//       if (!response.ok) throw new Error("Failed to delete kepsek");
//       setKepsek(local.kepsek.filter((_, idx) => idx !== index));
//       touch({ serverKepsekIndices: local.serverKepsekIndices.filter((i) => i !== index) });
//       showAlert("Kepala Sekolah deleted successfully");
//     } catch (err) {
//       showAlert("Failed to delete kepsek");
//       console.error(err);
//     }
//   };

//   const handleSubmitKepsek = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       for (const [index, item] of local.kepsek.entries()) {
//         const formData = new FormData();
//         formData.append("name", item.name);
//         formData.append("period", item.period);
//         formData.append("sortOrder", item.sortOrder?.toString() || "0");
//         if (item.foto instanceof File) {
//           formData.append("foto", item.foto);
//         }

//         if (!local.serverKepsekIndices.includes(index)) {
//           // New item, use POST
//           const response = await fetch(`${BASE_URL}/kepsek`, {
//             method: "POST",
//             headers: getHeaders(),
//             body: formData,
//           });
//           if (!response.ok) throw new Error("Failed to save kepsek");
//           const data = await response.json();
//           item.id = data.id; // Update with server-assigned ID
//           item.foto = data.foto; // Update with server-provided URL
//         } else if (item.id) {
//           // Existing item, use PUT
//           const response = await fetch(`${BASE_URL}/kepsek/${item.id}`, {
//             method: "PUT",
//             headers: getHeaders(),
//             body: formData,
//           });
//           if (!response.ok) throw new Error("Failed to update kepsek");
//           const data = await response.json();
//           item.foto = data.foto; // Update with server-provided URL
//         }
//       }
//       touch({
//         serverKepsekIndices: Array.from({ length: local.kepsek.length }, (_, i) => i),
//       });
//       showAlert("Kepala Sekolah saved successfully!");
//     } catch (err) {
//       showAlert("Failed to save kepsek");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Catatan KS Handlers
//   const setCatatanKS = (field: keyof NonNullable<Sejarah["catatanKS"]>, value: string) => {
//     touch({
//       catatanKS: {
//         ...local.catatanKS,
//         [field]: value,
//       } as NonNullable<Sejarah["catatanKS"]>,
//     });
//   };

//   const handleSubmitCatatanKS = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!local.catatanKS) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/catatanKS`, {
//         method: "POST",
//         headers: { ...getHeaders(), "Content-Type": "application/json" },
//         body: JSON.stringify(local.catatanKS),
//       });
//       if (!response.ok) throw new Error("Failed to save catatanKS");
//       showAlert("Catatan Kepala Sekolah saved successfully!");
//     } catch (err) {
//       showAlert("Failed to save catatanKS");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!local.stats) {
//     return (
//       <div className="space-y-6 py-4 mb-10">
//         <AnimatePresence>
//           {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//         </AnimatePresence>
//         {loading && <div className="text-sm text-white/70">Loading...</div>}
//         <div className="text-sm text-white/70">Initializing data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 py-4 mb-10">
//       <AnimatePresence>
//         {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       </AnimatePresence>
//       {loading && <div className="text-sm text-white/70">Loading...</div>}

//       {/* Stats Section */}
//       <form onSubmit={handleSubmitStats} className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 text-sm font-semibold">Statistik</div>
//         <div className="grid gap-2 md:grid-cols-3">
//           <Field label="Tahun Berdiri">
//             <Input
//               type="number"
//               value={local.stats.tahunBerdiri}
//               onChange={(e) => setStats("tahunBerdiri", Number(e.target.value))}
//               placeholder="Tahun Berdiri"
//               disabled={loading}
//             />
//           </Field>
//           <Field label="Jumlah Kepala Sekolah">
//             <Input
//               type="number"
//               value={local.stats.jumlahKepsek}
//               onChange={(e) => setStats("jumlahKepsek", Number(e.target.value))}
//               placeholder="Jumlah Kepala Sekolah"
//               disabled={loading}
//             />
//           </Field>
//           <Field label="Kompetensi Keahlian">
//             <Input
//               type="number"
//               value={local.stats.kompetensiKeahlian}
//               onChange={(e) => setStats("kompetensiKeahlian", Number(e.target.value))}
//               placeholder="Kompetensi Keahlian"
//               disabled={loading}
//             />
//           </Field>
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             type="submit"
//             className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//             disabled={loading}
//           >
//             <ISave className="h-4 w-4" /> Simpan Statistik
//           </button>
//         </div>
//       </form>

//       {/* Timeline Section */}
//       <form onSubmit={handleSubmitTimeline} className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 text-sm font-semibold">Timeline</div>
//         <TimelineEditor
//           items={local.timeline}
//           onChange={setTimeline}
//           onDelete={handleDeleteTimeline}
//           disabled={loading}
//         />
//         <div className="flex justify-end mt-4">
//           <button
//             type="submit"
//             className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//             disabled={loading}
//           >
//             <ISave className="h-4 w-4" /> Simpan Timeline
//           </button>
//         </div>
//       </form>

//       {/* Kepsek Section */}
//       <form onSubmit={handleSubmitKepsek} className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 text-sm font-semibold">Kepala Sekolah</div>
//         <KepsekEditor
//           items={local.kepsek}
//           onChange={setKepsek}
//           onDelete={handleDeleteKepsek}
//           disabled={loading}
//         />
//         <div className="flex justify-end mt-4">
//           <button
//             type="submit"
//             className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//             disabled={loading}
//           >
//             <ISave className="h-4 w-4" /> Simpan Kepala Sekolah
//           </button>
//         </div>
//       </form>

//       {/* Catatan KS Section */}
//       <form onSubmit={handleSubmitCatatanKS} className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 text-sm font-semibold">Catatan Kepala Sekolah</div>
//         <Field label="Judul">
//           <Input
//             value={local.catatanKS?.title || ""}
//             onChange={(e) => setCatatanKS("title", e.target.value)}
//             placeholder="Judul Catatan"
//             disabled={loading}
//           />
//         </Field>
//         <Field label="Teks">
//           <TextArea
//             value={local.catatanKS?.text || ""}
//             onChange={(e) => setCatatanKS("text", e.target.value)}
//             placeholder="Teks Catatan"
//             rows={5}
//             disabled={loading}
//           />
//         </Field>
//         <Field label="Tanggal Update">
//           <Input
//             value={local.catatanKS?.updated || ""}
//             onChange={(e) => setCatatanKS("updated", e.target.value)}
//             placeholder="Tanggal Update"
//             disabled={loading}
//           />
//         </Field>
//         <div className="flex justify-end mt-4">
//           <button
//             type="submit"
//             className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//             disabled={loading || !local.catatanKS}
//           >
//             <ISave className="h-4 w-4" /> Simpan Catatan Kepala Sekolah
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import { Edit, Trash2, X, Plus, Save, Upload } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSchool } from "@/features/schools";

// Theme (sama seperti contoh program)
const THEME = {
  bg: "#0B1220",
  surface: "#111827",
  primary: "#065F46",
  accent: "#10B981",
  text: "#F9FAFB",
  textSecondary: "#E5E7EB",
  border: "#374151",
  danger: "#EF4444",
};

const BASE_URL = "https://be-school.kiraproject.id";

// Alert Component
interface AlertState {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
  if (!alert.visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-4 rounded-xl border ${
        alert.type === "success"
          ? "bg-green-900/30 border-green-500/40 text-green-300"
          : "bg-red-900/30 border-red-500/40 text-red-300"
      }`}
    >
      <div className="flex justify-between items-start">
        <span>{alert.message}</span>
        <button onClick={onClose} className="text-lg ml-3">×</button>
      </div>
    </motion.div>
  );
};

// Simple Input & TextArea
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
  />
);

const TextArea = (props: any) => (
  <textarea
    {...props}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none resize-y min-h-[100px]"
  />
);

// Modal untuk Edit/Create Sejarah (karena hanya 1 record per school, lebih ke "edit data sejarah")
const SejarahModal = ({
  open,
  onClose,
  initialData = {},
  onSubmit,
  isNew,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isNew: boolean;
}) => {
  const [form, setForm] = useState({
    deskripsi: initialData?.deskripsi || "",
    tahunBerdiri: initialData?.tahunBerdiri || "",
    jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
    timeline: initialData?.timeline || [],
    daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
  });

  const [kepsekFiles, setKepsekFiles] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      setForm({
        deskripsi: initialData?.deskripsi || "",
        tahunBerdiri: initialData?.tahunBerdiri || "",
        jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
        timeline: initialData?.timeline || [],
        daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
      });
      setKepsekFiles([]);
    }
  }, [open, initialData]);

  const addTimeline = () => {
    setForm((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: "", title: "", deskripsi: "" }],
    }));
  };

  const updateTimeline = (index: number, field: string, value: string) => {
    const newTimeline = [...form.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setForm((prev) => ({ ...prev, timeline: newTimeline }));
  };

  const removeTimeline = (index: number) => {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const addKepsek = () => {
    setForm((prev) => ({
      ...prev,
      daftarKepalaSekolah: [...prev.daftarKepalaSekolah, { nama: "", tahunKerja: "" }],
    }));
    setKepsekFiles((prev) => [...prev, null as any]); // placeholder
  };

  const updateKepsek = (index: number, field: string, value: string) => {
    const newKepsek = [...form.daftarKepalaSekolah];
    newKepsek[index] = { ...newKepsek[index], [field]: value };
    setForm((prev) => ({ ...prev, daftarKepalaSekolah: newKepsek }));
  };

  const removeKepsek = (index: number) => {
    setForm((prev) => ({
      ...prev,
      daftarKepalaSekolah: prev.daftarKepalaSekolah.filter((_, i) => i !== index),
    }));
    setKepsekFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles: any = [...kepsekFiles];
    newFiles[index] = file;
    setKepsekFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.deskripsi.trim() || !form.tahunBerdiri) {
      alert("Deskripsi dan Tahun Berdiri wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("deskripsi", form.deskripsi);
    formData.append("tahunBerdiri", form.tahunBerdiri);
    formData.append("jumlahKompetensiKeahlian", form.jumlahKompetensiKeahlian || "0");
    formData.append("timeline", JSON.stringify(form.timeline));
    formData.append("daftarKepalaSekolah", JSON.stringify(form.daftarKepalaSekolah));

    // Attach foto kepsek (hanya yang baru diubah)
    kepsekFiles.forEach((file, index) => {
      if (file) {
        formData.append(`kepalaPhotos`, file); // sesuai multer .array('kepalaPhotos')
      }
    });

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[99999999] p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/70 absolute top-0 right-0 z-[999999] w-full max-w-xl border border-white/10 h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center relative top-0 z[999999]">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? "Buat Sejarah Sekolah" : "Edit Sejarah Sekolah"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Info Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tahun Berdiri *
              </label>
              <Input
                type="number"
                value={form.tahunBerdiri}
                onChange={(e) => setForm({ ...form, tahunBerdiri: e.target.value })}
                placeholder="1976"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Jumlah Kompetensi Keahlian
              </label>
              <Input
                type="number"
                value={form.jumlahKompetensiKeahlian}
                onChange={(e) => setForm({ ...form, jumlahKompetensiKeahlian: e.target.value })}
                placeholder="8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Deskripsi Sekolah *
            </label>
            <TextArea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Ceritakan sejarah singkat sekolah..."
              required
              rows={5}
            />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/80">Timeline Sejarah</label>
              <button
                type="button"
                onClick={addTimeline}
                className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
              >
                <Plus size={14} /> Tambah Tahun
              </button>
            </div>

            {form.timeline.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={item.year}
                    onChange={(e) => updateTimeline(idx, "year", e.target.value)}
                    placeholder="Tahun (contoh: 1976)"
                  />
                  <Input
                    value={item.title}
                    onChange={(e) => updateTimeline(idx, "title", e.target.value)}
                    placeholder="Judul peristiwa"
                  />
                </div>
                <TextArea
                  value={item.deskripsi}
                  onChange={(e) => updateTimeline(idx, "deskripsi", e.target.value)}
                  placeholder="Deskripsi peristiwa..."
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeTimeline(idx)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          {/* Daftar Kepala Sekolah */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/80">Daftar Kepala Sekolah</label>
              <button
                type="button"
                onClick={addKepsek}
                className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
              >
                <Plus size={14} /> Tambah Kepsek
              </button>
            </div>

            {form.daftarKepalaSekolah.map((kepsek: any, idx: number) => (
              <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={kepsek.nama}
                    onChange={(e) => updateKepsek(idx, "nama", e.target.value)}
                    placeholder="Nama Kepala Sekolah"
                  />
                  <Input
                    value={kepsek.tahunKerja}
                    onChange={(e) => updateKepsek(idx, "tahunKerja", e.target.value)}
                    placeholder="Periode (contoh: 2015 - 2020)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1">Foto</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileChange(idx, e.target.files[0]);
                      }}
                      className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/50"
                    />
                    {kepsek.fotoUrl && !kepsekFiles[idx] && (
                      <img
                        src={`${kepsek.fotoUrl}`}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeKepsek(idx)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Hapus
                </button>
                
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
            >
              <Save size={18} />
              Simpan Sejarah
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
export default function Sejarah() {
  const [sejarah, setSejarah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const dataSchool: any = useSchool();
  const SCHOOL_ID = dataSchool?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
  }, []);

  const fetchSejarah = useCallback(async () => {
    if (!SCHOOL_ID) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/sejarah?schoolId=${SCHOOL_ID}`);
      if (!res.ok) throw new Error("Gagal memuat sejarah");

      const json = await res.json();
      if (json.success && json.data) {
        setSejarah(json.data);
      } else {
        setSejarah(null); // Belum ada data → tampilkan tombol buat baru
      }
    } catch (err: any) {
      showAlert("Gagal memuat sejarah: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [SCHOOL_ID, showAlert]);

  useEffect(() => {
    fetchSejarah();
  }, [fetchSejarah]);

  const handleSave = async (formData: FormData) => {
    formData.append("schoolId", SCHOOL_ID?.toString() || "");

    const url = sejarah ? `${BASE_URL}/sejarah/${sejarah.id}` : `${BASE_URL}/sejarah`;
    const method = sejarah ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        // JANGAN set Content-Type → biar browser set multipart/form-data otomatis
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menyimpan sejarah");
    }

    showAlert("Sejarah sekolah berhasil disimpan!");
    fetchSejarah();
  };

  const handleDelete = async () => {
    if (!sejarah?.id || !confirm("Yakin ingin menghapus sejarah sekolah ini?")) return;

    const res = await fetch(`${BASE_URL}/sejarah/${sejarah.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menghapus");
    }

    showAlert("Sejarah sekolah berhasil dihapus");
    setSejarah(null);
    fetchSejarah();
  };

   const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
        {label}
    </span>
    );
    const ISave = () => <Icon label="💾" />;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <header className="flex justify-between items-center my-4 mb-6">
        {/* <h1 className="text-2xl font-bold">Sejarah Sekolah</h1> */}

        {sejarah ? (
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
            >
              <ISave /> Perbarui Sejarah
            </button>
            {/* <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
            >
              <Trash2 size={16} /> Hapus
            </button> */}
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
          >
            <ISave /> Buat Sejarah Sekolah
          </button>
        )}
      </header>

      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : !sejarah ? (
        <div className="text-center py-20 text-gray-400">
          Belum ada data sejarah sekolah. Klik tombol di atas untuk membuat.
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-8">
          <div className="grid grid-cols-1 border-b border-white/20 pb-4 md:grid-cols-3 gap-6">
            <div className="border-r border-white/20 pr-4">
              <h3 className="text-sm text-white/70">Tahun Berdiri</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.tahunBerdiri}</p>
            </div>
            <div className="border-r border-white/20 pl-5">
              <h3 className="text-sm text-white/70">Jumlah Kepala Sekolah</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.jumlahKepalaSekolah}</p>
            </div>
            <div>
              <h3 className="text-sm text-white/70">Kompetensi Keahlian</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.jumlahKompetensiKeahlian}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
            <p className="text-white/80 whitespace-pre-line">{sejarah.deskripsi}</p>
          </div>

          {sejarah.timeline?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline Sejarah</h3>
              <div className="space-y-6">
                {sejarah.timeline.map((item: any, i: number) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-blue-400">{item.year}</span>
                      <h4 className="text-lg font-medium">{item.title}</h4>
                    </div>
                    <p className="mt-2 text-white/80">{item.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sejarah.daftarKepalaSekolah?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Daftar Kepala Sekolah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sejarah.daftarKepalaSekolah.map((k: any, i: number) => (
                  <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/10">
                    {k.fotoUrl && (
                    <img
                      src={`${k.fotoUrl}`}
                      alt={k.nama}
                      className="w-24  h-24   object-cover rounded-full mx-auto mb-3 border-2 border-blue-500/30"
                    />
                    )}
                    <h4 className="text-center font-medium">{k.nama}</h4>
                    <p className="text-center text-sm text-white/60 mt-1">{k.tahunKerja}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SejarahModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={sejarah || {}}
        onSubmit={handleSave}
        isNew={!sejarah}
      />
    </div>
  );
}