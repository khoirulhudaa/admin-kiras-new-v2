import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Building,
  LayoutDashboard,
  Loader,
  MapPin,
  School,
  Zap
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────

const cx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cx(
      "rounded-2xl border bg-white/5 backdrop-blur-sm p-6 shadow-xl",
      className
    )}
  >
    {children}
  </div>
);

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex items-start gap-4">
    <div className="p-3 rounded-lg bg-zinc-800/50">
      <Icon className="h-6 w-6 text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-lg font-medium text-white mt-1">
        {value || value === 0 ? value : "—"}
      </p>
    </div>
  </div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  accentColor,
}: {
  icon: any;
  title: string;
  description: string;
  accentColor: string;
}) => (
  <div
    className={cx(
      "flex flex-col items-start gap-4 p-6 rounded-2xl border backdrop-blur-sm shadow-xl transition-all hover:scale-[1.02]",
      accentColor
    )}
  >
    <div className="p-4 rounded-xl bg-white/10">
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-zinc-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

export const HomePage = () => {
  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";

  const schoolQuery = useSchool();
  const { data: schools, isLoading, error } = schoolQuery;

  const school = schools?.[0];

  const shouldShowUpdateDialog = isAdmin && school && (
    !school.namaSekolah ||
    !school.npsn ||
    !school.nameProvince
    // field urlYutubeFirst dihapus dari kondisi karena video sudah diganti
  );

  console.log("school data:", school);

  if (isLoading) {
    return (
      <DashboardPageLayout
        siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
        breadcrumbs={[{ label: "Dashboard", url: "/" }]}
      >
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <Loader className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-zinc-400 text-lg">Memuat data sekolah...</p>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  if (error) {
    return (
      <DashboardPageLayout
        siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
        breadcrumbs={[{ label: "Dashboard", url: "/" }]}
      >
        <Card className="max-w-2xl mx-auto text-center py-12 mt-12 border-red-900/30">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Gagal Memuat Data</h2>
          <p className="text-zinc-300">{error.message || "Terjadi kesalahan saat mengambil data sekolah."}</p>
        </Card>
      </DashboardPageLayout>
    );
  }

  if (!school) {
    return (
      <DashboardPageLayout
        siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
        breadcrumbs={[{ label: "Dashboard", url: "/" }]}
      >
        <Card className="max-w-3xl mx-auto text-center py-16 mt-12">
          <School className="h-20 w-20 mx-auto text-zinc-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Data Sekolah Belum Tersedia</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {isAdmin
              ? "Silakan tambahkan informasi sekolah terlebih dahulu."
              : "Hubungi administrator untuk melengkapi data sekolah."}
          </p>
        </Card>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: "Dashboard", url: "/" }]}
    >
      <div className="min-h-screen text-zinc-100 pb-16">
        {/* Header / Welcome */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-6 border-b border-white/15 pb-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Selamat Datang, {profile?.user?.name || "Admin"} 
                  <span className="relative top-[-4px] ml-2">
                   👋
                  </span>
                </h1>
                <p className="text-xl text-zinc-400">
                  Dashboard Manajemen {school.namaSekolah || "Sekolah"}
                </p>
              </div>

              {/* {isAdmin && shouldShowUpdateDialog && (
                <SchoolUpdateDialog
                  triggerClassName="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                />
              )} */}
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="py-4 md:py-4 mt-4">
          <div className="max-w-7xl mx-auto">
            {/* Info Dasar Sekolah */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-white/30">
                <InfoItem icon={Building} label="Nama Sekolah" value={school.namaSekolah} />
              </Card>

              <Card className="border-white/30">
                <InfoItem icon={School} label="NPSN" value={school.npsn} />
              </Card>

              <Card className="border-white/30">
                <InfoItem icon={MapPin} label="Provinsi" value={school.nameProvince} />
              </Card>
            </div>

            {/* Deskripsi Dashboard + 3 Keunggulan dengan warna berbeda */}
            <Card className="mb-12 overflow-hidden border-zinc-700/50">
              <div className="p-1 border-b border-zinc-700/50">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <LayoutDashboard className="h-7 w-7 text-blue-400" />
                  Dashboard Manajemen Website Sekolah
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Dashboard ini adalah pusat kendali digital sekolah Anda. Kelola semua informasi penting seperti data siswa, guru, jadwal, keuangan, absensi, nilai, serta komunikasi dengan orang tua secara terintegrasi dan real-time. Semua dalam satu tampilan intuitif yang mendukung pengambilan keputusan cepat dan transparan.
                </p>
              </div>

              <div className="px-6 pt-6 pb-2">
                <h4 className="text-xl font-semibold mb-8 text-center md:text-left">
                  3 Keunggulan Utama Dashboard Ini
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <FeatureCard
                    icon={Zap}
                    title="Efisiensi Maksimal"
                    description="Otomatisasi administrasi menghemat waktu hingga 70%. Input data sekali, akses di mana saja tanpa dokumen fisik."
                    accentColor="bg-emerald-950/40 border-emerald-800/50 text-emerald-300 [&_.lucide]:text-emerald-400"
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Keputusan Berbasis Data Cepat"
                    description="Visualisasi data interaktif & rekap lengkap membantu kepala sekolah menganalisis performa dan mengambil langkah strategis dengan akurat."
                    accentColor="bg-cyan-950/40 border-cyan-800/50 text-cyan-300 [&_.lucide]:text-cyan-400"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      {/* Dialog tetap muncul jika kondisi terpenuhi */}
      {/* {shouldShowUpdateDialog && <SchoolUpdateDialog />} */}
    </DashboardPageLayout>
  );
};