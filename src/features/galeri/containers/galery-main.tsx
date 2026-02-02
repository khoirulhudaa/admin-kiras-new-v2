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
// const clsx = (...args) => args.filter(Boolean).join(" ");

// // === ALERT HOOK ===
// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });

//   const showAlert = (message) => {
//     setAlert({ message, isVisible: true });
//   };

//   const hideAlert = () => {
//     setAlert({ message: "", isVisible: false });
//   };

//   return { alert, showAlert, hideAlert };
// };

// // === ALERT COMPONENT ===
// const Alert = ({ message, onClose }) => {
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
//             "ml-4",
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
// const Field = ({ label, children, className }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//   </label>
// );

// const Input = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
//       className
//     )}
//   />
// );

// const TextArea = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
//       className
//     )}
//   />
// );

// const Select = ({ className, ...props }) => (
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

// // === CONFIG ===
// const SCHOOL_ID = "25"; // ← GANTI SESUAI SEKOLAH ANDA
// const BASE_URL = "https://be-school.kiraproject.id";

// const getJsonHeaders = () => ({
//   "Content-Type": "application/json",
//   // "Authorization": `Bearer ${localStorage.getItem("token")}` // jika ada autentikasi
// });

// const getFormDataHeaders = () => ({
//   // JANGAN set Content-Type untuk FormData
//   // "Authorization": `Bearer ${localStorage.getItem("token")}`,
// });

// export function GaleriMain() {
//   const [activeTab, setActiveTab] = useState("album");
//   const [albums, setAlbums] = useState([]);
//   const [itemsByAlbum, setItemsByAlbum] = useState({});

//   const [albumForm, setAlbumForm] = useState(DEFAULT_ALBUM);
//   const [itemForm, setItemForm] = useState(DEFAULT_ITEM);

//   const [editingAlbumId, setEditingAlbumId] = useState(null);
//   const [editingItemId, setEditingItemId] = useState(null);

//   const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
//   const [isItemModalOpen, setIsItemModalOpen] = useState(false);

//   const [selectedAlbumForItems, setSelectedAlbumForItems] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   // ── FETCH ────────────────────────────────────────────────────────────────

//   const fetchAlbums = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal mengambil album");
//       const json = await res.json();
//       console.log('json album', json.data)
//       if (!json.success) throw new Error(json.message || "Response tidak success");
//       setAlbums(json.data || []);
//     } catch (err) {
//       showAlert("Gagal memuat album: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemsForAlbum = async (albumId) => {
//     if (!albumId) return;
//     try {
//       const res = await fetch(`${BASE_URL}/gallery?albumId=${albumId}&isActive=true`, {
//         headers: getJsonHeaders(),
//       });
//       if (!res.ok) throw new Error("Gagal mengambil item");
//       const json = await res.json();
//       console.log('json gallery items', json.data)
//       if (!json.success) throw new Error(json.message || "Response tidak success");
//       setItemsByAlbum(prev => ({
//         ...prev,
//         [albumId]: json.data || [],
//       }));
//     } catch (err) {
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

//   const handleAlbumSubmit = async (e) => {
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
//     } catch (err) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAlbum = async (id) => {
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
//     } catch (err) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── ITEM CRUD ───────────────────────────────────────────────────────────

//   const handleItemSubmit = async (e) => {
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
//     } catch (err) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteItem = async (id) => {
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
//     } catch (err) {
//       showAlert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── MODAL HANDLERS ──────────────────────────────────────────────────────

//   const openAlbumModal = (album = null) => {
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

//   const openItemModal = (item = null) => {
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

//   return (
//     <div className="space-y-6 py-4 mb-10">
//       <AnimatePresence>
//         {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       </AnimatePresence>

//       {/* Tabs */}
//       <div className="flex border rounded-lg overflow-hidden border-white/20">
//         {["album", "item"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={clsx(
//               "px-4 py-2 text-sm w-full justify-center flex items-center font-medium",
//               activeTab === tab
//                 ? "bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.30)] text-[#6ee7b7]"
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
//           <div className="flex justify-between items-center mb-3">
//             <div className="text-sm font-semibold">Daftar Album</div>
//             <button
//               onClick={() => openAlbumModal()}
//               className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
//               disabled={loading}
//             >
//               <Plus size={16} /> Tambah Album
//             </button>
//           </div>

//           {loading && <div className="text-sm text-white/70">Memuat...</div>}
//           {!loading && albums.length === 0 && <div className="text-sm text-white/70">Tidak ada album</div>}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//             {albums.map((album) => (
//               <div key={album.id} className="rounded-xl border border-white/20 p-4 bg-white/5">
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
//                 <p className="text-xs text-white/70 mt-1">{album.description || "—"}</p>
//                 {/* <div className="flex gap-2 mt-3">
//                   <button
//                     onClick={() => openAlbumModal(album)}
//                     className="flex-1 gap-2 py-2 flex items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 text-xs text-blue-300"
//                     disabled={loading}
//                   >
//                     <Pen size={16} /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteAlbum(album.id)}
//                     className="flex-1 gap-2 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
//                     disabled={loading}
//                   >
//                     <Trash size={16} /> Hapus
//                   </button>
//                 </div> */}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ITEM TAB */}
//       {activeTab === "item" && (
//         <div className="rounded-2xl border border-white/20 p-4">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//             <div className="text-sm font-semibold">Daftar Gallery Item</div>

//             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//               <Select
//                 value={selectedAlbumForItems || ""}
//                 onChange={(e) => setSelectedAlbumForItems(e.target.value || null)}
//                 className="w-full sm:w-64"
//               >
//                 <option className="text-black" value="">Pilih Album untuk melihat item</option>
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
//                 className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500 whitespace-nowrap"
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

//               {(!itemsByAlbum[selectedAlbumForItems] || itemsByAlbum[selectedAlbumForItems].length === 0) && !loading && (
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
//                     <div className="flex gap-2 mt-3">
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
//         <Dialog as="div" className="relative z-10" onClose={closeAlbumModal}>
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
//                     {editingAlbumId ? "Edit Album" : "Tambah Album"}
//                   </Dialog.Title>
//                   <form onSubmit={handleAlbumSubmit} className="space-y-4">
//                     <Field label="Judul">
//                       <Input
//                         name="title"
//                         value={albumForm.title}
//                         onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
//                         placeholder="Judul album"
//                         required
//                       />
//                     </Field>
//                     <Field label="Deskripsi">
//                       <TextArea
//                         name="description"
//                         value={albumForm.description}
//                         onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
//                         placeholder="Deskripsi album"
//                         rows={3}
//                       />
//                     </Field>
//                     <Field label={editingAlbumId ? "Ganti Cover (opsional)" : "Cover (opsional)"}>
//                       <Input
//                         type="file"
//                         name="cover"
//                         accept="image/*"
//                         onChange={(e) => setAlbumForm({ ...albumForm, cover: e.target.files?.[0] || null })}
//                       />
//                       {albumForm.cover && (
//                         <p className="text-xs text-white/70 mt-1">{albumForm.cover.name}</p>
//                       )}
//                     </Field>
//                     <div className="flex justify-end gap-2 mt-6">
//                       <button
//                         type="button"
//                         onClick={closeAlbumModal}
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
//                         <span>Simpan</span>
//                         {editingAlbumId ? "Update" : "Simpan"}
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
//                           name="albumId"
//                           value={itemForm.albumId}
//                           onChange={(e) => setItemForm({ ...itemForm, albumId: e.target.value })}
//                           required
//                         >
//                           <option value="">Pilih Album</option>
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
//                         name="title"
//                         value={itemForm.title}
//                         onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
//                         placeholder="Judul item"
//                         required
//                       />
//                     </Field>

//                     <Field label="Deskripsi">
//                       <TextArea
//                         name="description"
//                         value={itemForm.description}
//                         onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
//                         placeholder="Deskripsi item"
//                         rows={3}
//                       />
//                     </Field>

//                     <Field label={editingItemId ? "Ganti Gambar (opsional)" : "Gambar"}>
//                       <Input
//                         type="file"
//                         name="image"
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
//                         <span>Simpan</span>
//                         {editingItemId ? "Update" : "Simpan"}
//                       </button>
//                     </div>
//                   </form>
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
import { Pen, Plus, Trash } from "lucide-react";
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
    <div className="space-y-6 mb-10 bg-white/5 rounded-xl p-6 py-6 mt-4 border border-white/30">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex border rounded-lg overflow-hidden border-white/20">
        {["album", "item"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "album" | "item")}
            className={clsx(
              "px-4 py-2 text-sm w-full justify-center flex items-center font-medium",
              activeTab === tab
                ? "bg-blue-500 border-[rgba(16,185,129,0.30)] text-white"
                : "text-white/70 hover:text-white"
            )}
          >
            {tab === "album" ? "Album" : "Gallery Item"}
          </button>
        ))}
      </div>

      {/* ALBUM TAB */}
      {activeTab === "album" && (
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="flex justify-start items-center mb-3">
            <button
              onClick={() => openAlbumModal()}
              className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
              disabled={loading}
            >
              <Plus size={16} /> Tambah Album
            </button>
          </div>

          {loading && <div className="text-sm text-white/70">Memuat...</div>}
          {!loading && albums.length === 0 && <div className="text-sm text-white/70">Tidak ada album</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => openGalleryModal(album.id)}
                className={clsx(
                  "rounded-xl border border-white/20 p-4 bg-white/5",
                  "cursor-pointer hover:bg-white/10 transition-all duration-200 relative group"
                )}
              >
                {album.coverUrl ? (
                  <img
                    src={`${BASE_URL}${album.coverUrl}`}
                    alt={album.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-white/50 text-sm">
                    No Cover
                  </div>
                )}
                <h3 className="font-medium text-white">{album.title}</h3>
                <p className="text-xs text-white/70 mt-1 line-clamp-2">{album.description || "—"}</p>

                {/* Action buttons - stay on top */}
                <div className="relative border-t border-white/30 mt-5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-3 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAlbumModal(album);
                    }}
                    className="rounded-lg min-w-full justify-center max-w-max flex items-center gap-2 bg-blue-500/20 py-2 border border-blue-800 px-4 text-blue-300 hover:bg-blue-500/40"
                    disabled={loading}
                  >
                    <Pen size={16} />
                    <p className="text-xs">Perbarui</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlbum(album.id);
                    }}
                    className="rounded-lg min-w-full justify-center max-w-max flex items-center gap-2 bg-red-500/20 py-2  border border-blue-800px-4 text-red-300 hover:bg-red-500/40"
                    disabled={loading}
                  >
                    <Trash size={16} />
                    <p className="text-xs">Hapus</p>
                  </button>
                </div> 
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ITEM TAB (tetap seperti semula) */}
      {activeTab === "item" && (
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select
                value={selectedAlbumForItems || ""}
                onChange={(e) => setSelectedAlbumForItems(e.target.value || null)}
                className="w-full sm:w-64"
              >
                <option className="text-black" value="">Pilih Album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id} className="text-black">
                    {a.title}
                  </option>
                ))}
              </Select>

              <button
                onClick={() => {
                  if (!selectedAlbumForItems) {
                    showAlert("Pilih album terlebih dahulu!");
                    return;
                  }
                  openItemModal();
                }}
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600 whitespace-nowrap"
                disabled={loading || !selectedAlbumForItems}
              >
                <Plus size={16} /> Tambah Item
              </button>
            </div>
          </div>

          {!selectedAlbumForItems && (
            <div className="text-center py-8 text-white/60">
              Pilih album terlebih dahulu untuk melihat/menambah item galeri
            </div>
          )}

          {selectedAlbumForItems && (
            <>
              {loading && <div className="text-sm text-white/70">Memuat...</div>}

              {(!itemsByAlbum[selectedAlbumForItems]?.length && !loading) && (
                <div className="text-sm text-white/70">Belum ada item di album ini</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {itemsByAlbum[selectedAlbumForItems]?.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/20 p-4 bg-white/5">
                    {item.imageUrl ? (
                      <img
                        src={`${BASE_URL}${item.imageUrl}`}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-white/50 text-sm">
                        No Image
                      </div>
                    )}
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-xs text-white/70 mt-1">{item.description || "—"}</p>
                    <div className="flex gap-2 mt-3 border-t border-white/30 pt-4">
                      <button
                        onClick={() => openItemModal(item)}
                        className="flex-1 gap-2 py-2 flex items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 text-xs text-blue-300"
                        disabled={loading}
                      >
                        <Pen size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-1 gap-2 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                        disabled={loading}
                      >
                        <Trash size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ALBUM MODAL */}
      <Transition appear show={isAlbumModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999999999999]" onClose={closeAlbumModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full md:w-[40vw] fixed top-0 right-0 h-screen border border-white/20 bg-black/50 p-6 backdrop-blur-sm">
                  <Dialog.Title className="text-lg font-semibold text-white mb-4">
                    {editingAlbumId ? "Edit Album" : "Tambah Album"}
                  </Dialog.Title>
                  <form onSubmit={handleAlbumSubmit} className="h-full flex flex-col justify-between">
                    <div className="space-y-4 h-max">
                      <Field label="Judul">
                        <Input
                          value={albumForm.title}
                          onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                          placeholder="Judul album"
                          required
                        />
                      </Field>
                      <Field label="Deskripsi">
                        <TextArea
                          value={albumForm.description}
                          onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                          placeholder="Deskripsi album"
                          rows={3}
                        />
                      </Field>
                      <Field label={editingAlbumId ? "Ganti Cover (opsional)" : "Cover (opsional)"}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAlbumForm({ ...albumForm, cover: e.target.files?.[0] || null })}
                        />
                        {albumForm.cover && (
                          <p className="text-xs text-white/70 mt-1">{albumForm.cover.name}</p>
                        )}
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative top-[-36px]">
                      <button
                        type="button"
                        onClick={closeAlbumModal}
                        className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                        disabled={loading}
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ITEM MODAL */}
      <Transition appear show={isItemModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeItemModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                  <Dialog.Title className="text-lg font-semibold text-white mb-4">
                    {editingItemId ? "Edit Item" : "Tambah Item"}
                  </Dialog.Title>
                  <form onSubmit={handleItemSubmit} className="space-y-4">
                    {!editingItemId && (
                      <Field label="Album">
                        <Select
                          value={itemForm.albumId}
                          onChange={(e) => setItemForm({ ...itemForm, albumId: e.target.value })}
                          required
                        >
                          <option value="" className="text-black">Pilih Album</option>
                          {albums.map((a) => (
                            <option key={a.id} value={a.id} className="text-black">
                              {a.title}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}

                    <Field label="Judul">
                      <Input
                        value={itemForm.title}
                        onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                        placeholder="Judul item"
                        required
                      />
                    </Field>

                    <Field label="Deskripsi">
                      <TextArea
                        value={itemForm.description}
                        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                        placeholder="Deskripsi item"
                        rows={3}
                      />
                    </Field>

                    <Field label={editingItemId ? "Ganti Gambar (opsional)" : "Gambar"}>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.files?.[0] || null })}
                        required={!editingItemId}
                      />
                      {itemForm.image && (
                        <p className="text-xs text-white/70 mt-1">{itemForm.image.name}</p>
                      )}
                    </Field>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={closeItemModal}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                        disabled={loading}
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* GALLERY VIEW MODAL - Saat klik album */}
      <Transition appear show={isGalleryModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsGalleryModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-95" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      {selectedAlbum?.title || "Gallery"}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsGalleryModalOpen(false)}
                      className="text-3xl text-white/70 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  {!itemsByAlbum[selectedAlbumForGallery ?? ""] ? (
                    <div className="text-center py-20 text-white/60 text-lg">Memuat gambar...</div>
                  ) : itemsByAlbum[selectedAlbumForGallery ?? ""].length === 0 ? (
                    <div className="text-center py-20 text-white/60 text-lg">
                      Belum ada foto di album ini
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {itemsByAlbum[selectedAlbumForGallery ?? ""].map((item: any) => (
                        <div
                          key={item.id}
                          className="group relative aspect-square overflow-hidden rounded-xl shadow-lg"
                        >
                          {item.imageUrl ? (
                            <img
                              src={`${BASE_URL}${item.imageUrl}`}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/40">
                              No Image
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h4 className="text-white font-medium text-sm truncate">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-white/80 text-xs mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}