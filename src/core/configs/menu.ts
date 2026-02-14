import { VokadashProps } from "@/features/_global";
import { lang } from "../libs";

export const MENU_STAFF: VokadashProps["menus"] = [
  {
    title: lang.text("dashboard"),
    url: "/",
    icon: "LayoutDashboard",
  },
  {
    // title: lang.text('websiteSchool'),
    title: "WEBSITE SEKOLAH",
    url: "/website-school",
    icon: "Laptop",
    main: true,
    items: [
      {
        // title: lang.text("beranda"),
        title: "BERANDA",
        url: "/profile-sekolah",
        icon: "Image", // For hero slider (visual banners)
        main: false,
      },
      {
        // title: lang.text("visionMission"),
        title: "VISI MISI",
        url: "/visiMission",
        icon: "Target", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("galeri"),
        title: "GALERI",
        url: "/galeri",
        icon: "File", // For teacher schedules (time-based)
        main: false,
      },
      {
        // title: lang.text("prestasi"),
        title: "PRESTASI",
        url: "/prestasi",
        icon: "Trophy", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("pramuka"),
        title: "PRAMUKA",
        url: "/pramuka-sekolah",
        icon: "Compass", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("layanan"),
        title: "LAYANAN",
        url: "/layanan",
        icon: "Cog", // For teachers and staff
        main: false,
      },
      {
        // title: lang.text("program"),
        title: "PROGRAM",
        url: "/program",
        icon: "Star", // For teachers and staff
        main: false,
      },
      {
        // title: lang.text("sejarah"),
        title: "SEJARAH",
        url: "/sejarah",
        icon: "Archive", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("guruTendik"),
        title: "TENAGA PENDIDIK",
        url: "/teacherAndStaff",
        icon: "Users", // For teachers and staff
        main: false,
      },
      { 
        // title: lang.text("osis"),
        title: "ORGANISASI OSIS",
        url: "/osis",
        icon: "Vote",
        main: true
      },
      {
        // title: lang.text("ppdb"),
        title: "PPDB",
        url: "/ppdb",
        icon: "File",
        main: true
      },
      {
        // title: lang.text("ekstra"),
        title: "EKSTRAKURIKULER",
        url: "/ekstrakurikuler",
        icon: "Activity", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("alumni"),
        title: "BUKU ALUMNI",
        url: "/buku-alumni",
        icon: "Users", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("kurikulum"),
        title: "KURIKULUM",
        url: "/curriculum",
        icon: "BookOpen",
        main: false,
      },
      {
        // title: lang.text("faq"),
        title: "TANYA JAWAB",
        url: "/faq",
        icon: "MessageCircleQuestion", 
        main: false,
      },
      {
        // title: lang.text("rules"),
        title: "TATA TERTIB",
        url: "/tata-tertib",
        icon: "Scale", 
        main: false,
      },
      {
        // title: lang.text("pengumuman"),
        title: "PENGUMUMAN",
        url: "/pengumuman",
        icon: "Megaphone",
        main: true
      },
      {
        // title: lang.text('organization'),
        title: "STRUKTUR",
        url: "/struktur-organisasi",
        icon: "ListTree", // For vision and mission (goals)
        main: false,
      },
      {
        // title: lang.text("berita"),
        title: "BERITA SEKOLAH",
        url: "/berita",
        icon: "Newspaper",
        main: true
      },
      {
        // title: lang.text("feed"),
        title: "POSTINGAN IG",
        url: "/feed",
        icon: "Instagram",
        main: true
      },
      {
        // title: lang.text("vote"),
        title: "VOTING OSIS",
        url: "/voting-osis",
        icon: "Ticket",
        main: true
      },
      {
        // title: lang.text("partner"),
        title: "PARTNER",
        url: "/partner-dan-sponsor",
        icon: "Handshake",
        main: true
      },
      {
        // title: lang.text("facility"),
        title: "FASILITAS",
        url: "/fasilitas",
        icon: "Building2",
        main: true
      },
      {
        // title: lang.text("rating"),
        title: "ULASAN",
        url: "/ulasan",
        icon: "Star",
        main: true
      },
      {
        // title: lang.text("kalender"),
        title: "KALENDER",
        url: "/calendar",
        icon: "Calendar", // For events and schedules
        main: false,
      },
      {
        // title: lang.text("jadwal"),
        title: "JADWAL SLTA",
        url: "/schedule-teacher",
        icon: "Clock", // For teacher schedules (time-based)
        main: false,
      },
      {
        // title: lang.text("jadwalsd"),
        title: "JADWAL SD",
        url: "/jadwal-sd",
        icon: "Clock", // For teacher schedules (time-based)
        main: false,
      },
      {
        // title: lang.text("ppid"),
        title: "PPID SEKOLAH",
        url: "/ppid",
        icon: "Book", // For teachers and staff
        main: false,
      },
    ],
  },
  {
    // title: lang.text("adminManagement"),
    title: "MANAJEMEN AKUN",
    url: "/admin/users",
    icon: "Shield",
    main: true
  },
  {
    // title: lang.text("student"),
    title: "MANAJEMEN SISWA",
    url: "/data-siswa",
    icon: "Users",
    main: true
  },
  {
    // title: lang.text("student"),
    title: "STATISTIK SEKOLAH",
    url: "/sebaran-sekolah",
    icon: "School",
    main: true
  },
  {
    // title: lang.text("teacher"),
    title: "MANAJEMEN GURU",
    url: "/data-guru",
    icon: "Users2",
    main: true
  },
  {
    // title: lang.text("attendance"),
    title: "RIWAYAT KEHADIRAN",
    url: "/data-kehadiran",
    icon: "Scan",
    main: true
  },
  // {
  //   // title: lang.text("class"),
  //   title: "PEKERJAAN RUMAH",
  //   url: "/pekerjaan-rumah",
  //   icon: "ClipboardList",
  //   main: true
  // },
  {
    // title: lang.text("class"),
    title: "MANAJEMEN KELAS",
    url: "/manajemen-kelas",
    icon: "School",
    main: true
  },
];

export const USER_MENU_STAFF: VokadashProps["usermenus"] = [
  {
    title: lang.text("logout"),
    url: "/logout",
  },
];

export const MENU_CONFIG = {
  staff: MENU_STAFF,
};

export const USERMENU_CONFIG = {
  staff: USER_MENU_STAFF,
};