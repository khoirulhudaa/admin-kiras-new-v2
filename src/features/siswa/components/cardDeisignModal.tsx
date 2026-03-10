import { AnimatePresence, motion } from "framer-motion";
import { Printer, Upload, User, X } from "lucide-react";

export const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }: any) => {
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
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-500"><X /></button>
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