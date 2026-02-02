// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Edit, FileText, Loader, Plus, X } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";

// const BASE_URL = "https://be-school.kiraproject.id/ppdb";

// // ──────────────────────────────────────────────────────────────
// // Utilities
// // ──────────────────────────────────────────────────────────────

// const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// const getAuthHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
// });

// const apiFetch = async (url: string, options: RequestInit = {}) => {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...getAuthHeaders(),
//       ...options.headers,
//     },
//   });

//   let data;
//   try {
//     data = await response.json();
//   } catch {
//     data = {};
//   }

//   if (!response.ok) {
//     throw new Error(data.message || `HTTP error! status: ${response.status}`);
//   }

//   return data;
// };

// const useAlert = () => {
//   const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({
//     message: "",
//     isVisible: false,
//   });

//   const showAlert = (message: string) => {
//     setAlert({ message, isVisible: true });
//     setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
//   };

//   const hideAlert = () => setAlert({ message: "", isVisible: false });

//   return { alert, showAlert, hideAlert };
// };

// const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-6 rounded-xl border p-4 text-sm shadow-lg",
//         isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-center justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button type="button" onClick={onClose} className="ml-4 text-xl">
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // ──────────────────────────────────────────────────────────────
// // ListEditor Component (untuk persyaratan, mirip ListEditor misi)
// // ──────────────────────────────────────────────────────────────

// interface ListEditorProps {
//   items: string[];
//   onChange: (newList: string[]) => void;
//   placeholder?: string;
//   label: string;
// }

// const ListEditor: React.FC<ListEditorProps> = ({
//   items,
//   onChange,
//   placeholder = "Masukkan item...",
//   label,
// }) => {
//   const addItem = () => onChange([...items, ""]);

//   const updateItem = (index: number, value: string) => {
//     const copy = [...items];
//     copy[index] = value;
//     onChange(copy);
//   };

//   const deleteItem = (index: number) => {
//     onChange(items.filter((_, i) => i !== index));
//   };

//   const moveUp = (index: number) => {
//     if (index <= 0) return;
//     const copy = [...items];
//     [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
//     onChange(copy);
//   };

//   const moveDown = (index: number) => {
//     if (index >= items.length - 1) return;
//     const copy = [...items];
//     [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
//     onChange(copy);
//   };

//   const Icon = ({ label }: { label: string }) => (
//     <span
//       aria-hidden
//       className="inline-block align-middle select-none"
//       style={{ width: 16 }}
//     >
//       {label}
//     </span>
//   );
//   const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="space-y-3">
//       <label className="block text-sm text-zinc-400 mb-2">{label}</label>

//       {items.length === 0 && (
//         <p className="text-zinc-500 text-sm italic">Belum ada persyaratan ditambahkan</p>
//       )}

//       {items.map((item, index) => (
//         <div key={index} className="flex items-center gap-2">
//           <input
//             type="text"
//             value={item}
//             onChange={(e) => updateItem(index, e.target.value)}
//             placeholder={`${placeholder} #${index + 1}`}
//             className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
//           />
//           <button
//             type="button"
//             onClick={() => moveUp(index)}
//             className="rounded-lg border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-700/70 disabled:opacity-50"
//             disabled={index === 0}
//             title="Naikkan urutan"
//           >
//             ↑
//           </button>
//           <button
//             type="button"
//             onClick={() => moveDown(index)}
//             className="rounded-lg border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-700/70 disabled:opacity-50"
//             disabled={index === items.length - 1}
//             title="Turunkan urutan"
//           >
//             ↓
//           </button>
//           <button
//             type="button"
//             onClick={() => deleteItem(index)}
//             className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
//             title="Hapus"
//           >
//             Hapus
//           </button>
//         </div>
//       ))}

//       <button
//         type="button"
//         onClick={addItem}
//         className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/20 transition-colors"
//       >
//         <ISave />
//         Tambah Persyaratan
//       </button>
//     </div>
//   );
// };

// // ──────────────────────────────────────────────────────────────
// // Main Component
// // ──────────────────────────────────────────────────────────────

// const DEFAULT_FORM = {
//   year: new Date().getFullYear(),
//   description: "",
//   startDate: "",
//   endDate: "",
//   requirements: [] as string[],
//   quota: "",
//   contactEmail: "",
//   contactPhone: "",
// };

// function PPDBManager() {
//   const { alert, showAlert, hideAlert } = useAlert();
//   const schoolData = useSchool();
//   const schoolId = schoolData?.data?.[0]?.id;

//   const [config, setConfig] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(DEFAULT_FORM);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchConfig = useCallback(async () => {
//     if (!schoolId) return showAlert("ID sekolah tidak ditemukan");

//     setLoading(true);
//     try {
//       const data = await apiFetch(`${BASE_URL}?schoolId=${schoolId}`);
//       if (data.success && data.data) {
//         const latest = Array.isArray(data.data) ? data.data[0] : data.data;
//         setConfig(latest);
//       } else {
//         setConfig(null);
//       }
//     } catch (err: any) {
//       showAlert(err.message || "Gagal memuat data PPDB");
//       setConfig(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolId, showAlert]);

//   useEffect(() => {
//     if (schoolId) fetchConfig();
//   }, [schoolId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) return showAlert("ID sekolah tidak ditemukan");

//     setLoading(true);
//     try {
//       const payload = {
//         schoolId,
//         year: Number(formData.year),
//         description: formData.description.trim(),
//         startDate: formData.startDate || null,
//         endDate: formData.endDate || null,
//         requirements: formData.requirements.filter((r: string) => r.trim() !== ""),
//         quota: formData.quota ? Number(formData.quota) : null,
//         contactEmail: formData.contactEmail.trim() || null,
//         contactPhone: formData.contactPhone.trim() || null,
//       };

//       let resData;
//       if (config?.id) {
//         resData = await apiFetch(`${BASE_URL}/${config.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         resData = await apiFetch(BASE_URL, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (resData.success) {
//         showAlert("Konfigurasi PPDB berhasil disimpan");
//         setIsModalOpen(false);
//         fetchConfig();
//       }
//     } catch (err: any) {
//       showAlert(err.message || "Gagal menyimpan konfigurasi PPDB");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     if (config) {
//       setFormData({
//         year: config.year,
//         description: config.description || "",
//         startDate: config.startDate ? config.startDate.split("T")[0] : "",
//         endDate: config.endDate ? config.endDate.split("T")[0] : "",
//         requirements: Array.isArray(config.requirements) ? config.requirements : [],
//         quota: config.quota ?? "",
//         contactEmail: config.contactEmail || "",
//         contactPhone: config.contactPhone || "",
//       });
//     } else {
//       setFormData({ ...DEFAULT_FORM, year: new Date().getFullYear() });
//     }
//     setIsModalOpen(true);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const Icon = ({ label }: { label: string }) => (
//     <span
//       aria-hidden
//       className="inline-block align-middle select-none"
//       style={{ width: 16 }}
//     >
//       {label}
//     </span>
//   );
//   const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="min-h-screen text-zinc-100">
//       <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mt-4 mb-5">
//           <button
//             onClick={openModal}
//             disabled={loading}
//             className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
//           >
//             {config ? <ISave /> : <ISave />}
//             {config ? "Edit Konfigurasi" : "Buat Konfigurasi PPDB"}
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader className="h-10 w-10 animate-spin text-blue-500" />
//           </div>
//         ) : !config ? (
//           <div className="text-center py-16 bg-white/5 rounded-2xl border border-zinc-800">
//             <FileText className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
//             <h2 className="text-xl font-semibold text-zinc-300 mb-2">Belum ada konfigurasi PPDB</h2>
//             <p className="text-zinc-500 mb-6">Silakan buat konfigurasi untuk tahun ajaran saat ini</p>
//             <button
//               onClick={openModal}
//               className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-white font-medium"
//             >
//               <Plus size={18} /> Buat Sekarang
//             </button>
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-zinc-700/50 bg-white/5 p-6 backdrop-blur-sm space-y-6 pb-10">
//             <div className="flex justify-between items-start">
//               <div className="w-full flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">
//                   PPDB Tahun {config.year}
//                 </h2>
//                 <p className="text-zinc-400">
//                   {config.startDate && config.endDate
//                     ? `${new Date(config.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} – ${new Date(config.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
//                     : "Periode belum ditentukan"}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-6">
//               <div className="w-full flex flex-col justify-start text-left">
//                 <h3 className="text-lg font-semibold text-zinc-200 mb-3">Deskripsi</h3>
//                 <p className="text-zinc-300 whitespace-pre-line">{config.description || "Belum ada deskripsi"}</p>
//               </div>

//               <div className="w-full flex flex-col justify-start text-left pl-10">
//                 <h3 className="text-lg font-semibold text-zinc-200 mb-3">Informasi Kontak</h3>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-zinc-500">Email:</span> {config.contactEmail || "—"}</p>
//                   <p><span className="text-zinc-500">Telepon:</span> {config.contactPhone || "—"}</p>
//                 </div>
//               </div>
//               <div className="w-full flex flex-col justify-start text-left pl-10">
//                 <h3 className="text-lg font-semibold text-zinc-200 mb-3">Kuota Pendaftaran</h3>
//                 <p className="text-2xl font-bold text-blue-400">
//                   {config.quota ?? "Tidak Dibatasi"}
//                   {config.quota && <span className="text-lg font-normal text-zinc-500 ml-2">siswa</span>}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 pt-6 gap-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-zinc-200 mb-3">Persyaratan</h3>
//                 {config.requirements?.length > 0 ? (
//                   <ul className="list-disc pt-4 list-inside space-y-1.5 text-zinc-300 leading-loose border-t border-white/20">
//                     {config.requirements.map((req: string, i: number) => (
//                       <li key={i}>{req}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-zinc-500 italic">Belum ada persyaratan yang ditambahkan</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal */}
//         <Transition appear show={isModalOpen} as={React.Fragment}>
//           <Dialog as="div" className="relative z-[9999999]" onClose={() => setIsModalOpen(false)}>
//             <Transition.Child
//               as={React.Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className="fixed inset-0 bg-black/80" />
//             </Transition.Child>

//             <div className="fixed inset-0 overflow-y-auto">
//               <div className="flex min-h-full items-center justify-center p-4">
//                 <Transition.Child
//                   as={React.Fragment}
//                   enter="ease-out duration-300"
//                   enterFrom="opacity-0 scale-95"
//                   enterTo="opacity-100 scale-100"
//                   leave="ease-in duration-200"
                  
//                   leaveFrom="opacity-100 scale-100"
//                   leaveTo="opacity-0 scale-95"
//                 >
//                   <Dialog.Panel className="absolute top-0 right-0 w-full max-w-lg transform overflow-hidden bg-black/70 border border-zinc-700/70 p-6 text-left shadow-xl transition-all">
//                     <Dialog.Title className="text-xl font-bold mb-6 flex items-center justify-between text-white">
//                       <span>{config ? "Edit Konfigurasi PPDB" : "Buat Konfigurasi PPDB"}</span>
//                       <button onClick={() => setIsModalOpen(false)}>
//                         <X size={24} className="text-zinc-400 hover:text-white" />
//                       </button>
//                     </Dialog.Title>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">Tahun Ajaran</label>
//                           <input
//                             type="number"
//                             name="year"
//                             value={formData.year}
//                             onChange={handleInputChange}
//                             min={new Date().getFullYear()}
//                             required
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">Kuota (opsional)</label>
//                           <input
//                             type="number"
//                             name="quota"
//                             value={formData.quota}
//                             onChange={handleInputChange}
//                             placeholder="Kosongkan jika tidak dibatasi"
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm text-zinc-400 mb-2">Deskripsi PPDB</label>
//                         <textarea
//                           name="description"
//                           value={formData.description}
//                           onChange={handleInputChange}
//                           rows={3}
//                           placeholder="Informasi umum tentang PPDB tahun ini..."
//                           className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">Tanggal Mulai Pendaftaran</label>
//                           <input
//                             type="date"
//                             name="startDate"
//                             value={formData.startDate}
//                             onChange={handleInputChange}
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">Tanggal Akhir Pendaftaran</label>
//                           <input
//                             type="date"
//                             name="endDate"
//                             value={formData.endDate}
//                             onChange={handleInputChange}
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>
//                       </div>

//                       {/* Bagian Persyaratan menggunakan ListEditor */}
//                       <ListEditor
//                         items={formData.requirements}
//                         onChange={(newReqs) => setFormData((prev: any) => ({ ...prev, requirements: newReqs }))}
//                         label="Persyaratan Pendaftaran"
//                         placeholder="Contoh: Fotokopi Kartu Keluarga"
//                       />

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">Email Kontak</label>
//                           <input
//                             type="email"
//                             name="contactEmail"
//                             value={formData.contactEmail}
//                             onChange={handleInputChange}
//                             placeholder="contoh@sekolah.sch.id"
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-zinc-400 mb-2">No. Telepon / WA Kontak</label>
//                           <input
//                             type="tel"
//                             name="contactPhone"
//                             value={formData.contactPhone}
//                             onChange={handleInputChange}
//                             placeholder="0812-3456-7890"
//                             className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 justify-end gap-4 pt-6 border-t border-zinc-800">
//                         <button
//                           type="button"
//                           onClick={() => setIsModalOpen(false)}
//                           className="px-6 py-2 text-sm border border-zinc-600 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors"
//                         >
//                           Batal
//                         </button>
//                         <button
//                           type="submit"
//                           disabled={loading}
//                           className="px-6 py-2 text-sm justify-center bg-blue-500 hover:bg-blue-600 rounded-lg text-white flex items-center gap-2 disabled:opacity-60 transition-colors"
//                         >
//                           {loading && <Loader className="h-5 w-5 animate-spin" />}
//                           Simpan Konfigurasi
//                         </button>
//                       </div>
//                     </form>
//                   </Dialog.Panel>
//                 </Transition.Child>
//               </div>
//             </div>
//           </Dialog>
//         </Transition>
//       </div>
//     </div>
//   );
// }

// export default PPDBManager;



import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, FileText, Layers, Loader, Plus, Save, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/ppdb";

// ──────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────

const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

const useAlert = () => {
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false,
  });

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  };

  const hideAlert = () => setAlert({ message: "", isVisible: false });

  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "fixed top-5 right-5 z-[999999] max-w-md rounded-xl border p-4 text-sm shadow-2xl backdrop-blur-md",
        isSuccess ? "border-green-500/30 bg-green-500/20 text-green-300" : "border-red-500/30 bg-red-500/20 text-red-300"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="whitespace-pre-line font-medium">{message}</div>
        <button type="button" onClick={onClose} className="text-lg hover:opacity-70">✕</button>
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────────
// AdmissionPathEditor Component (New!)
// ──────────────────────────────────────────────────────────────

interface PathItem {
  name: string;
  quota: string;
  description: string;
}

const AdmissionPathEditor = ({ paths, onChange }: { paths: PathItem[], onChange: (val: PathItem[]) => void }) => {
  const addPath = () => onChange([...paths, { name: "", quota: "", description: "" }]);
  
  const updatePath = (index: number, field: keyof PathItem, value: string) => {
    const newPaths = [...paths];
    newPaths[index][field] = value;
    onChange(newPaths);
  };

  const removePath = (index: number) => onChange(paths.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-zinc-300">Jalur Pendaftaran</label>
        <button 
          type="button" 
          onClick={addPath}
          className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full hover:bg-blue-500/20 transition-all"
        >
          + Tambah Jalur
        </button>
      </div>
      
      <div className="space-y-3">
        {paths.map((path, idx) => (
          <div key={idx} className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl relative group">
            <button 
              type="button" 
              onClick={() => removePath(idx)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={14} />
            </button>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Nama Jalur (e.g. Zonasi)"
                value={path.name}
                onChange={(e) => updatePath(idx, "name", e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
              />
              <input
                placeholder="Kuota (e.g. 50% / 100 Siswa)"
                value={path.quota}
                onChange={(e) => updatePath(idx, "quota", e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <textarea
              placeholder="Keterangan singkat jalur..."
              value={path.description}
              onChange={(e) => updatePath(idx, "description", e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none resize-none"
            />
          </div>
        ))}
        {paths.length === 0 && <p className="text-zinc-600 text-xs italic text-center py-2">Belum ada jalur pendaftaran khusus.</p>}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// ListEditor Component
// ──────────────────────────────────────────────────────────────

interface ListEditorProps {
  items: string[];
  onChange: (newList: string[]) => void;
  placeholder?: string;
  label: string;
}

const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, placeholder, label }) => {
  const addItem = () => onChange([...items, ""]);
  const updateItem = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };
  const deleteItem = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-zinc-300">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`${placeholder} #${index + 1}`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => deleteItem(index)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-xs flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        <Plus size={14} /> Tambah Item Persyaratan
      </button>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  year: new Date().getFullYear(),
  description: "",
  startDate: "",
  endDate: "",
  requirements: [] as string[],
  admissionPaths: [] as PathItem[],
  quota: "",
  contactEmail: "",
  contactPhone: "",
};

function PPDBManager() {
  const { alert, showAlert, hideAlert } = useAlert();
  const schoolData = useSchool();
  const schoolId = schoolData?.data?.[0]?.id;

  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>(DEFAULT_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

 // Ganti fetchConfig yang lama dengan ini
  const fetchConfig = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const data = await apiFetch(`${BASE_URL}?schoolId=${schoolId}`);
      if (data.success && data.data) {
        const latest = Array.isArray(data.data) ? data.data[0] : data.data;
        setConfig(latest);
      } else {
        setConfig(null);
      }
    } catch (err: any) {
      // Gunakan console.error agar tidak memicu re-render alert terus menerus saat error
      console.error("PPDB Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [schoolId]); // HANYA schoolId sebagai dependency

  useEffect(() => {
    if (schoolId) fetchConfig();
  }, [schoolId, fetchConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return showAlert("ID sekolah tidak ditemukan");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        schoolId,
        year: String(formData.year),
        requirements: formData.requirements.filter((r: string) => r.trim() !== ""),
        admissionPaths: formData.admissionPaths.filter((p: PathItem) => p.name.trim() !== ""),
        quota: formData.quota ? Number(formData.quota) : null,
      };

      const method = config?.id ? "PUT" : "POST";
      const url = config?.id ? `${BASE_URL}/${config.id}` : BASE_URL;

      const resData = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resData.success) {
        showAlert("Berhasil menyimpan konfigurasi PPDB");
        setIsModalOpen(false);
        fetchConfig();
      }
    } catch (err: any) {
      showAlert(err.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (config) {
      setFormData({
        year: config.year,
        description: config.description || "",
        startDate: config.startDate ? config.startDate.split("T")[0] : "",
        endDate: config.endDate ? config.endDate.split("T")[0] : "",
        requirements: Array.isArray(config.requirements) ? config.requirements : [],
        admissionPaths: Array.isArray(config.admissionPaths) ? config.admissionPaths : [],
        quota: config.quota ?? "",
        contactEmail: config.contactEmail || "",
        contactPhone: config.contactPhone || "",
      });
    } else {
      setFormData({ ...DEFAULT_FORM, year: new Date().getFullYear() });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen mt-4 pb-6">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-zinc-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="text-blue-500" /> Pengaturan PPDB
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Kelola periode pendaftaran, kuota, dan jalur masuk siswa baru.</p>
          </div>
          <button
            onClick={openModal}
            className="flex text-sm items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            {config ? <Edit size={18} /> : <Plus size={18} />}
            {config ? "Sesuaikan Pengaturan" : "Setup PPDB Baru"}
          </button>
        </div>

        {loading && !config ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-500" size={40} /></div>
        ) : !config ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-zinc-800">
            <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-zinc-500" />
            </div>
            <h3 className="text-zinc-300 font-bold text-lg">Konfigurasi Belum Tersedia</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">Anda belum mengatur informasi PPDB untuk tahun ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Info Utama */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-white">PPDB {config.year}</h2>
                  <div className="px-4 py-1 bg-blue-500/10 text-blue-400 text-xs font-black rounded-full border border-blue-500/20 tracking-tighter uppercase">
                    Status: Aktif
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Periode</h4>
                    <p className="text-zinc-200 font-bold">{config.startDate ? new Date(config.startDate).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'} s/d {config.endDate ? new Date(config.endDate).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'}</p>
                  </div>
                  <div>
                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Total Kuota</h4>
                    <p className="text-blue-400 font-black text-2xl">{config.quota || "Unlimited"}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-3">Deskripsi Umum</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{config.description}</p>
                </div>
              </div>

              {/* Jalur Pendaftaran Display */}
              <div className="bg-white/5 border border-zinc-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6">Jalur Pendaftaran Terdaftar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.admissionPaths?.map((p: any, i: number) => (
                    <div key={i} className="bg-black/20 p-5 rounded-2xl border border-zinc-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-black text-blue-400">{p.name}</span>
                        <span className="text-[10px] bg-zinc-700 px-2 py-0.5 rounded text-zinc-300">{p.quota}</span>
                      </div>
                      <p className="text-zinc-500 text-xs leading-relaxed">{p.description}</p>
                    </div>
                  ))}
                  {!config.admissionPaths?.length && <p className="text-zinc-600 text-sm italic">Tidak ada jalur khusus.</p>}
                </div>
              </div>
            </div>

            {/* Right: Requirements & Contact */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-zinc-800 p-6 rounded-3xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Persyaratan</h4>
                <ul className="space-y-3">
                  {config.requirements?.map((req: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-400 border-b border-zinc-800 pb-2">
                      <span className="text-blue-600 font-bold">{i+1}.</span> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 border border-zinc-800 p-6 rounded-3xl">
                <h4 className="text-white font-bold mb-4">Kontak Resmi</h4>
                <div className="space-y-4">
                  <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Email</p>
                    <p className="text-sm font-medium text-zinc-200 truncate">{config.contactEmail || "—"}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Telepon/WA</p>
                    <p className="text-sm font-medium text-zinc-200">{config.contactPhone || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Form */}
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-[999999]" onClose={() => setIsModalOpen(false)}>
            <div className="fixed top-0 right-0 inset-0 bg-black/90 backdrop-blur-sm" />
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="absolute top-0 right-0 w-full max-w-lg transform overflow-hidden bg-black/70 border border-zinc-700 p-6 shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <Dialog.Title className="text-2xl font-black text-white">Konfigurasi Sistem PPDB</Dialog.Title>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X className="text-zinc-500" /></button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Tahun Ajaran</label>
                        <input name="year" type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Total Kuota (Angka)</label>
                        <input name="quota" type="number" value={formData.quota} onChange={(e) => setFormData({...formData, quota: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Misal: 250" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Deskripsi & Pengumuman</label>
                      <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Tuliskan info pendaftaran..." />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Buka Pendaftaran</label>
                        <input name="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none color-scheme-dark" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Tutup Pendaftaran</label>
                        <input name="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none color-scheme-dark" />
                      </div>
                    </div>

                    <hr className="border-zinc-800" />

                    <AdmissionPathEditor 
                      paths={formData.admissionPaths} 
                      onChange={(paths) => setFormData({...formData, admissionPaths: paths})} 
                    />

                    <hr className="border-zinc-800" />

                    <ListEditor
                      items={formData.requirements}
                      onChange={(reqs) => setFormData({ ...formData, requirements: reqs })}
                      label="Berkas & Persyaratan"
                      placeholder="Contoh: Fotokopi Ijazah"
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Kontak</label>
                        <input name="contactEmail" type="email" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="cs@sekolah.id" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">No. WhatsApp</label>
                        <input name="contactPhone" type="text" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="0812xxxxxxxx" />
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-3 py-3 text-sm rounded-lg border border-zinc-700 text-zinc-400 font-bold hover:bg-zinc-800 transition-colors"
                      >
                        Batalkan
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-3 py-3 text-sm rounded-lg bg-blue-600 text-white font-black hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-50"
                      >
                        {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Simpan Data PPDB
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}

export default PPDBManager;