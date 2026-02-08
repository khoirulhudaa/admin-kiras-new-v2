// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Pen, Plus, Trash } from "lucide-react";
// import { Fragment, useEffect, useState } from "react";

// // === THEME TOKENS ===
// const THEME_TOKENS = {
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
// if (typeof document !== 'undefined') {
//   document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
//     .map(([k, v]) => `${k}: ${v};`)
//     .join('');
// }

// // === UTILITIES ===
// const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// // === ALERT HOOK ===
// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });

//   const showAlert = (message: string) => {
//     setAlert({ message, isVisible: true });
//   };

//   const hideAlert = () => {
//     setAlert({ message: "", isVisible: false });
//   };

//   return { alert, showAlert, hideAlert };
// };

// // === ALERT COMPONENT ===
// const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-4 rounded-xl border p-4 text-sm",
//         isSuccess
//           ? "border-green-500/30 bg-blue-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             "ml-4 text-xl leading-none",
//             isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
//           )}
//         >
//           ×
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // === FORM COMPONENTS ===
// const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//   </label>
// );

// const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
//       className
//     )}
//   />
// );

// const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
//       className
//     )}
//   />
// );

// const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//   <select
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// // === DEFAULT VALUES ===
// const DEFAULT_ALBUM = { title: "", description: "", cover: null };
// const DEFAULT_ITEM = { title: "", description: "", albumId: "", image: null };

// const getJsonHeaders = () => ({
//   "Content-Type": "application/json",
//   // "Authorization": `Bearer ${localStorage.getItem("token")}` // jika pakai auth
// });

// const getFormDataHeaders = () => ({
//   // JANGAN set Content-Type untuk FormData
//   // "Authorization": `Bearer ${localStorage.getItem("token")}`,
// });

// export function GaleriMain() {
//   const [activeTab, setActiveTab] = useState<"album" | "item">("album");
//   const [albums, setAlbums] = useState<any[]>([]);
//   const [itemsByAlbum, setItemsByAlbum] = useState<Record<string, any[]>>({});
  
//   const [albumForm, setAlbumForm] = useState(DEFAULT_ALBUM);
//   const [itemForm, setItemForm] = useState(DEFAULT_ITEM);
  
//   const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
//   const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
//   const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
//   const [isItemModalOpen, setIsItemModalOpen] = useState(false);
//   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
//   const [selectedAlbumForItems, setSelectedAlbumForItems] = useState<string | null>(null);
//   const [selectedAlbumForGallery, setSelectedAlbumForGallery] = useState<string | null>(null);
  
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();
  
//   const schoolid = useSchool()
  
//   // === CONFIG ===
//   const SCHOOL_ID = schoolid?.data?.[0]?.id; // ← GANTI SESUAI SEKOLAH ANDA
//   const BASE_URL = "https://be-school.kiraproject.id";
  
//   // ── FETCH ────────────────────────────────────────────────────────────────

//   const fetchAlbums = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal mengambil album");
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Response tidak success");
//       setAlbums(json.data || []);
//     } catch (err: any) {
//       showAlert("Gagal memuat album: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemsForAlbum = async (albumId: string) => {
//     if (!albumId) return;
//     try {
//       const res = await fetch(`${BASE_URL}/gallery?albumId=${albumId}&isActive=true`, {
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal mengambil item");
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Response tidak success");
//       setItemsByAlbum((prev) => ({
//         ...prev,
//         [albumId]: json.data || [],
//       }));
//     } catch (err: any) {
//       showAlert(`Gagal memuat item: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchAlbums();
//   }, []);

//   useEffect(() => {
//     if (activeTab === "item" && selectedAlbumForItems) {
//       fetchItemsForAlbum(selectedAlbumForItems);
//     }
//   }, [selectedAlbumForItems, activeTab]);

//   // ── ALBUM CRUD ──────────────────────────────────────────────────────────

//   const handleAlbumSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("title", albumForm.title);
//     formData.append("description", albumForm.description || "");
//     formData.append("schoolId", SCHOOL_ID);
//     if (albumForm.cover) formData.append("cover", albumForm.cover);

//     try {
//       const isEdit = !!editingAlbumId;
//       const url = isEdit ? `${BASE_URL}/albums/${editingAlbumId}` : `${BASE_URL}/albums`;
//       const method = isEdit ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: getFormDataHeaders(),
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} album`);
//       }

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal");

//       showAlert(isEdit ? "Album berhasil diperbarui" : "Album berhasil ditambahkan");
//       setAlbumForm(DEFAULT_ALBUM);
//       setEditingAlbumId(null);
//       setIsAlbumModalOpen(false);
//       fetchAlbums();
//     } catch (err: any) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAlbum = async (id: string) => {
//     if (!confirm("Yakin ingin menghapus album ini?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/albums/${id}`, {
//         method: "DELETE",
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal menghapus album");
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal");
//       showAlert("Album berhasil dihapus");
//       fetchAlbums();
//       if (selectedAlbumForItems === id) setSelectedAlbumForItems(null);
//       if (selectedAlbumForGallery === id) setIsGalleryModalOpen(false);
//     } catch (err: any) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── ITEM CRUD ───────────────────────────────────────────────────────────

//   const handleItemSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!itemForm.albumId) {
//       showAlert("Pilih album terlebih dahulu!");
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", itemForm.title);
//     formData.append("description", itemForm.description || "");
//     if (!editingItemId) formData.append("albumId", itemForm.albumId);
//     if (itemForm.image) formData.append("image", itemForm.image);

//     try {
//       const isEdit = !!editingItemId;
//       const url = isEdit ? `${BASE_URL}/gallery/${editingItemId}` : `${BASE_URL}/gallery`;
//       const method = isEdit ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: getFormDataHeaders(),
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} item`);
//       }

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal");

//       showAlert(isEdit ? "Item berhasil diperbarui" : "Item berhasil ditambahkan");
//       setItemForm(DEFAULT_ITEM);
//       setEditingItemId(null);
//       setIsItemModalOpen(false);
//       if (selectedAlbumForItems) fetchItemsForAlbum(selectedAlbumForItems);
//       if (selectedAlbumForGallery) fetchItemsForAlbum(selectedAlbumForGallery);
//     } catch (err: any) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteItem = async (id: string) => {
//     if (!confirm("Yakin ingin menghapus item ini?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/gallery/${id}`, {
//         method: "DELETE",
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal menghapus item");
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal");
//       showAlert("Item berhasil dihapus");
//       if (selectedAlbumForItems) fetchItemsForAlbum(selectedAlbumForItems);
//       if (selectedAlbumForGallery) fetchItemsForAlbum(selectedAlbumForGallery);
//     } catch (err: any) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── MODAL HANDLERS ──────────────────────────────────────────────────────

//   const openAlbumModal = (album: any = null) => {
//     if (album) {
//       setAlbumForm({
//         title: album.title,
//         description: album.description || "",
//         cover: null,
//       });
//       setEditingAlbumId(album.id);
//     } else {
//       setAlbumForm(DEFAULT_ALBUM);
//       setEditingAlbumId(null);
//     }
//     setIsAlbumModalOpen(true);
//   };

//   const openItemModal = (item: any = null) => {
//     if (item) {
//       setItemForm({
//         title: item.title,
//         description: item.description || "",
//         albumId: item.albumId,
//         image: null,
//       });
//       setEditingItemId(item.id);
//     } else {
//       setItemForm({ ...DEFAULT_ITEM, albumId: selectedAlbumForItems || "" });
//       setEditingItemId(null);
//     }
//     setIsItemModalOpen(true);
//   };

//   const openGalleryModal = (albumId: string) => {
//     setSelectedAlbumForGallery(albumId);
//     setIsGalleryModalOpen(true);

//     // Pre-fetch jika belum ada data
//     if (!itemsByAlbum[albumId]) {
//       fetchItemsForAlbum(albumId);
//     }
//   };

//   const closeAlbumModal = () => {
//     setAlbumForm(DEFAULT_ALBUM);
//     setEditingAlbumId(null);
//     setIsAlbumModalOpen(false);
//   };

//   const closeItemModal = () => {
//     setItemForm(DEFAULT_ITEM);
//     setEditingItemId(null);
//     setIsItemModalOpen(false);
//   };

//   // ── RENDER ───────────────────────────────────────────────────────────────

//   const selectedAlbum = albums.find((a) => a.id === selectedAlbumForGallery);

//   return (
//     <div className="space-y-6 mb-10 bg-white/5 rounded-xl p-6 py-6 mt-4 border border-white/30">
//       <AnimatePresence>
//         {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       </AnimatePresence>

//       {/* Tabs */}
//       <div className="flex border rounded-lg overflow-hidden border-white/20">
//         {["album", "item"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab as "album" | "item")}
//             className={clsx(
//               "px-4 py-2 text-sm w-full justify-center flex items-center font-medium",
//               activeTab === tab
//                 ? "bg-blue-500 border-[rgba(16,185,129,0.30)] text-white"
//                 : "text-white/70 hover:text-white"
//             )}
//           >
//             {tab === "album" ? "Album" : "Gallery Item"}
//           </button>
//         ))}
//       </div>

//       {/* ALBUM TAB */}
//       {activeTab === "album" && (
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="flex justify-start items-center mb-3">
//             <button
//               onClick={() => openAlbumModal()}
//               className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
//               disabled={loading}
//             >
//               <Plus size={16} /> Tambah Album
//             </button>
//           </div>

//           {loading && <div className="text-sm text-white/70">Memuat...</div>}
//           {!loading && albums.length === 0 && <div className="text-sm text-white/70">Tidak ada album</div>}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//             {albums.map((album) => (
//               <div
//                 key={album.id}
//                 onClick={() => openGalleryModal(album.id)}
//                 className={clsx(
//                   "rounded-xl border border-white/20 p-4 bg-white/5",
//                   "cursor-pointer hover:bg-white/10 transition-all duration-200 relative group"
//                 )}
//               >
//                 {album.coverUrl ? (
//                   <img
//                     src={`${BASE_URL}${album.coverUrl}`}
//                     alt={album.title}
//                     className="w-full h-40 object-cover rounded-lg mb-3"
//                   />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-white/50 text-sm">
//                     No Cover
//                   </div>
//                 )}
//                 <h3 className="font-medium text-white">{album.title}</h3>
//                 <p className="text-xs text-white/70 mt-1 line-clamp-2">{album.description || "—"}</p>

//                 {/* Action buttons - stay on top */}
//                 <div className="relative border-t border-white/30 mt-5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-3 transition-opacity">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openAlbumModal(album);
//                     }}
//                     className="rounded-lg min-w-full justify-center max-w-max flex items-center gap-2 bg-blue-500/20 py-2 border border-blue-800 px-4 text-blue-300 hover:bg-blue-500/40"
//                     disabled={loading}
//                   >
//                     <Pen size={16} />
//                     <p className="text-xs">Perbarui</p>
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteAlbum(album.id);
//                     }}
//                     className="rounded-lg min-w-full justify-center max-w-max flex items-center gap-2 bg-red-500/20 py-2  border border-blue-800px-4 text-red-300 hover:bg-red-500/40"
//                     disabled={loading}
//                   >
//                     <Trash size={16} />
//                     <p className="text-xs">Hapus</p>
//                   </button>
//                 </div> 
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ITEM TAB (tetap seperti semula) */}
//       {activeTab === "item" && (
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//               <Select
//                 value={selectedAlbumForItems || ""}
//                 onChange={(e) => setSelectedAlbumForItems(e.target.value || null)}
//                 className="w-full sm:w-64"
//               >
//                 <option className="text-black" value="">Pilih Album</option>
//                 {albums.map((a) => (
//                   <option key={a.id} value={a.id} className="text-black">
//                     {a.title}
//                   </option>
//                 ))}
//               </Select>

//               <button
//                 onClick={() => {
//                   if (!selectedAlbumForItems) {
//                     showAlert("Pilih album terlebih dahulu!");
//                     return;
//                   }
//                   openItemModal();
//                 }}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600 whitespace-nowrap"
//                 disabled={loading || !selectedAlbumForItems}
//               >
//                 <Plus size={16} /> Tambah Item
//               </button>
//             </div>
//           </div>

//           {!selectedAlbumForItems && (
//             <div className="text-center py-8 text-white/60">
//               Pilih album terlebih dahulu untuk melihat/menambah item galeri
//             </div>
//           )}

//           {selectedAlbumForItems && (
//             <>
//               {loading && <div className="text-sm text-white/70">Memuat...</div>}

//               {(!itemsByAlbum[selectedAlbumForItems]?.length && !loading) && (
//                 <div className="text-sm text-white/70">Belum ada item di album ini</div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                 {itemsByAlbum[selectedAlbumForItems]?.map((item) => (
//                   <div key={item.id} className="rounded-xl border border-white/20 p-4 bg-white/5">
//                     {item.imageUrl ? (
//                       <img
//                         src={`${BASE_URL}${item.imageUrl}`}
//                         alt={item.title}
//                         className="w-full h-40 object-cover rounded-lg mb-3"
//                       />
//                     ) : (
//                       <div className="w-full h-40 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-white/50 text-sm">
//                         No Image
//                       </div>
//                     )}
//                     <h3 className="font-medium text-white">{item.title}</h3>
//                     <p className="text-xs text-white/70 mt-1">{item.description || "—"}</p>
//                     <div className="flex gap-2 mt-3 border-t border-white/30 pt-4">
//                       <button
//                         onClick={() => openItemModal(item)}
//                         className="flex-1 gap-2 py-2 flex items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 text-xs text-blue-300"
//                         disabled={loading}
//                       >
//                         <Pen size={16} /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteItem(item.id)}
//                         className="flex-1 gap-2 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
//                         disabled={loading}
//                       >
//                         <Trash size={16} /> Hapus
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* ALBUM MODAL */}
//       <Transition appear show={isAlbumModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-[999999999999]" onClose={closeAlbumModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-90" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full md:w-[40vw] fixed top-0 right-0 h-screen border border-white/20 bg-black/50 p-6 backdrop-blur-sm">
//                   <Dialog.Title className="text-lg font-semibold text-white mb-4">
//                     {editingAlbumId ? "Edit Album" : "Tambah Album"}
//                   </Dialog.Title>
//                   <form onSubmit={handleAlbumSubmit} className="h-full flex flex-col justify-between">
//                     <div className="space-y-4 h-max">
//                       <Field label="Judul">
//                         <Input
//                           value={albumForm.title}
//                           onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
//                           placeholder="Judul album"
//                           required
//                         />
//                       </Field>
//                       <Field label="Deskripsi">
//                         <TextArea
//                           value={albumForm.description}
//                           onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
//                           placeholder="Deskripsi album"
//                           rows={3}
//                         />
//                       </Field>
//                       <Field label={editingAlbumId ? "Ganti Cover (opsional)" : "Cover (opsional)"}>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => setAlbumForm({ ...albumForm, cover: e.target.files?.[0] || null })}
//                         />
//                         {albumForm.cover && (
//                           <p className="text-xs text-white/70 mt-1">{albumForm.cover.name}</p>
//                         )}
//                       </Field>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 relative top-[-36px]">
//                       <button
//                         type="button"
//                         onClick={closeAlbumModal}
//                         className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//                         disabled={loading}
//                       >
//                         Simpan
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* ITEM MODAL */}
//       <Transition appear show={isItemModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeItemModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-90" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
//                   <Dialog.Title className="text-lg font-semibold text-white mb-4">
//                     {editingItemId ? "Edit Item" : "Tambah Item"}
//                   </Dialog.Title>
//                   <form onSubmit={handleItemSubmit} className="space-y-4">
//                     {!editingItemId && (
//                       <Field label="Album">
//                         <Select
//                           value={itemForm.albumId}
//                           onChange={(e) => setItemForm({ ...itemForm, albumId: e.target.value })}
//                           required
//                         >
//                           <option value="" className="text-black">Pilih Album</option>
//                           {albums.map((a) => (
//                             <option key={a.id} value={a.id} className="text-black">
//                               {a.title}
//                             </option>
//                           ))}
//                         </Select>
//                       </Field>
//                     )}

//                     <Field label="Judul">
//                       <Input
//                         value={itemForm.title}
//                         onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
//                         placeholder="Judul item"
//                         required
//                       />
//                     </Field>

//                     <Field label="Deskripsi">
//                       <TextArea
//                         value={itemForm.description}
//                         onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
//                         placeholder="Deskripsi item"
//                         rows={3}
//                       />
//                     </Field>

//                     <Field label={editingItemId ? "Ganti Gambar (opsional)" : "Gambar"}>
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => setItemForm({ ...itemForm, image: e.target.files?.[0] || null })}
//                         required={!editingItemId}
//                       />
//                       {itemForm.image && (
//                         <p className="text-xs text-white/70 mt-1">{itemForm.image.name}</p>
//                       )}
//                     </Field>

//                     <div className="flex justify-end gap-2 mt-6">
//                       <button
//                         type="button"
//                         onClick={closeItemModal}
//                         className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//                         disabled={loading}
//                       >
//                         Simpan
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* GALLERY VIEW MODAL - Saat klik album */}
//       <Transition appear show={isGalleryModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={() => setIsGalleryModalOpen(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-95" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-6xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg">
//                   <div className="flex items-center justify-between mb-6">
//                     <Dialog.Title className="text-2xl font-bold text-white">
//                       {selectedAlbum?.title || "Gallery"}
//                     </Dialog.Title>
//                     <button
//                       onClick={() => setIsGalleryModalOpen(false)}
//                       className="text-3xl text-white/70 hover:text-white"
//                     >
//                       ×
//                     </button>
//                   </div>

//                   {!itemsByAlbum[selectedAlbumForGallery ?? ""] ? (
//                     <div className="text-center py-20 text-white/60 text-lg">Memuat gambar...</div>
//                   ) : itemsByAlbum[selectedAlbumForGallery ?? ""].length === 0 ? (
//                     <div className="text-center py-20 text-white/60 text-lg">
//                       Belum ada foto di album ini
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                       {itemsByAlbum[selectedAlbumForGallery ?? ""].map((item: any) => (
//                         <div
//                           key={item.id}
//                           className="group relative aspect-square overflow-hidden rounded-xl shadow-lg"
//                         >
//                           {item.imageUrl ? (
//                             <img
//                               src={`${BASE_URL}${item.imageUrl}`}
//                               alt={item.title}
//                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/40">
//                               No Image
//                             </div>
//                           )}
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
//                             <h4 className="text-white font-medium text-sm truncate">
//                               {item.title}
//                             </h4>
//                             {item.description && (
//                               <p className="text-white/80 text-xs mt-1 line-clamp-2">
//                                 {item.description}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }



import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FolderOpen, ImageIcon, Info, Maximize2, Pen, Plus, Trash, UploadCloud, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

// === THEME TOKENS ===
const THEME_TOKENS = {
  smkn13: {
    "--brand-primary": "#10b981",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#f59e0b",
    "--brand-bg": "#0a0a0a",
    "--brand-surface": "rgba(24,24,27,0.8)",
    "--brand-surfaceText": "#f3f4f6",
    "--brand-subtle": "#27272a",
    "--brand-pop": "#3b82f6",
  },
};

// Apply theme
if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join('');
}

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// === ALERT HOOK ===
const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
  };

  const hideAlert = () => {
    setAlert({ message: "", isVisible: false });
  };

  return { alert, showAlert, hideAlert };
};

// === ALERT COMPONENT ===
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess
          ? "border-green-500/30 bg-blue-500/10 text-green-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "ml-4 text-xl leading-none",
            isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
          )}
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// === FORM COMPONENTS ===
const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
  </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
      className
    )}
  />
);

const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
      className
    )}
  />
);

const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// === DEFAULT VALUES ===
const DEFAULT_ALBUM = { title: "", description: "", cover: null };
const DEFAULT_ITEM = { title: "", description: "", albumId: "", image: null };

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${localStorage.getItem("token")}` // jika pakai auth
});

const getFormDataHeaders = () => ({
  // JANGAN set Content-Type untuk FormData
  // "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

export function GaleriMain() {
  const [activeTab, setActiveTab] = useState<"album" | "item">("album");
  const [albums, setAlbums] = useState<any[]>([]);
  const [itemsByAlbum, setItemsByAlbum] = useState<Record<string, any[]>>({});
  
  const [albumForm, setAlbumForm] = useState(DEFAULT_ALBUM);
  const [itemForm, setItemForm] = useState(DEFAULT_ITEM);
  
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedAlbumForItems, setSelectedAlbumForItems] = useState<string | null>(null);
  const [selectedAlbumForGallery, setSelectedAlbumForGallery] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  
  const schoolid = useSchool()
  
  // === CONFIG ===
  const SCHOOL_ID = schoolid?.data?.[0]?.id; // ← GANTI SESUAI SEKOLAH ANDA
  const BASE_URL = "https://be-school.kiraproject.id";
  
  // ── FETCH ────────────────────────────────────────────────────────────────

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
        headers: getJsonHeaders(),
      });
      if (!res.ok) throw new Error("Gagal mengambil album");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Response tidak success");
      setAlbums(json.data || []);
    } catch (err: any) {
      showAlert("Gagal memuat album: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsForAlbum = async (albumId: string) => {
    if (!albumId) return;
    try {
      const res = await fetch(`${BASE_URL}/gallery?albumId=${albumId}&isActive=true`, {
        headers: getJsonHeaders(),
      });
      if (!res.ok) throw new Error("Gagal mengambil item");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Response tidak success");
      setItemsByAlbum((prev) => ({
        ...prev,
        [albumId]: json.data || [],
      }));
    } catch (err: any) {
      showAlert(`Gagal memuat item: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (activeTab === "item" && selectedAlbumForItems) {
      fetchItemsForAlbum(selectedAlbumForItems);
    }
  }, [selectedAlbumForItems, activeTab]);

  // ── ALBUM CRUD ──────────────────────────────────────────────────────────

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description || "");
    formData.append("schoolId", SCHOOL_ID);
    if (albumForm.cover) formData.append("cover", albumForm.cover);

    try {
      const isEdit = !!editingAlbumId;
      const url = isEdit ? `${BASE_URL}/albums/${editingAlbumId}` : `${BASE_URL}/albums`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getFormDataHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} album`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert(isEdit ? "Album berhasil diperbarui" : "Album berhasil ditambahkan");
      setAlbumForm(DEFAULT_ALBUM);
      setEditingAlbumId(null);
      setIsAlbumModalOpen(false);
      fetchAlbums();
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Yakin ingin menghapus album ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/albums/${id}`, {
        method: "DELETE",
        headers: getJsonHeaders(),
      });
      if (!res.ok) throw new Error("Gagal menghapus album");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");
      showAlert("Album berhasil dihapus");
      fetchAlbums();
      if (selectedAlbumForItems === id) setSelectedAlbumForItems(null);
      if (selectedAlbumForGallery === id) setIsGalleryModalOpen(false);
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── ITEM CRUD ───────────────────────────────────────────────────────────

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!itemForm.albumId) {
      showAlert("Pilih album terlebih dahulu!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", itemForm.title);
    formData.append("description", itemForm.description || "");
    if (!editingItemId) formData.append("albumId", itemForm.albumId);
    if (itemForm.image) formData.append("image", itemForm.image);

    try {
      const isEdit = !!editingItemId;
      const url = isEdit ? `${BASE_URL}/gallery/${editingItemId}` : `${BASE_URL}/gallery`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getFormDataHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} item`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert(isEdit ? "Item berhasil diperbarui" : "Item berhasil ditambahkan");
      setItemForm(DEFAULT_ITEM);
      setEditingItemId(null);
      setIsItemModalOpen(false);
      if (selectedAlbumForItems) fetchItemsForAlbum(selectedAlbumForItems);
      if (selectedAlbumForGallery) fetchItemsForAlbum(selectedAlbumForGallery);
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: getJsonHeaders(),
      });
      if (!res.ok) throw new Error("Gagal menghapus item");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");
      showAlert("Item berhasil dihapus");
      if (selectedAlbumForItems) fetchItemsForAlbum(selectedAlbumForItems);
      if (selectedAlbumForGallery) fetchItemsForAlbum(selectedAlbumForGallery);
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── MODAL HANDLERS ──────────────────────────────────────────────────────

  const openAlbumModal = (album: any = null) => {
    if (album) {
      setAlbumForm({
        title: album.title,
        description: album.description || "",
        cover: null,
      });
      setEditingAlbumId(album.id);
    } else {
      setAlbumForm(DEFAULT_ALBUM);
      setEditingAlbumId(null);
    }
    setIsAlbumModalOpen(true);
  };

  const openItemModal = (item: any = null) => {
    if (item) {
      setItemForm({
        title: item.title,
        description: item.description || "",
        albumId: item.albumId,
        image: null,
      });
      setEditingItemId(item.id);
    } else {
      setItemForm({ ...DEFAULT_ITEM, albumId: selectedAlbumForItems || "" });
      setEditingItemId(null);
    }
    setIsItemModalOpen(true);
  };

  const openGalleryModal = (albumId: string) => {
    setSelectedAlbumForGallery(albumId);
    setIsGalleryModalOpen(true);

    // Pre-fetch jika belum ada data
    if (!itemsByAlbum[albumId]) {
      fetchItemsForAlbum(albumId);
    }
  };

  const closeAlbumModal = () => {
    setAlbumForm(DEFAULT_ALBUM);
    setEditingAlbumId(null);
    setIsAlbumModalOpen(false);
  };

  const closeItemModal = () => {
    setItemForm(DEFAULT_ITEM);
    setEditingItemId(null);
    setIsItemModalOpen(false);
  };

  // ── RENDER ───────────────────────────────────────────────────────────────

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumForGallery);

  return (
    <div className="min-h-screen bg-transparent text-white p-4 lg:p-0 space-y-8 font-sans">
      
      {/* 1. ALERT NOTIFICATION */}
      <AnimatePresence>
        {alert.isVisible && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-md px-4">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Info size={18} />
                <span className="text-sm font-bold tracking-tight uppercase">{alert.message}</span>
              </div>
              <button onClick={hideAlert} className="hover:rotate-90 transition-transform"><X size={18}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER - KONSISTEN DENGAN VISI MISI */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-6 bg-blue-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Dashboard Konten</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Manajemen <span className="text-blue-700">Galeri</span>
          </h1>
          <p className="text-zinc-500 texxt-sm font-medium">Album dan foto kenangan</p>
        </div>

        {/* MODERN TAB SWITCHER */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {[
            { id: "album", label: "Album Foto", icon: FolderOpen },
            { id: "item", label: "Media Item", icon: ImageIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-6 py-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-white/40 hover:text-white"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 3. MAIN CONTENT AREA */}
      <main className="min-h-[60vh]">
        {activeTab === "album" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white/30 font-bold uppercase tracking-widest text-[11px] italic">Daftar Koleksi Album</h2>
              <button
                onClick={() => openAlbumModal()}
                className="group flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                disabled={loading}
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah Album
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.length === 0 && !loading && (
                <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-white/20 italic uppercase tracking-widest text-[10px]">
                  <FolderOpen size={48} className="mb-4 opacity-10" />
                  Belum ada album yang dibuat
                </div>
              )}

              {albums.map((album: any) => (
                <div
                  key={album.id}
                  onClick={() => openGalleryModal(album.id)}
                  className="group relative bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-52 overflow-hidden bg-zinc-900">
                    {album.coverUrl ? (
                      <img src={`${BASE_URL}${album.coverUrl}`} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={album.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={40} /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">{album.title}</h3>
                    <p className="text-white/40 text-xs mt-2 line-clamp-2 min-h-[32px] italic">{album.description || "—"}</p>
                    
                    <div className="flex gap-2 mt-6 pt-6 border-t border-white/5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openAlbumModal(album); }}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Pen size={12} /> Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pt-2">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <ChevronRight size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Pilih Album Galeri</span>
                </div>
                <Select value={selectedAlbumForItems || ""} onChange={(e) => setSelectedAlbumForItems(e.target.value || null)}>
                  <option value="" className="text-black">Semua Asset</option>
                  {albums.map((a: any) => <option key={a.id} value={a.id} className="text-black">{a.title}</option>)}
                </Select>
              </div>
              <button
                onClick={() => selectedAlbumForItems ? openItemModal() : showAlert("Pilih album dulu!")}
                className="w-full md:w-auto h-[46px] px-8 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-lg"
                disabled={!selectedAlbumForItems}
              >
                <Plus size={16} className="inline mr-2" /> Tambah Asset
              </button>
            </div>

            {selectedAlbumForItems ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {itemsByAlbum[selectedAlbumForItems]?.map((item: any) => (
                  <div key={item.id} className="group bg-white/5 border border-white/10 rounded-2xl p-2 hover:border-white/30 transition-all">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
                      <img src={`${BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover" alt={item.title} />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openItemModal(item)} className="p-2.5 bg-white text-black rounded-lg hover:scale-110 transition-transform"><Pen size={14}/></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-2.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"><Trash size={14}/></button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-bold truncate text-white uppercase tracking-tight">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.02] text-white/20 italic uppercase tracking-[0.3em] text-[10px]">
                Silakan pilih filter album untuk mengelola konten
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL ALBUM --- */}
      <Transition appear show={isAlbumModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeAlbumModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-lg">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 ease-in-out" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-zinc-900 border-l border-white/10 p-10 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <Dialog.Title className="text-2xl font-black italic uppercase text-white tracking-tighter">{editingAlbumId ? "Edit" : "Buat"} Album</Dialog.Title>
                  <button onClick={closeAlbumModal} className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white"><X size={20}/></button>
                </div>
                <form onSubmit={handleAlbumSubmit} className="space-y-6 flex-1">
                  <Field label="Nama Album"><Input value={albumForm.title} onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})} placeholder="..." required /></Field>
                  <Field label="Deskripsi Singkat"><TextArea value={albumForm.description} onChange={(e) => setAlbumForm({...albumForm, description: e.target.value})} rows={4} placeholder="..." /></Field>
                  <Field label="Gambar Cover">
                    <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => setAlbumForm({...albumForm, cover: e.target.files?.[0] || null})} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <UploadCloud size={24} className="mx-auto mb-2 text-white/20" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{albumForm.cover ? albumForm.cover.name : "Unggah Asset Cover"}</p>
                    </div>
                  </Field>
                  <div className="pt-10 flex gap-4">
                    <button type="button" onClick={closeAlbumModal} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Batal</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20" disabled={loading}>Simpan Album</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL ITEM --- */}
      <Transition appear show={isItemModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeItemModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/90 backdrop-blur-sm" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/10 p-10 text-left shadow-2xl">
                  <Dialog.Title className="text-xl font-black italic uppercase text-white mb-6">Informasi Asset</Dialog.Title>
                  <form onSubmit={handleItemSubmit} className="space-y-5">
                    {!editingItemId && (
                      <Field label="Target Album">
                        <Select value={itemForm.albumId} onChange={(e) => setItemForm({...itemForm, albumId: e.target.value})} required>
                          <option value="" className="text-black">Pilih...</option>
                          {albums.map((a: any) => <option key={a.id} value={a.id} className="text-black">{a.title}</option>)}
                        </Select>
                      </Field>
                    )}
                    <Field label="Judul"><Input value={itemForm.title} onChange={(e) => setItemForm({...itemForm, title: e.target.value})} required /></Field>
                    <Field label="Deskripsi"><TextArea value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} rows={3} /></Field>
                    <Field label="File Gambar"><Input type="file" accept="image/*" onChange={(e) => setItemForm({...itemForm, image: e.target.files?.[0] || null})} required={!editingItemId} /></Field>
                    <div className="flex justify-end gap-3 pt-6">
                      <button type="button" onClick={closeItemModal} className="px-6 py-2 text-xs font-bold text-white/30">Tutup</button>
                      <button type="submit" className="px-8 py-2 bg-blue-600 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg" disabled={loading}>Proses</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL GALLERY VIEW --- */}
      <Transition appear show={isGalleryModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999999]" onClose={() => setIsGalleryModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="min-h-full p-6 lg:p-12">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedAlbum?.title || "Daftar Foto"}</h2>
                    <button onClick={() => setIsGalleryModalOpen(false)} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"><X size={24} /></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {itemsByAlbum[selectedAlbumForGallery ?? ""]?.map((item: any) => (
                      <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl">
                        <img src={`${BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}