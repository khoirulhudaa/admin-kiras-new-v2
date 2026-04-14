import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Loader,
  Pin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const API_BASE = "https://be-school.kiraproject.id/kelas";

export default function KelasMain() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [classNameInput, setClassNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [waliKelasInput, setWaliKelasInput] = useState("");
  const [waliKelasPhoneInput, setWaliKelasPhoneInput] = useState("");
  const [waliKelasEmailInput, setWaliKelasEmailInput] = useState("");

  // State baru untuk menampilkan hasil import
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: { className: string; reason: string }[];
  } | null>(null);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

 const {
  data: classes = [],
  isLoading: loading,
  refetch,
  isFetching,
} = useQuery({
  // UBAH INI: Tambahkan pembeda agar tidak bentrok dengan Dashboard
  queryKey: ["classes", "master-list", schoolId], 
  queryFn: async () => {
    if (!schoolId) return [];
    const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  },
  enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ─── DOWNLOAD TEMPLATE ───────────────────────────────────────
  const handleDownloadTemplate = () => {
    const templateData = [
      { 
        NamaKelas: "XII RPL 1", 
        WaliKelas: "Budi Santoso, S.Pd", 
        NoWA: "81234567890", 
        Email: "budi@school.id" 
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Atur lebar kolom agar rapi
    ws["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }];

    XLSX.writeFile(wb, "Template_Kelas_Xpresensi.xlsx");
  };

  // ─── IMPORT EXCEL ────────────────────────────────────────────
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

    setIsImporting(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
        });

        // Map & Normalisasi Data
        const preparedData = jsonData.map((row) => {
          // Normalisasi Nama Kelas
          const className = (row["NamaKelas"] || row["Kelas"] || row["nama_kelas"] || "").toString().trim();
          
          // Normalisasi Nomor Telepon (Hanya angka, awalan 62)
          const phoneRaw = (row["NoWA"] || row["NomorWA"] || row["Telepon"] || "").toString();
          const phoneClean = phoneRaw.replace(/\D/g, '');
          let normalizedPhone = null;
          if (phoneClean) {
            normalizedPhone = phoneClean.startsWith('0') 
              ? `62${phoneClean.slice(1)}` 
              : phoneClean.startsWith('62') ? phoneClean : `62${phoneClean}`;
          }

          return {
            className,
            waliKelas: row["WaliKelas"] || row["NamaWali"] || null,
            waliKelasPhone: normalizedPhone,
            waliKelasEmail: row["Email"] || row["EmailWali"] || null,
          };
        }).filter(item => item.className !== ""); // Buang baris kosong

        if (preparedData.length === 0) {
          toast.error("File kosong atau format kolom tidak sesuai");
          return;
        }

        // Kirim Batch ke Backend
        const res = await fetch(`${API_BASE}/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolId,
            classes: preparedData,
          }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          setImportResult(result.data); // result.data berisi {success: x, failed: []}
          
          toast[result.data.failed.length === 0 ? "success" : "warning"](
            `Berhasil: ${result.data.success} • Gagal: ${result.data.failed.length}`
          );
        } else {
          toast.error(result.message || "Gagal memproses data");
        }
      } catch (err: any) {
        toast.error("Gagal membaca file: " + err.message);
      } finally {
        setIsImporting(false);
        e.target.value = ""; // Reset input file
      }
    };

    reader.readAsBinaryString(file);
  };

  // ─── HANDLER: Simpan/Update single ───────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          schoolId, 
          className: classNameInput,
          waliKelas:      waliKelasInput.trim()      || null,
          waliKelasPhone: waliKelasPhoneInput.trim() || null,
          waliKelasEmail: waliKelasEmailInput.trim() || null,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingItem(null);
        setClassNameInput("");
        setWaliKelasInput("");
        setWaliKelasPhoneInput("");
        setWaliKelasEmailInput("");
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        toast.success("Kelas berhasil disimpan");
      } else {
        const err = await res.json();
        toast.error(err.message || "Gagal menyimpan kelas");
      }
    } catch (err) {
      toast.error("Gagal menyimpan kelas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kelas ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}/${schoolId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        toast.success("Kelas dihapus");
      } else {
        toast.error("Gagal menghapus kelas");
      }
    } catch (err) {
      toast.error("Gagal menghapus kelas");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setClassNameInput(item.className);
    setWaliKelasInput(item.waliKelas || "");
    setWaliKelasPhoneInput(item.waliKelasPhone || "");
    setWaliKelasEmailInput(item.waliKelasEmail || "");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-8" style={{ color: "#f8fafc" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <BookOpen size={14} /> Master Data
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Data <span className="text-blue-600">Kelas</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola ruang kelas</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isImporting}
            className="h-14 px-5 bg-white/5 text-zinc-300 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50"
          >
            <Download size={16} /> Template
          </button>

          <label className="h-14 px-5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-600/20 transition-all font-black uppercase text-xs tracking-widest">
            <FileSpreadsheet size={16} />
            {isImporting ? "Mengimpor..." : "Import"}
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleBulkImport}
              disabled={isImporting}
            />
          </label>

          <button
            onClick={() => refetch()}
            disabled={isFetching || isImporting}
            className="h-14 px-5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setClassNameInput("");
              setWaliKelasInput("");
              setWaliKelasPhoneInput("");
              setWaliKelasEmailInput("");
              setModalOpen(true);
            }}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl transition-all"
          >
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>

      {/* HASIL IMPORT - muncul setelah proses import selesai */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
        >
          {/* Header & Stats Terpadu */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-white/[0.02]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${importResult.failed.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                  Laporan Import
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-wider">
                <div className="text-emerald-400/80">
                  {importResult.success} Berhasil
                </div>
                {importResult.failed.length > 0 && (
                  <div className="text-amber-400/80">
                    {importResult.failed.length} Gagal
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setImportResult(null)}
              className="text-red-400 flex items-center gap-1 hover:text-red-500 active:scale-[0.99] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content: Hanya muncul jika ada yang gagal */}
          {importResult.failed.length > 0 && (
            <div className="border-t border-white/5 bg-black/20">
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5">
                      <th className="px-5 py-2 font-black">Kelas</th>
                      <th className="px-5 py-2 font-black text-right">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {importResult.failed.map((item, index) => (
                      <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-2.5 text-[13px] text-zinc-300 font-medium">
                          {item.className}
                        </td>
                        <td className="px-5 py-2.5 text-[12px] text-amber-500/70 text-right">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success Minimal State */}
          {importResult.failed.length === 0 && (
            <div className="px-5 py-3 text-[12px] text-zinc-500 border-t border-white/5">
              Semua data berhasil diproses tanpa kendala.
            </div>
          )}
        </motion.div>
      )}

      {/* Loading & Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Loader className="animate-spin mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Loading Classes...
          </p>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
          <p className="text-white/20 text-lg font-medium">
            Belum ada data kelas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {classes.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white/[0.03] flex flex-col justify-between border border-white/8 rounded-3xl p-6 hover:border-blue-500/50 transition-all shadow-xl"
            >
              <div>
                <div className="w-max px-3.5 h-12 flex items-center gap-3 rounded-2xl bg-blue-600/40 flex items-center justify-center text-blue-500 ml-[-3px] mb-4">
                  <GraduationCap size={24} className="text-white" />
                  <h3 className="text-white relative top-[1.4px]">
                    {item.className}
                  </h3>
                </div>

                {/* Info wali kelas — tampil jika ada */}
                {item.waliKelas && (
                  <p className="w-max flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1 truncate" title={item.waliKelas}>
                    <Pin size={13}/> {item.waliKelas}
                  </p>
                )}
                {item.waliKelasPhone && (
                  <p className="w-max flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                    <Pin size={13}/> +{item.waliKelasPhone}
                  </p>
                )}
                {item.waliKelasEmail && (
                  <p className="w-max flex items-center gap-1.5 text-xs text-slate-400 truncate mb-4" title={item.waliKelasEmail}>
                    <Pin size={13}/> {item.waliKelasEmail}
                  </p>
                )}
                {!item.waliKelas && !item.waliKelasPhone && !item.waliKelasEmail && (
                  <p className="text-xs text-slate-500 mb-4">
                    ? ? ? 
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-[84%] py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Perbarui
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 w-[16%] flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full overflow-auto max-w-lg bg-[#0B1220] border-l border-white/10 z-[10000] p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white uppercase">
                  {editingItem ? "Perbarui" : "Tambah"} Kelas
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Kelas */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Nama Kelas <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    autoFocus
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    placeholder="Contoh: XII RPL 1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                  />
                </div>

                <div className="h-px bg-white/5" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Info Wali Kelas <span className="text-zinc-700">(Opsional)</span>
                </p>

                {/* Nama Wali Kelas */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Nama Wali Kelas
                  </label>
                  <input
                    value={waliKelasInput}
                    onChange={(e) => setWaliKelasInput(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Pd"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* No WA Wali Kelas */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    No. WA Wali Kelas
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">
                      +62
                    </span>
                    <input
                      value={waliKelasPhoneInput.startsWith('62') 
                        ? waliKelasPhoneInput.slice(2) 
                        : waliKelasPhoneInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const normalized = raw.startsWith('0') ? raw.slice(1) : raw;
                        setWaliKelasPhoneInput(normalized ? `62${normalized}` : '');
                      }}
                      placeholder="8123456789"
                      maxLength={13}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-white focus:border-blue-500 outline-none transition-all font-mono"
                    />
                  </div>
                  <p className="text-[9px] text-zinc-600 ml-1">
                    Digunakan untuk kirim rekap otomatis via WhatsApp
                  </p>
                </div>

                {/* Email Wali Kelas */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Email Wali Kelas
                  </label>
                  <input
                    type="email"
                    value={waliKelasEmailInput}
                    onChange={(e) => setWaliKelasEmailInput(e.target.value)}
                    placeholder="wali@sekolah.sch.id"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-[9px] text-zinc-600 ml-1">
                    Digunakan untuk kirim rekap otomatis via Email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  Simpan Kelas
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}