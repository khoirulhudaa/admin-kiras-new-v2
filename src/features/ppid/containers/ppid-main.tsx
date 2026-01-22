import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// Theme Tokens (tetap dipertahankan)
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

if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join('');
}

const clsx = (...args) => args.filter(Boolean).join(" ");

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const showAlert = useCallback((message) => {
    setAlert({ message, isVisible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.includes("successfully");

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

const Icon = ({ label }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;
const IAdd = () => <Icon label="➕" />;

const Field = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const TextArea = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const Select = ({ className, ...props }) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const DEFAULT_DOCUMENT = {
  title: "",
  category: "",
  description: "",
  publishedDate: "",
  documentUrl: "",
};

export function PPIDMain() {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_DOCUMENT);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const BASE_URL = "https://be-school.kiraproject.id/ppid";
  const SCHOOL_ID = 88;

  const getToken = () => localStorage.getItem("token");

  const getHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal memuat dokumen PPID");
      }
      const result = await response.json();
      if (result.success) {
        setDocuments(result.data || []);
      } else {
        throw new Error(result.message || "Response tidak valid");
      }
    } catch (err) {
      showAlert(`Gagal memuat dokumen: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description || "",
        publishedDate: formData.publishedDate || "",
        documentUrl: formData.documentUrl || "",
        schoolId: SCHOOL_ID,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${BASE_URL}/${editingId}` : BASE_URL;

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Gagal ${editingId ? "update" : "tambah"} dokumen`);
      }

      const result = await response.json();
      if (result.success) {
        showAlert(`Dokumen berhasil ${editingId ? "diperbarui" : "ditambahkan"}`);
        setFormData(DEFAULT_DOCUMENT);
        setEditingId(null);
        setIsModalOpen(false);
        await fetchDocuments();
      } else {
        throw new Error(result.message || "Response tidak valid");
      }
    } catch (err) {
      showAlert(`Gagal menyimpan dokumen: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal menghapus dokumen");
      }

      const result = await response.json();
      if (result.success) {
        showAlert("Dokumen berhasil dihapus");
        await fetchDocuments();
      } else {
        throw new Error(result.message || "Response tidak valid");
      }
    } catch (err) {
      showAlert(`Gagal menghapus: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        title: item.title || "",
        category: item.category || "",
        description: item.description || "",
        publishedDate: item.publishedDate ? new Date(item.publishedDate).toISOString().split("T")[0] : "",
        documentUrl: item.documentUrl || "",
      });
      setEditingId(item.id);
    } else {
      setFormData(DEFAULT_DOCUMENT);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(DEFAULT_DOCUMENT);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 py-4 mb-10">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 text-sm rounded-md bg-blue-500 px-3 py-2 font-semibold hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          <ISave /> Tambah Dokumen
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-white/70">Memuat data...</div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-8 text-white/70 border border-white/20 rounded-xl">
          Belum ada dokumen PPID yang tersedia
        </div>
      )}

      {!loading && documents.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/20">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5">
              <tr>
                <th className="py-3 px-4 text-left">Judul</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Tahun/Tanggal</th>
                <th className="py-3 px-4 text-left">Deskripsi</th>
                <th className="py-3 px-4 text-left">File</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">{doc.title}</td>
                  <td className="py-3 px-4">{doc.category}</td>
                  <td className="py-3 px-4">
                    {doc.publishedDate
                      ? new Date(doc.publishedDate).toLocaleDateString("id-ID")
                      : "—"}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">{doc.description || "—"}</td>
                  <td className="py-3 px-4">
                    {doc.documentUrl ? (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Lihat Dokumen
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleOpenModal(doc)}
                      className="rounded-lg border w-max flex gap-2 items-center border-blue-500/30 bg-blue-500/10 px-3 p2-1 text-xs text-blue-300 hover:bg-blue-500/20"
                      disabled={loading}
                    >
                      <IEdit />
                      <p>
                         Edit
                      </p>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg border w-max flex gap-2 border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20"
                      disabled={loading}
                    >
                      <IDelete /> 
                      <p>
                        Hapus
                      </p>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[999999]" onClose={handleCloseModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed top-0 right-0 inset-0 bg-black/70" />
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
                <Dialog.Panel className="bg-black/70 absolute top-0 right-0 border border-white/30 h-screen w-full max-w-md overflow-auto">
                  <div className="p-6 border-b border-white/20 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                      {editingId ? "Edit Dokumen PPID" : "Tambah Dokumen PPID"}
                    </h2>
                    <button onClick={() => setIsModalOpen(!isModalOpen)} className="text-gray-400 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <Field label="Judul Dokumen">
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Contoh: Laporan Keuangan BOS 2025"
                        required
                        disabled={loading}
                      />
                    </Field>

                    <Field label="Kategori">
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      >
                        <option className="text-black" value="">Pilih Kategori</option>
                        <option className="text-black" value="berkala">Informasi Berkala</option>
                        <option className="text-black" value="serta-merta">Informasi Serta Merta</option>
                        <option className="text-black" value="setiap-saat">Informasi Setiap Saat</option>
                        <option className="text-black" value="keuangan">Keuangan</option>
                        <option className="text-black" value="kegiatan">Kegiatan</option>
                        <option className="text-black" value="profil">Profil Sekolah</option>
                        <option className="text-black" value="ppdb">PPDB</option>
                        <option className="text-black" value="lainnya">Lainnya</option>
                      </Select>
                    </Field>

                    <Field label="Deskripsi">
                      <TextArea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Deskripsi singkat dokumen..."
                        rows={3}
                        disabled={loading}
                      />
                    </Field>

                    <Field label="Tanggal Publikasi">
                      <Input
                        type="date"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </Field>

                    <Field label="Link Dokumen">
                      <Input
                        type="url"
                        name="documentUrl"
                        value={formData.documentUrl}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/... atau link lainnya"
                        disabled={loading}
                      />
                      {editingId && formData.documentUrl && (
                        <div className="mt-1 text-xs text-white/50 break-all">
                          Saat ini: {formData.documentUrl}
                        </div>
                      )}
                    </Field>

                    <div className="w-full grid grid-cols-2 justify-end border-t border-white/20 pt-5 gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-xl border border-white/20 px-5 py-2 text-sm text-white/80 hover:text-white disabled:opacity-50"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-500/90 px-5 py-2 text-sm font-normal hover:bg-blue-500 disabled:opacity-50"
                        disabled={loading}
                      >
                        <ISave /> {editingId ? "Update Dokumen" : "Simpan Dokumen"}
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
}