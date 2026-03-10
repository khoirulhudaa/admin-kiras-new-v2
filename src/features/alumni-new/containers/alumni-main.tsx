import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, Edit, Loader, Plus, Trash2, Upload, User, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/alumni";

const THEME = {
  bg: "transparent",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.1)",
  accent: "#2563eb",     // blue-600
  accentHover: "#3b82f6", // blue-500
  text: "#f8fafc",
  textMuted: "#64748b",
  danger: "#ef4444",
};

interface AlertState {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

 interface DisplayConfig {
    year: string;
    batch: string;
    announcementDate: string;
  }

const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
  if (!alert.visible) return null;

  const isSuccess = alert.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
        isSuccess
          ? "border-blue-500/40 bg-blue-600/10 text-blue-100"
          : "border-red-500/40 bg-red-600/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-black">{isSuccess ? "✓" : "✕"}</div>
        <div className="text-sm font-medium tracking-tight">{alert.message}</div>
        <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const AlumniModal = ({
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
    name: "",
    nis: "",
    graduationYear: "",
    description: "",
    batch: "",
    photo: null as File | null,
    preview: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        graduationYear: initialData?.graduationYear ? String(initialData.graduationYear) : "",
        description: initialData?.description || "",
        nis: initialData?.nis || "",
        photo: null,
        preview: initialData?.photoUrl || "",
        batch: initialData?.batch || "",
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

    if (!form.name.trim() || !form.graduationYear.trim()) {
      alert("Nama dan Tahun Kelulusan wajib diisi");
      return;
    }

    if (!/^\d{4}$/.test(form.graduationYear)) {
      alert("Tahun kelulusan harus 4 digit (contoh: 2023)");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    if (!form.nis.trim()) return alert("NIS wajib diisi");

    setSaving(true);

    // Pastikan value diubah ke string dulu sebelum di-trim
    const nameValue = String(form.name || "").trim();
    const yearValue = String(form.graduationYear || "").trim();

    if (!nameValue || !yearValue) {
      alert("Nama dan Tahun Kelulusan wajib diisi");
      return;
    }

    if (!/^\d{4}$/.test(yearValue)) {
      alert("Tahun kelulusan harus 4 digit (contoh: 2023)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("nis", form.nis); 
      formData.append("graduationYear", form.graduationYear);
      formData.append("description", form.description || "");
      formData.append("schoolId", schoolId.toString());
      formData.append("batch", form.batch);

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
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
        onClick={onClose}
      />

      {/* Sidebar Modal */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto z-[100000] flex flex-col"
      >
        <div className="p-10 border-b border-white/8 flex justify-between items-center relative top-0 bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tight text-white">
              {title.includes("Tambah") ? "Tambah" : "Edit"} <span className="text-blue-600">Alumni</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 mt-1">
              Data Alumni Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12 flex-1">
          {/* Foto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-blue-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/90 italic">Foto Alumni</h4>
            </div>

            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
              {(form.preview || initialData?.photoUrl) && (
                <img
                  src={form.preview || initialData?.photoUrl}
                  alt="preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <Upload className="text-blue-500" size={40} />
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  {form.preview ? "Ganti Foto" : "Upload Foto Alumni"}
                </span>
                <span className="text-[10px] text-zinc-500">(jpg / png / webp)</span>
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
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 mx-auto"
              >
                <Trash2 size={14} /> Hapus Foto
              </button>
            )}
          </div>

          {/* Nama */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama lengkap alumni"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Tahun Lulus */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Tahun Kelulusan *
            </label>
            <input
              type="text"
              value={form.graduationYear}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 4) {
                  setForm({ ...form, graduationYear: val });
                }
              }}
              placeholder="Contoh: 2023"
              maxLength={4}
              minLength={4}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono tracking-wide"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Angkatan / Batch
            </label>
            <input
              type="text"
              value={form.batch}
              maxLength={4}
              minLength={4}
              onChange={(e) => {
                // Hanya izinkan angka
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 4) {
                  setForm({ ...form, batch: val });
                }
              }}
              placeholder="Contoh: Angkatan 20 / 2020"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Nomor Induk Siswa (NIS) *
            </label>
            <input
              type="text"
              value={form.nis}
              onChange={(e) => setForm({ ...form, nis: e.target.value })}
              placeholder="Masukkan NIS alumni"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Deskripsi / Prestasi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ceritakan singkat tentang alumni ini (opsional)"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                saving
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {saving ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
              {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// ──────────────────────────────────────────────────────────────
export default function AlumniManager() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const itemsPerPage = 12;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [displayConfig, setDisplayConfig] = useState<DisplayConfig>({ 
    year: "", 
    batch: "", 
    announcementDate: "" 
  });
  const [savingSetting, setSavingSetting] = useState(false);

  const [debouncedBatch, setDebouncedBatch] = useState("");
  const [debouncedYear, setDebouncedYear] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBatch(filterBatch);
      setDebouncedYear(filterYear);
      setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
    }, 500);
    return () => clearTimeout(handler); 
  }, [filterBatch, filterYear]);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
  }, []);

  const fetchAlumni = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        schoolId: schoolId.toString(),
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (debouncedBatch) params.append("batch", debouncedBatch);
      if (debouncedYear) params.append("graduationYear", debouncedYear);
      if (filterStatus === "verified") params.append("isVerified", "true");
      if (filterStatus === "pending") params.append("isVerified", "false");

      const res = await fetch(`${BASE_URL}?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      
      if (json.success) {
        setAlumni(json.data || []);
        if (json.pagination) {
          setPagination({
            totalPages: json.pagination.totalPages,
            totalItems: json.pagination.totalItems,
            hasNextPage: json.pagination.hasNextPage,
            hasPrevPage: json.pagination.hasPrevPage
          });
        }
      }
    } catch (err: any) {
      showAlert("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, debouncedBatch, debouncedYear, filterStatus, currentPage, showAlert]); 

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Logic Fetch Setting (Tetap sama)
  useEffect(() => {
    if (schoolId) {
      fetch(`${BASE_URL}/get-alumni-display/${schoolId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) {
            let formattedDate = "";
            if (json.data.announcementDate) {
              formattedDate = json.data.announcementDate.slice(0, 16);
            }
            setDisplayConfig({
              year: json.data.displayAlumniYear || "",
              batch: json.data.displayAlumniBatch || "",
              announcementDate: formattedDate
            });
          }
        });
    }
  }, [schoolId]);

  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSetting(true);
    try {
      const res = await fetch(`${BASE_URL}/alumni-display`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId,
          year: displayConfig.year,
          batch: displayConfig.batch,
          announcementDate: displayConfig.announcementDate // Dikirim ke backend
        })
      });
      if (res.ok) {
        showAlert("Pengaturan tampilan berhasil diperbarui!");
        setSettingModalOpen(false);
      }
    } catch (err) { showAlert("Gagal menyimpan pengaturan", "error"); }
    finally { setSavingSetting(false); }
  };

  const handleCreate = async (formData: FormData) => {
    const res = await fetch(BASE_URL, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Gagal menambah");
    showAlert("Alumni berhasil ditambahkan!");
    fetchAlumni();
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedAlumni?.id) return;
    const res = await fetch(`${BASE_URL}/${selectedAlumni.id}`, { method: "PUT", body: formData });
    if (!res.ok) throw new Error("Gagal update");
    showAlert("Alumni berhasil diperbarui!");
    fetchAlumni();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      showAlert("Alumni berhasil dihapus");
      fetchAlumni();
    } catch (err: any) {
      showAlert("Gagal menghapus", "error");
    } finally { setDeletingId(null); }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Gagal verifikasi");
      showAlert("Alumni berhasil diverifikasi!");
      fetchAlumni();
    } catch (err: any) { showAlert("Gagal verifikasi", "error"); }
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: THEME.bg, color: THEME.text }}>
      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {/* Header */}
      <div className="pb-10 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Award size={14} /> Alumni Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Daftar <span className="text-blue-600">Alumni</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Total: {pagination.totalItems} Data Terdaftar</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setSettingModalOpen(true)} className="h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm transition-all text-zinc-400 hover:text-white">
            <Edit size={18} /> Settings
          </button>
          <button onClick={() => { setSelectedAlumni(null); setAddModalOpen(true); }} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all">
            <Plus size={18} /> Tambah Alumni
          </button>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="w-full grid grid-cols-3 text-center gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10">
        {[
          { id: "all", label: "Semua" },
          { id: "pending", label: "Tertunda" },
          { id: "verified", label: "Verifikasi" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => { setFilterStatus(tab.id as any); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-xl text-[10px] justify-center font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterStatus === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Cari Angkatan..." value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-xs text-white focus:border-blue-500 outline-none transition-all" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Cari Tahun Lulus..." value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-xs text-white focus:border-blue-500 outline-none transition-all" />
        </div>
        {(filterYear !== debouncedYear || filterBatch !== debouncedBatch) && (
          <Loader className="animate-spin text-zinc-500" size={14} />
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Memuat data...</div>
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center py-32 text-zinc-500 italic text-lg">Data tidak ditemukan</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {alumni.map((al, i) => (
              <motion.div key={al.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                <div className="flex gap-4 items-start">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    {al.photoUrl ? <img src={al.photoUrl} alt={al.name} className="h-full w-full object-cover rounded-xl border border-white/10" /> : <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-600"><User size={32} /></div>}
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <h3 className="text-lg w-full truncate font-bold pr-12">{al.name}</h3>
                    <div className="flex flex-col items-start gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-mono w-full truncate">NIS: {al.nis || "—"}</span>
                      <span className="text-[10px] text-white font-black uppercase tracking-tighter">Batch {al.batch}</span>
                      <span className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Class of {al.graduationYear}</span>
                    </div>
                  </div>
                </div>
                <p className="w-full truncate text-xs text-zinc-400 mt-2 line-clamp-2 leading-snug">Note: {al.description || "No description provided."}</p>
                <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`py-1.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider ${al.isVerified ? "border border-blue-700 text-blue-400" : "border border-yellow-700 text-yellow-400"}`}>{al.isVerified ? "Verified" : "Pending"}</div>
                    {!al.isVerified && <button onClick={() => handleApprove(al.id)} className="py-1.5 pr-3 pl-2 rounded-lg bg-green-700 hover:bg-green-800 text-white flex items-center gap-1.5 text-[9px] font-bold uppercase transition-all"><Plus size={14} /> Approve</button>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedAlumni(al); setEditModalOpen(true); }} className="p-2 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 text-blue-300 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(al.id)} disabled={deletingId === al.id} className="p-2 rounded-lg bg-red-900/60 hover:bg-red-800/80 text-red-300 transition-colors">{deletingId === al.id ? <Loader className="animate-spin" size={16} /> : <Trash2 size={16} />}</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Menampilkan <span className="text-white">{alumni.length}</span> dari <span className="text-white">{pagination.totalItems}</span> Alumni
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-11 w-11 rounded-xl text-xs font-black transition-all ${
                      currentPage === page 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals tetap menggunakan kode lama Anda */}
      <AlumniModal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Tambah Alumni Baru" onSubmit={handleCreate} schoolId={schoolId} />
      <AlumniModal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Data Alumni" initialData={selectedAlumni} onSubmit={handleUpdate} schoolId={schoolId} />
      
      {/* Setting Modal UI */}
      <AnimatePresence>
        {settingModalOpen && (
          <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 overflow-y-auto backdrop-blur-sm z-[100001]" onClick={() => setSettingModalOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 220 }} className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0B1220] border-l overflow-y-auto border-white/10 shadow-2xl z-[100002] flex flex-col">
              <div className="p-10 border-b border-white/8 flex justify-between items-center">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Display <span className="text-blue-600">Settings</span></h3>
                <button onClick={() => setSettingModalOpen(false)} className="p-2 text-zinc-500 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleSaveSetting} className="p-10 space-y-8 flex-1">
                  {/* Input Tahun */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                      Tahun Lulus Utama
                    </label>
                    <input 
                      type="text" 
                      maxLength={4} 
                      placeholder="Contoh: 2024"
                      value={displayConfig.year}
                      onChange={(e) => setDisplayConfig({...displayConfig, year: e.target.value.replace(/\D/g, "")})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Input Batch */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                      Angkatan / Batch Utama
                    </label>
                    <input 
                      type="text" 
                      maxLength={4} 
                      placeholder="Contoh: 2021"
                      value={displayConfig.batch}
                      onChange={(e) => setDisplayConfig({...displayConfig, batch: e.target.value.replace(/\D/g, "")})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                    <p className="text-[11px] text-blue-400 leading-relaxed italic">
                      * Pengaturan ini menentukan data alumni mana yang akan muncul di halaman depan website sekolah secara default.
                    </p>
                  </div>

                  {/* INPUT ANNOUNCEMENT DATE (INI YANG ANDA CARI) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                      Tanggal & Waktu Launching
                    </label>
                    <input 
                      type="datetime-local" 
                      value={displayConfig.announcementDate}
                      onChange={(e) => setDisplayConfig({...displayConfig, announcementDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                    <p className="text-[9px] text-zinc-500 italic">* Kosongkan jika ingin langsung dipublikasikan</p>
                  </div>

                  {/* Tombol Submit */}
                  <button
                    type="submit"
                    disabled={savingSetting || (!displayConfig.year && !displayConfig.batch)}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                      savingSetting || (!displayConfig.year && !displayConfig.batch)
                        ? "bg-slate-500 text-slate-400 cursor-not-allowed border border-white/5"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
                    }`}
                  >
                    {savingSetting ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}