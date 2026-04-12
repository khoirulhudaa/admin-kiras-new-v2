import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  List,
  ListX,
  RefreshCw,
  School,
  Search,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { PremiumCard, StatItem } from "../components/statCard";
import { useAuthGuard } from "../hooks/useAuthGuard";

const cx = (...classes: any[]) => classes.filter(Boolean).join(" ");

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

export const HomePage = () => {

  useAuthGuard();

  const profile = useProfile();
  const schoolId = profile?.user?.schoolId || profile?.sekolah?.id;
  const { data: schools, isLoading: schoolLoading } = useSchool();
  const school = schools?.[0];

  // 1. State Filter
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedClassDetail, setSelectedClassDetail] = useState<any | null>(null);
  const [showGlobalStats, setShowGlobalStats] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [absentSearch, setAbsentSearch]   = useState('');
  const [absentPage,   setAbsentPage]     = useState(1);
  const [searchInput,  setSearchInput]    = useState('');
  const [classDetailSearch, setClassDetailSearch] = useState('');
  const [classDetailSearchInput, setClassDetailSearchInput] = useState('');
  const [showEarlyWarning, setShowEarlyWarning] = useState(false);
  const [ewTab, setEwTab] = useState<'consecutive' | 'lowAttendance' | 'frequentLate'>('consecutive');
  const [consecutivePage, setConsecutivePage] = useState(1);
  const [lowPage, setLowPage] = useState(1);
  const [latePage, setLatePage] = useState(1);
  const limit = 20;
  const limit2 = 20;
  const limit3 = 20;
  const LIMIT = 10;

  const queryClient = useQueryClient();

  // Debounce search → reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setAbsentSearch(searchInput);
      setAbsentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page saat tanggal berubah
  useEffect(() => {
    setAbsentPage(1);
    setAbsentSearch('');
    setSearchInput('');
  }, [filterDate]);

 // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setClassDetailSearch(classDetailSearchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [classDetailSearchInput]);

  // Reset saat ganti kelas
  useEffect(() => {
    setClassDetailSearch('');
    setClassDetailSearchInput('');
  }, [selectedClassDetail]);

  // Derived filtered students
  const filteredClassStudents = classDetailSearch.trim()
    ? selectedClassDetail?.students?.filter((std: any) =>
        std.name?.toLowerCase().includes(classDetailSearch.toLowerCase()) ||
        std.nis?.toLowerCase().includes(classDetailSearch.toLowerCase())
      )
    : selectedClassDetail?.students ?? [];

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format waktu: HH:mm:ss
  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // 2. Fetch Daftar Kelas (Untuk Dropdown)
  const { data: classesResponse } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: async () => {
      const res = await fetch(`https://be-school.kiraproject.id/kelas?schoolId=${schoolId}`);
      if (!res.ok) throw new Error("Gagal mengambil daftar kelas");
      return res.json();
    },
    enabled: !!schoolId,
    staleTime: 1000 * 60 * 5, // Pastikan data langsung dianggap usang
    gcTime: 1000 * 60 * 10,
  });

  // Pastikan Anda mendapatkan token Anda di sini
  const token = localStorage.getItem('token'); 

  const { data: consecutiveData, isLoading: consecutiveLoading, refetch: refetchConsecutive } = useQuery({
    // Tambahkan page ke queryKey
    queryKey: ['ew-consecutive', schoolId, consecutivePage], 
    queryFn: async () => {
      const res = await fetch(
        `https://be-school.kiraproject.id/siswa/early-warning/consecutive-absent?schoolId=${schoolId}&minDays=3&page=${consecutivePage}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    },
    enabled: !!schoolId && showEarlyWarning && !!token,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData // Opsional: agar UI tidak flicker saat ganti page
  });

  const { data: lowAttendanceData, isLoading: lowAttendanceLoading, refetch: refetchLow } = useQuery({
    queryKey: ['ew-low-attendance', schoolId, lowPage],
    queryFn: async () => {
      const res = await fetch(
        `https://be-school.kiraproject.id/siswa/early-warning/low-attendance?schoolId=${schoolId}&threshold=80&page=${lowPage}&limit=${limit2}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    },
    enabled: !!schoolId && showEarlyWarning && !!token,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  // Query Frequent Late
  const { data: frequentLateData, isLoading: frequentLateLoading, refetch: refetchFrequet } = useQuery({
    queryKey: ['ew-frequent-late', schoolId, latePage],
    queryFn: async () => {
      const res = await fetch(
        `https://be-school.kiraproject.id/siswa/early-warning/frequent-late?schoolId=${schoolId}&minPerWeek=2&page=${latePage}&limit=${limit3}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    },
    enabled: !!schoolId && showEarlyWarning && !!token,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  // 3. Fetch API Rekap Kehadiran
  const { data: recapResponse, isLoading: recapLoading, refetch } = useQuery({
    queryKey: ["classRecap", schoolId, filterDate],
    queryFn: async () => {
      const response = await fetch(
        `https://be-school.kiraproject.id/siswa/recap-kelas?schoolId=${schoolId}&date=${filterDate}`
      );
      if (!response.ok) throw new Error("Gagal mengambil data");
      return response.json();
    },
    enabled: !!schoolId,
    staleTime: 1000 * 60 * 5, // Pastikan data langsung dianggap usang
    gcTime: 1000 * 60 * 10,
  });

 // Ganti query globalResponse
  const { data: globalResponse, isLoading: globalLoading, refetch: refetchGlobal } = useQuery({
    queryKey: ["globalAttendanceStats", schoolId, filterDate, absentSearch, absentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        schoolId:  String(schoolId),
        date:      filterDate,
        search:    absentSearch,
        page:      String(absentPage),
        limit:     String(LIMIT),
      });
      const res = await fetch(
        `https://be-school.kiraproject.id/siswa/global-stats?${params}`
      );
      if (!res.ok) throw new Error("Gagal mengambil statistik global");
      return res.json();
    },
    enabled:          !!schoolId && showGlobalStats,
    staleTime:        1000 * 60 * 2,
    placeholderData:  (prev) => prev, // ganti keepPreviousData di TanStack v5
  });

  console.log('globalResponse:', globalResponse)

  const globalData = globalResponse?.data || { 
    absentStudents: [], 
    absentMeta: { total: 0, page: 1, limit: LIMIT, totalPages: 0 },
    topEarly: [], 
    topLate: [] 
  };

  const absentMeta = globalData.absentMeta;

  // 4. Client-side Filtering
  const allRecapData = recapResponse?.data || [];
  const filteredClassList = selectedClass === "all" 
    ? allRecapData 
    : allRecapData.filter((item: any) => item.className === selectedClass);

  const summary = recapResponse?.summary || { totalAllStudents: 0, totalAllBelumHadir: 0 };

  // Buat helper function untuk close sidebar
  const handleCloseGlobalStats = () => {
    setShowGlobalStats(false);
    setAbsentPage(1);
    setAbsentSearch('');
    setSearchInput('');
  };

  const handleRefreshAll = async () => {
    const toastId = toast.loading('Menyingkronkan data terbaru...');

    try {
      // 1. Invalidate tetap dilakukan untuk membersihkan cache
      queryClient.invalidateQueries({ queryKey: [schoolId] });

      // 2. Gunakan fungsi refetch yang didapat dari useQuery secara langsung
      // Ini akan memaksa hit ke API meskipun 'enabled' sedang false
      await Promise.all([
        refetch(),            // dari classRecap
        refetchGlobal(),      // dari globalAttendanceStats
        refetchConsecutive(), // dari ew-consecutive
        refetchLow(),         // dari ew-low-attendance
        refetchFrequet(),     // dari ew-frequent-late
      ]);

      toast.success('Data berhasil diperbarui!', { id: toastId });
    } catch (error) {
      toast.error('Gagal memperbarui data.', { id: toastId });
    }
  };

  if (schoolLoading) {
    return (
      <DashboardPageLayout siteTitle="Loading..." breadcrumbs={[{ label: "Dashboard", url: "/" }]}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: "Dashboard", url: "/" }]}
    >
      <Toaster position="top-right" richColors  />
      <div className="space-y-8 pb-12 pt-4">
        
        {/* Hero Section & Filters */}
        <section className="relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full" />
          
        <div className="relative z-10 mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
          <div className="w-full flex items-center justify-between">
            <motion.div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-4xl font-black text-white tracking-tighter leading-[0.9]">
                DASHBOARD ADMIN 
              </h1>
              <p className="text-slate-500 mt-2 text-xs font-normal tracking-widest uppercase">
                {formattedTime}
              </p>
            </motion.div>
          </div>
        </div>

          {/* Quick Metrics */}
          <div className="relative z-10 mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              // { label: "Siswa", 
              //   sub: 'Hari ini',
              //   val: summary.totalAllStudents, color: "text-slate-300" },
              { label: "Hadir", 
                sub: 'Hari ini',
                val: summary.totalAllStudents - summary.totalAllBelumHadir, color: "text-emerald-400" },
              { label: "Bolos", 
                sub: 'Hari ini',
                val: summary.totalAllBelumHadir, color: "text-red-500" },
              { 
                label: "Cek data", 
                // color: "text-yellow-400",
                sub: 'Lihat detail',
                val: "Pengawasan", 
                isAction: true,
                action: () => setShowEarlyWarning(true)
              },
              { 
                label: "Cek Detail", 
                sub: 'Lihat detail',
                val: "Cek detail", 
                color: "text-white",
                isAction: true,
                action: () => setShowGlobalStats(true)
              }
            ].map((m, i) => (
              <div 
                key={i} 
                onClick={m.action}
                className={cx(
                  "flex items-center justify-between gap-3 border-x border-white/10 p-5 transition-all",
                  m.isAction 
                    ? "cursor-pointer active:scale-[0.97] hover:bg-slate-500/5" 
                    : ""
                )}
              >
                <div className="w-max flex flex-col items-start">
                  {/* {!m.isAction && <ArrowRight size={15} className="text-zinc-600" />} */}
                  <p className={cx(
                    "text-[14px] w-max font-normal uppercase tracking-widest",
                    m.isAction ? "text-slate-400" : "text-slate-400"
                  )}>
                    {m.label}
                  </p>
                    {
                      m.val !== undefined && (
                        <div className={cx(`uppercase ${m?.val === 'Pengawasan' || m?.val === 'Cek detail' ? 'text-3xl' : 'text-4xl'} text-3xl ml-[-1px] font-normal tracking-tighter`, m?.color)}>{m?.val}</div>
                      )
                    }
                    <p className="w-full bg-slate-100/5 mt-3 flex justify-between items-center text-slate-400 text-[14px]">
                      {m?.sub}
                        {
                          m?.sub !== 'Hari ini' && (
                              <ArrowRight size={16} />
                            )
                          }
                    </p>
                </div>
                {/* {m.isAction && <ChevronRight size={20} className="text-white/50" />} */}
              </div>
            ))}
          </div>
        </section>

        {/* Info Institusi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumCard delay={0.1}>
            <StatItem icon={Building} label="Institusi" value={school?.namaSekolah} />
          </PremiumCard>
          <PremiumCard delay={0.2}>
            <StatItem icon={School} label="NPSN" value={school?.npsn} />
          </PremiumCard>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="flex items-center gap-3 relative top-[2px]">
            <div className="h-10 w-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tighter text-white">
                {selectedClass === "all" ? "Distribusi Per Kelas" : `Detail Kelas ${selectedClass}`}
              </h2>
              {/* <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Detail Absensi & Kepatuhan</p> */}
            </div>
          </div>

          <div className="w-max flex items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center h-max gap-3 w-max">
              {/* Date Input */}
              <div className="relative w-full sm:w-auto">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-slate-800/20 border border-white/10 rounded-xl h-11 pl-12 pr-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-48"
                />
              </div>

              {/* Class Selector */}
              <div className="relative w-full sm:w-auto">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-800/20 border border-white/10 rounded-xl h-11 py-3 pl-12 pr-10 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none w-full sm:w-56 cursor-pointer"
                >
                  <option value="all">SEMUA KELAS</option>
                  {classesResponse?.data?.map((cls: any) => (
                    <option className="text-black" key={cls.id} value={cls.className}>{cls.className}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 rotate-90" />
              </div>
            </div>
            <div 
              onClick={() => handleRefreshAll()}
              className="cursor-pointer active:scale-[0.97] hover:bg-blue-700 px-4 py-2 h-10 bg-blue-600 text-white rounded-lg"
            >
              Refresh Data
            </div>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {recapLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-[32px] animate-pulse border border-white/5" />
               ))
            ) : filteredClassList.length > 0 ? (
              filteredClassList.map((item: any) => {
                const { onTime = 0, late = 0} = item.stats || {};
                const presentCount = onTime + late;
                const percentage = item.totalStudents > 0 ? (presentCount / item.totalStudents) * 100 : 0;
                
                return (
                  <motion.div
                    key={item.className}
                    layout
                    className="group relative bg-slate-900/40 border border-white/10 rounded-[32px] p-6 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{item.className}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <Users className="h-3 w-3 text-zinc-600" />
                           <p className="text-[10px] font-bold text-zinc-500 uppercase">{item.totalStudents} Siswa Terdaftar</p>
                        </div>
                      </div>
                      <div onClick={() => setSelectedClassDetail(item)} className="cursor-pointer active:scale-[0.97] h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/20 hover:bg-blue-700 transition-all">
                        <List className="h-6 w-6 text-white" />
                      </div>
                    </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-blue-400">Kehadiran</span>
                      <span className="text-white">{Math.round(percentage)}%</span>
                    </div>
                    <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: `${percentage}%` }}
                        className={cx("h-full rounded-full", percentage > 80 ? "bg-emerald-500" : "bg-blue-500")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-2xl bg-emerald-500/5">
                      <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">On Time</p>
                      <p className="text-md font-black text-emerald-400">{item.stats.onTime}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-orange-500/5">
                      <p className="text-[8px] font-black text-orange-500 uppercase mb-1">Telat</p>
                      <p className="text-md font-black text-orange-400">{item.stats.late}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-red-500/5">
                      <p className="text-[8px] font-black text-red-500 uppercase mb-1">Bolos</p>
                      <p className="text-md font-black text-red-400">{item.stats.belumHadir}</p>
                    </div>
                  </div>
                </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Data Tidak Ada</h3>
                  <p className="text-zinc-500 font-medium mt-2">Tidak ditemukan data untuk filter yang dipilih.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showGlobalStats && (
          <>
            {/* Backdrop */}
            <motion.div 
              key="global-backdrop" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseGlobalStats}
              className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-md"
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {showGlobalStats && (
          <>
            {/* Sidebar Panel */}
            <motion.div 
              key="global-sidebar"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-screen w-full max-w-2xl bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col"
            >
              {/* Header sidebar global */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">REKAP GLOBAL</h2>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <CalendarIcon size={12} /> {filterDate}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Tombol Refresh di dalam sidebar */}
                  <button
                    onClick={() => {
                      const promise = Promise.all([refetch(), refetchGlobal()]);
                      toast.promise(promise, {
                        loading: 'Menyinkronkan data...',
                        success: 'Data berhasil diperbarui!',
                        error: 'Gagal mengambil data terbaru.',
                      });
                    }}
                    className="h-12 w-12 rounded-2xl bg-blue-600 active:scale-[0.97] text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <RefreshCw size={16} />
                  </button>

                  <button 
                    onClick={handleCloseGlobalStats}
                    className="h-12 w-12 rounded-2xl bg-red-600 active:scale-[0.97] text-white flex items-center justify-center hover:bg-red-700 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content - Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* Section: Leaderboard Kecepatan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Early */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      TOP 5 Tercepat
                    </h3>
                    <div className="space-y-2">
                      {
                        globalData.topEarly.length > 0 ? (
                          <>
                            {globalData.topEarly.map((std: any, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <span className="text-[10px] font-black text-emerald-500/50">#{i+1}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-white truncate uppercase">{std.name || '?'}</p>
                                  <p className="text-[9px] font-bold text-zinc-500">{std.class || '................'}</p>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{std.time}</span>
                              </div>
                            ))}
                          </>
                        ):
                        <div className="w-[100%] border-slate-500 border border-dashed text-xs py-4 text-slate-500 rounded-lg flex items-center justify-center">
                          <p>Belum ada kehadiran</p>
                        </div>
                      }
                    </div>
                  </div>

                  {/* Top Late */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       TOP 5 Terlambat
                    </h3>
                    <div className="space-y-2">
                      {
                        globalData.topLate.length > 0 ? (
                          <>
                            {globalData.topLate.map((std: any, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                <span className="text-[10px] font-black text-orange-500/50">#{i+1}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-white truncate uppercase">{std.name || '?'}</p>
                                  <p className="text-[9px] font-bold text-zinc-500">{std.class || '................'}</p>
                                </div>
                                <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md">{std.time}</span>
                              </div>
                            ))}
                          </>
                        ): (
                          <div className="w-[100%] border-slate-500 border border-dashed text-xs py-4 text-slate-500 rounded-lg flex items-center justify-center">
                            <p>Belum ada kehadiran</p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>

                {/* Section: Belum Hadir (Main List) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-red-400 uppercase tracking-[0.2em]">
                      Tanpa status ({absentMeta.total}
                      {absentSearch && ` hasil dari "${absentSearch}"`})
                    </h3>
                    <div className="h-px flex-1 bg-red-500/20 mx-4" />
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Cari nama atau NIS..."
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none text-xs text-white placeholder:text-slate-400 transition-all"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    {searchInput && (
                      <button
                        onClick={() => { setSearchInput(''); setAbsentSearch(''); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* List */}
                  {globalLoading ? (
                    <div className="flex flex-col gap-2">
                      {[1,2,3].map(n => (
                        <div key={n} className="h-16 w-full bg-white/5 animate-pulse rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-2">
                        {globalData.absentStudents.length === 0 ? (
                          <div className="text-center py-8 text-zinc-600 text-xs uppercase tracking-widest">
                            {absentSearch ? `Tidak ada hasil untuk "${absentSearch}"` : 'Semua siswa sudah hadir'}
                          </div>
                        ) : (
                          globalData.absentStudents.map((std: any) => (
                            <motion.div
                              layout
                              key={std.id}
                              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-black text-white text-xs overflow-hidden">
                                  {std.photoUrl
                                    ? <img src={std.photoUrl} className="h-full w-full object-cover rounded-xl" />
                                    : std.name.substring(0, 2)
                                  }
                                </div>
                                <div>
                                  <p className="text-sm font-black text-white uppercase leading-none">{std.name}</p>
                                  <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                                    {std.class} • NIS: {std.nis}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all">
                                BELUM HADIR
                              </span>
                            </motion.div>
                          ))
                        )}
                      </div>

                      {/* Pagination */}
                      {absentMeta.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-[10px] text-white uppercase tracking-widest">
                            {(absentPage - 1) * LIMIT + 1}–{Math.min(absentPage * LIMIT, absentMeta.total)} dari {absentMeta.total}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setAbsentPage(p => Math.max(1, p - 1))}
                              disabled={absentPage === 1}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft size={12} />
                            </button>

                            {Array.from({ length: absentMeta.totalPages }, (_, i) => i + 1)
                              .filter(p => p === 1 || p === absentMeta.totalPages || Math.abs(p - absentPage) <= 1)
                              .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                                acc.push(p);
                                return acc;
                              }, [])
                              .map((p, idx) =>
                                p === 'ellipsis' ? (
                                  <span key={`e-${idx}`} className="w-7 h-7 flex items-center justify-center text-zinc-600 text-xs">
                                    ···
                                  </span>
                                ) : (
                                  <button
                                    key={p}
                                    onClick={() => setAbsentPage(p)}
                                    className={cx(
                                      'w-7 h-7 rounded-lg text-[10px] font-black transition-all border',
                                      absentPage === p
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                                    )}
                                  >
                                    {p}
                                  </button>
                                )
                              )
                            }

                            <button
                              onClick={() => setAbsentPage(p => Math.min(absentMeta.totalPages, p + 1))}
                              disabled={absentPage === absentMeta.totalPages}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
         )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* RIGHT SIDEBAR (DRAWER) */}
      {/* ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedClassDetail && (
          <>
            <motion.div 
              key="class-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClassDetail(null)}
              className="fixed inset-0 z-[60] bg-slate-800/60 backdrop-blur-sm"
            />
            
            <motion.div
              key="class-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-screen w-full max-w-lg bg-slate-900 border-l border-white/10 shadow-3xl p-8 overflow-y-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                    KELAS {selectedClassDetail.className}
                  </h2>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">
                    Daftar Kehadiran Siswa
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedClassDetail(null)}
                  className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white hover:bg-red-700 active:scale-[0.98] transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={classDetailSearchInput}
                  onChange={(e) => setClassDetailSearchInput(e.target.value)}
                  placeholder="Cari nama atau NIS..."
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none text-xs text-white placeholder:text-zinc-600 transition-all"
                />

                {/* Tombol clear */}
                {classDetailSearchInput && (
                  <button
                    onClick={() => {
                      setClassDetailSearchInput('');
                      setClassDetailSearch('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Count info */}
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">
                {classDetailSearch
                  ? `${filteredClassStudents.length} dari ${selectedClassDetail.students.length} siswa`
                  : `${selectedClassDetail.students.length} siswa`
                }
              </p>

              {/* List */}
              <div className="space-y-3 flex-1">
                {filteredClassStudents.length === 0 ? (
                  <div className="text-center py-16 text-zinc-600 text-xs uppercase tracking-widest">
                    Tidak ada hasil untuk "{classDetailSearch}"
                  </div>
                ) : (
                  filteredClassStudents.map((std: any) => (
                    <motion.div 
                      // initial={{ opacity: 0, x: 20 }}
                      // animate={{ opacity: 1, x: 0 }}
                      key={std.id} 
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all"
                    >
                      <div className="w-[75%] flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0">
                          {std.photoUrl ? (
                            <img 
                              src={std.photoUrl} 
                              className="h-full w-full rounded-xl object-cover ring-2 ring-white/10" 
                              alt={std.name} 
                            />
                          ) : (
                            <div className="h-full w-full rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white uppercase">
                              {std.name.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="w-[80%]">
                          <p className="text-sm w-[90%] overflow-hidden truncate font-black text-white leading-tight">
                            {std.name}
                          </p>
                          <div className="w-max gap-1 items-center flex">
                            <p className="text-[10px] text-white/60 mt-1 font-black tracking-wider">NIS: {std.nis}</p>
                            <p className="text-[10px] font-bold text-white/60 mt-1 tracking-wider">-</p>
                            <p className="text-[10px] font-bold text-white/60 mt-1 tracking-wider">
                              {std.scanTime || '00:00:00'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-[25%] flex justify-end text-right">
                        <span className={cx(
                          "text-[9px] w-max flex items-center font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter",
                          std.status === "Belum Hadir" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : std.status === "Telat" 
                              ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" 
                              : "bg-green-500/10 text-green-500 border border-green-500/20"
                        )}>
                          {std.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}

        <AnimatePresence>
          {showEarlyWarning && (
            <>
              <motion.div
                key="ew-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowEarlyWarning(false)}
                className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div
                key="ew-sidebar"
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 z-[70] h-screen w-full max-w-2xl bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                      EARLY WARNING
                    </h2>
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mt-2">
                      Deteksi dini masalah kehadiran
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEarlyWarning(false)}
                    className="h-12 w-12 rounded-2xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-2 px-8 py-4 border-b border-white/5">
                  {([
                    { key: 'consecutive',   label: 'Absen Berturut',  count: consecutiveData?.count,    color: 'red'    },
                    { key: 'lowAttendance', label: 'Kehadiran < 80%', count: lowAttendanceData?.count,  color: 'amber'  },
                    { key: 'frequentLate',  label: 'Sering Terlambat', count: frequentLateData?.count,  color: 'orange' },
                  ] as const).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setEwTab(tab.key)}
                      className={cx(
                        "flex-1 py-4 px-3 w-full border active:scale-[0.97] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        ewTab === tab.key
                          ? tab.color === 'red'    ? "bg-red-600/30 border-red-600 border text-white"
                          : tab.color === 'amber'  ? "bg-purple-600/30 border-purple-600 border text-white"
                          :                          "bg-amber-600/30 border-amber-600 border text-white"
                          : "bg-white/5 text-zinc-500 hover:text-white"
                      )}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-1.5 opacity-70">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">

                  {/* Tab: Absen Berturut */}
                  {ewTab === 'consecutive' && (
                    <div className="space-y-4">
                      {consecutiveLoading
                        ? [1, 2, 3].map(n => <div key={n} className="h-16 bg-white/5 animate-pulse rounded-2xl" />)
                        : consecutiveData?.data?.length === 0
                          ? (
                            <div className="text-center py-12 text-zinc-600 flex flex-col justify-center items-center space-y-5 text-xs uppercase tracking-widest">
                              <ListX />
                              <p>Tidak ada siswa yang absen 3x beruntun</p>
                            </div>
                          )
                          : (
                            <>
                              {/* List Data */}
                              <div className="space-y-3">
                                {consecutiveData?.data?.map((std: any) => (
                                  <div key={std.id} className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <div className="flex items-center gap-3">
                                      {/* Avatar / Foto */}
                                      <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-white overflow-hidden">
                                        {std.photoUrl
                                          ? <img src={std.photoUrl} className="h-full w-full object-cover" />
                                          : std.name?.substring(0, 2)
                                        }
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-black text-white uppercase">{std.name}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                                          {std.class} • NIS: {std.nis}
                                        </p>
                                        
                                        <p className="text-[9px] text-red-400 mt-0.5 uppercase tracking-wider font-medium">
                                          {/* Menggunakan checkDays.length atau minDays dari state/props */}
                                          Absen {consecutiveData?.data?.[0]?.absentDates?.length || 3} Hari Beruntun
                                        </p>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      {/* Gunakan panjang array absentDates sebagai angka hari */}
                                      <p className="text-2xl font-black text-red-400">
                                        {std.absentDates?.length || 3}
                                      </p>
                                      <p className="text-[9px] text-red-500 uppercase tracking-wider">Hari</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Pagination Controls */}
                              {consecutiveData?.pagination?.totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                    Hal {consecutiveData.pagination.currentPage} / {consecutiveData.pagination.totalPages}
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setConsecutivePage(p => Math.max(1, p - 1))}
                                      disabled={consecutivePage === 1}
                                      className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold"
                                    >
                                      Prev
                                    </button>
                                    <button
                                      onClick={() => setConsecutivePage(p => p + 1)}
                                      disabled={consecutivePage >= consecutiveData?.pagination?.totalPages}
                                      className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                      }
                    </div>
                  )}

                  {/* Tab: Kehadiran < 80% */}
                  {ewTab === 'lowAttendance' && (
                    <div className="space-y-4">
                      {lowAttendanceLoading ? (
                        [1, 2, 3].map((n) => (
                          <div key={n} className="h-16 bg-white/5 animate-pulse rounded-2xl" />
                        ))
                      ) : (
                        <>
                          {lowAttendanceData?.period && (
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 px-1">
                              Periode: {lowAttendanceData.period.start} — {lowAttendanceData.period.end} ({lowAttendanceData.totalWorkdays} hari kerja)
                            </p>
                          )}

                          <div className="space-y-3">
                            {lowAttendanceData?.data?.length === 0 ? (
                              <div className="text-center py-12 text-zinc-600 text-xs uppercase tracking-widest flex flex-col items-center gap-4">
                                <div className="p-3 rounded-full bg-zinc-900/50">
                                  <CheckCircle2 className="w-6 h-6 text-emerald-500/50" />
                                </div>
                                <p>Semua siswa kehadiran &gt;= 80%</p>
                              </div>
                            ) : (
                              lowAttendanceData?.data?.map((std: any) => (
                                <div key={std.id} className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-white overflow-hidden">
                                      {std.photoUrl ? (
                                        <img src={std.photoUrl} className="h-full w-full object-cover" />
                                      ) : (
                                        std.name?.substring(0, 2)
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-white uppercase">{std.name}</p>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                                        {std.class} • NIS: {std.nis}
                                      </p>
                                      <p className="text-[9px] text-amber-400 mt-0.5">
                                        Hadir {std.hadirCount}/{std.totalWorkdays} hari ({std.rangeLabel})
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-black text-amber-400">{std.percentage}%</p>
                                    <p className="text-[9px] text-amber-500 uppercase tracking-wider">kehadiran</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* --- KONTROL PAGINATION --- */}
                          {lowAttendanceData?.pagination?.totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                Hal {lowAttendanceData.pagination.currentPage} / {lowAttendanceData.pagination.totalPages}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setLowPage((p) => Math.max(1, p - 1))}
                                  disabled={lowPage === 1}
                                  className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold transition-all active:scale-95"
                                >
                                  Prev
                                </button>
                                <button
                                  onClick={() => setLowPage((p) => p + 1)}
                                  disabled={lowPage >= lowAttendanceData?.pagination?.totalPages}
                                  className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold transition-all active:scale-95"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Tab: Sering Terlambat */}
                  {ewTab === 'frequentLate' && (
                    <div className="space-y-4">
                      {frequentLateLoading
                        ? [1, 2, 3].map(n => <div key={n} className="h-16 bg-white/5 animate-pulse rounded-2xl" />)
                        : (
                          <>
                            <div className="space-y-3">
                              {frequentLateData?.data?.length === 0 ? (
                                <div className="text-center py-12 text-zinc-600 flex flex-col justify-center items-center space-y-5 text-xs uppercase tracking-widest">
                                  <ListX />
                                  <p>Tidak ada siswa yang sering terlambat</p>
                                </div>
                              ) : (
                                frequentLateData?.data?.map((std: any) => (
                                  <div key={std.id} className="flex items-center justify-between p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-white overflow-hidden">
                                        {std.photoUrl 
                                          ? <img src={std.photoUrl} className="h-full w-full object-cover" /> 
                                          : std.name?.substring(0, 2)
                                        }
                                      </div>
                                      <div>
                                        <p className="text-sm font-black text-white uppercase">{std.name}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                                          {std.class} • NIS: {std.nis}
                                        </p>
                                        {/* Menggunakan totalLate dari backend */}
                                        <p className="text-[9px] text-orange-400 mt-0.5 uppercase tracking-wider">
                                          Terdeteksi sering terlambat dalam {std.weeksAnalyzed} minggu terakhir
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-black text-orange-400">{std.totalLate}x</p>
                                      <p className="text-[9px] text-orange-500 uppercase tracking-wider">Total Telat</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Navigasi Pagination */}
                            {frequentLateData?.pagination?.totalPages > 1 && (
                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                  Hal {frequentLateData.pagination.currentPage} / {frequentLateData.pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setLatePage(p => Math.max(1, p - 1))}
                                    disabled={latePage === 1}
                                    className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold transition-all active:scale-95"
                                  >
                                    Prev
                                  </button>
                                  <button
                                    onClick={() => setLatePage(p => p + 1)}
                                    disabled={latePage >= frequentLateData?.pagination?.totalPages}
                                    className="px-3 py-1 rounded-lg bg-zinc-800 text-white text-[10px] disabled:opacity-30 uppercase font-bold transition-all active:scale-95"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      }
                    </div>
                  )}

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </DashboardPageLayout>
  );
};