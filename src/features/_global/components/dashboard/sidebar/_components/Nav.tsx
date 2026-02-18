import { cn, lang } from '@/core/libs';
import { Icon, SidebarContext } from '@/features/_global';
import { useProfile } from '@/features/profile';
import { ChevronRight, Gem } from 'lucide-react';
import React, { useCallback, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItemProps, NavProps } from '../types';

interface NavItemPropsExtended extends NavItemProps {
  isCollapsed?: boolean;
  isParentManajemenData?: boolean;
  isChild?: boolean;
  main?: boolean;
}

const NavItem = React.memo(({ isCollapsed, isParentManajemenData = false, isChild = false, main = false, ...props }: NavItemPropsExtended) => {
  const [visibleChild, setVisibleChild] = React.useState(false);
  const sidebarContext = useContext(SidebarContext);
  const hasChild = useMemo(() => props.items && props.items?.length > 0, [props.items]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      if (!hasChild) return sidebarContext.setVisible();
      if (hasChild) {
        e.preventDefault?.();
      }
      setVisibleChild((v) => !v);
    },
    [hasChild, sidebarContext],
  );

  const profile = useProfile();
  const isMember = profile?.user?.member === 'member';

  const isDisabled = [
    lang.text('printCard'),
    lang.text('studentCard'),
    lang.text('teacherCard'),
    lang.text('libraryManagement'),
    lang.text('formatManagement'),
  ].includes(props?.title) && !isMember && profile?.user?.role !== 'superAdmin';

  const showTooltip = isDisabled || (isParentManajemenData && props.title === lang.text('event'));

  if (isCollapsed && main) {
    return (
      <>
        {hasChild && (
          <Nav
            isChild={true}
            items={props.items || []}
            mobile={props.mobile}
            isCollapsed={isCollapsed}
            isParentManajemenData={props.title === lang.text('dataManagement')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <li className="relative list-none">
        <NavLink
          onClick={showTooltip && !isMember ? undefined : handleClick}
          to={showTooltip && !isMember ? '#' : props.url || ''}
          className={(p) =>
            cn(
              // Base Styles
              'group relative flex items-center justify-between gap-3 px-3 py-2.5 mb-1 rounded-xl text-[13px] font-medium transition-all duration-200',
              'text-slate-400 hover:text-blue-400 hover:bg-blue-600/5',
              
              // Active State: Premium Blue Glow & Border Indicator
              p.isActive && !isDisabled && [
                'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_15px_rgba(37,99,235,0.05)]',
                'after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:bg-blue-500 after:rounded-l-full'
              ],
              
              // Collapsed Mode
              isCollapsed && 'justify-center px-0 h-11 w-11 mx-auto',
              
              // Child Menu Styling
              isChild && !isCollapsed && 'ml-4 pl-5 border-l border-slate-800 hover:border-blue-500/50 rounded-none mb-0',
              
              // Disabled & Premium Lock
              isDisabled && 'opacity-40 cursor-not-allowed grayscale-[0.5]',
              !isMember && isParentManajemenData && props.title === lang.text('event') && 'opacity-40 cursor-not-allowed'
            )
          }
          // end
        >
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            {props.icon && (
              <Icon
                iconName={props.icon}
                className={cn(
                  "h-4.5 w-4.5 transition-all duration-300 group-hover:scale-110",
                  "text-white group-hover:text-blue-500"
                )}
              />
            )}
            
            {!isCollapsed && (
              <span className="truncate tracking-wide">{props.title}</span>
            )}

            {/* Premium Indicator */}
            {showTooltip && !isCollapsed && !isMember && (
              <Gem className="w-3 h-3 text-amber-500 animate-pulse ml-auto" />
            )}
          </div>

          {/* Submenu Arrow */}
          {hasChild && !isCollapsed && (
            <div className={cn('transition-transform duration-300 opacity-40 group-hover:opacity-100', visibleChild && 'rotate-90 text-blue-500')}>
              <ChevronRight size={14} />
            </div>
          )}

          {/* Premium Tooltip */}
          {showTooltip && !isMember && (
            <span
              className={cn(
                'absolute hidden group-hover:block bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-xl z-[100] whitespace-nowrap pointer-events-none',
                isCollapsed 
                  ? 'left-full translate-x-3 top-1/2 -translate-y-1/2' 
                  : 'right-2 -top-6'
              )}
            >
              PRO ONLY ✨
            </span>
          )}
        </NavLink>
      </li>

      {/* Child Submenu Container */}
      {hasChild && (visibleChild || isCollapsed) && (
        <Nav
          isChild={true}
          items={props.items || []}
          mobile={props.mobile}
          isCollapsed={isCollapsed}
          isParentManajemenData={props.title === lang.text('dataManagement')}
        />
      )}
    </>
  );
});

export const Nav = React.memo(
  ({ items = [], mobile = false, isChild = false, isCollapsed, isParentManajemenData }: NavProps & { isCollapsed?: boolean; isParentManajemenData?: boolean }) => {

    const profile = useProfile();
    const userRole = profile?.user?.role;

   const filteredItems = useMemo(() => {
      // 1. Jika Role adalah superAdmin
      if (userRole === 'superAdmin') {
        const excludedTitles = [
          "WEBSITE SEKOLAH",
          "MANAJEMEN KELAS",
          "MANAJEMEN GURU",
          "RIWAYAT KEHADIRAN",
          "MANAJEMEN SISWA",
          "MANAJEMEN ORTU",
          "PEKERJAAN RUMAH"
        ];
        return items.filter((item: any) => !excludedTitles.includes(item.title));
      }

      // 2. Jika BUKAN superAdmin (Role: Staff, Admin, dll)
      // Sembunyikan menu Dashboard/Statistik
      return items.filter(item => {
        // Pastikan teks "dashboard" sesuai dengan yang ada di MENU_STAFF (case sensitive)
        const isDashboard = item.title === "STATISTIK SEKOLAH";
        return !isDashboard;
      });
    }, [items, userRole]);

   return (
      <ul
        className={cn(
          "flex flex-col list-none p-0 m-0",
          isChild && !isCollapsed ? 'mt-0.5' : '',
        )}
      >
        {filteredItems?.map((item, index) => (
          <NavItem
            key={index}
            {...item}
            mobile={mobile}
            isCollapsed={isCollapsed}
            isParentManajemenData={isParentManajemenData}
            isChild={isChild}
          />
        ))}
      </ul>
    );
  },
);

Nav.displayName = 'Nav';