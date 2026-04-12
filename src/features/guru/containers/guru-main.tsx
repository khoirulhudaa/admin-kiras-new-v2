// import { useSchool } from "@/features/schools";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { AnimatePresence, motion } from "framer-motion";
// import jsPDF from "jspdf";
// import debounce from "lodash/debounce";
// import {
//   AlertCircle,
//   AlertTriangle,
//   Briefcase,
//   Clock,
//   Download, Edit,
//   Eye, FileSpreadsheet, Mail, Palette,
//   Plus,
//   Printer,
//   RefreshCw,
//   Save, Search,
//   Trash2,
//   Upload,
//   User,
//   X
// } from "lucide-react";
// import QRCode from "qrcode";
// import React, { useEffect, useMemo, useState } from "react";
// import { FaMars, FaVenus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "sonner";
// import * as XLSX from "xlsx";

// // --- Types ---
// interface GuruTendikItem {
//   id?: number;
//   nama: string;
//   nip: string;
//   mapel?: string;
//   email?: string;
//   role: string;
//   jurusan?: string;
//   jenisKelamin: string;
//   photoUrl?: string;
//   statusKehadiran?: string;
//   scanTime?: string;
// }

// // const BASE_URL = "http://localhost:5005/guruTendik";
// const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

// const ROLE_OPTIONS = [
//   "Guru", "Wakil Kepala Sekolah", "Kepala Jurusan", "Ka. Subag. Tata Usaha", "Bendahara Keuangan", 
//   "Pengurus Barang", "S D M", "Laboran", "Staff Perpustakaan", "Penjaga Sekolah", 
//   "Tenaga Kebersihan", "Komite Sekolah", "Wakasek. Bidang Kurikulum", 
//   "Wakasek. Bidang Kesiswaan dan Humas", "Wakasek. Bidang Sarana dan Prasarana", 
//   "Staf Kesiswaan dan Humas", "Staf Bidang Kurikulum", "Staf Sarana dan Prasana", 
//   "Guru BK", "Pembina OSIS/Ekskul", "Dewan Guru", "Kepala Perpustakaan", 
//   "Kepala Laboratorium", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"
// ];

// const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// // ────────────────────────────────────────────────
// // Modal Cetak Kartu (sama konsep dengan siswa, tapi disesuaikan)
// // ────────────────────────────────────────────────
// // const CardDesignerModal = ({
// //   open,
// //   onClose,
// //   config,
// //   setConfig,
// //   onGenerate,
// //   isProcessing,
// // }: {
// //   open: boolean;
// //   onClose: () => void;
// //   config: any;
// //   setConfig: React.Dispatch<React.SetStateAction<any>>;
// //   onGenerate: () => Promise<void>;
// //   isProcessing: boolean;
// // }) => {
// //   if (!open) return null;

// //   // Daftar background preset (sesuaikan path sesuai struktur project Anda)
// //   const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

// //   return (
// //     <AnimatePresence>
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         exit={{ opacity: 0 }}
// //         onClick={onClose}
// //         className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
// //       />

// //       <motion.div
// //         initial={{ x: "100%" }}
// //         animate={{ x: 0 }}
// //         exit={{ x: "100%" }}
// //         transition={{ type: "spring", damping: 25, stiffness: 200 }}
// //         className="fixed right-0 top-0 z-[10000] h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col p-10 overflow-y-auto"
// //       >
// //         <div className="flex items-center justify-between mb-10">
// //           <div>
// //             <h2 className="text-2xl font-black text-white uppercase tracking-tight">
// //               Design Kartu
// //             </h2>
// //             <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
// //               Sesuaikan tampilan kartu guru & tendik
// //             </p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"
// //           >
// //             <X size={24} />
// //           </button>
// //         </div>

// //         <div className="space-y-10 flex-1">
// //           {/* ─── LIVE PREVIEW ──────────────────────────────────────── */}
// //           <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
// //             <div
// //               className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
// //               style={{
// //                 backgroundImage: config.bgImage ? `url(${config.bgImage})` : "none",
// //                 backgroundSize: "cover",
// //                 backgroundPosition: "center",
// //               }}
// //             >
// //               {/* Header Accent */}
// //               <div
// //                 className="h-10 flex flex-col items-center justify-center shadow-sm"
// //                 style={{ backgroundColor: config.accentColor }}
// //               >
// //                 <div
// //                   className="text-[10px] font-black tracking-widest uppercase"
// //                   style={{ color: config.titleColor }}
// //                 >
// //                   {config.title}
// //                 </div>
// //                 <div
// //                   className="text-[6px] font-bold opacity-80 uppercase"
// //                   style={{ color: config.subtitleColor }}
// //                 >
// //                   {config.subtitle}
// //                 </div>
// //               </div>

// //               {/* Konten Kartu */}
// //               <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
// //                 {/* Foto */}
// //                 <div className="w-20 h-24 bg-slate-800/40 rounded-lg border border-slate-600/50 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
// //                   <User size={36} className="text-slate-500" />
// //                 </div>

// //                 {/* Info Teks */}
// //                 <div className="flex-1 space-y-1.5 pt-1 text-slate-900">
// //                   <div className="leading-tight">
// //                     <div className="text-[5px] font-bold text-slate-900 uppercase tracking-tighter">
// //                       Nama Lengkap
// //                     </div>
// //                     <div className="text-[10px] font-black text-slate-900 uppercase truncate">
// //                       BUDI SANTOSO, S.Pd
// //                     </div>
// //                   </div>

// //                   <div className="leading-tight">
// //                     <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
// //                       Jabatan
// //                     </div>
// //                     <div className="text-[9px] text-slate-900 font-bold">Wakasek Kurikulum</div>
// //                   </div>

// //                   <div className="leading-tight">
// //                     <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
// //                       Email
// //                     </div>
// //                     <div className="text-[8px] text-slate-900 font-medium opacity-90">
// //                       budi.santoso@smkcontoh.sch.id
// //                     </div>
// //                   </div>

// //                   {/* QR placeholder */}
// //                   <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/90 rounded-md shadow-md flex items-center justify-center border border-slate-300 p-1">
// //                     <div className="text-[5px] font-bold text-slate-900 text-center leading-tight">
// //                       QR CODE
// //                       <br />
// //                       ID Pegawai
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ─── KONTROL CUSTOMISASI ──────────────────────────────── */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
// //             <div className="space-y-1.5">
// //               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
// //                 Warna Judul
// //               </label>
// //               <input
// //                 type="color"
// //                 value={config.titleColor}
// //                 onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
// //                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
// //               />
// //             </div>

// //             <div className="space-y-1.5">
// //               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
// //                 Warna Subjudul
// //               </label>
// //               <input
// //                 type="color"
// //                 value={config.subtitleColor}
// //                 onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
// //                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
// //               />
// //             </div>

// //             <div className="space-y-1.5">
// //               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
// //                 Warna Aksen
// //               </label>
// //               <input
// //                 type="color"
// //                 value={config.accentColor}
// //                 onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
// //                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
// //               />
// //             </div>

// //             <div className="space-y-1.5">
// //               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
// //                 Judul Kartu
// //               </label>
// //               <input
// //                 value={config.title}
// //                 onChange={(e) => setConfig({ ...config, title: e.target.value })}
// //                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
// //                 placeholder="KARTU PEGAWAI"
// //               />
// //             </div>
// //           </div>

// //           {/* Background Presets */}
// //           <div className="space-y-4">
// //             <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1 block">
// //               Background Preset
// //             </label>
// //             <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
// //               {bgPresets.map((bg, idx) => (
// //                 <button
// //                   key={idx}
// //                   onClick={() => setConfig({ ...config, bgImage: bg })}
// //                   className={`aspect-video rounded-xl border-2 overflow-hidden transition-all duration-200 ${
// //                     config.bgImage === bg
// //                       ? "border-blue-500 scale-95 shadow-lg shadow-blue-500/30"
// //                       : "border-white/10 hover:border-white/30 hover:scale-105"
// //                   }`}
// //                 >
// //                   <img src={bg} alt={`bg-${idx + 1}`} className="w-full h-full object-cover" />
// //                 </button>
// //               ))}

// //               {/* Upload custom background */}
// //               <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all">
// //                 <Upload size={20} className="text-zinc-500 mb-1" />
// //                 {/* <span className="text-[9px] text-zinc-500 font-medium">Custom</span> */}
// //                 <input
// //                   type="file"
// //                   hidden
// //                   accept="image/*"
// //                   onChange={(e) => {
// //                     const file = e.target.files?.[0];
// //                     if (file) {
// //                       const reader = new FileReader();
// //                       reader.onload = (ev) => {
// //                         setConfig({ ...config, bgImage: ev.target?.result as string });
// //                       };
// //                       reader.readAsDataURL(file);
// //                     }
// //                   }}
// //                 />
// //               </label>
// //             </div>
// //           </div>

// //           {/* Tombol Generate PDF */}
// //           <button
// //             onClick={onGenerate}
// //             disabled={isProcessing}
// //             className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all mt-8"
// //           >
// //             <Printer size={20} />
// //             {isProcessing ? "Membuat PDF..." : "Cetak Kartu PDF"}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </AnimatePresence>
// //   );
// // };

// const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }) => {
//   if (!open) return null;
//   const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
//       />
//       <motion.div
//         initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className="fixed right-0 top-0 z-[10000] h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col p-10 overflow-y-auto"
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
//             <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
//               Sesuaikan tampilan kartu guru & tendik
//             </p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-10 flex-1">
//           {/* LIVE PREVIEW */}
//           <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10">
//             <div
//               className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
//               style={{
//                 backgroundImage: config.bgImage ? `url(${config.bgImage})` : "none",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               <div
//                 className="h-10 flex flex-col items-center justify-center"
//                 style={{
//                   backgroundColor: config.accentColor === "transparent" ? "transparent" : config.accentColor,
//                   borderBottom: config.accentColor === "transparent" ? "1px solid rgba(255,255,255,0.08)" : "none"
//                 }}
//               >
//                 <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: config.titleColor }}>
//                   {config.title}
//                 </div>
//                 <div className="text-[6px] font-bold opacity-80 uppercase" style={{ color: config.subtitleColor }}>
//                   {config.subtitle}
//                 </div>
//               </div>

//               <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
//                 <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
//                   <User size={40} className="text-slate-300" />
//                 </div>
//                 <div className="flex-1 space-y-1.5 pt-1">
//                   <div className="text-[5px] text-zinc-400 font-bold uppercase">Nama Lengkap</div>
//                   <div className="text-[10px] font-black text-slate-800 uppercase truncate">BUDI SANTOSO, S.Pd</div>
//                   <div className="text-[5px] text-zinc-400 font-bold uppercase mt-1">Jabatan</div>
//                   <div className="text-[9px] font-bold text-slate-700">Wakasek Kurikulum</div>
//                   <div className="text-[5px] text-zinc-400 font-bold uppercase mt-1">Email</div>
//                   <div className="text-[8px] text-slate-600">budi@sekolah.sch.id</div>
//                 </div>
//                 <div className="absolute bottom-4 right-4 w-12 h-12 border border-slate-200 flex items-center justify-center p-1 bg-white rounded-md shadow-sm">
//                   <div className="text-[5px] font-bold text-slate-300">QR CODE</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* CONTROLS */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Judul</label>
//               <input type="color" value={config.titleColor}
//                 onChange={e => setConfig({ ...config, titleColor: e.target.value })}
//                 className="w-full h-14 bg-transparent border-none cursor-pointer"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Subtitle</label>
//               <input type="color" value={config.subtitleColor}
//                 onChange={e => setConfig({ ...config, subtitleColor: e.target.value })}
//                 className="w-full h-14 bg-transparent border-none cursor-pointer"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Judul Kartu</label>
//               <input value={config.title}
//                 onChange={e => setConfig({ ...config, title: e.target.value })}
//                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Subtitle Kartu</label>
//               <input value={config.subtitle}
//                 onChange={e => setConfig({ ...config, subtitle: e.target.value })}
//                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* ✅ WARNA AKSEN + TRANSPARENT */}
//             <div className="space-y-2 md:col-span-2">
//               <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Aksen (Header)</label>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="color"
//                   value={config.accentColor === "transparent" ? "#2563eb" : config.accentColor}
//                   onChange={e => setConfig({ ...config, accentColor: e.target.value })}
//                   className="w-14 h-14 bg-transparent border-none cursor-pointer rounded shadow-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setConfig({ ...config, accentColor: "transparent" })}
//                   className={`flex-1 h-14 rounded-xl border-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all ${
//                     config.accentColor === "transparent"
//                       ? "border-blue-500 bg-blue-500/10 text-blue-400"
//                       : "border-white/20 hover:border-white/40 bg-white/5 text-zinc-400 hover:text-zinc-200"
//                   }`}
//                 >
//                   {config.accentColor === "transparent" ? "✓ Transparent" : "No Color / Transparent"}
//                 </button>
//               </div>
//               <p className="text-[9px] text-zinc-600 mt-1">
//                 Pilih "Transparent" agar background terlihat di header
//               </p>
//             </div>
//           </div>

//           {/* BACKGROUND PRESETS */}
//           <div className="space-y-4">
//             <label className="text-[10px] font-bold text-white/40 uppercase ml-1 block">Background Preset</label>
//             <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
//               {bgPresets.map((bg, idx) => (
//                 <button key={idx} onClick={() => setConfig({ ...config, bgImage: bg })}
//                   className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${
//                     config.bgImage === bg ? "border-blue-500 scale-95 shadow-lg" : "border-white/10 hover:border-white/30"
//                   }`}
//                 >
//                   <img src={bg} alt={`BG ${idx + 1}`} className="w-full h-full object-cover" />
//                 </button>
//               ))}
//               <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all">
//                 <Upload size={16} className="text-zinc-500" />
//                 <input type="file" hidden accept="image/*"
//                   onChange={e => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       const reader = new FileReader();
//                       reader.onload = ev => setConfig({ ...config, bgImage: ev.target?.result as string });
//                       reader.readAsDataURL(file);
//                     }
//                   }}
//                 />
//               </label>
//             </div>
//           </div>

//           <button onClick={onGenerate} disabled={isProcessing}
//             className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all"
//           >
//             <Printer size={20} />
//             {isProcessing ? "Membuat PDF..." : "Cetak Kartu PDF"}
//           </button>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// const GuruTendikModal = ({
//   open,
//   onClose,
//   initialData,
//   onSave,
//   isNew,
// }: {
//   open: boolean;
//   onClose: () => void;
//   initialData: any;
//   onSave: (form: Partial<GuruTendikItem>, file?: File) => Promise<void>;
//   isNew: boolean;
// }) => {
//   const [form, setForm] = useState<GuruTendikItem>({
//     nama: "",
//     role: ROLE_OPTIONS[0],
//     jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
//     mapel: "",
//     jurusan: "",
//     email: "",
//     nip: "",
//     photoUrl: "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string>("");
//   const [saving, setSaving] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);


//   useEffect(() => {
//     if (open) {
//       setForm({
//         nama: initialData.nama || "",
//         role: initialData.role || ROLE_OPTIONS[0],
//         jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
//         mapel: initialData.mapel || "",
//         jurusan: initialData.jurusan || "",
//         email: initialData.email || "",
//         nip: initialData.nip || "",
//         photoUrl: initialData.photoUrl || "",
//       });
//       setPreview(initialData.photoUrl || "");
//       setSelectedFile(null);
//     }
//   }, [open, initialData]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setSelectedFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const isFormValid = useMemo(() => {
//     const isNamaValid = form.nama.trim() !== "";

//     const isEmailValid =
//       form.email.trim() !== "" &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

//     return isNamaValid && isEmailValid;
//   }, [form]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();    
//     setSaving(true);
//     setSubmitError(null); // reset error sebelum submit
//     try {
//       await onSave(form, selectedFile || undefined);
//       onClose();
//     } catch (err: any) {
//       setSubmitError(err.message || "Terjadi kesalahan saat menyimpan");
//       toast.error(err.message || "Gagal menyimpan data");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleRemovePhoto = () => {
//     setSelectedFile(null);
//     setPreview("");
//     setForm({ ...form, photoUrl: "" });
//   };

//   // ... (sama persis seperti kode asli Anda, hanya ditampilkan sebagian agar ringkas)
//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
//           />
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             className="fixed right-0 top-0 z-[10000] h-full w-full overflow-y-auto max-w-lg bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col"
//           >
//             {/* Header modal */}
//              <div className="p-8 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
//               <div>
//                 <h3 className="text-4xl font-black tracking-tighter text-white">
//                   {isNew ? "Tambah Guru" : "Perbarui Guru"}
//                 </h3>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
//                   Guru & Tenaga Kependidikan
//                 </p>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//            <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8">
//               <div className="flex flex-col items-center gap-4 py-4">
//                 <div className="relative group flex items-center justify-center">
//                   <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-blue-500 transition-all flex items-center justify-center bg-white/5">
//                     {preview ? (
//                       <img src={preview} alt="Preview" className="h-full w-full object-cover" />
//                     ) : (
//                       // <User size={48} className="text-white/10" />
//                       <></>
//                     )}
//                   </div>
//                  <label className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-500 shadow-xl border-4  transition-transform hover:scale-110">
//                   <Plus size={36} className="text-white" />
//                   <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//                   </label>
//                 </div>
//                 {
//                   preview ? (
//                     <p onClick={handleRemovePhoto} className="flex items-center gap-2 bg-red-600 rounded-md cursor-pointer p-2 active:scale-[0.98] hover:bg-red-800 text-[10px] text-white uppercase font-black tracking-widest">
//                       <Trash2 size={16} />
//                       Hapus photo
//                     </p>
//                   ):
//                     <p className="mt-1 text-[10px] text-white/30 uppercase font-black tracking-widest">Photo (opsional)</p>
//                 }
//               </div>

//               <div className="grid gap-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Nama Lengkap</label>
//                   <input
//                     type="text"
//                     value={form.nama}
//                     onChange={(e) => setForm({ ...form, nama: e.target.value })}
//                     placeholder="Contoh: Dr. Budi Santoso"
//                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Jabatan</label>
//                     <select
//                       value={form.role}
//                       onChange={(e) => setForm({ ...form, role: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
//                     >
//                       {ROLE_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Gender</label>
//                     <select
//                       value={form.jenisKelamin}
//                       onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
//                     >
//                       {JENIS_KELAMIN_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center justify-between">
//                     <span>NIP (opsional)</span>
//                     <span className="text-red-400/70 text-[9px] font-normal normal-case">
//                       maks. 18 digit • boleh kosong
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     maxLength={18}
//                     value={form.nip || ""}
//                     onChange={(e) => {
//                       const val = e.target.value.trim();
//                       setForm({ ...form, nip: val });
//                     }}
//                     placeholder="Contoh: 196712311234567890"
//                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white 
//                               focus:border-blue-500 outline-none transition-all placeholder:text-white/10 
//                               font-mono tracking-wide"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Akun email</label>
//                   <input
//                     type="email"
//                     value={form.email || ""}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     placeholder="email@sekolah.sch.id"
//                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mapel (opsional)</label>
//                     <input
//                       type="text"
//                       value={form.mapel || ""}
//                       onChange={(e) => setForm({ ...form, mapel: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Jurusan (opsional)</label>
//                     <input
//                       type="text"
//                       value={form.jurusan || ""}
//                       onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>
            
//             {submitError && (
//               <div className="w-full flex justify-center items-center mb-6">
//                 <div className="relative p-2 w-[87%] mx-auto flex items-center gap-2 text-red-600 bg-red-100/90 rounded-lg text-xs">
//                   <AlertCircle size={14} />
//                   <p>
//                     Jika terjadi masalah <b>Request timeout</b>, coba upload tanpa photo
//                   </p>
//                 </div>
//               </div>
//             )}

//             <div className="p-8 border-t border-white/10 flex gap-4">
//               <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-sm uppercase tracking-widest text-white/30 hover:text-white transition-all">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={saving || !isFormValid}
//                 className={`flex-[2] py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all
//                   ${
//                     saving || !isFormValid
//                       ? "bg-zinc-600 text-white/40 cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-500 text-white"
//                   }
//                 `}
//               >
//                 {saving ? "Memproses..." : (
//                   <>
//                     <Save size={16} /> Simpan
//                   </>
//                 )}
//               </button>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };


// // ────────────────────────────────────────────────
// // MAIN COMPONENT
// // ────────────────────────────────────────────────
// export default function TeacherManager() {
//   // const [data, setData] = useState<GuruTendikItem[]>([]);
//   // const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showCardDesigner, setShowCardDesigner] = useState(false);
//   const queryClient = useQueryClient();
//   const [showDuplicateOnly, setShowDuplicateOnly] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [showProgress, setShowProgress] = useState(false);
//   const [totalItems, setTotalItems] = useState(0);
//   const [itemsPerPage] = useState(12); // bisa dibuat selectable nanti
  
//   // ─── State untuk custom card ───────────────────────────────
//   const [cardConfig, setCardConfig] = useState({
//     title: "KARTU PEGAWAI",
//     subtitle: "YAYASAN PENDIDIKAN XYZ",
//     accentColor: "#2563eb",   // biru default
//     titleColor: "#ffffff",
//     subtitleColor: "#e5e7eb",
//     bgImage: null as string | null,
//   });

//   const school = useSchool();
//   const SCHOOL_ID = school?.data?.[0]?.id;

//   // ─── REACT QUERY: Fetch Data ───────────────────────────────
//   const { 
//     data: teacherResponse, 
//     isLoading: loading, 
//     refetch, 
//     isFetching 
//   } = useQuery({
//     queryKey: ['teachers', SCHOOL_ID, debouncedSearch, showDuplicateOnly, currentPage, itemsPerPage],
//     queryFn: async () => {
//       if (!SCHOOL_ID) return { data: [], summary: { totalNipIssues: 0, totalEmailIssues: 0 }, pagination: {} };

//       const params = new URLSearchParams({
//         schoolId: SCHOOL_ID.toString(),
//         name: debouncedSearch.trim(),
//         isDuplicateOnly: showDuplicateOnly ? 'true' : 'false',
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//       });

//       const res = await fetch(`${BASE_URL}?${params.toString()}`);
//       if (!res.ok) throw new Error("Gagal mengambil data guru/tendik");
//       return await res.json();
//     },
//     enabled: !!SCHOOL_ID,
//     staleTime: 1000 * 60,
//   });

//   // --- LOGIKA DEBOUNCE ---
//   const debouncedSetSearch = useMemo(
//     () => debounce((value: string) => {
//       setDebouncedSearch(value);
//     }, 500),
//     []
//   );

//   // console.log('teacher data', teacherData)

//   // Handler saat input diketik
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearch(value); // Update text di input secara instan
//     debouncedSetSearch(value); // Jalankan filter setelah jeda 500ms
//   };

//   // Cleanup saat komponen unmount
//   useEffect(() => {
//     return () => debouncedSetSearch.cancel();
//   }, [debouncedSetSearch]);

//  const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) formData.append(key, value.toString());
//     });
//     if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());
//     if (file) formData.append("photo", file);

//     const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
//     const method = selectedItem?.id ? "PUT" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//         body: formData,
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         // Tangkap pesan duplikat secara spesifik dari backend
//         throw new Error(json.message || "Gagal menyimpan data");
//         // if (json.message?.includes("NIP") || json.message?.includes("Email")) {
//         //   toast.error(json.message, {
//         //     duration: 8000, // lebih lama agar bisa dibaca
//         //     icon: <AlertTriangle className="text-red-500" size={20} />,
//         //     style: {
//         //       border: "1px solid #ef4444",
//         //       backgroundColor: "rgba(239, 68, 68, 0.1)",
//         //     },
//         //   });
//         // } else {
//         //   // Error lain (misal server error, validation lain)
//         //   toast.error(json.message || "Gagal menyimpan data", {
//         //     duration: 6000,
//         //   });
//         // }
//         // return; // Jangan tutup modal jika gagal
//       }

//       // Sukses
//       toast.success("Data berhasil disimpan", {
//         duration: 4000,
//       });

//       queryClient.invalidateQueries({ queryKey: ['teachers'] });
//       setModalOpen(false);
//       setSelectedItem(null);
//     // } catch (err: any) {
//     //   // toast.error("Terjadi kesalahan server", {
//     //   //   duration: 6000,
//     //   // });
//     // }
//     } catch (err: any) {
//       throw err;
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Hapus data guru/tendik ini?")) return;
//     try {
//       const res = await fetch(`${BASE_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//       });
//       if (res.ok) {
//         toast.success("Data dihapus");
//         queryClient.invalidateQueries({ queryKey: ['teachers'] });
//         // fetchData();
//       }
//     } catch (err) {
//       toast.error("Gagal menghapus data");
//     }
//   };

//   // ─── Download Template Excel ───────────────────────────────
//   const handleDownloadTemplate = () => {
//     const template = [
//       {
//         Nama: "Dr. Budi Santoso",
//         Jabatan: "Kepala Sekolah",
//         Gender: "Laki-laki",
//         Email: "kepsek@smkn1contoh.sch.id",
//         Mapel: "-",
//         NIP: "123456789123456789",
//         Jurusan: "-",
//       },
//       {
//         Nama: "Dra. Siti Aminah",
//         Jabatan: "Guru",
//         Gender: "Perempuan",
//         Email: "siti.aminah@smkn1contoh.sch.id",
//         Mapel: "Matematika",
//         NIP: "123456789123456789",
//         Jurusan: "IPA",
//       },
//     ];

//     const ws = XLSX.utils.json_to_sheet(template);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "GuruTendik");
//     XLSX.writeFile(wb, "Template_Guru_Tendik.xlsx");
//   };

//   // ─── Import Excel (Bulk Create) ─────────────────────────────
//   const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !SCHOOL_ID) return;

//     setIsProcessing(true);

//     const reader = new FileReader();
//     reader.onload = async (evt) => {
//       try {
//         const data = evt.target?.result;
//         const wb = XLSX.read(data, { type: "binary" });
//         const ws = wb.Sheets[wb.SheetNames[0]];
//         const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });

//         for (const row of rows) {
//           const formData = new FormData();
//           formData.append("nama", row["Nama"] || "");
//           formData.append("role", row["Jabatan"] || "");
//           formData.append("jenisKelamin", row["Gender"] || "");
//           formData.append("email", row["Email"] || "");
//           formData.append("mapel", row["Mapel"] || "");
//           formData.append("nip", row["NIP"] || "");
//           formData.append("jurusan", row["Jurusan"] || "");
//           formData.append("schoolId", SCHOOL_ID.toString());

//           await fetch(BASE_URL, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//             body: formData,
//           });
//         }

//         toast.success("Import selesai");
//         queryClient.invalidateQueries({ queryKey: ['teachers'] });
//         // fetchData();
//       } catch (err) {
//         toast.error("Gagal import data");
//         console.error(err);
//       } finally {
//         setIsProcessing(false);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleMarkAbsence = async (teacher: any, status: 'Izin' | 'Sakit' | 'Alpha') => {
//     if (!confirm(`Tandai ${teacher.nama} sebagai ${status} hari ini?`)) return;

//     try {
//       const res = await fetch(`${BASE_URL}/mark-absence`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           guruId: teacher.id,
//           schoolId: SCHOOL_ID,
//           status: status,
//           userRole: 'teacher' // Memberitahu backend bahwa ini adalah Guru/Pegawai
//         })
//       });

//       const json = await res.json();
//       if (res.ok && json.success) {
//         toast.success(`Berhasil mencatat ${status} untuk ${teacher.nama}`);
//         queryClient.invalidateQueries({ queryKey: ['teachers'] });
//       } else {
//         throw new Error(json.message || "Gagal mencatat");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Gagal mencatat ketidakhadiran");
//     }
//   };

//   // const generateTeacherCardsPDF = async () => {
//   //   setIsProcessing(true);
//   //   const doc = new jsPDF("p", "mm", "a4");

//   //   const cardWidth = 86;   
//   //   const cardHeight = 54;  

//   //   // Tambahkan margin halaman agar tidak terlalu mepet ke pinggir kertas
//   //   const marginLeft = 12; 
//   //   const marginTop = 15;
//   //   const spacing = 8; // Jarak antar kartu (horizontal & vertikal)

//   //   try {
//   //     for (let i = 0; i < teacherData.length; i++) {
//   //       const t = teacherData[i];
//   //       const idx = i % 8;
//   //       const col = idx % 2;
//   //       const row = Math.floor(idx / 2);

//   //       // Kalkulasi koordinat dengan spacing yang lebih besar
//   //       const x = marginLeft + col * (cardWidth + spacing);
//   //       const y = marginTop + row * (cardHeight + spacing);

//   //       if (i > 0 && idx === 0) doc.addPage();

        
//   //       // Background custom
//   //       doc.setFillColor(15, 23, 42);           // ≈ slate-950 / sangat gelap
//   //       doc.rect(x, y, cardWidth, cardHeight, "F");  // background kartu
//   //       // doc.rect(x, y, 90, 50, "F");
//   //     if (cardConfig.bgImage) {
//   //       try {
//   //         const img = new Image();
//   //         img.src = cardConfig.bgImage;
//   //         await new Promise((resolve) => { img.onload = resolve; });

//   //         // 1. Buat canvas tersembunyi untuk cropping
//   //         const canvas = document.createElement('canvas');
//   //         const ctx = canvas.getContext('2d');
          
//   //         // Tentukan resolusi output (gunakan rasio kartu 86:54)
//   //         canvas.width = 860; 
//   //         canvas.height = 540;

//   //         const imgRatio = img.width / img.height;
//   //         const canvasRatio = canvas.width / canvas.height;

//   //         let sw, sh, sx, sy;

//   //         // 2. Logika "Object-fit: Cover" manual
//   //         if (imgRatio > canvasRatio) {
//   //           sh = img.height;
//   //           sw = sh * canvasRatio;
//   //           sx = (img.width - sw) / 2;
//   //           sy = 0;
//   //         } else {
//   //           sw = img.width;
//   //           sh = sw / canvasRatio;
//   //           sx = 0;
//   //           sy = (img.height - sh) / 2;
//   //         }

//   //         // 3. Gambar ke canvas (Otomatis terpotong di sini)
//   //         ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

//   //         // 4. Masukkan hasil canvas ke PDF (Pasti pas dengan ukuran kartu)
//   //         const croppedImgData = canvas.toDataURL('image/jpeg', 0.9);
//   //         doc.addImage(croppedImgData, 'JPEG', x, y, cardWidth, cardHeight);

//   //       } catch (e) {
//   //         console.warn("Gagal render background", e);
//   //       }
//   //     }

//   //       // Header accent
//   //       doc.setFillColor(cardConfig.accentColor);
//   //       doc.rect(x, y, cardWidth, 12, "F");  // tanpa radius seperti request sebelumnya

//   //       doc.setTextColor(cardConfig.titleColor);
//   //       doc.setFontSize(10);
//   //       doc.setFont("helvetica", "bold");
//   //       doc.text(cardConfig.title, x + 45, y + 6, { align: "center" });

//   //       doc.setTextColor(cardConfig.subtitleColor);
//   //       doc.setFontSize(6);
//   //       doc.text(cardConfig.subtitle, x + 45, y + 10, { align: "center" });

//   //       // Foto
//   //       if (t.photoUrl) {
//   //         try {
//   //           doc.addImage(t.photoUrl, "JPEG", x + 5, y + 15, 18, 22);
//   //         } catch {
//   //           doc.setFillColor(30, 41, 59);
//   //           doc.rect(x + 5, y + 15, 18, 22, "F");
//   //         }
//   //       } else {
//   //         doc.setFillColor(30, 41, 59);
//   //         doc.rect(x + 5, y + 15, 18, 22, "F");
//   //         doc.setTextColor(100, 116, 139);
//   //         doc.setFontSize(7);
//   //         doc.text("FOTO", x + 9, y + 26);
//   //       }
        
//   //       // Nama & Jabatan
//   //       doc.setTextColor("#0f172a");
//   //       doc.setFontSize(9);
//   //       doc.setFont("helvetica", "bold");
//   //       doc.text(t.nama.toUpperCase(), x + 27, y + 20, { maxWidth: 55 });

//   //       doc.setFontSize(8);
//   //       doc.setTextColor("#0f172a");
//   //       doc.text(t.role, x + 27, y + 25, { maxWidth: 55 });

//   //       // jenis kelamin
//   //       if (t.jenisKelamin) {
//   //         doc.setFontSize(7);
//   //         doc.setTextColor("#0f172a");
//   //         doc.text(t.jenisKelamin, x + 27, y + 28, { maxWidth: 55 });
//   //       }

//   //       // QR Code
//   //       const qrValue = t.qrCodeData;
//   //       const qrDataUrl = await QRCode.toDataURL(qrValue, { margin: 1, width: 180 });
//   //       doc.addImage(qrDataUrl, "PNG", x + 65, y + 33, 18, 18);
//   //     }

//   //     doc.save(`Kartu_Guru_Tendik_${new Date().toISOString().slice(0, 10)}.pdf`);
//   //     setShowCardDesigner(false);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Gagal membuat file PDF");
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   const generateTeacherCardsPDF = async () => {
//   setShowCardDesigner(false);
//   setIsProcessing(true);
//   setShowProgress(true);
//   setProgress(0);

//   try {
//     const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}&limit=9999`);
//     const allData = await res.json();
//     const allTeachers = allData?.data || allData || teachers || [];
//     if (!allTeachers || allTeachers.length === 0) {
//       toast.error("Tidak ada data guru untuk dicetak");
//       setIsProcessing(false);
//       return;
//     }
//     setTotalItems(allTeachers.length);

//     const doc = new jsPDF("p", "mm", "a4");

//     const cardWidth = 86;
//     const cardHeight = 54;
//     const marginLeft = 10;
//     const marginTop = 10;
//     const spacing = 6;
//     const perPage = 8;

//     // ── Helper: render background ──
//     const renderBg = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number) => {
//       if (!cardConfig.bgImage) return;
//       try {
//         const img = new Image();
//         img.crossOrigin = "anonymous";
//         img.src = cardConfig.bgImage;
//         await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         const imgRatio = img.width / img.height;
//         const canvasRatio = canvas.width / canvas.height;
//         let sw = img.width, sh = img.height, sx = 0, sy = 0;
//         if (imgRatio > canvasRatio) { sh = img.height; sw = sh * canvasRatio; sx = (img.width - sw) / 2; }
//         else { sw = img.width; sh = sw / canvasRatio; sy = (img.height - sh) / 2; }
//         ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
//         doc.addImage(canvas.toDataURL("image/jpeg", 0.7), "JPEG", x, y, cardWidth, cardHeight);
//       } catch {}
//     };

//     // ── Helper: render header ──
//     const renderHeader = (x: number, y: number, title: string) => {
//       if (cardConfig.accentColor !== "transparent") {
//         const hex = cardConfig.accentColor.replace("#", "");
//         const r = parseInt(hex.substr(0, 2), 16);
//         const g = parseInt(hex.substr(2, 2), 16);
//         const b = parseInt(hex.substr(4, 2), 16);
//         doc.setFillColor(r, g, b);
//         doc.rect(x, y, cardWidth, 12, "F");
//       }
//       doc.setTextColor(cardConfig.titleColor);
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(9);
//       doc.text(title, x + cardWidth / 2, y + 6, { align: "center" });
//       doc.setTextColor(cardConfig.subtitleColor);
//       doc.setFontSize(6);
//       doc.text(cardConfig.subtitle, x + cardWidth / 2, y + 10, { align: "center" });
//     };

//     const canvas = document.createElement("canvas");
//     canvas.width = 860;
//     canvas.height = 540;
//     const ctx = canvas.getContext("2d")!;

//     const totalPagesCount = Math.ceil(allTeachers.length / perPage);

//     for (let pageIdx = 0; pageIdx < totalPagesCount; pageIdx++) {
//       // ── HALAMAN DEPAN ──
//       if (pageIdx > 0) doc.addPage();

//       for (let i = 0; i < perPage; i++) {
//         const idx = pageIdx * perPage + i;
//         if (idx >= allTeachers.length) break;

//         const t = allTeachers[idx];
//         const col = i % 2;
//         const row = Math.floor(i / 2);
//         const x = marginLeft + col * (cardWidth + spacing);
//         const y = marginTop + row * (cardHeight + spacing);

//         // Base putih
//         doc.setFillColor(255, 255, 255);
//         doc.rect(x, y, cardWidth, cardHeight, "F");

//         // Background
//         await renderBg(canvas, ctx, x, y);

//         // Header
//         renderHeader(x, y, cardConfig.title);

//         // Foto
//         const pX = x + 5, pY = y + 15, pW = 18, pH = 22;
//         doc.setFillColor(245, 245, 245);
//         doc.rect(pX, pY, pW, pH, "F");

//         if (t.photoUrl) {
//           try {
//             const img = new Image();
//             img.crossOrigin = "anonymous";
//             img.src = t.photoUrl;
//             await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

//             const photoCanvas = document.createElement("canvas");
//             const photoCtx = photoCanvas.getContext("2d")!;
//             photoCanvas.width = pW * 10;
//             photoCanvas.height = pH * 10;
//             photoCtx.fillStyle = "#ffffff";
//             photoCtx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
//             const scale = Math.max(photoCanvas.width / img.width, photoCanvas.height / img.height);
//             const nW = img.width * scale, nH = img.height * scale;
//             photoCtx.drawImage(img, (photoCanvas.width - nW) / 2, (photoCanvas.height - nH) / 2, nW, nH);
//             doc.addImage(photoCanvas.toDataURL("image/png"), "PNG", pX, pY, pW, pH);
//           } catch {}
//         }

//         // Frame foto
//         doc.setDrawColor(30, 41, 59);
//         doc.setLineWidth(0.5);
//         doc.rect(pX, pY, pW, pH);

//         // Teks info
//         doc.setTextColor(30, 41, 59);
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(8);
//         doc.text(t.nama.toUpperCase(), x + 27, y + 21, { maxWidth: 52 });

//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(7);
//         doc.setTextColor(100, 116, 139);
//         doc.text(`Jabatan : ${t.role || "-"}`, x + 27, y + 28);
//         doc.text(`Gender  : ${t.jenisKelamin || "-"}`, x + 27, y + 32);
//         doc.text(`NIP     : ${t.nip || "-"}`, x + 27, y + 36);

//         // QR Code depan
//         try {
//           const qrVal = t.qrCodeData || t.nip || `GURU-${t.id}`;
//           const qrUrl = await QRCode.toDataURL(qrVal, { margin: 1, width: 150 });
//           doc.addImage(qrUrl, "PNG", x + cardWidth - 18, y + cardHeight - 18, 14, 14);
//         } catch {}

//         // Border
//         doc.setDrawColor(200, 200, 200);
//         doc.setLineWidth(0.1);
//         doc.rect(x, y, cardWidth, cardHeight);

//         setProgress(Math.round(((pageIdx * perPage + i + 1) / allTeachers.length) * 50));
//       }

//       // ── HALAMAN BELAKANG ──
//       doc.addPage();

//       for (let i = 0; i < perPage; i++) {
//         const idx = pageIdx * perPage + i;
//         if (idx >= allTeachers.length) break;

//         const t = allTeachers[idx];
//         const col = i % 2;
//         const row = Math.floor(i / 2);

//         // Mirror posisi (seperti siswa)
//         const mirroredCol = 1 - col;
//         const x = marginLeft + mirroredCol * (cardWidth + spacing);
//         const y = marginTop + row * (cardHeight + spacing);

//         // Base putih
//         doc.setFillColor(255, 255, 255);
//         doc.rect(x, y, cardWidth, cardHeight, "F");

//         // Background
//         await renderBg(canvas, ctx, x, y);

//         // Header "INFORMASI KARTU"
//         renderHeader(x, y, "INFORMASI KARTU");

//         // White box QR
//         doc.setFillColor(255, 255, 255);
//         doc.roundedRect(x + 10, y + 16, 29, 29, 2, 2, "F");
//         doc.roundedRect(x + 46, y + 16, 29, 29, 2, 2, "F");

//         // QR ID pegawai
//         try {
//           const qrVal = t.qrCodeData || `GURU-${t.id}`;
//           const qrUrl = await QRCode.toDataURL(qrVal, { margin: 1 });
//           doc.addImage(qrUrl, "PNG", x + 12, y + 18, 25, 25);
//           doc.setFontSize(6);
//           doc.setTextColor(0);
//           doc.text("ID PEGAWAI", x + 24, y + 48, { align: "center" });
//         } catch {}

//         // QR NIP
//         if (t.nip) {
//           try {
//             const qrNip = await QRCode.toDataURL(t.nip, {
//               margin: 1,
//               color: {
//                 dark: cardConfig.accentColor !== "transparent" ? cardConfig.accentColor : "#1e293b",
//                 light: "#ffffff"
//               }
//             });
//             doc.addImage(qrNip, "PNG", x + 48, y + 18, 25, 25);
//             doc.setFontSize(6);
//             doc.setTextColor(0);
//             doc.text("NIP", x + 60, y + 48, { align: "center" });
//           } catch {}
//         }

//         // Border
//         doc.setDrawColor(200, 200, 200);
//         doc.setLineWidth(0.1);
//         doc.rect(x, y, cardWidth, cardHeight);

//         setProgress(50 + Math.round(((pageIdx * perPage + i + 1) / allTeachers.length) * 50));
//       }
//     }

//     doc.save(`Kartu_Guru_Tendik_${new Date().toISOString().slice(0, 10)}.pdf`);
//     toast.success(`PDF berhasil dibuat untuk ${allTeachers.length} guru`);

//   } catch (err) {
//     console.error(err);
//     toast.error("Gagal membuat file PDF");
//   } finally {
//     setIsProcessing(false);
//     setTimeout(() => setShowProgress(false), 800);
//     setProgress(0);
//   }
// };

//   const teachers = teacherResponse?.data || [];
//   const duplicateSummary = teacherResponse?.summary || { totalNipIssues: 0, totalEmailIssues: 0 };
//   const pagination = teacherResponse?.pagination || {
//     totalItems: 0,
//     totalPages: 1,
//     currentPage: 1,
//     perPage: itemsPerPage
//   };

//   const getStatusStyle = (status: string | undefined) => {
//     const s = status?.toLowerCase();
//     if (s === "hadir") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
//     if (s === "sakit") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
//     if (s === "izin") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
//     if (s === "alpha") return "bg-red-500/10 text-red-400 border-red-500/20";
    
//     // Default untuk "Belum Hadir"
//     return "bg-zinc-500/10 text-zinc-500 border-zinc-500/10";
//   };

//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen pb-10">
//       <Toaster position="top-right" richColors />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
//             <Briefcase size={14} /> Personnel Directory
//           </div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
//             Guru <span className="text-blue-700">& Tendik</span>
//           </h1>
//           <p className="text-zinc-500 text-sm font-medium">Manajemen kehadiran & profil pegawai</p>
//         </div>

//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={handleDownloadTemplate}
//             className="h-14 px-5 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest"
//             disabled={isProcessing}
//           >
//             <Download size={16} /> Template
//           </button>
            
//           <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
//             <FileSpreadsheet size={16} /> Import
//             <input
//               type="file"
//               hidden
//               accept=".xlsx,.xls"
//               onChange={handleBulkImport}
//               disabled={isProcessing}
//             />
//           </label>
          
//           <button
//             onClick={() => setShowCardDesigner(true)}
//             className="h-14 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
//             >
//             <Palette size={16} /> Cetak Kartu
//           </button>

//            <button 
//             onClick={() => {
//               setSelectedItem(null);
//               setModalOpen(true);
//             }}
//             className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
//             <Plus size={16}/> Tambah
//           </button>

//         </div>
//       </div>

//       {duplicateSummary.totalNipIssues > 0 || duplicateSummary.totalEmailIssues > 0 ? (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
//             <AlertTriangle size={20} className="text-red-400" />
//             <div>
//               <h4 className="text-sm font-black uppercase text-red-400">Duplikat Terdeteksi!</h4>
//               <p className="text-xs text-zinc-300 mt-1">
//                 Terdapat <strong className="text-white">{duplicateSummary.totalNipIssues} NIP</strong> dan 
//                 <strong className="text-white"> {duplicateSummary.totalEmailIssues} Email</strong> yang sama.
//                 {showDuplicateOnly ? " (sedang menampilkan hanya duplikat)" : ""}
//               </p>
//             </div>
//           </div>
//         ) : null}

//         <div className="relative flex-1 w-full mb-6 group flex items-center gap-3 justify-between">
//           <div className="w-[80%]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
//             <input
//               type="text"
//               placeholder="Cari nama atau role"
//               value={search}
//               onChange={handleSearchChange}
//               className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
//             />
//           </div>

//           <button
//             onClick={() => {
//               setShowDuplicateOnly(prev => {
//                 const newValue = !prev;
//                 // Paksa refetch setelah state berubah
//                 setTimeout(() => refetch(), 0);  // refetch setelah render selesai
//                 return newValue;
//               });
//             }}
//             className={`px-5 h-14 px-5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
//               showDuplicateOnly
//                 ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40'
//                 : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
//             }`}
//           >
//             <AlertTriangle size={14} />
//             <p className="w-max flex items-center">
//               {showDuplicateOnly ? 'Hanya Duplikat' : 'Hanya Duplikat Saja'}
//             </p>
//           </button>
          
//           <button 
//             onClick={() => refetch()} 
//             disabled={isFetching}
//             className="flex-1 h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
//           >
//             <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
//             {isFetching ? "Syncing..." : "Refresh"}
//           </button>
//       </div>

//       {/* Content */}
//       {loading || isFetching ? (
//           <div className="flex flex-col items-center justify-center py-40 opacity-70">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-6"></div>
//             <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
//               Memuat Data Guru & Tendik...
//             </p>
//           </div>
//         ) : teachers.length === 0 ? (
//           <div className="text-center py-40 bg-white/[0.03] rounded-[3rem] border border-dashed border-white/15 shadow-inner">
//             <div className="mx-auto w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
//               <User size={32} className="text-zinc-500" />
//             </div>
//             <p className="text-xl font-bold text-zinc-300 mb-2">Tidak ada data ditemukan</p>
//             <p className="text-sm text-zinc-500 max-w-md mx-auto">
//               {showDuplicateOnly 
//                 ? "Tidak ada duplikat NIP atau Email pada sekolah ini." 
//                 : debouncedSearch 
//                   ? `Tidak ditemukan hasil untuk pencarian "${debouncedSearch}"` 
//                   : "Belum ada guru atau tendik yang terdaftar di sekolah ini."}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
//               {teachers.map((item: GuruTendikItem) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300 group"
//                 >
//                   {/* Foto + Gender Badge */}
//                   <div className="flex items-start gap-5">
//                     <div className="relative h-28 w-28 flex-shrink-0">
//                       <div className="h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
//                         {item.photoUrl ? (
//                           <img 
//                             src={item?.photoUrl || '/defaultProfile.png'} 
//                             alt={item.nama} 
//                             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                           />
//                         ) : (
//                           <div className="h-full w-full flex items-center justify-center text-white/20">
//                             <User size={40} />
//                           </div>
//                         )}
//                       </div>

//                       {/* Gender Icon Badge */}
//                       <div 
//                         className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-4 border-[#0B1220] text-white text-xl font-black
//                           ${item.jenisKelamin === "Laki-laki" ? 'bg-blue-600' : 'bg-pink-600'}`}
//                       >
//                         {item.jenisKelamin === "Laki-laki" ? <FaMars /> : <FaVenus />}
//                       </div>
//                     </div>

//                     {/* Info Utama */}
//                     <div className="flex-1 min-w-0">
//                       <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
//                         {item.role || "Staff"}
//                       </div>
//                       <h3 className="text-xl font-black text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
//                         {item.nama}
//                       </h3>

//                       {/* Status Kehadiran + Waktu Scan */}
//                       <div className="mt-3 flex flex-wrap items-center gap-3">
//                         <span 
//                           className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(item.statusKehadiran)}`}
//                         >
//                           {item.statusKehadiran || 'Belum Hadir'}
//                         </span>

//                         {item.scanTime && (
//                           <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
//                             <Clock size={14} className="text-zinc-500" />
//                             {item.scanTime}
//                           </span>
//                         )}
//                       </div>

//                       {/* Email */}
//                       <div className="mt-3 flex items-center gap-2 text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
//                         <Mail size={14} />
//                         <span className="truncate">{item.email || "Tidak ada email"}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Info Tambahan (Mapel & NIP) */}
//                   <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
//                     <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
//                       <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Mata Pelajaran</div>
//                       <div className="text-sm font-bold text-white truncate">
//                         {item.mapel || "Umum / Tidak Ada"}
//                       </div>
//                     </div>

//                     <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
//                       <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">NIP</div>
//                       <div className="text-sm font-mono font-bold text-white truncate">
//                         {item.nip || "-"}
//                         {item.isNipDuplicate && (
//                           <AlertTriangle size={14} className="inline ml-2 text-red-400" />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Tombol Aksi Kehadiran */}
//                   <div className="mt-6 grid grid-cols-4 gap-2">
//                     {['Hadir', 'Izin', 'Sakit', 'Alpha'].map((st) => (
//                       <button
//                         key={st}
//                         onClick={() => handleMarkAbsence(item, st as any)}
//                         className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border
//                           ${item.statusKehadiran === st 
//                             ? 'border-slate-400/70 bg-slate-700/30' 
//                             : 'border-transparent hover:bg-white/5'} 
//                           ${getStatusStyle(st)}`}
//                       >
//                         {st}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Tombol Aksi Utama */}
//                   <div className="mt-6 flex gap-3">
//                     <button
//                       onClick={() => { setSelectedItem(item); setModalOpen(true); }}
//                       className="flex-1 py-3.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-2xl flex items-center justify-center gap-2 transition-all font-medium text-sm"
//                     >
//                       <Edit size={16} />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => navigate(`/detail/${item.id}?role=teacher`)}
//                       className="w-14 py-3.5 bg-white/5 hover:bg-white/15 text-white rounded-2xl flex items-center justify-center transition-all"
//                       title="Lihat Detail & Riwayat"
//                     >
//                       <Eye size={18} />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id!)}
//                       className="w-14 py-3.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-2xl flex items-center justify-center transition-all"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Pagination Controls */}
//             {pagination.totalPages && (
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 px-4">
//                 <div className="text-sm text-zinc-400">
//                   Menampilkan <strong className="text-white">{teachers.length}</strong> dari <strong className="text-white">{pagination.totalItems}</strong> data
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                     disabled={pagination.currentPage === 1 || isFetching}
//                     className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
//                   >
//                     ← Prev
//                   </button>

//                   <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
//                     Halaman <strong className="text-blue-400">{pagination.currentPage}</strong> / {pagination.totalPages}
//                   </div>

//                   <button
//                     onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
//                     disabled={pagination.currentPage === pagination.totalPages || isFetching}
//                     className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {showProgress && (
//           <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
//             <div className="flex justify-between text-xs mb-2">
//               <span>Membuat PDF Kartu...</span>
//               <span>{progress}%</span>
//             </div>
//             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-red-500 transition-all duration-300" 
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         )}

//       <GuruTendikModal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setSelectedItem(null);
//         }}
//         initialData={selectedItem || {}}
//         onSave={handleSave}
//         isNew={!selectedItem}
//       />

//       {/* Modal Custom Card + Live Preview */}
//       <CardDesignerModal
//         open={showCardDesigner}
//         onClose={() => setShowCardDesigner(false)}
//         config={cardConfig}
//         setConfig={setCardConfig}
//         onGenerate={generateTeacherCardsPDF}
//         isProcessing={isProcessing}
//       />
//     </div>
//   );
// }




import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import debounce from "lodash/debounce";
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Clock,
  Download, Edit,
  Eye, FileSpreadsheet, Mail, Palette,
  Plus,
  Printer,
  RefreshCw,
  Save, Search,
  Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import QRCode from "qrcode";
import React, { useEffect, useMemo, useState } from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import * as XLSX from "xlsx";

// --- Types ---
interface GuruTendikItem {
  id?: number;
  nama: string;
  nip: string;
  mapel?: string;
  email?: string;
  role: string;
  jurusan?: string;
  jenisKelamin: string;
  photoUrl?: string;
  statusKehadiran?: string;
  scanTime?: string;
}

// const BASE_URL = "http://localhost:5005/guruTendik";
const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

const ROLE_OPTIONS = [
  "Guru", "Wakil Kepala Sekolah", "Kepala Jurusan", "Ka. Subag. Tata Usaha", "Bendahara Keuangan", 
  "Pengurus Barang", "S D M", "Laboran", "Staff Perpustakaan", "Penjaga Sekolah", 
  "Tenaga Kebersihan", "Komite Sekolah", "Wakasek. Bidang Kurikulum", 
  "Wakasek. Bidang Kesiswaan dan Humas", "Wakasek. Bidang Sarana dan Prasarana", 
  "Staf Kesiswaan dan Humas", "Staf Bidang Kurikulum", "Staf Sarana dan Prasana", 
  "Guru BK", "Pembina OSIS/Ekskul", "Dewan Guru", "Kepala Perpustakaan", 
  "Kepala Laboratorium", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"
];

const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// ────────────────────────────────────────────────
// Modal Cetak Kartu (sama konsep dengan siswa, tapi disesuaikan)
// ────────────────────────────────────────────────
// const CardDesignerModal = ({
//   open,
//   onClose,
//   config,
//   setConfig,
//   onGenerate,
//   isProcessing,
// }: {
//   open: boolean;
//   onClose: () => void;
//   config: any;
//   setConfig: React.Dispatch<React.SetStateAction<any>>;
//   onGenerate: () => Promise<void>;
//   isProcessing: boolean;
// }) => {
//   if (!open) return null;

//   // Daftar background preset (sesuaikan path sesuai struktur project Anda)
//   const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
//       />

//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className="fixed right-0 top-0 z-[10000] h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col p-10 overflow-y-auto"
//       >
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h2 className="text-2xl font-black text-white uppercase tracking-tight">
//               Design Kartu
//             </h2>
//             <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
//               Sesuaikan tampilan kartu guru & tendik
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-10 flex-1">
//           {/* ─── LIVE PREVIEW ──────────────────────────────────────── */}
//           <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
//             <div
//               className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
//               style={{
//                 backgroundImage: config.bgImage ? `url(${config.bgImage})` : "none",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               {/* Header Accent */}
//               <div
//                 className="h-10 flex flex-col items-center justify-center shadow-sm"
//                 style={{ backgroundColor: config.accentColor }}
//               >
//                 <div
//                   className="text-[10px] font-black tracking-widest uppercase"
//                   style={{ color: config.titleColor }}
//                 >
//                   {config.title}
//                 </div>
//                 <div
//                   className="text-[6px] font-bold opacity-80 uppercase"
//                   style={{ color: config.subtitleColor }}
//                 >
//                   {config.subtitle}
//                 </div>
//               </div>

//               {/* Konten Kartu */}
//               <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
//                 {/* Foto */}
//                 <div className="w-20 h-24 bg-slate-800/40 rounded-lg border border-slate-600/50 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
//                   <User size={36} className="text-slate-500" />
//                 </div>

//                 {/* Info Teks */}
//                 <div className="flex-1 space-y-1.5 pt-1 text-slate-900">
//                   <div className="leading-tight">
//                     <div className="text-[5px] font-bold text-slate-900 uppercase tracking-tighter">
//                       Nama Lengkap
//                     </div>
//                     <div className="text-[10px] font-black text-slate-900 uppercase truncate">
//                       BUDI SANTOSO, S.Pd
//                     </div>
//                   </div>

//                   <div className="leading-tight">
//                     <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
//                       Jabatan
//                     </div>
//                     <div className="text-[9px] text-slate-900 font-bold">Wakasek Kurikulum</div>
//                   </div>

//                   <div className="leading-tight">
//                     <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
//                       Email
//                     </div>
//                     <div className="text-[8px] text-slate-900 font-medium opacity-90">
//                       budi.santoso@smkcontoh.sch.id
//                     </div>
//                   </div>

//                   {/* QR placeholder */}
//                   <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/90 rounded-md shadow-md flex items-center justify-center border border-slate-300 p-1">
//                     <div className="text-[5px] font-bold text-slate-900 text-center leading-tight">
//                       QR CODE
//                       <br />
//                       ID Pegawai
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ─── KONTROL CUSTOMISASI ──────────────────────────────── */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
//                 Warna Judul
//               </label>
//               <input
//                 type="color"
//                 value={config.titleColor}
//                 onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
//                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
//                 Warna Subjudul
//               </label>
//               <input
//                 type="color"
//                 value={config.subtitleColor}
//                 onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
//                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
//                 Warna Aksen
//               </label>
//               <input
//                 type="color"
//                 value={config.accentColor}
//                 onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
//                 className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
//                 Judul Kartu
//               </label>
//               <input
//                 value={config.title}
//                 onChange={(e) => setConfig({ ...config, title: e.target.value })}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
//                 placeholder="KARTU PEGAWAI"
//               />
//             </div>
//           </div>

//           {/* Background Presets */}
//           <div className="space-y-4">
//             <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1 block">
//               Background Preset
//             </label>
//             <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
//               {bgPresets.map((bg, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setConfig({ ...config, bgImage: bg })}
//                   className={`aspect-video rounded-xl border-2 overflow-hidden transition-all duration-200 ${
//                     config.bgImage === bg
//                       ? "border-blue-500 scale-95 shadow-lg shadow-blue-500/30"
//                       : "border-white/10 hover:border-white/30 hover:scale-105"
//                   }`}
//                 >
//                   <img src={bg} alt={`bg-${idx + 1}`} className="w-full h-full object-cover" />
//                 </button>
//               ))}

//               {/* Upload custom background */}
//               <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all">
//                 <Upload size={20} className="text-zinc-500 mb-1" />
//                 {/* <span className="text-[9px] text-zinc-500 font-medium">Custom</span> */}
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       const reader = new FileReader();
//                       reader.onload = (ev) => {
//                         setConfig({ ...config, bgImage: ev.target?.result as string });
//                       };
//                       reader.readAsDataURL(file);
//                     }
//                   }}
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Tombol Generate PDF */}
//           <button
//             onClick={onGenerate}
//             disabled={isProcessing}
//             className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all mt-8"
//           >
//             <Printer size={20} />
//             {isProcessing ? "Membuat PDF..." : "Cetak Kartu PDF"}
//           </button>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// ────────────────────────────────────────────────
// Modal Cetak Kartu Guru & Tendik (UPDATED + FULL FEATURE)
// ────────────────────────────────────────────────
// ────────────────────────────────────────────────
// Modal Cetak Kartu Guru & Tendik - FIXED + Transparent
// ────────────────────────────────────────────────
const CardDesignerModal = ({
  open,
  onClose,
  config,
  setConfig,
  onGenerate,
  isProcessing,
}: {
  open: boolean;
  onClose: () => void;
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  onGenerate: () => Promise<void>;
  isProcessing: boolean;
}) => {
  if (!open) return null;

  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);
  
  // State untuk toggle preview depan/belakang
  const [showBackSide, setShowBackSide] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-[10000] h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col p-10 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Design Kartu
            </h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              Sesuaikan tampilan kartu guru & tendik
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-10 flex-1">
          {/* Toggle Depan / Belakang */}
          {/* <div className="flex justify-center">
            <div className="inline-flex bg-white/5 rounded-2xl p-1 border border-white/10">
              <button
                onClick={() => setShowBackSide(false)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  !showBackSide 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Depan (Front)
              </button>
              <button
                onClick={() => setShowBackSide(true)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  showBackSide 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Belakang (Back)
              </button>
            </div>
          </div> */}

          {/* LIVE PREVIEW */}
          <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
            <div
              className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
              style={{
                backgroundImage: config.bgImage ? `url(${config.bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!showBackSide ? (
                /* ==================== FRONT SIDE (SAMA PERSIS DENGAN KODE ASLI) ==================== */
                <>
                  {/* Header Accent - Support Transparent */}
                  <div
                    className="h-10 flex flex-col items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: config.accentColor === "transparent" 
                        ? "transparent" 
                        : config.accentColor,
                      borderBottom: config.accentColor === "transparent" 
                        ? "1px solid rgba(255,255,255,0.1)" 
                        : "none"
                    }}
                  >
                    <div
                      className="text-[10px] font-black tracking-widest uppercase"
                      style={{ color: config.titleColor }}
                    >
                      {config.title}
                    </div>
                    <div
                      className="text-[6px] font-bold opacity-80 uppercase"
                      style={{ color: config.subtitleColor }}
                    >
                      {config.subtitle}
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
                    {/* Foto */}
                    <div className="w-20 h-24 bg-slate-800/40 rounded-lg border border-slate-600/50 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                      <User size={36} className="text-slate-500" />
                    </div>

                    {/* Info Teks */}
                    <div className="flex-1 space-y-1.5 pt-1 text-slate-900">
                      <div className="leading-tight">
                        <div className="text-[5px] font-bold text-slate-900 uppercase tracking-tighter">
                          Nama Lengkap
                        </div>
                        <div className="text-[10px] font-black text-slate-900 uppercase truncate">
                          BUDI SANTOSO, S.Pd
                        </div>
                      </div>
                      <div className="leading-tight">
                        <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
                          Jabatan
                        </div>
                        <div className="text-[9px] text-slate-900 font-bold">Wakasek Kurikulum</div>
                      </div>
                      <div className="leading-tight">
                        <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
                          Email
                        </div>
                        <div className="text-[8px] text-slate-900 font-medium opacity-90">
                          budi.santoso@smkcontoh.sch.id
                        </div>
                      </div>

                      {/* QR placeholder */}
                      <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/90 rounded-md shadow-md flex items-center justify-center border border-slate-300 p-1">
                        <div className="text-[5px] font-bold text-slate-900 text-center leading-tight">
                          QR CODE
                          <br />
                          ID Pegawai
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* ==================== BACK SIDE - SIMPLE ==================== */
                <div className="h-full w-full relative flex flex-col items-center justify-center p-8">
                  {/* QR Code Besar */}
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 mb-6">
                    <div className="w-full h-full bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-300">
                      <div className="text-center text-[11px] font-bold text-zinc-700 leading-tight">
                        QR CODE
                        <br />
                        <span className="text-[9px] opacity-70">NIP</span>
                      </div>
                    </div>
                  </div>

                  {/* NIP */}
                  <div className="text-center">
                    <div className="uppercase text-[10px] tracking-[2px] text-white/60 font-medium mb-1">
                      Nomor Induk Pegawai (NIP)
                    </div>
                    <div className="font-mono text-white text-xl font-bold tracking-widest">
                      196712311234567890
                    </div>
                  </div>

                  <div className="absolute bottom-6 text-[9px] text-white/40">
                    Kartu Identitas Pegawai • {new Date().getFullYear()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KONTROL CUSTOMISASI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Judul
              </label>
              <input
                type="color"
                value={config.titleColor}
                onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Subjudul
              </label>
              <input
                type="color"
                value={config.subtitleColor}
                onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
                className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
              />
            </div>

            {/* WARNA AK SEN + TRANSPARENT (DITERAPKAN) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Aksen Header
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={config.accentColor === "transparent" ? "#2563eb" : config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="w-14 h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, accentColor: "transparent" })}
                  className={`flex-1 h-12 rounded-xl border-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all ${
                    config.accentColor === "transparent"
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/20 hover:border-white/40 bg-white/5 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {config.accentColor === "transparent" ? "✓ Transparent" : "Transparent / No Color"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Judul Kartu
              </label>
              <input
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                placeholder="KARTU PEGAWAI"
              />
            </div>
          </div>

          {/* Background Presets */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1 block">
              Background Preset
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {bgPresets.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setConfig({ ...config, bgImage: bg })}
                  className={`aspect-video rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                    config.bgImage === bg
                      ? "border-blue-500 scale-95 shadow-lg shadow-blue-500/30"
                      : "border-white/10 hover:border-white/30 hover:scale-105"
                  }`}
                >
                  <img src={bg} alt={`bg-${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}

              <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all">
                <Upload size={20} className="text-zinc-500 mb-1" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setConfig({ ...config, bgImage: ev.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Tombol Generate PDF */}
          <button
            onClick={onGenerate}
            disabled={isProcessing}
            className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all mt-8"
          >
            <Printer size={20} />
            {isProcessing ? "Membuat PDF..." : "Cetak Kartu PDF"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const GuruTendikModal = ({
  open,
  onClose,
  initialData,
  onSave,
  isNew,
}: {
  open: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (form: Partial<GuruTendikItem>, file?: File) => Promise<void>;
  isNew: boolean;
}) => {
  const [form, setForm] = useState<GuruTendikItem>({
    nama: "",
    role: ROLE_OPTIONS[0],
    jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
    mapel: "",
    jurusan: "",
    email: "",
    nip: "",
    photoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  useEffect(() => {
    if (open) {
      setForm({
        nama: initialData.nama || "",
        role: initialData.role || ROLE_OPTIONS[0],
        jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
        mapel: initialData.mapel || "",
        jurusan: initialData.jurusan || "",
        email: initialData.email || "",
        nip: initialData.nip || "",
        photoUrl: initialData.photoUrl || "",
      });
      setPreview(initialData.photoUrl || "");
      setSelectedFile(null);
    }
  }, [open, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const isFormValid = useMemo(() => {
    const isNamaValid = form.nama.trim() !== "";

    const isEmailValid =
      form.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    return isNamaValid && isEmailValid;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    setSaving(true);
    setSubmitError(null); // reset error sebelum submit
    try {
      await onSave(form, selectedFile || undefined);
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan saat menyimpan");
      toast.error(err.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview("");
    setForm({ ...form, photoUrl: "" });
  };

  // ... (sama persis seperti kode asli Anda, hanya ditampilkan sebagian agar ringkas)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[10000] h-full w-full overflow-y-auto max-w-lg bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header modal */}
             <div className="p-8 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {isNew ? "Tambah Guru" : "Perbarui Guru"}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
                  Guru & Tenaga Kependidikan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

           <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group flex items-center justify-center">
                  <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-blue-500 transition-all flex items-center justify-center bg-white/5">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      // <User size={48} className="text-white/10" />
                      <></>
                    )}
                  </div>
                 <label className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-500 shadow-xl border-4  transition-transform hover:scale-110">
                  <Plus size={36} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                {
                  preview ? (
                    <p onClick={handleRemovePhoto} className="flex items-center gap-2 bg-red-600 rounded-md cursor-pointer p-2 active:scale-[0.98] hover:bg-red-800 text-[10px] text-white uppercase font-black tracking-widest">
                      <Trash2 size={16} />
                      Hapus photo
                    </p>
                  ):
                    <p className="mt-1 text-[10px] text-white/30 uppercase font-black tracking-widest">Photo (opsional)</p>
                }
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Dr. Budi Santoso"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Jabatan</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Gender</label>
                    <select
                      value={form.jenisKelamin}
                      onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {JENIS_KELAMIN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center justify-between">
                    <span>NIP (opsional)</span>
                    <span className="text-red-400/70 text-[9px] font-normal normal-case">
                      maks. 18 digit • boleh kosong
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={form.nip || ""}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setForm({ ...form, nip: val });
                    }}
                    placeholder="Contoh: 196712311234567890"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white 
                              focus:border-blue-500 outline-none transition-all placeholder:text-white/10 
                              font-mono tracking-wide"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><span className="text-red-400">*</span>Akun email</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@sekolah.sch.id"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mapel (opsional)</label>
                    <input
                      type="text"
                      value={form.mapel || ""}
                      onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Jurusan (opsional)</label>
                    <input
                      type="text"
                      value={form.jurusan || ""}
                      onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </form>
            
            {submitError && (
              <div className="w-full flex justify-center items-center mb-6">
                <div className="relative p-2 w-[87%] mx-auto flex items-center gap-2 text-red-600 bg-red-100/90 rounded-lg text-xs">
                  <AlertCircle size={14} />
                  <p>
                    Jika terjadi masalah <b>Request timeout</b>, coba upload tanpa photo
                  </p>
                </div>
              </div>
            )}

            <div className="p-8 border-t border-white/10 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-sm uppercase tracking-widest text-white/30 hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !isFormValid}
                className={`flex-[2] py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all
                  ${
                    saving || !isFormValid
                      ? "bg-zinc-600 text-white/40 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }
                `}
              >
                {saving ? "Memproses..." : (
                  <>
                    <Save size={16} /> Simpan
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
export default function TeacherManager() {
  // const [data, setData] = useState<GuruTendikItem[]>([]);
  // const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDesigner, setShowCardDesigner] = useState(false);
  const queryClient = useQueryClient();
  const [showDuplicateOnly, setShowDuplicateOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // bisa dibuat selectable nanti
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [cardConfig, setCardConfig] = useState({
    title: "KARTU PEGAWAI",
    subtitle: "YAYASAN PENDIDIKAN XYZ",
    accentColor: "#2563eb",        // default
    titleColor: "#ffffff",
    subtitleColor: "#e5e7eb",
    bgImage: null as string | null,
  });

  const school = useSchool();
  const SCHOOL_ID = school?.data?.[0]?.id;

  // ─── REACT QUERY: Fetch Data ───────────────────────────────
  const { 
    data: teacherResponse, 
    isLoading: loading, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['teachers', SCHOOL_ID, debouncedSearch, showDuplicateOnly, currentPage, itemsPerPage],
    queryFn: async () => {
      if (!SCHOOL_ID) return { data: [], summary: { totalNipIssues: 0, totalEmailIssues: 0 }, pagination: {} };

      const params = new URLSearchParams({
        schoolId: SCHOOL_ID.toString(),
        name: debouncedSearch.trim(),
        isDuplicateOnly: showDuplicateOnly ? 'true' : 'false',
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data guru/tendik");
      return await res.json();
    },
    enabled: !!SCHOOL_ID,
    staleTime: 1000 * 60,
  });

  // --- LOGIKA DEBOUNCE ---
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  // console.log('teacher data', teacherData)

  // Handler saat input diketik
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value); // Update text di input secara instan
    debouncedSetSearch(value); // Jalankan filter setelah jeda 500ms
  };

  // Cleanup saat komponen unmount
  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

 const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value.toString());
    });
    if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());
    if (file) formData.append("photo", file);

    const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
    const method = selectedItem?.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        // Tangkap pesan duplikat secara spesifik dari backend
        throw new Error(json.message || "Gagal menyimpan data");
      }

      // Sukses
      toast.success("Data berhasil disimpan", {
        duration: 4000,
      });

      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data guru/tendik ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (res.ok) {
        toast.success("Data dihapus");
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        // fetchData();
      }
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  };

  // ─── Download Template Excel ───────────────────────────────
  const handleDownloadTemplate = () => {
    const template = [
      {
        Nama: "Dr. Budi Santoso",
        Jabatan: "Kepala Sekolah",
        Gender: "Laki-laki",
        Email: "kepsek@smkn1contoh.sch.id",
        Mapel: "-",
        NIP: "123456789123456789",
        Jurusan: "-",
      },
      {
        Nama: "Dra. Siti Aminah",
        Jabatan: "Guru",
        Gender: "Perempuan",
        Email: "siti.aminah@smkn1contoh.sch.id",
        Mapel: "Matematika",
        NIP: "123456789123456789",
        Jurusan: "IPA",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GuruTendik");
    XLSX.writeFile(wb, "Template_Guru_Tendik.xlsx");
  };

  // ─── Import Excel (Bulk Create) ─────────────────────────────
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !SCHOOL_ID) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });

        for (const row of rows) {
          const formData = new FormData();
          formData.append("nama", row["Nama"] || "");
          formData.append("role", row["Jabatan"] || "");
          formData.append("jenisKelamin", row["Gender"] || "");
          formData.append("email", row["Email"] || "");
          formData.append("mapel", row["Mapel"] || "");
          formData.append("nip", row["NIP"] || "");
          formData.append("jurusan", row["Jurusan"] || "");
          formData.append("schoolId", SCHOOL_ID.toString());

          await fetch(BASE_URL, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
            body: formData,
          });
        }

        toast.success("Import selesai");
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        // fetchData();
      } catch (err) {
        toast.error("Gagal import data");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMarkAbsence = async (teacher: any, status: 'Izin' | 'Sakit' | 'Alpha') => {
    if (!confirm(`Tandai ${teacher.nama} sebagai ${status} hari ini?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/mark-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guruId: teacher.id,
          schoolId: SCHOOL_ID,
          status: status,
          userRole: 'teacher' // Memberitahu backend bahwa ini adalah Guru/Pegawai
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Berhasil mencatat ${status} untuk ${teacher.nama}`);
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
      } else {
        throw new Error(json.message || "Gagal mencatat");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mencatat ketidakhadiran");
    }
  };

const generateTeacherCardsPDF = async () => {
  setIsProcessing(true);
  setShowProgress(true);
  setShowCardDesigner(false);

  try {
    const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}&limit=9999`);
    const allData = await res.json();
    const allTeachers = allData.data || teachers;

    if (!allTeachers || allTeachers.length === 0) {
      toast.error("Tidak ada data guru untuk dicetak");
      return;
    }

    setTotalItems(allTeachers.length); // ← pastikan label "Total X Guru" muncul

    const doc = new jsPDF("p", "mm", "a4");
    const cardWidth = 86;
    const cardHeight = 54;
    const marginLeft = 12;
    const marginTop = 10;
    const spacing = 7;

    for (let i = 0; i < allTeachers.length; i++) {
      const t = allTeachers[i];
      const cardIndex = i % 8;
      const col = cardIndex % 2;
      const row = Math.floor(cardIndex / 2);
      const x = marginLeft + col * (cardWidth + spacing);
      const y = marginTop + row * (cardHeight + spacing);

      if (i > 0 && cardIndex === 0) doc.addPage();

      if (cardIndex < 4) {
        // ==================== FRONT SIDE ====================
        doc.setFillColor(15, 23, 42);
        doc.rect(x, y, cardWidth, cardHeight, "F");

        if (cardConfig.bgImage) {
          try {
            const img = new Image();
            img.src = cardConfig.bgImage;
            await new Promise((resolve) => { img.onload = resolve; });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 860; canvas.height = 540;
            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let sw = img.width, sh = img.height, sx = 0, sy = 0;
            if (imgRatio > canvasRatio) { sh = img.height; sw = sh * canvasRatio; sx = (img.width - sw) / 2; }
            else { sw = img.width; sh = sw / canvasRatio; sy = (img.height - sh) / 2; }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
            doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, cardWidth, cardHeight);
          } catch (e) {}
        }

        if (cardConfig.accentColor !== "transparent") {
          doc.setFillColor(cardConfig.accentColor);
          doc.rect(x, y, cardWidth, 12, "F");
        }

        doc.setTextColor(cardConfig.titleColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(cardConfig.title, x + 43, y + 6, { align: "center" });
        doc.setTextColor(cardConfig.subtitleColor);
        doc.setFontSize(6);
        doc.text(cardConfig.subtitle, x + 43, y + 10, { align: "center" });

        if (t.photoUrl) {
          try { doc.addImage(t.photoUrl, "JPEG", x + 5, y + 15, 18, 22); }
          catch { doc.setFillColor(30, 41, 59); doc.rect(x + 5, y + 15, 18, 22, "F"); }
        } else {
          doc.setFillColor(30, 41, 59);
          doc.rect(x + 5, y + 15, 18, 22, "F");
        }

        doc.setTextColor("#0f172a");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(t.nama.length > 28 ? 8.2 : 9.5);
        doc.text(t.nama.toUpperCase(), x + 27, y + 19, { maxWidth: 55 });
        doc.setFontSize(8);
        doc.text(`Jabatan: ${t.role || "Staff"}`, x + 27, y + 26, { maxWidth: 55 });
        doc.text(`Jenis Kelamin: ${t.jenisKelamin || "-"}`, x + 27, y + 31, { maxWidth: 55 });

        try {
          const qrDataUrl = await QRCode.toDataURL(t.qrCodeData || t.nip || `GURU-${t.id || i}`, { margin: 1, width: 180 });
          doc.addImage(qrDataUrl, "PNG", x + 65, y + 32, 18, 18);
        } catch (e) {
          doc.setFillColor(240, 240, 240);
          doc.rect(x + 65, y + 32, 18, 18, "F");
        }

        // ✅ Update progress setelah selesai render front card
        setProgress(Math.round(((i + 1) / allTeachers.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 0)); // yield ke React

      } else {
        // ==================== BACK SIDE ====================
        doc.setFillColor(15, 23, 42);
        doc.rect(x, y, cardWidth, cardHeight, "F");

        if (cardConfig.bgImage) {
          try {
            const img = new Image();
            img.src = cardConfig.bgImage;
            await new Promise((resolve) => { img.onload = resolve; });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 860; canvas.height = 540;
            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let sw = img.width, sh = img.height, sx = 0, sy = 0;
            if (imgRatio > canvasRatio) { sh = img.height; sw = sh * canvasRatio; sx = (img.width - sw) / 2; }
            else { sw = img.width; sh = sw / canvasRatio; sy = (img.height - sh) / 2; }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
            doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, cardWidth, cardHeight);
          } catch (e) {}
        }

        try {
          const qrDataUrl = await QRCode.toDataURL(t.qrCodeData || t.nip || `GURU-${t.id || i}`, { margin: 1, width: 138 });
          doc.addImage(qrDataUrl, "PNG", x + 29, y + 13.5, 25, 25);
        } catch (e) {
          doc.setFillColor(255, 255, 255);
          doc.rect(x + 29, y + 13.5, 25, 25, "F");
        }

        doc.setTextColor("#000000");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(t.nip || "-", x + 43, y + 44, { align: "center" });

        // ✅ Update progress setelah selesai render back card
        setProgress(Math.round(((i + 1) / allTeachers.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 0)); // yield ke React
      }
    }

    doc.save(`Kartu_Guru_Tendik_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success(`PDF berhasil dibuat untuk ${allTeachers.length} guru`);

  } catch (err) {
    console.error(err);
    toast.error("Gagal membuat file PDF");
  } finally {
    setShowProgress(false);
    setIsProcessing(false);
  }
};

  const teachers = teacherResponse?.data || [];
  const duplicateSummary = teacherResponse?.summary || { totalNipIssues: 0, totalEmailIssues: 0 };
  const pagination = teacherResponse?.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: itemsPerPage
  };

  const getStatusStyle = (status: string | undefined) => {
    const s = status?.toLowerCase();
    if (s === "hadir") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "sakit") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (s === "izin") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s === "alpha") return "bg-red-500/10 text-red-400 border-red-500/20";
    
    // Default untuk "Belum Hadir"
    return "bg-zinc-500/10 text-zinc-500 border-zinc-500/10";
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-10">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Briefcase size={14} /> Personnel Directory
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
            Guru <span className="text-blue-700">& Tendik</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Manajemen kehadiran & profil pegawai</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="h-14 px-5 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest"
            disabled={isProcessing}
          >
            <Download size={16} /> Template
          </button>

          <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <FileSpreadsheet size={16} /> Import
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleBulkImport}
              disabled={isProcessing}
            />
          </label>

          <button
            onClick={() => setShowCardDesigner(true)}
            className="h-14 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
          >
            <Palette size={16} /> Cetak Kartu
          </button>

           <button 
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
            <Plus size={16}/> Tambah
          </button>

        </div>
      </div>

      {duplicateSummary.totalNipIssues > 0 || duplicateSummary.totalEmailIssues > 0 ? (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
            <AlertTriangle size={20} className="text-red-400" />
            <div>
              <h4 className="text-sm font-black uppercase text-red-400">Duplikat Terdeteksi!</h4>
              <p className="text-xs text-zinc-300 mt-1">
                Terdapat <strong className="text-white">{duplicateSummary.totalNipIssues} NIP</strong> dan 
                <strong className="text-white"> {duplicateSummary.totalEmailIssues} Email</strong> yang sama.
                {showDuplicateOnly ? " (sedang menampilkan hanya duplikat)" : ""}
              </p>
            </div>
          </div>
        ) : null}

        <div className="relative flex-1 w-full mb-6 group flex items-center gap-3 justify-between">
          <div className="w-[80%]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau role"
              value={search}
              onChange={handleSearchChange}
              className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
            />
          </div>

          <button
            onClick={() => {
              setShowDuplicateOnly(prev => {
                const newValue = !prev;
                // Paksa refetch setelah state berubah
                setTimeout(() => refetch(), 0);  // refetch setelah render selesai
                return newValue;
              });
            }}
            className={`px-5 h-14 px-5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              showDuplicateOnly
                ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40'
                : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <AlertTriangle size={14} />
            <p className="w-max flex items-center">
              {showDuplicateOnly ? 'Hanya Duplikat' : 'Hanya Duplikat Saja'}
            </p>
          </button>
          
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="flex-1 h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>
      </div>

      {/* Content */}
      {loading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-6"></div>
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
              Memuat Data Guru & Tendik...
            </p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-40 bg-white/[0.03] rounded-[3rem] border border-dashed border-white/15 shadow-inner">
            <div className="mx-auto w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <User size={32} className="text-zinc-500" />
            </div>
            <p className="text-xl font-bold text-zinc-300 mb-2">Tidak ada data ditemukan</p>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              {showDuplicateOnly 
                ? "Tidak ada duplikat NIP atau Email pada sekolah ini." 
                : debouncedSearch 
                  ? `Tidak ditemukan hasil untuk pencarian "${debouncedSearch}"` 
                  : "Belum ada guru atau tendik yang terdaftar di sekolah ini."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
              {teachers.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300 group"
                >
                  {/* Foto + Gender Badge */}
                  <div className="flex items-start gap-5">
                    <div className="relative h-28 w-28 flex-shrink-0">
                      <div className="h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                        {item.photoUrl ? (
                          <img 
                            src={item.photoUrl || '/defaultProfile.png'} 
                            alt={item.nama} 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white/20">
                            <User size={40} />
                          </div>
                        )}
                      </div>

                      {/* Gender Icon Badge */}
                      <div 
                        className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-4 border-[#0B1220] text-white text-xl font-black
                          ${item.jenisKelamin === "Laki-laki" ? 'bg-blue-600' : 'bg-pink-600'}`}
                      >
                        {item.jenisKelamin === "Laki-laki" ? <FaMars /> : <FaVenus />}
                      </div>
                    </div>

                    {/* Info Utama */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                        {item.role || "Staff"}
                      </div>
                      <h3 className="text-xl font-black text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
                        {item.nama}
                      </h3>

                      {/* Status Kehadiran + Waktu Scan */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(item.statusKehadiran)}`}
                        >
                          {item.statusKehadiran || 'Belum Hadir'}
                        </span>

                        {item.scanTime && (
                          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                            <Clock size={14} className="text-zinc-500" />
                            {item.scanTime}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="mt-3 flex items-center gap-2 text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
                        <Mail size={14} />
                        <span className="truncate">{item.email || "Tidak ada email"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Tambahan (Mapel & NIP) */}
                  <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                      <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Mata Pelajaran</div>
                      <div className="text-sm font-bold text-white truncate">
                        {item.mapel || "Umum / Tidak Ada"}
                      </div>
                    </div>

                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                      <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">NIP</div>
                      <div className="text-sm font-mono font-bold text-white truncate">
                        {item.nip || "-"}
                        {item.isNipDuplicate && (
                          <AlertTriangle size={14} className="inline ml-2 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Kehadiran */}
                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {['Hadir', 'Izin', 'Sakit', 'Alpha'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleMarkAbsence(item, st as any)}
                        className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border
                          ${item.statusKehadiran === st 
                            ? 'border-slate-400/70 bg-slate-700/30' 
                            : 'border-transparent hover:bg-white/5'} 
                          ${getStatusStyle(st)}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Tombol Aksi Utama */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                      className="flex-1 py-3.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-2xl flex items-center justify-center gap-2 transition-all font-medium text-sm"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => navigate(`/detail/${item.id}?role=teacher`)}
                      className="w-14 py-3.5 bg-white/5 hover:bg-white/15 text-white rounded-2xl flex items-center justify-center transition-all"
                      title="Lihat Detail & Riwayat"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="w-14 py-3.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-2xl flex items-center justify-center transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 px-4">
                <div className="text-sm text-zinc-400">
                  Menampilkan <strong className="text-white">{teachers.length}</strong> dari <strong className="text-white">{pagination.totalItems}</strong> data
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={pagination.currentPage === 1 || isFetching}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    ← Prev
                  </button>

                  <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
                    Halaman <strong className="text-blue-400">{pagination.currentPage}</strong> / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.currentPage === pagination.totalPages || isFetching}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {showProgress && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md text-center shadow-2xl">
              <div className="mb-6">
                <div className="h-20 w-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Printer className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                  Sedang Membuat PDF Kartu
                </h3>
                <p className="text-zinc-500 text-sm mt-1">Jangan tutup halaman ini</p>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-blue-500">{progress}% Selesai</span>
                <span className="text-zinc-600">Total {totalItems} Guru</span>
              </div>
            </div>
          </div>
        )}

      <GuruTendikModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem || {}}
        onSave={handleSave}
        isNew={!selectedItem}
      />

      {/* Modal Custom Card + Live Preview */}
      <CardDesignerModal
        open={showCardDesigner}
        onClose={() => setShowCardDesigner(false)}
        config={cardConfig}
        setConfig={setCardConfig}
        onGenerate={generateTeacherCardsPDF}
        isProcessing={isProcessing}
      />
    </div>
  );
}