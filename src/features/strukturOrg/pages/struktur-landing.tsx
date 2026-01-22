import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { EmployeeManager } from "../containers";

export const StrukturORGLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("employee")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("employee"),
          url: "/pegawai",
        },
      ]}
      title={lang.text("employee")}
    >
      <EmployeeManager />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
