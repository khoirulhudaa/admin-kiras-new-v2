import { Edit, Trash2, X, Plus, Save } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSchool } from "@/features/schools";

// Theme (sama seperti dashboard sebelumnya)
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
          ? "bg-blue-900/30 border-blue-500/40 text-blue-300"
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

// Item Editor untuk sub-items
const ItemEditor = ({
  items,
  onChange,
}: {
  items: { title: string; description: string }[];
  onChange: (newItems: any[]) => void;
}) => {
  const addItem = () => {
    onChange([...items, { title: "", description: "" }]);
  };

  const updateItem = (index: number, field: "title" | "description", value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-white/80">Daftar Item / Sub Program</label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
        >
          <Plus size={14} /> Tambah Item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada item. Tambahkan jika perlu.</p>
      ) : (
        items.map((item, idx) => (
          <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center gap-3">
              <Input
                value={item.title}
                onChange={(e) => updateItem(idx, "title", e.target.value)}
                placeholder="Judul item (wajib)"
                className="flex-1"
                required
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-2 w-10 h-full text-red-400 bg-red-500/50 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
              >
                ×
              </button>
            </div>
            <TextArea
              value={item.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              placeholder="Deskripsi item..."
              rows={2}
            />
          </div>
        ))
      )}
    </div>
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

// Modal Form Create / Update
const ProgramModal = ({
  open,
  onClose,
  title,
  initialData = {},
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}) => {
  // Gunakan key berdasarkan apakah ini edit atau create + id (jika edit)
  const modalKey = initialData?.id 
    ? `edit-${initialData.id}` 
    : 'create-new';

  const [form, setForm] = useState(() => ({
    mainTitle: initialData?.mainTitle || "",
    mainDescription: initialData?.mainDescription || "",
    items: Array.isArray(initialData?.items) ? [...initialData.items] : [],
  }));

  // Reset hanya jika key berubah (artinya modal benar-benar berganti mode/data)
  useEffect(() => {
    setForm({
      mainTitle: initialData?.mainTitle || "",
      mainDescription: initialData?.mainDescription || "",
      items: Array.isArray(initialData?.items) ? [...initialData.items] : [],
    });
  }, [modalKey])

  const [saving, setSaving] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mainTitle.trim()) {
      alert("Judul utama wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 top-0 right-0 h-screen bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="fixed top-0 right-0 bg-black/70 h-screen w-full max-w-2xl border border-white/10 overflow-y-auto"
      >
        <div className="relative p-6 border-b border-white/10 flex justify-between items-center z-[99999] pt-8">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Judul Program Utama *
            </label>
            <Input
              value={form.mainTitle}
              onChange={(e) => setForm({ ...form, mainTitle: e.target.value })}
              placeholder="Contoh: Program Pengembangan Karakter"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Deskripsi Utama
            </label>
            <TextArea
              value={form.mainDescription}
              onChange={(e) => setForm({ ...form, mainDescription: e.target.value })}
              placeholder="Penjelasan singkat tentang program ini..."
            />
          </div>

          <ItemEditor
            items={form.items}
            onChange={(newItems) => setForm({ ...form, items: newItems })}
          />

          <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Menyimpan..." : "Simpan Program"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
export default function ProgramMain() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const dataSchool: any = useSchool(); // Ganti sesuai kebutuhan, bisa dari context/hook nanti
  const SCHOOL_ID = dataSchool?.data?.[0].id

  const showAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 5000);
  };

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/program?schoolId=${SCHOOL_ID}`);
      if (!res.ok) throw new Error("Gagal memuat data program");

      const json = await res.json();
      if (json.success) {
        setPrograms(json.data || []);
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert("Gagal memuat program: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleCreate = async (form: any) => {
    const res = await fetch(`${BASE_URL}/program`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, schoolId: SCHOOL_ID }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menambah program");
    }

    showAlert("Program berhasil ditambahkan!");
    fetchPrograms();
  };

  const handleUpdate = async (form: any) => {
    if (!selectedProgram?.id) return;

    const res = await fetch(`${BASE_URL}/program/${selectedProgram.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal memperbarui program");
    }

    showAlert("Program berhasil diperbarui!");
    fetchPrograms();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus program ini? (soft delete)")) return;

    const res = await fetch(`${BASE_URL}/program/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menghapus");
    }

    showAlert("Program berhasil dihapus (soft delete)");
    fetchPrograms();
  };

  const columns = [
    { key: "mainTitle", label: "Judul" },
    { key: "mainDescription", label: "Deskripsi" },
    { key: "itemsLength", label: "Jumlah  " },
  ];

  
    const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
        {label}
    </span>
    );
    const ISave = () => <Icon label="💾" />;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <header className="flex justify-between items-center my-4 mb-6">
        <button
          onClick={() => {
            setSelectedProgram(null);
            setAddModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm flex items-center gap-2"
        >
          <ISave /> Tambah Program
        </button>
      </header>

      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Belum ada program yang terdaftar
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/5 uppercase border border-white/30 rounded-xl mt-4">
          <table className="min-w-full">
            <thead className="border-b border-white ">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 w-max py-4 text-left text-sm font-medium text-white/70">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog) => (
                <tr key={prog.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{prog.mainTitle}</td>
                  <td className="px-6 py-4 text-white/80">
                    {prog.mainDescription || <span className="opacity-50">—</span>}
                  </td>
                  <td className="px-6 py-4 text-center">{prog.items?.length || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProgram(prog);
                          setEditModalOpen(true);
                        }}
                        className="p-2 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg text-blue-300"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(prog.id)}
                        className="p-2 bg-red-900/30 hover:bg-red-800/50 rounded-lg text-red-300"
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
      <ProgramModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Program Baru"
        onSubmit={handleCreate}
      />

      {/* Modal Edit */}
      <ProgramModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Program"
        initialData={selectedProgram}
        onSubmit={handleUpdate}
      />
    </div>
  );
}