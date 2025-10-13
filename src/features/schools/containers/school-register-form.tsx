/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/core/libs"
import { Link, useNavigate } from "react-router-dom"
import { SchoolCreationFormSchema, schoolCreationFormSchema } from "../utils"
import { useForm } from "react-hook-form"
import { FileUploader, InputMap, useAlert } from "@/features/_global"
import { useSchoolCreation } from "../hooks"
import { lang, simpleEncode } from "@/core/libs"
import { z } from "zod"
import { useEffect, useState } from "react"
import { getCoordinates, requestLocationPermission } from "@/core/utils"
import { Eye, EyeOff } from "lucide-react"

export function SchoolRegisterForm() {
  const schoolCreation = useSchoolCreation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const alert = useAlert()

  const form = useForm<z.infer<SchoolCreationFormSchema>>({
    resolver: zodResolver(schoolCreationFormSchema),
    mode: "onBlur",
    defaultValues: {
      alamatSekolah: "",
      schoolName: "",
      schoolNPSN: "",
      schoolLogo: null,
      schoolFile: null,
      schoolStatus: "0",
      schoolAdmin: "",
      moodleApiUrl: "",
      tokenMoodle: "",
      libraryServer: "",
      location: {
        lat: 0,
        lng: 0,
      },
    },
  })

  async function onSubmit(data: z.infer<SchoolCreationFormSchema>) {
    console.log("data", data)
    try {
      await schoolCreation.register({
        namaSekolah: data.schoolName,
        npsn: data.schoolNPSN,
        namaAdmin: data.schoolAdmin,
        latitude: data.location.lat,
        longitude: data.location.lng,
        tokenModel: data.tokenMoodle,
        email: data.email,
        password: data.password,
        modelApiUrl: data.moodleApiUrl,
        file: data.schoolFile,
      })

      const otpZ = JSON.stringify({
        email: data.email,
        navigateTo: "/auth/login",
      })

      const encodedOtpZ = simpleEncode(otpZ)

      navigate(`/otp?z=${encodedOtpZ}`, { replace: true })
    } catch (err: any) {
      console.log("err =>", err)
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("addSchool"),
          })
      )
    }
  }

  useEffect(() => {
    requestLocationPermission().then(() => {
      getCoordinates()
        .then((res) => {
          form.setValue("location", {
            lat: res.latitude,
            lng: res.longitude,
          })
        })
        .catch((err: any) => {
          alert.error(err?.message || lang.text("errSystem"))
        })
    })
  }, [alert, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              {lang.text("registerYourSchool")}
            </CardTitle>
            <CardDescription>
              {lang.text("registerYourSchoolDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("schoolName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputSchoolName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolNPSN"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("npsn")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukan nama sekolah" {...field} />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <InputMap
                        label="Pilih Lokasi Peta"
                        onChange={(v) => field.onChange(v)}
                        value={field.value}
                      />
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="schoolAdmin"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("adminName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputAdminName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alamatSekolah"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("alamatSekolah")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan alamat sekolah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("adminEmail")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={lang.text("inputAdminEmail")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="off"
                              placeholder={lang.text("inputPassword")}
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Input Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("confirmPassword")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="off"
                              placeholder={lang.text("inputConfirmPassword")}
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center px-3"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </>
                <FormField
                  control={form.control}
                  name="moodleApiUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("moodleApiUrl")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputMoodleApiUrl")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenMoodle"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text("tokenMoodle")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputTokenMoodle")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="schoolFile"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("schoollogo")}</FormLabel>
                        <FileUploader
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          buttonPlaceholder="Upload berkas sekolah"
                          onError={(e) =>
                            form.setError("schoolFile", { message: e })
                          }
                          showButton={false}
                          error={fieldState.error?.message}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {lang.text("register")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {lang.text("needHelp")}{" "}
              <Link to="#" className="underline">
                {lang.text("contactUs")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
