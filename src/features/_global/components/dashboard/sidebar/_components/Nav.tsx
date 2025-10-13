import { cn, lang } from '@/core/libs';
import React, { useCallback, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItemProps, NavProps } from '../types';
import { ChevronDown, ChevronRight, Gem } from 'lucide-react';
import { Icon, SidebarContext } from '@/features/_global';
import { useProfile } from '@/features/profile';

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

  // Sembunyikan item dengan main: true saat isCollapsed = true
  if (isCollapsed && main) {
    return (
      <>
        {hasChild && (
          <Nav
            isChild={true} // Pastikan isChild = true untuk item anak
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
      <li className="relative">
        <NavLink
          onClick={showTooltip && !isMember ? undefined : handleClick}
          to={showTooltip && !isMember ? '#' : props.url || ''}
          className={(p) =>
            cn(
              'sidebar-nav-item flex gap-3 max-w-[250px] px-3 py-2 mb-2 items-center rounded-lg border-none hover:bg-muted-foreground/15 justify-between text-sm relative group',
              p.isActive && !isDisabled && 'bg-muted-foreground/15',
              isCollapsed && 'justify-center px-2',
              isDisabled && 'bg-muted-foreground/15 cursor-not-allowed text-white/40',
              !isMember && isParentManajemenData && props.title === lang.text('event') && 'bg-muted-foreground/15 cursor-not-allowed text-white/40',
              isChild && !isCollapsed && 'pl-6'
            )
          }
          end
        >
          <div
            className={cn(
              'flex flex-row items-center gap-2',
              isCollapsed && 'justify-center',
            )}
          >
            {props.icon && (
              <Icon
                iconName={props.icon}
                className="sidebar-nav-item-icon h-4 w-4"
              />
            )}
            {!isCollapsed && props.title}
            {showTooltip && !isCollapsed && !isMember && <Gem className="w-[14px] h-[14px] text-yellow-500" />}
          </div>
          {hasChild && !isCollapsed && (
            visibleChild ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
          {showTooltip && !isMember && (
            <span
              className={cn(
                'absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 whitespace-nowrap z-50',
                isCollapsed && 'left-full translate-x-2 bottom-1/2 translate-y-1/2',
              )}
            >
              Belum aktifkan member ✨
            </span>
          )}
        </NavLink>
      </li>
      {hasChild && (visibleChild || isCollapsed) && (
        <Nav
          isChild={true} // Pastikan isChild = true untuk item anak
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
    return (
      <ul
        className={cn(
          isChild && !isCollapsed ? 'pl-2.5' : '',
        )}
      >
        {items?.map((item, index) => (
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