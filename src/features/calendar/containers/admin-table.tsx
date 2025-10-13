import React, { useState, useRef } from "react";

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
const IPlus = () => <Icon label="＋" />;

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

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Unggah Gambar",
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(f);
  };
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="mb-2 text-xs font-medium text-white">{label}</div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="text-xs"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs"
        >
          Pilih File
        </button>
      </div>
      {value && (
        <div className="mt-3">
          <img
            src={value}
            alt="preview"
            className="max-h-36 rounded-lg border border-white/10"
          />
        </div>
      )}
    </div>
  );
};

// Data Interfaces
interface Kalender {
  events: Array<{
    title: string;
    date: string;
    category: string;
    poster: string;
  }>;
}

// Default Data
const DEFAULT_KALENDER: Kalender = {
  events: [{ title: "Contoh Agenda", date: "2025-09-15", category: "Akademik", poster: "" }],
};

export function Kalender() {
  const [v, setV] = useState<Kalender>(DEFAULT_KALENDER);

  const setEv = (
    i: number,
    patch: Partial<{ title: string; date: string; category: string; poster: string }>
  ) =>
    setV((p) => {
      const a = [...(p.events || [])];
      a[i] = { ...a[i], ...patch };
      return { ...p, events: a };
    });

  const addEv = () =>
    setV((p) => ({
      ...p,
      events: [
        ...(p.events || []),
        { title: "", date: "", category: "Akademik", poster: "" },
      ],
    }));

  const delEv = (i: number) =>
    setV((p) => ({
      ...p,
      events: (p.events || []).filter((_: any, idx: number) => idx !== i),
    }));

  const cats = ["Akademik", "Kesiswaan", "Dinas", "Ujian", "Libur"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Kalender data saved:", v);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Agenda</div>
          <button
            type="button"
            onClick={addEv}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
          >
            <IPlus /> Tambah Agenda
          </button>
        </div>
        <div className="space-y-3">
          {(v.events || []).map((e: any, i: number) => (
            <div
              key={i}
              className="rounded-xl border border-white/20 p-3"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul">
                  <Input
                    value={e.title}
                    onChange={(ev: any) => setEv(i, { title: ev.target.value })}
                  />
                </Field>
                <Field label="Tanggal">
                  <Input
                    type="date"
                    value={e.date}
                    onChange={(ev: any) => setEv(i, { date: ev.target.value })}
                  />
                </Field>
                <Field label="Kategori">
                  <select
                    value={e.category}
                    onChange={(ev: any) => setEv(i, { category: ev.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                  >
                    {cats.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <ImageUpload
                    value={e.poster}
                    onChange={(d) => setEv(i, { poster: d })}
                    label="Poster/Gambar (opsional)"
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => delEv(i)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
        >
          <ISave /> Simpan Kalender
        </button>
      </div>
    </form>
  );
}