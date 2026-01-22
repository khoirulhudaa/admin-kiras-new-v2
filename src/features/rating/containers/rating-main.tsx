import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Theme Tokens
const THEME_TOKENS = {
  smkn13: {
    '--brand-primary': '#10b981',
    '--brand-primaryText': '#ffffff',
    '--brand-accent': '#f59e0b',
    '--brand-bg': '#0a0a0a',
    '--brand-surface': 'rgba(24,24,27,0.8)',
    '--brand-surfaceText': '#f3f4f6',
    '--brand-subtle': '#27272a',
    '--brand-pop': '#3b82f6',
  },
};

// Utility: clsx
const clsx = (...args) => args.filter(Boolean).join(' ');

// Mini Icons
const Icon = ({ label }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: 'inline-flex', justifyContent: 'center' }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;
const ISpinner = () => (
  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
);

// Utility Components
const Field = ({ label, hint, children, className }) => (
  <label className={clsx('block', className)}>
    {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
      className
    )}
  />
);

const TextArea = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
      className
    )}
  />
);

// Custom useAlert Hook
const useAlert = () => {
  const [alert, setAlert] = useState({ message: '', isVisible: false });

  const showAlert = useCallback((message) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: '', isVisible: false }), 5000);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: '', isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component
const Alert = ({ message, onClose }) => {
  const isSuccess = message.includes('successfully');
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        'mb-4 rounded-xl border p-4 text-sm',
        isSuccess
          ? 'border-green-500/30 bg-green-500/10 text-green-300'
          : 'border-red-500/30 bg-red-500/10 text-red-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            'ml-4',
            isSuccess ? 'text-green-300 hover:text-green-400' : 'text-red-300 hover:text-red-400'
          )}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Data Interface
const Rating = () => ({
  id: null,
  rating: 5,
  saran: '',
});

// API URL
const API_URL = 'https://dev.kiraproject.id/api/ratings';

export const RatingMain = () => {
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
  const { alert, showAlert, hideAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRating, setEditingRating] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch ratings (GET)
  const fetchRatings = async () => {
    if (!token) {
      showAlert('Token autentikasi tidak ditemukan. Silakan login.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
        params: { t: new Date().getTime() },
      });
      setRatings(response.data.ratings);
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      showAlert('Gagal memuat data rating');
    } finally {
      setLoading(false);
    }
  };

  // Update rating (PUT)
  const updateRating = async (id, ratingData) => {
    try {
      await axios.put(`${API_URL}/${id}`, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchRatings();
      showAlert('Rating updated successfully');
    } catch (err) {
      console.error('Error updating rating:', err);
      showAlert('Gagal memperbarui rating');
      throw err;
    }
  };

  // Delete rating (DELETE)
  const deleteRating = async (id) => {
    setDeleteLoadingIds((prev) => [...prev, id]);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchRatings();
      showAlert('Rating deleted successfully');
    } catch (err) {
      console.error('Error deleting rating:', err);
      showAlert('Gagal menghapus rating');
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  // Fetch ratings on mount
  useEffect(() => {
    fetchRatings();
  }, []);

  // Handle editing existing rating
  const startEditing = (rating) => {
    setEditingRating({ ...rating });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditingRating((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingRating.rating || !editingRating.saran) {
      showAlert('Rating dan saran harus diisi');
      return;
    }
    setLoading(true);
    try {
      await updateRating(editingRating.id, {
        rating: editingRating.rating,
        saran: editingRating.saran,
      });
      setIsModalOpen(false);
      setEditingRating(null);
    } catch (err) {
      // Errors are handled in updateRating
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRating(null);
  };

  // Chart data
  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Jumlah Rating',
        data: summary
          ? [
              summary.stats.rating_1,
              summary.stats.rating_2,
              summary.stats.rating_3,
              summary.stats.rating_4,
              summary.stats.rating_5,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.5)', // Using brand-primary with opacity
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#ffffff' },
      },
      title: {
        display: true,
        text: 'Distribusi Rating',
        color: '#ffffff',
        font: { size: 14 },
      },
    },
    scales: {
      x: { ticks: { color: '#ffffff' } },
      y: {
        ticks: { color: '#ffffff' },
        beginAtZero: true,
        title: { display: true, text: 'Jumlah', color: '#ffffff' },
      },
    },
  };

  return (
    <div className="min-h-screen py-6" style={THEME_TOKENS.smkn13}>
      {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
  <div className="w-full rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 mb-6 shadow-lg">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">Statistik Rating</h2>
  </div>
  {summary ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <div className="mb-4 h-1/2 rounded-xl flex flex-col justify-center bg-white/10 p-4">
          <p className="text-sm font-medium text-white/70">Rata-rata Rating</p>
          <p className="text-[40px] font-bold text-emerald-400">{summary.average_rating.toFixed(1)}</p>
        </div>
        <div className="rounded-xl h-1/2 flex flex-col justify-center bg-white/10 p-4">
          <p className="text-sm font-medium text-white/70">Total Rating</p>
          <p className="text-[40px] font-bold text-emerald-400">{summary.total_ratings}</p>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <Bar
          data={chartData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
            plugins: {
              ...chartOptions.plugins,
              title: {
                ...chartOptions.plugins.title,
                font: { size: 16, weight: 'bold' },
                padding: { top: 10, bottom: 20 },
              },
              legend: {
                ...chartOptions.plugins.legend,
                labels: { font: { size: 12 }, color: '#ffffff', padding: 15 },
              },
            },
            scales: {
              x: {
                ...chartOptions.scales.x,
                grid: { display: false },
                ticks: { font: { size: 12 }, color: '#ffffff' },
              },
              y: {
                ...chartOptions.scales.y,
                grid: { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.05)' },
                ticks: { font: { size: 12 }, color: '#ffffff', stepSize: 1 },
              },
            },
          }}
        />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-[300px] text-white/50">
      Tidak ada data statistik untuk ditampilkan
    </div>
  )}
</div>
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Daftar Rating</div>
        </div>
        <div className="overflow-x-auto">
          {loading && !isModalOpen && (
            <div className="flex justify-center py-4">
              <ISpinner />
            </div>
          )}
          {!loading && (
            <table className="min-w-full border-collapse border border-white/20">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Email</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Rating</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Saran</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Tanggal</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id} className="border-b border-white/20">
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.email}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.rating}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{rating.saran}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(rating)}
                          disabled={loading || deleteLoadingIds.includes(rating.id)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
                        >
                          <IEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRating(rating.id)}
                          disabled={loading || deleteLoadingIds.includes(rating.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
                        >
                          {deleteLoadingIds.includes(rating.id) ? <ISpinner /> : <><IDelete /> Hapus</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
                      Tidak ada data rating
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Form */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <Transition.Child
            as={React.Fragment}
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
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                  <Dialog.Title className="mb-3 text-sm font-semibold text-white">
                    Edit Rating
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Rating">
                      <select
                        value={editingRating?.rating || 5}
                        onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                        disabled={loading}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <option className='text-black' key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Saran">
                      <TextArea
                        value={editingRating?.saran || ''}
                        onChange={(e) => handleInputChange('saran', e.target.value)}
                        placeholder="Masukkan saran"
                        disabled={loading}
                        rows={4}
                      />
                    </Field>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
                        disabled={loading}
                      >
                        {loading ? <ISpinner /> : <ISave />} Update
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};