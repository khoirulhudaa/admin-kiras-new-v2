// @ts-nocheck
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  History as HistoryIcon,
  Link as LinkIcon,
  ListChecks,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCcw,
  Settings,
  SquareChartGantt,
  Trash2,
  UploadCloud,
  Users,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  PieChart as RPieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// API base URL
const API_BASE_URL = "https://dev.kiraproject.id/api/v1";

// Utility to get admin token
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// Utility for API requests with error handling
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: { ...getAuthHeaders(), ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

function clsx(...a) {
  return a.filter(Boolean).join(" ");
}

// ------------------------- Mock Helpers -------------------------
const nowIso = () => new Date().toISOString().slice(0, 16);
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (d) => new Date(d).toLocaleString();

// ------------------------- Types (JSDoc) ------------------------
/**
 * @typedef {Object} Election
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string} tahunAjaran
 * @property {string} posterUrl
 * @property {string} regStart
 * @property {string} regEnd
 * @property {string} verifyStart
 * @property {string} verifyEnd
 * @property {string} campaignStart
 * @property {string} campaignEnd
 * @property {string} voteStart
 * @property {string} voteEnd
 * @property {string} announceAt
 * @property {string} status // draft, registration, verification, campaign, voting, announcement, archived
 */

/** @typedef {{ id: string; name: string; kelasText?: string; avatarUrl?: string; visi?: string; misi?: string[]; tags?: string[]; programUnggulan?: string[]; order: number }} Candidate */
/** @typedef {{ id: string; nis: string; name: string; classId: string; address?: string; phone?: string }} Student */
/** @typedef {{ id: string; name: string; phone?: string }} Staff */
/** @typedef {{ id: string; name: string }} ClassItem */
/** @typedef {{ candidateId: string; count: number; name: string; kelasText: string; avatarUrl: string }} VoteSummary */

// ------------------------- Seed Data (for classes/students/staff) ----------------------------
const SEED_CLASSES = [
  { id: "7A", name: "VII-A" },
  { id: "7B", name: "VII-B" },
  { id: "8A", name: "VIII-A" },
  { id: "9A", name: "IX-A" },
];

const SEED_STUDENTS = Array.from({ length: 64 }).map((_, i) => {
  const c = SEED_CLASSES[i % SEED_CLASSES.length];
  return {
    id: `stu_${uid()}`,
    nis: `${24000 + i}`,
    name: `Siswa ${i + 1}`,
    classId: c.id,
    address: `Jl. Contoh No.${i + 3}`,
    phone: `08${Math.floor(1000000000 + Math.random() * 899999999)}`,
  };
});

const SEED_STAFF = [
  "Kepala Sekolah",
  "Wakil Kurikulum",
  "TU 1",
  "TU 2",
  "Guru BK",
].map((s, i) => ({
  id: `st_${i}`,
  name: s,
  phone: `08${Math.floor(100000000 + Math.random() * 899999999)}`,
}));

// ------------------------- CSV Helpers --------------------------
function toCSV(rows, headers) {
  const h = headers || Object.keys(rows[0] || {});
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [h.join(","), ...rows.map((r) => h.map((k) => esc(r[k])).join(","))].join("\n");
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------------- UI Elements --------------------------
function Pill({ children, color = "sky" }) {
  const map = {
    sky: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    emerald: "bg-emerald-100 text-emerald-700",
    zinc: "bg-zinc-200 text-zinc-800",
  };
  return (
    <span className={clsx("px-2 pb-0.5 pt-1 rounded-md text-xs font-medium", map[color] || map.sky)}>
      {children}
    </span>
  );
}

function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={clsx(
              "relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full mx-4",
              wide ? "max-w-5xl" : "max-w-2xl"
            )}
          >
            <div className="p-4 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

const COLORS = ['#14B8A6', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

// ------------------------- Main Component -----------------------
export const OsisMain = () => {
  // Theme
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Master data (still using local state for classes/students/staff)
  const [classes, setClasses] = useState(SEED_CLASSES);
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [staff, setStaff] = useState(SEED_STAFF);

  // API-driven state
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voteSummary, setVoteSummary] = useState({ totalVotes: 0, summary: [] });

  // UI State
  const [tab, setTab] = useState("live");
  const [modal, setModal] = useState(null);
  const [ctx, setCtx] = useState({});
  const [qElection, setQElection] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [qStudent, setQStudent] = useState("");
  const [filterClass, setFilterClass] = useState("ALL");

  // Fetch elections on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await apiFetch("/events");
        setElections(data.data || []);
      } catch (error) {
        console.error("Failed to fetch elections:", error);
      }
    };
    fetchElections();
  }, []);

  // Fetch candidates on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await apiFetch("/candidates");
        setCandidates(data.data || []);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  // Polling for vote summary of active election
  const activeElection = useMemo(() => elections.find((e) => e.status === "voting") || null, [elections]);

  useEffect(() => {
    if (!activeElection) {
      setVoteSummary({ totalVotes: 0, summary: [] });
      return;
    }

    const fetchVoteSummary = async () => {
      try {
        const data = await apiFetch(`/events/${activeElection.id}/votes/summary`);
        setVoteSummary(data.data || { totalVotes: 0, summary: [] });
      } catch (error) {
        console.error("Failed to fetch vote summary:", error);
      }
    };

    fetchVoteSummary();
    const interval = setInterval(fetchVoteSummary, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [activeElection]);

  // Derived counts for active election
  const liveCounts = useMemo(() => {
    if (!activeElection) return [];
    return voteSummary.summary.map((item) => ({
      name: item.name,
      id: item.candidateId,
      votes: item.count,
    }));
  }, [voteSummary, activeElection]);

  const totalEligible = useMemo(() => {
    if (!activeElection) return 0;
    // Assuming students are filtered by class for KETUA_KELAS; API may need to provide this
    return students.length; // Adjust based on API if available
  }, [students, activeElection]);

  const totalVoted = useMemo(() => voteSummary.totalVotes || 0, [voteSummary]);

  // ------------------------- Actions ----------------------------
  const createElection = async (payload) => {
    try {
      const data = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          slug: payload.title.toLowerCase().replace(/\s+/g, "-"),
          description: payload.title,
          tahunAjaran: "2024/2025", // Adjust as needed
          posterUrl: "",
          regStart: payload.start,
          regEnd: payload.start,
          verifyStart: payload.start,
          verifyEnd: payload.start,
          campaignStart: payload.start,
          campaignEnd: payload.end,
          voteStart: payload.start,
          voteEnd: payload.end,
          announceAt: payload.end,
        }),
      });
      setElections((es) => [...es, data.data]);
    } catch (error) {
      console.error("Failed to create election:", error);
    }
  };

  const updateElection = async (id, patch) => {
    try {
      const data = await apiFetch(`/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setElections((es) => es.map((e) => (e.id === id ? data.data : e)));
    } catch (error) {
      console.error("Failed to update election:", error);
    }
  };

  const publishElection = async (id) => {
    try {
      await apiFetch(`/events/${id}/publish`, { method: "POST" });
      setElections((es) =>
        es.map((e) => (e.id === id ? { ...e, status: "registration" } : e))
      );
    } catch (error) {
      console.error("Failed to publish election:", error);
    }
  };

  const closeElection = async (id) => {
    try {
      await apiFetch(`/events/${id}/close`, { method: "POST" });
      setElections((es) =>
        es.map((e) => (e.id === id ? { ...e, status: "archived" } : e))
      );
    } catch (error) {
      console.error("Failed to close election:", error);
    }
  };

  const removeElection = async (id) => {
    try {
      await apiFetch(`/events/${id}`, { method: "DELETE" });
      setElections((es) => es.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete election:", error);
    }
  };

  const addCandidate = async (payload) => {
    try {
      const data = await apiFetch(`/events/${activeElection?.id || elections[0]?.id}/candidates`, {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          kelasText: payload.classId || "",
          avatarUrl: payload.photo || "",
          visi: payload.manifesto || "",
          misi: payload.manifesto ? [payload.manifesto] : [],
          tags: [],
          programUnggulan: [],
          order: candidates.length + 1,
        }),
      });
      setCandidates((cs) => [...cs, data.data]);
    } catch (error) {
      console.error("Failed to add candidate:", error);
    }
  };

  const editCandidate = async (id, patch) => {
    try {
      const data = await apiFetch(`/candidates/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setCandidates((cs) => cs.map((c) => (c.id === id ? data.data : c)));
    } catch (error) {
      console.error("Failed to edit candidate:", error);
    }
  };

  const delCandidate = async (id) => {
    try {
      await apiFetch(`/candidates/${id}`, { method: "DELETE" });
      setCandidates((cs) => cs.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete candidate:", error);
    }
  };

  const addStudent = (payload) => setStudents((ss) => [...ss, { id: `stu_${uid()}`, ...payload }]);
  const editStudent = (id, patch) => setStudents((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const delStudent = (id) => setStudents((ss) => ss.filter((s) => s.id !== id));

  const addClass = (payload) => setClasses((cs) => [...cs, { id: payload.id || uid(), ...payload }]);
  const delClass = (id) => setClasses((cs) => cs.filter((c) => c.id !== id));

  const importStudentsCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const [h, ...rows] = lines;
    const cols = h.split(",").map((s) => s.trim());
    const idx = (k) => cols.indexOf(k);
    const parsed = rows.map((r) => {
      const c = r.split(",");
      return {
        id: `stu_${uid()}`,
        nis: c[idx("nis")],
        name: c[idx("name")],
        classId: c[idx("classId")],
        address: c[idx("address")],
        phone: c[idx("phone")],
      };
    });
    setStudents((ss) => [...ss, ...parsed]);
  };

  const exportWinnersCSV = () => {
    const winners = computeHistory();
    download(
      `winners_${Date.now()}.csv`,
      toCSV(winners, ["electionId", "electionTitle", "scope", "winner", "votes", "total", "timestamp"])
    );
  };

  const computeHistory = () => {
    const arr = [];
    elections
      .filter((e) => e.status === "archived")
      .forEach(async (e) => {
        try {
          const data = await apiFetch(`/events/${e.id}/votes/summary`);
          const summary = data.data.summary || [];
          const winner = summary.sort((a, b) => b.count - a.count)[0];
          arr.push({
            electionId: e.id,
            electionTitle: e.title,
            scope: e.type === "OSIS" ? "Sekolah" : e.scopeClasses?.join(", ") || "N/A",
            winner: winner?.name || "-",
            votes: winner?.count || 0,
            total: data.data.totalVotes || 0,
            timestamp: e.announceAt,
          });
        } catch (error) {
          console.error(`Failed to fetch votes for election ${e.id}:`, error);
        }
      });
    return arr;
  };

  const historyRows = useMemo(() => computeHistory(), [elections, candidates, voteSummary]);

  // ------------------------- Render ------------------------------
  return (
    <div className={clsx("min-h-screen", dark ? "text-zinc-100" : "bg-zinc-50 text-zinc-900")}>
      <main className="max-w-full relative mt-[-24px] mx-auto py-6 grid gap-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "live", label: "Live Counting", icon: SquareChartGantt },
            { key: "elections", label: "Pemilihan", icon: ListChecks },
            { key: "master", label: "Master Data", icon: Building2 },
            { key: "history", label: "History", icon: HistoryIcon },
            { key: "settings", label: "Pengaturan", icon: Settings },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "px-3 py-1 rounded-md text-sm flex items-center gap-2 border",
                tab === t.key ? "bg-sky-500 text-white border-sky-500" : "border-zinc-300/20 hover:bg-zinc-100/10"
              )}
            >
              {React.createElement(t.icon, { size: 16 })} {t.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-1 rounded-md border border-zinc-300/20 text-sm hover:bg-zinc-100/10"
            >
              {dark ? "Mode Terang" : "Mode Gelap"}
            </button>
            <a
              className="px-3 py-1 rounded-md border border-zinc-300/20 text-sm hover:bg-zinc-100/10 flex items-center gap-1"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setModal("public");
              }}
            >
              <Eye size={14} /> Layar Publik
            </a>
            <a
              className="px-3 py-1 rounded-md border border-zinc-300/20 text-sm hover:bg-zinc-100/10 flex items-center gap-1"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setModal("help");
              }}
            >
              <FileText size={14} /> SOP
            </a>
          </div>
        </div>

        {/* LIVE */}
        {tab === "live" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-zinc-500">Pemilihan Aktif</div>
                    <div className="font-semibold text-lg">{activeElection ? activeElection.title : "— tidak ada —"}</div>
                    <div className="text-xs text-zinc-500">
                      {activeElection ? `${fmt(activeElection.voteStart)} s/d ${fmt(activeElection.voteEnd)}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!activeElection && (
                      <button
                        onClick={() => {
                          const e = elections.find((e) => e.status === "draft" || e.status === "registration");
                          if (!e) return;
                          publishElection(e.id);
                        }}
                        className="px-3 py-1 rounded-md text-sm bg-emerald-600 text-white flex items-center gap-2"
                      >
                        <Play size={14} /> Mulai (contoh)
                      </button>
                    )}
                    {activeElection && (
                      <>
                        <button
                          onClick={() => closeElection(activeElection.id)}
                          className="px-3 py-1 rounded-md text-sm bg-rose-600 text-white flex items-center gap-2"
                        >
                          <Pause size={14} /> Akhiri
                        </button>
                        <button
                          onClick={() => setVoteSummary({ totalVotes: 0, summary: [] })}
                          className="px-3 py-1 rounded-md text-sm bg-zinc-800 text-white flex items-center gap-2"
                        >
                          <RefreshCcw size={14} /> Reset Suara
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat title="Total Pemilih" value={totalEligible} icon={Users} />
                  <Stat title="Sudah Memilih" value={totalVoted} icon={CheckCircle2} />
                  <Stat
                    title="Partisipasi (%)"
                    value={totalEligible ? ((totalVoted / totalEligible) * 100) | 0 : 0}
                    icon={BarChart3}
                  />
                  <Stat title="Status" value={activeElection ? activeElection.status : "—"} icon={Clock} />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Grafik Perolehan Suara</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModal("public")}
                      className="px-3 py-1 rounded-md border border-zinc-300/20 text-sm flex items-center gap-2"
                    >
                      <LinkIcon size={14} /> Tampilkan di Layar Publik
                    </button>
                    <button
                      onClick={() => setModal("cand")}
                      className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                    >
                      <Users size={14} /> Kelola Kandidat
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liveCounts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" hide={false} angle={-15} textAnchor="end" interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                          {liveCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie data={liveCounts} dataKey="votes" nameKey="name" outerRadius={100} label>
                          {liveCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Log Suara Terbaru</h3>
                </div>
                <div className="max-h-80 overflow-auto space-y-2 pr-1">
                  {/* Note: Log requires vote details; API doesn't provide individual vote logs */}
                  <div className="text-sm text-zinc-500">Log suara tidak tersedia dari API saat ini.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <h3 className="font-semibold mb-3">Pemenang Sementara</h3>
                <ol className="space-y-2 text-sm">
                  {liveCounts.map((r, i) => (
                    <li key={r.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill color={i === 0 ? "emerald" : "zinc"}>{i + 1}</Pill> {r.name}
                      </div>
                      <div className="font-semibold">{r.votes}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ELECTIONS */}
        {tab === "elections" && (
          <section className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Daftar Pemilihan</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal("newElection")}
                  className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                >
                  <Plus size={14} /> Tambah Pemilihan
                </button>
                <button
                  onClick={() => setModal("cand")}
                  className="px-3 py-1 rounded-md border border-zinc-300/20 text-sm flex items-center gap-2"
                >
                  <Users size={14} /> Kandidat
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border border-zinc-300/20 p-3 rounded-md">
              <input
                value={qElection}
                onChange={(e) => setQElection(e.target.value)}
                placeholder="Cari judul pemilihan..."
                className="px-3 py-1 text-sm rounded-md bg-transparent border w-64"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 text-sm rounded-md bg-transparent border"
              >
                <option value="ALL">Semua Jenis</option>
                <option value="OSIS">OSIS</option>
                <option value="KETUA_KELAS">Ketua Kelas</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 text-sm rounded-md bg-transparent border"
              >
                <option value="ALL">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="registration">Registration</option>
                <option value="verification">Verification</option>
                <option value="campaign">Campaign</option>
                <option value="voting">Voting</option>
                <option value="announcement">Announcement</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {(() => {
              const rows = elections.filter(
                (e) =>
                  (filterType === "ALL" || e.type === filterType) &&
                  (filterStatus === "ALL" || e.status === filterStatus) &&
                  (qElection === "" || e.title.toLowerCase().includes(qElection.toLowerCase()))
              );
              return (
                <div className="overflow-auto rounded-2xl border border-zinc-300/20">
                  <table className="min-w-full text-sm">
                    <thead className="bg-zinc-100/50 dark:bg-theme-color-primary/5">
                      <tr className="text-left">
                        <th className="p-3">Judul</th>
                        <th className="p-3">Jenis</th>
                        <th className="p-3">Jadwal</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((e) => (
                        <tr key={e.id} className="border-t border-zinc-200/10 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/40">
                          <td className="p-3 font-medium">{e.title}</td>
                          <td className="p-3">{e.type === "OSIS" ? <Pill color="sky">OSIS</Pill> : <Pill color="amber">Ketua Kelas</Pill>}</td>
                          <td className="p-3 text-xs">{fmt(e.voteStart)} s/d {fmt(e.voteEnd)}</td>
                          <td className="p-3">
                            <Pill color={e.status === "voting" ? "emerald" : e.status === "archived" ? "rose" : "zinc"}>
                              {e.status}
                            </Pill>
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            {e.status === "draft" && (
                              <button
                                onClick={() => publishElection(e.id)}
                                className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs flex items-center gap-1"
                              >
                                <Play size={12} /> Publikasi
                              </button>
                            )}
                            {e.status === "voting" && (
                              <button
                                onClick={() => closeElection(e.id)}
                                className="px-2 py-1 rounded-md bg-rose-600 text-white text-xs flex items-center gap-1"
                              >
                                <Pause size={12} /> Akhiri
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setCtx({ e });
                                setModal("editElection");
                              }}
                              className="px-2 py-1 rounded-md border text-xs flex items-center gap-1"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => removeElection(e.id)}
                              className="px-2 py-1 rounded-md border text-xs flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </section>
        )}

        {/* MASTER */}
        {tab === "master" && (
          <section className="grid lg:grid-cols-1 gap-6">
            {/* Siswa */}
            <div className="p-4 rounded-2xl border border-zinc-300/20">
              <div className="flex items-center justify-between mb-3">
                {/* <h3 className="font-semibold">Data Siswa</h3> */}
                <div className="flex items-center gap-2">
                  <input
                    value={qStudent}
                    onChange={(e) => setQStudent(e.target.value)}
                    placeholder="Cari NIS/Nama..."
                    className="px-3 py-1 text-sm rounded-md bg-transparent border w-48"
                  />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="px-3 py-1 text-sm rounded-md bg-transparent border"
                  >
                    <option value="ALL">Semua Kelas</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setModal("addStudent")}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                  <button
                    onClick={() => {
                      const csv = toCSV(
                        [
                          {
                            nis: "24000",
                            name: "Budi",
                            classId: "7A",
                            address: "Jl. Mawar 1",
                            phone: "0812345678",
                          },
                        ],
                        ["nis", "name", "classId", "address", "phone"]
                      );
                      download("template_siswa.csv", csv);
                    }}
                    className="px-3 py-1 rounded-md border text-sm flex items-center gap-2"
                  >
                    <Download size={14} /> Template CSV
                  </button>
                  <button
                    onClick={() => setModal("importCSV")}
                    className="px-3 py-1 rounded-md border text-sm flex items-center gap-2"
                  >
                    <UploadCloud size={14} /> Import CSV
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto rounded-md">
                {(() => {
                  const rows = students.filter(
                    (s) =>
                      (filterClass === "ALL" || s.classId === filterClass) &&
                      (qStudent === "" || `${s.nis} ${s.name}`.toLowerCase().includes(qStudent.toLowerCase()))
                  );
                  return (
                    <table className="min-w-full text-sm">
                      <thead className="bg-zinc-100/50 dark:bg-theme-color-primary/5 sticky top-0">
                        <tr className="text-left">
                          <th className="p-2">NIS</th>
                          <th className="p-2">Nama</th>
                          <th className="p-2">Kelas</th>
                          <th className="p-2">Alamat</th>
                          <th className="p-2">No. HP</th>
                          <th className="p-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 200).map((s) => (
                          <tr
                            key={s.id}
                            className="border-t border-zinc-200/10 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/40"
                          >
                            <td className="p-2">{s.nis}</td>
                            <td className="p-2">{s.name}</td>
                            <td className="p-2">{s.classId}</td>
                            <td className="p-2">{s.address}</td>
                            <td className="p-2">{s.phone}</td>
                            <td className="p-2 flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCtx({ s });
                                  setModal("editStudent");
                                }}
                                className="px-2 py-1 rounded-md border text-xs flex items-center gap-1"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => delStudent(s.id)}
                                className="px-2 py-1 rounded-md border text-xs flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>

            {/* Kelas & Kandidat */}
            <div className="grid gap-6">
              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Kelas</h3>
                  <button
                    onClick={() => setModal("addClass")}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <div
                      key={c.id}
                      className="px-3 py-1 rounded-md border border-zinc-300/20 bg-white/50 dark:bg-theme-color-primary/5 flex items-center gap-2"
                    >
                      <GraduationCap size={16} /> <span className="font-medium text-sm">{c.name}</span>
                      <button onClick={() => delClass(c.id)} className="ml-2 text-xs px-2 py-0.5 rounded-md border">
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-300/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Kandidat</h3>
                  <button
                    onClick={() => setModal("cand")}
                    className="px-3 py-1 rounded-md border text-sm flex items-center gap-2"
                  >
                    <Users size={14} /> Kelola
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {candidates.map((c) => (
                    <div key={c.id} className="p-3 rounded-md border border-zinc-300/20 bg-white/50 dark:bg-theme-color-primary/5">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-zinc-500 line-clamp-2">{c.visi || "—"}</div>
                      <div className="text-xs mt-1">{c.kelasText ? `Kelas: ${c.kelasText}` : "OSIS"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <section className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">History Pemenang</h3>
              <div className="flex items-center gap-2">
                <button onClick={exportWinnersCSV} className="px-3 py-1 rounded-md border text-sm flex items-center gap-2">
                  <Download size={14} /> Ekspor CSV
                </button>
              </div>
            </div>

            <div className="overflow-auto rounded-2xl border border-zinc-300/20">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-100/50 dark:bg-theme-color-primary/5">
                  <tr className="text-left">
                    <th className="p-3">Pemilihan</th>
                    <th className="p-3">Ruang Lingkup</th>
                    <th className="p-3">Pemenang</th>
                    <th className="p-3">Suara</th>
                    <th className="p-3">Total Suara</th>
                    <th className="p-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((r, i) => (
                    <tr key={i} className="border-t border-zinc-200/10">
                      <td className="p-3">{r.electionTitle}</td>
                      <td className="p-3">{r.scope}</td>
                      <td className="p-3 font-medium">{r.winner}</td>
                      <td className="p-3">{r.votes}</td>
                      <td className="p-3">{r.total}</td>
                      <td className="p-3 text-xs">{fmt(r.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <section className="grid gap-6">
            <div className="p-4 rounded-2xl border border-zinc-300/20">
              <h3 className="font-semibold mb-3">Pengaturan Umum</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Mode Akses Tendik (Read-Only)">
                  <select className="px-3 py-2 rounded-md bg-transparent border">
                    <option>Aktif</option>
                    <option>Nonaktif</option>
                  </select>
                </Field>
                <Field label="Verifikasi OTP / NIS Sebelum Voting (front-end siswa)">
                  <select className="px-3 py-2 rounded-md bg-transparent border">
                    <option>Aktif</option>
                    <option>Nonaktif</option>
                  </select>
                </Field>
                <Field label="Publikasi Link Live Counting">
                  <input className="px-3 py-2 rounded-md bg-transparent border w-full" value="/public/live/election" readOnly />
                </Field>
                <Field label="Hash & Audit Trail (server)">
                  <div className="text-xs text-zinc-500">Aktifkan di backend untuk menyimpan hash ballot + log chain.</div>
                </Field>
              </div>
            </div>
          </section>
        )}

        {/* MODALS */}
        <Modal open={modal === "public"} onClose={() => setModal(null)} title="Layar Publik — Live Counting" wide>
          <PublicScreen
            election={activeElection}
            counts={liveCounts}
            totalEligible={totalEligible}
            totalVoted={totalVoted}
          />
        </Modal>

        <Modal open={modal === "newElection"} onClose={() => setModal(null)} title="Tambah Pemilihan">
          <ElectionForm classes={classes} onSubmit={(payload) => { createElection(payload); setModal(null); }} />
        </Modal>
        <Modal open={modal === "editElection"} onClose={() => setModal(null)} title="Edit Pemilihan">
          <ElectionForm classes={classes} initial={ctx.e} onSubmit={(payload) => { updateElection(ctx.e.id, payload); setModal(null); }} />
        </Modal>

        <Modal open={modal === "cand"} onClose={() => setModal(null)} title="Kelola Kandidat" wide>
          <CandidateManager
            candidates={candidates}
            classes={classes}
            onAdd={(p) => addCandidate(p)}
            onEdit={(id, p) => editCandidate(id, p)}
            onDel={(id) => delCandidate(id)}
          />
        </Modal>

        <Modal open={modal === "addStudent"} onClose={() => setModal(null)} title="Tambah Siswa">
          <StudentForm classes={classes} onSubmit={(p) => { addStudent(p); setModal(null); }} />
        </Modal>
        <Modal open={modal === "editStudent"} onClose={() => setModal(null)} title="Edit Siswa">
          <StudentForm classes={classes} initial={ctx.s} onSubmit={(p) => { editStudent(ctx.s.id, p); setModal(null); }} />
        </Modal>

        <Modal open={modal === "importCSV"} onClose={() => setModal(null)} title="Import Siswa via CSV">
          <CSVImporter onText={(t) => importStudentsCSV(t)} />
        </Modal>

        <Modal open={modal === "addClass"} onClose={() => setModal(null)} title="Tambah Kelas">
          <AddClassForm onSubmit={(p) => { addClass(p); setModal(null); }} />
        </Modal>

        <Modal open={modal === "help"} onClose={() => setModal(null)} title="SOP Singkat">
          <ol className="list-decimal pl-4 space-y-1 text-sm">
            <li>Buat pemilihan via API dan set jadwal.</li>
            <li>Tambahkan kandidat melalui endpoint kandidat.</li>
            <li>Import DPT (siswa) via CSV atau input manual.</li>
            <li>Publikasikan pemilihan untuk memulai voting.</li>
            <li>Live counting diperbarui otomatis via API.</li>
            <li>Lihat pemenang pada tab <b>History</b> dan ekspor CSV.</li>
          </ol>
        </Modal>
      </main>
    </div>
  );
};

// ------------------------- Subcomponents ------------------------
function Stat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-md border border-zinc-300/20 bg-white/50 dark:bg-theme-color-primary/5 p-3">
      <div className="flex items-center gap-2 text-zinc-500 text-xs">
        <Icon size={14} /> {title}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ElectionForm({ initial, onSubmit, classes }) {
  const [type, setType] = useState(initial?.type || "OSIS");
  const [title, setTitle] = useState(initial?.title || "");
  const [start, setStart] = useState(initial?.voteStart || nowIso());
  const [end, setEnd] = useState(initial?.voteEnd || nowIso());
  const [scopeClasses, setScopeClasses] = useState(initial?.scopeClasses || []);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ type, title, start, end, scopeClasses });
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <Field label="Jenis Pemilihan">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border">
          <option value="OSIS">OSIS (Sekolah)</option>
          <option value="KETUA_KELAS">Ketua Kelas</option>
        </select>
      </Field>
      <Field label="Judul">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-3 py-2 rounded-md bg-transparent border w-full"
          placeholder="Mis. Pemilihan Ketua OSIS 2025"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Mulai Voting">
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full" />
        </Field>
        <Field label="Selesai Voting">
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full" />
        </Field>
      </div>
      {type === "KETUA_KELAS" && (
        <Field label="Kelas yang Ikut">
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => {
              const act = scopeClasses.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() =>
                    setScopeClasses((arr) => (act ? arr.filter((x) => x !== c.id) : [...arr, c.id]))
                  }
                  className={clsx("px-3 py-1 rounded-md border text-sm", act ? "bg-sky-600 text-white border-sky-600" : "")}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </Field>
      )}
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function CandidateManager({ candidates, classes, onAdd, onEdit, onDel }) {
  const [q, setQ] = useState("");
  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kandidat..."
          className="px-3 py-2 rounded-md bg-transparent border w-80"
        />
        <button
          onClick={() => {
            const name = prompt("Nama kandidat?");
            if (!name) return;
            const khususKelas = confirm("Khusus kelas? OK = Ya, Cancel = OSIS");
            let classId = undefined;
            if (khususKelas) {
              classId = prompt("Masukkan ID Kelas (contoh: 7A, 8A)") || undefined;
            }
            const manifesto = prompt("Visi singkat?") || "";
            onAdd({ name, classId, manifesto });
          }}
          className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
        >
          <Plus size={14} /> Tambah Kandidat
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <div key={c.id} className="p-3 rounded-md border border-zinc-300/20 bg-white/50 dark:bg-theme-color-primary/5">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-zinc-500">{c.kelasText ? `Kelas: ${c.kelasText}` : "OSIS"}</div>
            <div className="text-xs mt-1 line-clamp-2">{c.visi || "—"}</div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  const name = prompt("Ubah nama", c.name) || c.name;
                  const visi = prompt("Visi", c.visi || "") || "";
                  const kelasText = prompt("Kelas (kosongkan untuk OSIS)", c.kelasText || "") || undefined;
                  onEdit(c.id, { name, visi, kelasText });
                }}
                className="px-2 py-1 rounded-md border text-xs flex items-center gap-1"
              >
                <Pencil size={12} /> Edit
              </button>
              <button onClick={() => onDel(c.id)} className="px-2 py-1 rounded-md border text-xs flex items-center gap-1">
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentForm({ initial, onSubmit, classes }) {
  const [nis, setNis] = useState(initial?.nis || "");
  const [name, setName] = useState(initial?.name || "");
  const [classId, setClassId] = useState(initial?.classId || classes[0]?.id || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [phone, setPhone] = useState(initial?.phone || "");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ nis, name, classId, address, phone });
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="NIS">
          <input value={nis} onChange={(e) => setNis(e.target.value)} required className="px-3 py-2 rounded-md bg-transparent border w-full" />
        </Field>
        <Field label="Nama">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="px-3 py-2 rounded-md bg-transparent border w-full" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Kelas">
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="No. HP">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full" />
        </Field>
      </div>
      <Field label="Alamat">
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full" />
      </Field>
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function CSVImporter({ onText }) {
  const ta = useRef(null);
  return (
    <div className="grid gap-3 text-sm">
      <div>
        Tempel CSV di bawah (header: <code>nis,name,classId,address,phone</code>) kemudian klik Import.
      </div>
      <textarea
        ref={ta}
        rows={8}
        className="w-full rounded-md border bg-transparent p-3 font-mono text-xs"
        placeholder={`nis,name,classId,address,phone\n24001,Sinta,7A,Jl. Melur 2,08123...`}
      ></textarea>
      <div className="flex justify-end">
        <button onClick={() => onText(ta.current.value)} className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">
          Import
        </button>
      </div>
    </div>
  );
}

function AddClassForm({ onSubmit }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id, name: name || id });
      }}
      className="grid gap-3"
    >
      <Field label="ID Kelas (mis. 7A)">
        <input value={id} onChange={(e) => setId(e.target.value)} required className="px-3 py-2 rounded-md bg-transparent border w-full" />
      </Field>
      <Field label="Nama Tampilan">
        <input value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-md bg-transparent border w-full" />
      </Field>
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function PublicScreen({ election, counts, totalEligible, totalVoted }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-zinc-500">Live Counting</div>
          <div className="text-2xl font-bold">{election ? election.title : "Tidak ada pemilihan aktif"}</div>
          {election && <div className="text-xs text-zinc-500">{new Date().toLocaleString()}</div>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-md bg-zinc-100/50 dark:bg-theme-color-primary/5">
            <div className="text-xs">Pemilih</div>
            <div className="text-xl font-semibold">{totalEligible}</div>
          </div>
          <div className="text-center p-2 rounded-md bg-zinc-100/50 dark:bg-theme-color-primary/5">
            <div className="text-xs">Memilih</div>
            <div className="text-xl font-semibold">{totalVoted}</div>
          </div>
          <div className="text-center p-2 rounded-md bg-zinc-100/50 dark:bg-theme-color-primary/5">
            <div className="text-xs">Partisipasi</div>
            <div className="text-xl font-semibold">{totalEligible ? ((totalVoted / totalEligible) * 100) | 0 : 0}%</div>
          </div>
        </div>
      </div>
      <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={counts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
            {counts.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}