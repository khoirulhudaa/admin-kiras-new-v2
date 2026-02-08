// import { Dialog, Transition } from '@headlessui/react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // Theme Tokens
// const THEME_TOKENS = {
//   smkn13: {
//     '--brand-primary': '#10b981',
//     '--brand-primaryText': '#ffffff',
//     '--brand-accent': '#f59e0b',
//     '--brand-bg': '#0a0a0a',
//     '--brand-surface': 'rgba(24,24,27,0.8)',
//     '--brand-surfaceText': '#f3f4f6',
//     '--brand-subtle': '#27272a',
//     '--brand-pop': '#3b82f6',
//   },
// };

// // Utility: clsx
// const clsx = (...args) => args.filter(Boolean).join(' ');

// // Mini Icons
// const Icon = ({ label }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16, display: 'inline-flex', justifyContent: 'center' }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;
// const IEdit = () => <Icon label="✏️" />;
// const IDelete = () => <Icon label="🗑️" />;
// const ISpinner = () => (
//   <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
// );

// // Utility Components
// const Field = ({ label, hint, children, className }) => (
//   <label className={clsx('block', className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
//       className
//     )}
//   />
// );

// const TextArea = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
//       className
//     )}
//   />
// );

// // Custom useAlert Hook
// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: '', isVisible: false });

//   const showAlert = useCallback((message) => {
//     setAlert({ message, isVisible: true });
//     setTimeout(() => setAlert({ message: '', isVisible: false }), 5000);
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: '', isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// // Alert Component
// const Alert = ({ message, onClose }) => {
//   const isSuccess = message.includes('successfully');
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         'mb-4 rounded-xl border p-4 text-sm',
//         isSuccess
//           ? 'border-green-500/30 bg-green-500/10 text-green-300'
//           : 'border-red-500/30 bg-red-500/10 text-red-300'
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             'ml-4',
//             isSuccess ? 'text-green-300 hover:text-green-400' : 'text-red-300 hover:text-red-400'
//           )}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // Data Interface
// const Rating = () => ({
//   id: null,
//   rating: 5,
//   saran: '',
// });

// // API URL
// const API_URL = 'https://dev.kiraproject.id/api/ratings';

// export const RatingMain = () => {
//   const [ratings, setRatings] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
//   const { alert, showAlert, hideAlert } = useAlert();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingRating, setEditingRating] = useState(null);

//   const token = localStorage.getItem('token');

//   // Fetch ratings (GET)
//   const fetchRatings = async () => {
//     if (!token) {
//       showAlert('Token autentikasi tidak ditemukan. Silakan login.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.get(API_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Cache-Control': 'no-cache',
//           Pragma: 'no-cache',
//           Expires: '0',
//         },
//         params: { t: new Date().getTime() },
//       });
//       setRatings(response.data.ratings);
//       setSummary(response.data.summary);
//     } catch (err) {
//       console.error('Error fetching ratings:', err);
//       showAlert('Gagal memuat data rating');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update rating (PUT)
//   const updateRating = async (id, ratingData) => {
//     try {
//       await axios.put(`${API_URL}/${id}`, ratingData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       await fetchRatings();
//       showAlert('Rating updated successfully');
//     } catch (err) {
//       console.error('Error updating rating:', err);
//       showAlert('Gagal memperbarui rating');
//       throw err;
//     }
//   };

//   // Delete rating (DELETE)
//   const deleteRating = async (id) => {
//     setDeleteLoadingIds((prev) => [...prev, id]);
//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       await fetchRatings();
//       showAlert('Rating deleted successfully');
//     } catch (err) {
//       console.error('Error deleting rating:', err);
//       showAlert('Gagal menghapus rating');
//     } finally {
//       setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
//     }
//   };

//   // Fetch ratings on mount
//   useEffect(() => {
//     fetchRatings();
//   }, []);

//   // Handle editing existing rating
//   const startEditing = (rating) => {
//     setEditingRating({ ...rating });
//     setIsModalOpen(true);
//   };

//   // Handle form input changes
//   const handleInputChange = (field, value) => {
//     setEditingRating((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingRating.rating || !editingRating.saran) {
//       showAlert('Rating dan saran harus diisi');
//       return;
//     }
//     setLoading(true);
//     try {
//       await updateRating(editingRating.id, {
//         rating: editingRating.rating,
//         saran: editingRating.saran,
//       });
//       setIsModalOpen(false);
//       setEditingRating(null);
//     } catch (err) {
//       // Errors are handled in updateRating
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle modal close
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingRating(null);
//   };

//   // Chart data
//   const chartData = {
//     labels: ['1', '2', '3', '4', '5'],
//     datasets: [
//       {
//         label: 'Jumlah Rating',
//         data: summary
//           ? [
//               summary.stats.rating_1,
//               summary.stats.rating_2,
//               summary.stats.rating_3,
//               summary.stats.rating_4,
//               summary.stats.rating_5,
//             ]
//           : [0, 0, 0, 0, 0],
//         backgroundColor: 'rgba(16, 185, 129, 0.5)', // Using brand-primary with opacity
//         borderColor: '#10b981',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: { color: '#ffffff' },
//       },
//       title: {
//         display: true,
//         text: 'Distribusi Rating',
//         color: '#ffffff',
//         font: { size: 14 },
//       },
//     },
//     scales: {
//       x: { ticks: { color: '#ffffff' } },
//       y: {
//         ticks: { color: '#ffffff' },
//         beginAtZero: true,
//         title: { display: true, text: 'Jumlah', color: '#ffffff' },
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen py-6" style={THEME_TOKENS.smkn13}>
//       {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//   <div className="w-full rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 mb-6 shadow-lg">
//   <div className="mb-4 flex items-center justify-between">
//     <h2 className="text-lg font-semibold text-white">Statistik Rating</h2>
//   </div>
//   {summary ? (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="flex flex-col">
//         <div className="mb-4 h-1/2 rounded-xl flex flex-col justify-center bg-white/10 p-4">
//           <p className="text-sm font-medium text-white/70">Rata-rata Rating</p>
//           <p className="text-[40px] font-bold text-emerald-400">{summary.average_rating.toFixed(1)}</p>
//         </div>
//         <div className="rounded-xl h-1/2 flex flex-col justify-center bg-white/10 p-4">
//           <p className="text-sm font-medium text-white/70">Total Rating</p>
//           <p className="text-[40px] font-bold text-emerald-400">{summary.total_ratings}</p>
//         </div>
//       </div>
//       <div className="w-full h-[300px]">
//         <Bar
//           data={chartData}
//           options={{
//             ...chartOptions,
//             maintainAspectRatio: false,
//             plugins: {
//               ...chartOptions.plugins,
//               title: {
//                 ...chartOptions.plugins.title,
//                 font: { size: 16, weight: 'bold' },
//                 padding: { top: 10, bottom: 20 },
//               },
//               legend: {
//                 ...chartOptions.plugins.legend,
//                 labels: { font: { size: 12 }, color: '#ffffff', padding: 15 },
//               },
//             },
//             scales: {
//               x: {
//                 ...chartOptions.scales.x,
//                 grid: { display: false },
//                 ticks: { font: { size: 12 }, color: '#ffffff' },
//               },
//               y: {
//                 ...chartOptions.scales.y,
//                 grid: { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.05)' },
//                 ticks: { font: { size: 12 }, color: '#ffffff', stepSize: 1 },
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   ) : (
//     <div className="flex justify-center items-center h-[300px] text-white/50">
//       Tidak ada data statistik untuk ditampilkan
//     </div>
//   )}
// </div>
//       <div className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 flex items-center justify-between">
//           <div className="text-sm font-semibold text-white">Daftar Rating</div>
//         </div>
//         <div className="overflow-x-auto">
//           {loading && !isModalOpen && (
//             <div className="flex justify-center py-4">
//               <ISpinner />
//             </div>
//           )}
//           {!loading && (
//             <table className="min-w-full border-collapse border border-white/20">
//               <thead>
//                 <tr className="bg-white/10">
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Email</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Rating</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Saran</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Tanggal</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ratings.map((rating) => (
//                   <tr key={rating.id} className="border-b border-white/20">
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.email}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.rating}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.saran}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">
//                       {new Date(rating.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           onClick={() => startEditing(rating)}
//                           disabled={loading || deleteLoadingIds.includes(rating.id)}
//                           className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
//                         >
//                           <IEdit /> Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => deleteRating(rating.id)}
//                           disabled={loading || deleteLoadingIds.includes(rating.id)}
//                           className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
//                         >
//                           {deleteLoadingIds.includes(rating.id) ? <ISpinner /> : <><IDelete /> Hapus</>}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {ratings.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
//                       Tidak ada data rating
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Modal for Form */}
//       <Transition appear show={isModalOpen} as={React.Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
//           <Transition.Child
//             as={React.Fragment}
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
//                 as={React.Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
//                   <Dialog.Title className="mb-3 text-sm font-semibold text-white">
//                     Edit Rating
//                   </Dialog.Title>
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <Field label="Rating">
//                       <select
//                         value={editingRating?.rating || 5}
//                         onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
//                         className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//                         disabled={loading}
//                       >
//                         {[1, 2, 3, 4, 5].map((value) => (
//                           <option className='text-black' key={value} value={value}>
//                             {value}
//                           </option>
//                         ))}
//                       </select>
//                     </Field>
//                     <Field label="Saran">
//                       <TextArea
//                         value={editingRating?.saran || ''}
//                         onChange={(e) => handleInputChange('saran', e.target.value)}
//                         placeholder="Masukkan saran"
//                         disabled={loading}
//                         rows={4}
//                       />
//                     </Field>
//                     <div className="flex justify-end gap-2 mt-4">
//                       <button
//                         type="button"
//                         onClick={handleCloseModal}
//                         className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
//                         disabled={loading}
//                       >
//                         {loading ? <ISpinner /> : <ISave />} Update
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
// };





import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  Star, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Users, 
  Loader2, 
  X, 
  Save, 
  TrendingUp 
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "https://dev.kiraproject.id/api/ratings";

// === ALERT SYSTEM ===
const Alert = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("success") || message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-6 right-6 z-[99999] p-5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${
        isSuccess ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      <div className="h-10 w-10 rounded-full bg-current/10 flex items-center justify-center font-bold">
        {isSuccess ? "✓" : "!"}
      </div>
      <div className="text-sm font-medium">{message}</div>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X size={18}/></button>
    </motion.div>
  );
};

export const RatingMain = () => {
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const token = localStorage.getItem("token");

  const showAlert = useCallback((message) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  }, []);

  const fetchRatings = async () => {
    if (!token) return showAlert("Sesi berakhir, silakan login kembali.");
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: new Date().getTime() },
      });
      setRatings(response.data.ratings);
      setSummary(response.data.summary);
    } catch (err) {
      showAlert("Gagal menyinkronkan data rating.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRatings(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus feedback ini dari sistem?")) return;
    setDeleteLoadingIds((prev) => [...prev, id]);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert("Rating successfully deleted");
      fetchRatings();
    } catch (err) {
      showAlert("Gagal menghapus data.");
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((di) => di !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${editingRating.id}`, 
        { rating: editingRating.rating, saran: editingRating.saran },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Rating updated successfully");
      setIsModalOpen(false);
      fetchRatings();
    } catch (err) {
      showAlert("Gagal memperbarui feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Chart Configuration
  const chartData = {
    labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
    datasets: [{
      label: 'Distribusi Suara',
      data: summary ? [
        summary.stats.rating_1, summary.stats.rating_2,
        summary.stats.rating_3, summary.stats.rating_4,
        summary.stats.rating_5
      ] : [0,0,0,0,0],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: '#10b981',
    }],
  };

  return (
    <div className="min-h-screen space-y-8 pb-20" style={{ color: '#E2E8F0' }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={() => setAlert({ ...alert, isVisible: false })} />}
      </AnimatePresence>

      {/* Header & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                <TrendingUp size={120} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Average Satisfaction</p>
             <h3 className="text-6xl font-black text-white tracking-tighter">
                {summary?.average_rating.toFixed(1) || "0.0"}
                <span className="text-2xl text-zinc-600 ml-2">/ 5.0</span>
             </h3>
             <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(summary?.average_rating) ? "#10b981" : "transparent"} 
                  className={i < Math.round(summary?.average_rating) ? "text-emerald-500" : "text-zinc-700"} />
                ))}
             </div>
          </div>

          <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md">
             <div className="flex items-center gap-4 text-zinc-400 mb-2">
                <Users size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Respondents</span>
             </div>
             <h3 className="text-4xl font-black text-white">{summary?.total_ratings || 0}</h3>
          </div>
        </div>

        <div className="lg:col-span-2 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-md min-h-[300px]">
           <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Rating Distribution Analysis</span>
           </div>
           <div className="h-[220px]">
              <Bar data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#18181b', titleFont: { size: 14 }, padding: 12 } },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
                  x: { grid: { display: false }, ticks: { color: '#71717a', font: { weight: 'bold' } } }
                }
              }} />
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-[40px] border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic">User Feedback</h2>
          </div>
          {loading && <Loader2 className="animate-spin text-emerald-500" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Email</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Score</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Content</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ratings.map((rating) => (
                <tr key={rating.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-6 text-sm font-medium text-emerald-400/80 italic">{rating.email}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                      <Star size={12} fill="#10b981" className="text-emerald-500" />
                      <span className="text-xs font-black text-emerald-400">{rating.rating}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-zinc-400 max-w-xs truncate font-medium">"{rating.saran}"</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingRating(rating); setIsModalOpen(true); }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(rating.id)}
                        disabled={deleteLoadingIds.includes(rating.id)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        {deleteLoadingIds.includes(rating.id) ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ratings.length === 0 && !loading && (
            <div className="py-20 text-center text-zinc-600 font-black uppercase tracking-widest text-xs italic">
              No feedback found in database
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Slide Over) */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100000]" onClose={setIsModalOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <form onSubmit={handleSubmit} className="flex h-full flex-col bg-[#0B1220] border-l border-white/10 shadow-2xl">
                      <div className="p-10">
                        <div className="flex items-center justify-between mb-10">
                          <h2 className="text-3xl font-black text-white italic tracking-tighter">Edit <span className="text-emerald-500">Rating</span></h2>
                          <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={28}/></button>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic block mb-3">Score Level</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setEditingRating({ ...editingRating, rating: val })}
                                  className={`h-12 flex-1 rounded-2xl font-black transition-all border ${
                                    editingRating?.rating === val 
                                    ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic block mb-3">User Feedback Content</label>
                            <textarea
                              value={editingRating?.saran || ""}
                              onChange={(e) => setEditingRating({ ...editingRating, saran: e.target.value })}
                              rows={6}
                              className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-white outline-none focus:border-emerald-500 transition-colors resize-none font-medium"
                              placeholder="Describe the user's issue or feedback..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto p-10 border-t border-white/5 bg-black/20">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest rounded-[24px] shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <Save size={20}/>}
                          Update Database
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};