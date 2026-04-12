import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "token"; // sesuaikan key localStorage kamu

function isTokenValid(token: string): boolean {
  try {
    // Decode JWT payload (base64url → JSON)
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return false;

    // base64url → base64 standar
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    // Cek struktur payload sesuai backend kamu: { id, schoolId, iat, exp }
    if (!payload.id || !payload.schoolId) return false;

    // Cek expiry
    if (!payload.exp) return false;
    if (Date.now() >= payload.exp * 1000) return false;

    return true;
  } catch {
    return false; // token malformed
  }
}


export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || !isTokenValid(token)) {
      localStorage.removeItem(TOKEN_KEY);
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);
}