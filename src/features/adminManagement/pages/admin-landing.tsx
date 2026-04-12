import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import AdminManagement from "../containers/admin-main";

export const AdminManagementLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('parent')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('parent'),
          url: "/data-siswa",
        },
      ]}
      title={lang.text('parent')}
    >
      <AdminManagement />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
