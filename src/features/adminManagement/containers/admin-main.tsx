import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import {
  CheckCircle2,
  Edit,
  FileDown,
  FileUp,
  Mail,
  Plus,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx'; // Import library xlsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

const BASE_URL = "https://be-school.kiraproject.id/admin";

// --- COMPONENT: MODAL ADD/EDIT ---
const AdminModal = ({ queryClient, open, onClose, title, initialData, onSubmit }: any) => {
  const [form, setForm] = useState({
    adminName: "",
    email: "",
    password: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        adminName: initialData?.adminName || "",
        email: initialData?.email || "",
        password: "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // LOGIKA PERBAIKAN: Jangan kirim password jika sedang EDIT dan input kosong
      const payload: any = {
        adminName: form.adminName,
        email: form.email,
        role: 'admin_staff'
      };

      // Hanya masukkan password ke payload jika:
      // 1. Ini adalah mode "Tambah Baru"
      // 2. Atau jika user mengisi field password di mode "Edit"
      if (!initialData || (initialData && form.password)) {
        payload.password = form.password;
      }

      const res = await fetch(
        initialData ? `${BASE_URL}/${initialData.id}` : `${BASE_URL}`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload) // Gunakan payload hasil filter
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan data");
      
      await onSubmit();
      queryClient.invalidateQueries({ queryKey: ['school-admins'] });  
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto"
      >
        <div className="border-b border-white/8 flex justify-between pb-8 mb-8 items-center">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase">{title}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Akses Staff Administrator Baru
            </p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Nama Lengkap</label>
              <input value={form.adminName} onChange={e => setForm({...form, adminName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Email Login</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            {!initialData && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Password Akun</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Role Default</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white/40 font-bold text-sm uppercase">
                Staff Administrator
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} 
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="animate-spin" size={18}/> : <CheckCircle2 size={18} />}
            Simpan Akun
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---
export default function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modals, setModals] = useState({ add: false, edit: false, password: false }); // Tambah password: false
  const [selected, setSelected] = useState<any | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const currentUser = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superAdmin';

  const debouncedSetSearch = useMemo(() => debounce((v: string) => setDebouncedSearch(v), 500), []);

  const { data: adminData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['school-admins', debouncedSearch],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}?name=${debouncedSearch}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      return json.data || [];
    }
  });

  // --- LOGIC: DOWNLOAD TEMPLATE ---
  const handleDownloadTemplate = () => {
      const fileName = 'Template_Import_Admin.xls'; 
      
      // Format XML Spreadsheet 2003 yang rapi
      const xmlTemplate = `<?xml version="1.0"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:html="http://www.w3.org/TR/REC-html40">
      <Worksheet ss:Name="Admin Template">
        <Table>
        <Row ss:FontWeight="Bold">
          <Cell><Data ss:Type="String">adminName</Data></Cell>
          <Cell><Data ss:Type="String">email</Data></Cell>
          <Cell><Data ss:Type="String">password</Data></Cell>
        </Row>
        <Row>
          <Cell><Data ss:Type="String">John Doe</Data></Cell>
          <Cell><Data ss:Type="String">john@school.id</Data></Cell>
          <Cell><Data ss:Type="String">Password123</Data></Cell>
        </Row>
        <Row>
          <Cell><Data ss:Type="String">Jane Staff</Data></Cell>
          <Cell><Data ss:Type="String">jane@school.id</Data></Cell>
          <Cell><Data ss:Type="String">Password123</Data></Cell>
        </Row>
        </Table>
      </Worksheet>
      </Workbook>`;

      const blob = new Blob([xmlTemplate], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  };

  // --- LOGIC: IMPORT FILE ---
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Mengubah isi excel menjadi JSON array
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          throw new Error("File Excel kosong");
        }

        // Kirim ke backend (Pastikan backend punya endpoint /bulk atau logic handle array)
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/import`, { // Kita tembak ke endpoint bulk
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ admins: jsonData }) // Kirim sebagai JSON murni
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal import data");

        alert(`Berhasil mengimport ${jsonData.length} data admin!`);
        queryClient.invalidateQueries({ queryKey: ['school-admins'] });
      } catch (err: any) {
        alert("Error parsing Excel: " + err.message);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

const ChangePasswordModal = ({ open, onClose, adminData }: any) => {
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/${adminData.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ password }) // Hanya kirim password baru
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal mengubah password");
        
        alert("Password berhasil diperbarui!");
        onClose();
        setPassword("");
      } catch (err: any) {
        alert(err.message);
      } finally {
        setSaving(false);
      }
    };

    if (!open) return null;

   return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP: Sekarang berfungsi sebagai container juga */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000] flex items-center justify-center p-4" // Tambahkan Flexbox di sini
            onClick={onClose}
          >
            {/* MODAL: Hapus koordinat fixed, biarkan Flexbox yang mengatur */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Supaya klik di dalam modal tidak men-close
              className="w-full max-w-md bg-[#0B1220] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Reset Password</h3>
                <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
              </div>

              <p className="text-zinc-400 text-sm mb-6">
                Mengubah password untuk admin: <span className="text-blue-400 font-bold">{adminData?.adminName}</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="Masukkan Password Baru..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                  required
                  minLength={6}
                />
                <button type="submit" disabled={saving}
                  className="w-full py-4 bg-white text-black hover:bg-blue-500 hover:text-white rounded-2xl font-black uppercase transition-all flex items-center justify-center gap-2">
                  {saving ? <RefreshCw className="animate-spin" size={18}/> : <Lock size={18} />}
                  Update Password
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  };

  return (
    <div className="min-h-screen pb-8 text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
            <ShieldCheck size={14} /> Security & Permissions
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Kelola <span className="text-blue-600">Admin</span></h1>
          <p className="text-zinc-500 text-sm">Manajemen akun staff administrator sekolah</p>
        </div>

        {isSuperAdmin && (
          <div className="flex flex-wrap gap-3">
            {/* Tombol Template */}
            <button onClick={handleDownloadTemplate} 
              className="h-14 px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest border border-white/10">
              <FileDown size={16}/> Template
            </button>

            {/* Tombol Import */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportFile} 
              accept=".xls,.xlsx" // Ubah dari .csv ke format excel
              className="hidden" 
            />
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting}
              className="h-14 px-6 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest border border-emerald-500/20">
              {isImporting ? <RefreshCw className="animate-spin" size={16}/> : <FileUp size={16}/>} 
              {isImporting ? "Importing..." : "Import CSV"}
            </button>

            {/* Tombol Tambah */}
            <button onClick={() => setModals({ ...modals, add: true })} 
              className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30">
              <Plus size={16}/> Tambah Admin
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input type="text" placeholder="Cari nama atau email..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); debouncedSetSearch(e.target.value); }}
            className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" />
        </div>
        <button onClick={() => refetch()} className="px-6 bg-white/5 border border-white/10 rounded-2xl">
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 bg-white/[0.03]">
            <tr>
              <th className="p-6">Administrator</th>
              <th className="py-6">Email</th>
              <th className="py-6">Role</th>
              <th className="py-6">Status</th>
              {isSuperAdmin && <th className="py-6 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={5} className="py-20 text-center text-zinc-600 uppercase tracking-widest">Memuat data...</td></tr>
            ) : adminData.map((adm: any) => (
              <tr key={adm.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="py-6 pl-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <User className="text-blue-500" size={18}/>
                    </div>
                    <span className="font-bold text-white tracking-tight">{adm.adminName}</span>
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs italic"><Mail size={12} /> {adm.email}</div>
                </td>
                <td className="py-6 text-[10px] font-black uppercase tracking-widest text-blue-400">{adm.role}</td>
                <td className="py-6">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Active</span>
                   </div>
                </td>
                {isSuperAdmin && (
                  <td className="py-6 pr-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setSelected(adm); setModals({...modals, edit: true}); }} className="p-2.5 bg-yellow-700/30 hover:bg-yellow-700/50 rounded-xl text-yellow-300 hover:text-yellow-400">
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => { setSelected(adm); setModals({...modals, password: true}); }} 
                        className="p-2.5 bg-blue-700/30 hover:bg-blue-700/50 rounded-xl text-blue-300 hover:text-blue-400"
                        title="Ganti Password"
                      >
                        <Lock size={16}/>
                      </button>
                      <button onClick={async () => {
                         if(confirm('Hapus akses admin ini?')) {
                            const token = localStorage.getItem('token');
                            await fetch(`${BASE_URL}/${adm.id}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
                            queryClient.invalidateQueries({ queryKey: ['school-admins'] });
                         }
                      }} className="p-2.5 bg-red-700/30 hover:bg-red-700/50 rounded-xl text-red-300 hover:text-red-400">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChangePasswordModal 
        open={modals.password}
        adminData={selected}
        onClose={() => { setModals({...modals, password: false}); setSelected(null); }}
      />

      {/* Modal Render */}
      {(modals.add || modals.edit) && (
        <AdminModal 
          open={true}
          queryClient={queryClient}
          initialData={selected}
          title={selected ? "Update Admin" : "Tambah Admin"} 
          onClose={() => { setModals({add:false, edit:false, password: false}); setSelected(null); }}
          onSubmit={() => refetch()}
        />
      )}
    </div>
  );
}