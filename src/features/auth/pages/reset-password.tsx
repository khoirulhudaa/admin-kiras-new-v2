import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  lang,
  VokadashHead,
} from "@/core/libs";
import { InputSecure, useAlert } from "@/features/_global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../hooks";
import { resetPasswordSchema } from "../utils";

export const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    mode: "all",
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      await auth.resetPassword(data.password, String(params.token));
      alert.success(lang.text("successResetPassword"));
      form.reset();
      if(localStorage.getItem('token')) {
        localStorage.removeItem('token')
      }
      navigate("/auth/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert.error(err?.message || lang.text("errSystem"));
    }
  }

  if (!params.token) return <Navigate to="/auth/login" replace />;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <VokadashHead>
          <title>{`${lang.text("login")} | ${APP_CONFIG.appName}`}</title>
        </VokadashHead>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{lang.text("newPassword")}</FormLabel>
                <FormControl>
                  <InputSecure
                    placeholder={lang.text("inputNewPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{lang.text("confirmNewPassword")}</FormLabel>
                <FormControl>
                  <InputSecure
                    autoComplete="current_password"
                    placeholder={lang.text("inputConfirmNewPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={auth.isLoading || !form.formState.isValid}
            className="w-full"
          >
            {auth.isLoading ? lang.text("pleaseWait") : lang.text("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
