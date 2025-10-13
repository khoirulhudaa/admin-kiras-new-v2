import React, { useState } from "react";

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

// Data Interfaces
interface Jadwal {
  classes: string[];
  teachers: string[];
  rooms: string[];
  timeSlots: Array<{ key: string; start: string; end: string }>;
  schedules: Record<string, Record<number, string[]>>;
}

// Default Data
const DEFAULT_JADWAL: Jadwal = {
  classes: ["X RPL 1", "X RPL 2"],
  teachers: ["Ibu Sari", "Pak Budi"],
  rooms: ["Lab RPL 1", "R. Teori 3"],
  timeSlots: [
    { key: "1", start: "07:00", end: "07:45" },
    { key: "2", start: "07:45", end: "08:30" },
    { key: "3", start: "08:30", end: "09:15" },
  ],
  schedules: {
    "X RPL 1": { 1: ["Upacara", "MTK", "B. Indo"], 2: ["MTK", "MTK", "Sejarah"] },
    "X RPL 2": { 1: ["Upacara", "B. Indo", "MTK"], 2: ["Sejarah", "MTK", "B. Indo"] },
  },
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
    <div className="space-y-4">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-4">
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

export function Jadwal() {
  const normalize = (state: any): Jadwal => {
    const out = { ...state };
    out.classes = Array.isArray(out.classes) ? out.classes.filter(Boolean) : [];
    if (out.classes.length === 0) out.classes = ["Kelas A"];
    out.teachers = Array.isArray(out.teachers) ? out.teachers : [];
    out.rooms = Array.isArray(out.rooms) ? out.rooms : [];
    out.timeSlots =
      Array.isArray(out.timeSlots) && out.timeSlots.length > 0
        ? out.timeSlots
        : [
            { key: "1", start: "07:00", end: "07:45" },
            { key: "2", start: "07:45", end: "08:30" },
            { key: "3", start: "08:30", end: "09:15" },
          ];
    const slotLen = out.timeSlots.length;
    const ensureDayArr = (arr: any[]) => {
      const a = Array.isArray(arr) ? [...arr] : [];
      for (let i = 0; i < slotLen; i++) {
        if (typeof a[i] !== "string") a[i] = "";
      }
      a.length = slotLen;
      return a;
    };
    const S: Record<string, Record<number, string[]>> =
      out.schedules && typeof out.schedules === "object" ? out.schedules : {};
    out.schedules = S;
    for (const cls of out.classes) {
      if (!S[cls]) S[cls] = {} as any;
      for (const d of [1, 2, 3, 4, 5]) {
        S[cls][d] = ensureDayArr(S[cls][d]);
      }
    }
    Object.keys(S).forEach((k) => {
      if (!out.classes.includes(k)) delete S[k];
    });
    return out;
  };

  const [v, setV] = useState<Jadwal>(normalize(DEFAULT_JADWAL));
  const [kelas, setKelas] = useState(v.classes[0] || "Kelas A");
  const [hari, setHari] = useState(1);

  const setSlot = (idx: number, val: string) =>
    setV((p) => {
      const base = normalize(p);
      const day = { ...(base.schedules[kelas] || {}) };
      const arr = [...(day[hari] || [])];
      arr[idx] = val;
      day[hari] = arr;
      return normalize({ ...base, schedules: { ...base.schedules, [kelas]: day } });
    });

  const addSlot = () =>
    setV((p) =>
      normalize({
        ...p,
        timeSlots: [
          ...(p.timeSlots || []),
          {
            key: String((p.timeSlots || []).length + 1),
            start: "00:00",
            end: "00:00",
          },
        ],
      })
    );

  const delSlot = (i: number) =>
    setV((p) =>
      normalize({
        ...p,
        timeSlots: (p.timeSlots || []).filter((_: any, idx: number) => idx !== i),
      })
    );

  const setSlotTime = (i: number, patch: Partial<{ start: string; end: string }>) =>
    setV((p) => {
      const a = [...(p.timeSlots || [])];
      a[i] = { ...a[i], ...patch };
      return normalize({ ...p, timeSlots: a });
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Jadwal data saved:", v);
  };

  return (
    <form
      className="space-y-6 pb-10"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-2 text-sm font-semibold">Daftar Kelas</div>
          <ListEditor
            items={v.classes}
            onChange={(list) => setV((p) => normalize({ ...p, classes: list }))}
            placeholder="Nama kelas"
          />
        </div>
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-2 text-sm font-semibold">Daftar Guru</div>
          <ListEditor
            items={v.teachers}
            onChange={(list) => setV((p) => normalize({ ...p, teachers: list }))}
            placeholder="Nama guru"
          />
        </div>
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-2 text-sm font-semibold">Daftar Ruang</div>
          <ListEditor
            items={v.rooms}
            onChange={(list) => setV((p) => normalize({ ...p, rooms: list }))}
            placeholder="Nama ruang"
          />
        </div>
      </div>
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 text-sm font-semibold">Slot Waktu</div>
        <div className="space-y-4">
          {(v.timeSlots || []).map((slot: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <Input
                value={slot.start}
                type="time"
                onChange={(e) => setSlotTime(i, { start: e.target.value })}
                placeholder="Mulai"
              />
              <Input
                value={slot.end}
                type="time"
                onChange={(e) => setSlotTime(i, { end: e.target.value })}
                placeholder="Selesai"
              />
              <button
                type="button"
                onClick={() => delSlot(i)}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSlot}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
          >
            <IPlus /> Tambah Slot
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 text-sm font-semibold">Jadwal per Kelas</div>
        <div className="mb-3 flex items-center gap-4">
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
          >
            {(v.classes || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={hari}
            onChange={(e) => setHari(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                Hari {d}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {(v.timeSlots || []).map((slot: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 text-xs">
                {slot.start}–{slot.end}
              </div>
              <Input
                value={((v.schedules || {})[kelas] || {})[hari]?.[i] || ""}
                onChange={(e) => setSlot(i, e.target.value)}
                placeholder="Mapel/Guru/Ruang"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-4 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
        >
          <ISave /> Simpan Jadwal
        </button>
      </div>
    </form>
  );
}