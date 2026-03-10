import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

export const StudentModal = ({ open, onClose, title, initialData, onSubmit, schoolId, classList }: any) => {
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
      console.log("Data yang akan dikirim:", form);
      // Loop untuk memasukkan semua data form ke FormData
      Object.entries(form).forEach(([k, v]) => { 
        if(k !== 'preview' && k !== 'photo' && v) fd.append(k, v as string); 
      });
      
      fd.append("schoolId", schoolId.toString());
      if (form.photo) fd.append("photo", form.photo);

      await onSubmit(fd); 
      onClose();
    } catch (err: any) { 
      alert(err.message); 
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