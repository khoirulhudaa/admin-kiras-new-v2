import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

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

if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');
}

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Alert Hook & Component
interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((msg: string) => {
    setAlert({ message: msg, isVisible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

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

// Icons
const Icon = ({ label }: { label: string }) => (
  <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;

// Input & TextArea Components
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50",
      className
    )}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 resize-y min-h-[100px]",
      className
    )}
  />
);

// ListEditor untuk Misi (dengan urut naik/turun)
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
  placeholder = "Masukkan misi...",
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
    <div className="space-y-3">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setAt(index, e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => up(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            ↑
          </button>
          <button type="button" onClick={() => down(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            ↓
          </button>
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
      >
        Tambah Misi
      </button>
    </div>
  );
};

// Interface data
interface VisiMisi {
  id?: number;
  vision: string;
  missions: string[];
  pillars: string[];
  kpis: Array<{ indicator: string; target: number }>;
}

const DEFAULT_VISIMISI: VisiMisi = {
  vision: "",
  missions: [],
  pillars: [],
  kpis: [],
};

export function VisiMisi() {
  const [data, setData] = useState<VisiMisi>(DEFAULT_VISIMISI);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  // Ambil schoolData dari hook useSchool
  const schoolData = useSchool(); // <-- hook kamu
  const schoolId = schoolData?.data[0]?.id;

  const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

  // Fetch data saat mount
  useEffect(() => {
    // 1. Jika schoolId belum ada, kita diam saja (masih loading school)
    if (!schoolId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const records = json.success ? json.data : json;

        if (Array.isArray(records) && records.length > 0) {
          const record = records[0];
          setData({
            id: record.id,
            vision: record.vision || "",
            missions: Array.isArray(record.missions) ? record.missions : [],
            pillars: Array.isArray(record.pillars) ? record.pillars : [],
            kpis: Array.isArray(record.kpis)
              ? record.kpis.map((k: any) => ({
                  indicator: k.indicator || k.name || "",
                  target: Number(k.target) || 0,
                }))
              : [],
          });
        } else {
          setData(DEFAULT_VISIMISI);
        }
      } catch (err) {
        console.error("Fetch visi misi error:", err);
        showAlert("Gagal memuat data visi misi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, showAlert]); // useEffect akan jalan ulang otomatis saat schoolId terisi

  const update = (patch: Partial<VisiMisi>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolId) {
      showAlert("School ID tidak tersedia");
      return;
    }

    setSaving(true);

    // Validasi minimal
    if (!data.vision.trim()) {
      showAlert("Visi wajib diisi");
      setSaving(false);
      return;
    }
    if (data.missions.some((m) => !m.trim())) {
      showAlert("Semua misi harus diisi");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        vision: data.vision,
        missions: data.missions,
        pillars: data.pillars,
        kpis: data.kpis,
        schoolId,
      };

      let res: Response;

      if (data.id) {
        // UPDATE existing
        res = await fetch(`${BASE_URL}/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE new
        res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
      }

      const result = await res.json();

      // Jika create, ambil id baru dari response
      if (!data.id && result.data?.id) {
        update({ id: result.data.id });
      }

      showAlert("Visi, Misi, Pilar & KPI berhasil disimpan!");
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !schoolId) {
    return (
      <div className="text-center h-[60vh] flex items-center justify-center bg-white/5 rounded-xl border border-white/30 py-10 text-white/70">
        Memuat data sekolah...
      </div>
    );
  }

  return (
    <>
    <div>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>


      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-start pt-4">
            <button
              type="submit"
              disabled={saving}
              onClick={() => handleSubmit}
              className={clsx(
                "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                saving
                  ? "bg-emerald-700/50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-500"
              )}
            >
              <ISave />
              {saving
                ? "Menyimpan..."
                : data.id
                ? "Perbarui Visi & Misi"
                : "Simpan Visi & Misi"}
            </button>
        </div>
        <div className="space-y-3 bg-white/5 uppercase border border-white/30 rounded-xl py-6 mt-4 px-6">
          {/* Visi */}
          <div className="spacee-y-6">
            <div className="mb-3 text-sm font-semibold text-white">Visi Sekolah</div>
            <TextArea
              rows={4}
              value={data.vision}
              onChange={(e) => update({ vision: e.target.value })}
              placeholder="Tuliskan visi sekolah..."
              disabled={saving}
            />
          </div>

          {/* Misi */}
          <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
            <div className="mb-3 text-sm font-semibold text-white">Misi (multi baris)</div>
            <ListEditor
              items={data.missions}
              onChange={(missions) => update({ missions })}
              onDelete={(idx) => update({ missions: data.missions.filter((_, i) => i !== idx) })}
              placeholder="Masukkan misi sekolah..."
            />
          </div>

          {/* Pilar */}
          <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
            <div className="mb-3 text-sm font-semibold text-white">Pilar</div>
            <div className="space-y-3">
              {data.pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    value={pillar}
                    onChange={(e) => {
                      const newPillars = [...data.pillars];
                      newPillars[idx] = e.target.value;
                      update({ pillars: newPillars });
                    }}
                    placeholder="Nama pilar"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={() => update({ pillars: data.pillars.filter((_, i) => i !== idx) })}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20"
                    disabled={saving}
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ pillars: [...data.pillars, ""] })}
                className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
                disabled={saving}
              >
                Tambah Pilar
              </button>
            </div>
          </div>

          {/* KPI */}
          <div className="rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
            <div className="mb-3 text-sm font-semibold text-white">Indikator Kinerja (KPI)</div>
            <div className="space-y-4">
              {data.kpis.map((kpi, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]">
                  <Input
                    value={kpi.indicator}
                    onChange={(e) => {
                      const newKpis = [...data.kpis];
                      newKpis[idx].indicator = e.target.value;
                      update({ kpis: newKpis });
                    }}
                    placeholder="Nama indikator / KPI"
                    disabled={saving}
                  />
                  <Input
                    type="text"
                    value={kpi.target.toString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        const newKpis = [...data.kpis];
                        newKpis[idx].target = val === "" ? 0 : Number(val);
                        update({ kpis: newKpis });
                      }
                    }}
                    placeholder="Target"
                    className="md:w-32"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={() => update({ kpis: data.kpis.filter((_, i) => i !== idx) })}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20 md:self-start"
                    disabled={saving}
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ kpis: [...data.kpis, { indicator: "", target: 0 }] })}
                className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/20"
                disabled={saving}
              >
                Tambah KPI
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
    </>
  );
}