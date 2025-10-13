import React, { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, FileText, Globe, Settings, X, Trash2, Edit, Eye } from "lucide-react";

/****************************
 * THEME — Dark Emerald (selaras UI contoh)
 ****************************/
const THEME = {
  primary: "#065F46",
  primaryText: "#F9FAFB",
  accent: "#10B981",
  bg: "#0B1220",
  surface: "#111827",
  surfaceText: "#E5E7EB",
  subtle: "#1F2937",
  border: "#374151",
  pill: "#059669",
  pillWarn: "#F59E0B",
  pillErr: "#EF4444",
};

/****************************
 * API Configuration
 ****************************/
const BASE_URL = "https://dev.kiraproject.id/api";

/****************************
 * Helpers UI
 ****************************/
const StatusPill = ({ value }) => {
  const v = String(value || "").toLowerCase();
  let bg = THEME.pill, text = "#052e26", label = value || "N/A";
  if (v.includes("diproses") || v.includes("aktif")) { bg = THEME.pillWarn; text = "#1f1503"; }
  if (v.includes("ditolak") || v.includes("nonaktif")) { bg = THEME.pillErr; text = "#2b0b0b"; }
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs" style={{ background: bg, color: text }}>{label}</span>
  );
};

/****************************
 * Sidebar
 ****************************/
const SidebarItem = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 h-[38px] text-sm rounded-lg flex items-center gap-2 group ${active
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
            : "bg-white/5 text-white/90 border border-white/20"}`}
  >
    <span className={`flex-1 ${active ? 'text-emerald-300' : ''}`}>{label}</span>
    {typeof count === 'number' && (<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: active ? "#064e3b" : THEME.subtle, color: active ? "#D1FAE5" : "#9CA3AF" }}>{count}</span>)}
  </button>
);

const AdminSidebar = ({ active, setActive, counts }) => {
  const items = [
    { k: "overview", label: "Overview", icon: <LayoutDashboard size={16}/> },
    { k: "internal", label: "Layanan Internal", icon: <FileText size={16}/>, count: counts.internal },
    { k: "public", label: "Layanan Publik", icon: <Globe size={16}/>, count: counts.public },
    { k: "settings", label: "Pengaturan", icon: <Settings size={16}/> },
  ];
  return (
    <aside className="w-60 border-r border-white/20 space-y-2" style={{ borderColor: THEME.border }}>
      <nav className="pr-4 space-y-2">
        {items.map(it => (
          <SidebarItem key={it.k} active={active === it.k} onClick={() => setActive(it.k)} icon={it.icon} label={it.label} count={it.count} />
        ))}
      </nav>
    </aside>
  );
};

/****************************
 * Table helper
 ****************************/
const Table = ({ columns, data, renderActions }) => (
  <div className="overflow-auto border rounded-xl" style={{ borderColor: THEME.border }}>
    <table className="min-w-full text-sm">
      <thead style={{ background: THEME.subtle }}>
        <tr>
          {columns.map(c => (<th key={c.key} className="px-3 py-2 text-left" style={{ color: THEME.surfaceText }}>{c.label}</th>))}
          {renderActions && <th className="px-3 py-2 text-left" style={{ color: THEME.surfaceText }}>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? <tr><td className="px-3 py-4 text-center" colSpan={columns.length+(renderActions?1:0)} style={{ color: THEME.surfaceText }}>Tidak ada data</td></tr> :
          data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t" style={{ borderColor: THEME.subtle }}>
              {columns.map(c => (<td key={c.key} className="px-3 py-2" style={{ color: THEME.surfaceText }}>{c.key==='status'?<StatusPill value={row[c.key]}/>:row[c.key] || "N/A"}</td>))}
              {renderActions && <td className="px-3 py-2">{renderActions(row, idx)}</td>}
            </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/****************************
 * Modal Form CRUD
 ****************************/
const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-teal-800 rounded-xl w-full max-w-lg p-6 relative">
        <button className="absolute top-3 right-3" onClick={onClose}><X/></button>
        <h2 className="text-lg text-white font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-teal-800 rounded-xl w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-3" onClick={onClose}><X/></button>
        <h2 className="text-lg text-white font-semibold mb-4">{title}</h2>
        <p className="text-white mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm" onClick={onClose}>Batal</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm" onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ open, onClose, data, columns }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-teal-800 rounded-xl w-full max-w-lg p-6 relative">
        <button className="absolute top-3 right-3" onClick={onClose}><X/></button>
        <h2 className="text-lg text-white font-semibold mb-4">Detail Layanan</h2>
        <div className="space-y-3">
          {columns.map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium mb-1 text-gray-300">{c.label}</label>
              <p className="w-full bg-white/20 px-2 py-1 rounded-md text-white">
                {c.key === 'status' ? <StatusPill value={data[c.key]} /> : (data[c.key] || "N/A")}
              </p>
            </div>
          ))}
          {/* <div>
            <label className="text-sm font-medium mb-1 text-gray-300">Link/URL</label>
            <p className="w-full bg-white/20 px-2 py-1 rounded-md text-white">{data.link || data.url || "N/A"}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

/****************************
 * Internal Layanan CRUD
 ****************************/
/****************************
 * Internal Layanan CRUD
 ****************************/
const AdminInternal = ({ data, onAdd, onUpdate, onDelete }) => {
  const columns = [
    { key: "tanggal", label: "Tanggal" },
    { key: "title", label: "Layanan" }, // Added back title
    { key: "description", label: "Deskripsi" }, // Added back description
    { key: "status", label: "Status" },
  ];
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", tanggal: "", status: "aktif", link: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(item =>
    item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setAddModalOpen(false);
    setForm({ title: "", description: "", tanggal: "", status: "aktif", link: "" });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...form, id: selectedItem.id });
    setEditModalOpen(false);
    setForm({ title: "", description: "", tanggal: "", status: "aktif", link: "" });
  };

  const openEditModal = (item) => {
    setForm({
      title: item.title || "",
      description: item.description || "",
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : "",
      status: item.status || "aktif",
      link: item.link || "",
    });
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const openConfirmDelete = (item) => {
    setSelectedItem(item);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    onDelete(selectedItem.id);
    setConfirmDeleteOpen(false);
  };

  const actions = (row) => (
    <div className="flex gap-2">
      <button className="p-1 border rounded" onClick={() => openDetailModal(row)}><Eye size={16} /></button>
      <button className="p-1 border rounded" onClick={() => openEditModal(row)}><Edit size={16} /></button>
      <button className="p-1 border rounded" onClick={() => openConfirmDelete(row)}><Trash2 size={16} /></button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {/* <input
          type="text"
          placeholder="Search by Layanan..."
          className="px-3 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-md text-emerald-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <button className="px-3 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-md text-emerald-300" onClick={() => setAddModalOpen(true)}>+ Tambah</button>
      </div>
      <Table columns={columns} data={data} renderActions={actions} />
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Tambah Layanan Internal">
        <form className="space-y-3" onSubmit={handleAddSubmit}>
          {columns.map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium mb-1">{c.label}</label>
              {c.key === "tanggal" ? (
                <input
                  type="date"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form.tanggal}
                  onChange={e => setForm({ ...form, tanggal: e.target.value })}
                />
              ) : c.key === "status" ? (
                <select
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="diproses">Diproses</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form[c.key]}
                  onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1">Link</label>
            <input
              type="text"
              className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm">Simpan</button>
          </div>
        </form>
      </Modal>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Layanan Internal">
        <form className="space-y-3" onSubmit={handleEditSubmit}>
          {columns.map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium mb-1">{c.label}</label>
              {c.key === "tanggal" ? (
                <input
                  type="date"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form.tanggal}
                  onChange={e => setForm({ ...form, tanggal: e.target.value })}
                />
              ) : c.key === "status" ? (
                <select
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="diproses">Diproses</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form[c.key]}
                  onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1">Link</label>
            <input
              type="text"
              className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm">Update</button>
          </div>
        </form>
      </Modal>
      <DetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} data={selectedItem || {}} columns={columns} />
      <ConfirmModal 
        open={confirmDeleteOpen} 
        onClose={() => setConfirmDeleteOpen(false)} 
        onConfirm={confirmDelete} 
        title="Konfirmasi Hapus" 
        message="Apakah Anda yakin ingin menghapus layanan ini?" 
      />
    </div>
  );
};

/****************************
 * Publik Layanan CRUD
 ****************************/
const AdminPublic = ({ data, onAdd, onDelete }) => {
  const columns = [
    { key: "jenis", label: "Jenis" },
    { key: "name", label: "Nama" },
    { key: "waktu", label: "Waktu" },
    { key: "lokasi", label: "Lokasi" },
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ jenis: "", name: "", waktu: "", lokasi: "", url: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(item => 
    item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setModalOpen(false);
    setForm({ jenis: "", name: "", waktu: "", lokasi: "", url: "" });
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const openConfirmDelete = (item) => {
    setSelectedItem(item);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    onDelete(selectedItem.id);
    setConfirmDeleteOpen(false);
  };

  const actions = (row) => (
    <div className="flex gap-2">
      <button className="p-1 border rounded" onClick={() => openDetailModal(row)}><Eye size={16} /></button>
      <button className="p-1 border rounded" onClick={() => openConfirmDelete(row)}><Trash2 size={16} /></button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search by Nama..."
          className="px-3 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-md text-emerald-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-3 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-md text-emerald-300" onClick={() => setModalOpen(true)}>+ Tambah</button>
      </div> */}
      <Table columns={columns} data={filteredData} renderActions={actions} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Layanan Publik">
        <form className="space-y-3" onSubmit={handleSubmit}>
          {columns.map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium mb-1">{c.label}</label>
              {c.key === "waktu" ? (
                <input
                  type="datetime-local"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form.waktu}
                  onChange={e => setForm({ ...form, waktu: e.target.value })}
                />
              ) : (
                <input
                  type="text"
                  className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
                  value={form[c.key]}
                  onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              className="w-full border bg-white/20 border-white/20 mt-1 text-white px-2 py-1 rounded-md"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm">Simpan</button>
          </div>
        </form>
      </Modal>
      <DetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} data={selectedItem || {}} columns={columns} />
      <ConfirmModal 
        open={confirmDeleteOpen} 
        onClose={() => setConfirmDeleteOpen(false)} 
        onConfirm={confirmDelete} 
        title="Konfirmasi Hapus" 
        message="Apakah Anda yakin ingin menghapus layanan ini?" 
      />
    </div>
  );
};

/****************************
 * Overview
 ****************************/
const Overview = ({ data }) => (
  <div className="grid md:grid-cols-3 gap-4">
    {[
      { k: "Total Layanan", v: data?.totalInternal ?? 0 },
      { k: "Aktif", v: data?.byStatus?.aktif ?? 0 },
      { k: "Nonaktif", v: data?.byStatus?.nonaktif ?? 0 },
    ].map(x => (
      <div key={x.k} className="rounded-xl p-4 border" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="text-sm" style={{ color: THEME.surfaceText }}>{x.k}</div>
        <div className="text-2xl font-bold" style={{ color: THEME.accent }}>{x.v}</div>
      </div>
    ))}
  </div>
);

/****************************
 * Dashboard Wrapper
 ****************************/
export function LayananMain() {
  const [active, setActive] = useState("overview");
  const [apiData, setApiData] = useState({ internal: [], public: [], overview: { totalInternal: 0, byStatus: { aktif: 0, nonaktif: 0 } } });
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/layanan`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('response', data)
      setApiData({
        internal: Array.isArray(data.internal) ? data.internal.map(item => ({
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          tanggal: item.tanggal || "",
          status: item.status || "aktif",
          link: item.link || "",
        })) : [],
        public: Array.isArray(data.public) ? data.public.map(item => ({
          id: item.id,
          jenis: item.jenis || "",
          name: item.name || "",
          waktu: item.waktu || "",
          lokasi: item.lokasi || "",
          url: item.url || "",
        })) : [],
        overview: data.overview && typeof data.overview === 'object' 
          ? { 
              totalInternal: data.overview.totalInternal || 0, 
              byStatus: {
                aktif: data.overview.byStatus?.aktif || 0,
                nonaktif: data.overview.byStatus?.nonaktif || 0,
              }
            } 
          : { totalInternal: 0, byStatus: { aktif: 0, nonaktif: 0 } },
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching layanan data:', error);
      setError(error.message || 'Failed to load data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log('api data', apiData)

  const handleAddInternal = async (newItem) => {
    try {
      const response = await fetch(`${BASE_URL}/layanan/internal`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: [newItem] }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error adding internal layanan:', error);
      setError(error.message || 'Failed to add layanan. Please try again.');
    }
  };

  const handleUpdateInternal = async (updatedItem) => {
    try {
      const response = await fetch(`${BASE_URL}/layanan/internal/${updatedItem.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error updating internal layanan:', error);
      setError(error.message || 'Failed to update layanan. Please try again.');
    }
  };

  const handleDeleteInternal = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/layanan/internal/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error deleting internal layanan:', error);
      setError(error.message || 'Failed to delete layanan. Please try again.');
    }
  };

  const handleAddPublic = async (newItem) => {
    try {
      const response = await fetch(`${BASE_URL}/layanan/public`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: [newItem] }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error adding public layanan:', error);
      setError(error.message || 'Failed to add layanan. Please try again.');
    }
  };

  const handleDeletePublic = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/layanan/public/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error deleting public layanan:', error);
      setError(error.message || 'Failed to delete layanan. Please try again.');
    }
  };

  const counts = useMemo(() => ({
    internal: apiData.internal?.length || 0,
    public: apiData.public?.length || 0,
  }), [apiData]);

  return (
    <div className="min-h-screen grid grid-cols-[16rem,1fr]" style={{ background: THEME.bg }}>
      <AdminSidebar active={active} setActive={setActive} counts={counts} />
      <main className="px-6 space-y-6">
        {error && (
          <div className="rounded-xl p-4 border bg-red-500/10 text-red-300" style={{ borderColor: THEME.pillErr }}>
            {error}
          </div>
        )}
        {active === "overview" && <Overview data={apiData.overview} />}
        {active === "internal" && <AdminInternal data={apiData.internal || []} onAdd={handleAddInternal} onUpdate={handleUpdateInternal} onDelete={handleDeleteInternal} />}
        {active === "public" && <AdminPublic data={apiData.public || []} onAdd={handleAddPublic} onDelete={handleDeletePublic} />}
        {active === "settings" && (
          <div className="rounded-xl p-4 border" style={{ borderColor: THEME.border, background: THEME.surface, color: THEME.surfaceText }}>
            Pengaturan (placeholder)
          </div>
        )}
      </main>
    </div>
  );
};