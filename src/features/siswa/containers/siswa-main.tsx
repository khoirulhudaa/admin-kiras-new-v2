import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from "framer-motion";
import debounce from 'lodash/debounce'; // Import debounce
import { Toaster, toast } from "sonner"; // Pastikan sudah install: npm i sonner

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Palette,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import GraduationModal from "../components/graduationModal";
import { generateStudentCardsPDF } from "../utils/generateStudentCards";

const BASE_URL = "https://be-school.kiraproject.id/siswa";
// const BASE_URL = "http://localhost:5005/siswa";

// --- Interfaces ---
interface Student {
  id: number;
  name: string;
  nis: string;
  class: string;
  batch: any;
  nisn: string;
  gender: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  photoUrl: string;
  qrCodeData: string;
  statusKehadiran: "Hadir" | "Belum Hadir";
  isNisDuplicate?: boolean;
  isNisnDuplicate?: boolean;
}

const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }: any) => {
  if (!open) return null;

  // Generate list bg1.png sampai bg12.png
  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Sesuaikan tampilan kartu pelajar</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-500"><X/></button>
        </div>

        <div className="space-y-10">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
            <div 
              className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
              style={{ 
                backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none',
                backgroundSize: 'cover', 
                backgroundPosition: 'center'
              }}
            >
              {/* Header dengan Accent Color */}
              <div className="h-10 flex flex-col items-center shadow-none justify-center" style={{ backgroundColor: config.accentColor }}>
                <div 
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: config.titleColor }} // Warna dinamis
                >
                  {config.title}
                </div>
                <div 
                  className="text-[6px] font-bold opacity-80 uppercase"
                  style={{ color: config.subtitleColor }} // Warna dinamis
                >
                  {config.subtitle}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
                {/* Foto Siswa */}
                <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                  <User size={40} className="text-slate-300"/>
                </div>

                {/* Informasi Teks */}
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nama Lengkap</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase truncate">NAMA SISWA LENGKAP</div>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nomor Induk</div>
                    <div className="text-[8px] font-bold text-slate-700">NIS: 123456789</div>
                    <div className="text-[7px] font-semibold text-slate-500">NISN: 00987654321</div>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[5px] font-black rounded-full uppercase">
                    Status: Aktif
                  </div>
                </div>

                {/* QR Code di Sudut Kanan Bawah */}
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-slate-200 flex items-center justify-center p-1 bg-white rounded-md shadow-sm">
                  <div className="text-[5px] font-bold text-slate-300">QR CODE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Judul</label>
              <input 
                type="color" 
                value={config.titleColor} 
                onChange={e => setConfig({...config, titleColor: e.target.value})} 
                className="w-full h-14 bg-transparent border-none cursor-pointer" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Subtitle</label>
              <input 
                type="color" 
                value={config.subtitleColor} 
                onChange={e => setConfig({...config, subtitleColor: e.target.value})} 
                className="w-full h-14 bg-transparent border-none cursor-pointer" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Judul Kartu</label>
              <input value={config.title} onChange={e => setConfig({...config, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Aksen</label>
              <input type="color" value={config.accentColor} onChange={e => setConfig({...config, accentColor: e.target.value})} className="w-full h-14 bg-transparent border-none cursor-pointer" />
            </div>
          </div>

          {/* BACKGROUND PRESETS */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Pilih Background Preset</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {bgPresets.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => setConfig({ ...config, bgImage: bg })}
                  className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${config.bgImage === bg ? 'border-blue-500 scale-95' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={bg} alt={`BG ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              
              {/* Custom Upload Button */}
              <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all">
                <Upload size={16} className="text-zinc-500" />
                <input type="file" hidden accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onload = (re) => setConfig({...config, bgImage: re.target?.result as string});
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
          </div>

          <button onClick={onGenerate} disabled={isProcessing} className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all flex items-center justify-center gap-3">
            <Printer size={20}/> {isProcessing ? "Proses..." : "Cetak Kartu PDF"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const StudentModal = ({ open, onClose, title, initialData, onSubmit, schoolId, classList }: any) => {
  const [form, setForm] = useState({
    name: "", nis: "", nisn: "", nik: "", gender: "Laki-laki",
    birthPlace: "", birthDate: "", 
    class: "", batch: "", // <--- Tambahkan ini
    photo: null as File | null, preview: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        nis: initialData?.nis || "",
        nisn: initialData?.nisn || "",
        nik: initialData?.nik || "",
        gender: initialData?.gender || "Laki-laki",
        birthPlace: initialData?.birthPlace || "",
        birthDate: initialData?.birthDate || "",
        class: initialData?.class || "", // Pastikan ini sesuai dengan key dari backend
        batch: initialData?.batch || "",
        photo: null,
        preview: initialData?.photoUrl || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      if (!schoolId) throw new Error("ID Sekolah tidak ditemukan");
      
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { 
        // Pastikan data yang dikirim tidak undefined/null agar tidak error di backend
        if(k !== 'preview' && k !== 'photo' && v !== null && v !== undefined) {
          fd.append(k, v.toString()); 
        }
      });
      
      fd.append("schoolId", schoolId.toString());
      if (form.photo) fd.append("photo", form.photo);

      // Menunggu eksekusi onSubmit. Jika di sana ada 'throw Error', 
      // maka eksekusi akan langsung lompat ke blok catch di bawah ini.
      await onSubmit(fd); 
      
      onClose(); // Hanya tutup modal jika onSubmit berhasil (tidak throw error)
    } catch (err: any) { 
      // Alert ini sekarang akan menampilkan pesan spesifik: 
      // "NIS 12345 sudah terdaftar atas nama Budi"
      toast.error("Gagal Menyimpan: " + err.message); 
    } finally { 
      setSaving(false); 
    }
  };

  if (!open) return null;

   return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto">
        <div className="border-b border-white/8 flex justify-between pb-8 mb-8 items-center bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {title}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Siswa pilihan sekolah ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-0">
          {/* Foto Section */}
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-2">Foto Profil Siswa</label>
             <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer overflow-hidden relative group hover:border-blue-500/50 transition-all">
                {form.preview ? <img src={form.preview} className="absolute inset-0 w-full h-full object-cover" /> : <div className="text-center text-zinc-600"><Upload className="mx-auto mb-2" size={32} /><span className="text-[10px] font-bold uppercase">Upload Pas Foto</span></div>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) setForm(p => ({...p, photo: file, preview: URL.createObjectURL(file)}));
                }} />
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Nama Lengkap</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                  Pilih Kelas
                </label>
                <div className="relative group">
                  <select
                    name="class"
                    required
                    // GUNAKAN INI: hubungkan ke state form
                    value={form.class} 
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0B1220]">
                      -- Pilih Kelas --
                    </option>
                    {classList.map((c: any, index: number) => (
                      <option key={c.id || `class-${index}`} value={c.className} className="bg-[#0B1220]">
                        {c.className}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Angkatan (Batch)</label>
              <input value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="2023/2024" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NIS (No. Induk)</label>
              <input value={form.nis} maxLength={10} onChange={e => setForm({...form, nis: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NISN</label>
              <input value={form.nisn} maxLength={10} onChange={e => setForm({...form, nisn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NIK (Sesuai KK)</label>
              <input value={form.nik} maxLength={16} onChange={e => setForm({...form, nik: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Jenis Kelamin</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none">
                <option value="Laki-laki" className="bg-[#0B1220]">Laki-laki</option>
                <option value="Perempuan" className="bg-[#0B1220]">Perempuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Tempat Lahir</label>
              <input value={form.birthPlace} onChange={e => setForm({...form, birthPlace: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Tanggal Lahir</label>
              <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/30">
            {saving ? "Menyimpan Data..." : "Simpan Data Siswa"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

// ──────────────────────────────────────────────────────────────
export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modals, setModals] = useState<any>({ add: false, edit: false, designer: false });
  const [selected, setSelected] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50); // Default 20 data per halaman
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Tambahan untuk info total
  const [classList, setClassList] = useState<any[]>([]);
  const queryClient = useQueryClient();
  // Di dalam komponen StudentManager
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [graduationModal, setGraduationModal] = useState(false);
  const [duplicateSummary, setDuplicateSummary] = useState({ uniqueNisDuplicates: 0, uniqueNisnDuplicates: 0 });
  const [gradData, setGradData] = useState({ year: new Date().getFullYear(), note: "", batch: "" });

  // Filter tambahan untuk UI (opsional tapi disarankan)
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  // Tambahkan baris ini di bagian deklarasi state
  const [showDuplicateOnly, setShowDuplicateOnly] = useState(false);

  const [cardConfig, setCardConfig] = useState<any>({
    title: "KARTU PELAJAR",
    subtitle: "SMK NEGERI PRO DIGITAL",
    accentColor: "#2563eb",
    titleColor: "#ffffff",    
    subtitleColor: "#ffffff", 
    bgImage: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- GANTI DENGAN LODASH DEBOUNCE ---
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1); 
    }, 500),
    []
  );

  // Jalankan debounce saat input berubah
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update UI input secara instan
    debouncedSetSearch(value); // Jalankan fungsi debounce untuk update API
  };

  // Pastikan untuk membatalkan debounce jika komponen di-unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // GANTI DENGAN INI

  const { data: studentData, isLoading: loading, refetch, isFetching } = useQuery({
    queryKey: [
      'students', 
      schoolId, 
      page, 
      limit, 
      debouncedSearch, 
      filterClass, 
      filterBatch,
      showDuplicateOnly   // ← tambahkan ini
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        schoolId: schoolId.toString(),
        page: page.toString(),
        limit: limit.toString(),
        name: debouncedSearch,
        isDuplicateOnly: showDuplicateOnly ? 'true' : 'false',   // ← tambahkan ini
      });

      if (filterClass) params.append("class", filterClass);
      if (filterBatch) params.append("batch", filterBatch);

      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data siswa");
      return res.json();
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Update state lokal (Hanya jika kamu masih butuh state terpisah untuk UI table)
  useEffect(() => {
    if (studentData) {
      setStudents(studentData.data || []);
      setTotalPages(studentData.pagination?.totalPages || 1);
      setTotalItems(studentData.pagination?.totalItems || 0);
      setDuplicateSummary(studentData.summary || { uniqueNisDuplicates: 0, uniqueNisnDuplicates: 0 });
    }
  }, [studentData]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) return;
      try {
        const res = await fetch(`https://be-school.kiraproject.id/kelas?schoolId=${schoolId}`);
        const json = await res.json();
        if (json.success) setClassList(json.data);
        console.log('json kelas', json)
      } catch (err) {
        console.error("Gagal mengambil daftar kelas:", err);
      }
    };

    if (open) { // Hanya fetch saat modal terbuka
      fetchClasses();
    }
  }, [open, schoolId]);

  const handleDownloadTemplate = () => {
    const templateData = [
      { Nama: "Ahmad Fauzi", Gender: "Laki-laki", NIK: "3201010101010001", NISN: "0012345678", NIS: "2425001", TempatLahir: "Jakarta", TanggalLahir: "2008-05-12", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Siti Aminah", Gender: "Perempuan", NIK: "3201010101010002", NISN: "0012345679", NIS: "2425002", TempatLahir: "Bandung", TanggalLahir: "2008-08-20", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Budi Santoso", Gender: "Laki-laki", NIK: "3201010101010003", NISN: "0012345680", NIS: "2425003", TempatLahir: "Surabaya", TanggalLahir: "2007-12-05", Kelas: "11-TKJ-2", Angkatan: "2023" },
      { Nama: "Dewa Made", Gender: "Laki-laki", NIK: "3201010101010004", NISN: "0012345681", NIS: "2425004", TempatLahir: "Denpasar", TanggalLahir: "2008-01-15", Kelas: "10-RPL-2", Angkatan: "2024" },
      { Nama: "Putri Lestari", Gender: "Perempuan", NIK: "3201010101010005", NISN: "0012345682", NIS: "2425005", TempatLahir: "Medan", TanggalLahir: "2009-03-10", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Rizky Ramadhan", Gender: "Laki-laki", NIK: "3201010101010006", NISN: "0012345683", NIS: "2425006", TempatLahir: "Makassar", TanggalLahir: "2008-09-25", Kelas: "11-TKJ-1", Angkatan: "2023" },
      { Nama: "Maya Indah", Gender: "Perempuan", NIK: "3201010101010007", NISN: "0012345684", NIS: "2425007", TempatLahir: "Yogyakarta", TanggalLahir: "2008-07-07", Kelas: "10-RPL-2", Angkatan: "2024" },
      { Nama: "Andi Wijaya", Gender: "Laki-laki", NIK: "3201010101010008", NISN: "0012345685", NIS: "2425008", TempatLahir: "Semarang", TanggalLahir: "2007-11-30", Kelas: "12-RPL-1", Angkatan: "2022" },
      { Nama: "Larasati", Gender: "Perempuan", NIK: "3201010101010009", NISN: "0012345686", NIS: "2425009", TempatLahir: "Malang", TanggalLahir: "2008-04-14", Kelas: "10-TKJ-1", Angkatan: "2024" },
      { Nama: "Farhan Hakim", Gender: "Laki-laki", NIK: "3201010101010100", NISN: "0012345687", NIS: "2425010", TempatLahir: "Palembang", TanggalLahir: "2008-02-28", Kelas: "11-RPL-1", Angkatan: "2023" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Siswa");
    XLSX.writeFile(wb, "Template_Siswa.xlsx");
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !schoolId) return;
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const dataBinary = evt.target?.result;
          const wb = XLSX.read(dataBinary, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data: any[] = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: "yyyy-mm-dd" });

          for (const row of data) {
            const fd = new FormData();
            fd.append("name", row["Nama"] || "");
            fd.append("gender", row["Gender"] || "");
            fd.append("nik", row["NIK"] ? row["NIK"].toString() : "");
            fd.append("nisn", row["NISN"] ? row["NISN"].toString() : "");
            fd.append("nis", row["NIS"] ? row["NIS"].toString() : "");
            fd.append("birthPlace", row["TempatLahir"] || "");
            fd.append("birthDate", row["TanggalLahir"] || "");
            fd.append("class", row["Kelas"] || "");
            fd.append("batch", row["Angkatan"] || "");
            fd.append("schoolId", schoolId.toString());

            const res = await fetch(BASE_URL, { method: "POST", body: fd });
            const json = await res.json();

            if (!res.ok) {
              toast.error(json.message || "Gagal menambahkan siswa dari file", {
                duration: 8000,
              });
            }
          }

          toast.success("Impor selesai");
          queryClient.invalidateQueries({ queryKey: ['students'] });
        } catch (e: any) {
          toast.error(e.message || "Terjadi kesalahan saat membaca file.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsBinaryString(file);
    };

const handleMarkAbsence = async (student: Student, status: 'Izin' | 'Sakit' | 'Alpha') => {
    if (!window.confirm(`Tandai ${student.name} sebagai ${status} hari ini?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/mark-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          schoolId: schoolId,
          status,
          currentClass: student.class,
          userRole: 'student'
        })
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success(`${student.name} ditandai sebagai ${status} hari ini.`);
        queryClient.invalidateQueries({ queryKey: ['students'] });
      } else {
        toast.error(json.message || "Gagal mencatat kehadiran");
      }
    } catch (err: any) {
      toast.error("Gagal mencatat ketidakhadiran", {
      });
    }
  };

const handleProcessGraduation = async () => {
  if (selectedIds.length === 0) {
    toast.warning("Pilih siswa terlebih dahulu");
    return;
  }

  const batchRegex = /^\d{4}$/;
  if (!batchRegex.test(gradData.batch)) {
    toast.error("Angkatan (Batch) harus berupa 4 digit angka (Contoh: 2024)");
    return;
  }

  if (!window.confirm(`Luluskan ${selectedIds.length} siswa yang dipilih?`)) return;

  setIsProcessing(true);
  try {
    const selectedStudentsData = students
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({ id: s.id, nis: s.nis }));

    const res = await fetch(`${BASE_URL}/process-graduation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentIds: selectedStudentsData,
        graduationYear: gradData.year,
        description: gradData.note,
        batch: gradData.batch,
        schoolId: schoolId
      })
    });

    const result = await res.json();
    if (result.success) {
      toast.success(result.message || "Siswa berhasil diluluskan");
      setSelectedIds([]);
      setGraduationModal(false);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } else {
      toast.error(result.message || "Gagal memproses kelulusan");
    }
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setIsProcessing(false);
  }
};

// Fungsi helper untuk bulk selection per halaman
const toggleSelectAll = () => {
  if (selectedIds.length === students.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(students.map(s => s.id));
  }
};

const handleGeneratePDF = async () => {
    setIsProcessing(true);
    setShowProgress(true);
    setProgress(0);

    try {
      const res = await fetch(`${BASE_URL}/all-no-pagination?schoolId=${schoolId}`);
      const json = await res.json();
      const allStudents: Student[] = json.data || [];

      if (allStudents.length === 0) {
        toast.warning("Tidak ada data siswa untuk dicetak");
        return;
      }

      await generateStudentCardsPDF(allStudents, cardConfig, (pct) => setProgress(pct));

      setTimeout(() => setShowProgress(false), 800);
      toast.success("PDF kartu siswa berhasil dibuat");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat generate file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus siswa "${name}"?`)) return;

      try {
        const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        const json = await res.json();

        if (res.ok) {
          toast.success(`Siswa "${name}" berhasil dihapus`);
          queryClient.invalidateQueries({ queryKey: ['students'] });
        } else {
          toast.error(json.message || "Gagal menghapus siswa");
        }
      } catch (err: any) {
        toast.error(err.message || "Periksa koneksi atau hubungi admin.");
      }
    };

const statusStyles: Record<string, string> = {
  Hadir: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  Izin: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  Sakit: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  Alpha: "bg-red-500/10 text-red-500 border border-red-500/20",
  "Belum Hadir": "bg-zinc-500/10 text-zinc-500 border border-zinc-500/10",
};

const selectByCriteria = (className: string, batch: string) => {
  const filtered = students.filter(s => 
    (className ? s.class === className : true) && 
    (batch ? s.batch === batch : true)
  );
  setSelectedIds(filtered.map(s => s.id));
};

const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-8 text-slate-100">
      <Toaster position="top-right" richColors />
      {/* Header Utama */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
            <CheckCircle2 size={14} /> Database Online Active
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Data <span className="text-blue-600">Siswa</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola kehadiran dan siswa</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadTemplate} className="h-14 px-5 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest">
            <Download size={16}/> Template
          </button>
          <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <FileSpreadsheet size={16}/> Import
            <input type="file" hidden accept=".xlsx, .xls" onChange={handleBulkUpload} />
          </label>
          <button onClick={() => setModals({ ...modals, designer: true })} className="h-14 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <Palette size={16}/> Kartu
          </button>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setGraduationModal(true)} 
              className="h-14 px-6 bg-amber-500 text-black rounded-2xl flex items-center gap-2 hover:bg-amber-400 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-amber-500/20"
            >
              <GraduationCap size={18}/> Luluskan ({selectedIds.length})
            </button>
          )}
          {
            selectedIds.length === 0 && (
              <button onClick={() => setModals({ ...modals, add: true })} className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
                <Plus size={16}/> Tambah
              </button>
            )
          }
        </div>
      </div>

      <div className="mb-6 relative w-full flex gap-3 items-center justify-between">
        <div className="w-[80%]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
          />
        </div>

        <button 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flex-1 h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Syncing..." : "Refresh"}
        </button>
    </div>

    {/* Letakkan di bawah Search Bar, di atas Tabel */}
    <div className="mb-4 flex flex-wrap gap-4 items-center bg-white/[0.03] p-4 rounded-3xl border border-white/5">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-2">Pilih Cepat:</span>
        
        {/* Dropdown Kelas */}
        <select 
          value={filterClass}
          onChange={(e) => {
            setFilterClass(e.target.value);
            setPage(1); // Reset ke hal 1 saat filter berubah
          }}
          className="bg-zinc-800 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500"
        >
          <option value="">Semua Kelas</option>
          {classList.map(c => (
            <option key={c.id} value={c.className}>{c.className}</option>
          ))}
        </select>

        {/* Input Angkatan */}
        <input 
          type="text"
          placeholder="Angkatan..."
          value={filterBatch}
          onChange={(e) => {
            setFilterBatch(e.target.value);
            setPage(1); // Reset ke hal 1 saat filter berubah
          }}
          className="bg-zinc-800 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white outline-none w-32 focus:border-blue-500"
        />

        <button
          onClick={() => {
            setShowDuplicateOnly(prev => !prev);
            setPage(1);           // reset ke halaman 1
          }}
          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
            showDuplicateOnly 
              ? 'bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30' 
              : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <AlertTriangle size={14} />
          {showDuplicateOnly ? "Hanya Tampilkan Duplikat" : "Tampilkan Duplikat Saja"}
        </button>

        {/* Tombol Select All untuk data yang SUDAH terfilter di tabel */}
        <button 
          onClick={() => {
            const matchedIds = students.map(s => s.id);
            setSelectedIds(prev => Array.from(new Set([...prev, ...matchedIds])));
          }}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500/40 transition-all"
        >
          Centang Semua di Halaman Ini
        </button>
      </div>

      {showDuplicateOnly && (
        <div className="mt-5 mb-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} className="text-amber-400" />
          <span className="font-medium text-amber-300">
            Saat ini hanya menampilkan siswa dengan <strong>NIS</strong> atau <strong>NISN duplikat</strong>
          </span>
          <button 
            onClick={() => setShowDuplicateOnly(false)}
            className="ml-auto text-amber-400 hover:text-amber-300 text-xs underline"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
      {/* Tabel dengan Status Kehadiran */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 bg-white/[0.03]">
            <tr>
              {/* Kolom profil dibiarkan fleksibel atau beri batas tertentu */}
              <th className="pl-6 p-6 text-zinc-500 w-[30%]">Profil</th> 
              
              <th className="py-6 text-zinc-500 w-[15%]">Kelas</th>
              <th className="py-6 text-zinc-500 w-[15%]">NIS / NISN</th>
              <th className="py-6 text-zinc-500 w-[12%]">Kehadiran</th>
              <th className="py-6 text-zinc-500 w-[15%]">Status</th>
              
              {/* Checkbox dan Aksi harus sempit */}
              <th className="pl-6 p-6 w-[50px]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 relative top-[1.2px] rounded border-white/10 bg-white/5" 
                  checked={selectedIds.length === students.length && students.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-6 text-zinc-500 w-[10%]">Aksi Lainnya</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="px-2 py-20 text-center text-zinc-600 tracking-widest uppercase">Loading...</td></tr>
            ) : students.map(s => {
              const isRowDuplicate = s.isNisDuplicate || s.isNisnDuplicate;
              
              return (
              <tr key={s.id} 
              className={`transition-colors ${
                isRowDuplicate 
                ? 'bg-red-500/[0.05] hover:bg-red-500/[0.08]' 
                : 'hover:bg-white/[0.01]'
              }`}>
               <td className="py-6 pl-6">
                  <div className="flex items-center gap-4 max-w-[250px]"> {/* Tambahkan max-width */}
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      {s.photoUrl ? (
                        <img src={s.photoUrl} className="object-cover h-full w-full" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><User className="text-zinc-700" size={16}/></div>
                      )}
                    </div>
                    <div className="min-w-0"> {/* Penting agar truncate bekerja di dalam flex */}
                      <div className="font-bold text-white tracking-tight truncate">{s.name}</div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">{s.gender}</div>
                    </div>
                  </div>
                </td>
               <td className="py-6">
                  <div className="text-blue-400 w-full truncate font-mono text-sm">{s.class}</div>
                  <div className="text-[10px] text-zinc-500 font-medium tracking-tighter">{s.batch || "-"}</div>
                </td>
                <td className="py-6">
                  <div className="flex flex-col">
                    <div className={`font-mono text-xs flex items-center gap-1 ${s.isNisDuplicate ? 'text-red-500 font-bold' : 'text-blue-400'}`}>
                      {s.nis}
                      {/* {s.isNisDuplicate && <AlertCircle size={12} />} */}
                    </div>
                    <div className={`text-[10px] font-medium tracking-tighter flex items-center gap-1 ${s.isNisnDuplicate ? 'text-red-400' : 'text-zinc-500'}`}>
                      NISN: {s.nisn || "-"}
                      {/* {s.isNisnDuplicate && <AlertCircle size={10} />} */}
                    </div>
                  </div>
                </td>
                <td className="py-6">
                   <span className={`px-4 py-1.5 w-max flex rounded-full text-[8px] font-black uppercase tracking-widest ${statusStyles[s.statusKehadiran] || statusStyles["Belum Hadir"]}`}>
                      {s.statusKehadiran || "Belum Hadir"}
                   </span>
                </td>
                <td className="py-6">
                  <div className="flex flex-col gap-3">
                    {/* Tombol Cepat Mark Absence jika belum hadir */}
                    <div className="flex gap-3 justify-start">
                      <button onClick={() => handleMarkAbsence(s, 'Izin')} className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold hover:bg-amber-500/20">IZIN</button>
                      <button onClick={() => handleMarkAbsence(s, 'Sakit')} className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold hover:bg-blue-500/20">SAKIT</button>
                      <button onClick={() => handleMarkAbsence(s, 'Alpha')} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold hover:bg-red-500/20">ALPHA</button>
                    </div>
                  </div>
                </td>
                <td className="pl-6">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/10 bg-white/5"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => {
                      setSelectedIds(prev => 
                        prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                      );
                    }}
                  />
                </td>
                <td className="py-6 text-left gap-2.5 flex pr-6">
                  <button 
                    onClick={() => navigate(`/detail/${s.id}?role=student`)} 
                    className="p-3 bg-white/5 hover:bg-white/20 hover:text-white rounded-xl transition-all"
                    title="Lihat Detail & Riwayat"
                  >
                    <Eye size={16}/>
                  </button>
                  <button onClick={() => { setSelected(s); setModals({...modals, edit: true}); }} className="p-3 bg-white/5 hover:bg-white/20 rounded-xl hover:text-white"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="p-3 bg-white/5 hover:bg-white/20 rounded-xl hover:text-white"><Trash2 size={16}/></button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Pagination & Limit Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Tampilkan</span> */}
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset ke hal 1 jika limit berubah
              }}
             className="bg-white/5 border border-white/10 w-max pr-7 pl-3 h-10 rounded-xl text-[10px] font-black text-white outline-none appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '14px'
              }}
            >
              <option className="text-black" value={10}>10 Baris</option>
              <option className="text-black" value={20}>20 Baris</option>
              <option className="text-black" value={50}>50 Baris</option>
              <option className="text-black" value={100}>100 Baris</option>
            </select>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />
          <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Total: <span className="text-white">{totalItems}</span> Siswa
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-all text-zinc-400"
          >
            Prev
          </button>
          
          <div className="flex gap-1">
            {/* Logic Angka Halaman Ringkas */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) pageNum = i + 1;
              else if (page === totalPages) pageNum = totalPages - 2 + i;
              else pageNum = Math.max(1, page - 1) + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${page === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-all text-zinc-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Progress Modal */}
      {showProgress && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md text-center shadow-2xl">
            <div className="mb-6">
              <div className="h-20 w-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileText className="text-blue-500" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                Sedang Menyiapkan PDF
              </h3>
              <p className="text-zinc-500 text-sm mt-1">Jangan tutup halaman ini</p>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-blue-500">{progress}% Selesai</span>
              <span className="text-zinc-600">Total {totalItems || students?.length || 0} Siswa</span>
            </div>
          </div>
        </div>
      )}

      {graduationModal && (
        <GraduationModal
          open={graduationModal}
          onClose={() => setGraduationModal(false)}
          selectedCount={selectedIds.length}
          onConfirm={handleProcessGraduation}
          isProcessing={isProcessing}
        />
      )}

      {/* Side Modals */}
      <StudentModal 
          classList={classList || []} 
          open={modals.add || modals.edit} 
          onClose={() => { setModals({...modals, add:false, edit:false}); setSelected(null); }} 
          title={selected ? "Perbarui Siswa" : "Tambah Siswa"} 
          initialData={selected} 
          schoolId={schoolId} 
          onSubmit={async (fd: FormData) => { 
          const res = await fetch(selected ? `${BASE_URL}/${selected.id}` : BASE_URL, {
            method: selected ? 'PUT' : 'POST', 
            body: fd
          });

          const result = await res.json(); // Ambil body response

          if (!res.ok) {
            // Lempar pesan error dari backend agar ditangkap oleh catch di modal
            throw new Error(result.message || "Terjadi kesalahan pada server");
          }

          // Jika sukses
          queryClient.invalidateQueries({ queryKey: ['students'] });
          setModals({...modals, add: false, edit: false});
          toast.success('Data berhasil tersimpan!')
        }} 
      />
      <CardDesignerModal open={modals.designer} onClose={() => setModals((p: any) => ({ ...p, designer: false }))} config={cardConfig} setConfig={setCardConfig} onGenerate={handleGeneratePDF} isProcessing={isProcessing} />

      {/* Alert Duplikat */}
      {(duplicateSummary.uniqueNisDuplicates > 0 || duplicateSummary.uniqueNisnDuplicates > 0) && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase tracking-tight text-red-500">Data Duplikat Terdeteksi!</h4>
            <p className="text-xs text-zinc-400">
              Terdapat <span className="text-white font-bold">{duplicateSummary.uniqueNisDuplicates} NIS</span> dan <span className="text-white font-bold">{duplicateSummary.uniqueNisnDuplicates} NISN</span> yang ganda. Mohon periksa baris yang berwarna merah.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}