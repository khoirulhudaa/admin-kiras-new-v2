import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import {
  AuthPage,
  ForgetPassword,
  LoginPage,
  Logout,
  ResetPassword,
} from "@/features/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, RootPage } from "../dashboard";

// Load Component for Pages
import { CommingSoonPage, Default404, Vokadash } from "@/features/_global";
import {
  AttendanceCreate,
  HistoryAttendance,
  MatkulAttendance,
  StudentAttendance,
  TeacherAttendance,
} from "@/features/attendance";
import {
  ClassroomCreate,
  ClassroomDelete,
  ClassroomDetail,
  ClassroomEdit,
  ClassroomLanding,
} from "@/features/classroom";
import {
  CourseCreate,
  CourseDelete,
  CourseEdit,
  CourseLanding
} from "@/features/course";
import { CalendarEvent } from "@/features/events";
import { StudentCardPage, TeacherCardPage } from "@/features/kartuSiswa";
import { Otp } from "@/features/otp";
import { ParentDetail, ParentEdit, ParentLanding } from "@/features/parents";
import { EditProfileForm } from "@/features/profile";
import {
  SchoolClassroom,
  SchoolCourse,
  SchoolCreation,
  SchoolDetail,
  SchoolLanding,
  SchoolRegister,
  SchoolStudent,
  SchoolTeacher,
} from "@/features/schools";
import {
  StudentCoursePresence,
  StudentDailyPresence,
  StudentDetail,
  StudentEdit,
  StudentLanding,
  StudentLibrary,
  StudentMoodles,
  StudentParent,
} from "@/features/student";
import {
  TeacherDailyPresence,
  TeacherDetail,
  TeacherEdit,
  TeacherLanding,
} from "@/features/teacher";
import { AdminEdit, AdminLanding } from "@/features/user";
import { TULanding } from "../administration";
import { ApplicationLanding } from "../applications/pages/application";
import { AcrhiveLanding } from "../archive";
import { CalendarLanding } from "../calendar";
import { CardPage } from "../card/pages";
import { ChangePasswordFormPage } from "../changePassword/pages/form";
import { CurriculumLanding } from "../curriculum";
import { GaleriLanding } from "../galeri";
import { GraduationLanding } from "../graduation/pages";
import { HealtBridgeLanding } from "../healtBridge";
import { WorkHomeMainLanding } from "../homework/pages/taskLanding";
import { InfraLanding } from "../infrastructure";
import { JadwalLanding } from "../jadwal";
import { LayananLanding } from "../layanan";
import { LetterPreview } from "../letter/containers/letter-preview";
import { LetterPage } from "../letter/pages";
import { LibraryHomePage } from "../library/pages/home";
import { LibraryLanding } from "../library/pages/library-attedances";
import { LicensingPage } from "../licensing/pages/licensing";
import { LocationLanding } from "../locations/pages/location-landing";
import { OsisLanding } from "../osis";
import { PPDBLanding } from "../ppdb";
import { PPIDLanding } from "../ppid";
import { ScoutLanding } from "../pramuka";
import { ScheduleLanding } from "../schedules/pages/schedules-landing";
import { SchoolDistribution } from "../schools/pages/school-distribution";
import { SliderLanding } from "../slider";
import { SPMBLanding } from "../spmb";
import { StudentLandingManual } from "../student/pages/student-landing-manual";
import { TeacherLandingManual } from "../student/pages/teacher-landing";
import { GuruTendikLanding } from "../teacherAndStaff";
import { TemaLanding } from "../tema";
import { VisiMisiLanding } from "../visiMission";
import { WelcomeLanding } from "../welcome";
import { GalleryPramukaLanding } from "../galeriPramuka";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
      errorElement: <Default404 />,
      children: [
        {
          path: "format",
          element: <LetterPreview />,
        },
        {
          path: "format/pdf",
          element: <LetterPage />,
        },
        {
          path: "library",
          element: <LibraryHomePage />,
        },
        {
          path: "library/visit",
          element: <LibraryLanding />,
        },
        {
          path: "homework",
          element: <WorkHomeMainLanding />,
        },
        {
          path: "/card/generate",
          element: <StudentCardPage />,
        },
        {
          path: "/card/generate/teacher",
          element: <TeacherCardPage />,
        },
        {
          path: "/events",
          element: <CalendarEvent />,
        },
        {
          path: "/archive",
          element: <AcrhiveLanding />,
        },
        {
          path: "/osis-vote",
          element: <OsisLanding />,
        },
        {
          path: "/ppdb",
          element: <PPDBLanding />,
        },
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/location/students",
          element: <LocationLanding />,
        },
        {
          path: "schedules",
          element: <ScheduleLanding />,
        },
        {
          path: "licensing",
          element: <LicensingPage />,
        },
        {
          path: "student-absence-manual",
          element: <StudentLandingManual />,
        },
        {
          path: "teacher-absence-manual",
          element: <TeacherLandingManual />,
        },
        {
          path: "healt-bridge",
          element: <HealtBridgeLanding />,
        },
        {
          path: "format/card",
          element: <CardPage />,
        },

        {
          path: "profile/edit",
          element: <EditProfileForm />,
        },
        {
          path: "profile/change-password",
          element: <ChangePasswordFormPage />,
        },
        {
          path: "schools",
          element: <SchoolLanding />,
        },
        {
          path: "schools/distribution",
          element: <SchoolDistribution />,
        },
        {
          path: "schools/:id",
          element: <SchoolDetail />,
          children: [
            {
              index: true,
              element: <SchoolStudent />,
            },
            {
              path: "teachers",
              element: <SchoolTeacher />,
            },
            {
              path: "classrooms",
              element: <SchoolClassroom />,
            },
            {
              path: "courses",
              element: <SchoolCourse />,
            },
          ],
        },

        {
          path: "schools/edit/:id",
          element: <SchoolCreation />,
        },
        {
          path: "classrooms",
          element: <ClassroomLanding />,
        },
        {
          path: "classrooms/:id",
          element: <ClassroomDetail />,
        },
        {
          path: "classrooms/create",
          element: <ClassroomCreate />,
        },
        {
          path: "classrooms/edit/:id",
          element: <ClassroomEdit />,
        },
        {
          path: "classrooms/delete/:id",
          element: <ClassroomDelete />,
        },
        {
          path: "courses",
          element: <CourseLanding />,
        },

        {
          path: "courses/delete/:id",
          element: <CourseDelete />,
        },
        {
          path: "courses/create",
          element: <CourseCreate />,
        },
        {
          path: "courses/edit/:id",
          element: <CourseEdit />,
        },
        {
          path: "students",
          element: <StudentLanding />,
        },
        {
          path: "students/edit/:id",
          element: <StudentEdit />,
        },
        {
          path: "students/:id",
          element: <StudentDetail />,
          children: [
            {
              index: true,
              element: <StudentDailyPresence />,
            },
            {
              path: "course-presences",
              element: <StudentCoursePresence />,
            },
            {
              path: "parents",
              element: <StudentParent />,
            },
            {
              path: "library-visit",
              element: <StudentLibrary />,
            },
            {
              path: "moodle",
              element: <StudentMoodles />,
            },
          ],
        },
        {
          path: "students/create",
          element: <CommingSoonPage />,
        },
        {
          path: "students/edit/:id",
          element: <CommingSoonPage />,
        },
        {
          path: "teachers",
          element: <TeacherLanding />,
        },
        {
          path: "teachers/edit/:id",
          element: <TeacherEdit />,
        },
        {
          path: "teachers/:id",
          element: <TeacherDetail />,
          children: [
            {
              index: true,
              element: <TeacherDailyPresence />,
            },
          ],
        },
        {
          path: "slider",
          element: <SliderLanding />,
        },
         {
          path: "welcome",
          element: <WelcomeLanding />,
        },
         {
          path: "visiMission",
          element: <VisiMisiLanding />,
        },
        {
          path: "curriculum",
          element: <CurriculumLanding />,
        },
        {
          path: "calendar",
          element: <CalendarLanding />,
        },
        {
          path: "schedule-teacher",
          element: <JadwalLanding />,
        },
        {
          path: "teacherAndStaff",
          element: <GuruTendikLanding />,
        },
        {
          path: "ppid",
          element: <PPIDLanding />,
        },
        {
          path: "spmb",
          element: <SPMBLanding />,
        },
        {
          path: "scout",
          element: <ScoutLanding />,
        },
        {
          path: "scout/member",
          element: <ScoutLanding />,
        },
        {
          path: "scout/card-member",
          element: <StudentCardPage />,
        },
        {
          path: "scout/gallery",
          element: <GalleryPramukaLanding />,
        },
        {
          path: "theme",
          element: <TemaLanding />,
        },
        {
          path: "galeri",
          element: <GaleriLanding />,
        },
        {
          path: "layanan",
          element: <LayananLanding />,
        },
        {
          path: "/applications-other",
          element: <ApplicationLanding />,
        },
        {
          path: "parents",
          element: <ParentLanding />,
        },
        {
          path: "parents/:id",
          element: <ParentDetail />,
        },
        {
          path: "parents/edit/:id",
          element: <ParentEdit />,
        },
        {
          path: "/graduation",
          element: <GraduationLanding />
        },
        {
          path: "admin/users",
          element: <AdminLanding />,
        },
        {
          path: "admin/tata-usaha",
          element: <TULanding />,
        },
        {
          path: "asset/school",
          element: <InfraLanding />,
        },
        {
          path: "admin/users/edit/:id",
          element: <AdminEdit />,
        },
        {
          path: "attendance/students",
          element: <StudentAttendance />,
        },
        {
          path: "attendance/create",
          element: <AttendanceCreate />,
        },
        {
          path: "attendance/history",
          element: <HistoryAttendance />,
        },
        {
          path: "attendance/courses",
          element: <MatkulAttendance />,
        },
        {
          path: "attendance/teachers",
          element: <TeacherAttendance />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
    // {
    //   path: "/attendance",
    //   element: <HistoryAttendance />,
    // },
    {
      path: "/schools/register",
      element: <SchoolRegister />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
  ],
  {
    basename: APP_CONFIG.baseName,
  }
);

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash
      appName={APP_CONFIG.appName}
      menus={sidebarMenus}
      usermenus={usermenus}
    >
      <RouterProvider router={router} />
    </Vokadash>
  );
};

export const App = () => {
  return <RootApp />;
};
