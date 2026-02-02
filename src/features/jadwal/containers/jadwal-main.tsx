import { Edit, Trash2, X, Plus, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/features/schools";

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

const BASE_URL = "https://be-school.kiraproject.id/jadwal";

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
      className={`mb-6 p-4 rounded-xl border ${alert.type === "success"
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

const JadwalModal = ({
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
  onSubmit: (data: any) => Promise<void>;
  schoolId: number | null;
}) => {
  const [form, setForm] = useState({
    day: initialData?.day || "SENIN",
    startTime: initialData?.startTime || "07:00",
    endTime: initialData?.endTime || "07:45",
    subject: initialData?.subject || "",
    className: initialData?.className || "",
    teacher: initialData?.teacher || "",
    room: initialData?.room || "",
    description: initialData?.description || "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        day: initialData?.day || "SENIN",
        startTime: initialData?.startTime || "07:00",
        endTime: initialData?.endTime || "07:45",
        subject: initialData?.subject || "",
        className: initialData?.className || "",
        teacher: initialData?.teacher || "",
        room: initialData?.room || "",
        description: initialData?.description || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.day || !form.startTime || !form.endTime || !form.subject || !form.className) {
      alert("Hari, Jam Mulai, Jam Selesai, Mata Pelajaran, dan Kelas wajib diisi");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form, schoolId };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-[#111827] border border-gray-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#111827] z-10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hari *</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="SENIN">SENIN</option>
              <option value="SELASA">SELASA</option>
              <option value="RABU">RABU</option>
              <option value="KAMIS">KAMIS</option>
              <option value="JUMAT">JUMAT</option>
              <option value="SABTU">SABTU</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Jam Mulai *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Jam Selesai *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mata Pelajaran *</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Matematika, Bahasa Indonesia, dll"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kelas *</label>
            <input
              type="text"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              placeholder="X IPA 1, XI IPS 2, XII TKJ, dll"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Guru</label>
            <input
              type="text"
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              placeholder="Nama guru (opsional)"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ruangan</label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="Ruang 101, Lab IPA, dll (opsional)"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Keterangan</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <ISave />}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Helper untuk mengelompokkan jadwal per hari
const groupByDay = (schedules: any[]) => {
  const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  const grouped: Record<string, any[]> = {};

  daysOrder.forEach((day) => {
    grouped[day] = [];
  });

  schedules.forEach((sch) => {
    if (grouped[sch.day]) {
      grouped[sch.day].push(sch);
    }
  });

  return grouped;
};

export default function Jadwal() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  // ── State untuk filter kelas ──
  const [selectedClass, setSelectedClass] = useState<string>(""); // "" = semua kelas

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 6000);
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();
      if (json.success) {
        setSchedules(json.data || []);
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert("Gagal memuat jadwal: " + (err.message || "Unknown error"), "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ── Daftar unik kelas untuk dropdown ──
  const uniqueClasses = Array.from(
    new Set(schedules.map((sch) => sch.className?.trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // ── Jadwal yang sudah difilter ──
  const filteredSchedules = selectedClass
    ? schedules.filter((sch) => sch.className?.trim() === selectedClass)
    : schedules;

  const groupedSchedules = groupByDay(filteredSchedules);

  const handleCreate = async (payload: any) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal menambah jadwal");
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal menambah jadwal");

    showAlert("Jadwal berhasil ditambahkan!");
    fetchSchedules();
  };

  const handleUpdate = async (payload: any) => {
    if (!selectedSchedule?.id) return;

    const res = await fetch(`${BASE_URL}/${selectedSchedule.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal memperbarui jadwal");
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal memperbarui jadwal");

    showAlert("Jadwal berhasil diperbarui!");
    fetchSchedules();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal menghapus");
      }

      showAlert("Jadwal berhasil dihapus!");
      fetchSchedules();
    } catch (err: any) {
      showAlert("Gagal menghapus: " + (err.message || "Unknown error"), "error");
    }
  };

  const resetFilter = () => setSelectedClass("");

  const DayHeader = ({ day }: { day: string }) => (
    <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 py-3 bg-gradient-to-r from-blue-900/40 to-teal-900/30 rounded-lg border-l-4 border-blue-500">
      {day}
    </h2>
  );

  const EmptyDay = () => (
    <div className="text-center py-10 text-gray-500 italic bg-gray-900/30 rounded-xl border border-white/20">
      Belum ada jadwal pelajaran untuk hari ini
    </div>
  );

  const DayTable = ({ day, items }: { day: string; items: any[] }) => (
    <div className="mb-12">
      <DayHeader day={day} />
      {items.length === 0 ? (
        <EmptyDay />
      ) : (
        <div className="overflow-x-auto rounded-xl overflow-hidden border border-white/20">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-300 w-28">Jam</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-300">Mata Pelajaran</th>
                {/* <th className="px-5 py-3 text-left text-sm font-medium text-gray-300 w-32">Kelas</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-300">Guru</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-300">Ruang</th> */}
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-300 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((sch) => (
                  <tr key={sch.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-200">
                      {sch.startTime} – {sch.endTime}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{sch.subject}</td>
                    {/* <td className="px-5 py-3.5">{sch.className}</td>
                    <td className="px-5 py-3.5 text-gray-300">{sch.teacher || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-300">{sch.room || "—"}</td> */}
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSchedule(sch);
                            setEditModalOpen(true);
                          }}
                          className="p-2 bg-blue-900/60 hover:bg-blue-800/80 rounded-lg text-blue-300 transition-colors"
                          title="Edit jadwal"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sch.id)}
                          className="p-2 bg-red-900/60 hover:bg-red-800/80 rounded-lg text-red-300 transition-colors"
                          title="Hapus jadwal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;

  return (
    <div className="min-h-screen py-3.5" style={{ background: THEME.bg, color: THEME.text }}>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">

          {/* Tombol Tambah Jadwal */}
          <button
            onClick={() => {
              setSelectedSchedule(null);
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium shadow-lg transition-all hover:shadow-blue-500/30"
          >
            <ISave /> Tambah Jadwal
          </button>

          {/* Filter Kelas */}
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none min-w-[160px]"
            >
              <option value="">Semua Kelas</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter (hanya tampil jika filter aktif) */}
          {selectedClass && (
            <button
              onClick={resetFilter}
              className="text-sm text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="animate-spin h-14 w-14 text-blue-500" />
        </div>
      ) : (
        <>
          {/* Pesan jika tidak ada data setelah filter */}
          {selectedClass && filteredSchedules.length === 0 && (
            <div className="bg-amber-900/30 border border-amber-700/50 text-amber-300 p-4 rounded-xl mb-8 text-center">
              Tidak ada jadwal yang ditemukan untuk kelas <strong>{selectedClass}</strong>
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 bg-white/5 p-6 rounded-xl">
            {(["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"] as const).map((day) => (
              <DayTable key={day} day={day} items={groupedSchedules[day] || []} />
            ))}
          </div>
        </>
      )}

      {/* Modal Tambah */}
      <JadwalModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Jadwal Baru"
        onSubmit={handleCreate}
        schoolId={schoolId}
      />

      {/* Modal Edit */}
      <JadwalModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Jadwal"
        initialData={selectedSchedule}
        onSubmit={handleUpdate}
        schoolId={schoolId}
      />
    </div>
  );
}