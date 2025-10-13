import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";

// Theme Tokens
const THEME_TOKENS: Record<string, React.CSSProperties> = {
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
if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');
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
  const isSuccess = message.includes("successfully");

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
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;

// Utility Components
interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && (
      <div className="mb-1 text-xs font-medium text-white/70">{label}</div>
    )}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Data Interface
interface VisiMisi {
  visi: string;
  misi: string[];
  pillars: string[];
  kpi: Array<{ name: string; target: string | number }>;
  // Track indices of items fetched from the server
  serverMisiIndices: number[];
  serverPillarIndices: number[];
  serverKpiIndices: number[];
}

// Default Data
const DEFAULT_VISIMISI: VisiMisi = {
  visi: "Mewujudkan sekolah vokasi yang unggul, berkarakter, dan berdaya saing global.",
  misi: [
    "Pembelajaran vokasi adaptif teknologi & standar industri",
    "Kemitraan strategis dengan IDUKA",
    "Penguatan karakter & budaya kerja",
    "Ekosistem digital sekolah (Xpresensi, e-library, LMS)",
  ],
  pillars: [
    "Link & Match",
    "Karakter",
    "Inovasi",
    "Keberlanjutan",
  ],
  kpi: [
    { name: "Tingkat Kehadiran", target: 97 },
    { name: "Sertifikasi Kompetensi", target: 70 },
    { name: "Penyerapan Lulusan", target: 65 },
  ],
  serverMisiIndices: [0, 1, 2, 3],
  serverPillarIndices: [0, 1, 2, 3],
  serverKpiIndices: [0, 1, 2],
};

// List Editor
interface ListEditorProps {
  items: string[];
  onChange: (list: string[]) => void;
  onDelete: (index: number) => void;
  placeholder?: string;
}

const ListEditor: React.FC<ListEditorProps> = ({
  items,
  onChange,
  onDelete,
  placeholder = "Teks...",
}) => {
  const setAt = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const add = () => onChange([...items, ""]);
  const up = (index: number) => {
    if (index <= 0) return;
    const copy = [...items];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onChange(copy);
  };
  const down = (index: number) => {
    if (index >= items.length - 1) return;
    const copy = [...items];
    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setAt(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => up(index)}
            className="rounded-lg border border-white/20 px-2 py-1 text-xs"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => down(index)}
            className="rounded-lg border border-white/20 px-2 py-1 text-xs"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
      >
        Tambah
      </button>
    </div>
  );
};

export function VisiMisi() {
  const [local, setLocal] = useState<VisiMisi>(DEFAULT_VISIMISI);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const BASE_URL = "https://dev.kiraproject.id/api/visimisi";
  const getToken = () => localStorage.getItem("token");

  // Common headers with token
  const getHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(BASE_URL, {
          headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setLocal({
          visi: data.visi,
          misi: data.misi,
          pillars: data.pillars,
          kpi: data.kpi.map((item: { name: string; target: string | number }) => ({
            name: item.name,
            target: item.target,
          })),
          serverMisiIndices: Array.from({ length: data.misi.length }, (_, i) => i),
          serverPillarIndices: Array.from({ length: data.pillars.length }, (_, i) => i),
          serverKpiIndices: Array.from({ length: data.kpi.length }, (_, i) => i),
        });
      } catch (err) {
        showAlert("Failed to load data from API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showAlert]);

  const touch = (patch: Partial<VisiMisi>) => {
    setLocal({ ...local, ...patch });
  };

  const setMisi = (list: string[]) => touch({ misi: list });

  const handleDeleteMisi = async (index: number) => {
    if (!local.serverMisiIndices.includes(index)) {
      // Item is local-only, delete from state
      setMisi(local.misi.filter((_, idx) => idx !== index));
      showAlert("Misi deleted successfully");
      return;
    }

    // Item exists on server, attempt API delete
    try {
      const response = await fetch(`${BASE_URL}/misi/${index}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete misi");
      setMisi(local.misi.filter((_, idx) => idx !== index));
      touch({ serverMisiIndices: local.serverMisiIndices.filter((i) => i !== index) });
      showAlert("Misi deleted successfully");
    } catch (err) {
      showAlert("Failed to delete misi");
      console.error(err);
    }
  };

  const setPillars = (index: number, value: string) => {
    const arr = [...local.pillars];
    arr[index] = value;
    touch({ pillars: arr });
  };

  const addPillar = () => touch({ pillars: [...local.pillars, ""] });

  const handleDeletePillar = async (index: number) => {
    if (!local.serverPillarIndices.includes(index)) {
      // Item is local-only, delete from state
      touch({ pillars: local.pillars.filter((_, idx) => idx !== index) });
      showAlert("Pillar deleted successfully");
      return;
    }

    // Item exists on server, attempt API delete
    try {
      const response = await fetch(`${BASE_URL}/pillars/${index}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete pillar");
      touch({
        pillars: local.pillars.filter((_, idx) => idx !== index),
        serverPillarIndices: local.serverPillarIndices.filter((i) => i !== index),
      });
      showAlert("Pillar deleted successfully");
    } catch (err) {
      showAlert("Failed to delete pillar");
      console.error(err);
    }
  };

  const setKpi = (index: number, key: "name" | "target", value: string | number) => {
    const arr = [...local.kpi];
    arr[index] = { ...arr[index], [key]: value };
    touch({ kpi: arr });
  };

  const addKpi = () => touch({ kpi: [...local.kpi, { name: "", target: 0 }] });

  const handleDeleteKpi = async (index: number) => {
    if (!local.serverKpiIndices.includes(index)) {
      // Item is local-only, delete from state
      touch({ kpi: local.kpi.filter((_, idx) => idx !== index) });
      showAlert("KPI deleted successfully");
      return;
    }

    // Item exists on server, attempt API delete
    try {
      const response = await fetch(`${BASE_URL}/kpi/${index}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete KPI");
      touch({
        kpi: local.kpi.filter((_, idx) => idx !== index),
        serverKpiIndices: local.serverKpiIndices.filter((i) => i !== index),
      });
      showAlert("KPI deleted successfully");
    } catch (err) {
      showAlert("Failed to delete KPI");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(BASE_URL, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          visi: local.visi,
          misi: local.misi,
          pillars: local.pillars,
          kpi: local.kpi,
        }),
      });
      if (!response.ok) throw new Error("Failed to save data");
      // Update server indices after successful save
      touch({
        serverMisiIndices: Array.from({ length: local.misi.length }, (_, i) => i),
        serverPillarIndices: Array.from({ length: local.pillars.length }, (_, i) => i),
        serverKpiIndices: Array.from({ length: local.kpi.length }, (_, i) => i),
      });
      showAlert("Data saved successfully!");
    } catch (err) {
      showAlert("Failed to save data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 mb-10">
      <AnimatePresence>
        {alert.isVisible && (
          <Alert message={alert.message} onClose={hideAlert} />
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="space-y-6">
        {loading && (
          <div className="text-sm text-white/70">Loading...</div>
        )}

        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 text-sm font-semibold">Visi</div>
          <TextArea
            rows={3}
            value={local.visi}
            onChange={(e) => touch({ visi: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 text-sm font-semibold">Misi (multi baris)</div>
          <ListEditor
            items={local.misi}
            onChange={setMisi}
            onDelete={handleDeleteMisi}
            placeholder="Misi..."
          />
        </div>

        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 text-sm font-semibold">Pilar</div>
          <div className="space-y-2">
            {local.pillars.map((pillar, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={pillar}
                  onChange={(e) => setPillars(index, e.target.value)}
                  placeholder="Nama pilar"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => handleDeletePillar(index)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                  disabled={loading}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPillar}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
              disabled={loading}
            >
              Tambah Pilar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 text-sm font-semibold">Indikator Kinerja (KPI)</div>
          <div className="space-y-2">
            {local.kpi.map((kpi, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-2">
                <Input
                  value={kpi.name}
                  onChange={(e) => setKpi(index, "name", e.target.value)}
                  placeholder="Nama indikator"
                  disabled={loading}
                />
                <Input
                  type="text"
                  value={kpi.target.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setKpi(index, "target", value === "" ? 0 : Number(value));
                    }
                  }}
                  placeholder="Target (angka)"
                  disabled={loading}
                />
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteKpi(index)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                    disabled={loading}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addKpi}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
              disabled={loading}
            >
              Tambah KPI
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
            disabled={loading}
          >
            <ISave className="h-4 w-4" /> Simpan Visi & Misi
          </button>
        </div>
      </form>
    </div>
  );
}
