import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { SchoolDistribution } from "@/features/schools/pages/school-distribution";
import { SchoolUpdateDialog } from "../containers";
import { HeatMap } from "@/features/schools/components";

export const HomePage = () => {
  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";
  const school = useSchool();
  console.log('school this is:', school?.data);

  // Periksa apakah salah satu data bernilai null atau ""
  const shouldShowUpdateDialog = isAdmin && school?.data?.[0] && (
    school.data[0].namaSekolah === null || school.data[0].namaSekolah === "" ||
    school.data[0].npsn === null || school.data[0].npsn === "" ||
    school.data[0].nameProvince === null || school.data[0].nameProvince === "" ||
    school.data[0].urlYutubeFirst === null || school.data[0].urlYutubeFirst === ""
  );

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: "Dashboard",
          url: "/",
        },
      ]}
    >
      
      <SchoolDistribution />
      <HeatMap />
      <div className="pb-16 sm:pb-0" />
      {shouldShowUpdateDialog && <SchoolUpdateDialog />}
    </DashboardPageLayout>
  );
};

// import { motion } from "framer-motion";
// import {
//   Bell,
//   BookOpen,
//   CalendarDays,
//   ClipboardList,
//   LayoutDashboard,
//   LibraryBig,
//   MapPin,
//   Moon,
//   Palette,
//   ShieldCheck,
//   Sun,
//   TrendingUp,
//   UserCheck2,
//   Users2,
//   UserX
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// // ---------- Brand & Theme Utils ----------
// const BRAND = {
//   name: "Xpresensi",
//   // Default accent (bisa diganti di UI)
//   accentDefault: "#0ea5e9", // sky-500-ish (WCAG-friendly)
// };

// function hexToRgba(hex: string, a = 1) {
//   try {
//     let c = hex.replace("#", "");
//     if (c.length === 3) c = c.split("").map((x) => x + x).join("");
//     const n = parseInt(c, 16);
//     const r = (n >> 16) & 255,
//       g = (n >> 8) & 255,
//       b = n & 255;
//     return `rgba(${r}, ${g}, ${b}, ${a})`;
//   } catch {
//     return hex;
//   }
// }
// const isHex = (s?: string) => /^#([0-9a-fA-F]{3}){1,2}$/.test(s || "");
// // Robust matcher untuk "SPP" (termasuk "S.P.P")
// const SPP_RE = /s\.?p\.?p/i;

// function clsx(...a: any[]) {
//   return a.filter(Boolean).join(" ");
// }

// // ---------- Date helpers ----------
// function todayStr() {
//   const d = new Date();
//   const m = (d.getMonth() + 1).toString().padStart(2, "0");
//   const day = d.getDate().toString().padStart(2, "0");
//   return `${d.getFullYear()}-${m}-${day}`; // YYYY-MM-DD
// }
// function parseDateOnly(s?: string | null) {
//   // s: YYYY-MM-DD -> Date at local midnight
//   if (!s) return null;
//   const [y, m, d] = (s || "").split("-").map(Number);
//   if (!y || !m || !d) return null;
//   return new Date(y, m - 1, d);
// }
// function isInRangeYYYYMMDD(targetYYYYMMDD?: string | null, startYYYYMMDD?: string | null, endYYYYMMDD?: string | null) {
//   const t = parseDateOnly(targetYYYYMMDD);
//   const s = parseDateOnly(startYYYYMMDD);
//   const e = parseDateOnly(endYYYYMMDD);
//   if (!t || !s || !e) return false;
//   return +t >= +s && +t <= +e;
// }
// function weekRangeOf(date = new Date()) {
//   // Senin sebagai awal minggu
//   const d = new Date(date);
//   const day = d.getDay();
//   const diffToMonday = day === 0 ? -6 : 1 - day; // 0: Minggu
//   const start = new Date(d);
//   start.setDate(d.getDate() + diffToMonday);
//   const end = new Date(start);
//   end.setDate(start.getDate() + 6);
//   const fmt = (x: any) => `${x.getFullYear()}-${(x.getMonth() + 1).toString().padStart(2, "0")}-${x.getDate().toString().padStart(2, "0")}`;
//   return { start: fmt(start), end: fmt(end) };
// }
// function fmtDateID(yyyyMMdd?: string | null) {
//   const d = parseDateOnly(yyyyMMdd || undefined);
//   if (!d) return yyyyMMdd || "?";
//   return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
// }

// // ---------- Primitives (respect CSS variables) ----------
// function Stat({ title, value, icon: Icon, hint }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       className="rounded-lg p-4 shadow-lg backdrop-blur border"
//       style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--primary)" }}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs" style={{ color: "var(--muted)" }}>
//             {title}
//           </p>
//           <p className="text-2xl font-semibold" style={{ color: "var(--primary)" }}>
//             {value}
//           </p>
//         </div>
//         {Icon && <Icon className="w-6 h-6" style={{ color: "var(--muted)" }} />}
//       </div>
//       {hint && (
//         <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
//           {hint}
//         </p>
//       )}
//     </motion.div>
//   );
// }
// function Card({ title, icon: Icon, actions, children }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       className="rounded-lg p-4 shadow-lg backdrop-blur border"
//       style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--primary)" }}
//     >
//       {(title || actions) && (
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2">
//             {Icon && <Icon className="w-5 h-5" style={{ color: "var(--muted-strong)" }} />}
//             <h3 className="text-sm font-semibold tracking-wide" style={{ color: "var(--primary)" }}>
//               {title}
//             </h3>
//           </div>
//           <div className="flex items-center gap-2">{actions}</div>
//         </div>
//       )}
//       {children}
//     </motion.div>
//   );
// }
// function Pill({ children }: any) {
//   return (
//     <span
//       className="px-2 py-0.5 text-[11px] rounded-md"
//       style={{ background: "var(--panel-hover)", color: "var(--muted-strong)" }}
//     >
//       {children}
//     </span>
//   );
// }

// // --- Geo helpers for realtime map ---
// function haversine(lat1:number,lng1:number,lat2:number,lng2:number){
//   const toRad=(d:number)=>d*Math.PI/180;
//   const R=6371000; // meters
//   const dLat=toRad(lat2-lat1); const dLng=toRad(lng2-lng1);
//   const a=Math.sin(dLat/2)*2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)*2;
//   const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
//   return R*c;
// }
// function withinRadiusMeters(lat:number,lng:number,clat:number,clng:number,r:number){
//   return haversine(lat,lng,clat,clng)<=r;
// }
// function latLngToXY(lat:number,lng:number,centerLat:number,centerLng:number,rangeDeg=0.003){
//   // map bbox: center ± rangeDeg (roughly ~333m for lat)
//   const minLat=centerLat-rangeDeg, maxLat=centerLat+rangeDeg;
//   const minLng=centerLng-rangeDeg, maxLng=centerLng+rangeDeg;
//   const x=( (lng-minLng) / (maxLng-minLng) )*100; // 0..100
//   const y=( 1 - (lat-minLat) / (maxLat-minLat) )*100;
//   return {x:Math.max(0,Math.min(100,x)), y:Math.max(0,Math.min(100,y))};
// }
// function geofenceCirclePercent(centerLat:number, radiusM:number, rangeDeg=0.003){
//   const mPerDegLat=111320; // approx
//   const radiusDeg=radiusM/mPerDegLat;
//   const perc=(radiusDeg/(2*rangeDeg))*100*2; // diameter percentage of full box
//   return Math.max(0, Math.min(100, perc));
// }

// export const HomePage = () => {
//   // Fokus 1 menu: Dashboard utama saja (sidebar dihapus)

//   // --- SDR plan (persisted) ---
//   const [sdrPlan, setSdrPlan] = useState(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const raw = localStorage.getItem("xpresensi.sdrPlan");
//         if (raw) return JSON.parse(raw);
//       } catch {}
//     }
//     const t = todayStr();
//     return { enabled: false, reason: "Pembelajaran Daring", start: t, end: t, scope: "hari-ini" };
//   });
//   const sdrActiveToday = useMemo(
//     () => sdrPlan.enabled && isInRangeYYYYMMDD(todayStr(), sdrPlan.start, sdrPlan.end),
//     [sdrPlan]
//   );

//   const [theme, setTheme] = useState<"dark" | "light">("dark"); // dark | light
//   const [accent, setAccent] = useState(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("xpresensi.accent");
//       if (saved && isHex(saved)) return saved;
//     }
//     return BRAND.accentDefault;
//   });

//   // Persist UI preferences
//   useEffect(() => {
//     if (typeof window !== "undefined") localStorage.setItem("xpresensi.accent", accent);
//   }, [accent]);
//   useEffect(() => {
//     if (typeof window !== "undefined") localStorage.setItem("xpresensi.sdrPlan", JSON.stringify(sdrPlan));
//   }, [sdrPlan]);

//   // CSS variables for theming (WCAG‑aware)
//   const vars = useMemo(
//     () => ({
//       "--accent": accent,
//       "--accent-20": hexToRgba(accent, 0.2),
//       "--accent-30": hexToRgba(accent, 0.3),
//       "--accent-90": hexToRgba(accent, 0.9),
//       // Palette
//       ...(theme === "dark"
//         ? {
//             "--bg": "linear-gradient(to bottom right, #0b0f19, #111827, #0b0f19)",
//             "--panel": "rgba(255,255,255,0.04)",
//             "--panel-hover": "rgba(255,255,255,0.10)",
//             "--card": "rgba(17,24,39,0.60)",
//             "--border": "rgba(255,255,255,0.10)",
//             "--primary": "#e5e7eb",
//             "--muted": "rgba(229,231,235,0.68)",
//             "--muted-strong": "rgba(229,231,235,0.82)",
//             "--topbar": "rgba(3,7,18,0.70)",
//             "--topbar-border": "rgba(255,255,255,0.10)",
//           }
//         : {
//             "--bg": "linear-gradient(to bottom right, #f5f7fb, #ffffff)",
//             "--panel": "rgba(0,0,0,0.02)",
//             "--panel-hover": "rgba(14,165,233,0.12)",
//             "--card": "#ffffff",
//             "--border": "#e5e7eb",
//             "--primary": "#111827",
//             "--muted": "#6b7280",
//             "--muted-strong": "#374151",
//             "--topbar": "rgba(255,255,255,0.85)",
//             "--topbar-border": "#e5e7eb",
//           }),
//     }),
//     [theme, accent]
//   );

//   // Quick helpers
//   const presetAccents: Array<[string, string]> = [
//     ["Sky", "#0ea5e9"],
//     ["Emerald", "#10b981"],
//     ["Violet", "#8b5cf6"],
//     ["Amber", "#f59e0b"],
//     ["Rose", "#ef4444"],
//     ["Teal", "#14b8a6"],
//   ];

//   // Quick toggle today
//   function toggleSdrToday(v: boolean) {
//     const t = todayStr();
//     setSdrPlan((prev: any) => ({ ...prev, enabled: v, start: t, end: t, scope: "hari-ini" }));
//   }

//   return (
//     <div className="min-h-screen w-full" style={{color: "var(--primary)", ...vars }}>
//       {/* Topbar */}
//       <header
//         className="sticky top-0 z-10 backdrop-blur rounded-xl"
//         style={{ border: "1px solid var(--topbar-border)" }}
//       >
//         <div className="max-w-full mx-auto px-4 h-14 flex items-center gap-3">
//           <div className="flex items-center gap-2" style={{ color: "var(--primary)" }}>
//             <LayoutDashboard className="w-5 h-5" /> <span className="font-semibold">Xpresensi — Dashboard Admin</span>
//           </div>
//           <div className="ml-4 flex-1">
//             <div className="relative">
//               <input
//                 placeholder="Cari menu/fitur…"
//                 className="w-full rounded-md px-3 py-2 text-sm focus:outline-none"
//                 style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--primary)" }}
//               />
//             </div>
//           </div>

//           {/* Accent quick picker (topbar) */}
//           <div className="hidden md:flex items-center gap-2 ml-2" title="Pilih aksen">
//             <Palette className="w-4 h-4" style={{ color: "var(--muted)" }} />
//             <div className="flex items-center gap-1">
//              {presetAccents.map(([name, col]) => (
//                 <button
//                   key={name}
//                   onClick={() => setAccent(col)}
//                   className={`w-5 h-5 rounded-md border focus:ring-2 focus:ring-offset-2 ${
//                     col === accent ? 'border-accent-30' : 'border-border'
//                   }`}
//                   style={{
//                     background: col,
//                     outline: col === accent ? `2px solid ${hexToRgba(col, 0.5)}` : 'none',
//                   }}
//                   aria-label={`Pilih aksen ${name}`}
//                 />
//               ))}
//               <input
//                 type="color"
//                 value={accent}
//                 onChange={(e) => isHex(e.target.value) && setAccent(e.target.value)}
//                 className="w-6 h-6 rounded border"
//                 style={{ borderColor: "var(--border)" }}
//                 aria-label="Custom accent"
//               />
//             </div>
//           </div>

//           {/* Theme toggle */}
//           <button
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="ml-2 px-3 py-1.5 rounded-md text-sm flex items-center gap-2"
//             title="Toggle Light/Dark"
//             style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--primary)" }}
//           >
//             {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//             {theme === "dark" ? "Terang" : "Gelap"}
//           </button>
//         </div>
//         {/* SDR banner */}
//         {sdrActiveToday && (
//           <div className="border-t" style={{ borderColor: "var(--accent-30)", background: "var(--accent-20)" }}>
//             <div className="max-w-full mx-auto py-2 text-xs" style={{ color: "var(--primary)" }}>
//               Sekolah dari Rumah aktif hari ini — {fmtDateID(sdrPlan.start)} s/d {fmtDateID(sdrPlan.end)} • Alasan: <b>{sdrPlan.reason}</b>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content only (no sidebar) */}
//       <main className="max-w-full mx-auto py-4 space-y-4">
//         {/* Global toggles */}
//         <div
//           className="rounded-lg p-4 flex items-center justify-between shadow-lg backdrop-blur border"
//           style={{ background: "var(--card)", borderColor: "var(--border)" }}
//         >
//           <div className="flex items-center gap-2 text-sm">
//             <input
//               id="sdr"
//               type="checkbox"
//               checked={sdrActiveToday}
//               onChange={(e) => toggleSdrToday(e.target.checked)}
//               className="h-4 w-4"
//             />
//             <label htmlFor="sdr" className="select-none">
//               Aktifkan mode <b>Sekolah dari Rumah</b> untuk hari ini
//             </label>
//             {sdrActiveToday && <Pill>Alasan: {sdrPlan.reason}</Pill>}
//           </div>
//           <div className="hidden md:flex items-center gap-2 text-xs">
//             <Pill>WCAG AA contrast</Pill>
//             <Pill>Aksen: {accent}</Pill>
//           </div>
//         </div>

//         <AdminHome sdrPlan={sdrPlan} sdrActiveToday={sdrActiveToday} />

//         {/* --- Smoke tests / runtime tests panel --- */}
//         <TestPanel />
//       </main>
//     </div>
//   );
// }

// // ---------- Panels ----------
// function AdminHome({ sdrPlan, sdrActiveToday }: any) {
//   // --- Dummy data for dashboard widgets ---
//   const approvals = [
//     { id: 1, name: "Rafi Pratama", class: "VII-2", type: "Izin", range: "01–03 Sep", attachment: true },
//     { id: 2, name: "Alya Nabila", class: "XI RPL-2", type: "Sakit", range: "Hari ini", attachment: true },
//     { id: 3, name: "Bima Putra", class: "VIII-1", type: "Dispensasi", range: "02 Sep", attachment: false },
//   ];
//   const liveClasses = [
//     { id: 11, cls: "X IPA-1", subject: "Matematika", teacher: "Ibu Rina", present: 31, total: 34, time: "07:30–09:00", room: "R-201", online: !!sdrPlan?.enabled, joined10: 28 },
//     { id: 12, cls: "XI RPL-2", subject: "PBO", teacher: "Pak Dedi", present: 32, total: 32, time: "09:10–10:40", room: "Lab RPL", online: !!sdrPlan?.enabled, joined10: 30 },
//     { id: 13, cls: "IX-1", subject: "Bahasa Indonesia", teacher: "Bu Sari", present: 29, total: 31, time: "10:50–12:20", room: "R-105", online: !!sdrPlan?.enabled, joined10: 27 },
//   ];
//   const absentTeachers = [
//     { id: 21, name: "Pak Hasan", reason: "Sakit", slot: "09:10–10:40", cls: "VIII-3", subject: "Sejarah", replacement: "Bu Mega" },
//     { id: 22, name: "Bu Lila", reason: "Dinas", slot: "10:50–12:20", cls: "XII-IPS", subject: "Sosiologi", replacement: "Pak Budi" },
//   ];
//   const agendaToday = [
//     { id: 31, time: "08:00", title: "Rapat Kurikulum", loc: "Ruang Rapat" },
//     { id: 32, time: "13:00", title: "Sosialisasi UKK", loc: "Aula" },
//     { id: 33, time: "15:30", title: "Coaching Guru Mapel", loc: sdrPlan?.enabled ? "Google Meet" : "Lab" },
//   ];
//   const invoicesDue = [
//     { id: 42, who: "Bima", class: "VIII-1", title: "Seragam Olahraga", amount: "Rp120.000", due: "05 Sep" },
//     { id: 43, who: "Alya", class: "XI RPL-2", title: "Iuran Kegiatan", amount: "Rp75.000", due: "07 Sep" },
//   ];
//   const libraryOverdue = [
//     { id: 51, who: "Chandra", class: "VII-3", book: "Fisika Dasar", late: 3 },
//     { id: 52, who: "Rafi", class: "VII-2", book: "Sejarah Nusantara", late: 1 },
//   ];

//   // ---- Realtime lokasi (dummy) ----
//   const SCHOOL = { lat: -6.2, lng: 106.8, radiusM: 250 };
//   const RANGE_DEG = 0.003; // ~±333m for latitude, approximate for longitude at -6°S
//   type Loc = { id: number; name: string; lat: number; lng: number; status: 'in_school' | 'commuting' | 'home' };

//   const seed: Loc[] = Array(12).fill(0).map((_, i): Loc => {
//     const jitter = () => (Math.random() - 0.5) * RANGE_DEG * 1.5;
//     return {
//       id: i + 1,
//       name: `S${(i + 1).toString().padStart(2, '0')}`,
//       lat: SCHOOL.lat + jitter(),
//       lng: SCHOOL.lng + jitter(),
//       status: 'in_school',
//     };
//   });
//   const [locs, setLocs] = useState<Loc[]>(seed);
//   useEffect(()=>{
//     const id = setInterval(()=>{
//       if (sdrPlan?.enabled) return; // saat SDR aktif, tidak perlu update map dummy
//       setLocs(prev=> prev.map(p=>{
//         // random drift kecil; clamp ke bbox
//         let dLat=(Math.random()-0.5)*RANGE_DEG*0.05;
//         let dLng=(Math.random()-0.5)*RANGE_DEG*0.05;
//         const lat=Math.max(SCHOOL.lat-RANGE_DEG, Math.min(SCHOOL.lat+RANGE_DEG, p.lat+dLat));
//         const lng=Math.max(SCHOOL.lng-RANGE_DEG, Math.min(SCHOOL.lng+RANGE_DEG, p.lng+dLng));
//         const inside = withinRadiusMeters(lat,lng,SCHOOL.lat,SCHOOL.lng,SCHOOL.radiusM);
//         return { ...p, lat, lng, status: inside? 'in_school' : 'commuting' };
//       }));
//     }, 4000);
//     return ()=>clearInterval(id);
//   }, [sdrPlan?.enabled]);

//   const insideCount = locs.filter(p=>withinRadiusMeters(p.lat,p.lng,SCHOOL.lat,SCHOOL.lng,SCHOOL.radiusM)).length;
//   const outsideCount = locs.length - insideCount;

//   // join rate daring (avg join 10') dari field joined10
//   const joinRate = Math.round(
//     (liveClasses.reduce((acc, c) => acc + (((c as any).joined10 ?? 0) / c.total), 0) / (liveClasses.length || 1)) * 100
//   );

// const joinOutliers = useMemo(() => 
//   liveClasses.filter((c) => c.total > 0 && ((c.joined10 ?? 0) / c.total) < 0.8).map((c) => {
//     const join = c.joined10 ?? 0;
//     const pct = c.total > 0 ? Math.round((join / c.total) * 100) : 0;
//     return {
//       id: c.id,
//       label: `${c.cls || 'N/A'} - ${c.subject || 'N/A'}`,
//       join,
//       total: c.total,
//       pct,
//     };
//   }),
//   [liveClasses]);
//   // ringkasan minggu ini (dummy kalkulasi)
//   const weeklySummary = useMemo(() => {
//     const avgPresence = Math.round((liveClasses.reduce((a,c)=> a + (c.present/c.total), 0) / (liveClasses.length || 1)) * 100);
//     const approvalsPending = approvals.length;
//     const onlineClasses = liveClasses.filter((c)=> !!c.online).length;
//     const tardy = 10; // dari KPI dummy
//     return { avgPresence, approvalsPending, onlineClasses, joinRate, tardy };
//   }, [liveClasses, approvals, joinRate]);

//   // minitest
//   useEffect(() => {
//     try {
//       console.assert(approvals.length > 0, "approvals harus ada");
//       console.assert(liveClasses.every((x) => x.total >= x.present), "present harus <= total");
//       console.assert(invoicesDue.every((inv)=> !/SPP/i.test(inv.title)), "invoicesDue must exclude SPP");
//       console.assert(liveClasses.every((c:any)=> ((c as any).joined10 ?? c.present) <= c.total), "joined10 must be <= total");
//       console.assert(Number.isFinite(joinRate) && joinRate >= 0 && joinRate <= 100, "joinRate sane");
//     } catch {}
//   }, []);

//   const Progress = ({ value }: any) => (
//     <div className="h-1.5 w-full rounded bg-[color:var(--panel)] overflow-hidden">
//       <div className="h-full" style={{ width: `${value}%`, background: "var(--accent-90)" }} />
//     </div>
//   );

//   return (
//     <div className="space-y-4">
//           <Card
//             title="Aksi Cepat"
//             icon={LayoutDashboard}
//           >
//             <div className="flex flex-wrap gap-2">
//               <button className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>Buat Acara</button>
//               <button className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>Import Jadwal</button>
//               <button className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>Cetak Kartu</button>
//               <button className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>Broadcast</button>
//               <button className="px-3 py-1.5 rounded-md text-sm" style={{ background: "var(--accent-90)", color: "#fff", border: "1px solid var(--accent-30)" }}>Pengaturan SDR</button>
//             </div>
//           </Card>
//       {/* KPI Row */}
//       <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
//         <Stat title="Kehadiran Siswa" value="95.2%" icon={UserCheck2} hint="2% izin • 1.8% sakit • 1% alfa" />
//         <Stat title="Guru Hadir" value="88/92" icon={Users2} />
//         <Stat title="Siswa Terlambat" value="10" icon={Bell} hint="telat ≥ 10 menit" />
//         <Stat title="Join Rate Daring (10′)" value={`${joinRate}%`} icon={TrendingUp} hint="rata-rata kelas (10 menit pertama)" />
//         <Stat title="Kelas Berjalan" value={String(liveClasses.length)} icon={BookOpen} />
//        <Stat
//         title="SDR"
//         value={sdrPlan?.enabled ? "Aktif" : "—"}
//         icon={CalendarDays}
//         hint={sdrPlan?.enabled && sdrPlan?.start && sdrPlan?.end ? `${fmtDateID(sdrPlan.start)} - ${fmtDateID(sdrPlan.end)}` : "Tidak aktif"}
//       />
//       </div>

//       {/* Two-column content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* LEFT COLUMN */}
//         <div className="space-y-4">
//           <Card
//             title="Notifikasi & Pengumuman"
//             icon={Bell}
//             actions={
//               <button className="text-sm underline" style={{ color: "var(--accent)" }}>
//                 Lihat semua
//               </button>
//             }
//           >
//             <ul className="text-sm space-y-2">
//               <li className="flex items-start gap-2">
//                 <Bell className="w-4 h-4" style={{ color: "var(--muted)" }} /> Siswa telat <span className="font-mono">&gt;</span> 10 menit pada 07:30 — <b>10 siswa</b>.
//               </li>
//               <li className="flex items-start gap-2">
//                 <Bell className="w-4 h-4" style={{ color: "var(--muted)" }} /> Pengajuan izin dari <b>Ortu Rafi</b> — butuh persetujuan.
//               </li>
//               <li className="flex items-start gap-2">
//                 <Bell className="w-4 h-4" style={{ color: "var(--muted)" }} /> Peminjaman buku melewati batas — 3 siswa.
//               </li>
//             </ul>
//             {sdrPlan?.enabled && (
//               <div className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
//                 <Pill>
//                   SDR: {fmtDateID(sdrPlan.start)} s/d {fmtDateID(sdrPlan.end)} • {sdrPlan.reason}
//                 </Pill>
//                 {sdrActiveToday ? <span className="ml-2">(aktif hari ini)</span> : <span className="ml-2">(tidak aktif hari ini)</span>}
//               </div>
//             )}
//           </Card>

//           <Card
//             title="Persetujuan Menunggu"
//             icon={ClipboardList}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Kelola
//               </button>
//             }
//           >
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead style={{ color: "var(--muted)" }}>
//                   <tr className="border-b" style={{ borderColor: "var(--border)" }}>
//                     <th className="py-2 text-left font-medium">Nama</th>
//                     <th className="py-2 text-left font-medium">Kelas</th>
//                     <th className="py-2 text-left font-medium">Jenis</th>
//                     <th className="py-2 text-left font-medium">Tanggal</th>
//                     <th className="py-2 text-left font-medium">Lampiran</th>
//                     <th className="py-2 text-left font-medium">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {approvals.map((a) => (
//                     <tr key={a.id} className="border-b" style={{ borderColor: "var(--border)" }}>
//                       <td className="py-2">{a.name}</td>
//                       <td className="py-2">{a.class}</td>
//                       <td className="py-2">{a.type}</td>
//                       <td className="py-2">{a.range}</td>
//                       <td className="py-2">{a.attachment ? "Ada" : "—"}</td>
//                       <td className="py-2">
//                         <div className="flex items-center gap-2">
//                           <button className="px-2 py-1 rounded border text-xs" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                             Tolak
//                           </button>
//                           <button className="px-2 py-1 rounded text-xs" style={{ background: "var(--accent-90)", color: "#fff", border: "1px solid var(--accent-30)" }}>
//                             Setujui
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </Card>

//           <Card
//             title="Anomali Presensi"
//             icon={Bell}
//             actions={<button className="text-sm" style={{ color: "var(--accent)" }}>Atur ambang</button>}
//           >
//             <ul className="text-sm divide-y" style={{ borderColor: "var(--border)" }}>
//               {(!sdrPlan?.enabled) && (
//                 <li className="py-2 flex items-center justify-between">
//                   <div>Di luar geofence</div>
//                   <Pill>{outsideCount} siswa</Pill>
//                 </li>
//               )}
//               {joinOutliers.length ? joinOutliers.map(o => (
//                 <li key={o.id} className="py-2 flex items-center justify-between">
//                   <div>
//                     {o.label} — Join 10′ {o.join}/{o.total}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Pill>{o.pct}%</Pill>
//                     <button className="px-2 py-1 rounded border text-xs" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>Buka tiket</button>
//                     <button className="px-2 py-1 rounded text-xs" style={{ background: "var(--accent-90)", color: "#fff", border: "1px solid var(--accent-30)" }}>Kirim pengingat</button>
//                   </div>
//                 </li>
//               )) : (
//                 <li className="py-2 text-xs" style={{ color: "var(--muted)" }}>Tidak ada anomali signifikan.</li>
//               )}
//             </ul>
//           </Card>

//           <Card
//             title="Rangkuman Minggu Ini"
//             icon={LayoutDashboard}
//           >
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div className="rounded-md p-3 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>Rata-rata Kehadiran</div>
//                 <div className="mt-1 text-xl font-semibold">{weeklySummary.avgPresence}%</div>
//                 <div className="mt-1">
//                   <div className="h-1.5 w-full rounded bg-[color:var(--panel)] overflow-hidden">
//                     <div className="h-full" style={{ width: `${weeklySummary.avgPresence}%`, background: 'var(--accent-90)' }} />
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-md p-3 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>Join Rate Daring (10′)</div>
//                 <div className="mt-1 text-xl font-semibold">{weeklySummary.joinRate}%</div>
//                 <div className="mt-1">
//                   <div className="h-1.5 w-full rounded bg-[color:var(--panel)] overflow-hidden">
//                     <div className="h-full" style={{ width: `${weeklySummary.joinRate}%`, background: 'var(--accent-90)' }} />
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-md p-3 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>Persetujuan Menunggu</div>
//                 <div className="mt-1 text-xl font-semibold">{weeklySummary.approvalsPending}</div>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>izin/sakit/disp.</div>
//               </div>
//               <div className="rounded-md p-3 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>Kelas Daring</div>
//                 <div className="mt-1 text-xl font-semibold">{weeklySummary.onlineClasses}</div>
//                 <div className="text-xs" style={{ color: "var(--muted)" }}>{sdrPlan?.enabled ? 'SDR aktif' : 'Luring dominan'}</div>
//               </div>
//             </div>
//           </Card>

//           </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-4">
//           <Card
//             title="Lokasi Siswa (Realtime)"
//             icon={MapPin}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Peta penuh
//               </button>
//             }
//           >
//             <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
//               {sdrPlan?.enabled ? (
//                 <Pill>SDR aktif — geofence nonaktif</Pill>
//               ) : (
//                 <>
//                   <Pill>Dalam area: {insideCount}</Pill> <span className="mx-1">•</span> <Pill>Di luar: {outsideCount}</Pill>
//                 </>
//               )}
//             </div>
//             <div className="rounded-md border p-2" style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
//               <div className="relative h-64 w-full rounded-md" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
//                 {/* geofence circle */}
//                 {!sdrPlan?.enabled && (
//                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border" style={{ borderColor:'var(--accent-30)', width: geofenceCirclePercent(SCHOOL.lat,SCHOOL.radiusM,RANGE_DEG)+"%", height: geofenceCirclePercent(SCHOOL.lat,SCHOOL.radiusM,RANGE_DEG)+"%" }} />
//                 )}
//                 {/* points */}
//                 {locs.map(p=>{
//                   const pt = latLngToXY(p.lat,p.lng,SCHOOL.lat,SCHOOL.lng,RANGE_DEG);
//                   const inArea = withinRadiusMeters(p.lat,p.lng,SCHOOL.lat,SCHOOL.lng,SCHOOL.radiusM);
//                   return (
//                     <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
//                       <div
//                         className="w-2.5 h-2.5 rounded-md shadow"
//                         title={`${p.name} ${inArea ? 'area sekolah' : 'luar area'}`}
//                         style={{ background: inArea ? 'var(--accent-90)' : '#ef4444', border: '1px solid var(--border)' }}
//                       />
//                     </div>
//                   );
//                 })}
//                 {sdrPlan?.enabled && (
//                   <div className="absolute inset-0 grid place-content-center text-xs" style={{ color: 'var(--muted)' }}>
//                     SDR aktif — peta monitoring dinonaktifkan sementara
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>
//           <Card
//             title="Kehadiran Kelas (Live)"
//             icon={BookOpen}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Lihat detail
//               </button>
//             }
//           >
//             <ul className="space-y-2 text-sm">
//               {liveClasses.map((c) => {
//                 const pct = Math.round((c.present / c.total) * 100);
//                 const joinPct = Math.round((((c as any).joined10 ?? 0) / c.total) * 100);
//                 return (
//                   <li key={c.id} className="rounded-md p-2 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                     <div className="flex items-center justify-between">
//                       <div className="font-medium">
//                         {c.cls} • {c.subject} {c.online && <span className="ml-1 text-xs">(Daring)</span>}
//                       </div>
//                       <div className="text-xs" style={{ color: "var(--muted)" }}>
//                         {c.teacher} • {c.time}
//                       </div>
//                     </div>
//                     <div className="mt-1 flex items-center gap-2">
//                       <div className="text-xs" style={{ color: "var(--muted)" }}>
//                         {c.present}/{c.total}
//                       </div>
//                       <Progress value={pct} />
//                       <div className="text-xs" style={{ color: "var(--muted)" }}>
//                         {pct}%
//                       </div>
//                     </div>
//                     <div className="mt-1 flex items-center gap-2">
//                       <div className="text-xs" style={{ color: "var(--muted)" }}>
//                         Join 10′ {(c as any).joined10 ?? 0}/{c.total}
//                       </div>
//                       <Progress value={joinPct} />
//                       <div className="text-xs" style={{ color: "var(--muted)" }}>
//                         Outlier belum join: {Math.max(0, c.total - ((c as any).joined10 ?? 0))}
//                       </div>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           </Card>

//           <Card
//             title="Guru Absen & Pengganti"
//             icon={UserX}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Kelola
//               </button>
//             }
//           >
//             <ul className="space-y-2 text-sm">
//               {absentTeachers.map((t) => (
//                 <li key={t.id} className="rounded-md p-2 border" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                   <div className="flex items-center justify-between">
//                     <div className="font-medium">
//                       {t.name} — {t.reason}
//                     </div>
//                     <div className="text-xs" style={{ color: "var(--muted)" }}>
//                       {t.slot} • {t.cls} • {t.subject}
//                     </div>
//                   </div>
//                   <div className="mt-1 flex items-center gap-2">
//                     <button className="px-2 py-1 rounded border text-xs" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
//                       Cari pengganti
//                     </button>
//                     <button className="px-2 py-1 rounded text-xs" style={{ background: "var(--accent-90)", color: "#fff", border: "1px solid var(--accent-30)" }}>
//                       Tetapkan {t.replacement}
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </Card>

//           <Card
//             title="Agenda Hari Ini"
//             icon={CalendarDays}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Kelola acara
//               </button>
//             }
//           >
//             <ul className="text-sm divide-y" style={{ borderColor: "var(--border)" }}>
//               {agendaToday.map((a) => (
//                 <li key={a.id} className="py-2 flex items-center justify-between">
//                   <div>
//                     <b>{a.time}</b> — {a.title}
//                   </div>
//                   <div className="text-xs" style={{ color: "var(--muted)" }}>
//                     {a.loc}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </Card>

//           <Card
//             title="Perpustakaan (Terlambat)"
//             icon={LibraryBig}
//             actions={
//               <button className="text-sm" style={{ color: "var(--accent)" }}>
//                 Lihat
//               </button>
//             }
//           >
//             <ul className="text-sm divide-y" style={{ borderColor: "var(--border)" }}>
//               {libraryOverdue.map((b) => (
//                 <li key={b.id} className="py-2 flex items-center justify-between">
//                   <div>
//                     {b.who} • {b.class} — <i>{b.book}</i>
//                   </div>
//                   <Pill>{b.late} hari</Pill>
//                 </li>
//               ))}
//             </ul>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------- Simple runtime smoke tests (pseudo test cases) ----------
// function TestPanel() {
//   // extra geo tests
//   try {
//     console.assert(haversine(0,0,0,0) < 1e-6, 'haversine zero');
//     console.assert(withinRadiusMeters(0,0,0,0,10) === true, 'radius center should be inside');
//   } catch {}
  
//   let w = weekRangeOf(new Date("2025-09-01"));
//   try {
//     console.assert(typeof BRAND.accentDefault === "string" && BRAND.accentDefault.startsWith("#"), "Brand accent harus HEX");
//     console.assert(typeof hexToRgba(BRAND.accentDefault, 0.2) === "string", "hexToRgba return string");
//     // date helpers
//     console.assert(w.start && w.end, "weekRange should produce start/end");
//     console.assert(isInRangeYYYYMMDD("2025-09-03", w.start, w.end) === true, "range membership works");
//     // extra tests
//     console.assert(isHex("#fff") && isHex("#ffffff") && !isHex("rgb(0,0,0)"), "isHex validator");
//     const tToday = todayStr();
//     console.assert(/\d{4}-\d{2}-\d{2}/.test(tToday), "todayStr format");
//     console.assert(fmtDateID(tToday).length > 0, "fmtDateID basic");
//     console.assert(isInRangeYYYYMMDD("2025-01-01", "2025-02-01", "2025-02-28") === false, "range negative");

//     // NEW tests: ensure SPP filter works
//     const dummyInv = [
//       { title: "SPP September" },
//       { title: "Seragam" },
//     ];
//     const filtered = dummyInv.filter((inv:any) => !SPP_RE.test(inv.title));
//     console.assert(filtered.length === 1 && filtered[0].title === "Seragam", "SPP item must be excluded");

//     // Join rate example sanity
//     const jc = [ {joined10: 8, total: 10}, {joined10: 7, total: 10} ];
//     const jr = Math.round((jc.reduce((a,c)=> a + (c.joined10/c.total), 0) / jc.length) * 100);
//     console.assert(jr === 75, "join rate example should be 75%");
//   } catch {}
//   const wNow = weekRangeOf(new Date());
//   return (
//     <Card title="Debug / Tests" icon={ShieldCheck}>
//       <ul className="list-disc pl-5 text-xs" style={{ color: "var(--muted)" }}>
//         <li>Brand accent: {BRAND.accentDefault}</li>
//         <li>Minggu (now): {wNow.start} → {wNow.end}</li>
//         <li>Helper ok: hexToRgba/isHex/todayStr/range</li>
//       </ul>
//     </Card>
//   );
// }
