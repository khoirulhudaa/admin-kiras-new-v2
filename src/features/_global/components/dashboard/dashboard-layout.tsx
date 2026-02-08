// import { Button, cn } from '@/core/libs';
// import { useClassroom } from '@/features/classroom';
// import { useCourse } from '@/features/course';
// import { useProfile } from '@/features/profile';
// import { useSchool } from '@/features/schools';
// import { useBiodata } from '@/features/user';
// import { Maximize, Menu, Minimize } from 'lucide-react';
// import React, { PropsWithChildren, useState } from 'react';
// import { Sidebar } from './sidebar';
// import { SidebarProps } from './sidebar/types';
// import { UserMenu, UserMenuProps } from './usermenu';

// export interface DashboardLayoutProps extends PropsWithChildren {
//   menus: SidebarProps['menus'];
//   usermenus: UserMenuProps['menus'];
//   sidebarClassName?: string;
//   headerClassName?: string;
// }

// export const DashboardLayout = React.memo(({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
//   const [sidebarVisible, setSidebarVisible] = useState(false); // Ubah default ke true agar sidebar terlihat saat pertama load
//   const [minimize, setMinimize] = useState(false); // Ubah default ke true agar sidebar terlihat saat pertama load
//   const [visible, setVisible] = useState(true); // Ubah default ke true agar sidebar terlihat saat pertama load
//   const profile = useProfile();
//   const resource = useClassroom();
//   const school = useSchool();
//   const student = useBiodata();
//   const course = useCourse();
//   const [classRoom, setCreateClassRoom] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [isChatbotVisible, setIsChatbotVisible] = useState(false);

//   const filteredMenus = menus.map((data) => {
//     if(profile?.user?.role === 'superAdmin' && data?.title === 'Manajemen Perpustakaan') {
//       return false;
//     }
//     if (data.items) {
//       const filteredItems = data.items.filter(item => {
//         if (profile?.user?.role === 'superAdmin' && (item.title === 'Acara' || item.title === 'Kelulusan')) {
//           return false;
//         }
//         return true;
//       });

//       return filteredItems.length > 0
//         ? { ...data, items: filteredItems }
//         : null;
//     }
//     return data;
//   }).filter(Boolean);

//   return (
//     <>
//       <div className="dashboard-layout grid min-h-[100svh] w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
//           <Sidebar.Default 
//             menus={filteredMenus}
//             className={props.sidebarClassName}
//             visible={visible}
//             setVisible={setVisible}
//             minimize={minimize}
//           />
//           <div className="sidebar-content flex flex-col overflow-hidden">
//             <header
//               className={cn(
//                 `sidebar-header flex h-14 items-center gap-2 border-b bg-[#070a11] ${visible ? 'px-10' : 'px-0 md:px-9'} lg:h-[60px]`,
//                 props.headerClassName,
//               )}
//             >
//               <div className="relative -ml-3 z-[99] border border-white/10 overflow-hidden hover:border-white/ rounded-full">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {setVisible(!visible), setMinimize(!minimize)}}
//                   className="w-max hidden md:flex items-center px-4 overflow-hidden"
//                   title={visible ? "Hide Sidebar" : "Show Sidebar"}
//                 >
//                   {visible ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
//                   <p>{visible ? "Hide Sidebar" : "Show Sidebar"}</p>
//                 </Button>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setSidebarVisible((v) => !v)}
//                 className="hidden"
//               >
//                 <Menu className="h-6 w-6" />
//                 <span className="sr-only">Toggle sidebar</span>
//               </Button>
//               <Sidebar.Sheet className={props.sidebarClassName} menus={filteredMenus} />
//               <div className="w-full flex-1">
//               </div>
//               {/* <ThemeToggle /> */}
//               {/* <LangToggle /> */}
//               <UserMenu menus={usermenus} />
//             </header>
//             <div className="sidebar-layout-main md:px-4 max-h-svh overflow-y-auto flex flex-1 flex-col gap-4 pb-10 bg-[#0D121E]">
//               <div className="bg-[#0D121E] gap-4 flex-1 flex flex-col py-4 px-3 lg:gap-6 lg:py-6">
//                 {children}
//               </div>
//             </div>
//           </div>
//       </div>
//     </>
//   );
// });

// DashboardLayout.displayName = 'DashboardLayout';





import { Button, cn } from '@/core/libs';
import { useClassroom } from '@/features/classroom';
import { useCourse } from '@/features/course';
import { useProfile } from '@/features/profile';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user';
import { Maximize, Menu, Minimize } from 'lucide-react';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import ini penting
import { Sidebar } from './sidebar';
import { SidebarProps } from './sidebar/types';
import { UserMenu, UserMenuProps } from './usermenu';

export interface DashboardLayoutProps extends PropsWithChildren {
  menus: SidebarProps['menus'];
  usermenus: UserMenuProps['menus'];
  sidebarClassName?: string;
  headerClassName?: string;
}

export const DashboardLayout = React.memo(({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
  const [minimize, setMinimize] = useState(false);
  const [visible, setVisible] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const profile = useProfile();
  const location = useLocation();

  // Logika pengecekan halaman scan
  const isScanPage = location.pathname === '/scan-qrcode';

  // Otomatis sembunyikan sidebar di state saat masuk ke halaman scan
  useEffect(() => {
    if (isScanPage) {
      setVisible(false);
      setMinimize(true);
    } else {
      setVisible(true);
      setMinimize(false);
    }
  }, [isScanPage]);

  const filteredMenus = menus.map((data) => {
    if(profile?.user?.role === 'superAdmin' && data?.title === 'Manajemen Perpustakaan') {
      return false;
    }
    if (data.items) {
      const filteredItems = data.items.filter(item => {
        if (profile?.user?.role === 'superAdmin' && (item.title === 'Acara' || item.title === 'Kelulusan')) {
          return false;
        }
        return true;
      });

      return filteredItems.length > 0
        ? { ...data, items: filteredItems }
        : null;
    }
    return data;
  }).filter(Boolean);

  return (
    <div className={cn(
      "dashboard-layout grid min-h-[100svh] w-full",
      // Jika halaman scan, gunakan 1 kolom (full), jika tidak gunakan grid standar
      isScanPage ? "grid-cols-1" : "md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]"
    )}>
      
      {/* 1. SIDEBAR: Hanya muncul jika BUKAN halaman scan */}
      {!isScanPage && (
        <Sidebar.Default 
          menus={filteredMenus}
          className={props.sidebarClassName}
          visible={visible}
          setVisible={setVisible}
          minimize={minimize}
        />
      )}

      <div className="sidebar-content flex flex-col overflow-hidden">
        
        {/* 2. HEADER: Hanya muncul jika BUKAN halaman scan */}
        {!isScanPage && (
          <header
            className={cn(
              `sidebar-header flex h-14 items-center gap-2 border-b bg-[#070a11] ${visible ? 'px-10' : 'px-0 md:px-9'} lg:h-[60px]`,
              props.headerClassName,
            )}
          >
            <div className="relative -ml-3 z-[99] border border-white/10 overflow-hidden hover:border-white/ rounded-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {setVisible(!visible), setMinimize(!minimize)}}
                className="w-max hidden md:flex items-center px-4 overflow-hidden"
                title={visible ? "Hide Sidebar" : "Show Sidebar"}
              >
                {visible ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                <p>{visible ? "Hide Sidebar" : "Show Sidebar"}</p>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarVisible((v) => !v)}
              className="hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            
            <Sidebar.Sheet className={props.sidebarClassName} menus={filteredMenus} />
            
            <div className="w-full flex-1"></div>
            <UserMenu menus={usermenus} />
          </header>
        )}

        {/* 3. MAIN CONTENT AREA */}
        <div className={cn(
          "sidebar-layout-main max-h-svh overflow-y-auto flex flex-1 flex-col pb-10 bg-[#0D121E]",
          !isScanPage && "md:px-4" // Beri padding hanya jika bukan halaman scan
        )}>
          <div className={cn(
            "bg-[#0D121E] gap-4 flex-1 flex flex-col",
            isScanPage ? "p-0" : "py-4 px-3 lg:gap-6 lg:py-6" // Hilangkan padding jika halaman scan agar kamera full screen
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';