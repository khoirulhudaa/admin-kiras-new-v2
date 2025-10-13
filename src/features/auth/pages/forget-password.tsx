import { Button, Input, Label, VokadashHead } from "@/core/libs";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import { FormEventHandler, useState } from "react";
import { useAlert } from "@/features/_global";
import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";

export const ForgetPassword = () => {
  const auth = useAuth();

  const alert = useAlert();
  const [email, setEmail] = useState("");

  const submit: FormEventHandler = async (e) => {
    e?.preventDefault?.();
    try {
      const response = await auth.forgotPassword(email);
      console.log('token forgot:', response)
      alert.success(
        `Permintaan reset password sudah terkirim ke email ${email}, silahkan cek di kotak masuk pada email tersebut`,
      );
      setEmail("");
      // navigate("/", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert.error(err?.message || lang.text("errSystem"));
    }
  };

  return (
    <form onSubmit={submit}>
      <VokadashHead>
        <title>{`${lang.text("forgetPassword")} | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Masukan email anda"
            required
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>

        <Button type="submit" disabled={auth.isLoading} className="w-full">
          {auth.isLoading ? lang.text("pleaseWait") : lang.text("send")}
        </Button>
        <div>
          <p className="text-sm">
            {lang.text("hasAccount")}{" "}
            <Link to="/auth/login" className="underline">
              {lang.text("login")}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};
