// import { Edit, Trash2, X, Plus, Save } from "lucide-react";
// import { useEffect, useState, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useSchool } from "@/features/schools";

// // Theme (sama seperti dashboard sebelumnya)
// const THEME = {
//   bg: "#0B1220",
//   surface: "#111827",
//   primary: "#065F46",
//   accent: "#10B981",
//   text: "#F9FAFB",
//   textSecondary: "#E5E7EB",
//   border: "#374151",
//   danger: "#EF4444",
// };

// const BASE_URL = "https://be-school.kiraproject.id";

// // Alert Component
// interface AlertState {
//   message: string;
//   type: "success" | "error";
//   visible: boolean;
// }

// const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
//   if (!alert.visible) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={`mb-6 p-4 rounded-xl border ${
//         alert.type === "success"
//           ? "bg-blue-900/30 border-blue-500/40 text-blue-300"
//           : "bg-red-900/30 border-red-500/40 text-red-300"
//       }`}
//     >
//       <div className="flex justify-between items-start">
//         <span>{alert.message}</span>
//         <button onClick={onClose} className="text-lg ml-3">×</button>
//       </div>
//     </motion.div>
//   );
// };

// // Item Editor untuk sub-items
// const ItemEditor = ({
//   items,
//   onChange,
// }: {
//   items: { title: string; description: string }[];
//   onChange: (newItems: any[]) => void;
// }) => {
//   const addItem = () => {
//     onChange([...items, { title: "", description: "" }]);
//   };

//   const updateItem = (index: number, field: "title" | "description", value: string) => {
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [field]: value };
//     onChange(newItems);
//   };

//   const removeItem = (index: number) => {
//     onChange(items.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-4 mt-4">
//       <div className="flex justify-between items-center">
//         <label className="text-sm font-medium text-white/80">Daftar Item / Sub Program</label>
//         <button
//           type="button"
//           onClick={addItem}
//           className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
//         >
//           <Plus size={14} /> Tambah Item
//         </button>
//       </div>

//       {items.length === 0 ? (
//         <p className="text-sm text-gray-400 italic">Belum ada item. Tambahkan jika perlu.</p>
//       ) : (
//         items.map((item, idx) => (
//           <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
//             <div className="flex justify-between items-center gap-3">
//               <Input
//                 value={item.title}
//                 onChange={(e) => updateItem(idx, "title", e.target.value)}
//                 placeholder="Judul item (wajib)"
//                 className="flex-1"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => removeItem(idx)}
//                 className="p-2 w-10 h-full text-red-400 bg-red-500/50 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
//               >
//                 ×
//               </button>
//             </div>
//             <TextArea
//               value={item.description}
//               onChange={(e) => updateItem(idx, "description", e.target.value)}
//               placeholder="Deskripsi item..."
//               rows={2}
//             />
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// // Simple Input & TextArea
// const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     {...props}
//     className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//   />
// );

// const TextArea = (props: any) => (
//   <textarea
//     {...props}
//     className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none resize-y min-h-[100px]"
//   />
// );

// // Modal Form Create / Update
// const ProgramModal = ({
//   open,
//   onClose,
//   title,
//   initialData = {},
//   onSubmit,
// }: {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   initialData?: any;
//   onSubmit: (data: any) => Promise<void>;
// }) => {
//   // Gunakan key berdasarkan apakah ini edit atau create + id (jika edit)
//   const modalKey = initialData?.id 
//     ? `edit-${initialData.id}` 
//     : 'create-new';

//   const [form, setForm] = useState(() => ({
//     mainTitle: initialData?.mainTitle || "",
//     mainDescription: initialData?.mainDescription || "",
//     items: Array.isArray(initialData?.items) ? [...initialData.items] : [],
//   }));

//   // Reset hanya jika key berubah (artinya modal benar-benar berganti mode/data)
//   useEffect(() => {
//     setForm({
//       mainTitle: initialData?.mainTitle || "",
//       mainDescription: initialData?.mainDescription || "",
//       items: Array.isArray(initialData?.items) ? [...initialData.items] : [],
//     });
//   }, [modalKey])

//   const [saving, setSaving] = useState(false);


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.mainTitle.trim()) {
//       alert("Judul utama wajib diisi");
//       return;
//     }

//     setSaving(true);
//     try {
//       await onSubmit(form);
//       onClose();
//     } catch (err: any) {
//       alert("Gagal menyimpan: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 top-0 right-0 h-screen bg-black/80 flex items-center justify-center z-[99999999] p-4">
//       <motion.div
//         initial={{ scale: 0.92, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.92, opacity: 0 }}
//         className="fixed top-0 right-0 bg-black/70 h-screen w-full max-w-2xl border border-white/10 overflow-y-auto"
//       >
//         <div className="relative p-6 border-b border-white/10 flex justify-between items-center z-[99999] pt-8">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X size={22} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-white/80 mb-2">
//               Judul Program Utama *
//             </label>
//             <Input
//               value={form.mainTitle}
//               onChange={(e) => setForm({ ...form, mainTitle: e.target.value })}
//               placeholder="Contoh: Program Pengembangan Karakter"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-white/80 mb-2">
//               Deskripsi Utama
//             </label>
//             <TextArea
//               value={form.mainDescription}
//               onChange={(e) => setForm({ ...form, mainDescription: e.target.value })}
//               placeholder="Penjelasan singkat tentang program ini..."
//             />
//           </div>

//           <ItemEditor
//             items={form.items}
//             onChange={(newItems) => setForm({ ...form, items: newItems })}
//           />

//           <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
//               disabled={saving}
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-6 py-2.5 text-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-60"
//             >
//               <Save size={18} />
//               {saving ? "Menyimpan..." : "Simpan Program"}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// // Main Component
// export default function ProgramMain() {
//   const [programs, setPrograms] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState<AlertState>({
//     message: "",
//     type: "success",
//     visible: false,
//   });

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedProgram, setSelectedProgram] = useState<any>(null);

//   const dataSchool: any = useSchool(); // Ganti sesuai kebutuhan, bisa dari context/hook nanti
//   const SCHOOL_ID = dataSchool?.data?.[0].id

//   const showAlert = (msg: string, type: "success" | "error" = "success") => {
//     setAlert({ message: msg, type, visible: true });
//     setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 5000);
//   };

//   const fetchPrograms = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/program?schoolId=${SCHOOL_ID}`);
//       if (!res.ok) throw new Error("Gagal memuat data program");

//       const json = await res.json();
//       if (json.success) {
//         setPrograms(json.data || []);
//       } else {
//         throw new Error(json.message || "Response tidak valid");
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat program: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPrograms();
//   }, [fetchPrograms]);

//   const handleCreate = async (form: any) => {
//     const res = await fetch(`${BASE_URL}/program`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, schoolId: SCHOOL_ID }),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Gagal menambah program");
//     }

//     showAlert("Program berhasil ditambahkan!");
//     fetchPrograms();
//   };

//   const handleUpdate = async (form: any) => {
//     if (!selectedProgram?.id) return;

//     const res = await fetch(`${BASE_URL}/program/${selectedProgram.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Gagal memperbarui program");
//     }

//     showAlert("Program berhasil diperbarui!");
//     fetchPrograms();
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus program ini? (soft delete)")) return;

//     const res = await fetch(`${BASE_URL}/program/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Gagal menghapus");
//     }

//     showAlert("Program berhasil dihapus (soft delete)");
//     fetchPrograms();
//   };

//   const columns = [
//     { key: "mainTitle", label: "Judul" },
//     { key: "mainDescription", label: "Deskripsi" },
//     { key: "itemsLength", label: "Jumlah  " },
//   ];

  
//     const Icon = ({ label }: { label: string }) => (
//     <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//         {label}
//     </span>
//     );
//     const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
//       <header className="flex justify-between items-center my-4 mb-6">
//         <button
//           onClick={() => {
//             setSelectedProgram(null);
//             setAddModalOpen(true);
//           }}
//           className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm flex items-center gap-2"
//         >
//           <ISave /> Tambah Program
//         </button>
//       </header>

//       <AnimatePresence>
//         {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
//       </AnimatePresence>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : programs.length === 0 ? (
//         <div className="text-center py-20 text-gray-400">
//           Belum ada program yang terdaftar
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white/5 uppercase border border-white/30 rounded-xl mt-4">
//           <table className="min-w-full">
//             <thead className="border-b border-white ">
//               <tr>
//                 {columns.map((col) => (
//                   <th key={col.key} className="px-6 w-max py-4 text-left text-sm font-medium text-white/70">
//                     {col.label}
//                   </th>
//                 ))}
//                 <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {programs.map((prog) => (
//                 <tr key={prog.id} className="border-t border-white/5 hover:bg-white/5">
//                   <td className="px-6 py-4 font-medium">{prog.mainTitle}</td>
//                   <td className="px-6 py-4 text-white/80">
//                     {prog.mainDescription || <span className="opacity-50">—</span>}
//                   </td>
//                   <td className="px-6 py-4 text-center">{prog.items?.length || 0}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedProgram(prog);
//                           setEditModalOpen(true);
//                         }}
//                         className="p-2 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg text-blue-300"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(prog.id)}
//                         className="p-2 bg-red-900/30 hover:bg-red-800/50 rounded-lg text-red-300"
//                         title="Hapus"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal Tambah */}
//       <ProgramModal
//         open={addModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         title="Tambah Program Baru"
//         onSubmit={handleCreate}
//       />

//       {/* Modal Edit */}
//       <ProgramModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         title="Edit Program"
//         initialData={selectedProgram}
//         onSubmit={handleUpdate}
//       />
//     </div>
//   );
// }


import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Edit, 
  Trash2, 
  X, 
  Plus, 
  Save, 
  Layout, 
  ListTree, 
  Info,
  Sparkles,
  ChevronRight
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { FaSpinner } from "react-icons/fa";

// --- Configuration & Helpers ---
const BASE_URL = "https://be-school.kiraproject.id";

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// --- Components ---
const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md",
      type === "success" ? "bg-blue-600 border-blue-400/50 text-white" : "bg-red-600 border-red-400/50 text-white"
    )}
  >
    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">
      <Info size={18} />
      {message}
    </div>
    <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
  </motion.div>
);

const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm placeholder:text-white/20"
  />
);

const TextArea = (props: any) => (
  <textarea
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm min-h-[100px] resize-none placeholder:text-white/20"
  />
);

// --- Main Component ---
export default function ProgramMain() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({
    message: "", isVisible: false, type: "success"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  
  // State Form Internal (Local to Modal logic)
  const [formItems, setFormItems] = useState<any[]>([]);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  const fetchPrograms = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/program?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setPrograms(json.data || []);
    } catch (err: any) {
      showAlert("Gagal memuat program", "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  // Handle Modal Open for Create/Edit
  const openModal = (program: any = null) => {
    setSelectedProgram(program);
    setFormItems(program?.items ? [...program.items] : []);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormItems([...formItems, { title: "", description: "" }]);
  };

  const handleUpdateItem = (idx: number, field: string, value: string) => {
    const updated = [...formItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormItems(updated);
  };

  const handleRemoveItem = (idx: number) => {
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      mainTitle: formData.get("mainTitle"),
      mainDescription: formData.get("mainDescription"),
      items: formItems,
      schoolId: schoolId,
    };

    try {
      const url = selectedProgram ? `${BASE_URL}/program/${selectedProgram.id}` : `${BASE_URL}/program`;
      const res = await fetch(url, {
        method: selectedProgram ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      showAlert(selectedProgram ? "Program diperbarui" : "Program berhasil ditambah");
      setIsModalOpen(false);
      fetchPrograms();
    } catch (err) {
      showAlert("Gagal menyimpan data", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus program unggulan ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/program/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showAlert("Program dihapus");
      fetchPrograms();
    } catch (err) {
      showAlert("Gagal menghapus", "error");
    }
  };

  return (
    <div className="min-h-screen text-white space-y-0 pb-20">
      {/* 1. ALERT */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] w-full flex justify-center px-4">
        <AnimatePresence>
          {alert.isVisible && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(prev => ({...prev, isVisible: false}))} />}
        </AnimatePresence>
      </div>

      {/* 2. HEADER */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Sparkles size={14} /> Excellence Programs
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Program <span className="text-blue-700">Unggulan</span>
          </h1>
          <p className="text-white/40 text-sm font-medium italic max-w-lg mt-2">Daftar inisiatif dan program strategis pengembangan potensi siswa.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah Program
        </button>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="pt-10">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/20 italic tracking-widest uppercase text-[10px]">
            <FaSpinner className="animate-spin mb-4" size={30} /> Loading Programs...
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
             <Layout className="mx-auto text-white/10 mb-4" size={48} />
             <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Belum ada program terdaftar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((prog) => (
              <div key={prog.id} className="group bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 flex gap-2">
                    <button onClick={() => openModal(prog)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(prog.id)} className="p-3 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                </div>

                <div className="space-y-6">
                  <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <Layout size={24} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-2">{prog.mainTitle}</h3>
                    <p className="text-sm text-white/40 italic leading-relaxed">{prog.mainDescription}</p>
                  </div>

                  {prog.items?.length > 0 && (
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Sub Program ({prog.items.length})</div>
                      <div className="grid gap-3">
                        {prog.items.map((sub: any, i: number) => (
                          <div key={i} className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <ChevronRight size={14} className="mt-1 text-blue-500" />
                            <div>
                                <div className="text-[11px] font-black uppercase tracking-wider">{sub.title}</div>
                                <div className="text-[10px] text-white/40 italic">{sub.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. SLIDE-OVER MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 w-full max-w-2xl">
            <Transition.Child as={Fragment} enter="transform transition duration-500 cubic-bezier(0,0,0.2,1)" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 cubic-bezier(0,0,0.2,1)" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-[#0B1220] border-l border-white/10 p-10 flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block italic">Program Registry</span>
                    <Dialog.Title className="text-4xl font-black uppercase tracking-tighter text-white">
                      {selectedProgram ? "Edit" : "Program Baru"} 
                    </Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6 p-8 bg-white/5 rounded-[2rem] border border-white/5">
                    <Field label="Judul Program Utama">
                      <Input name="mainTitle" defaultValue={selectedProgram?.mainTitle} required placeholder="Contoh: Digital Literacy Program" />
                    </Field>
                    <Field label="Deskripsi Utama">
                      <TextArea name="mainDescription" defaultValue={selectedProgram?.mainDescription} placeholder="Jelaskan gambaran umum program ini..." />
                    </Field>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Daftar Sub Program / Item</div>
                        <button type="button" onClick={handleAddItem} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">
                            <Plus size={14} /> Add Sub-Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                        {formItems.map((item, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={idx} 
                                className="relative p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4"
                            >
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveItem(idx)}
                                    className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <Input 
                                    placeholder="Judul Sub Program" 
                                    value={item.title} 
                                    onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                                    className="!bg-black/20"
                                    required
                                />
                                <TextArea 
                                    placeholder="Deskripsi singkat sub program..." 
                                    value={item.description}
                                    onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                                    className="!bg-black/20 !min-h-[80px]"
                                />
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        {formItems.length === 0 && (
                            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl text-white/10 text-[10px] font-black uppercase tracking-widest italic">
                                No sub-items added yet
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4 border-t border-white/10">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-5 bg-blue-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-colors">
                      <Save size={16} /> Save Program
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}