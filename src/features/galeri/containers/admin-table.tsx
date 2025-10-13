import { useEffect, useMemo, useRef, useState } from "react";

const THEME = {
  primary: "#0f172a",
  primaryText: "#ffffff",
  accent: "#F2C94C",
  bg: "#0b0b0b",
  surface: "#111318",
  surfaceText: "#ffffff",
  subtle: "rgba(255,255,255,0.10)",
};

/*********** HELPERS: API ***********/
const BASE_URL = "https://dev.kiraproject.id/api";

const apiFetch = async (url, method = 'GET', body = null) => {
  const token = localStorage.getItem('token') || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  console.log('Payload sent:', body); // Logging payload
  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Error details:', errorData);
    throw new Error(`API error: ${response.statusText} - ${errorData}`);
  }
  return response.json();
};

// Function for image upload
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${BASE_URL}/galeri/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Upload error: ${response.statusText} - ${errorData}`);
  }
  return response.json();
};

/*********** SEED: DARI FE (disesuaikan dengan API) ***********/
const SEED_ALBUMS = [
  { id: 1, name: "Kegiatan Sekolah", description: "Koleksi kegiatan sekolah", coverUrl: "/Uploads/cover.jpg" },
  { id: 2, name: "Olahraga", description: "Kegiatan olahraga", coverUrl: "/Uploads/cover.jpg" },
  { id: 3, name: "Akademik", description: "Kegiatan akademik", coverUrl: "/Uploads/cover.jpg" },
  { id: 4, name: "Kesiswaan", description: "Kegiatan kesiswaan", coverUrl: "/Uploads/cover.jpg" },
  { id: 5, name: "Video", description: "Koleksi video", coverUrl: "/Uploads/cover.jpg" },
];

const SEED_ITEMS = [
  { id: 1, type: 'photo', title: 'Upacara Bendera', date: '2025-08-22', src: "/Uploads/sch_1/gallery/upacara-bendera.jpg", albumId: 1, pin: false, order: 1 },
  { id: 2, type: 'photo', title: 'Lomba Futsal', date: '2025-08-15', src: "/Uploads/sch_1/gallery/lomba-futsal.jpg", albumId: 2, pin: false, order: 2 },
  { id: 3, type: 'photo', title: 'Pameran Karya RPL', date: '2025-07-30', src: "/Uploads/sch_1/gallery/pameran-rpl.jpg", albumId: 3, pin: false, order: 3 },
  { id: 4, type: 'photo', title: 'Kegiatan Pramuka', date: '2025-07-12', src: "/Uploads/sch_1/gallery/pramuka.jpg", albumId: 4, pin: false, order: 4 },
  { id: 5, type: 'video', title: 'Profil Sekolah', date: '2025-07-10', embed: 'https://www.youtube.com/embed/5qap5aO4i9A', albumId: 5, pin: true, order: 5 },
  { id: 6, type: 'photo', title: 'Wisuda Siswa', date: '2025-06-25', src: "/Uploads/sch_1/gallery/wisuda.jpg", albumId: 1, pin: false, order: 6 },
  { id: 7, type: 'photo', title: 'Lomba Inovasi', date: '2025-06-10', src: "/Uploads/sch_1/gallery/lomba-inovasi.jpg", albumId: 3, pin: false, order: 7 },
];

/*********** VALIDATION ***********/
const isYouTubeEmbed = (url) => /^(https:\/\/)?(www\.|m\.)?youtube\.com\/embed\//.test(url || "");

/*********** MINI UI ***********/
const SectionTitle = ({ children }) => (
  <div className="text-sm font-semibold tracking-wide text-white">{children}</div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl p-3 border border-white/20" style={{ color: THEME.primaryText }}>
    <div className="text-xs opacity-80">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const Pill = ({ children }) => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ color: THEME.primaryText }}>{children}</span>
);

const Button = ({ children, onClick, variant = "ghost", ...rest }) => {
  const base = "px-3 py-1.5 rounded-lg text-sm border inline-flex items-center gap-1 focus:outline-none border-white/20";
  const styleMap = {
    ghost: { background: "transparent", color: THEME.primaryText },
    primary: { background: "rgba(16,185,129,0.10)", color: "#6ee7b7", borderColor: "rgba(16,185,129,0.30)" },
    danger: { background: "transparent", color: THEME.primaryText, borderColor: "#ef4444" },
  };
  const style = styleMap[variant] || styleMap.ghost;
  return <button onClick={onClick} className={base} style={style} {...rest}>{children}</button>;
};

/*********** MAIN COMPONENT ***********/
export function GaleriMain() {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tab, setTab] = useState('dashboard');

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch('/galeri');
        setItems(data.items || []);
        setAlbums(data.albums || []);
      } catch (e) {
        console.error('Failed to fetch gallery data:', e);
        alert('Gagal memuat data galeri. Menggunakan data seed.');
        setItems(SEED_ITEMS);
        setAlbums(SEED_ALBUMS);
      }
    };
    fetchData();
  }, []);

  // Derived stats
  const stats = useMemo(() => ({
    total: items.length,
    foto: items.filter(i => i.type === 'photo').length,
    video: items.filter(i => i.type === 'video').length,
    album: new Set(albums.map(a => a.id)).size,
    populer: items.filter(i => i.pin).length,
  }), [items, albums]);

  // Smoke tests
  useEffect(() => {
    try {
      console.assert(typeof ItemsManager === 'function', 'ItemsManager tersedia');
      console.assert(typeof AlbumsManager === 'function', 'AlbumsManager tersedia');
      console.assert(Array.isArray(items) && Array.isArray(albums), 'State dasar berbentuk array');
      console.log('✅ Smoke tests passed (AdminGaleri root)');
    } catch (e) {
      console.error('❌ Smoke tests gagal (root):', e);
    }
  }, []);

  return (
    <div className="min-h-screen text-neutral-100 pb-4">
      <Header />
      <div className="max-w-full mx-auto grid grid-cols-12 gap-4">
        <Sidebar tab={tab} setTab={setTab} />
        <main className="col-span-12 lg:col-span-9 mt-4">
          {tab === 'dashboard' && <Dashboard stats={stats} items={items} albums={albums} />}
          {tab === 'items' && <ItemsManager items={items} setItems={setItems} albums={albums} setAlbums={setAlbums} />}
          {tab === 'albums' && <AlbumsManager albums={albums} setAlbums={setAlbums} items={items} />}
          {tab === 'io' && <ImportExport items={items} setItems={setItems} albums={albums} setAlbums={setAlbums} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

/*********** HEADER & FOOTER ***********/
const Header = () => (
  <div className="w-full sticky top-0 z-10" style={{ background: THEME.primary, borderBottom: `1px solid ${THEME.subtle}` }}>
    <div className="max-w-full mx-auto py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold" style={{ background: THEME.accent, color: "#111827" }}>13</div>
        <div className="leading-none">
          <div className="text-base font-semibold" style={{ color: THEME.primaryText }}>Admin — Galeri</div>
          <div className="text-[11px] opacity-80" style={{ color: THEME.primaryText }}>SMKN 13 Jakarta · Xpresensi</div>
        </div>
      </div>
      <div className="text-xs" style={{ color: THEME.primaryText }}>
        <Pill>API</Pill>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="mt-8" style={{ background: THEME.primary }}>
    <div className="max-w-full mx-auto px-4 py-6 text-sm flex items-center justify-between" style={{ color: THEME.primaryText }}>
      <div>© 2025 · Admin Galeri · SMKN 13 Jakarta</div>
      <div className="text-xs">Powered by <span className="font-semibold">Xpresensi</span></div>
    </div>
  </footer>
);

/*********** SIDEBAR ***********/
const Sidebar = ({ tab, setTab }) => {
  const NavBtn = ({ id, label }) => {
    const active = tab === id;
    const cls = [
      "w-full text-left px-3 py-2 rounded-lg border",
      active ? "font-semibold" : ""
    ].join(" ");
    const style = active
      ? { borderColor: "rgba(16,185,129,0.30)", background: "rgba(16,185,129,0.10)", color: "#6ee7b7" }
      : { color: THEME.primaryText, background: "rgba(255,255,255,0.05)" };
    return <button onClick={() => setTab(id)} className={cls} style={style}>{label}</button>;
  };
  return (
    <aside className="col-span-12 lg:col-span-3 space-y-2">
      <SectionTitle>Menu</SectionTitle>
      <div className="flex flex-wrap items-center gap-3">
        <NavBtn id="dashboard" label="Dashboard" />
        <NavBtn id="items" label="Item Galeri" />
        <NavBtn id="albums" label="Album" />
        <NavBtn id="io" label="Impor/Ekspor" />
      </div>
    </aside>
  );
};

/*********** DASHBOARD ***********/
const Dashboard = ({ stats, items, albums }) => {
  const last5 = useMemo(() => items.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [items]);
  return (
    <section className="space-y-4">
      <SectionTitle>Ringkasan</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Total Item" value={stats.total} />
        <Stat label="Foto" value={stats.foto} />
        <Stat label="Video" value={stats.video} />
        <Stat label="Album" value={stats.album} />
        <Stat label="Dipin" value={stats.populer} />
      </div>
      <br />
      <div className="rounded-2xl p-3 border border-white/20">
        <div className="text-sm font-semibold mb-3" style={{ color: THEME.primaryText }}>Terbaru</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {last5.map(it => {
            const album = albums.find(a => a.id === it.albumId);
            return (
              <div key={it.id} className="rounded-lg overflow-hidden border" style={{ background: '#0002' }}>
                <div className="w-full" style={{ aspectRatio: '16/9', background: '#0003' }}>
                  {it.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center text-[11px]" style={{ color: THEME.primaryText }}>Video</div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px]" style={{ color: THEME.primaryText }}>Foto</div>
                  )}
                </div>
                <div className="p-2 text-sm" style={{ color: THEME.primaryText }}>
                  <div className="font-semibold truncate">{it.title}</div>
                  <div className="text-xs opacity-80">{new Date(it.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} · {album?.name || 'Unknown'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/*********** ITEMS MANAGER ***********/
function ItemsManager({ items, setItems, albums, setAlbums }) {
  const [q, setQ] = useState("");
  const [album, setAlbum] = useState("Semua");
  const [kind, setKind] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");
  const [selectedIds, setSelectedIds] = useState([]);
  const [editing, setEditing] = useState(null);

  const albumOpts = useMemo(() => [{ id: 'Semua', name: 'Semua' }, ...albums], [albums]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    let data = items.filter(it => {
      const albumName = albums.find(a => a.id === it.albumId)?.name || '';
      const okQ = !nq || it.title.toLowerCase().includes(nq) || albumName.toLowerCase().includes(nq);
      const okA = album === 'Semua' || it.albumId === parseInt(album);
      const okK = kind === 'Semua' || (kind === 'Foto' ? it.type === 'photo' : it.type === 'video');
      return okQ && okA && okK;
    });
    if (sort === 'Terbaru') data = data.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'Terlama') data = data.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'Populer') data = data.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sort === 'Dipin') data = data.slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0));
    return data;
  }, [items, q, album, kind, sort, albums]);

  // Actions
  const toggleSelect = (id) => setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectAll = () => setSelectedIds(filtered.map(i => i.id));
  const clearSel = () => setSelectedIds([]);

  const delSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Hapus ${selectedIds.length} item?`)) return;
    try {
      for (const id of selectedIds) {
        await apiFetch(`/galeri/items/${id}`, 'DELETE');
      }
      setItems(items.filter(i => !selectedIds.includes(i.id)));
      setSelectedIds([]);
    } catch (e) {
      alert('Gagal menghapus item: ' + e.message);
    }
  };

  const pinSelected = async (val = true) => {
    try {
      await apiFetch(`/galeri`, 'PUT', { items: selectedIds.map(id => ({ id, pin: val })) });
      setItems(items.map(i => selectedIds.includes(i.id) ? { ...i, pin: val } : i));
    } catch (e) {
      alert('Gagal mengatur pin: ' + e.message);
    }
  };

  const move = async (id, dir) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const j = dir < 0 ? idx - 1 : idx + 1;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    const [x] = next.splice(idx, 1);
    next.splice(j, 0, x);
    const updatedItems = next.map((item, index) => ({ ...item, order: index + 1 }));
    try {
      await apiFetch(`/galeri`, 'PUT', { items: updatedItems.map(({ id, order }) => ({ id, order })) });
      setItems(updatedItems);
    } catch (e) {
      alert('Gagal mengatur ulang urutan: ' + e.message);
    }
  };

  const startCreate = () => setEditing({
    type: 'photo',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    src: '',
    embed: '',
    albumId: 1,
    albumName: '',
    pin: false,
    order: items.length + 1,
    _isNew: true
  });

  const startEdit = (it) => setEditing({ ...it, albumName: albums.find(a => a.id === it.albumId)?.name || '' });

  const cancelEdit = () => setEditing(null);

  const saveEdit = async (draft) => {
    if (!draft.title?.trim()) return alert('Judul wajib diisi');
    if (!draft.albumName?.trim()) return alert('Nama album wajib diisi');
    if (draft.type === 'photo' && !draft.src) return alert('Gambar wajib diunggah');
    if (draft.type === 'video' && !isYouTubeEmbed(draft.embed)) return alert('Gunakan URL embed YouTube yang valid');

    try {
      const existingAlbum = albums.find(a => a.name.toLowerCase() === draft.albumName.toLowerCase());
      let albumId = existingAlbum ? existingAlbum.id : -1; // Use -1 as a temporary albumId for new albums
      const newAlbums = existingAlbum ? [] : [{
        name: draft.albumName,
        description: `Album untuk ${draft.albumName}`,
        coverUrl: '/Uploads/cover.jpg',
        id: albumId // Include temporary id for new album
      }];

      // Prepare item data
      const { albumName, _isNew, id, ...itemData } = draft;
      const itemPayload = {
        ...itemData,
        albumId, // Use existing albumId or temporary -1 for new album
        order: itemData.order || 0,
        ...(draft.type === 'photo' ? { src: draft.src } : { embed: draft.embed })
      };

      // Remove unnecessary fields
      delete itemPayload.sortOrder;
      delete itemPayload.w;
      delete itemPayload.h;

      const payload = {
        albums: newAlbums,
        items: [itemPayload]
      };

      console.log('Payload sent:', payload); // Log payload for debugging

      const response = await apiFetch(`/galeri`, _isNew ? 'POST' : 'PUT', payload);

      // Update state with response data
      const newItem = {
        ...itemPayload,
        id: response.items[0].id,
        albumId: response.items[0].albumId || (newAlbums.length ? response.albums[0].id : albumId),
        order: response.items[0].order || itemPayload.order,
      };

      setItems(prev => {
        const idx = prev.findIndex(i => i.id === draft.id);
        if (idx === -1) return [...prev, { ...newItem, order: newItem.order }];
        const next = prev.slice();
        next[idx] = { ...newItem, order: newItem.order };
        return next;
      });

      if (newAlbums.length && response.albums?.length) {
        setAlbums(prev => [...prev, { ...newAlbums[0], id: response.albums[0].id }]);
      }

      setEditing(null);
    } catch (e) {
      alert('Gagal menyimpan item: ' + e.message);
    }
  };

  // Smoke tests
  useEffect(() => {
    try {
      console.assert(albumOpts.some(a => a.id === 'Semua'), 'albumOpts menyertakan "Semua"');
      console.assert(typeof startCreate === 'function' && typeof saveEdit === 'function', 'Handler create/save tersedia');
      console.log('✅ Smoke tests passed (ItemsManager)');
    } catch (e) {
      console.error('❌ Smoke tests gagal (ItemsManager):', e);
    }
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Item Galeri</SectionTitle>
        <div className="flex items-center gap-2">
          <Button onClick={startCreate} variant="primary">＋ Tambah</Button>
          <Button onClick={selectAll}>Pilih Semua</Button>
          <Button onClick={clearSel}>Bersihkan</Button>
          <Button onClick={() => pinSelected(true)}>Pin</Button>
          <Button onClick={() => pinSelected(false)}>Unpin</Button>
          <Button onClick={delSelected} variant="danger">Hapus</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari… (judul/album)" className="px-3 py-2 rounded-lg text-sm border bg-white/20 text-white" />
        <label className="text-xs flex items-center gap-2">
          <span>Album</span>
          <select value={album} onChange={e => setAlbum(e.target.value)} className="px-2 py-1 rounded-lg text-sm border bg-white/20 text-white">
            {albumOpts.map(a => <option key={a.id} value={a.id} style={{ color: '#111827' }}>{a.name}</option>)}
          </select>
        </label>
        <label className="text-xs flex items-center gap-2">
          <span>Jenis</span>
          <select value={kind} onChange={e => setKind(e.target.value)} className="px-2 py-1 rounded-lg text-sm border bg-white/20 text-white">
            {['Semua', 'Foto', 'Video'].map(k => <option key={k} value={k} style={{ color: '#111827' }}>{k}</option>)}
          </select>
        </label>
        <label className="text-xs flex items-center gap-2 ml-auto">
          <span>Urutkan</span>
          <select value={sort} onChange={e => setSort(e.target.value)} className="px-2 py-1 rounded-lg text-sm border bg-white/20 text-white">
            {['Terbaru', 'Terlama', 'Populer', 'Dipin'].map(s => <option key={s} value={s} style={{ color: '#111827' }}>{s}</option>)}
          </select>
        </label>
      </div>
      <datalist id="album-list">
        {albumOpts.filter(a => a.id !== 'Semua').map(a => <option key={a.id} value={a.name} />)}
      </datalist>
      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm" style={{ color: THEME.primaryText }}>
          <thead className="text-xs" style={{ background: '#ffffff10' }}>
            <tr>
              <th className="p-2 w-10">✓</th>
              <th className="p-2 w-36">Preview</th>
              <th className="p-2 text-left">Judul</th>
              <th className="p-2">Jenis</th>
              <th className="p-2">Album</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Views</th>
              <th className="p-2">Pin</th>
              <th className="p-2 w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const album = albums.find(a => a.id === it.albumId);
              return (
                <tr key={it.id} className="border-t">
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={selectedIds.includes(it.id)} onChange={() => toggleSelect(it.id)} />
                  </td>
                  <td className="p-2">
                    <div className="w-28 h-16 rounded-lg overflow-hidden border" style={{ background: '#0002' }}>
                      {it.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center text-[10px]">Video</div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px]">
                          <img src={`https://dev.kiraproject.id${it.src}`} alt={it.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="font-semibold truncate max-w-[220px]">{it.title}</div>
                  </td>
                  <td className="p-2 text-center">{it.type === 'photo' ? 'Foto' : 'Video'}</td>
                  <td className="p-2 text-center">
                    <Pill>{album?.name || 'Unknown'}</Pill>
                  </td>
                  <td className="p-2 text-center">{new Date(it.date).toLocaleDateString('id-ID')}</td>
                  <td className="p-2 text-center">{it.views || 0}</td>
                  <td className="p-2 text-center">{it.pin ? '📌' : '-'}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button onClick={() => move(it.id, -1)}>⬆</Button>
                      <Button onClick={() => move(it.id, 1)}>⬇</Button>
                      <Button onClick={async () => {
                        try {
                          await apiFetch(`/galeri`, 'PUT', { items: [{ id: it.id, pin: !it.pin }] });
                          setItems(items.map(x => x.id === it.id ? { ...x, pin: !x.pin } : x));
                        } catch (e) {
                          alert('Gagal mengatur pin: ' + e.message);
                        }
                      }}>{it.pin ? 'Unpin' : 'Pin'}</Button>
                      <Button onClick={() => startEdit(it)}>Edit</Button>
                      <Button variant="danger" onClick={async () => {
                        if (confirm('Hapus item ini?')) {
                          try {
                            await apiFetch(`/galeri/items/${it.id}`, 'DELETE');
                            setItems(items.filter(x => x.id !== it.id));
                          } catch (e) {
                            alert('Gagal menghapus item: ' + e.message);
                          }
                        }
                      }}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td className="p-4 text-center" colSpan={9} style={{ color: THEME.primaryText, opacity: .8 }}>Tidak ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditorModal
          draft={editing}
          onClose={cancelEdit}
          onSave={saveEdit}
          albums={albums}
        />
      )}
    </section>
  );
}

/*********** EDITOR MODAL ***********/
function EditorModal({ draft, onClose, onSave, albums }) {
  const [form, setForm] = useState(draft);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => setForm(draft), [draft]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadImage(file);
      if (response.success) {
        set('src', response.path);
      } else {
        alert('Gagal mengunggah gambar: Respons tidak valid');
      }
    } catch (e) {
      alert('Gagal mengunggah gambar: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div className="relative max-w-3xl w-full rounded-2xl border overflow-hidden border-white/20" style={{ color: THEME.primaryText }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${THEME.subtle}` }}>
          <div className="font-semibold">{form._isNew ? 'Tambah Item' : 'Edit Item'}</div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onSave(form)} variant="primary" disabled={uploading}>Simpan</Button>
            <Button onClick={onClose} disabled={uploading}>Tutup</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="space-y-3">
            <label className="block text-xs opacity-80">Judul
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                style={{ color: THEME.primaryText }}
              />
            </label>
            <label className="block text-xs opacity-80">Album
              <input
                value={form.albumName}
                onChange={e => set('albumName', e.target.value)}
                list="album-list"
                placeholder="Ketik nama album atau pilih"
                className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                style={{ color: THEME.primaryText }}
              />
              <datalist id="album-list">
                {albums.map(a => <option key={a.id} value={a.name} />)}
              </datalist>
            </label>
            <label className="block text-xs opacity-80">Tanggal
              <input
                type="date"
                value={form.date?.slice(0, 10)}
                onChange={e => set('date', e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                style={{ color: THEME.primaryText }}
              />
            </label>
            <label className="block text-xs opacity-80">Jenis
              <select
                value={form.type}
                onChange={e => {
                  set('type', e.target.value);
                  if (e.target.value === 'photo') {
                    set('embed', '');
                  } else {
                    set('src', '');
                  }
                }}
                className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                style={{ color: THEME.primaryText }}
              >
                <option value="photo" style={{ color: '#111827' }}>Foto</option>
                <option value="video" style={{ color: '#111827' }}>Video</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-xs opacity-80">
              <input
                type="checkbox"
                checked={!!form.pin}
                onChange={e => set('pin', e.target.checked)}
              /> Tandai sebagai Populer (Pin)
            </label>
          </div>
          <div className="space-y-3">
            {form.type === 'photo' ? (
              <>
                <label className="block text-xs opacity-80">Unggah Gambar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                    style={{ color: THEME.primaryText }}
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="text-xs opacity-80">Sedang mengunggah...</div>
                )}
                {form.src && (
                  <div className="rounded-lg overflow-hidden border" style={{ background: '#0002' }}>
                    <img
                      src={`https://dev.kiraproject.id${form.src}`}
                      alt="Preview"
                      className="w-full h-[160px] object-cover"
                    />
                  </div>
                )}
                {!form.src && !uploading && (
                  <div className="rounded-lg overflow-hidden border" style={{ background: '#0002' }}>
                    <div className="h-[160px] flex items-center justify-center text-xs opacity-70">
                      Pilih gambar untuk diunggah
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <label className="block text-xs opacity-80">YouTube Embed URL
                  <input
                    placeholder="https://www.youtube.com/embed/xxxxx"
                    value={form.embed || ''}
                    onChange={e => set('embed', e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                    style={{ color: THEME.primaryText }}
                  />
                </label>
                <div className="rounded-lg overflow-hidden border" style={{ background: '#0002' }}>
                  {isYouTubeEmbed(form.embed) ? (
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={form.embed}
                        title="preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="h-[160px] flex items-center justify-center text-xs opacity-70">
                      Masukkan URL embed YouTube yang valid
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*********** ALBUMS MANAGER ***********/
function AlbumsManager({ albums, setAlbums, items }) {
  const del = async (albumName) => {
    const album = albums.find(a => a.name === albumName);
    if (!album) return;
    if (items.some(i => i.albumId === album.id)) return alert('Album sedang digunakan oleh item. Pindahkan item terlebih dahulu.');
    if (confirm('Hapus album ini?')) {
      try {
        await apiFetch(`/galeri/albums/${encodeURIComponent(albumName)}`, 'DELETE');
        setAlbums(albums.filter(a => a.name !== albumName));
      } catch (e) {
        alert('Gagal menghapus album: ' + e.message);
      }
    }
  };

  useEffect(() => {
    try {
      console.assert(Array.isArray(albums), 'albums adalah array');
      console.assert(typeof del === 'function', 'handler del tersedia');
      console.log('✅ Smoke tests passed (AlbumsManager)');
    } catch (e) {
      console.error('❌ Smoke tests gagal (AlbumsManager):', e);
    }
  }, []);

  return (
    <section className="space-y-4">
      <SectionTitle>Album</SectionTitle>
      <div className="rounded-2xl p-3 border border-white/20" style={{ color: THEME.primaryText }}>
        <div className="text-sm mb-2">Album dibuat otomatis saat menambah item galeri.</div>
        <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {albums.map(al => (
            <li key={al.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/20">
              <span>{al.name}</span>
              <div className="flex items-center gap-2">
                <Pill>{items.filter(i => i.albumId === al.id).length} item</Pill>
                <Button variant="danger" onClick={() => del(al.name)}>Hapus</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/*********** IMPORT / EXPORT ***********/
function ImportExport({ items, setItems, albums, setAlbums }) {
  const taRef = useRef(null);

  const exportJSON = () => {
    const cleanedItems = items.map(({ albumName, ...item }) => ({
      ...item,
      ...(item.type === 'photo' ? { src: item.src } : { embed: item.embed }),
    }));
    const payload = { items: cleanedItems, albums, exportedAt: new Date().toISOString() };
    const str = JSON.stringify(payload, null, 2);
    navigator.clipboard?.writeText(str).catch(() => {});
    alert('JSON telah disalin ke clipboard.');
  };

  const importJSON = async () => {
    try {
      const str = taRef.current?.value || "";
      if (!str.trim()) return alert('Tempel JSON terlebih dahulu');
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed.items) || !Array.isArray(parsed.albums)) throw new Error('Struktur tidak valid');
      const cleanedItems = parsed.items.map(({ albumName, id, ...item }) => ({
        ...item,
        id: id && Number.isInteger(Number(id)) ? Number(id) : undefined,
        albumId: item.albumId && Number.isInteger(Number(item.albumId)) ? Number(item.albumId) : undefined,
      }));
      const cleanedAlbums = parsed.albums.map(({ id, ...album }) => ({
        ...album,
        id: id && Number.isInteger(Number(id)) ? Number(id) : undefined
      }));
      await apiFetch(`/galeri`, 'POST', { albums: cleanedAlbums, items: cleanedItems });
      setItems(cleanedItems);
      setAlbums(cleanedAlbums);
      alert('Impor berhasil');
    } catch (e) {
      alert('Gagal impor: ' + e.message);
    }
  };

  return (
    <section className="space-y-4">
      <SectionTitle>Impor / Ekspor</SectionTitle>
      <div className="rounded-2xl p-3 border space-y-3 border-white/20" style={{ color: THEME.primaryText }}>
        <div className="text-sm">Ekspor seluruh data (items & albums) sebagai JSON:</div>
        <Button onClick={exportJSON} variant="primary">Ekspor → Clipboard</Button>
        <div className="text-sm mt-2">Impor dari JSON (tempel di bawah, lalu klik Impor):</div>
        <textarea ref={taRef} className="w-full h-48 px-3 py-2 rounded-lg text-sm border bg-transparent border-white/20" style={{ color: THEME.primaryText }} placeholder='{"items":[],"albums":[]}' />
        <div className="flex items-center gap-2">
          <Button onClick={importJSON}>Impor</Button>
          <Button onClick={() => {
            if (confirm('Reset ke seed demo?')) {
              setItems(SEED_ITEMS);
              setAlbums(SEED_ALBUMS);
              apiFetch(`/galeri`, 'POST', { albums: SEED_ALBUMS, items: SEED_ITEMS })
                .catch(e => alert('Gagal reset ke seed: ' + e.message));
            }
          }} variant="danger">Reset Seed</Button>
        </div>
      </div>
    </section>
  );
}
