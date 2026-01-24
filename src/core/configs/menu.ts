import { VokadashProps } from "@/features/_global";
import { lang } from "../libs";

export const MENU_STAFF: VokadashProps["menus"] = [
  {
    title: lang.text("dashboard"),
    url: "/",
    icon: "LayoutDashboard",
  },
  // {
  //   title: lang.text("attendanceManagement"),
  //   url: "/attendance-management",
  //   icon: "LogInIcon",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("studentAttendance"),
  //       url: "/attendance/students",
  //       icon: "Users",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("teacherAttendance"),
  //       url: "/attendance/teachers",
  //       icon: "User2",
  //       main: false,
  //     },
  //     {
  //       title: lang.text('coursePresences'),
  //       url: '/attendance/courses',
  //       icon: 'Book',
  //       main: false,
  //     },
  //     {
  //       title: lang.text("history"),
  //       url: "/attendance/history",
  //       icon: "History",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text("manualAbsence"),
  //   url: "/absence-manual",
  //   icon: "LogInIcon",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("studentAbsence"),
  //       url: "/student-absence-manual",
  //       icon: "User",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("teacherAttendance"),
  //       url: "/teacher-absence-manual",
  //       icon: "User",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text("dataManagement"),
  //   url: "/data-management",
  //   icon: "Sheet",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("school"),
  //       url: "/schools",
  //       icon: "School",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("classRoom"),
  //       url: "/classrooms",
  //       icon: "Table",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("course"),
  //       url: "/courses",
  //       icon: "Book",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("task"),
  //       url: "/homework",
  //       icon: "Pen",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("scheduleMapel"),
  //       url: "/schedules",
  //       icon: "Book",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("student"),
  //       url: "/students",
  //       icon: "Users",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("event"),
  //       url: "/events",
  //       icon: "Calendar",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("teacher"),
  //       url: "/teachers",
  //       icon: "User",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("parent"),
  //       url: "/parents",
  //       icon: "Users",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("graduation"),
  //       url: "/graduation",
  //       icon: "GraduationCap",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text('locationDistribution'),
  //   url: "/locations",
  //   icon: "Map",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text('studentLocations'),
  //       url: "/location/students",
  //       icon: "User",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text('LicensingData'),
  //   url: "/data-licensing",
  //   icon: "Sheet",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text('dispensation'),
  //       url: "/licensing",
  //       icon: "File",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text("libraryManagement"),
  //   url: "/library",
  //   icon: "Book",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("Library"),
  //       url: "/library",
  //       icon: "School",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("LibraryVisit"),
  //       url: "/library/visit",
  //       icon: "Book",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text("printCard"),
  //   url: "/card",
  //   icon: "CreditCard",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("studentCard"),
  //       url: "/card/generate",
  //       icon: "CreditCard",
  //       main: false,
  //     },
  //     {
  //       title: lang.text("teacherCard"),
  //       url: "/card/generate/teacher",
  //       icon: "CreditCard",
  //       main: false,
  //     },
  //   ],
  // },
  // {
  //   title: lang.text('formatManagement'),
  //   url: "/format",
  //   icon: 'FileArchive',
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("formatPDF"),
  //       url: "/format/pdf",
  //       icon: "UserCog",
  //       main: false,
  //     },
  //     {
  //       title: lang.text('cardStudentFormat'),
  //       url: "/format/card",
  //       icon: "CreditCard",
  //       main: false,
  //     },
  //   ],
  // },
  {
    title: lang.text('websiteSchool'),
    url: "/website-school",
    icon: "Laptop",
    main: true,
    items: [
      {
        title: lang.text("beranda"),
        url: "/profile-sekolah",
        icon: "Image", // For hero slider (visual banners)
        main: false,
      },
      {
        title: lang.text("visionMission"),
        url: "/visiMission",
        icon: "Target", // For vision and mission (goals)
        main: false,
      },
      {
        title: lang.text("galeri"),
        url: "/galeri",
        icon: "File", // For teacher schedules (time-based)
        main: false,
      },
      {
        title: lang.text("prestasi"),
        url: "/prestasi",
        icon: "Trophy", // For vision and mission (goals)
        main: false,
      },
      {
        title: lang.text("ekstra"),
        url: "/ekstrakurikuler",
        icon: "Activity", // For vision and mission (goals)
        main: false,
      },
      {
        title: lang.text("pramuka"),
        url: "/pramuka-sekolah",
        icon: "Compass", // For vision and mission (goals)
        main: false,
      },
      {
        title: lang.text("layanan"),
        url: "/layanan",
        icon: "Cog", // For teachers and staff
        main: false,
      },
      {
        title: lang.text("program"),
        url: "/program",
        icon: "Star", // For teachers and staff
        main: false,
      },
      {
        title: lang.text("sejarah"),
        url: "/sejarah",
        icon: "Archive", // For vision and mission (goals)
        main: false,
      },
      {
        title: lang.text("guruTendik"),
        url: "/teacherAndStaff",
        icon: "Users", // For teachers and staff
        main: false,
      },
      { 
        title: lang.text("osis"),
        url: "/osis",
        icon: "Vote",
        main: true
      },
      {
        title: lang.text("ppdb"),
        url: "/ppdb",
        icon: "File",
        main: true
      },
      {
        title: lang.text("alumni"),
        url: "/buku-alumni",
        icon: "Users", // For vision and mission (goals)
        main: false,
      },
      // {
      //   title: lang.text('organization'),
      //   url: "/struktur-organisasi",
      //   icon: "ListTree", // For vision and mission (goals)
      //   main: false,
      // },
      // {
        //   title: lang.text("permohonan"),
        //   url: "/permohonan",
        //   icon: "FormInput", // For teachers and staff
        //   main: false,
        // },
      {
        title: lang.text("kurikulum"),
        url: "/curriculum",
        icon: "BookOpen", // For curriculum (education)
        main: false,
      },
      {
        title: lang.text("pengumuman"),
        url: "/pengumuman",
        icon: "Megaphone",
        main: true
      },
      {
        title: lang.text("berita"),
        url: "/berita",
        icon: "Newspaper",
        main: true
      },
      {
        title: lang.text("partner"),
        url: "/partner-dan-sponsor",
        icon: "Handshake",
        main: true
      },
      {
        title: lang.text("facility"),
        url: "/fasilitas",
        icon: "Building2",
        main: true
      },
      {
        title: lang.text("rating"),
        url: "/ulasan",
        icon: "Star",
        main: true
      },
      {
        title: lang.text("kalender"),
        url: "/calendar",
        icon: "Calendar", // For events and schedules
        main: false,
      },
      // {
      //   title: lang.text("rating"),
      //   url: "/rating",
      //   icon: "Star", // For events and schedules
      //   main: false,
      // },
      {
        title: lang.text("jadwal"),
        url: "/schedule-teacher",
        icon: "Clock", // For teacher schedules (time-based)
        main: false,
      },
      {
        title: lang.text("ppid"),
        url: "/ppid",
        icon: "Book", // For teachers and staff
        main: false,
      },
      // {
      //   title: lang.text("graduation"),
      //   url: "/kelulusan",
      //   icon: "GraduationCap", // For teachers and staff
      //   main: false,
      // },
      // {
      //   title: lang.text("spmb"),
      //   url: "/spmb",
      //   icon: "Book", // For teachers and staff
      //   main: false,
      // },
      // {
      //   title: lang.text("tema"),
      //   url: "/theme",
      //   icon: "Brush", // For teachers and staff
      //   main: false,
      // },
    ],
  },
  // {
  //   title: lang.text('pramuka'),
  //   url: "/scout",
  //   icon: "Tent",
  //   main: true,
  //   items: [
  //     {
  //       title: lang.text("anggota"),
  //       url: "/scout/member",
  //       icon: "Users", // For hero slider (visual banners)
  //       main: false,
  //     },
  //     {
  //       title: lang.text("galeriPramuka"),
  //       url: "/scout/gallery",
  //       icon: "File", // For welcoming message (principal's greeting)
  //       main: false,
  //     },
  //     {
  //       title: lang.text("cardPramuka"),
  //       url: "/scout/card-member",
  //       icon: "CreditCard", // For welcoming message (principal's greeting)
  //       main: false,
  //     },
  //   ],
  // },
  {
    title: lang.text("adminManagement"),
    url: "/admin/users",
    icon: "Shield",
    main: true
  },
  // {
  //   title: lang.text("TU"),
  //   url: "/admin/tata-usaha",
  //   icon: "Table",
  // },
  // {
  //   title: lang.text("asset"),
  //   url: "/asset/school",
  //   icon: "Diamond",
  // },
  // {
  //   title: lang.text("healt"),
  //   url: "/healt-bridge",
  //   icon: "Shield",
  //   main: true
  // },
  // {
  //   title: lang.text("archive"),
  //   url: "/archive",
  //   icon: "Archive",
  //   main: true
  // },
  // {
  //   title: lang.text("toolsOther"),
  //   url: "/applications-other",
  //   icon: "Menu",
  //   main: true
  // },
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