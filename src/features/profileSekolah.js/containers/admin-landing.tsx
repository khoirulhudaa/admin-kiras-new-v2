// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Building2,
//   DoorOpen,
//   Edit3,
//   GraduationCap,
//   Info,
//   Mail,
//   Phone,
//   Trophy,
//   Users,
//   X,
//   Youtube,
//   Zap
// } from "lucide-react";
// import { Fragment, useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// // === UTILITIES ===
// const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });
//   const showAlert = (message: string) => setAlert({ message, isVisible: true });
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
//         "fixed top-5 right-5 z-[9999] min-w-[300px] rounded-2xl border p-4 shadow-2xl backdrop-blur-md",
//         isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
//       )}
//     >
//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
//           <Info size={14} />
//           {message}
//         </div>
//         <button onClick={onClose} className="text-xl hover:rotate-90 transition-transform">×</button>
//       </div>
//     </motion.div>
//   );
// };

// // === SUB-COMPONENTS ===
// const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
//   <div className={clsx("space-y-2", className)}>
//     {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 italic">{label}</label>}
//     {children}
//   </div>
// );

// const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 placeholder-white/20",
//       className
//     )}
//   />
// );

// const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 placeholder-white/20",
//       className
//     )}
//   />
// );

// const ImagePreview = ({ file, currentUrl, label }: { file: File | null; currentUrl?: string; label: string }) => {
//   const [preview, setPreview] = useState<string | null>(null);

//   useEffect(() => {
//     if (!file) {
//       setPreview(null);
//       return;
//     }
//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [file]);

//   const displaySrc = preview || currentUrl;

//   return (
//     <div className="space-y-2">
//       <div className="h-20 w-full rounded-xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
//         {displaySrc ? (
//           <img src={displaySrc} alt="Preview" className="h-full w-full object-cover" />
//         ) : (
//           <div className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter">No {label}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// const LocationPicker = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
//   useMapEvents({
//     click(e) {
//       onLocationChange(e.latlng.lat, e.latlng.lng);
//     },
//   });
//   return null;
// };

// // === CONSTANTS ===
// const BASE_URL = "https://be-school.kiraproject.id";

// const DEFAULT_PROFILE = {
//   heroTitle: "",
//   heroSubTitle: "",
//   linkYoutube: "",
//   headmasterWelcome: "",
//   headmasterName: "",
//   schoolName: "",
//   studentCount: "0",
//   teacherCount: "0",
//   roomCount: "0",
//   achievementCount: "0",
//   latitude: "",
//   longitude: "",
//   address: "",
//   phoneNumber: "",
//   email: "",
//   photoHeadmasterUrl: null as any,
//   heroImage: null as any,
//   logo: null as any,
// };

// // === MAIN COMPONENT ===
// export function ProfileSekolahMain() {
//   const { data: schoolData, isLoading: schoolLoading } = useSchool();
//   const SCHOOL_ID = schoolData?.[0]?.id;

//   const [profile, setProfile] = useState<any>(null);
//   const [formData, setFormData] = useState(DEFAULT_PROFILE);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);
//   const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

//   const fetchProfile = async () => {
//     if (!SCHOOL_ID) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/profileSekolah?schoolId=${SCHOOL_ID}`);
//       const json = await res.json();
//       if (json.success && json.data) {
//         setProfile(json.data);
//         setFormData({
//           ...DEFAULT_PROFILE,
//           ...json.data,
//           studentCount: json.data.studentCount?.toString(),
//           teacherCount: json.data.teacherCount?.toString(),
//           roomCount: json.data.roomCount?.toString(),
//           achievementCount: json.data.achievementCount?.toString(),
//           photoHeadmasterUrl: null, // Reset file input state
//           heroImage: null,
//           logo: null
//         });
//         if (json.data.latitude && json.data.longitude) {
//           const lat = parseFloat(json.data.latitude);
//           const lng = parseFloat(json.data.longitude);
//           setMapCenter([lat, lng]);
//           setMarkerPos([lat, lng]);
//         }
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat profil");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (SCHOOL_ID) fetchProfile();
//   }, [SCHOOL_ID]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const form = new FormData();
    
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         form.append(key, value);
//       }
//     });
//     form.append("schoolId", SCHOOL_ID!.toString());

//     try {
//       const url = profile ? `${BASE_URL}/profileSekolah/${profile.id}` : `${BASE_URL}/profileSekolah`;
//       const res = await fetch(url, {
//         method: profile ? "PUT" : "POST",
//         body: form,
//       });
//       const json = await res.json();

//       if (res.ok) {
//         showAlert(profile ? "Pembaruan Berhasil" : "Profil Berhasil Diaktifkan");
//         setIsModalOpen(false);
//         fetchProfile();
//       } else {
//         throw new Error(json.message);
//       }
//     } catch (err: any) {
//       showAlert(err.message || "Gagal menyimpan data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMapClick = (lat: number, lng: number) => {
//     setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
//     setMarkerPos([lat, lng]);
//   };

//   if (schoolLoading) return <div className="p-10 text-zinc-500 animate-pulse font-black tracking-[0.5em] text-xs">INITIALIZING SYSTEM...</div>;

//   return (
//     <div className="space-y-8 pb-20 text-zinc-100">
//       <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//       {/* --- HEADER --- */}
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-10">
//         <div className="space-y-1">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="h-1 w-8 bg-blue-600 rounded-full" />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Official Brand Identity</span>
//           </div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
//             Profil <span className="text-blue-600">Institusi</span>
//           </h1>
//           <p className="text-zinc-500 text-sm font-medium">Kelola informasi publik dan kredensial visual sekolah Anda.</p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] transition-all group"
//         >
//           <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
//           {profile ? "Modifikasi Profil" : "Aktivasi Profil"}
//         </button>
//       </header>

//       {profile ? (
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
//           {/* --- BENTO GRID: HERO & HEADMASTER --- */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-11 items-stretch">
//             {/* Hero Card */}
//             <div className="md:col-span-8 relative h-[450px] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
//               {profile.heroImageUrl ? (
//                 <img src={profile.heroImageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
//               ) : (
//                 <div className="w-full h-full bg-zinc-900" />
//               )}
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
//               {profile.logoUrl && (
//                 <div className="absolute top-8 left-8 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
//                   <img src={profile.logoUrl} className="h-14 w-14 object-contain rounded-xl" />
//                 </div>
//               )}

//               <div className="absolute bottom-12 left-10 right-10">
//                 <h2 className="text-4xl font-black text-white mb-4 leading-none uppercase tracking-tighter italic">
//                   {profile.heroTitle}
//                 </h2>
//                 <div className="flex items-center gap-4 text-blue-400 font-bold italic tracking-wide">
//                   <span className="h-[2px] w-8 bg-blue-500" />
//                   {profile.heroSubTitle}
//                 </div>
//               </div>
//             </div>

//             {/* Headmaster Card */}
//             <div className="md:col-span-4 h-[450px] bg-blue-500/10 border border-white/5 rounded-[3rem] flex flex-col overflow-hidden group">
//               <div className="flex-1 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-blue-600/10 blur-3xl" />
//                 {profile.photoHeadmasterUrl ? (
//                   <img src={profile.photoHeadmasterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
//                 ) : (
//                   <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-700 font-black">NO PHOTO</div>
//                 )}
//               </div>
//               <div className="p-8 text-center bg-blue-500/5 backdrop-blur-xl">
//                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 mb-2">School Principal</p>
//                 <h3 className="text-xl font-black text-white tracking-tight italic">{profile.headmasterName}</h3>
//               </div>
//             </div>
//           </div>

//           {/* --- VIDEO & QUICK INFO --- */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             <div className="lg:col-span-8 bg-blue-500/10 border border-white/5 rounded-[3rem] p-8 overflow-hidden">
//               <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-widest text-[10px] text-red-500">
//                 <Youtube size={18} />
//                 Institusional Video
//               </div>
//               {profile.linkYoutube ? (
//                 <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 grayscale-[0.5] hover:grayscale-0 transition-all duration-500 shadow-2xl">
//                   <iframe 
//                     className="w-full h-full"
//                     src={`https://www.youtube.com/embed/${profile.linkYoutube.includes('v=') ? profile.linkYoutube.split('v=')[1].split('&')[0] : profile.linkYoutube.split('/').pop()}`}
//                     title="YouTube video player"
//                     allowFullScreen
//                   />
//                 </div>
//               ) : (
//                 <div className="aspect-video rounded-[2rem] bg-white/5 flex items-center justify-center border border-dashed border-white/10 text-zinc-600 italic text-sm">
//                   Video URL not configured.
//                 </div>
//               )}
//             </div>

//             <div className="lg:col-span-4 flex flex-col gap-6">
//               <div className="flex-1 p-8 bg-blue-600/10 rounded-[2.5rem] relative overflow-hidden group">
//                 <Phone className="absolute -right-4 -top-4 size-24 text-white/10 -rotate-12" />
//                 <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-4">Contact Line</p>
//                 <h4 className="text-2xl font-black text-white">{profile.phoneNumber || "N/A"}</h4>
//                 <div className="mt-4 flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase">
//                   <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                   Online Support
//                 </div>
//               </div>
//               <div className="flex-1 p-8 bg-blue-500/10 border border-white/5 rounded-[2.5rem]">
//                 <Mail className="text-blue-500 mb-4" size={24} />
//                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">School Email</p>
//                 <p className="text-sm font-bold text-white tracking-tight">{profile.email || "N/A"}</p>
//               </div>
//             </div>
//           </div>

//           {/* --- STATS GRID --- */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {[
//               { label: "Siswa", val: profile.studentCount, icon: <Users size={20}/>, color: "text-blue-500", bg: "bg-blue-500/5" },
//               { label: "Guru", val: profile.teacherCount, icon: <GraduationCap size={20}/>, color: "text-emerald-500", bg: "bg-emerald-500/5" },
//               { label: "Ruangan", val: profile.roomCount, icon: <DoorOpen size={20}/>, color: "text-amber-500", bg: "bg-amber-500/5" },
//               { label: "Prestasi", val: profile.achievementCount, icon: <Trophy size={20}/>, color: "text-purple-500", bg: "bg-purple-500/5" },
//             ].map((s, i) => (
//               <div key={i} className={clsx("p-8 rounded-[2.5rem] border border-white/5", s.bg)}>
//                 <div className={clsx("mb-6", s.color)}>{s.icon}</div>
//                 <div className="text-4xl font-black text-white tracking-tighter">{s.val}</div>
//                 <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* --- BOTTOM: MAP & WELCOME --- */}
//           <div className="grid grid-cols-1 gap-6">
//             {/* <div className="lg:col-span-5 bg-blue-500/10 border border-white/5 rounded-[3rem] overflow-hidden p-6">
//               <div className="h-64 rounded-[2rem] overflow-hidden grayscale contrast-125 mb-6 shadow-inner">
//                  <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
//                   <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
//                   {markerPos && <Marker position={markerPos} />}
//                 </MapContainer>
//               </div>
//               <div className="flex gap-4 px-2">
//                 <MapPin className="text-blue-600 shrink-0" size={20} />
//                 <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">{profile.address}</p>
//               </div>
//             </div> */}

//             <div className="lg:col-span-7 bg-blue-500/10 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group flex items-center">
//               <Building2 className="absolute -right-10 -bottom-10 h-64 w-64 text-white/[0.02] -rotate-12" />
//               <div className="relative z-10 space-y-6">
//                 <Zap className="text-blue-600 fill-blue-600" size={32} />
//                 <p className="text-2xl font-bold italic text-zinc-100 leading-tight tracking-tight">
//                   "{profile.headmasterWelcome}"
//                 </p>
//                 <div className="pt-4 border-t border-white/5 inline-block">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Official Welcome Statement</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       ) : (
//         <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
//           <p className="text-zinc-600 font-bold italic">Profil belum diaktifkan. Silahkan klik tombol Aktivasi Profil.</p>
//         </div>
//       )}

//       {/* --- MODAL CONFIGURATION --- */}
//       <Transition appear show={isModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-[100]" onClose={() => setIsModalOpen(false)}>
//           <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200">
//             <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />
//           </Transition.Child>

//           <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
//             <Transition.Child
//               as={Fragment}
//               enter="transform transition ease-in-out duration-500"
//               enterFrom="translate-x-full"
//               enterTo="translate-x-0"
//               leave="transform transition ease-in-out duration-500"
//               leaveFrom="translate-x-0"
//               leaveTo="translate-x-full"
//             >
//               <Dialog.Panel className="w-screen max-w-2xl bg-zinc-950 border-l border-white/10 shadow-2xl overflow-y-auto">
//                 <div className="p-10">
//                   <div className="flex items-center justify-between mb-12">
//                     <h2 className="text-3xl font-black uppercase italic tracking-tighter">Konfigurasi <span className="text-blue-600">Profil</span></h2>
//                     <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
//                       <X size={20} />
//                     </button>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-8">
//                     <div className="grid grid-cols-2 gap-6">
//                       <Field label="Identitas Sekolah">
//                         <Input placeholder="Nama Resmi Sekolah" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} required />
//                       </Field>
//                       <Field label="Nama Kepala Sekolah">
//                         <Input placeholder="Nama Lengkap & Gelar" value={formData.headmasterName} onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })} required />
//                       </Field>
//                     </div>

//                     <Field label="Pesan Sambutan">
//                       <TextArea rows={5} placeholder="Sambutan singkat kepala sekolah..." value={formData.headmasterWelcome} onChange={(e) => setFormData({ ...formData, headmasterWelcome: e.target.value })} required />
//                     </Field>

//                     <div className="grid grid-cols-2 gap-6">
//                       <Field label="Hero Utama (Judul)">
//                         <Input placeholder="Headline profil" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} />
//                       </Field>
//                       <Field label="Hero Sub-Headline">
//                         <Input placeholder="Deskripsi singkat" value={formData.heroSubTitle} onChange={(e) => setFormData({ ...formData, heroSubTitle: e.target.value })} />
//                       </Field>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6">
//                       <Field label="Telepon Sekolah">
//                         <Input placeholder="021-xxxxxx" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
//                       </Field>
//                       <Field label="Email Resmi">
//                         <Input type="email" placeholder="info@sekolah.sch.id" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//                       </Field>
//                     </div>

//                     <Field label="Alamat Fisik Lengkap">
//                       <TextArea rows={3} placeholder="Jl. Raya Nomor, Kecamatan, Kota..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
//                     </Field>

//                     <Field label="YouTube Profile (URL)">
//                       <Input placeholder="https://www.youtube.com/watch?v=..." value={formData.linkYoutube} onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })} />
//                     </Field>

//                     <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
//                       <Field label="Siswa"><Input type="number" value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })} /></Field>
//                       <Field label="Guru"><Input type="number" value={formData.teacherCount} onChange={(e) => setFormData({ ...formData, teacherCount: e.target.value })} /></Field>
//                       <Field label="Ruang"><Input type="number" value={formData.roomCount} onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })} /></Field>
//                       <Field label="Prestasi"><Input type="number" value={formData.achievementCount} onChange={(e) => setFormData({ ...formData, achievementCount: e.target.value })} /></Field>
//                     </div>

//                     <Field label="Geolokasi (Klik pada Peta)">
//                       <div className="h-64 rounded-2xl overflow-hidden border border-white/10 grayscale">
//                          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%" }}>
//                           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                           <LocationPicker onLocationChange={handleMapClick} />
//                           {markerPos && <Marker position={markerPos} />}
//                         </MapContainer>
//                       </div>
//                       <div className="flex gap-4 mt-2">
//                          <div className="flex-1 text-[10px] font-mono text-zinc-500">LAT: {formData.latitude || "0.0"}</div>
//                          <div className="flex-1 text-[10px] font-mono text-zinc-500">LNG: {formData.longitude || "0.0"}</div>
//                       </div>
//                     </Field>

//                     <div className="space-y-6 pt-6 border-t border-white/5">
//                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Media & Asset Upload</p>
//                       <div className="grid grid-cols-1 gap-6">
//                         {/* Asset Hero */}
//                         <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
//                            <div className="w-32"><ImagePreview file={formData.heroImage} currentUrl={profile?.heroImageUrl} label="Hero" /></div>
//                            <div className="flex-1">
//                               <Field label="">
//                                 <input type="file" className="text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-500" onChange={(e) => setFormData({ ...formData, heroImage: e.target.files?.[0] || null })} />
//                               </Field>
//                            </div>
//                         </div>

//                         {/* Asset Logo & Kepsek */}
//                         <div className="grid grid-cols-2 gap-6">
//                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
//                             <ImagePreview file={formData.logo} currentUrl={profile?.logoUrl} label="Logo" />
//                             <Field label="Logo Sekolah">
//                               <input type="file" className="w-full text-[10px] text-zinc-500" onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })} />
//                             </Field>
//                           </div>
//                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
//                             <ImagePreview file={formData.photoHeadmasterUrl} currentUrl={profile?.photoHeadmasterUrl} label="Kepsek" />
//                             <Field label="Foto Kepala Sekolah">
//                               <input type="file" className="w-full text-[10px] text-zinc-500" onChange={(e) => setFormData({ ...formData, photoHeadmasterUrl: e.target.files?.[0] || null })} />
//                             </Field>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="pt-10 flex gap-4">
//                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl border border-white/10 font-black text-[10px] tracking-widest hover:bg-white/5 transition-all">BATAL</button>
//                        <button type="submit" disabled={loading} className="flex-1 py-5 rounded-2xl bg-blue-600 font-black text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2">
//                           {loading ? <FaSpinner className="animate-spin" /> : "KONFIRMASI PERUBAHAN"}
//                        </button>
//                     </div>
//                   </form>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }


import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan ini
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  DoorOpen,
  Edit3,
  GraduationCap,
  Info,
  Mail,
  Phone,
  Trophy,
  Users,
  X,
  Youtube,
  Zap,
  RefreshCcw
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// === UTILITIES & CONSTANTS ===
const BASE_URL = "https://be-school.kiraproject.id";
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const DEFAULT_PROFILE = {
  heroTitle: "",
  heroSubTitle: "",
  linkYoutube: "",
  headmasterWelcome: "",
  headmasterName: "",
  schoolName: "",
  studentCount: "0",
  teacherCount: "0",
  roomCount: "0",
  achievementCount: "0",
  latitude: "",
  longitude: "",
  address: "",
  phoneNumber: "",
  email: "",
  photoHeadmasterUrl: null as any,
  heroImage: null as any,
  logo: null as any,
};

// === SUB-COMPONENTS (Tetap sama seperti kode Anda) ===
const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  const showAlert = (message: string) => setAlert({ message, isVisible: true });
  const hideAlert = () => setAlert({ message: "", isVisible: false });
  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={clsx("fixed top-5 right-5 z-[9999] min-w-[300px] rounded-2xl border p-4 shadow-2xl backdrop-blur-md",
        isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400")}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"><Info size={14} />{message}</div>
        <button onClick={onClose} className="text-xl hover:rotate-90 transition-transform">×</button>
      </div>
    </motion.div>
  );
};

const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={clsx("w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 placeholder-white/20", className)} />
);

const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={clsx("w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 placeholder-white/20", className)} />
);

const ImagePreview = ({ file, currentUrl, label }: { file: File | null; currentUrl?: string; label: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const displaySrc = preview || currentUrl;
  return (
    <div className="h-20 w-full rounded-xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
      {displaySrc ? <img src={displaySrc} alt="Preview" className="h-full w-full object-cover" /> : <div className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter">No {label}</div>}
    </div>
  );
};

const LocationPicker = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  useMapEvents({ click(e) { onLocationChange(e.latlng.lat, e.latlng.lng); } });
  return null;
};

// === MAIN COMPONENT ===
export function ProfileSekolahMain() {
  const queryClient = useQueryClient();
  const { data: schoolData, isLoading: schoolLoading } = useSchool();
  const SCHOOL_ID = schoolData?.[0]?.id;

  const [formData, setFormData] = useState(DEFAULT_PROFILE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  // ─── REACT QUERY: Fetch Profile ──────────────────────────────
  const { data: profile, isLoading: profileLoading, isFetching } = useQuery({
    queryKey: ["profileSekolah", SCHOOL_ID],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/profileSekolah?schoolId=${SCHOOL_ID}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    enabled: !!SCHOOL_ID,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
  });

  // Sinkronkan Form Data saat Modal Dibuka & Profile tersedia
  const openModal = () => {
    if (profile) {
      setFormData({
        ...DEFAULT_PROFILE,
        ...profile,
        studentCount: profile.studentCount?.toString() || "0",
        teacherCount: profile.teacherCount?.toString() || "0",
        roomCount: profile.roomCount?.toString() || "0",
        achievementCount: profile.achievementCount?.toString() || "0",
        photoHeadmasterUrl: null,
        heroImage: null,
        logo: null
      });
      if (profile.latitude && profile.longitude) {
        setMarkerPos([parseFloat(profile.latitude), parseFloat(profile.longitude)]);
        setMapCenter([parseFloat(profile.latitude), parseFloat(profile.longitude)]);
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) form.append(key, value);
    });
    form.append("schoolId", SCHOOL_ID!.toString());

    try {
      const url = profile ? `${BASE_URL}/profileSekolah/${profile.id}` : `${BASE_URL}/profileSekolah`;
      const res = await fetch(url, {
        method: profile ? "PUT" : "POST",
        body: form,
      });

      if (res.ok) {
        showAlert(profile ? "Pembaruan Berhasil" : "Profil Berhasil Diaktifkan");
        setIsModalOpen(false);
        // SINKRONISASI CACHE REACT QUERY
        queryClient.invalidateQueries({ queryKey: ["profileSekolah"] });
      } else {
        const json = await res.json();
        throw new Error(json.message);
      }
    } catch (err: any) {
      showAlert(err.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setMarkerPos([lat, lng]);
  };

  if (schoolLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-500 space-y-4">
        <FaSpinner className="animate-spin text-blue-600" size={30} />
        <div className="font-black tracking-[0.5em] text-[10px] uppercase">Syncing System Data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 text-zinc-100">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Official Brand Identity {isFetching && " (Syncing...)"}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Profil <span className="text-blue-600">Institusi</span>
          </h1>
        </div>
        <button
          onClick={openModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] transition-all group"
        >
          <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
          {profile ? "Modifikasi Profil" : "Aktivasi Profil"}
        </button>
      </header>

      {profile ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Bento Grid: Hero & Headmaster */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-11 items-stretch">
            <div className="md:col-span-8 relative h-[450px] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
              {profile.heroImageUrl ? (
                <img src={profile.heroImageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              ) : ( <div className="w-full h-full bg-zinc-900" /> )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              {profile.logoUrl && (
                <div className="absolute top-8 left-8 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <img src={profile.logoUrl} className="h-14 w-14 object-contain rounded-xl" />
                </div>
              )}
              <div className="absolute bottom-12 left-10 right-10">
                <h2 className="text-4xl font-black text-white mb-4 leading-none uppercase tracking-tighter italic">{profile.heroTitle}</h2>
                <div className="flex items-center gap-4 text-blue-400 font-bold italic tracking-wide"><span className="h-[2px] w-8 bg-blue-500" />{profile.heroSubTitle}</div>
              </div>
            </div>

            <div className="md:col-span-4 h-[450px] bg-blue-500/10 border border-white/5 rounded-[3rem] flex flex-col overflow-hidden group">
              <div className="flex-1 relative overflow-hidden">
                {profile.photoHeadmasterUrl ? (
                  <img src={profile.photoHeadmasterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : ( <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-700 font-black uppercase text-[10px]">No Photo</div> )}
              </div>
              <div className="p-8 text-center bg-blue-500/5 backdrop-blur-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 mb-2">School Principal</p>
                <h3 className="text-xl font-black text-white tracking-tight italic">{profile.headmasterName}</h3>
              </div>
            </div>
          </div>

          {/* Video & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-blue-500/10 border border-white/5 rounded-[3rem] p-8 overflow-hidden">
              <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-widest text-[10px] text-red-500">
                <Youtube size={18} /> Institusional Video
              </div>
              {profile.linkYoutube ? (
                <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${profile.linkYoutube.includes('v=') ? profile.linkYoutube.split('v=')[1].split('&')[0] : profile.linkYoutube.split('/').pop()}`} allowFullScreen />
                </div>
              ) : ( <div className="aspect-video rounded-[2rem] bg-white/5 flex items-center justify-center border border-dashed border-white/10 text-zinc-600 italic text-sm">Video URL not configured.</div> )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 p-8 bg-blue-600/10 rounded-[2.5rem] relative overflow-hidden group">
                <Phone className="absolute -right-4 -top-4 size-24 text-white/10 -rotate-12" />
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-4">Contact Line</p>
                <h4 className="text-2xl font-black text-white">{profile.phoneNumber || "N/A"}</h4>
              </div>
              <div className="flex-1 p-8 bg-blue-500/10 border border-white/5 rounded-[2.5rem]">
                <Mail className="text-blue-500 mb-4" size={24} />
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">School Email</p>
                <p className="text-sm font-bold text-white tracking-tight">{profile.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Siswa", val: profile.studentCount, icon: <Users size={20}/>, color: "text-blue-500", bg: "bg-blue-500/5" },
              { label: "Guru", val: profile.teacherCount, icon: <GraduationCap size={20}/>, color: "text-emerald-500", bg: "bg-emerald-500/5" },
              { label: "Ruangan", val: profile.roomCount, icon: <DoorOpen size={20}/>, color: "text-amber-500", bg: "bg-amber-500/5" },
              { label: "Prestasi", val: profile.achievementCount, icon: <Trophy size={20}/>, color: "text-purple-500", bg: "bg-purple-500/5" },
            ].map((s, i) => (
              <div key={i} className={clsx("p-8 rounded-[2.5rem] border border-white/5", s.bg)}>
                <div className={clsx("mb-6", s.color)}>{s.icon}</div>
                <div className="text-4xl font-black text-white tracking-tighter">{s.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Welcome Message */}
          <div className="bg-blue-500/10 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group flex items-center">
            <Building2 className="absolute -right-10 -bottom-10 h-64 w-64 text-white/[0.02] -rotate-12" />
            <div className="relative z-10 space-y-6">
              <Zap className="text-blue-600 fill-blue-600" size={32} />
              <p className="text-2xl font-bold italic text-zinc-100 leading-tight tracking-tight">"{profile.headmasterWelcome}"</p>
              <div className="pt-4 border-t border-white/5 inline-block">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Official Welcome Statement</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-zinc-600 font-bold italic">Profil belum diaktifkan. Silakan klik tombol Aktivasi Profil.</p>
        </div>
      )}

      {/* --- MODAL CONFIGURATION (Slide Over) --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200"><div className="fixed inset-0 bg-black/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="w-screen max-w-2xl bg-zinc-950 border-l border-white/10 shadow-2xl overflow-y-auto">
                <div className="p-10">
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Konfigurasi <span className="text-blue-600">Profil</span></h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all"><X size={20} /></button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <Field label="Identitas Sekolah"><Input value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} required /></Field>
                      <Field label="Nama Kepala Sekolah"><Input value={formData.headmasterName} onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })} required /></Field>
                    </div>
                    <Field label="Pesan Sambutan"><TextArea rows={4} value={formData.headmasterWelcome} onChange={(e) => setFormData({ ...formData, headmasterWelcome: e.target.value })} required /></Field>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <Field label="Telepon"><Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} /></Field>
                      <Field label="Email"><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Field>
                    </div>

                    <Field label="Geolokasi">
                      <div className="h-64 rounded-2xl overflow-hidden border border-white/10 grayscale">
                        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%" }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationPicker onLocationChange={handleMapClick} />
                          {markerPos && <Marker position={markerPos} />}
                        </MapContainer>
                      </div>
                    </Field>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Asset Upload</p>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                         <ImagePreview file={formData.heroImage} currentUrl={profile?.heroImageUrl} label="Hero" />
                         <input type="file" className="text-[10px]" onChange={(e) => setFormData({ ...formData, heroImage: e.target.files?.[0] || null })} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                           <ImagePreview file={formData.logo} currentUrl={profile?.logoUrl} label="Logo" />
                           <input type="file" className="text-[10px] w-full" onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })} />
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                           <ImagePreview file={formData.photoHeadmasterUrl} currentUrl={profile?.photoHeadmasterUrl} label="Kepsek" />
                           <input type="file" className="text-[10px] w-full" onChange={(e) => setFormData({ ...formData, photoHeadmasterUrl: e.target.files?.[0] || null })} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 flex gap-4">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl border border-white/10 font-black text-[10px] tracking-widest">BATAL</button>
                       <button type="submit" disabled={isSubmitting} className="flex-1 py-5 rounded-2xl bg-blue-600 font-black text-[10px] tracking-widest flex items-center justify-center gap-2">
                          {isSubmitting ? <FaSpinner className="animate-spin" /> : "KONFIRMASI PERUBAHAN"}
                       </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}