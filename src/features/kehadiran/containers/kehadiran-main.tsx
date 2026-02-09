import { useSchool } from "@/features/schools";
import { useQuery } from "@tanstack/react-query"; // Tambahkan ini
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DownloadIcon,
  Filter,
  Loader,
  RefreshCw,
  Users
} from "lucide-react";
import moment from "moment";
import { useState } from "react";

// Konfigurasi API
const API_BASE = "https://be-school.kiraproject.id/siswa";
const API_KELAS = "https://be-school.kiraproject.id/kelas";

export default function AttendanceMain() {
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- States (Hanya untuk UI & Filter) ---
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    class: "",
    batch: "",
    role: "student",
    month: moment().format("MM"),
    year: moment().format("YYYY")
  });

  // --- 1. Fetch Daftar Kelas (useQuery) ---
  const { data: classList = [] } = useQuery({
    queryKey: ["classList", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_KELAS}?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });

  // --- 2. Fetch Data Log Kehadiran (useQuery) ---
  const { data: attendanceResponse, isLoading: loading, refetch, isFetching } = useQuery({
    queryKey: ["attendance", schoolId, filters], // Otomatis refetch jika filter berubah
    queryFn: async () => {
      const query = new URLSearchParams({
        schoolId: schoolId!.toString(),
        role: filters.role,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        year: filters.year,
        month: filters.month,
        ...(filters.class && { className: filters.class }),
        ...(filters.batch && { batch: filters.batch }),
      });

      const res = await fetch(`${API_BASE}/attendance-report?${query}`);
      const json = await res.json();
      return json;
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // Stale 5 menit
    gcTime: 10 * 60 * 1000,   // GC 10 menit
  });

  // Mapping data dari response
  const data = attendanceResponse?.data || [];
  const pagination = attendanceResponse?.pagination || { totalItems: 0, totalPages: 1, currentPage: 1 };

  // --- 3. Handle Export Excel (Tetap Manual) ---
  const handleExport = async (type: 'monthly' | 'yearly') => {
    if (!schoolId) return;
    setExportLoading(true);
    try {
      const query = new URLSearchParams({
        schoolId: schoolId.toString(),
        year: filters.year,
        ...(type === 'monthly' && { month: filters.month }),
        ...(filters.class && { className: filters.class }),
        ...(filters.batch && { batch: filters.batch }),
      });

      const response = await fetch(`${API_BASE}/export-attendance?${query}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Absensi_${type}_${filters.year}_${filters.month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Gagal mengunduh laporan Excel");
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      ...filters,
      page: 1,
      class: "",
      batch: "",
      month: moment().format("MM"),
      year: moment().format("YYYY")
    });
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Users size={14} /> Attendance Analytics
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Log <span className="text-blue-600">Absensi</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Monitoring aktivitas scan kartu</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex gap-2 bg-white/5 h-14 w-fit overflow-hidden rounded-2xl border border-blue-700">
           {['student', 'teacher'].map((r) => (
              <button
                key={r}
                onClick={() => setFilters({...filters, role: r, page: 1})}
                className={`h-14 px-5 font-black uppercase text-[12px] tracking-widest transition-all ${
                  filters.role === r ? 'bg-blue-600 text-white' : 'text-white/70 hover:text-zinc-300'
                }`}
              >
                {r === 'student' ? 'Data Siswa' : 'Data Guru'}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleExport('monthly')}
            disabled={exportLoading}
            className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
          >
            {exportLoading ? <Loader className="animate-spin" size={16} /> : <DownloadIcon size={16} />}
            Bulanan
          </button>
          <button
            onClick={() => handleExport('yearly')}
            disabled={exportLoading}
            className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30"
          >
            <DownloadIcon size={16} />
            Tahunan
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative group">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors z-10" size={16} />
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold relative z-0"
            value={filters.class}
            onChange={(e) => setFilters({...filters, class: e.target.value, page: 1})}
          >
            <option value="" className="bg-[#0B1220]">Semua Kelas</option>
            {classList.map((c: any) => (
              <option key={c.id} value={c.className} className="bg-[#0B1220]">{c.className}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            placeholder="Angkatan..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-blue-500 transition-all font-bold"
            value={filters.batch}
            onChange={(e) => setFilters({...filters, batch: e.target.value, page: 1})}
          />
        </div>

        <div className="flex gap-4 lg:col-span-2">
           <select 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold"
            value={filters.month}
            onChange={(e) => setFilters({...filters, month: e.target.value, page: 1})}
           >
             {moment.months().map((m, i) => (
               <option key={m} value={String(i + 1).padStart(2, '0')} className="bg-[#0B1220]">{m}</option>
             ))}
           </select>
           <select 
            className="w-32 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value, page: 1})}
           >
             {[2024, 2025, 2026].map(y => (
               <option key={y} value={y.toString()} className="bg-[#0B1220]">{y}</option>
             ))}
           </select>
        </div>

        <button 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Waktu Scan</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Informasi {filters.role === 'teacher' ? 'Guru/Staff' : 'Siswa'}
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {filters.role === 'teacher' ? 'Jabatan & Mapel' : 'Kelas & Batch'}
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader className="animate-spin text-blue-500" size={40} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Menyinkronkan data terbaru...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Calendar size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">Tidak ada data absensi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: any, idx: number) => {
                  const isStudent = item.userRole === 'student';
                  const userData = isStudent ? item.student : item.guru;
                  const displayName = isStudent ? userData?.name : userData?.nama;
                  const displayId = isStudent 
                    ? `NIS: ${userData?.nis || '-'}` 
                    : `ROLE: ${userData?.role || 'Staff'}`;
                  const subInfo = isStudent 
                    ? `Batch ${userData?.batch || '-'}` 
                    : (userData?.mapel || "Umum");

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      key={item.id} 
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                            isStudent ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            <Clock size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-black text-white italic tracking-tight">
                              {moment(item.createdAt).format("DD MMM YYYY")}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase font-bold">
                              Time: {moment(item.createdAt).format("HH:mm:ss")}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg ${
                            isStudent 
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/20' 
                              : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-600/20'
                          }`}>
                            {displayName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className={`font-bold transition-colors uppercase tracking-tight ${
                              isStudent ? 'text-white group-hover:text-blue-400' : 'text-white group-hover:text-emerald-400'
                            }`}>
                              {displayName || "Tidak Terdaftar"}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black">
                              {displayId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-sm">
                        <div className="font-bold text-zinc-300 uppercase tracking-tighter italic">
                          {isStudent ? item.currentClass : "GURU / STAFF"}
                        </div>
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                          isStudent ? 'text-blue-500/60' : 'text-emerald-500/60'
                        }`}>
                          {subInfo}
                        </div>
                      </td>

                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm ${
                          item.status === 'Hadir' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          <CheckCircle2 size={12} /> {item.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6 pb-12">
        <div className="flex items-center gap-4">
          <select 
            value={filters.limit} 
            onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
            className="bg-white/5 border border-white/10 w-max pr-8 pl-4 h-11 rounded-xl text-[10px] font-black text-white outline-none appearance-none cursor-pointer"
          >
            {[10, 20, 50, 100].map(v => <option key={v} value={v} className="bg-[#0B1220]">{v} Baris</option>)}
          </select>
          <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Showing <span className="text-white">{(filters.page - 1) * filters.limit + 1}-{Math.min(filters.page * filters.limit, pagination?.totalItems || 0)}</span> / Total <span className="text-blue-500">{pagination?.totalItems || 0}</span> Log
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
            disabled={filters.page === 1 || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20 text-zinc-400"
          >Prev</button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(3, pagination?.totalPages || 1) }, (_, i) => (
              <button
                key={i}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-11 h-11 rounded-xl text-[10px] font-black transition-all ${
                  filters.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500'
                }`}
              >{i + 1}</button>
            ))}
          </div>

          <button 
            onClick={() => setFilters({ ...filters, page: Math.min(pagination?.totalPages || 1, filters.page + 1) })}
            disabled={filters.page === pagination?.totalPages || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20 text-zinc-400"
          >Next</button>
        </div>
      </div>
    </div>
  );
}