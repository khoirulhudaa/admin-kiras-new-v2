import { Edit, Trash2, X, Plus, Save, Upload, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/features/schools";

// ──────────────────────────────────────────────────────────────
// Theme (sama seperti referensi alumni)
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

const BASE_URL = "https://be-school.kiraproject.id/kalender";

// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Modal Form Kalender Event (Create / Update)
const KalenderModal = ({
  open,
  onClose,
  title,
  initialData = {},
  onSubmit,
  schoolId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  schoolId: number | null;
}) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    category: "Akademik",
    description: "",
    location: "",
    photo: null as File | null,
    preview: "",
  });

  const [saving, setSaving] = useState(false);

  // Reset form hanya saat modal dibuka
  useEffect(() => {
    if (open) {
      setForm({
        title: initialData?.title || "",
        date: initialData?.date || "",
        category: initialData?.category || "Akademik",
        description: initialData?.description || "",
        location: initialData?.location || "",
        photo: null,
        preview: initialData?.photoUrl || "",
      });
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        photo: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.date.trim() || !form.category.trim()) {
      alert("Judul, Tanggal, dan Kategori wajib diisi");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
      alert("Format tanggal harus YYYY-MM-DD");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("schoolId", schoolId.toString());

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="absolute top-0 right-0 bg-black/70 border border-gray-500/30 rounded-2xl w-full max-w-md z-[999999] overflow-auto h-screen"
      >
        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {form.preview && (
            <div className="flex justify-center">
              <img
                src={form.preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Foto / Poster
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex-1">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-gray-600 rounded-lg hover:bg-gray-700">
                  <Upload size={18} />
                  <span className="truncate max-w-[200px]">
                    {form.photo ? form.photo.name : "Pilih foto..."}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {form.preview && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, photo: null, preview: "" }))}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Judul Kegiatan *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Upacara Bendera"
              required
              className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kategori *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option className="text-black" value="Akademik">Akademik</option>
              <option className="text-black" value="Kesiswaan">Kesiswaan</option>
              <option className="text-black" value="Hari Besar">Hari Besar</option>
              <option className="text-black" value="Lomba">Lomba</option>
              <option className="text-black" value="Upacara">Upacara</option>
              <option className="text-black" value="Libur">Libur</option>
              <option className="text-black" value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detail kegiatan..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Contoh: Halaman Upacara Sekolah"
              className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Main Component: KalenderManager
export default function Kalender() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 6000);
  }, []);

  const fetchEvents = useCallback(async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan. Pastikan data sekolah sudah dimuat.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        setEvents(json.data || []);
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert("Gagal memuat data kalender: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async (formData: FormData) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || "Gagal menambah kegiatan");
    }

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Gagal menambah kegiatan");
    }

    showAlert("Kegiatan berhasil ditambahkan!");
    fetchEvents();
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedEvent?.id) return;

    const res = await fetch(`${BASE_URL}/${selectedEvent.id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || "Gagal memperbarui kegiatan");
    }

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Gagal memperbarui kegiatan");
    }

    showAlert("Kegiatan berhasil diperbarui!");
    fetchEvents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Gagal menghapus kegiatan");
      }

      showAlert("Kegiatan berhasil dihapus");
      fetchEvents();
    } catch (err: any) {
      showAlert("Gagal menghapus: " + err.message, "error");
    }
  };

  const Icon = ({ label }: { label: string }) => (
    <span
      aria-hidden
      className="inline-block align-middle select-none"
      style={{ width: 16 }}
    >
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;


  return (
    <div className="min-h-screen py-4" style={{ background: THEME.bg, color: THEME.text }}>
      <header className="flex justify-between items-center mb-5">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold shadow-md transition-colors"
        >
          <ISave /> Tambah Kegiatan
        </button>
      </header>

      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Belum ada kegiatan untuk sekolah ini
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/5 rounded-2xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Foto</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Judul</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Lokasi</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/10/30 transition-colors">
                  <td className="px-6 py-4">
                    {ev.photoUrl ? (
                      <img
                        src={ev.photoUrl}
                        alt={ev.title}
                        className="w-12 h-12 object-cover rounded-full border border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                        No Photo
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{ev.title}</td>
                  <td className="px-6 py-4">{ev.date}</td>
                  <td className="px-6 py-4">{ev.category}</td>
                  <td className="px-6 py-4 text-gray-300 truncate max-w-xs">
                    {ev.location || <span className="opacity-50">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedEvent(ev);
                          setEditModalOpen(true);
                        }}
                        className="p-2 bg-blue-900/40 hover:bg-blue-800/60 rounded-lg text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-2 bg-red-900/40 hover:bg-red-800/60 rounded-lg text-red-300 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah */}
      <KalenderModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Kegiatan Baru"
        onSubmit={handleCreate}
        schoolId={schoolId}
      />

      {/* Modal Edit */}
      <KalenderModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Kegiatan"
        initialData={selectedEvent}
        onSubmit={handleUpdate}
        schoolId={schoolId}
      />
    </div>
  );
}