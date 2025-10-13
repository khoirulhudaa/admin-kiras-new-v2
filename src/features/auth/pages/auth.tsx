import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { Images } from "@/core/utils";
import { Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "../components/auth-layout";
import { useAuth } from "../hooks/auth";

export const AuthPage = () => {
  const auth = useAuth();

  if (auth.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // useEffect(() => {
  //   localStorage.removeItem('token');
  // }, [])

  return (
    <AuthLayout
      logo={Images.logo}
      image="https://democms.byito.dev/assets/a0bee8fb-070f-4337-911e-4e8a33351494"
      title={APP_CONFIG.appName}
      description={lang.text("loginDesc")}
    >
      <Outlet />
    </AuthLayout>
  );
};
