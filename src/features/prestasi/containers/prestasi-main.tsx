import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// Theme Tokens
const THEME_TOKENS: Record<any, any> = {
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
if (typeof document !== "undefined") {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join("");
}

// Utility: clsx
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Custom useAlert Hook
interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((message: string) => {
    setAlert({ message, isVisible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component
const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess
          ? "border-green-500/30 bg-green-500/10 text-green-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "ml-4",
            isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
          )}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Mini Icons
const Icon = ({ label }: { label: string }) => (
  <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;

// Utility Components
interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Data Interface
interface Prestasi {
  id: number;
  name: string;
  description: string;
  year?: number;
  level?: string;
  organizer?: string;
  imageUrl?: string;
  isActive?: boolean;
}

const DEFAULT_PRESTASI: Prestasi = {
  id: 0,
  name: "",
  description: "",
  year: new Date().getFullYear(),
  level: "NASIONAL",
  organizer: "",
  imageUrl: "",
};

export function Prestasi() {
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([]);
  const [formData, setFormData] = useState<Prestasi>(DEFAULT_PRESTASI);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id; // sesuaikan jika struktur hook berbeda

  const apiBase = "https://be-school.kiraproject.id/prestasi";

  // Fetch semua prestasi berdasarkan schoolId
  const fetchData = async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      const url = `${apiBase}?schoolId=${schoolId}`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error("Format response tidak sesuai");
      }

      setPrestasiList(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat prestasi: ${err.message}`);
      setPrestasiList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
      showAlert("School ID tidak tersedia");
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      if (formData.year) formPayload.append("year", formData.year.toString());
      if (formData.level) formPayload.append("level", formData.level);
      if (formData.organizer) formPayload.append("organizer", formData.organizer);
      formPayload.append("schoolId", schoolId.toString());

      if (selectedFile) {
        formPayload.append("imageUrl", selectedFile); // sesuai backend: req.file
      }

      let res: Response;

      if (editingId) {
        // Update
        res = await fetch(`${apiBase}/${editingId}`, {
          method: "PUT",
          body: formPayload,
        });
      } else {
        // Create
        res = await fetch(apiBase, {
          method: "POST",
          body: formPayload,
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal menyimpan (status ${res.status})`);
      }

      showAlert(editingId ? "Prestasi berhasil diperbarui" : "Prestasi berhasil ditambahkan");

      setFormData(DEFAULT_PRESTASI);
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Prestasi) => {
    setFormData({ ...item });
    setSelectedFile(null);
    setPreviewUrl(item.imageUrl || null);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus prestasi ini?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");

      showAlert("Prestasi berhasil dihapus");
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData(DEFAULT_PRESTASI);
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(DEFAULT_PRESTASI);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 py-4 mb-10">

      <div className="flex justify-start">
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
          disabled={loading}
        >
          <ISave /> Tambah Prestasi
        </button>
      </div>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[99999999999] fixed top-0 right-0" onClose={handleCloseModal}>
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

          <div className="fixed right-0 top-0 h-screen inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="fixed h-screen w-full md:w-[40vw] right-0 top-0 transform rounded-2xl border border-white/20 bg-black/40 p-6 text-left align-middle shadow-xl transition-all backdrop-blur-sm">
                  <Dialog.Title className="mb-4 text-lg font-semibold text-white">
                    {editingId ? "Edit Prestasi" : "Tambah Prestasi"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Nama Prestasi">
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Contoh: Juara 1 Lomba Olimpiade Sains"
                          required
                          disabled={loading}
                        />
                      </Field>

                      <Field label="Tahun">
                        <Input
                          type="number"
                          name="year"
                          value={formData.year ?? ""}
                          onChange={handleInputChange}
                          placeholder="2025"
                          disabled={loading}
                        />
                      </Field>

                      <Field label="Tingkat">
                        <Select name="level" value={formData.level ?? ""} onChange={handleInputChange} disabled={loading}>
                          <option className="text-black" value="">Pilih tingkat</option>
                          <option className="text-black" value="NASIONAL">Nasional</option>
                          <option className="text-black" value="PROVINSI">Provinsi</option>
                          <option className="text-black" value="KOTA/KABUPATEN">Kota/Kabupaten</option>
                          <option className="text-black" value="SEKOLAH">Sekolah</option>
                        </Select>
                      </Field>

                      <Field label="Penyelenggara">
                        <Input
                          name="organizer"
                          value={formData.organizer ?? ""}
                          onChange={handleInputChange}
                          placeholder="Contoh: Kementerian Pendidikan"
                          disabled={loading}
                        />
                      </Field>

                      <Field label="Deskripsi" className="md:col-span-2">
                        <Input
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Jelaskan secara singkat prestasi yang diraih..."
                          disabled={loading}
                        />
                      </Field>

                      <Field label="Upload Gambar" className="md:col-span-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          disabled={loading}
                          className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-600/40 file:text-emerald-100 hover:file:bg-emerald-600/60 file:cursor-pointer cursor-pointer"
                        />
                        <p className="mt-1.5 text-xs text-white/50">Maksimal 5MB • Format: JPG, PNG, WebP</p>
                      </Field>

                      {(previewUrl || formData.imageUrl) && (
                        <div className="md:col-span-2">
                          <Field label="Preview Gambar">
                            <div className="mt-2 overflow-hidden rounded-lg w-max border border-white/20 bg-black/30">
                              <img
                                src={previewUrl || formData.imageUrl}
                                alt="Preview prestasi"
                                className="max-h-40 w-full object-contain"
                              />
                            </div>
                          </Field>
                        </div>
                      )}
                    </div>

                    <div className="relative top-[-40px] w-full grid grid-cols-2 justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 disabled:opacity-50"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                      > 
                        {
                          loading ? <FaSpinner className="animate animate-spin duration-400" />  : <ISave />
                        }
                        {editingId ? "Update Prestasi" : "Simpan Prestasi"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Daftar Prestasi */}
      <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur-sm">

        <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

        {loading && <div className="py-10 text-center text-white/60">Memuat data prestasi...</div>}

        {!loading && prestasiList.length === 0 && (
          <div className="py-10 text-center text-white/60">Belum ada data prestasi untuk sekolah ini.</div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {prestasiList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-white/15 bg-black/30 p-4 sm:items-start sm:justify-between"
            >
              <div className="flex-1 w-full">
                <div className="font-medium text-white">{item.name}</div>
                <div className="mt-1 text-xs text-white/70">
                  {item.level || "—"} • {item.organizer || "—"} • {item.year || "—"}
                </div>
                <div className="w-full h-[200px] overflow-hidden border border-white/70 mt-4 rounded-lg">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-3 text-sm text-white/90">{item.description}</div>
              </div>

              <div className="relative grid grid-cols-2 gap-2 self-start border-t border-white/30 w-full pt-3">
                <button
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-lg text-center justify-center bg-blue-600/30 px-3 py35 text-xs text-blue-200 hover:bg-blue-600/50 disabled:opacity-50"
                >
                  <IEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-lg text-center justify-center bg-red-600/30 px-3 py-3 text-xs text-red-200 hover:bg-red-600/50 disabled:opacity-50"
                >
                  <IDelete /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}