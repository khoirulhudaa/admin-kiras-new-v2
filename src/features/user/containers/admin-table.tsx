// import { useUserAdmin } from "@/features/user";
// import { adminUserColumns, adminUserDataFallback } from "@/features/user";
// import { BaseDataTable } from "@/features/_global";
// import { lang } from "@/core/libs";
// import { useMemo } from "react";

// export function AdminTable() {
//   const biodata = useUserAdmin();

//   const columns = useMemo(() => adminUserColumns(), []);

//   return (
//     <BaseDataTable
//       columns={columns}
//       data={biodata.data}
//       dataFallback={adminUserDataFallback}
//       globalSearch
//       searchParamPagination
//       // showFilterButton
//       searchPlaceholder={lang.text("search")}
//       isLoading={biodata.query.isLoading}
//     />
//   );
// }

import { AdminCreationForm, useUserAdmin } from "@/features/user";
import { adminUserColumns, adminUserDataFallback } from "@/features/user";
import { BaseActionTable, BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs"; // Assuming you have a Dialog component
import { UserDataModel } from "@/core/models";
import { simpleEncode } from "@/core/libs";

export function AdminTable() {
  const biodata = useUserAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);

  const columns = useMemo(() => {
    const cols = adminUserColumns();
    // Modify the last column (action column) to use onEdit instead of editPath
    return cols.map((col) => {
      if (col.accessorKey === "id") {
        return {
          ...col,
          cell: ({ row }) => {
            const encryptPayload = simpleEncode(
              JSON.stringify({ id: row.original.id, text: row.original.name }),
            );
            return (
              <BaseActionTable
                onEdit={() => {
                  setSelectedUser(row.original); // Set the user to edit
                  setIsModalOpen(true); // Open the modal
                }}
                // detailPath={/admin/users/${encryptPayload}}
                // deletePath={/admin/users/delete/${encryptPayload}}
              />
            );
          },
        };
      }
      return col;
    });
  }, []);

  console.log('biodata.data', biodata.data)

  return (
    <>
      <BaseDataTable
        columns={columns}
        data={biodata.data}
        dataFallback={adminUserDataFallback}
        globalSearch
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editUser")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <AdminCreationForm
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}






// INI VERSI BARU
// import {
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Checkbox,
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   Input,
//   Label,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   Textarea,
// } from "@/core/libs";
// import { motion } from "framer-motion";
// import {
//   CheckCircle2,
//   Download,
//   Edit,
//   Lock,
//   Mail,
//   MoreHorizontal,
//   Phone,
//   RotateCcw,
//   Search as SearchIcon,
//   Trash2,
//   Unlock,
//   UploadCloud,
//   UserCog,
//   UserPlus,
//   XCircle,
// } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Toaster, toast } from "sonner";
// /*********************** Types ************************/
// const ROLES = ["Admin Sekolah", "Operator", "Kepala Sekolah"] as const;
// const STATUS = ["Aktif", "Nonaktif", "Terkunci"] as const;
// type Role = typeof ROLES[number];
// type AdminStatus = typeof STATUS[number];
// type SchoolInfo = { id: string; name: string; npsn: string };
// type SchoolAdmin = {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: Role;
//   status: AdminStatus;
//   lastLogin?: string;
//   createdAt: string;
// };
// type LogEntry = {
//   id: string;
//   at: string;
//   action: string;
//   targetId?: string;
//   detail?: string;
//   ip?: string;
// };
// /*********************** Seeds ************************/
// const SCHOOL: SchoolInfo = {
//   id: "SCH-01",
//   name: "SMPN 1 Lembang",
//   npsn: "202001",
// };
// const adminsSeed: SchoolAdmin[] = [
//   {
//     id: "ADM-2001",
//     name: "Admin Utama",
//     email: "admin@smpn1.sch.id",
//     phone: "0812-1111-1111",
//     role: "Admin Sekolah",
//     status: "Aktif",
//     lastLogin: "2025-08-28T07:10:00",
//     createdAt: "2024-01-10",
//   },
//   {
//     id: "ADM-2002",
//     name: "Operator TU",
//     email: "operator@smpn1.sch.id",
//     phone: "0813-3333-4444",
//     role: "Operator",
//     status: "Aktif",
//     lastLogin: "2025-08-27T10:45:00",
//     createdAt: "2024-03-02",
//   },
//   {
//     id: "ADM-2003",
//     name: "Kepala Sekolah",
//     email: "kepsek@smpn1.sch.id",
//     phone: "0817-5555-6666",
//     role: "Kepala Sekolah",
//     status: "Terkunci",
//     createdAt: "2024-05-21",
//   },
// ];
// /*********************** Helpers ************************/
// function formatDate(iso?: string) {
//   if (!iso) return "-";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString("id-ID");
//   } catch {
//     return iso!;
//   }
// }
// function genId(prefix: string) {
//   return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
// }
// function generateTempPassword(): string {
//   const chars =
//     "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
//   let out = "";
//   for (let i = 0; i < 10; i++) {
//     out += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return out;
// }
// // CSV <-> Admins
// function parseAdminsCSV(text: string): SchoolAdmin[] {
//   const [header, ...rows] = text.split(/\r?\n/).filter(Boolean);
//   const headers = (header || "").split(",").map((h) => h.trim());
//   const idx = (k: string) => headers.indexOf(k);
//   return rows
//     .map((r) => {
//       const c = r.split(",");
//       return {
//         id: c[idx("id")] || genId("ADM"),
//         name: c[idx("name")] || "",
//         email: c[idx("email")] || "",
//         phone: c[idx("phone")] || undefined,
//         role: (c[idx("role")] as Role) || "Operator",
//         status: (c[idx("status")] as AdminStatus) || "Aktif",
//         createdAt: c[idx("createdAt")] || new Date().toISOString().slice(0, 10),
//         lastLogin: c[idx("lastLogin")] || undefined,
//       } as SchoolAdmin;
//     })
//     .filter((a) => a.name && a.email);
// }
// function toCSV(rows: SchoolAdmin[]): string {
//   const headers = [
//     "id",
//     "name",
//     "email",
//     "phone",
//     "role",
//     "status",
//     "createdAt",
//     "lastLogin",
//   ];
//   const body = rows
//     .map((a) => headers.map((h) => (a as any)[h] ?? "").toString())
//     .join("\n");
//   return headers.toString() + "\n" + body + "\n";
// }
// // Permission matrix (sekolah)
// function canManage(current: Role, target: SchoolAdmin): boolean {
//   if (current === "Admin Sekolah") return true; // full
//   if (current === "Kepala Sekolah") return target.role !== "Admin Sekolah"; // tidak boleh ubah admin utama
//   if (current === "Operator") return target.role === "Operator"; // hanya sesama operator
//   return false;
// }
// function canDelete(current: Role, target: SchoolAdmin): boolean {
//   return current === "Admin Sekolah" && target.role !== "Admin Sekolah";
// }
// function canLock(current: Role, target: SchoolAdmin): boolean {
//   return canManage(current, target);
// }
// function canActivate(current: Role, target: SchoolAdmin): boolean {
//   return canLock(current, target);
// }
// /*********************** Component ************************/
// export function AdminTable() {
//   const [admins, setAdmins] = useState<SchoolAdmin[]>(adminsSeed);
//   const [currentRole, setCurrentRole] = useState<Role>("Admin Sekolah"); // simulasi siapa yang login
//   const [logs, setLogs] = useState<LogEntry[]>([
//     {
//       id: "LOG-001",
//       at: new Date(Date.now() - 3600 * 1000).toISOString(),
//       action: "LOGIN",
//       targetId: "ADM-2001",
//       detail: "Admin Utama berhasil login",
//       ip: "103.23.45.67",
//     },
//     {
//       id: "LOG-002",
//       at: new Date(Date.now() - 7200 * 1000).toISOString(),
//       action: "UPDATE_ADMIN",
//       targetId: "ADM-2002",
//       detail: "Operator TU ubah nomor telepon",
//       ip: "103.23.45.68",
//     },
//     {
//       id: "LOG-003",
//       at: new Date(Date.now() - 10800 * 1000).toISOString(),
//       action: "RESET_PASSWORD",
//       targetId: "ADM-2003",
//       detail: "Reset oleh Admin Utama",
//       ip: "103.23.45.69",
//     },
//   ]);
//   const [publicIp, setPublicIp] = useState<string | undefined>(undefined);
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("https://api.ipify.org?format=json");
//         const data = await res.json();
//         setPublicIp(data?.ip);
//       } catch {
//         /* offline/no-network safe */
//       }
//     })();
//   }, []);
//   // dialog reset password
//   const [resetInfo, setResetInfo] = useState<{
//     admin: SchoolAdmin;
//     temp: string;
//   } | null>(null);
//   // filters
//   const [q, setQ] = useState("");
//   const [fRole, setFRole] = useState<string>("ALL");
//   const [fStatus, setFStatus] = useState<string>("ALL");
//   // selection for bulk actions
//   const [selected, setSelected] = useState<Record<string, boolean>>({});
//   // ui state
//   const [detail, setDetail] = useState<SchoolAdmin | null>(null);
//   const [showAdd, setShowAdd] = useState(false);
//   const [toDelete, setToDelete] = useState<SchoolAdmin | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const filtered = useMemo(
//     () =>
//       admins.filter(
//         (a) =>
//           (fRole === "ALL" || a.role === fRole) &&
//           (fStatus === "ALL" || a.status === fStatus) &&
//           (q === "" || `${a.name} ${a.email} ${a.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()))
//       ),
//     [admins, q, fRole, fStatus]
//   );
//   const filteredIds = filtered.map((a) => a.id);
//   // stats
//   const total = admins.length;
//   const aktif = admins.filter((a) => a.status === "Aktif").length;
//   const nonaktif = admins.filter((a) => a.status === "Nonaktif").length;
//   const terkunci = admins.filter((a) => a.status === "Terkunci").length;
//   function log(action: string, targetId?: string, detail?: string) {
//     setLogs((prev) =>
//       [
//         { id: genId("LOG"), at: new Date().toISOString(), action, targetId, detail, ip: publicIp },
//         ...prev,
//       ].slice(0, 100)
//     );
//   }
//   // actions
//   function addAdmin(a: SchoolAdmin) {
//     setAdmins((prev) => [a, ...prev]);
//     toast.success("Admin ditambahkan");
//     log("ADD_ADMIN", a.id, `${a.name}`);
//   }
//   function updateAdmin(a: SchoolAdmin) {
//     setAdmins((prev) => prev.map((x) => (x.id === a.id ? a : x)));
//     toast("Perubahan disimpan");
//     log("UPDATE_ADMIN", a.id);
//   }
//   function deleteAdmin(id: string) {
//     const tgt = admins.find((x) => x.id === id);
//     setAdmins((prev) => prev.filter((x) => x.id !== id));
//     setToDelete(null);
//     toast("Admin dihapus");
//     log("DELETE_ADMIN", id, tgt?.name);
//   }
//   function toggleActive(a: SchoolAdmin) {
//     if (!canActivate(currentRole, a)) return;
//     const next: AdminStatus = a.status === "Aktif" ? "Nonaktif" : "Aktif";
//     updateAdmin({ ...a, status: next });
//     toast(next === "Aktif" ? "Akun diaktifkan" : "Akun dinonaktifkan");
//     log(next === "Aktif" ? "ACTIVATE" : "DEACTIVATE", a.id);
//   }
//   function lockUnlock(a: SchoolAdmin) {
//     if (!canLock(currentRole, a)) return;
//     const next: AdminStatus = a.status === "Terkunci" ? "Aktif" : "Terkunci";
//     updateAdmin({ ...a, status: next });
//     toast(next === "Aktif" ? "Akun di-unlock" : "Akun terkunci");
//     log(next === "Aktif" ? "UNLOCK" : "LOCK", a.id);
//   }
//   function resetPassword(a: SchoolAdmin) {
//     const temp = generateTempPassword();
//     setResetInfo({ admin: a, temp });
//     console.log("[MOCK] send password reset:", { to: a.email, temp });
//     log("RESET_PASSWORD", a.id);
//   }
//   function downloadTemplate() {
//     const csv =
//       "id,name,email,phone,role,status,createdAt,lastLogin\n" +
//       `ADM-0001,Contoh Admin,admin@sekolah.sch.id,0812-0000-0000,Operator,Aktif,2025-08-20,2025-08-28T09:00:00`;
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "template_admin_sekolah.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//     log("DOWNLOAD_TEMPLATE");
//   }
//   function exportCSV() {
//     const csv = toCSV(filtered);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "sekolah_admin.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//     log("EXPORT_CSV", undefined, `${filtered.length} rows`);
//   }
//   function handleImportCSV(file: File) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const text = String(reader.result || "");
//       const imported = parseAdminsCSV(text);
//       if (imported.length === 0) {
//         toast.error("File kosong atau format salah.");
//         return;
//       }
//       setAdmins((prev) => [...imported, ...prev]);
//       toast.success(`${imported.length} admin diimpor`);
//       log("IMPORT_CSV", undefined, `${imported.length} rows`);
//     };
//     reader.readAsText(file);
//   }
//   // Bulk actions
//   function selectedIds() {
//     return Object.entries(selected)
//       .filter(([, v]) => v)
//       .map(([k]) => k);
//   }
//   function bulkSetStatus(next: AdminStatus) {
//     const ids = selectedIds();
//     if (ids.length === 0) return;
//     const eligible = admins
//       .filter((a) => ids.includes(a.id) && canActivate(currentRole, a))
//       .map((a) => a.id);
//     const skipped = ids.filter((id) => !eligible.includes(id));
//     if (eligible.length > 0) {
//       setAdmins((prev) =>
//         prev.map((a) => (eligible.includes(a.id) ? { ...a, status: next } : a))
//       );
//     }
//     setSelected({});
//     toast(
//       `${eligible.length} akun → ${next}${
//         skipped.length ? `, ${skipped.length} dilewati` : ""
//       }`
//     );
//     log(
//       "BULK_STATUS",
//       undefined,
//       `${eligible.length} -> ${next}; skipped=${skipped.length}`
//     );
//   }
//   function bulkLock(lock: boolean) {
//     const ids = selectedIds();
//     if (ids.length === 0) return;
//     const eligible = admins
//       .filter((a) => ids.includes(a.id) && canLock(currentRole, a))
//       .map((a) => a.id);
//     const skipped = ids.filter((id) => !eligible.includes(id));
//     if (eligible.length > 0) {
//       setAdmins((prev) =>
//         prev.map((a) =>
//           eligible.includes(a.id)
//             ? { ...a, status: lock ? "Terkunci" : "Aktif" }
//             : a
//         )
//       );
//     }
//     setSelected({});
//     toast(
//       `${eligible.length} akun ${lock ? "terkunci" : "di-unlock"}${
//         skipped.length ? `, ${skipped.length} dilewati` : ""
//       }`
//     );
//     log(
//       lock ? "BULK_LOCK" : "BULK_UNLOCK",
//       undefined,
//       `${eligible.length}; skipped=${skipped.length}`
//     );
//   }
//   function bulkDelete() {
//     const ids = selectedIds();
//     if (ids.length === 0) return;
//     if (currentRole !== "Admin Sekolah") {
//       toast.error("Hanya Admin Sekolah yang dapat menghapus");
//       return;
//     }
//     const eligible = admins
//       .filter((a) => ids.includes(a.id) && canDelete(currentRole, a))
//       .map((a) => a.id);
//     const skipped = ids.filter((id) => !eligible.includes(id));
//     setAdmins((prev) => prev.filter((a) => !eligible.includes(a.id)));
//     setSelected({});
//     toast.success(
//       `${eligible.length} admin dihapus${
//         skipped.length ? `, ${skipped.length} dilewati` : ""
//       }`
//     );
//     log("BULK_DELETE", undefined, `${eligible.length}; skipped=${skipped.length}`);
//   }
//   // DEV TESTS
//   useEffect(() => {
//     try {
//       console.assert(typeof Toaster !== "undefined", "Toaster diimport");
//       console.assert(typeof toast === "function", "toast tersedia");
//       console.assert(
//         generateTempPassword().length >= 8,
//         "Temp password length"
//       );
//       console.assert(
//         parseAdminsCSV(
//           "id,name,email,phone,role,status,createdAt,lastLogin\n,Test,admin@test.sch.id,,-,Aktif,2025-08-01,"
//         ).length === 1,
//         "CSV parse 1 row"
//       );
//       console.assert(
//         parseAdminsCSV(
//           "id,name,email,phone,role,status,createdAt,lastLogin\n"
//         ).length === 0,
//         "CSV parse empty"
//       );
//       console.assert(
//         toCSV([adminsSeed[0]]).startsWith(
//           "id,name,email,phone,role,status,createdAt,lastLogin\n"
//         ),
//         "CSV header ok"
//       );
//       // permission checks
//       const admin = adminsSeed[0];
//       const operator = adminsSeed[1];
//       console.assert(
//         canManage("Admin Sekolah", operator) === true,
//         "Admin Sekolah manage all"
//       );
//       console.assert(
//         canManage("Kepala Sekolah", admin) === false,
//         "Kepsek tidak ubah Admin Sekolah"
//       );
//       console.assert(
//         canManage("Operator", operator) === true &&
//           canManage("Operator", admin) === false,
//         "Operator hanya operator"
//       );
//       // extra: dummy logs memuat IP
//       console.assert(!logs[0] || (logs[0].ip ? logs[0].ip.includes(".") : true), "Dummy IP ok");
//       console.log("[DEV TESTS] ok ✅");
//     } catch (e) {
//       console.warn("[DEV TESTS] fail", e);
//     }
//   }, []);
//   return (
//     <div className="w-full min-h-screen dark:text-white">
//       <style>
//         {`
//           select option {
//             background: #F9FAFB !important;
//             color: #1F2937;
//           }
//           select option:checked,
//           select option:hover {
//             background: #14B8A6 !important;
//             color: #FFFFFF;
//           }
//           @media (prefers-color-scheme: dark) {
//             select option {
//               background: #1F2A44 !important;
//               color: #FFFFFF;
//             }
//             select option:checked,
//             select option:hover {
//               background: #14B8A6 !important;
//               color: #FFFFFF;
//             }
//           }
//         `}
//       </style>
//       <div className="max-w-full mx-auto">
//         <div className="flex items-center justify-between">
//           {/* <div>
//             <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
//               <UserCog className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//               Sekolah – Manajemen Admin
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {SCHOOL.name} • NPSN {SCHOOL.npsn}
//             </p>
//           </div> */}
//           {/* <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-600 dark:text-gray-400">Masuk sebagai</span>
//             <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as Role)}>
//               <SelectTrigger className="w-44 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {ROLES.map((r) => (
//                   <SelectItem key={r} value={r}>
//                     {r}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div> */}
//         </div>
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           {[
//             { title: "Total Admin", value: total, desc: "Semua akun", icon: <UserCog className="h-5 w-5 text-gray-600 dark:text-gray-400" /> },
//             { title: "Aktif", value: aktif, desc: "Dapat login", icon: <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-400" /> },
//             { title: "Nonaktif", value: nonaktif, desc: "Dinonaktifkan", icon: <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" /> },
//             { title: "Terkunci", value: terkunci, desc: "Butuh unlock", icon: <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" /> },
//           ].map((it, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.25, delay: idx * 0.05 }}
//             >
//               <Card className="h-max bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//                 <CardHeader className="flex items-start justify-start pb-2">
//                   <CardTitle className="flex items-start gap-3 text-sm tracking-wide text-gray-600 dark:text-gray-400">
//                     {/* {it.icon} */}
//                     {it.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl mt-2 font-semibold text-gray-800 dark:text-white">{it.value}</div>
//                   <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{it.desc}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//         {/* Panel utama */}
//         <Card className="mb-6 bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//           <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//             <div>
//               <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
//                 <UserCog className="w-4 h-4 text-gray-600 dark:text-gray-400" /> Daftar Admin
//               </CardTitle>
//               <CardDescription className="text-black dark:text-white">Kelola role & status akun admin sekolah.</CardDescription>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="gap-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <UploadCloud className="h-4 w-4" /> Import CSV
//               </Button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   const f = e.target.files?.[0];
//                   if (f) handleImportCSV(f);
//                   e.currentTarget.value = "";
//                 }}
//               />
//               <Button
//                 variant="outline"
//                 onClick={downloadTemplate}
//                 className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Unduh Template
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={exportCSV}
//                 className="gap-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <Download className="h-4 w-4" /> Export CSV
//               </Button>
//               <Button
//                 onClick={() => setShowAdd(true)}
//                 disabled={currentRole !== "Admin Sekolah"}
//                 className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
//               >
//                 <UserPlus className="h-4 w-4" /> Tambah Admin
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4 p-6">
//             {/* Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//               <div className="col-span-2">
//                 <div className="relative">
//                   <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
//                   <Input
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                     placeholder="Cari nama, email, telepon…"
//                     className="pl-9 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//                   />
//                 </div>
//               </div>
//               <Select value={fRole} onValueChange={setFRole}>
//                 <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//                   <SelectValue placeholder="Semua Peran" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">Semua Peran</SelectItem>
//                   {ROLES.map((r) => (
//                     <SelectItem key={r} value={r}>
//                       {r}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={fStatus} onValueChange={setFStatus}>
//                 <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//                   <SelectValue placeholder="Semua Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">Semua Status</SelectItem>
//                   {STATUS.map((s) => (
//                     <SelectItem key={s} value={s}>
//                       {s}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {/* <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-end">
//                 Peran aktif: <span className="ml-1 font-medium">{currentRole}</span>
//               </div> */}
//             </div>
//             {/* Bulk actions bar */}
//             {Object.values(selected).some(Boolean) && (
//               <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-theme-color-primary/5 p-2">
//                 <span className="text-sm text-gray-800 dark:text-white">
//                   {Object.values(selected).filter(Boolean).length} dipilih
//                 </span>
//                 <div className="ml-auto flex flex-wrap gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => bulkSetStatus("Aktif")}
//                     className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     Aktifkan
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => bulkSetStatus("Nonaktif")}
//                     className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     Nonaktifkan
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => bulkLock(true)}
//                     className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     Lock
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => bulkLock(false)}
//                     className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     Unlock
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={bulkDelete}
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     Hapus
//                   </Button>
//                 </div>
//               </div>
//             )}
//             {/* Table */}
//             <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-theme-color-primary/5 overflow-hidden">
//               <Table>
//                 <TableHeader className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400">
//                   <TableRow>
//                     <TableHead className="w-10">
//                       <Checkbox
//                         checked={
//                           filteredIds.length > 0 &&
//                           filteredIds.every((id) => selected[id])
//                         }
//                         onCheckedChange={(v) => {
//                           const next: Record<string, boolean> = { ...selected };
//                           filteredIds.forEach((id) => {
//                             if (v) next[id] = true;
//                             else delete next[id];
//                           });
//                           setSelected(next);
//                         }}
//                       />
//                     </TableHead>
//                     <TableHead className="w-28">ID</TableHead>
//                     <TableHead>Nama</TableHead>
//                     <TableHead>Peran</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Login Terakhir</TableHead>
//                     <TableHead className="text-right">Aksi</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filtered.map((a) => (
//                     <TableRow key={a.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
//                       <TableCell>
//                         <Checkbox
//                           checked={!!selected[a.id]}
//                           onCheckedChange={(v) =>
//                             setSelected((prev) => ({ ...prev, [a.id]: !!v }))
//                           }
//                         />
//                       </TableCell>
//                       <TableCell className="font-mono text-xs text-gray-800 dark:text-white">{a.id}</TableCell>
//                       <TableCell>
//                         <div className="space-y-0.5">
//                           <div className="font-medium flex items-center gap-2 text-gray-800 dark:text-white">
//                             {a.name}
//                             {a.role === "Kepala Sekolah" && (
//                               <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
//                                 Kepsek
//                               </Badge>
//                             )}
//                             {a.role === "Admin Sekolah" && (
//                               <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
//                                 Admin
//                               </Badge>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
//                             <span className="inline-flex items-center gap-1">
//                               <Mail className="h-3.5 w-3.5" />
//                               {a.email}
//                             </span>
//                             {a.phone && (
//                               <span className="inline-flex items-center gap-1">
//                                 <Phone className="h-3.5 w-3.5" />
//                                 {a.phone}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-sm text-gray-800 dark:text-white">{a.role}</TableCell>
//                       <TableCell>
//                         {a.status === "Aktif" && (
//                           <Badge
//                             className="bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 border-gray-200 dark:border-gray-700"
//                             variant="outline"
//                           >
//                             Aktif
//                           </Badge>
//                         )}
//                         {a.status === "Nonaktif" && (
//                           <Badge
//                             className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
//                             variant="outline"
//                           >
//                             Nonaktif
//                           </Badge>
//                         )}
//                         {a.status === "Terkunci" && (
//                           <Badge
//                             className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 border-gray-200 dark:border-gray-700"
//                             variant="outline"
//                           >
//                             Terkunci
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-sm text-gray-800 dark:text-white">
//                         {formatDate(a.lastLogin)}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700">
//                             <DropdownMenuLabel>Aksi</DropdownMenuLabel>
//                             <DropdownMenuItem
//                               className="gap-2"
//                               onClick={() => setDetail(a)}
//                               disabled={!canManage(currentRole, a)}
//                             >
//                               <Edit className="h-4 w-4" /> Ubah
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="gap-2"
//                               onClick={() => toggleActive(a)}
//                               disabled={!canActivate(currentRole, a)}
//                             >
//                               {a.status === "Aktif" ? (
//                                 <>
//                                   <XCircle className="h-4 w-4" /> Nonaktifkan
//                                 </>
//                               ) : (
//                                 <>
//                                   <CheckCircle2 className="h-4 w-4" /> Aktifkan
//                                 </>
//                               )}
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="gap-2"
//                               onClick={() => lockUnlock(a)}
//                               disabled={!canLock(currentRole, a)}
//                             >
//                               {a.status === "Terkunci" ? (
//                                 <>
//                                   <Unlock className="h-4 w-4" /> Unlock
//                                 </>
//                               ) : (
//                                 <>
//                                   <Lock className="h-4 w-4" /> Lock
//                                 </>
//                               )}
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="gap-2"
//                               onClick={() => resetPassword(a)}
//                               disabled={!canManage(currentRole, a)}
//                             >
//                               <RotateCcw className="h-4 w-4" /> Reset Password
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               className="gap-2 text-red-700 dark:text-red-400"
//                               onClick={() => setToDelete(a)}
//                               disabled={!canDelete(currentRole, a)}
//                             >
//                               <Trash2 className="h-4 w-4" /> Hapus
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Sheet: Detail */}
//         <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
//           <SheetContent className="w-full sm:max-w-xl bg-teal-900 border-gray-200 dark:border-gray-700">
//             {detail && (
//               <AdminDetailSheet
//                 key={detail.id}
//                 admin={detail}
//                 onSave={(a) => {
//                   updateAdmin(a);
//                   setDetail(null);
//                 }}
//               />
//             )}
//           </SheetContent>
//         </Sheet>
//         {/* Dialog: Tambah */}
//         <Dialog open={showAdd} onOpenChange={setShowAdd}>
//           <DialogContent className="sm:max-w-xl dark:bg-teal-900 border-gray-200 dark:border-gray-700">
//             <DialogHeader>
//               <DialogTitle className="text-gray-800 dark:text-white">Tambah Admin</DialogTitle>
//             </DialogHeader>
//             <AddAdminForm
//               onSubmit={(a) => {
//                 addAdmin(a);
//                 setShowAdd(false);
//               }}
//             />
//           </DialogContent>
//         </Dialog>
//         {/* Dialog: Reset Password */}
//         <Dialog open={!!resetInfo} onOpenChange={() => setResetInfo(null)}>
//           <DialogContent className="sm:max-w-md bg-theme-color-primary/5 border-gray-200 dark:border-gray-700">
//             <DialogHeader>
//               <DialogTitle className="text-gray-800 dark:text-white">Password Sementara</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3 text-sm text-gray-800 dark:text-white">
//               <p>
//                 Berikut password sementara untuk
//                 <span className="font-medium">{resetInfo?.admin.name}</span> (
//                 {resetInfo?.admin.email}).
//               </p>
//               <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-theme-color-primary/20 p-3">
//                 <div className="font-mono text-base select-all break-all text-gray-800 dark:text-white">
//                   {resetInfo?.temp}
//                 </div>
//               </div>
//               <p className="text-xs text-gray-600 dark:text-gray-400">
//                 Beritahukan pengguna untuk mengganti password setelah login.
//               </p>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   if (!resetInfo) return;
//                   navigator.clipboard?.writeText(resetInfo.temp);
//                   toast.success("Password disalin ke clipboard");
//                 }}
//                 className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Salin
//               </Button>
//               <Button
//                 onClick={() => setResetInfo(null)}
//                 className="bg-teal-600 hover:bg-teal-700 text-white"
//               >
//                 Tutup
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//         {/* Dialog: Hapus */}
//         <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
//           <DialogContent className="sm:max-w-md bg-teal-900 border-gray-200 dark:border-gray-700">
//             <DialogHeader>
//               <DialogTitle className="text-gray-800 dark:text-white">Hapus admin?</DialogTitle>
//             </DialogHeader>
//             <p className="text-sm text-gray-300 dark:text-gray-300">
//               Aksi ini akan menghapus admin <span className="font-semibold">{toDelete?.name}</span>.
//             </p>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setToDelete(null)}
//                 className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/20 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Batal
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={() => toDelete && deleteAdmin(toDelete.id)}
//                 disabled={!toDelete || !canDelete(currentRole, toDelete)}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Hapus
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//         {/* Audit Log */}
//         <Card className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//           <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
//               <UserCog className="w-4 h-4 text-gray-600 dark:text-gray-400" /> Audit Log
//             </CardTitle>
//             <CardDescription className="text-black dark:text-white">Riwayat aksi terakhir (maks 100 entri).</CardDescription>
//           </CardHeader>
//           <CardContent className="p-6">
//             {logs.length === 0 ? (
//               <p className="text-sm text-gray-600 dark:text-gray-400">Belum ada aktivitas.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400">
//                     <TableRow>
//                       <TableHead className="w-40">Waktu</TableHead>
//                       <TableHead className="w-32">IP</TableHead>
//                       <TableHead>Aksi</TableHead>
//                       <TableHead>Target</TableHead>
//                       <TableHead>Detail</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {logs.map((l) => (
//                       <TableRow key={l.id} className="border-t border-gray-200 dark:border-gray-700">
//                         <TableCell className="text-sm text-gray-800 dark:text-white">{formatDate(l.at)}</TableCell>
//                         <TableCell className="text-sm font-mono text-gray-800 dark:text-white">{l.ip || '-'}</TableCell>
//                         <TableCell className="text-sm text-gray-800 dark:text-white">{l.action}</TableCell>
//                         <TableCell className="text-sm font-mono text-gray-800 dark:text-white">{l.targetId || '-'}</TableCell>
//                         <TableCell className="text-sm text-gray-800 dark:text-white">{l.detail || '-'}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//         <Toaster position="top-right" richColors closeButton duration={2500} />
//       </div>
//     </div>
//   );
// }
// /*********************** Subcomponents ************************/
// function AdminDetailSheet({
//   admin,
//   onSave,
// }: {
//   admin: SchoolAdmin;
//   onSave: (a: SchoolAdmin) => void;
// }) {
//   const [form, setForm] = useState<SchoolAdmin>({ ...admin });
//   return (
//     <div className="space-y-4">
//       <SheetHeader>
//         <SheetTitle className="text-gray-800 dark:text-white">Detail Admin</SheetTitle>
//       </SheetHeader>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <Label className="text-black dark:text-white">Nama</Label>
//           <Input
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Email</Label>
//           <Input
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Telepon</Label>
//           <Input
//             value={form.phone || ""}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Peran</Label>
//           <Select
//             value={form.role}
//             onValueChange={(v) => setForm({ ...form, role: v as Role })}
//           >
//             <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {ROLES.map((r) => (
//                 <SelectItem key={r} value={r}>
//                   {r}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Status</Label>
//           <Select
//             value={form.status}
//             onValueChange={(v) => setForm({ ...form, status: v as AdminStatus })}
//           >
//             <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {STATUS.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Login Terakhir</Label>
//           <Input
//             value={form.lastLogin || ""}
//             onChange={(e) => setForm({ ...form, lastLogin: e.target.value })}
//             placeholder="2025-08-28T09:00:00"
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Dibuat Pada</Label>
//           <Input
//             value={form.createdAt}
//             onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div className="col-span-2">
//           <Label className="text-black dark:text-white">Catatan</Label>
//           <Textarea
//             placeholder="Catatan internal (opsional)"
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//       </div>
//       <div className="flex justify-end">
//         <Button
//           onClick={() => onSave(form)}
//           className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
//         >
//           <Edit className="h-4 w-4" /> Simpan Perubahan
//         </Button>
//       </div>
//     </div>
//   );
// }
// function AddAdminForm({
//   onSubmit,
// }: {
//   onSubmit: (a: SchoolAdmin) => void;
// }) {
//   const [form, setForm] = useState<SchoolAdmin>({
//     id: genId("ADM"),
//     name: "",
//     email: "",
//     phone: "",
//     role: "Operator",
//     status: "Aktif",
//     createdAt: new Date().toISOString().slice(0, 10),
//   });
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit(form);
//       }}
//       className="space-y-4"
//     >
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <Label className="text-black dark:text-white">Nama</Label>
//           <Input
//             required
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Email</Label>
//           <Input
//             required
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Telepon</Label>
//           <Input
//             value={form.phone || ""}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
//           />
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Peran</Label>
//           <Select
//             value={form.role}
//             onValueChange={(v) => setForm({ ...form, role: v as Role })}
//           >
//             <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {ROLES.map((r) => (
//                 <SelectItem key={r} value={r}>
//                   {r}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-black dark:text-white">Status</Label>
//           <Select
//             value={form.status}
//             onValueChange={(v) => setForm({ ...form, status: v as AdminStatus })}
//           >
//             <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {STATUS.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <DialogFooter>
//         <Button type="submit" className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
//           <UserPlus className="h-4 w-4" /> Tambahkan
//         </Button>
//       </DialogFooter>
//     </form>
//   );
// }