import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import ProgramMain from "../containers/program-main";

export const ProgramLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("program")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("program"),
          url: "/program",
        },
      ]}
      title={lang.text("program")}
    >
    <ProgramMain />
    </DashboardPageLayout>
  );
};
