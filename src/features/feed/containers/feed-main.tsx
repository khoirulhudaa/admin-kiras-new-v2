import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Eye, Link, Pen, Plus, Trash } from "lucide-react";
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

if (typeof document !== "undefined") {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join("");
}

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// === ALERT HOOK ===
const useAlert = () => {
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false,
  });

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  };

  const hideAlert = () => setAlert({ message: "", isVisible: false });

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
        "mb-6 rounded-xl border p-4 text-sm shadow-lg",
        isSuccess
          ? "border-green-600/30 bg-green-900/20 text-green-300"
          : "border-red-600/30 bg-red-900/20 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-xl font-bold leading-none hover:opacity-80"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// === FORM COMPONENTS ===
const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
  <div className={clsx("space-y-1.5", className)}>
    {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500",
      "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none",
      props.className
    )}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500",
      "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y",
      props.className
    )}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white",
      "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none",
      props.className
    )}
  />
);

// === DEFAULT VALUES ===
const DEFAULT_FEED = {
  username: "",
  caption: "",
  postLink: "",
  postDate: new Date().toISOString().split("T")[0],
  mediaType: "image" as "image" | "video",
  mediaFile: null as File | null,
};

// === HEADERS ===
const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  // Tambahkan Authorization jika diperlukan nanti
});

// === MAIN COMPONENT ===
export function FeedMain() {
  const { data: schoolData } = useSchool();
  const SCHOOL_ID = schoolData?.[0]?.id;

  const [feeds, setFeeds] = useState<any[]>([]);
  const [formData, setFormData] = useState(DEFAULT_FEED);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const BASE_URL = "https://be-school.kiraproject.id";

  // Fetch semua feeds
  const fetchFeeds = async () => {
    if (!SCHOOL_ID) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feed?schoolId=${SCHOOL_ID}&isActive=true`, {
        headers: getJsonHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Gagal mengambil data");
      setFeeds(json.data || []);
    } catch (err: any) {
      showAlert("Gagal memuat feed Instagram: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SCHOOL_ID) fetchFeeds();
  }, [SCHOOL_ID]);

  // Submit (create / update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!SCHOOL_ID) {
      showAlert("School ID tidak ditemukan");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("schoolId", SCHOOL_ID);
    form.append("username", formData.username);
    form.append("caption", formData.caption);
    form.append("postLink", formData.postLink);
    form.append("postDate", formData.postDate);
    form.append("mediaType", formData.mediaType);

    if (formData.mediaFile) {
      form.append("media", formData.mediaFile); // sesuai req.file di backend
    }

    try {
      const isEdit = !!editingId;
      const url = isEdit ? `${BASE_URL}/feed/${editingId}` : `${BASE_URL}/feed`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: form,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} feed`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert(isEdit ? "Feed berhasil diperbarui" : "Feed berhasil ditambahkan");
      setFormData(DEFAULT_FEED);
      setEditingId(null);
      setIsModalOpen(false);
      await fetchFeeds();
    } catch (err: any) {
      showAlert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Delete (soft delete)
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus feed ini?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feed/${id}`, {
        method: "DELETE",
        headers: getJsonHeaders(),
      });

      if (!res.ok) throw new Error("Gagal menghapus");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert("Feed berhasil dihapus");
      await fetchFeeds();
    } catch (err: any) {
      showAlert(err.message || "Gagal menghapus feed");
    } finally {
      setLoading(false);
    }
  };

  // Open modal untuk edit atau create
  const openModal = (feed?: any) => {
    if (feed) {
      setFormData({
        username: feed.username || DEFAULT_FEED.username,
        caption: feed.caption || "",
        postLink: feed.postLink || "",
        postDate: feed.postDate ? new Date(feed.postDate).toISOString().split("T")[0] : DEFAULT_FEED.postDate,
        mediaType: feed.mediaType || "image",
        mediaFile: null,
      });
      setEditingId(feed.id);
    } else {
      setFormData(DEFAULT_FEED);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none w-4 text-center">{label}</span>
  );
  const ISave = () => <Icon label="💾" />;

  const formatPostDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "—"; // fallback jika kosong

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";

  // Format: "1 Oktober 2025"
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta", // pastikan sesuai WIB
  });
};


  return (
    <div className="space-y-6 py-4">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => openModal()}
          disabled={loading || !SCHOOL_ID}
          className="inline-flex items-center text-sm gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-md"
        >
          <ISave /> Tambah Feed
        </button>
      </div>

      {/* Loading / Empty */}
      {loading && (
        <div className="text-center py-20 text-zinc-400">Memuat feed Instagram...</div>
      )}

      {!loading && feeds.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-700 rounded-xl text-zinc-500">
          Belum ada postingan Instagram yang ditambahkan
        </div>
      )}

      {/* Grid */}
      {!loading && feeds.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white/5 rounded-2xl border border-white/10 p-5">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="group relative aspect-square rounded-xl h-[360px] overflow-hidden bg-black border border-zinc-800 shadow-lg transition-all duration-300"
            >
              {feed.mediaUrl ? (
                feed.mediaType === "video" ? (
                  <video
                    src={`${feed.mediaUrl}`}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`${feed.mediaUrl}`}
                    alt={feed.caption || "Instagram post"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
                  No Media
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium line-clamp-3 mb-2">
                  {feed.caption || "Tanpa caption"}
                </p>
                <p className="text-white text-sm font-medium line-clamp-3 mb-2">
                  {formatPostDate(feed.postDate)}
                </p>

                {feed.postLink && (
                  <a
                    href={feed.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-xs flex items-center gap-1 hover:underline mb-3"
                  >
                    <ExternalLink size={14} /> Lihat di Instagram
                  </a>
                )}

                <div className="gap-3 grid grid-cols-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(feed);
                    }}
                    className="flex-1 bg-blue-600/80 hover:bg-blue-800 text-white text-xs py-2.5 rounded flex items-center justify-center gap-1.5 active:scale-[0.97]"
                  >
                    <Pen size={14} /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(feed.id);
                    }}
                    className="flex-1 bg-red-600/80 hover:bg-red-800 text-white text-xs py-2.5 rounded flex items-center justify-center gap-1.5 active:scale-[0.97]"
                  >
                    <Trash size={14} /> Hapus
                  </button>
                  {feed.postLink && (
                    <a
                      href={feed.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      <button
                        className="flex-1 bg-white hover:brightness-[90%] text-black text-xs px-3 py-2.5 rounded flex items-center justify-center gap-1.5 active:scale-[0.97]"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      </a>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed top-0 right-0 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="absolute top-0 right-0 h-screen overflow-auto w-full max-w-md transform bg-zinc-900 border border-zinc-700 p-6 text-left align-middle shadow-2xl">
                  <Dialog.Title className="text-xl font-bold text-white mb-6 border-b border-white/20 pb-5">
                    {editingId ? "Edit Feed Instagram" : "Tambah Feed Instagram Baru"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="Username Instagram">
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="@sman_xx_official"
                      />
                    </Field>

                    <Field label="Caption">
                      <TextArea
                        value={formData.caption}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        rows={4}
                        placeholder="Tulis caption postingan Instagram di sini..."
                      />
                    </Field>

                    <Field label="Link Postingan (opsional)">
                      <Input
                        type="url"
                        value={formData.postLink}
                        onChange={(e) => setFormData({ ...formData, postLink: e.target.value })}
                        placeholder="https://www.instagram.com/p/..."
                      />
                    </Field>

                    <Field label="Tanggal Posting">
                      <Input
                        type="date"
                        value={formData.postDate}
                        onChange={(e) => setFormData({ ...formData, postDate: e.target.value })}
                        required
                      />
                    </Field>

                    <Field label="Tipe Media">
                      <Select
                        value={formData.mediaType}
                        onChange={(e) =>
                          setFormData({ ...formData, mediaType: e.target.value as "image" | "video" })
                        }
                      >
                        <option value="image">Gambar / Foto</option>
                        <option value="video">Video / Reels</option>
                      </Select>
                    </Field>

                    <Field label={editingId ? "Ganti Media (opsional)" : "Upload Media"}>
                      <input
                        type="file"
                        accept={formData.mediaType === "video" ? "video/*" : "image/*"}
                        onChange={(e) =>
                          setFormData({ ...formData, mediaFile: e.target.files?.[0] || null })
                        }
                        required={!editingId}
                        className="block w-full text-sm text-zinc-400
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-600/20 file:text-blue-300
                          hover:file:bg-blue-600/40
                          file:cursor-pointer cursor-pointer"
                      />
                      {formData.mediaFile && (
                        <p className="mt-2 text-xs text-zinc-400 truncate">
                          Terpilih: {formData.mediaFile.name}
                        </p>
                      )}
                    </Field>

                    <div className="w-full grid grid-cols-2 border-t border-white/20 justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium flex items-center gap-2"
                      >
                        {loading ? (
                          "Menyimpan..."
                        ) : editingId ? (
                          "Update Feed"
                        ) : (
                          "Tambah Feed"
                        )}
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