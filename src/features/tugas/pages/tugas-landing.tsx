import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import TugasMain from "../containers/tugas-main";

export const TugasLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("class")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("class"),
          url: "/calendar",
        },
      ]}
      title={lang.text("class")}
    >
      <TugasMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
