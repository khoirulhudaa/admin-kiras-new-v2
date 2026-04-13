import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from "framer-motion";
import debounce from 'lodash/debounce'; // Import debounce
import { Toaster, toast } from "sonner"; // Pastikan sudah install: npm i sonner

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  IdCard,
  PlusCircle,
  Printer,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Upload,
  MessageCircle, Mail, Share2,
  User,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import GraduationModal from "../components/graduationModal";
import { generateStudentCardsPDF } from "../utils/generateStudentCards";
import { useProfile } from "@/features/profile";
import moment from "moment";

const BASE_URL = "https://be-school.kiraproject.id/siswa";
// const BASE_URL = "http://localhost:5005/siswa";

// --- Interfaces ---
interface Student {
  id: number;
  name: string;
  nis: string;
  class: string;
  batch: any;
  rfidUid?: string; 
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

// Komponen kecil StatusDropdown di dalam file yang sama
const StatusDropdown = ({ student, onMark }: { student: Student; onMark: (s: Student, status: any) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"
        title="Edit Status"
      >
        <Edit size={14} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-9 bg-[#0B1220] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden w-32">
          {['Hadir', 'Izin', 'Sakit', 'Alpha'].map(status => (
            <button
              key={status}
              onClick={() => { onMark(student, status); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }: any) => {
  if (!open) return null;

  // const [activeTab, setActiveTab] = React.useState<'depan' | 'belakang'>('depan');
  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full max-w-7xl bg-[#0B1220] border-l border-white/10 z-[100001] py-6 pl-6 overflow-hidden"
      >
        {/* <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              Sesuaikan tampilan kartu pelajar
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-500">
            <X size={24} />
          </button>
        </div> */}

        <div className="flex gap-8 h-full">
          
          {/* ==================== LIVE PREVIEW (KIRI) ==================== */}
          <div className="flex-1 flex flex-col">
            {/* <div className="text-sm font-bold text-white/70 mb-4">LIVE PREVIEW</div> */}
            
            <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-8 overflow-auto">
              <div className="flex flex-col items-center gap-10">

                {/* KARTU DEPAN */}
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest mb-3 text-center">KARTU DEPAN</div>
                  <div 
                    className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
                    style={{ 
                      backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none', 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }}
                  >
                    {config.bgImage && (
                      <div 
                        className="absolute inset-0 bg-white z-0" 
                        style={{ opacity: config.bgOpacityFront ?? 0.40 }} 
                      />
                    )}

                    {/* Header */}
                    <div 
                      className="relative z-10 h-[50px] flex items-center justify-between px-3"
                      style={{ 
                        backgroundColor: config.accentColor === "transparent" ? "transparent" : config.accentColor 
                      }}
                    >
                      {config.logoSchool ? (
                        <img src={config.logoSchool} className="h-7 w-7 object-contain" alt="logo sekolah" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-white/20" />
                      )}

                      <div className="flex flex-col items-center flex-1 mx-2">
                        <div className="text-[9px] font-black tracking-widest uppercase leading-tight" style={{ color: config.titleColor }}>
                          {config.title || "KARTU TANDA SISWA"}
                        </div>
                        <div className="text-[6px] font-bold uppercase leading-tight" style={{ color: config.subtitleColor }}>
                          {config.subtitle || "SMK NEGERI"}
                        </div>
                        {config.schoolAddress && (
                          <div className="text-[5px] opacity-80 text-center leading-tight" style={{ color: config.subtitleColor }}>
                            {config.schoolAddress}
                          </div>
                        )}
                      </div>

                      {config.logoDinas ? (
                        <img src={config.logoDinas} className="h-7 w-7 object-contain" alt="logo dinas" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-white/20" />
                      )}
                    </div>

                    {/* Body Depan */}
                    <div className="relative z-10 p-3 flex gap-3 h-[calc(100%-50px)]">
                      <div className="w-16 h-20 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                        <User size={32} className="text-slate-300"/>
                      </div>
                      <div className="flex-1 space-y-1 pt-1">
                        <div className="text-[9px] font-black text-slate-800 uppercase truncate">NAMA SISWA LENGKAP</div>
                        <div className="text-[7px] font-bold text-slate-600">NIS: 123456789</div>
                        <div className="text-[7px] font-semibold text-slate-500">KLS: 10-RPL-1</div>
                        <div className="text-[7px] font-semibold text-slate-500">RFID: A1 B2 C3 D4</div>
                      </div>
                      <div className="absolute bottom-3 right-3 w-10 h-10 border border-slate-200 flex items-center justify-center bg-white rounded-md shadow-sm">
                        <div className="text-[4px] font-bold text-slate-300">QR</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KARTU BELAKANG */}
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest mb-3 text-center">KARTU BELAKANG</div>
                  <div 
                    className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
                    style={{ 
                      backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none', 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }}
                  >
                    {config.bgImage && (
                      <div 
                        className="absolute inset-0 bg-white z-0" 
                        style={{ opacity: config.bgOpacityBack ?? 0.40 }} 
                      />
                    )}

                    <div className="relative z-10 p-5 h-full flex flex-col gap-4">
                      {/* VISI */}
                      <div>
                        <div 
                          className="font-black uppercase mb-1 tracking-wider"
                          style={{ 
                            color: config.vmTitleColor || "#000000",
                            fontSize: `${(config.vmTitleFontSize || 7) * 1.333}px`
                          }}
                        >
                          VISI
                        </div>
                        <div 
                          className="leading-tight"
                          style={{ 
                            color: config.vmTextColor || "#1e293b",
                            fontSize: `${(config.vmVisionFontSize || 6) * 1.333}px`
                          }}
                        >
                          {config.visionMission?.vision || 
                            <span className="italic text-slate-400">Visi belum diisi...</span>
                          }
                        </div>
                      </div>

                      {/* MISI */}
                      <div>
                        <div 
                          className="font-black uppercase mb-1 tracking-wider"
                          style={{ 
                            color: config.vmTitleColor || "#000000",
                            fontSize: `${(config.vmTitleFontSize || 7) * 1.333}px`
                          }}
                        >
                          MISI
                        </div>
                        <div className="space-y-0.5">
                          {(() => {
                            const getBullet = (i: number) => {
                              switch (config.missionBulletStyle ?? "number") {
                                case "dot":   return "• ";
                                case "dash":  return "— ";
                                case "arrow": return "→ ";
                                default:      return `${i + 1}. `;
                              }
                            };

                            const fontSizePt = config.vmMissionFontSize || 5.5;
                            const fontSizePx = fontSizePt * 1.333;          // pt → px untuk preview
                            const missionSpacing = config.missionSpacing ?? 2.6;
                            const baseLineHeight = fontSizePx;
                            const lineHeightPx = baseLineHeight + (missionSpacing - 2) * 8;

                            return config.visionMission?.missions?.slice(0, 5).map((m: string, i: number) => (
                              <div
                                key={i}
                                className="leading-tight"
                                style={{
                                  color: config.vmTextColor || "#1e293b",
                                  fontSize: `${fontSizePx}px`,
                                  marginBottom: `${(missionSpacing - 2) * 8 * 0.5}px`,
                                  lineHeight: `${fontSizePx * 1.2}px`,
                                }}
                              >
                                {getBullet(i)}{m}
                              </div>
                            )) ?? <div className="italic text-slate-400 text-[6px]">Misi belum diisi...</div>;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ==================== CONTROLS (KANAN) ==================== */}
          <div className="w-1/2 flex-shrink-0 overflow-y-auto pr-6 custom-scrollbar">
            <div className="w-full flex justify-between items-center mb-5">
              <div onClick={onClose} className="text-sm flex items-center gap-3 cursor-pointer active:scale-[0.98] hover:text-red-500/90 font-bold text-red-400">
                <ArrowLeft />
                KEMBALI
              </div>
              <div className="text-sm font-bold text-white/70">PENGATURAN KARTU</div>
              {/* <X className="text-red-400" /> */}
            </div>
            
            <div className="space-y-8">
              {/* Warna & Teks Dasar */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Warna Judul</label>
                  <input type="color" value={config.titleColor} onChange={e => setConfig({...config, titleColor: e.target.value})} className="w-full h-12 bg-transparent border-none cursor-pointer rounded" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Warna Subtitle</label>
                  <input type="color" value={config.subtitleColor} onChange={e => setConfig({...config, subtitleColor: e.target.value})} className="w-full h-12 bg-transparent border-none cursor-pointer rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Judul Kartu</label>
                  <input value={config.title} onChange={e => setConfig({...config, title: e.target.value})} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500" />
                </div>

                {/* Warna Aksen */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Warna Aksen (Header)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.accentColor === "transparent" ? "#2563eb" : config.accentColor}
                      onChange={e => setConfig({...config, accentColor: e.target.value})}
                      className="w-14 h-12 bg-transparent border-none cursor-pointer rounded"
                    />
                    <button
                      onClick={() => setConfig({...config, accentColor: "transparent"})}
                      className={`flex-1 h-12 rounded-xl border-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all ${
                        config.accentColor === "transparent" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/20 hover:border-white/40 bg-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {config.accentColor === "transparent" ? "✓ Transparent" : "Transparent"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pengaturan Visi & Misi */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Warna Judul Visi & Misi</label>
                    <input type="color" value={config.vmTitleColor || "#000000"} onChange={e => setConfig({...config, vmTitleColor: e.target.value})} className="w-full h-12 bg-transparent border-none cursor-pointer rounded" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Warna Teks Visi & Misi</label>
                    <input type="color" value={config.vmTextColor || "#1e293b"} onChange={e => setConfig({...config, vmTextColor: e.target.value})} className="w-full h-12 bg-transparent border-none cursor-pointer rounded" />
                  </div>
                </div>

                {/* Ukuran Font Visi & Misi */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Ukuran Judul Visi & Misi</label>
                    <input type="range" min="6" max="9" step="0.1" value={config.vmTitleFontSize || 7} onChange={e => setConfig({...config, vmTitleFontSize: parseFloat(e.target.value)})} className="w-full accent-blue-500" />
                    <div className="text-center text-xs text-white/60">{config.vmTitleFontSize || 7} pt</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Ukuran Teks Visi</label>
                    <input type="range" min="5" max="7" step="0.1" value={config.vmVisionFontSize || 6} onChange={e => setConfig({...config, vmVisionFontSize: parseFloat(e.target.value)})} className="w-full accent-blue-500" />
                    <div className="text-center text-xs text-white/60">{config.vmVisionFontSize || 6} pt</div>
                  </div>

                </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Ukuran Teks Misi</label>
                    <input type="range" min="4.5" max="6.5" step="0.1" value={config.vmMissionFontSize || 5.5} onChange={e => setConfig({...config, vmMissionFontSize: parseFloat(e.target.value)})} className="w-full accent-blue-500" />
                    <div className="text-center text-xs text-white/60">{config.vmMissionFontSize || 5.5} pt</div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Jarak Antar Misi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Jarak Antar Misi</label>
                  <div className="space-y-2">
                    <input
                      type="range" min="2" max="3" step="0.1"
                      value={config.missionSpacing ?? 2.6}
                      onChange={e => setConfig({...config, missionSpacing: parseFloat(e.target.value)})}
                      className="w-full accent-blue-500"
                    />
                    <div className="text-center text-xs text-white/60">{(config.missionSpacing ?? 2.6).toFixed(1)} mm</div>
                  </div>
                </div>

                {/* Style Bullet Misi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Style List Misi</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "number", label: "1. 2. 3." },
                      { value: "dot",    label: "• • •" },
                      { value: "dash",   label: "— — —" },
                      { value: "arrow",  label: "→ → →" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setConfig({...config, missionBulletStyle: opt.value})}
                        className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                          (config.missionBulletStyle ?? "number") === opt.value
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-white/10 bg-white/5 text-zinc-500 hover:border-white/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opacity Background */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Opacity BG Depan</label>
                  <div className="flex-col flex gap-4">
                    <input type="range" min="0.1" max="0.9" step="0.05" value={config.bgOpacityFront ?? 0.40} onChange={e => setConfig({...config, bgOpacityFront: parseFloat(e.target.value)})} className="flex-1 accent-blue-500" />
                    <span className="font-mono text-center text-sm text-white/70 w-12 mx-auto">{(config.bgOpacityFront ?? 0.40).toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Opacity BG Belakang</label>
                  <div className="flex-col flex gap-4">
                    <input type="range" min="0.1" max="0.9" step="0.05" value={config.bgOpacityBack ?? 0.40} onChange={e => setConfig({...config, bgOpacityBack: parseFloat(e.target.value)})} className="flex-1 accent-blue-500" />
                    <span className="font-mono text-center text-sm text-white/70 w-12 mx-auto">{(config.bgOpacityBack ?? 0.40).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Logo Sekolah & Dinas */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Logo Sekolah (Kiri)</label>
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500/50 overflow-hidden">
                    {config.logoSchool ? (
                      <img src={config.logoSchool} className="h-full object-contain p-2" />
                    ) : (
                      <div className="text-center text-zinc-500"><Upload size={24} className="mx-auto mb-2"/><span className="text-xs">Upload Logo</span></div>
                    )}
                    <input type="file" hidden accept="image/*" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setConfig({...config, logoSchool: ev.target?.result});
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  {/* {config.logoSchool && <button onClick={() => setConfig({...config, logoSchool: null})} className="text-red-400 text-xs hover:text-red-300">Hapus</button>} */}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Logo Dinas (Kanan)</label>
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-blue-500/50 overflow-hidden">
                    {config.logoDinas ? (
                      <img src={config.logoDinas} className="h-full object-contain p-2" />
                    ) : (
                      <div className="text-center text-zinc-500"><Upload size={24} className="mx-auto mb-2"/><span className="text-xs">Upload Logo</span></div>
                    )}
                    <input type="file" hidden accept="image/*" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setConfig({...config, logoDinas: ev.target?.result});
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  {/* {config.logoDinas && <button onClick={() => setConfig({...config, logoDinas: null})} className="text-red-400 text-xs hover:text-red-300">Hapus</button>} */}
                </div>
              </div>

              {/* Alamat Sekolah */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase">Alamat Sekolah</label>
                <input 
                  value={config.schoolAddress || ""} 
                  onChange={e => setConfig({...config, schoolAddress: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                  placeholder="Jl. Contoh No. 1, Kec. X, Kota Y"
                />
              </div>

              {/* Background Presets */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/40 uppercase">Pilih Background</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {bgPresets.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => setConfig({ ...config, bgImage: bg })}
                      className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                        config.bgImage === bg ? 'border-blue-500 scale-95 shadow-lg' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={bg} alt={`BG ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30">
                    <Upload size={18} className="text-zinc-500" />
                    <input type="file" hidden accept="image/*" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setConfig({...config, bgImage: ev.target?.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t gap-3 border-white/20 pt-6">
                <button 
                  onClick={onClose} 
                  disabled={isProcessing} 
                  className="w-full hover:bg-slate-100/20 active:scale-[0.98] py-4 bg-slate-100/10 rounded-2xl font-black uppercase tracking-widest text-white flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                >
                  <ArrowLeft size={21}/> 
                  Batal
                </button>
                {/* Tombol Generate */}
                <button 
                  onClick={onGenerate} 
                  disabled={isProcessing} 
                  className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest text-white flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                >
                  <Printer size={20}/> 
                  {isProcessing ? "Sedang Memproses..." : "CETAK KARTU PDF"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const StudentModal = ({ open, onClose, prefilledRfid, title, initialData, onSubmit, schoolId, classList }: any) => {
  const [form, setForm] = useState({
    name: "", nis: "", nisn: "", nik: "", gender: "Laki-laki",
    birthPlace: "", birthDate: "", 
    class: "", batch: "",
    rfidUid: "", 
    email: "", password: "", // <--- Tambahkan ini
    photo: null as File | null, preview: ""
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setForm(p => ({ ...p, photo: file, preview: URL.createObjectURL(file) }));
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Effect khusus untuk update RFID saat scan (baik Add maupun Edit)
  useEffect(() => {
    if (open && prefilledRfid) {
      setForm(prev => ({ ...prev, rfidUid: prefilledRfid }));
    }
  }, [prefilledRfid, open]);

  // 2. Effect utama untuk load data awal (hanya jalankan sekali saat modal dibuka)
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
        class: initialData?.class || "", 
        batch: initialData?.batch || "",
        email: initialData?.email || "",    
        password: "",                
        rfidUid: initialData?.rfidUid || prefilledRfid || "",       
        photo: null,
        preview: initialData?.photoUrl || "",
      });
    }
  }, [open, initialData]);   // ← Hapus prefilledRfid dari dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      if (!schoolId) throw new Error("ID Sekolah tidak ditemukan");
      
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { 
        if (k === 'preview' || k === 'photo') return;
        
        // Khusus field opsional: skip kalau kosong
        const optionalFields = ['rfidUid', 'nisn', 'nik', 'birthPlace', 'birthDate', 'email', 'password'];
        if (optionalFields.includes(k) && (v === null || v === undefined || v === '')) return;
        
        if (v !== null && v !== undefined) {
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
            <div
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl relative overflow-hidden transition-all cursor-pointer
                ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-500/50'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileDrop(file);
              }}
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              {form.preview
                ? <img src={form.preview} className="absolute inset-0 w-full h-full object-cover" />
                : (
                  <div className="text-center text-zinc-600 pointer-events-none">
                    <Upload className="mx-auto mb-2" size={32} />
                    <span className="text-[10px] font-bold uppercase block">Upload atau Drag & Drop</span>
                    <span className="text-[9px] text-zinc-700 mt-1 block">PNG, JPG, WEBP maks 5MB</span>
                  </div>
                )
              }
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center pointer-events-none">
                  <span className="text-blue-400 font-black text-sm uppercase tracking-widest">Lepaskan untuk Upload</span>
                </div>
              )}
            </div>
            <input
              id="photo-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileDrop(file);
              }}
            />
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
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">
                RFID UID (Tap Kartu)
              </label>
              <input 
                autoComplete="off"
                name="rfid-uid-scanner"
                readOnly                          // ← tambah ini
                onFocus={e => e.target.removeAttribute('readOnly')} 
                value={form.rfidUid}
                onChange={e => setForm({...form, rfidUid: e.target.value})}
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    toast.success(`RFID terbaca: ${form.rfidUid}`);
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                placeholder="Silakan tap kartu..."
              />
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
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Email Siswa (Opsional)</label>
              <input 
                type="text"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" 
                placeholder="contoh@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">
                Password Akun
              </label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} // Dinamis berdasarkan state
                  autoComplete="new-password"
                  name="student-new-password"
                  readOnly                          // ← tambah ini
                  onFocus={e => e.target.removeAttribute('readOnly')}
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white outline-none focus:border-blue-500 transition-all" 
                  placeholder={initialData ? "Isi hanya jika ingin ganti" : "Default: sekolah123"}
                />
                
                {/* Tombol Icon Mata */}
                <button
                  type="button" // Pastikan type="button" agar tidak men-submit form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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

const ConfirmDangerModal = ({ open, title, description, confirmLabel, onConfirm, onClose }: any) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200000] flex items-center justify-center p-6"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-0 z-[200001] flex items-center justify-center p-6 pointer-events-none"
      >
        <div className="bg-[#0B1220] border border-red-500/20 rounded-3xl p-8 w-full max-w-md shadow-2xl pointer-events-auto">
          {/* Icon */}
          <div className="h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trash2 size={28} className="text-red-400" />
          </div>

          {/* Text */}
          <h3 className="text-xl font-black uppercase tracking-tight text-white text-center mb-2">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm text-center leading-relaxed mb-8">
            {description}
          </p>

          {/* Warning badge */}
          <div className="flex items-center gap-2 bg-red-500/10 text-center justify-center border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            {/* <AlertTriangle size={14} className="text-red-400 shrink-0" /> */}
            <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
              Tindakan ini tidak dapat dibatalkan
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-red-600/30"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ──────────────────────────────────────────────────────────────

const BulkChangeClassModal = ({ 
  open, 
  onClose, 
  classList, 
  selectedCount,
  selectedBatch,
  onSubmit,
  isProcessing
}: {
  open: boolean;
  onClose: () => void;
  classList: any[];
  selectedCount: number;
  selectedBatch?: string; // untuk mode "by batch"
  onSubmit: (newClass: string) => Promise<void>;
  isProcessing: boolean;
}) => {
  const [targetClass, setTargetClass] = useState("");

  // Reset saat modal dibuka
  useEffect(() => {
    if (open) setTargetClass("");
  }, [open]);

  if (!open) return null;

  const isByBatch = !!selectedBatch && selectedCount === 0;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" 
        onClick={onClose} 
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-0 z-[100001] flex items-center justify-center p-6 pointer-events-none"
      >
        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl pointer-events-auto">
          {/* Icon */}
          <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ArrowLeftRight size={28} className="text-blue-400" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white text-center mb-1">
            Pindah Kelas
          </h3>
          <p className="text-zinc-500 text-xs text-center mb-6 uppercase tracking-widest">
            {isByBatch 
              ? `Semua siswa Angkatan ${selectedBatch}`
              : `${selectedCount} siswa terpilih`
            }
          </p>

          {/* Target Class Select */}
          <div className="space-y-2 mb-6">
            <label className="text-[10px] font-bold text-white/40 uppercase ml-1">
              Pilih Kelas Tujuan
            </label>
            <div className="relative">
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 appearance-none font-bold cursor-pointer"
              >
                <option value="" disabled className="bg-[#0B1220]">
                  -- Pilih Kelas Tujuan --
                </option>
                {classList.map((c: any) => (
                  <option key={c.id} value={c.className} className="bg-[#0B1220]">
                    {c.className}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" 
              />
            </div>
          </div>

          {/* Warning */}
          {targetClass && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={14} className="text-blue-400 shrink-0" />
              <span className="text-[11px] text-blue-300 font-bold">
                {isByBatch 
                  ? `Semua siswa angkatan ${selectedBatch} → ${targetClass}`
                  : `${selectedCount} siswa terpilih → ${targetClass}`
                }
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                if (!targetClass) return;
                await onSubmit(targetClass);
              }}
              disabled={!targetClass || isProcessing}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Memproses..." : "Pindahkan"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessing2, setIsProcessing2] = useState(false);
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
  // const [manualRFID, setManualRFID] = useState("");
  // const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showWAStatus, setShowWAStatus] = useState(false);
  const [waStatus, setWaStatus] = useState<{ isReady: boolean; hasQR: boolean } | null>(null);
  const [waQrImage, setWaQrImage] = useState<string | null>(null);

  const WA_URL = "https://be-school.kiraproject.id/wa";
  
  // Filter tambahan untuk UI (opsional tapi disarankan)
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [bulkNotifs, setBulkNotifs] = useState<{id: number, type: 'warning' | 'error', title: string, list: string[]}[]>([]);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteBatch, setDeleteBatch] = useState("");
  const [changeClassModal, setChangeClassModal] = useState(false);
  const [changeClassBatch, setChangeClassBatch] = useState(""); // untuk mode by-batch
  const [isChangingClass, setIsChangingClass] = useState(false);
  const [showMoveClassMenu, setShowMoveClassMenu] = useState(false);
  const [moveClassBatch, setMoveClassBatch] = useState("");
  const [moveClassTarget, setMoveClassTarget] = useState("");
  const [bulkStatusTarget, setBulkStatusTarget] = useState<string>("");
  const [isBulkMarking, setIsBulkMarking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [waRateLimit, setWaRateLimit] = useState<{
    date: string;
    sent: number;
    remaining: number;
    max: number;
  } | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", confirmLabel: "", onConfirm: () => {} });
  
  const profile = useProfile()

  console.log('profile', profile)
  // Tambah useEffect untuk close saat klik luar
  useEffect(() => {
    if (!showDeleteMenu) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.delete-menu-wrapper')) {
        setShowDeleteMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDeleteMenu]);

  
  // Fetch kuota saat share menu dibuka
  useEffect(() => {
    if (!showShareMenu) return;
    
    const fetchRateLimit = async () => {
      try {
        const res = await fetch(`${WA_URL}/wa/send-stats`);
        const json = await res.json();
        if (json.success) setWaRateLimit(json.stats);
      } catch {
        // silent fail
      }
    };

    fetchRateLimit();
  }, [showShareMenu]);

  useEffect(() => {
    // Jangan polling kalau panel tidak dibuka
    if (!showWAStatus) return;

    const checkWAStatus = async () => {
      try {
        const res = await fetch(`${WA_URL}/status`);
        const json = await res.json();
        setWaStatus(json);
        if (json.hasQR) {
          const qrRes = await fetch(`${WA_URL}/qr`);
          const qrJson = await qrRes.json();
          if (qrJson.success) setWaQrImage(qrJson.qrImage);
        } else if (json.isReady) {
          setWaQrImage(null);
        }
      } catch {
        setWaStatus(null);
      }
    };

    checkWAStatus(); // fetch pertama langsung
    const interval = setInterval(checkWAStatus, 10000); // polling hanya saat panel buka
    return () => clearInterval(interval); // cleanup saat panel tutup
  }, [showWAStatus]);

  useEffect(() => {
    if (!showMoveClassMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.move-class-menu-wrapper')) {
        setShowMoveClassMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoveClassMenu]);

  const addBulkNotif = (type: 'warning' | 'error', title: string, list: string[]) => {
    const id = Date.now();
    setBulkNotifs(prev => [...prev, { id, type, title, list }]);
  };

  const removeBulkNotif = (id: number) => {
    setBulkNotifs(prev => prev.filter(n => n.id !== id));
  };

  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  // Tambahkan baris ini di bagian deklarasi state
  const [showDuplicateOnly, setShowDuplicateOnly] = useState(false);
  const [prefilledRfid, setPrefilledRfid] = useState("");

  const [cardConfig, setCardConfig] = useState<any>({
    title: "KARTU PELAJAR",
    subtitle: profile?.sekolah?.namaSekolah,
    accentColor: "#2563eb",
    titleColor: "#ffffff",    
    subtitleColor: "#ffffff", 
    schoolAddress: "Jl. Contoh No. 1, Kec. X, Kota Y",
    logoSchool: null,
    logoDinas: null,
    bgImage: null,
    visionMission: null, // ← tambahkan ini
    vmTitleColor: "#000000",   // ← warna judul VISI / MISI
    vmTextColor: "#1e293b",
    vmTitleFontSize: 7,
    vmVisionFontSize: 6,
    vmMissionFontSize: 5.5,
    bgOpacityFront: 0.40,
    bgOpacityBack: 0.40, 
    missionSpacing: 2.6,       
    missionBulletStyle: "number",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Tambahkan useEffect ini setelah deklarasi cardConfig
  useEffect(() => {
    if (profile?.user?.visionMission || profile?.sekolah?.namaSekolah) {
      setCardConfig((prev: any) => ({
        ...prev,
        subtitle: profile?.sekolah?.namaSekolah || prev.subtitle,
        visionMission: profile?.user?.visionMission || null,
      }));
    }
  }, [profile?.user?.visionMission, profile?.sekolah?.namaSekolah]);

  // --- GANTI DENGAN LODASH DEBOUNCE ---
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKey = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyTime > 50) buffer = "";
      lastKeyTime = now;

      if (e.key === "Enter" && buffer.length > 5) {
        const scanned = buffer.trim();
        toast.success(`RFID terbaca: ${scanned}`);

        if (modals.edit && selected?.id) {
          // Update selected state
          setSelected(prev => prev ? { ...prev, rfidUid: scanned } : null);
          toast.info("✅ RFID berhasil diupdate di form Edit", { duration: 1800 });
        } else {
          // Mode Tambah
          setSelected(null);
          setModals((prev: any) => ({ ...prev, add: true }));
          setTimeout(() => {
            setPrefilledRfid(scanned);
          }, 80);
        }

        buffer = "";
        return;
      }

      if (e.key.length === 1) buffer += e.key;
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modals.edit, selected?.id]);   // Gunakan selected?.id agar lebih stabil
  
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1); 
    }, 500),
    []
  );

  const handleBulkMarkStatus = async (status: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkMarking(true);
    try {
      const payload = selectedIds.map(id => {
        const student = students.find(s => s.id === id);
        return {
          studentId: id,
          schoolId,
          status,
          currentClass: student?.class,
          userRole: 'student'
        };
      });

      const res = await fetch(`${BASE_URL}/mark-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // backend sudah support array
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`${selectedIds.length} siswa ditandai ${status}`);
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ['students'] });
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Gagal bulk mark");
    } finally {
      setIsBulkMarking(false);
    }
  };

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
   queryKey: ['students', schoolId, page, limit, debouncedSearch, filterClass, filterBatch, showDuplicateOnly],
    queryFn: async () => {
      const params = new URLSearchParams({
        schoolId: schoolId.toString(),
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };

  useEffect(() => {
    if (!showShareMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.share-menu-wrapper')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

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

    // if (open) { // Hanya fetch saat modal terbuka
    //   fetchClasses();
    // }
    if (modals.add || modals.edit || showMoveClassMenu) {
      fetchClasses();
    }
  }, [modals.add, modals.edit, showMoveClassMenu, schoolId]);

  const handleDownloadTemplate = () => {
    const templateData = [
      { Nama: "Ahmad Fauzi", Gender: "Laki-laki", NIK: "3201010101010001", NISN: "0012345678", NIS: "2425001", TempatLahir: "Jakarta", TanggalLahir: "2008-05-12", Kelas: "10-RPL-1", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Siti Aminah", Gender: "Perempuan", NIK: "3201010101010002", NISN: "0012345679", NIS: "2425002", TempatLahir: "Bandung", TanggalLahir: "2008-08-20", Kelas: "10-RPL-1", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Budi Santoso", Gender: "Laki-laki", NIK: "3201010101010003", NISN: "0012345680", NIS: "2425003", TempatLahir: "Surabaya", TanggalLahir: "2007-12-05", Kelas: "11-TKJ-2", Angkatan: "2023", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Dewa Made", Gender: "Laki-laki", NIK: "3201010101010004", NISN: "0012345681", NIS: "2425004", TempatLahir: "Denpasar", TanggalLahir: "2008-01-15", Kelas: "10-RPL-2", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Putri Lestari", Gender: "Perempuan", NIK: "3201010101010005", NISN: "0012345682", NIS: "2425005", TempatLahir: "Medan", TanggalLahir: "2009-03-10", Kelas: "10-RPL-1", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Rizky Ramadhan", Gender: "Laki-laki", NIK: "3201010101010006", NISN: "0012345683", NIS: "2425006", TempatLahir: "Makassar", TanggalLahir: "2008-09-25", Kelas: "11-TKJ-1", Angkatan: "2023", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Maya Indah", Gender: "Perempuan", NIK: "3201010101010007", NISN: "0012345684", NIS: "2425007", TempatLahir: "Yogyakarta", TanggalLahir: "2008-07-07", Kelas: "10-RPL-2", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Andi Wijaya", Gender: "Laki-laki", NIK: "3201010101010008", NISN: "0012345685", NIS: "2425008", TempatLahir: "Semarang", TanggalLahir: "2007-11-30", Kelas: "12-RPL-1", Angkatan: "2022", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Larasati", Gender: "Perempuan", NIK: "3201010101010009", NISN: "0012345686", NIS: "2425009", TempatLahir: "Malang", TanggalLahir: "2008-04-14", Kelas: "10-TKJ-1", Angkatan: "2024", Email: "xxx@gmail.com", Password: 'sekolah123' },
      { Nama: "Farhan Hakim", Gender: "Laki-laki", NIK: "3201010101010100", NISN: "0012345687", NIS: "2425010", TempatLahir: "Palembang", TanggalLahir: "2008-02-28", Kelas: "11-RPL-1", Angkatan: "2023" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Siswa");
    XLSX.writeFile(wb, "Template_Siswa.xlsx");
  };

  const handleBulkChangeClass = async (newClass: string) => {
    setIsChangingClass(true);
    try {
      const body: any = { schoolId, newClass };

      if (selectedIds.length > 0) {
        // Mode: by checkbox
        body.studentIds = selectedIds;
      } else if (changeClassBatch) {
        // Mode: by batch
        body.batch = changeClassBatch;
      }

      const res = await fetch(`${BASE_URL}/class/bulk-update-class`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Gagal memindahkan kelas");

      toast.success(json.message);
      setChangeClassModal(false);
      setSelectedIds([]);
      setChangeClassBatch("");
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsChangingClass(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !schoolId) return;

  setIsProcessing2(true);
  setUploadProgress(0);

  // Wadah untuk akumulasi hasil dari semua batch
  const report = {
    berhasil: 0,
    dilewati: 0,
    gagal: 0,
    detail: {
      nisDuplikat: [] as any[],
      rfidDuplikat: [] as any[],
      gagal: [] as any[],
    }
  };

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const dataBinary = evt.target?.result;
      const wb = XLSX.read(dataBinary, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });

      if (rawData.length === 0) throw new Error("File Excel kosong.");

      const allStudents = rawData.map((row) => {
        let rawDate = row["TanggalLahir"] || "";
        let formattedDate = null;
        if (rawDate && rawDate !== "Invalid date") {
          const parts = String(rawDate).trim().split("-");
          if (parts.length === 3) {
            const p1 = parts[0], p2 = parts[1], p3 = parts[2];
            if (p1.length === 4) formattedDate = `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
            else if (p3.length === 4) formattedDate = `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`;
          }
        }
        return {
          name: row["Nama"] || "",
          gender: row["Gender"] || "",
          nik: row["NIK"]?.toString() || "",
          nisn: row["NISN"]?.toString() || "",
          nis: row["NIS"]?.toString() || "",
          birthPlace: row["TempatLahir"] || "",
          birthDate: formattedDate,
          class: row["Kelas"] || "",
          batch: row["Angkatan"] || "",
          email: row["Email"] || "",
          password: row["Password"] || "",
        };
      });

      const totalData = allStudents.length;
      const chunkSize = 50;

      for (let i = 0; i < totalData; i += chunkSize) {
        const chunk = allStudents.slice(i, i + chunkSize);
        
        const res = await fetch(`${BASE_URL}/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: chunk, schoolId }),
        });

        const json = await res.json();

        if (res.ok) {
          // 1. Akumulasi summary
          report.berhasil += json.summary.berhasil;
          report.dilewati += json.summary.dilewati;
          report.gagal += json.summary.gagal;

          // 2. Akumulasi detail (INI PENTING)
          // Walaupun berhasil 0, json.detail.nisDuplikat tetap ada isinya dari backend
          if (json.detail.nisDuplikat) report.detail.nisDuplikat.push(...json.detail.nisDuplikat);
          if (json.detail.rfidDuplikat) report.detail.rfidDuplikat.push(...json.detail.rfidDuplikat);
          if (json.detail.gagal) report.detail.gagal.push(...json.detail.gagal);
          
          setUploadProgress(Math.round(((i + chunk.length) / totalData) * 100));
        }
      }

      // TAMPILKAN NOTIFIKASI AKHIR
      toast.success(
        `Import selesai: ${report.berhasil} berhasil, ${report.dilewati} dilewati, ${report.gagal} gagal`,
        { duration: 6000 }
      );

      if (report.detail.nisDuplikat.length > 0) {
        addBulkNotif(
          'warning',
          `NIS Duplikat (${report.detail.nisDuplikat.length} siswa)`,
          report.detail.nisDuplikat.map((s: any) => `• ${s.name} — [NIS: ${s.nis}]`)
        );
      }

      if (report.detail.rfidDuplikat.length > 0) {
        addBulkNotif(
          'warning',
          `RFID Duplikat (${report.detail.rfidDuplikat.length} siswa)`,
          report.detail.rfidDuplikat.map((s: any) => `• ${s.name} — [RFID: ${s.rfidUid}]`)
        );
      }

      if (report.detail.gagal.length > 0) {
        addBulkNotif(
          'error',
          `Gagal Diproses (${report.detail.gagal.length} siswa)`,
          report.detail.gagal.map((s: any) => `• ${s.name} — ${s.reason}`)
        );
      }

      queryClient.invalidateQueries({ queryKey: ['students'] });

    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setTimeout(() => {
        setIsProcessing2(false);
        setUploadProgress(0);
        if (e.target) e.target.value = "";
      }, 1000);
    }
  };
  reader.readAsBinaryString(file);
};

// const handleMarkAbsence = async (student: Student, status: 'Izin' | 'Sakit' | 'Alpha') => {
//     if (!window.confirm(`Tandai ${student.name} sebagai ${status} hari ini?`)) return;

//     try {
//       const res = await fetch(`${BASE_URL}/mark-absence`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           studentId: student.id,
//           schoolId: schoolId,
//           status,
//           currentClass: student.class,
//           userRole: 'student'
//         })
//       });

//       const json = await res.json();

//       if (res.ok && json.success) {
//         toast.success(`${student.name} ditandai sebagai ${status} hari ini.`);
//         queryClient.invalidateQueries({ queryKey: ['students'] });
//       } else {
//         toast.error(json.message || "Gagal mencatat kehadiran");
//       }
//     } catch (err: any) {
//       toast.error("Gagal mencatat ketidakhadiran", {
//       });
//     }
//   };

const handleMarkAbsence = async (student: Student, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
  // Hapus window.confirm agar dropdown langsung eksekusi
  try {
    const res = await fetch(`${BASE_URL}/mark-absence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.id,
        schoolId,
        status,
        currentClass: student.class,
        userRole: 'student'
      })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      toast.success(`${student.name} → ${status}`);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } else {
      toast.error(json.message || "Gagal");
    }
  } catch {
    toast.error("Gagal mencatat kehadiran");
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
    setModals((p: any) => ({ ...p, designer: false }))
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

  const handleDeleteByBatch = async () => {
    if (!deleteBatch.trim()) {
      toast.error("Masukkan angkatan yang ingin dihapus");
      return;
    }

    setConfirmModal({
      open: true,
      title: `Hapus Angkatan ${deleteBatch}`,
      description: `Semua siswa angkatan ${deleteBatch} akan dihapus secara permanen dari database. Data kehadiran terkait juga akan ikut terhapus.`,
      confirmLabel: `Hapus Angkatan ${deleteBatch}`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${BASE_URL}/batch/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schoolId, batch: deleteBatch }),
          });
          const json = await res.json();
          if (res.ok) {
            toast.success(json.message, {
              duration: 5000,
            });
            setDeleteBatch("");
            setShowDeleteMenu(false);
            queryClient.invalidateQueries({ queryKey: ['students'] });
          } else {
            toast.error(json.message || "Gagal menghapus");
          }
        } catch (err: any) {
          toast.error(err.message);
        }
      }
    });
  };

  const handleDeleteAll = async () => {
    setConfirmModal({
      open: true,
      title: "Hapus Semua Siswa",
      description: "Seluruh data siswa di sekolah ini akan dihapus secara permanen. Semua data termasuk foto, QR code, dan riwayat kehadiran tidak dapat dipulihkan.",
      confirmLabel: "Hapus Semua Permanen",
      onConfirm: async () => {
        try {
          const res = await fetch(`${BASE_URL}/all/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schoolId }),
          });
          const json = await res.json();
          if (res.ok) {
            toast.success(json.message, {
              duration: 5000,
            });
            setShowDeleteMenu(false);
            queryClient.invalidateQueries({ queryKey: ['students'] });
          } else {
            toast.error(json.message || "Gagal menghapus");
          }
        } catch (err: any) {
          toast.error(err.message);
        }
      }
    });
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

    // Tambah helper function di StudentManager
    const handleMarkPresent = async (student: Student) => {
      try {
        const res = await fetch(`${BASE_URL}/mark-absence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.id,
            schoolId,
            status: 'Hadir',
            currentClass: student.class,
            userRole: 'student'
          })
        });
        const json = await res.json();
        if (json.success) {
          toast.success(`${student.name} ditandai Hadir`);
          queryClient.invalidateQueries({ queryKey: ['students'] });
        } else {
          toast.error(json.message);
        }
      } catch {
        toast.error("Gagal menandai kehadiran");
      }
    };

   const handleShare = async (via: 'wa' | 'email' | 'all') => {
      setShowShareMenu(false);
      setIsSharing(true);

      try {
        const date = moment().format('YYYY-MM-DD');
        const res = await fetch(
          `${BASE_URL}/share-rekap?schoolId=${schoolId}&date=${date}&via=${via}`
        );
        const json = await res.json();

        if (json.success) {
          toast.success(json.message);
          // Update kuota dari response
          if (json.rateLimit) setWaRateLimit(json.rateLimit);
        } else {
          toast.error(json.message || "Gagal mengirim rekap");
        }
      } catch (err) {
        toast.error("Gagal mengirim rekap. Cek koneksi internet.");
      } finally {
        setIsSharing(false);
      }
    };

const statusStyles: Record<string, string> = {
  Hadir: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  Izin: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  Sakit: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  Alpha: "bg-red-500/10 text-red-500 border border-red-500/20",
  "Belum Hadir": "bg-zinc-500/10 text-zinc-500 border border-zinc-500/10",
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
            <Download size={16}/>
          </button>
          <div className="relative share-menu-wrapper">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              disabled={isSharing}
              className="h-14 px-5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl flex items-center gap-2 hover:bg-green-500/20 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Dot indikator status WA */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                waStatus?.isReady ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <Send size={16} />
              {isSharing ? "Mengirim..." : ""}
            </button>

            {showShareMenu && !isSharing && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-[#0B1220] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
                
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    
                    {/* Badge WA status */}
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      waStatus?.isReady 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      WA {waStatus?.isReady ? 'ON' : 'OFF'}
                    </span>

                    {/* Kuota — selalu tampil di samping badge */}
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      !waRateLimit
                        ? ' text-zinc-500 '
                        : waRateLimit.remaining <= 10
                        ? ' text-red-400 '
                        : waRateLimit.remaining <= 20
                        ? ' text-amber-400 '
                        : ' text-blue-400 '
                    }`}>
                      {waRateLimit 
                        ? `${waRateLimit.remaining}/${waRateLimit.max} KUOTA`
                        : '0/50 — KUOTA'
                      }
                    </span>

                  </div>

                  {/* Progress bar */}
                  {waRateLimit && (
                    <div className="mt-2">
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            waRateLimit.remaining <= 10 ? 'bg-red-500' :
                            waRateLimit.remaining <= 20 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(waRateLimit.sent / waRateLimit.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu items — sama seperti sebelumnya */}
                <button
                  onClick={() => handleShare('wa')}
                  disabled={!waStatus?.isReady || (waRateLimit?.remaining ?? 1) <= 0}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Via WhatsApp</div>
                    <div className="text-[10px] text-zinc-500">Kepsek + Seluruh Wali Kelas</div>
                  </div>
                </button>

                <button
                  onClick={() => handleShare('email')}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Via Email</div>
                    <div className="text-[10px] text-zinc-500">Kepsek + Seluruh Wali Kelas</div>
                  </div>
                </button>

                <div className="h-px bg-white/5 mx-4" />

                <button
                  onClick={() => handleShare('all')}
                  disabled={!waStatus?.isReady || (waRateLimit?.remaining ?? 1) <= 0}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Share2 size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-400">Kirim Semua</div>
                    <div className="text-[10px] text-zinc-500">WhatsApp + Email sekaligus</div>
                  </div>
                </button>

                <div className="h-px bg-white/5 mx-4" />

                <button
                  onClick={() => { setShowShareMenu(false); setShowWAStatus(true); }}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-500/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-300">Setup WhatsApp</div>
                    <div className="text-[10px] text-zinc-500">
                      {waStatus?.isReady ? 'WA terhubung — klik untuk kelola' : 'Scan QR untuk hubungkan WA'}
                    </div>
                  </div>
                </button>

              </div>
            )}
          </div>
          <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <FileSpreadsheet size={16}/>
            <input type="file" hidden accept=".xlsx, .xls" onChange={handleBulkUpload} />
          </label>
          <button onClick={() => setModals({ ...modals, designer: true })} className="h-14 px-5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center gap-2 hover:bg-cyan-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <IdCard size={16}/> 
            {/* Kartu */}
          </button>
          {/* Tombol Danger Delete */}
          <div className="relative delete-menu-wrapper">
            <button
              onClick={() => setShowDeleteMenu(prev => !prev)}
              className="h-14 px-5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
            >
              <Trash2 size={16}/> 
              {/* Hapus */}
            </button>

            {showDeleteMenu && (
              <div className="absolute right-0 top-16 w-72 bg-[#0B1220] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 space-y-4">
                <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">⚠️ Zona Berbahaya</p>

                {/* Delete by batch */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Hapus per Angkatan</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: 2024"
                      value={deleteBatch}
                      onChange={e => setDeleteBatch(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-red-500"
                    />
                    <button
                      onClick={handleDeleteByBatch}
                      className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-black hover:bg-red-600/40 transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Delete all */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Hapus Semua Siswa</label>
                  <button
                    onClick={handleDeleteAll}
                    className="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                  >
                    🗑️ Hapus Semua Permanen
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteMenu(false)}
                  className="flex w-max mx-auto items-center gap-2 py-2 text-white text-[12px] hover:text-zinc-400 transition-all"
                >
                  {/* <ArrowLeft size={13} /> */}
                  <p>
                    Batal
                  </p>
                </button>
              </div>
            )}
          </div>
            {
              selectedIds.length === 0 && (
                <div className="relative move-class-menu-wrapper">
                      <button
                        onClick={() => {
                          setShowMoveClassMenu(prev => !prev);
                          // Fetch classList jika belum ada
                          if (classList.length === 0 && schoolId) {
                            fetch(`https://be-school.kiraproject.id/kelas?schoolId=${schoolId}`)
                              .then(r => r.json())
                              .then(j => { if (j.success) setClassList(j.data); });
                          }
                        }}
                        className="h-14 px-5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center gap-2 hover:bg-blue-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
                      >
                        <ArrowLeftRight size={16}/> 
                      </button>
                  

                  {showMoveClassMenu && (
                    <div className="absolute right-0 top-16 w-72 bg-[#0B1220] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 space-y-4">
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                        🔀 Pindah Kelas
                      </p>

                      {/* Input Angkatan */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Angkatan</label>
                        <input
                          type="text"
                          placeholder="Contoh: 2024"
                          value={moveClassBatch}
                          onChange={e => setMoveClassBatch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Select Kelas Tujuan */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Kelas Tujuan</label>
                        <div className="relative">
                          <select
                            value={moveClassTarget}
                            onChange={e => setMoveClassTarget(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-500 appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#0B1220]">-- Pilih Kelas --</option>
                            {classList.map((c: any) => (
                              <option key={c.id} value={c.className} className="bg-[#0B1220]">{c.className}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
                        </div>
                      </div>

                      <div className="h-px bg-white/10" />
                    
                      {/* Tombol Eksekusi */}
                      <button
                        onClick={async () => {
                          if (!moveClassBatch.trim()) {
                            toast.warning("Isi angkatan terlebih dahulu");
                            return;
                          }
                          if (!moveClassTarget) {
                            toast.warning("Pilih kelas tujuan terlebih dahulu");
                            return;
                          }

                          setConfirmModal({
                            open: true,
                            title: `Pindah Angkatan ${moveClassBatch}`,
                            description: `Semua siswa angkatan ${moveClassBatch} akan dipindahkan ke kelas ${moveClassTarget}.`,
                            confirmLabel: `Pindahkan ke ${moveClassTarget}`,
                            onConfirm: async () => {
                              try {
                                const res = await fetch(`${BASE_URL}/class/bulk-update-class`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ 
                                    schoolId, 
                                    batch: moveClassBatch, 
                                    newClass: moveClassTarget 
                                  }),
                                });
                                const json = await res.json();
                                if (res.ok) {
                                  toast.success(json.message);
                                  setMoveClassBatch("");
                                  setMoveClassTarget("");
                                  setShowMoveClassMenu(false);
                                  queryClient.invalidateQueries({ queryKey: ['students'] });
                                } else {
                                  toast.error(json.message || "Gagal memindahkan kelas");
                                }
                              } catch (err: any) {
                                toast.error(err.message);
                              }
                            }
                          });
                        }}
                        className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                      >
                        🔀 Pindahkan Kelas
                      </button>

                      <button
                        onClick={() => setShowMoveClassMenu(false)}
                        className="flex w-max mx-auto items-center gap-2 py-2 text-white text-[12px] hover:text-zinc-400 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          {/* Letakkan setelah tombol Luluskan */}
          {selectedIds.length > 0 && (
            <button 
              onClick={() => {
                setChangeClassBatch(""); // mode by checkbox
                setChangeClassModal(true);
              }}
              className="h-14 px-6 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center gap-2 hover:bg-blue-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
            >
              <ArrowLeftRight size={16}/> Pindah Kelas ({selectedIds.length})
            </button>
          )}
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setGraduationModal(true)} 
              className="h-14 px-6 bg-amber-500 text-black rounded-2xl flex items-center gap-2 hover:bg-amber-400 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-amber-500/20"
            >
              <GraduationCap size={18}/> Lulus ({selectedIds.length})
            </button>
          )}

          {/* Bulk Action Bar - muncul saat selectedIds.length > 0 */}
          {selectedIds.length > 0 && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-wrap items-center gap-3">
              <span className="text-blue-400 font-black text-xs uppercase tracking-widest">
                {selectedIds.length} siswa dipilih →
              </span>
              <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Tandai sebagai:</span>
              {['Hadir', 'Izin', 'Sakit', 'Alpha'].map(status => {
                const colors: Record<string, string> = {
                  Hadir:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/40',
                  Izin:   'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/40',
                  Sakit:  'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/40',
                  Alpha:  'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/40',
                };
                return (
                  <button
                    key={status}
                    disabled={isBulkMarking}
                    onClick={() => handleBulkMarkStatus(status)}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 ${colors[status]}`}
                  >
                    {isBulkMarking ? '...' : status}
                  </button>
                );
              })}
              <button
                onClick={() => setSelectedIds([])}
                className="ml-auto text-zinc-500 hover:text-white text-xs font-bold"
              >
                Batal Pilih
              </button>
            </div>
          )}

          {
            selectedIds.length === 0 && (
              <button onClick={() => setModals({ ...modals, add: true })} className="h-14 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
                <PlusCircle size={16}/>
                Tambah
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
            placeholder="Cari nama atau NIS siswa..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
          />
        </div>

        <button 
          onClick={handleRefresh} 
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
                      <div className="font-bold text-white tracking-tight truncate" title={s.name}>{s.name}</div>
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
                {/* <td className="py-6">
                   <span className={`px-4 py-1.5 w-max flex rounded-full text-[8px] font-black uppercase tracking-widest ${statusStyles[s.statusKehadiran] || statusStyles["Belum Hadir"]}`}>
                      {s.statusKehadiran || "Belum Hadir"}
                   </span>
                </td> */}

                <td className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1.5 w-max flex rounded-full text-[8px] font-black uppercase tracking-widest ${statusStyles[s.statusKehadiran] || statusStyles["Belum Hadir"]}`}>
                      {s.statusKehadiran || "Belum Hadir"}
                    </span>
                    {/* Tombol Hadir hanya muncul kalau belum absen */}
                    {s.statusKehadiran === 'Belum Hadir' && (
                      <button
                        onClick={() => handleMarkPresent(s)}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase hover:bg-emerald-500/30 transition-all w-max"
                      >
                        ✓ Hadir
                      </button>
                    )}
                  </div>
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
                  <StatusDropdown student={s} onMark={handleMarkAbsence} />
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
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-white/5 border border-white/10 w-max pr-7 pl-3 h-10 rounded-xl text-[10px] font-black text-white outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px' }}
            >
              <option className="text-black" value={10}>10 Baris</option>
              <option className="text-black" value={20}>20 Baris</option>
              <option className="text-black" value={50}>50 Baris</option>
              <option className="text-black" value={100}>100 Baris</option>
              <option className="text-black" value={250}>250 Baris</option>
              <option className="text-black" value={500}>500 Baris</option>
              <option className="text-black" value={1000}>1000 Baris</option>
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
              <span className="text-zinc-500">Total {totalItems || students?.length || 0} Siswa</span>
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

      <ConfirmDangerModal
        open={confirmModal.open}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
      />

      {isProcessing2 && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white/90 border border-white shadow-[0_20px_50px_rgba(30,64,175,0.3)] p-8 rounded-3xl w-full max-w-md text-center">
            
            {/* Modern Circular Progress */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle 
                  className="text-slate-400 stroke-current" 
                  strokeWidth="8" 
                  cx="50" cy="50" r="40" fill="transparent"
                ></circle>
                {/* Progress Circle */}
                <circle 
                  className="text-blue-600 stroke-current transition-all duration-500 ease-out" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  cx="50" cy="50" r="40" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                  transform="rotate(-90 50 50)"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xl text-slate-800">
                {uploadProgress}%
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Mensinkronisasi Data
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Jangan tutup browser. Sedang mengunggah data siswa secara real-time.
            </p>

            {/* Horizontal Progress Bar with Shimmer */}
            <div className="relative w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 relative"
                style={{ width: `${uploadProgress}%` }}
              >
                {/* Efek Kilau Animasi (Pure Tailwind) */}
                <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            <div className="flex justify-center items-center mt-3">
              <span className="text-[10px] bg-transparent text-blue-700 px-[2px] py-0.5 rounded-full font-bold uppercase">
                Proses: {uploadProgress}%
              </span>
              {/* <span className="text-[10px] text-slate-400 font-medium italic">
                KiraProject Engine
              </span> */}
            </div>
          </div>
        </div>
      )}

      {/* WA Status Drawer */}
      <AnimatePresence>
        {showWAStatus && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]"
              onClick={() => setShowWAStatus(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B1220] border-l border-white/10 z-[100001] p-8 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    WA Gateway
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    Koneksi WhatsApp untuk kirim rekap
                  </p>
                </div>
                <button
                  onClick={() => setShowWAStatus(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Status Card */}
              <div className={`rounded-2xl border p-5 mb-6 flex items-center gap-4 ${
                waStatus?.isReady
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  waStatus?.isReady ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <MessageCircle
                    size={24}
                    className={waStatus?.isReady ? 'text-green-400' : 'text-red-400'}
                  />
                </div>
                <div>
                  <div className={`font-black uppercase text-sm tracking-tight ${
                    waStatus?.isReady ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {waStatus?.isReady ? '✅ Terhubung' : '❌ Tidak Aktif'}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {waStatus?.isReady
                      ? 'WhatsApp siap kirim pesan otomatis'
                      : waStatus?.hasQR
                        ? 'Scan QR di bawah untuk login'
                        : 'Menunggu QR dari server...'
                    }
                  </div>
                </div>
                {/* Dot animasi */}
                {waStatus?.isReady && (
                  <div className="ml-auto w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                )}
              </div>

              {/* QR Code Section */}
              {!waStatus?.isReady && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                  {waQrImage ? (
                    <>
                      <p className="text-sm text-zinc-400 mb-4">
                        Scan QR ini dengan WhatsApp di HP
                      </p>
                      <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-4">
                        <img src={waQrImage} alt="WA QR Code" className="w-48 h-48" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-zinc-500">
                          1. Buka WhatsApp di HP
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          2. Ketuk ⋮ → <strong className="text-white">Linked Devices</strong>
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          3. Ketuk <strong className="text-white">Link a Device</strong>
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          4. Scan QR di atas
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        QR otomatis refresh setiap beberapa detik
                      </div>
                    </>
                  ) : (
                    <div className="py-10 text-zinc-600">
                      <div className="w-12 h-12 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm">Menunggu QR dari server...</p>
                      <p className="text-xs mt-1">Pastikan server sudah berjalan</p>
                    </div>
                  )}
                </div>
              )}

              {/* Info jika sudah terhubung */}
              {waStatus?.isReady && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-black uppercase text-zinc-500 tracking-widest">Info Koneksi</p>
                  <p className="text-sm text-zinc-300">
                    WhatsApp sudah terhubung. Kamu bisa langsung kirim rekap kehadiran via tombol <strong className="text-green-400">Share Rekap</strong>.
                  </p>
                  <div className="h-px bg-white/5" />
                  <p className="text-[11px] text-zinc-600">
                    ⚠️ Jangan logout dari WA di HP yang dipakai, karena akan memutus koneksi ini.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Side Modals */}
      <StudentModal 
          classList={classList || []} 
          open={modals.add || modals.edit} 
          prefilledRfid={prefilledRfid}
          onClose={() => { setModals({...modals, add:false, edit:false}); setSelected(null); setPrefilledRfid("") }} 
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

      {/* Bulk Import Notifications — bottom right, persistent */}
      {
        bulkNotifs.length > 0 && (
          <div className="fixed bottom-12 right-6 z-[99999] h-[40vh] flex flex-col gap-3 max-w-sm w-full">
            {bulkNotifs.map(notif => (
              <div
                key={notif.id}
                className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                  notif.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={14}
                      className={notif.type === 'warning' ? 'text-amber-400' : 'text-red-400'}
                    />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      notif.type === 'warning' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {notif.title}
                    </span>
                  </div>
                  <button
                    onClick={() => removeBulkNotif(notif.id)}
                    className="active:scale-[0.98] hover:text-white/60 text-white hover:text-white transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {notif.list.map((item, i) => (
                    <div key={i} className="text-[11px] text-zinc-300 font-medium">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }

      <BulkChangeClassModal
        open={changeClassModal}
        onClose={() => {
          setChangeClassModal(false);
          setChangeClassBatch("");
        }}
        classList={classList}
        selectedCount={selectedIds.length}
        selectedBatch={changeClassBatch}
        onSubmit={handleBulkChangeClass}
        isProcessing={isChangingClass}
      />
    </div>
  );
}