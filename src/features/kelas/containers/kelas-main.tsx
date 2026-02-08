import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Loader, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

// const API_BASE = "http://localhost:5005/kelas";
const API_BASE = "https://be-school.kiraproject.id/kelas";

export default function KelasMain() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [classNameInput, setClassNameInput] = useState("");

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const fetchData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, className: classNameInput }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingItem(null);
        setClassNameInput("");
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setClassNameInput(item.className);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kelas ini?")) return;
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <BookOpen size={14} /> Master Data
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Manajemen <span className="text-blue-600">Kelas</span>
          </h1>
        </div>
        <button
          onClick={() => { setEditingItem(null); setClassNameInput(""); setModalOpen(true); }}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl transition-all"
        >
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      {/* Grid Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white/[0.03] border border-white/8 rounded-3xl p-6 hover:border-blue-500/50 transition-all shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic">
              {item.className}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Perbarui
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Slide-over (Mirip Pengumuman) */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B1220] border-l border-white/10 z-[10000] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white uppercase italic">{editingItem ? "Perbarui" : "Tambah"} Kelas</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Nama Kelas</label>
                  <input
                    required
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    placeholder="Contoh: XII RPL 1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
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