import { Button, cn } from '@/core/libs';
import { useProfile } from '@/features/profile';
import axios from 'axios';
import { Maximize, Menu, Minimize } from 'lucide-react';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import ini penting
import { toast, Toaster } from 'sonner';
import { onMessageListener, requestForToken } from './lib/firebase';
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
  const [setSidebarVisible] = useState<any>(false);
  
  const profile = useProfile();
  const token = localStorage.getItem('token'); 
  const API_URL = "https://be-school.kiraproject.id/scan-qr";
  
  const location = useLocation();

  // Logika pengecekan halaman scan
  const isScanPage = location.pathname === '/scan-qrcode';

  useEffect(() => {
    // 1. Logika Registrasi Token FCM
    const handleFCMRegistration = async () => {
      try {
        if (!token) return; // Jangan jalankan jika belum login

        const fcmToken = await requestForToken();
        
        if (fcmToken) {
          // Gunakan Axios biasa untuk update ke backend
          await axios.post(`${API_URL}/update-fcm-token`, 
            { fcmToken }, 
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log("FCM Token synchronized with server");
        }
      } catch (err) {
        console.error("FCM Registration Error:", err);
      }
    };

    handleFCMRegistration();

    // 2. Mendengarkan Notifikasi saat App Terbuka (Foreground)
    const startNotificationListener = () => {
      onMessageListener()
        .then((payload: any) => {

          toast.info(payload.notification.title, {
            description: payload.notification.body, // Akan muncul: "Budi Santoso (12345) baru saja Tap QR..."
            icon: '🔔',
            duration: 8000,
        });
          
          startNotificationListener();
        })
        .catch((err) => {
          console.error('Notification listener error:', err);
          setTimeout(startNotificationListener, 3000);
        });
    };

    startNotificationListener();
    
  }, [token]); 

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
    <>
      <Toaster richColors position="top-right" theme="dark" />
      <div className={cn(
        "dashboard-layout grid min-h-[100svh] w-full",
        // Jika halaman scan, gunakan 1 kolom (full), jika tidak gunakan grid standar
        isScanPage ? "grid-cols-1" : "md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]"
      )}>

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
                onClick={() => setSidebarVisible((v: any) => !v)}
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

          <div className={cn(
            "sidebar-layout-main max-h-svh overflow-y-auto flex flex-1 flex-col pb-10 bg-[#0D121E]",
            !isScanPage && "md:px-4" 
          )}>
            <div className={cn(
              "bg-[#0D121E] gap-4 flex-1 flex flex-col",
              isScanPage ? "p-0" : "py-4 px-3 lg:gap-6 lg:py-6" 
            )}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

DashboardLayout.displayName = 'DashboardLayout';