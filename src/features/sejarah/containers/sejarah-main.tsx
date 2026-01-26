import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Theme (sama seperti contoh program)
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

const BASE_URL = "https://be-school.kiraproject.id";

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

// Simple Input & TextArea
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
  />
);

const TextArea = (props: any) => (
  <textarea
    {...props}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none resize-y min-h-[100px]"
  />
);

// Modal untuk Edit/Create Sejarah (karena hanya 1 record per school, lebih ke "edit data sejarah")
const SejarahModal = ({
  open,
  onClose,
  initialData = {},
  onSubmit,
  isNew,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isNew: boolean;
}) => {
  const [form, setForm] = useState({
    deskripsi: initialData?.deskripsi || "",
    tahunBerdiri: initialData?.tahunBerdiri || "",
    jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
    timeline: initialData?.timeline || [],
    daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kepsekFiles, setKepsekFiles] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      setForm({
        deskripsi: initialData?.deskripsi || "",
        tahunBerdiri: initialData?.tahunBerdiri || "",
        jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
        timeline: initialData?.timeline || [],
        daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
      });
      setKepsekFiles([]);
    }
  }, [open, initialData]);

  const addTimeline = () => {
    setForm((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: "", title: "", deskripsi: "" }],
    }));
  };

  const updateTimeline = (index: number, field: string, value: string) => {
    const newTimeline = [...form.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setForm((prev) => ({ ...prev, timeline: newTimeline }));
  };

  const removeTimeline = (index: number) => {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const addKepsek = () => {
    setForm((prev) => ({
      ...prev,
      daftarKepalaSekolah: [...prev.daftarKepalaSekolah, { nama: "", tahunKerja: "" }],
    }));
    setKepsekFiles((prev) => [...prev, null as any]); // placeholder
  };

  const updateKepsek = (index: number, field: string, value: string) => {
    const newKepsek = [...form.daftarKepalaSekolah];
    newKepsek[index] = { ...newKepsek[index], [field]: value };
    setForm((prev) => ({ ...prev, daftarKepalaSekolah: newKepsek }));
  };

  const removeKepsek = (index: number) => {
    setForm((prev) => ({
      ...prev,
      daftarKepalaSekolah: prev.daftarKepalaSekolah.filter((_, i) => i !== index),
    }));
    setKepsekFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles: any = [...kepsekFiles];
    newFiles[index] = file;
    setKepsekFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.deskripsi.trim() || !form.tahunBerdiri) {
      alert("Deskripsi dan Tahun Berdiri wajib diisi");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("deskripsi", form.deskripsi);
    formData.append("tahunBerdiri", form.tahunBerdiri);
    formData.append("jumlahKompetensiKeahlian", form.jumlahKompetensiKeahlian || "0");
    formData.append("timeline", JSON.stringify(form.timeline));
    formData.append("daftarKepalaSekolah", JSON.stringify(form.daftarKepalaSekolah));

    // Kirim foto hanya yang diubah + index-nya
    kepsekFiles.forEach((file, index) => {
      if (file) {
        formData.append("kepalaPhotos", file);
        formData.append("photoIndices", index.toString()); // penting: kirim index kepsek yang di-update
      }
    });

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[99999999] p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/70 absolute top-0 right-0 z-[999999] w-full max-w-xl border border-white/10 h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center relative top-0 z[999999]">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? "Buat Sejarah Sekolah" : "Edit Sejarah Sekolah"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Info Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tahun Berdiri *
              </label>
              <Input
                type="number"
                value={form.tahunBerdiri}
                onChange={(e) => setForm({ ...form, tahunBerdiri: e.target.value })}
                placeholder="1976"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Jumlah Kompetensi Keahlian
              </label>
              <Input
                type="number"
                value={form.jumlahKompetensiKeahlian}
                onChange={(e) => setForm({ ...form, jumlahKompetensiKeahlian: e.target.value })}
                placeholder="8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Deskripsi Sekolah *
            </label>
            <TextArea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Ceritakan sejarah singkat sekolah..."
              required
              rows={5}
            />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/80">Timeline Sejarah</label>
              <button
                type="button"
                onClick={addTimeline}
                className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
              >
                <Plus size={14} /> Tambah Tahun
              </button>
            </div>

            {form.timeline.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={item.year}
                    onChange={(e) => updateTimeline(idx, "year", e.target.value)}
                    placeholder="Tahun (contoh: 1976)"
                  />
                  <Input
                    value={item.title}
                    onChange={(e) => updateTimeline(idx, "title", e.target.value)}
                    placeholder="Judul peristiwa"
                  />
                </div>
                <TextArea
                  value={item.deskripsi}
                  onChange={(e) => updateTimeline(idx, "deskripsi", e.target.value)}
                  placeholder="Deskripsi peristiwa..."
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeTimeline(idx)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          {/* Daftar Kepala Sekolah */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/80">Daftar Kepala Sekolah</label>
              <button
                type="button"
                onClick={addKepsek}
                className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
              >
                <Plus size={14} /> Tambah Kepsek
              </button>
            </div>

            {form.daftarKepalaSekolah.map((kepsek: any, idx: number) => (
              <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={kepsek.nama}
                    onChange={(e) => updateKepsek(idx, "nama", e.target.value)}
                    placeholder="Nama Kepala Sekolah"
                  />
                  <Input
                    value={kepsek.tahunKerja}
                    onChange={(e) => updateKepsek(idx, "tahunKerja", e.target.value)}
                    placeholder="Periode (contoh: 2015 - 2020)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1">Foto</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileChange(idx, e.target.files[0]);
                      }}
                      className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/50"
                    />
                    {kepsek.fotoUrl && !kepsekFiles[idx] && (
                      <img
                        src={`${kepsek.fotoUrl}`}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeKepsek(idx)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Hapus
                </button>
                
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
              disabled={isSubmitting}  // ← optional: disable saat loading
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 text-white rounded-xl flex items-center gap-2 transition-opacity ${
                isSubmitting
                  ? "bg-blue-700/70 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan Sejarah
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
export default function Sejarah() {
  const [sejarah, setSejarah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const dataSchool: any = useSchool();
  const SCHOOL_ID = dataSchool?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
  }, []);

  const fetchSejarah = useCallback(async () => {
    if (!SCHOOL_ID) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/sejarah?schoolId=${SCHOOL_ID}`);
      if (!res.ok) throw new Error("Gagal memuat sejarah");

      const json = await res.json();
      if (json.success && json.data) {
        setSejarah(json.data);
      } else {
        setSejarah(null); // Belum ada data → tampilkan tombol buat baru
      }
    } catch (err: any) {
      showAlert("Gagal memuat sejarah: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [SCHOOL_ID, showAlert]);

  useEffect(() => {
    fetchSejarah();
  }, [fetchSejarah]);

  const handleSave = async (formData: FormData) => {
    formData.append("schoolId", SCHOOL_ID?.toString() || "");

    const url = sejarah ? `${BASE_URL}/sejarah/${sejarah.id}` : `${BASE_URL}/sejarah`;
    const method = sejarah ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        // JANGAN set Content-Type → biar browser set multipart/form-data otomatis
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menyimpan sejarah");
    }

    showAlert("Sejarah sekolah berhasil disimpan!");
    fetchSejarah();
  };

  const handleDelete = async () => {
    if (!sejarah?.id || !confirm("Yakin ingin menghapus sejarah sekolah ini?")) return;

    const res = await fetch(`${BASE_URL}/sejarah/${sejarah.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menghapus");
    }

    showAlert("Sejarah sekolah berhasil dihapus");
    setSejarah(null);
    fetchSejarah();
  };

   const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
        {label}
    </span>
    );
    const ISave = () => <Icon label="💾" />;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <header className="flex justify-between items-center my-4 mb-6">
        {/* <h1 className="text-2xl font-bold">Sejarah Sekolah</h1> */}

        {sejarah ? (
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
            >
              <ISave /> Perbarui Sejarah
            </button>
            {/* <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
            >
              <Trash2 size={16} /> Hapus
            </button> */}
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
          >
            <ISave /> Buat Sejarah Sekolah
          </button>
        )}
      </header>

      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : !sejarah ? (
        <div className="text-center py-20 text-gray-400">
          Belum ada data sejarah sekolah. Klik tombol di atas untuk membuat.
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-8">
          <div className="grid grid-cols-1 border-b border-white/20 pb-4 md:grid-cols-3 gap-6">
            <div className="border-r border-white/20 pr-4">
              <h3 className="text-sm text-white/70">Tahun Berdiri</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.tahunBerdiri}</p>
            </div>
            <div className="border-r border-white/20 pl-5">
              <h3 className="text-sm text-white/70">Jumlah Kepala Sekolah</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.jumlahKepalaSekolah}</p>
            </div>
            <div>
              <h3 className="text-sm text-white/70">Kompetensi Keahlian</h3>
              <p className="text-xl font-semibold mt-1">{sejarah.jumlahKompetensiKeahlian}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
            <p className="text-white/80 whitespace-pre-line">{sejarah.deskripsi}</p>
          </div>

          {sejarah.timeline?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline Sejarah</h3>
              <div className="space-y-6">
                {sejarah.timeline.map((item: any, i: number) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-blue-400">{item.year}</span>
                      <h4 className="text-lg font-medium">{item.title}</h4>
                    </div>
                    <p className="mt-2 text-white/80">{item.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sejarah.daftarKepalaSekolah?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Daftar Kepala Sekolah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sejarah.daftarKepalaSekolah.map((k: any, i: number) => (
                  <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/10">
                    {k.fotoUrl && (
                    <img
                      src={`${k.fotoUrl}`}
                      alt={k.nama}
                      className="w-24  h-24   object-cover rounded-full mx-auto mb-3 border-2 border-blue-500/30"
                    />
                    )}
                    <h4 className="text-center font-medium">{k.nama}</h4>
                    <p className="text-center text-sm text-white/60 mt-1">{k.tahunKerja}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SejarahModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={sejarah || {}}
        onSubmit={handleSave}
        isNew={!sejarah}
      />
    </div>
  );
}