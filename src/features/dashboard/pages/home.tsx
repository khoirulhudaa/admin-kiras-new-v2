// import { APP_CONFIG } from "@/core/configs";
// import { lang } from "@/core/libs";
// import { DashboardPageLayout } from "@/features/_global";
// import { useProfile } from "@/features/profile";
// import { useSchool } from "@/features/schools";
// import { motion } from "framer-motion";
// import {
//   AlertCircle,
//   BarChart3,
//   Building,
//   LayoutDashboard,
//   Loader,
//   MapPin,
//   School,
//   Zap
// } from "lucide-react";

// // ──────────────────────────────────────────────────────────────
// // Utilities
// // ──────────────────────────────────────────────────────────────

// const cx = (...classes: any[]) => classes.filter(Boolean).join(" ");

// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div
//     className={cx(
//       "rounded-2xl border bg-white/5 backdrop-blur-sm p-6 shadow-xl",
//       className
//     )}
//   >
//     {children}
//   </div>
// );

// const InfoItem = ({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: any;
//   label: string;
//   value: string | number | null | undefined;
// }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-3 rounded-lg bg-zinc-800/50">
//       <Icon className="h-6 w-6 text-blue-400" />
//     </div>
//     <div>
//       <p className="text-sm text-zinc-400">{label}</p>
//       <p className="text-lg font-medium text-white mt-1">
//         {value || value === 0 ? value : "—"}
//       </p>
//     </div>
//   </div>
// );

// const FeatureCard = ({
//   icon: Icon,
//   title,
//   description,
//   accentColor,
// }: {
//   icon: any;
//   title: string;
//   description: string;
//   accentColor: string;
// }) => (
//   <div
//     className={cx(
//       "flex flex-col items-start gap-4 p-6 rounded-2xl border backdrop-blur-sm shadow-xl transition-all hover:scale-[1.02]",
//       accentColor
//     )}
//   >
//     <div className="p-4 rounded-xl bg-white/10">
//       <Icon className="h-8 w-8" />
//     </div>
//     <div>
//       <h4 className="text-xl font-bold mb-2">{title}</h4>
//       <p className="text-zinc-300 leading-relaxed">{description}</p>
//     </div>
//   </div>
// );

// // ──────────────────────────────────────────────────────────────
// // Main Component
// // ──────────────────────────────────────────────────────────────

// export const HomePage = () => {
//   const profile = useProfile();
//   const isAdmin = profile?.user?.role === "admin";

//   const schoolQuery = useSchool();
//   const { data: schools, isLoading, error } = schoolQuery;

//   const school = schools?.[0];

//   const shouldShowUpdateDialog = isAdmin && school && (
//     !school.namaSekolah ||
//     !school.npsn ||
//     !school.nameProvince
//     // field urlYutubeFirst dihapus dari kondisi karena video sudah diganti
//   );

//   console.log("school data:", school);

//   if (isLoading) {
//     return (
//       <DashboardPageLayout
//         siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
//         breadcrumbs={[{ label: "Dashboard", url: "/" }]}
//       >
//         <div className="min-h-[60vh] flex items-center justify-center">
//           <div className="flex flex-col items-center gap-5">
//             <Loader className="h-12 w-12 animate-spin text-blue-500" />
//             <p className="text-zinc-400 text-lg">Memuat data sekolah...</p>
//           </div>
//         </div>
//       </DashboardPageLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardPageLayout
//         siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
//         breadcrumbs={[{ label: "Dashboard", url: "/" }]}
//       >
//         <Card className="max-w-2xl mx-auto text-center py-12 mt-12 border-red-900/30">
//           <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-6" />
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Gagal Memuat Data</h2>
//           <p className="text-zinc-300">{error.message || "Terjadi kesalahan saat mengambil data sekolah."}</p>
//         </Card>
//       </DashboardPageLayout>
//     );
//   }

//   if (!school) {
//     return (
//       <DashboardPageLayout
//         siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
//         breadcrumbs={[{ label: "Dashboard", url: "/" }]}
//       >
//         <Card className="max-w-3xl mx-auto text-center py-16 mt-12">
//           <School className="h-20 w-20 mx-auto text-zinc-600 mb-6" />
//           <h2 className="text-3xl font-bold text-white mb-4">Data Sekolah Belum Tersedia</h2>
//           <p className="text-zinc-400 text-lg max-w-xl mx-auto">
//             {isAdmin
//               ? "Silakan tambahkan informasi sekolah terlebih dahulu."
//               : "Hubungi administrator untuk melengkapi data sekolah."}
//           </p>
//         </Card>
//       </DashboardPageLayout>
//     );
//   }

//   return (
//     <DashboardPageLayout
//       siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
//       breadcrumbs={[{ label: "Dashboard", url: "/" }]}
//     >
//       <div className="min-h-screen text-zinc-100 pb-16">
//         {/* Header / Welcome */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="pt-6 border-b border-white/15 pb-6"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold mb-3">
//                   Selamat Datang, {profile?.user?.name || "Admin"} 
//                   <span className="relative top-[-4px] ml-2">
//                    👋
//                   </span>
//                 </h1>
//                 <p className="text-xl text-zinc-400">
//                   Dashboard Manajemen {school.namaSekolah || "Sekolah"}
//                 </p>
//               </div>

//               {/* {isAdmin && shouldShowUpdateDialog && (
//                 <SchoolUpdateDialog
//                   triggerClassName="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
//                 />
//               )} */}
//             </div>
//           </div>
//         </motion.section>

//         {/* Main Content */}
//         <section className="py-4 md:py-4 mt-4">
//           <div className="max-w-7xl mx-auto">
//             {/* Info Dasar Sekolah */}
//             <div className="grid md:grid-cols-3 gap-6 mb-12">
//               <Card className="border-white/30">
//                 <InfoItem icon={Building} label="Nama Sekolah" value={school.namaSekolah} />
//               </Card>

//               <Card className="border-white/30">
//                 <InfoItem icon={School} label="NPSN" value={school.npsn} />
//               </Card>

//               <Card className="border-white/30">
//                 <InfoItem icon={MapPin} label="Provinsi" value={school.nameProvince} />
//               </Card>
//             </div>

//             {/* Deskripsi Dashboard + 3 Keunggulan dengan warna berbeda */}
//             <Card className="mb-12 overflow-hidden border-zinc-700/50">
//               <div className="p-1 border-b border-zinc-700/50">
//                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
//                   <LayoutDashboard className="h-7 w-7 text-blue-400" />
//                   Dashboard Manajemen Website Sekolah
//                 </h3>
//                 <p className="text-zinc-300 leading-relaxed">
//                   Dashboard ini adalah pusat kendali digital sekolah Anda. Kelola semua informasi penting seperti data siswa, guru, jadwal, keuangan, absensi, nilai, serta komunikasi dengan orang tua secara terintegrasi dan real-time. Semua dalam satu tampilan intuitif yang mendukung pengambilan keputusan cepat dan transparan.
//                 </p>
//               </div>

//               <div className="px-6 pt-6 pb-2">
//                 <h4 className="text-xl font-semibold mb-8 text-center md:text-left">
//                   3 Keunggulan Utama Dashboard Ini
//                 </h4>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <FeatureCard
//                     icon={Zap}
//                     title="Efisiensi Maksimal"
//                     description="Otomatisasi administrasi menghemat waktu hingga 70%. Input data sekali, akses di mana saja tanpa dokumen fisik."
//                     accentColor="bg-emerald-950/40 border-emerald-800/50 text-emerald-300 [&_.lucide]:text-emerald-400"
//                   />
//                   <FeatureCard
//                     icon={BarChart3}
//                     title="Keputusan Berbasis Data Cepat"
//                     description="Visualisasi data interaktif & rekap lengkap membantu kepala sekolah menganalisis performa dan mengambil langkah strategis dengan akurat."
//                     accentColor="bg-cyan-950/40 border-cyan-800/50 text-cyan-300 [&_.lucide]:text-cyan-400"
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </section>
//       </div>

//       {/* Dialog tetap muncul jika kondisi terpenuhi */}
//       {/* {shouldShowUpdateDialog && <SchoolUpdateDialog />} */}
//     </DashboardPageLayout>
//   );
// };



import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building,
  LayoutDashboard,
  School,
  ShieldCheck,
  Zap
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Modern Utilities & Components
// ──────────────────────────────────────────────────────────────

const cx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const PremiumCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cx(
      "relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-blue-600/10 to-transparent backdrop-blur-md p-8 shadow-2xl",
      className
    )}
  >
    {/* Subtle Glow Effect */}
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
    {children}
  </motion.div>
);

const StatItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) => (
  <div className="group flex items-center gap-5 transition-all hover:translate-x-1">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-400/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <Icon className="h-7 w-7" />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-blue-400/70">{label}</p>
      <p className="text-xl font-semibold text-white mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, gradient }: { icon: any; title: string; description: string; gradient: string }) => (
  <div className={cx("group relative p-8 rounded-2xl border border-white/5 transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]", gradient)}>
    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white transition-transform group-hover:scale-110">
      <Icon className="h-8 w-8 text-blue-300" />
    </div>
    <h4 className="text-xl uppercase font-bold text-white mb-3 flex items-center gap-2">
      {title} 
    </h4>
    <p className="text-blue-100/60 leading-relaxed text-sm">{description}</p>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

export const HomePage = () => {
  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";
  const { data: schools, isLoading, error } = useSchool();
  const school = schools?.[0];

  if (isLoading) {
    return (
      <DashboardPageLayout siteTitle="Loading..." breadcrumbs={[{ label: "Dashboard", url: "/" }]}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
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
      <div className="space-y-8 pb-12 pt-6">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-8 md:p-8 shadow-2xl border border-white/20">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center uppercase gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
              >
                <ShieldCheck className="h-4 w-4" /> Enterprise Management System
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl uppercase md:text-5xl font-extrabold text-white tracking-tight leading-tight"
              >
                DASHBOARD ADMIN 😄
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-sm md:text-md flex w-max font-normal text-blue-100/60 leading-relaxed"
              >
                Selamat datang di hub kendali digital <span className="text-blue-400 ml-[3px] font-semibold">{school?.namaSekolah || "Sekolah"}</span>. 
              </motion.p>
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="hidden lg:block relative"
            >
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 rounded-2xl shadow-2xl">
                 <div className="bg-slate-900 rounded-xl p-8">
                    <LayoutDashboard className="h-32 w-32 text-blue-500 opacity-20 absolute -right-4 -top-4" />
                    <div className="space-y-6">
                       <div className="h-2 w-32 bg-blue-500/20 rounded" />
                       <div className="h-2 w-48 bg-blue-500/10 rounded" />
                       <div className="flex gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500" />
                          <div className="space-y-2">
                             <div className="h-2 w-20 bg-blue-500/20 rounded" />
                             <div className="h-2 w-16 bg-blue-500/10 rounded" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumCard delay={0.3}>
            <StatItem icon={Building} label="Institusi" value={school?.namaSekolah} />
          </PremiumCard>
          <PremiumCard delay={0.4}>
            <StatItem icon={School} label="NPSN" value={school?.npsn} />
          </PremiumCard>
          {/* <PremiumCard delay={0.5}>
            <StatItem icon={MapPin} label="Wilayah" value={school?.nameProvince} />
          </PremiumCard> */}
        </div>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-4">
          <FeatureCard 
            icon={Zap}
            title="Efisiensi Maksimal"
            description="Otomatisasi sistem administrasi yang mampu memangkas waktu pengerjaan hingga 70%. Data terpusat memastikan aksesibilitas tanpa batas tanpa beban dokumen fisik."
            gradient="bg-blue-600/5 hover:bg-blue-600/10"
          />
          <FeatureCard 
            icon={BarChart3}
            title="Data Driven Insights"
            description="Visualisasi data analitik secara real-time untuk mendukung kebijakan strategis sekolah. Pantau pertumbuhan siswa dan kinerja staf secara akurat."
            gradient="bg-indigo-600/5 hover:bg-indigo-600/10"
          />
        </section>
      </div>
    </DashboardPageLayout>
  );
};