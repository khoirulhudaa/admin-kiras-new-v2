// import React from "react";
// import { Brand } from "./_components/Brand";
// import { SidebarProps } from "../types";
// import { Nav } from "../_components/Nav";
// import { cn } from "@/core/libs";

// export const DefaultSidebar = React.memo((props: SidebarProps) => {
//   return (
//     <div
//       className={cn(
//         "sidebar sidebar-default",
//         "hidden border-r bg-[#0D121E] md:block",
//         props.className,
//       )}
//     >
//       <div className=" sidebar-content flex h-full max-h-screen flex-col gap-2">
//         <Brand />
//         <div className="px-4 overflow-y-auto py-2">
//           <Nav items={props.menus} />
//         </div>
//       </div>
//     </div>
//   );
// });

// DefaultSidebar.displayName = "DashboardSidebar";


import { cn } from "@/core/libs";
import React from "react";
import { Nav } from "../_components/Nav";
import { SidebarProps } from "../types";
import { Brand } from "./_components/Brand";

export const DefaultSidebar = React.memo(({ visible, setVisible, menus, className, minimize }: SidebarProps) => {
  return (
    <div
      className={cn(
        "sidebar sidebar-default",
        "hidden border-r bg-[#070a11] md:block",
        "transition-all duration-300 ease-in-out",
        visible || !minimize ? "w-[280px]" : "w-[60px]",
        className,
      )}
      {...(minimize === true ? {
            onMouseEnter:() => setVisible?.(true), // Collapse sidebar on hover
            onMouseLeave: () => setVisible?.(false) // Expand sidebar when hover ends
          }:{}
        )
      }
    >
      <div className="sidebar-content flex h-full max-h-screen items-center flex-col gap-2">
        <Brand isCollapsed={!visible} />
        <div className="px-4 overflow-y-auto py-2">
          <Nav items={menus} isCollapsed={!visible} />
        </div>
      </div>
    </div>
  );
});

DefaultSidebar.displayName = "DashboardSidebar";