import {
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  Info,
  LayoutDashboard,
  MapPin,
  Users2,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";

// ---------- Mini UI helpers ----------
function clsx(...a: any[]) {
  return a.filter(Boolean).join(" ");
}

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "teal" | "amber" | "red" | "sky" | "violet";
}) {
  const map: any = {
    slate: "bg-slate-100 text-slate-400 border-slate-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  tone = "teal",
}: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "teal" | "sky" | "violet" | "amber";
}) {
  const ring: any = {
    teal: "border border-white/20",
    sky: "border border-white/20",
    violet: "border border-white/20",
    amber: "border border-white/20",
  };
  const tint: any = {
    teal: "text-teal-700",
    sky: "text-sky-700",
    violet: "text-violet-700",
    amber: "text-amber-700",
  };
  const bg: any = {
    teal: "bg-teal-50",
    sky: "bg-sky-50",
    violet: "bg-violet-50",
    amber: "bg-amber-50",
  };
  return (
    <div
      className={clsx(
        "rounded-lg border p-4 shadow-sm bg-theme-color-primary/5",
        ring[tone]
      )}
    >
      <div className="flex flex-col gap-3">
        <div className={clsx("p-2 w-max rounded-lg", bg[tone])}>
          <Icon className={clsx("h-5 w-5", tint[tone])} />
        </div>
        <div>
          <div className="text-sm text-white">{label}</div>
          <div className="flex items-center gap-3 mt-3">
            <div className="text-xl font-semibold text-white">{value}</div>
            {hint && (
              <div className="text-xs border border-white/20 p-1 rounded-md px-3 text-slate-400">
                {hint}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  toolbar,
  children,
}: {
  title: string;
  icon?: any;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/20 shadow-sm bg-theme-color-primary/5">
      <header className="flex items-center justify-between border-b border-white/20 p-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-teal-600" />}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <div>{toolbar}</div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

// ===== Mock Data =====
const mockApplicants = Array.from({ length: 14 }).map((_, i) => ({
  reg: `PPDB-${String(202500 + i)}`,
  name: [
    "Alya",
    "Bima",
    "Citra",
    "Dika",
    "Eka",
    "Faris",
    "Gita",
    "Hana",
    "Indra",
    "Joko",
    "Kirana",
    "Lana",
    "Mika",
    "Nina",
  ][i],
  track: ["Zonasi", "Prestasi", "Afirmasi", "Perpindahan"][i % 4],
  grade: 78 + (i % 19),
  distanceKm: (Math.random() * 12 + 0.5).toFixed(1),
  status: ["Menunggu", "Valid", "Perlu Perbaikan"][i % 3] as
    | "Menunggu"
    | "Valid"
    | "Perlu Perbaikan",
}));

const mockQuota = [
  { track: "Zonasi", quota: 60 },
  { track: "Prestasi", quota: 20 },
  { track: "Afirmasi", quota: 20 },
  { track: "Perpindahan", quota: 8 },
];

// ===== Helper: Tiny Map Preview (SVG) =====
function MapPreview({ radiusKm }: { radiusKm: number }) {
  const px = useMemo(() => Math.min(90, radiusKm * 8), [radiusKm]);
  return (
    <div className="w-full h-[240px] rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center bg-theme-color-primary/5">
      <svg viewBox="0 0 300 220" className="w-full h-full">
        <rect width="300" height="220" fill="transparent" />
        <circle
          cx="150"
          cy="110"
          r={px}
          fill="rgba(45, 212, 191, 0.1)"
          stroke="#2dd4bf"
          strokeDasharray="6 4"
        />
        <g transform="translate(150 110)">
          <circle r="6" fill="#0f766e" />
        </g>
        <text
          x="150"
          y="200"
          textAnchor="middle"
          fontSize="12"
          fill="#f1f5f9"
        >
          Radius: {radiusKm.toFixed(1)} km
        </text>
      </svg>
    </div>
  );
}

// ===== Main Component =====
export const PPDBMain = () => {
  const [year, setYear] = useState("2025/2026");
  const [level, setLevel] = useState("SMP");
  const [radius, setRadius] = useState<number>(7.5);
  const [tab, setTab] = useState("summary");

  const totals = {
    total: mockApplicants.length,
    valid: 5,
    pending: 6,
    fix: 3,
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-white/20 px-3 py-1 text-sm bg-theme-color-primary text-white"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-lg border border-white/20 px-3 py-1 text-sm bg-theme-color-primary text-white"
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </div>
        <div className="flex items-center gap-3">
          {/* <div className="h-8 w-8 rounded-lg bg-teal-600 grid place-items-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              PPDB — Dashboard Admin
            </h1>
          </div> */}
            <div className="text-xs text-white">
              Hybrid (Mandiri ↔ Integrasi Pemerintah)
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2 bg-theme-color-primary/10 p-1 rounded-xl">
          <button
            onClick={() => setTab("summary")}
            className={clsx(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
              tab === "summary"
                ? "bg-teal-600 text-white"
                : "text-white hover:bg-theme-color-primary/15"
            )}
          >
            <Gauge className="h-4 w-4" />
            Ringkasan
          </button>
          <button
            onClick={() => setTab("form")}
            className={clsx(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
              tab === "form"
                ? "bg-teal-600 text-white"
                : "text-white hover:bg-theme-color-primary/15"
            )}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Formulir
          </button>
          <button
            onClick={() => setTab("verify")}
            className={clsx(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
              tab === "verify"
                ? "bg-teal-600 text-white"
                : "text-white hover:bg-theme-color-primary/15"
            )}
          >
            <ClipboardList className="h-4 w-4" />
            Verifikasi
          </button>
          <button
            onClick={() => setTab("zone")}
            className={clsx(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
              tab === "zone"
                ? "bg-teal-600 text-white"
                : "text-white hover:bg-theme-color-primary/15"
            )}
          >
            <MapPin className="h-4 w-4" />
            Zonasi
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6">
        {tab === "summary" && (
          <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              icon={Users2}
              label="Total Pendaftar"
              value={totals.total}
              hint="Semua jalur"
            />
            <Stat
              icon={CheckCircle2}
              label="Diverifikasi"
              value={totals.valid}
              hint="Status valid"
              tone="sky"
            />
            <Stat
              icon={Info}
              label="Menunggu"
              value={totals.pending}
              hint="Proses verifikasi"
              tone="violet"
            />
            <Stat
              icon={XCircle}
              label="Perlu Perbaikan"
              value={totals.fix}
              hint="Dokumen bermasalah"
              tone="amber"
            />
          </div>
        )}

        {tab === "zone" && (
          <div className="col-span-12">
            <Card title="Zonasi & Kuota" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm text-white">Radius Zonasi (km)</label>
                  <input
                    type="range"
                    min={0.5}
                    max={25}
                    step={0.5}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-white">{radius} km</div>
                </div>
                <MapPreview radiusKm={radius} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};