import React, { useState, useEffect } from "react";

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

// Utility: clsx
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

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
      <div className="mb-1 text-xs font-medium text-white">{label}</div>
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
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
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
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Data Interfaces
interface Mapel {
  id: number;
  namaMataPelajaran: string;
  kode: string;
  kurikulum: string;
  kelompok: string;
  isP5: boolean;
  archived: boolean;
}

interface Dokumen {
  id?: number;
  title: string;
  url: string;
  order: number;
}

interface JP {
  id?: number;
  key: string;
  start: string;
  end: string;
  order: number;
}

interface Kurikulum {
  pengantar: string;
  mapel: Mapel[];
  dokumen: Dokumen[];
  jp: JP[];
}

// Default Data
const DEFAULT_KURIKULUM: Kurikulum = {
  pengantar: "",
  mapel: [],
  dokumen: [],
  jp: [],
};

// List Editor
interface ListEditorProps {
  items: string[];
  onChange: (list: string[]) => void;
  placeholder?: string;
}

const ListEditor: React.FC<ListEditorProps> = ({
  items,
  onChange,
  placeholder = "Teks...",
}) => {
  const setAt = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const add = () => onChange([...items, ""]);
  const del = (index: number) => onChange(items.filter((_, idx) => idx !== index));
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
            className="rounded-lg border border-white/10 px-2 py-1 text-xs"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => down(index)}
            className="rounded-lg border border-white/10 px-2 py-1 text-xs"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => del(index)}
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

export function Kurikulum() {
  const [v, setV] = useState<Kurikulum>(DEFAULT_KURIKULUM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://dev.kiraproject.id/api";
  const token = localStorage.getItem('token');

  // Fetch data on mount
  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/kurikulum`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch kurikulum data");
        const data: Kurikulum = await response.json();
        setV(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchKurikulum();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, []);

  const setDoc = (i: number, patch: Partial<Dokumen>) =>
    setV((p) => {
      const a = [...p.dokumen];
      a[i] = { ...a[i], ...patch };
      return { ...p, dokumen: a };
    });

  const addDoc = () =>
    setV((p) => ({
      ...p,
      dokumen: [...p.dokumen, { title: "", url: "", order: p.dokumen.length }],
    }));

  const delDoc = async (i: number) => {
    try {
      const docId = v.dokumen[i]?.id;
      if (docId) {
        const response = await fetch(`${BASE_URL}/kurikulum/dokumen/${i}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to delete document");
      }
      setV((p) => ({
        ...p,
        dokumen: p.dokumen.filter((_, idx) => idx !== i),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    }
  };

  const setJP = (i: number, patch: Partial<JP>) =>
    setV((p) => {
      const a = [...p.jp];
      a[i] = { ...a[i], ...patch };
      return { ...p, jp: a };
    });

  const addJP = () =>
    setV((p) => ({
      ...p,
      jp: [...p.jp, { key: "", start: "", end: "", order: p.jp.length }],
    }));

  const delJP = async (i: number) => {
    try {
      const jpId = v.jp[i]?.id;
      if (jpId) {
        const response = await fetch(`${BASE_URL}/kurikulum/jp/${i}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to delete JP");
      }
      setV((p) => ({
        ...p,
        jp: p.jp.filter((_, idx) => idx !== i),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete JP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("No authentication token found");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/kurikulum`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          pengantar: v.pengantar,
          mapel: v.mapel,
          dokumen: v.dokumen,
          jp: v.jp,
        }),
      });

      console.log('v', v)
      if (!response.ok) throw new Error("Failed to save kurikulum");
      console.log("Kurikulum data saved:", await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save kurikulum");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="rounded-2xl border border-white/20 p-4">
        <Field label="Pengantar Kurikulum">
          <TextArea
            rows={3}
            value={v.pengantar}
            onChange={(e) => setV((p) => ({ ...p, pengantar: e.target.value }))}
          />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-2 text-sm font-semibold">Daftar Mapel</div>
          <ListEditor
            items={v.mapel.map((m) => m.namaMataPelajaran)}
            onChange={(list) =>
              setV((p) => ({
                ...p,
                mapel: list.map((nama, i) => ({
                  id: v.mapel[i]?.id || i + 1,
                  namaMataPelajaran: nama,
                  kode: v.mapel[i]?.kode || "",
                  kurikulum: v.mapel[i]?.kurikulum || "MERDEKA",
                  kelompok: v.mapel[i]?.kelompok || "WAJIB",
                  isP5: v.mapel[i]?.isP5 || false,
                  archived: v.mapel[i]?.archived || false,
                })),
              }))
            }
            placeholder="Nama mata pelajaran"
          />
        </div>
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-2 text-sm font-semibold">Dokumen (label & URL)</div>
          <div className="space-y-2">
            {v.dokumen.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={d.title}
                  onChange={(e) => setDoc(i, { title: e.target.value })}
                  placeholder="Label dokumen"
                />
                <Input
                  value={d.url}
                  onChange={(e) => setDoc(i, { url: e.target.value })}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => delDoc(i)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDoc}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
            >
              Tambah Dokumen
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-2 text-sm font-semibold">JP per Minggu</div>
        <div className="space-y-2">
          {v.jp.map((r, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-6">
              <div className="md:col-span-2">
                <Input
                  value={r.key}
                  onChange={(e) => setJP(i, { key: e.target.value })}
                  placeholder="Kunci (e.g., SENIN-1)"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="time"
                  value={r.start}
                  onChange={(e) => setJP(i, { start: e.target.value })}
                  placeholder="Start"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="time"
                  value={r.end}
                  onChange={(e) => setJP(i, { end: e.target.value })}
                  placeholder="End"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  value={r.order}
                  onChange={(e) => setJP(i, { order: Number(e.target.value || 0) })}
                  placeholder="Order"
                />
              </div>
              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => delJP(i)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addJP}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
          >
            Tambah Baris
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
        >
          <ISave /> Simpan Kurikulum
        </button>
      </div>
    </form>
  );
}