import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FaSpinner, FaFilter, FaTimes, FaList, FaPaste } from "react-icons/fa";

// ────────────────────────────────────────────────
// Utilities & Components Reusable
// ────────────────────────────────────────────────

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm backdrop-blur-sm",
        isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button type="button" onClick={onClose} className="ml-4 text-lg">✕</button>
      </div>
    </motion.div>
  );
};

const Icon = ({ label }: { label: string }) => (
  <span aria-hidden className="inline-block align-middle select-none w-4 text-center">{label}</span>
);
const ISave = () => <Icon label="💾" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;

const Field: React.FC<{ label?: string; hint?: string; children: React.ReactNode; className?: string }> = ({
  label, hint, children, className,
}) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1.5 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx("w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40", className)}
    {...props}
  />
);

const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={clsx("w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 resize-y min-h-[80px]", className)}
    {...props}
  />
);

const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={clsx("w-full rounded-md border border-white/20 bg-white/10 px-3 py-3 text-sm text-white outline-none", className)}
    {...props}
  />
);

// ────────────────────────────────────────────────
// Interface & Constants
// ────────────────────────────────────────────────

interface JadwalItem {
  id: number;
  kelas: number;
  shift: "pagi" | "siang";
  hari: string;
  seragam: string;
  jadwal: string[];
  catatan?: string | null;
  schoolId: number;
  isActive: boolean;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

const DEFAULT_JADWAL: Partial<JadwalItem> = {
  kelas: 1,
  shift: "pagi",
  hari: "Senin",
  seragam: "Seragam Putih-Merah",
  jadwal: [""],
  catatan: "",
};

const API_BASE = "https://be-school.kiraproject.id/jadwal-sd";

export function JadwalSD() {
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
  const [formData, setFormData] = useState<Partial<JadwalItem>>(DEFAULT_JADWAL);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  
  // Fitur Baru: Bulk Input Mode
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");

  // Filter States
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [filterHari, setFilterHari] = useState<string>("all");
  const [filterShift, setFilterShift] = useState<string>("all");

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const fetchData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setJadwalList(json.data || []);
    } catch (err: any) {
      showAlert(`Gagal memuat jadwal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId]);

  // Logic Filtering
  const filteredData = jadwalList.filter((item) => {
    const matchKelas = filterKelas === "all" || item.kelas.toString() === filterKelas;
    const matchHari = filterHari === "all" || item.hari === filterHari;
    const matchShift = filterShift === "all" || item.shift === filterShift;
    return matchKelas && matchHari && matchShift;
  });

  const resetFilters = () => {
    setFilterKelas("all");
    setFilterHari("all");
    setFilterShift("all");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJadwalChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newJadwal = [...(prev.jadwal || [])];
      newJadwal[index] = value;
      return { ...prev, jadwal: newJadwal };
    });
  };

  const addJadwalSlot = () => setFormData(prev => ({ ...prev, jadwal: [...(prev.jadwal || []), ""] }));

  const removeJadwalSlot = (index: number) => setFormData(prev => ({
    ...prev, 
    jadwal: (prev.jadwal || []).filter((_, i) => i !== index)
  }));

  // Logic Sinkronisasi Bulk ke Array
  const syncBulkToJadwal = (text: string) => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    setFormData(prev => ({ ...prev, jadwal: lines.length > 0 ? lines : [""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return showAlert("School ID tidak tersedia");

    const cleanJadwal = (formData.jadwal || []).filter((v) => v.trim() !== "");
    if (!cleanJadwal.length) return showAlert("Minimal isi 1 pelajaran");

    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          schoolId: parseInt(schoolId.toString()),
          kelas: parseInt(formData.kelas?.toString() || "1"),
          jadwal: cleanJadwal,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan");

      showAlert("Berhasil menyimpan jadwal");
      setIsModalOpen(false);
      setIsBulkMode(false);
      setBulkText("");
      fetchData();
    } catch (err: any) {
      showAlert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: JadwalItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setBulkText(item.jadwal.join("\n"));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}?schoolId=${schoolId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Jadwal berhasil dihapus");
      fetchData();
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 mb-10">
      {/* Tombol Tambah */}
      <div className="flex justify-start gap-4">
        <button
          onClick={() => { 
            setFormData(DEFAULT_JADWAL); 
            setEditingId(null); 
            setIsModalOpen(true); 
            setIsBulkMode(false);
            setBulkText("");
          }}
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-1.5 text-sm font-bold hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <ISave /> Tambah Jadwal
        </button>

          {/* Kontrol Filter */}
        <div className="w-max flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[120px]">
            <Select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="!py-2 !text-sm">
              <option className="text-black" value="all">Semua Kelas</option>
              {[1,2,3,4,5,6].map(k => <option className="text-black" key={k} value={k}>Kelas {k}</option>)}
            </Select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <Select value={filterHari} onChange={(e) => setFilterHari(e.target.value)} className="!py-2 !text-sm">
              <option className="text-black" value="all">Semua Hari</option>
              {DAYS.map(d => <option className="text-black" key={d} value={d}>{d}</option>)}
            </Select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <Select value={filterShift} onChange={(e) => setFilterShift(e.target.value)} className="!py-2 !text-sm">
              <option className="text-black" value="all">Semua Shift</option>
              <option className="text-black" value="pagi">Pagi</option>
              <option className="text-black" value="siang">Siang</option>
            </Select>
          </div>

          {(filterKelas !== 'all' || filterHari !== 'all' || filterShift !== 'all') && (
            <button 
              onClick={resetFilters}
              className="px-3 py-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <FaTimes className="text-[10px]" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed top-0 right-0 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="absolute top-0 right-0 h-screen overflow-auto w-full max-w-lg transform border border-white/20 bg-gray-900 p-6 shadow-2xl text-left">
                  <Dialog.Title className="mb-6 text-xl border-b border-white/10 pb-5 font-semibold text-white">
                    {editingId ? "Edit Jadwal Pelajaran" : "Konfigurasi Jadwal"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Kelas">
                        <Select name="kelas" value={formData.kelas} onChange={handleInputChange}>
                          {[1,2,3,4,5,6].map(k => <option className="text-black" key={k} value={k}>Kelas {k}</option>)}
                        </Select>
                      </Field>
                      <Field label="Shift">
                        <Select name="shift" value={formData.shift} onChange={handleInputChange}>
                          <option className="text-black" value="pagi">Pagi</option>
                          <option className="text-black" value="siang">Siang</option>
                        </Select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Hari">
                        <Select name="hari" value={formData.hari} onChange={handleInputChange}>
                          {DAYS.map(d => <option className="text-black" key={d} value={d}>{d}</option>)}
                        </Select>
                      </Field>
                      <Field label="Seragam">
                        <Input 
                          name="seragam" 
                          value={formData.seragam} 
                          onChange={handleInputChange} 
                          placeholder="Pramuka / Batik / dll"
                        />
                      </Field>
                    </div>

                    <Field label="Catatan (opsional)">
                      <TextArea name="catatan" value={formData.catatan || ""} onChange={handleInputChange} placeholder="Info tambahan..." />
                    </Field>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-medium text-white/70">Daftar Pelajaran</div>
                        <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                          <button 
                            type="button"
                            onClick={() => setIsBulkMode(false)}
                            className={clsx("px-3 py-1 text-[10px] rounded-md transition-all flex items-center gap-1.5", !isBulkMode ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}
                          >
                            <FaList /> Manual
                          </button>
                          <button 
                            type="button"
                            onClick={() => setIsBulkMode(true)}
                            className={clsx("px-3 py-1 text-[10px] rounded-md transition-all flex items-center gap-1.5", isBulkMode ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}
                          >
                            <FaPaste /> Tempel Sekaligus
                          </button>
                        </div>
                      </div>

                      {isBulkMode ? (
                        <div className="space-y-2">
                           <TextArea 
                            placeholder="Tempel jadwal di sini. Gunakan baris baru untuk pelajaran berbeda.&#10;Contoh:&#10;07:00 Matematika&#10;08:30 Bahasa Indonesia"
                            className="min-h-[150px] font-mono text-xs leading-relaxed"
                            value={bulkText}
                            onChange={(e) => {
                              setBulkText(e.target.value);
                              syncBulkToJadwal(e.target.value);
                            }}
                          />
                          <p className="text-[10px] text-white/40">Setiap baris akan otomatis menjadi satu slot pelajaran.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.jadwal?.map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Input value={slot} onChange={(e) => handleJadwalChange(idx, e.target.value)} placeholder="07:20 - 08:20 Matematika" />
                              <button type="button" onClick={() => removeJadwalSlot(idx)} className="text-red-400 text-xl">×</button>
                            </div>
                          ))}
                          <button type="button" onClick={addJadwalSlot} className="text-blue-400 text-sm font-medium hover:underline">+ Tambah Mapel</button>
                        </div>
                      )}
                    </div>

                    <div className="w-full grid grid-cols-2 justify-end gap-3 pt-4 border-t border-white/10">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-white/30 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10" disabled={loading}>
                        Batal
                      </button>
                      <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                        {loading ? <FaSpinner className="animate-spin" /> : <ISave />}
                        {editingId ? "Update Data" : "Simpan Data"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Bagian Filter & Daftar Data */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
        <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

        {/* Display Daftar Jadwal */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            <p className="text-white/40 text-sm">Menyinkronkan data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-gray-400 font-medium">Tidak ada jadwal yang sesuai dengan filter.</p>
            <button onClick={resetFilters} className="mt-2 text-blue-400 text-sm hover:underline">Lihat semua jadwal</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredData.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.id} 
                className="rounded-xl border flex flex-col justify-between border-white/10 bg-black/40 p-5 hover:border-white/30 transition-colors"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-lg">Kelas {item.kelas}</h4>
                      <p className="text-blue-400 text-sm font-bold uppercase tracking-tighter">{item.hari} • {item.shift}</p>
                    </div>
                  </div>
                  
                  <div className="inline-block rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-4">
                    👕 {item.seragam}
                  </div>
                  
                  <ul className="space-y-2 mb-6 border-l border-white/10 pl-4 ml-1">
                    {item.jadwal.map((s, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 group-hover:scale-125 transition-transform" /> 
                        <span className="leading-tight">{s}</span>
                      </li>
                    ))}
                  </ul>

                  {item.catatan && (
                    <div className="mb-4 p-2 rounded bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-200/70 italic">
                      Note: {item.catatan}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
                  <button onClick={() => handleEdit(item)} className="flex-1 py-2 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all">Perbarui</button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Hapus</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}