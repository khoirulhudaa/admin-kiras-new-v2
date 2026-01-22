// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Toaster, toast } from "sonner";

// // Types
// interface GuruTendikItem {
//   id?: number;
//   name: string;
//   unit: string;
//   role: string;
//   subjects: string;
//   status: string;
//   years: number;
//   email: string;
//   phone: string;
//   photo: string;
//   photoUrl: string;
// }

// interface GuruTendik {
//   items: GuruTendikItem[];
// }

// // Utility: clsx
// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// // Base URL for images
// const BASE_URL = "https://dev.kiraproject.id";

// // Icon Component
// function Icon({ label }: { label: string }) {
//   return (
//     <span
//       aria-hidden
//       className="inline-block align-middle select-none"
//       style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
//     >
//       {label}
//     </span>
//   );
// }

// function IPlus() { return <Icon label="＋" />; }
// function ISave() { return <Icon label="💾" />; }
// function ITrash() { return <Icon label="🗑️" />; }
// function IClose() { return <Icon label="✖" />; }

// // Form Components
// function Field({
//   label,
//   hint,
//   children,
//   className,
// }: {
//   label?: string;
//   hint?: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <label className={clsx("block w-full", className)}>
//       {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
//       {children}
//       {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//     </label>
//   );
// }

// function Input({
//   className,
//   ...props
// }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
//   return (
//     <input
//       {...props}
//       className={clsx(
//         "w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//         className
//       )}
//     />
//   );
// }

// function ImageUpload({
//   value,
//   onChange,
//   label,
// }: {
//   value: string;
//   onChange: (dataUrl: string) => void;
//   label?: string;
// }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) {
//       onChange("");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("photo", file);

//     try {
//       const response = await fetch(`${BASE_URL}/api/guru-tendik/upload/photo`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         onChange(data.url);
//         toast.success("Photo uploaded successfully");
//       } else {
//         toast.error(data.error || "Failed to upload photo");
//         onChange("");
//       }
//     } catch (error) {
//       toast.error("Error uploading photo");
//       onChange("");
//     }
//   }

//   return (
//     <>
//       <div className="flex items-center w-full gap-4">
//         {value && (
//           <img
//             src={`${BASE_URL}${value}`}
//             alt="preview"
//             className="h-12 relative top-1 w-12 rounded-md object-cover cursor-pointer"
//             onClick={() => setIsModalOpen(true)}
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder-image.jpg"; // Fallback image
//             }}
//           />
//         )}
//         <Field label={label}>
//           <div className="flex w-full flex-1 items-center gap-2">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleChange}
//               className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//             />
//           </div>
//         </Field>
//       </div>
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
//             onClick={() => setIsModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               className="relative max-w-[90vw] max-h-[90vh]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={`${BASE_URL}${value}`}
//                 alt="zoomed preview"
//                 className="max-w-full max-h-[90vh] rounded-lg object-contain"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder-image.jpg"; // Fallback image
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="absolute top-2 right-2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
//               >
//                 <IClose />
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// // Dropdown Options
// const UNIT_OPTIONS = ["RPL", "TKJ", "Akuntansi", "Pemasaran", "Umum"];
// const ROLE_OPTIONS = ["Guru", "Tendik", "Wali Kelas", "Kepala Sekolah"];
// const STATUS_OPTIONS = ["PNS", "Honorer", "Kontrak"];

// // Normalize Function
// function normalize(state: any): GuruTendik {
//   const out = { ...state };
//   out.items = Array.isArray(out.items)
//     ? out.items.map((item: any) => ({
//         id: item.id ? Number(item.id) : undefined,
//         name: String(item.name || "").trim(),
//         unit: UNIT_OPTIONS.includes(item.unit) ? item.unit : UNIT_OPTIONS[0] || "",
//         role: ROLE_OPTIONS.includes(item.role) ? item.role : ROLE_OPTIONS[0] || "",
//         subjects: String(item.subjects || "").trim(),
//         status: STATUS_OPTIONS.includes(item.status)
//           ? item.status
//           : STATUS_OPTIONS[0] || "",
//         years: Number(item.years || 0),
//         email: String(item.email || "").trim(),
//         phone: String(item.phone || "").trim(),
//         photo: String(item.photo || ""),
//         photoUrl: String(item.photoUrl || item.photo || ""),
//       }))
//     : [];
//   if (out.items.length === 0) {
//     out.items = [
//       {
//         name: "",
//         unit: UNIT_OPTIONS[0] || "",
//         role: ROLE_OPTIONS[0] || "",
//         subjects: "",
//         status: STATUS_OPTIONS[0] || "",
//         years: 0,
//         email: "",
//         phone: "",
//         photo: "",
//         photoUrl: "",
//       },
//     ];
//   }
//   return out;
// }

// export function FormGuruTendik() {
//   const [v, setV] = useState<GuruTendik>({ items: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [itemLoading, setItemLoading] = useState<number[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch initial data
//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       try {
//         const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setV(normalize({ items: data.items || [] }));
//         } else {
//           setError(data.error || "Failed to fetch data");
//           toast.error(data.error || "Failed to fetch data");
//         }
//       } catch (err) {
//         setError("Error fetching data");
//         toast.error("Error fetching data");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // Save to localStorage as backup
//   useEffect(() => {
//     try {
//       localStorage.setItem("admin:web:gurutendik", JSON.stringify(v));
//     } catch {
//       console.error("Failed to save guru-tendik to localStorage");
//     }
//   }, [v]);

//   function setItem(i: number, patch: Partial<GuruTendikItem>) {
//     setV((p) => {
//       const a = [...(p.items || [])];
//       a[i] = { ...a[i], ...patch, photoUrl: patch.photo || a[i].photoUrl };
//       return normalize({ ...p, items: a });
//     });
//   }

//   function addItem() {
//     setV((p) => {
//       const newItem = {
//         name: "",
//         unit: UNIT_OPTIONS[0] || "",
//         role: ROLE_OPTIONS[0] || "",
//         subjects: "",
//         status: STATUS_OPTIONS[0] || "",
//         years: 0,
//         email: "",
//         phone: "",
//         photo: "",
//         photoUrl: "",
//       };
//       const updated = {
//         ...p,
//         items: [newItem, ...(p.items || [])],
//       };
//       return normalize(updated);
//     });
//   }

//   async function delItem(i: number) {
//     const item = v.items[i];
//     if (!item.id) {
//       setV((p) => normalize({
//         ...p,
//         items: (p.items || []).filter((_: any, idx: number) => idx !== i),
//       }));
//       toast.success("Item removed locally");
//       return;
//     }

//     setItemLoading((prev) => [...prev, i]);
//     try {
//       const response = await fetch(`${BASE_URL}/api/guru-tendik/items/${item.id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setV((p) => normalize({
//           ...p,
//           items: (p.items || []).filter((_: any, idx: number) => idx !== i),
//         }));
//         toast.success(data.message || "Item deleted successfully");
//       } else {
//         toast.error(data.error || "Failed to delete item");
//       }
//     } catch (error) {
//       toast.error("Error deleting item");
//     } finally {
//       setItemLoading((prev) => prev.filter((idx) => idx !== i));
//     }
//   }

//   async function handleItemSave(i: number) {
//     const item = v.items[i];
//     if (!item.name) {
//       toast.error("Nama wajib diisi");
//       return;
//     }

//     setItemLoading((prev) => [...prev, i]);
//     try {
//       const method = item.id ? "PUT" : "POST";
//       const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ items: [{ ...item, photoUrl: undefined }] }), // Exclude photoUrl
//       });
//       const data = await response.json();
//       if (response.ok) {
//         const refreshResponse = await fetch(`${BASE_URL}/api/guru-tendik`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const refreshData = await refreshResponse.json();
//         if (refreshResponse.ok) {
//           setV(normalize({ items: refreshData.items || [] }));
//           toast.success(data.message || "Item saved successfully");
//         } else {
//           toast.error(refreshData.error || "Failed to refresh data");
//         }
//       } else {
//         toast.error(data.error || "Failed to save/update item");
//       }
//     } catch (error) {
//       toast.error("Error saving/updating item");
//     } finally {
//       setItemLoading((prev) => prev.filter((idx) => idx !== i));
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (v.items.some((item) => !item.name)) {
//       toast.error("Semua nama wajib diisi");
//       return;
//     }

//     setLoading(true);
//     try {
//       const method = v.items.some((item) => item.id) ? "PUT" : "POST";
//       const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           items: v.items.map((item) => ({ ...item, photoUrl: undefined })), // Exclude photoUrl
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         const refreshResponse = await fetch(`${BASE_URL}/api/guru-tendik`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const refreshData = await refreshResponse.json();
//         if (refreshResponse.ok) {
//           setV(normalize({ items: refreshData.items || [] }));
//           toast.success(data.message || "Data saved successfully");
//         } else {
//           setError(refreshData.error || "Failed to refresh data");
//           toast.error(refreshData.error || "Failed to refresh data");
//         }
//       } else {
//         toast.error(data.error || "Failed to save/update data");
//       }
//     } catch (error) {
//       toast.error("Error saving/updating data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Filter items based on search query
//   const filteredItems = v.items.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-white">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <>
//       <Toaster position="top-right" richColors />
//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="mb-3 flex items-center justify-between">
//             <div className="text-sm font-semibold">Guru & Tendik</div>
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-2">
//                 <label htmlFor="search" className="text-sm">Cari nama</label>
//                 <Input
//                   type="text"
//                   value={searchQuery}
//                   className="w-[400px]"
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Masukkan nama..."
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-md text-blue-300"
//               >
//                 <IPlus /> Tambah
//               </button>
//             </div>
//           </div>
//           <AnimatePresence>
//             {filteredItems.map((it, i) => (
//               <motion.div
//                 key={it.id || i}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="rounded-lg border border-white/20 p-3 mb-3"
//               >
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Field label="Nama (Wajib)">
//                     <Input
//                       value={it.name}
//                       onChange={(e) => setItem(i, { name: e.target.value })}
//                       required
//                     />
//                   </Field>
//                   <Field label="Unit">
//                     <select
//                       value={it.unit}
//                       onChange={(e) => setItem(i, { unit: e.target.value })}
//                       className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//                     >
//                       {UNIT_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt} className="text-black">
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                   <Field label="Peran">
//                     <select
//                       value={it.role}
//                       onChange={(e) => setItem(i, { role: e.target.value })}
//                       className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//                     >
//                       {ROLE_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt} className="text-black">
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                   <Field label="Mapel (jika Guru)">
//                     <Input
//                       value={it.subjects}
//                       onChange={(e) => setItem(i, { subjects: e.target.value })}
//                       disabled={it.role !== "Guru" && it.role !== "Wali Kelas"}
//                     />
//                   </Field>
//                   <Field label="Status">
//                     <select
//                       value={it.status}
//                       onChange={(e) => setItem(i, { status: e.target.value })}
//                       className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//                     >
//                       {STATUS_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt} className="text-black">
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                   <Field label="Masa Kerja (tahun)">
//                     <Input
//                       type="number"
//                       value={it.years || 0}
//                       onChange={(e) => setItem(i, { years: Number(e.target.value || 0) })}
//                       min={0}
//                     />
//                   </Field>
//                   <Field label="Email">
//                     <Input
//                       type="email"
//                       value={it.email}
//                       onChange={(e) => setItem(i, { email: e.target.value })}
//                     />
//                   </Field>
//                   <Field label="Telepon">
//                     <Input
//                       type="tel"
//                       value={it.phone}
//                       onChange={(e) => setItem(i, { phone: e.target.value })}
//                     />
//                   </Field>
//                   <div className="md:col-span-2">
//                     <ImageUpload
//                       value={it.photoUrl}
//                       onChange={(d) => setItem(i, { photo: d, photoUrl: d })}
//                       label="Foto (maks 2MB, opsional)"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => handleItemSave(i)}
//                     disabled={itemLoading.includes(i) || loading}
//                     className={clsx(
//                       "inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300",
//                       (itemLoading.includes(i) || loading) && "opacity-50 cursor-not-allowed"
//                     )}
//                   >
//                     <ISave /> Simpan
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => delItem(i)}
//                     disabled={itemLoading.includes(i) || loading}
//                     className={clsx(
//                       "inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300",
//                       (itemLoading.includes(i) || loading) && "opacity-50 cursor-not-allowed"
//                     )}
//                   >
//                     <ITrash /> Hapus
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading || itemLoading.length > 0}
//             className={clsx(
//               "inline-flex items-center gap-2 rounded-lg bg-blue-500/90 px-4 py-2 text-sm font-semibold",
//               (loading || itemLoading.length > 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
//             )}
//           >
//             <ISave /> Simpan Semua
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }



import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Save, Trash2, User, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

// Types
interface GuruTendikItem {
  id?: number;
  nama: string;
  mapel?: string;
  email?: string;
  role: string;
  jurusan?: string;
  jenisKelamin: string;
  photoUrl?: string;
}

// Base URL
const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

// Dropdown Options
const ROLE_OPTIONS = ["Guru", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"];
const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// Modal Sidebar Right
const GuruTendikModal = ({
  open,
  onClose,
  initialData,
  onSave,
  isNew,
}: {
}) => {
  const [form, setForm] = useState<GuruTendikItem>({
    nama: "",
    role: ROLE_OPTIONS[0],
    jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
    mapel: "",
    jurusan: "",
    email: "",
    photoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // ← Tambahkan ini
  useEffect(() => {
    if (open) {
      setForm({
        nama: initialData.nama || "",
        role: initialData.role || ROLE_OPTIONS[0],
        jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
        mapel: initialData.mapel || "",
        jurusan: initialData.jurusan || "",
        email: initialData.email || "",
        photoUrl: initialData.photoUrl || "",
      });
      setPreview(initialData.photoUrl || "");
      setSelectedFile(null); // reset file upload saat buka modal
    }
  }, [open, initialData]); // dependensi penting

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nama.trim() || !form.role || !form.jenisKelamin) {
      toast.error("Nama, Role, dan Jenis Kelamin wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await onSave(form, selectedFile || undefined);
      onClose();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999999999] bg-black/70"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-black/70 border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="relative top-0 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {isNew ? "Tambah Guru/Tendik" : "Edit Guru/Tendik"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Foto */}
              <div className="flex items-center mb-10 gap-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-blue-500/30 bg-gray-800">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500">
                      <User size={64} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer rounded-lg bg-blue-600/30 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/50">
                  Upload Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Role/Jabatan <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                  required
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-gray-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Jenis Kelamin <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.jenisKelamin}
                  onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                  required
                >
                  {JENIS_KELAMIN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-gray-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mata Pelajaran */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Mata Pelajaran (jika guru)
                </label>
                <input
                  type="text"
                  value={form.mapel || ""}
                  onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
                />
              </div>

              {/* Jurusan */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Jurusan/Program Keahlian
                </label>
                <input
                  type="text"
                  value={form.jurusan || ""}
                  onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
                />
              </div>

              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Component
export function FormGuruTendik() {
  const [data, setData] = useState<GuruTendikItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
  const [search, setSearch] = useState("");

  const school = useSchool();
  const SCHOOL_ID = school?.data?.[0]?.id;

  const fetchData = useCallback(async () => {
    if (!SCHOOL_ID) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
      } else {
        toast.error(json.message || "Gagal memuat data");
      }
    } catch (err) {
      toast.error("Gagal memuat data guru/tendik");
    } finally {
      setLoading(false);
    }
  }, [SCHOOL_ID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
    const formData = new FormData();
    formData.append("nama", form.nama || "");
    formData.append("role", form.role || "");
    formData.append("jenisKelamin", form.jenisKelamin || "");
    if (form.mapel) formData.append("mapel", form.mapel);
    if (form.jurusan) formData.append("jurusan", form.jurusan);
    if (form.email) formData.append("email", form.email);
    if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());

    if (file) {
      formData.append("photo", file);
    }

    const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
    const method = selectedItem?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Gagal menyimpan");
    }

    toast.success(selectedItem ? "Berhasil diperbarui" : "Berhasil ditambahkan");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Berhasil dihapus");
        fetchData();
      } else {
        toast.error(json.message || "Gagal menghapus");
      }
    } catch (err) {
      toast.error("Error menghapus data");
    }
  };

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
        {label}
    </span>
    );
    const ISave = () => <Icon label="💾" />;

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="w-full flex items-center gap-3 mt-4">
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
          >
            <ISave /> 
            <p className="w-max text-[13px] font-semibold">
              Tambah Data
            </p>
          </button>
          <input
            type="text"
            placeholder="Cari nama guru / tenaga pendidik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 h-[37px] bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {search ? "Tidak ditemukan data yang sesuai" : "Belum ada data guru/tendik"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 bg-white/5 rounded-lg p-5">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 rounded-xl p-4 border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all group"
              >
              <h3 className="text-lg font-semibold text-white truncate">{item.nama}</h3>
              <p className="text-sm text-blue-400 mt-1 mb-4">{item.role} | {item.email ? item.email : '-'}</p>

              <div className="relative h-48 bg-black/30 flex items-center justify-center">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.nama}
                    className="h-full w-full rounded-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>

              <div className="mt-4 gap-4 grid grid-cols-2 text-sm text-gray-300">
                <div>
                  {item.mapel && (
                    <p className="rounded-md py-1.5 px-2 w-full flex justify-between text-xs text-white ">
                      {item.mapel}
                    </p>
                  )}
                  {item.jurusan && (
                    <p className="rounded-md py-1.5 px-2 w-full flex justify-between text-xs text-white ">
                      {item.jurusan}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2 justify-between w-full grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setModalOpen(true);
                  }}
                  className="p-2 py-3 rounded-lg flex items-center justify-center bg-blue-900/30 hover:bg-blue-800/50 text-blue-300"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="p-2 py-3 rounded-lg flex items-center justify-center bg-red-900/70 hover:bg-red-800/50 text-red-300"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Sidebar */}
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
    </div>
  );
}