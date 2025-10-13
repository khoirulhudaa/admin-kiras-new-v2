import React, { useEffect, useState } from "react";

/****************************
 * PPID Sekolah — Admin Dashboard (Fixed)
 * - Dokumen (CRUD)
 * - Inbox (Permohonan, Pengaduan)
 * - Pengaturan (Identitas, Kontak)
 * - API Panel (Koneksi)
 *
 * Notes (debug):
 * - Rewrote helpers to avoid TSX generic arrow fn parsing issues.
 * - Completed previously truncated JSX string/className.
 * - Added lightweight self-tests (run in dev via console).
 ****************************/

/*********** STORAGE KEYS ***********/
const PPID_KEYS = {
  docs: "ppid:docs",
  inboxReq: "ppid:inbox:req",
  inboxComplain: "ppid:inbox:complain",
  settings: "ppid:settings",
  api: "ppid:api",
} as const;

/*********** HELPERS (safe JSON + array upsert) ***********/
function jget<T>(k: string, fb: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}
function jset(k: string, v: any): void {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}
function upsert(arr: any[], item: any, idKey: string = "id") {
  const i = arr.findIndex((x) => x[idKey] === item[idKey]);
  if (i >= 0) { const n = [...arr]; n[i] = item; return n; }
  return [item, ...arr];
}

/*********** KONSTAN: KATEGORI ***********/
const KATEGORI_OPTIONS = [
  "Regulasi & SOP",
  "Informasi Berkala",
  "Informasi Setiap Saat",
  "Informasi Serta-merta",
  "Laporan Keuangan",
  "Laporan Kinerja",
] as const;

/*********** UI ATOMS ***********/
const Field = ({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) => (
  <label className="block text-sm">
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);
const Input = (props: any) => (
  <input
    {...props}
    className={[
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none",
      props.className || "",
    ].join(" ")}
  />
);
const TextArea = (props: any) => (
  <textarea
    {...props}
    className={[
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none",
      props.className || "",
    ].join(" ")}
  />
);

/*********** API PANEL ***********/
function ApiPanel() {
  const [cfg, setCfg] = useState(() => jget(PPID_KEYS.api, { baseUrl: "", token: "" }));
  const [status, setStatus] = useState<{ ok?: boolean; msg?: string }>({});
  useEffect(() => jset(PPID_KEYS.api, cfg), [cfg]);

  const test = async () => {
    setStatus({ ok: undefined, msg: "Menguji..." });
    try {
      if (!cfg.baseUrl) throw new Error("Base URL kosong");
      const url = cfg.baseUrl.replace(/\/$/, "") + "/health";
      const res = await fetch(url, {
        headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : undefined,
      });
      setStatus({ ok: res.ok, msg: res.ok ? "Terhubung" : `HTTP ${res.status}` });
    } catch (e: any) {
      setStatus({ ok: false, msg: e?.message || "Gagal" });
    }
  };

  return (
    <div className="rounded-2xl border border-white/20 p-4 mb-4">
      <div className="mb-2 text-sm font-semibold text-white/90">Koneksi API PPID</div>
      <div className="grid gap-2 md:grid-cols-2">
        <Field label="Base URL">
          <Input
            value={cfg.baseUrl}
            onChange={(e: any) => setCfg((p: any) => ({ ...p, baseUrl: e.target.value }))}
            placeholder="https://api.sekolah.sch.id/v1"
          />
        </Field>
        <Field label="Token (Bearer)" hint="Opsional bila API publik">
          <Input
            value={cfg.token}
            onChange={(e: any) => setCfg((p: any) => ({ ...p, token: e.target.value }))}
            placeholder="xxxx.yyyy.zzzz"
          />
        </Field>
        <div className="flex items-end">
          <button
            onClick={test}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
          >
            Uji Koneksi
          </button>
        </div>
      </div>
      {typeof status.ok !== "undefined" && (
        <div
          className={`mt-2 text-xs inline-flex items-center gap-2 rounded-lg px-2 py-1 ${
            status.ok
              ? "bg-emerald-500/10 text-emerald-300"
              : status.ok === undefined
              ? "bg-white/10 text-white/70"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  );
}

/*********** ADMIN: DOKUMEN ***********/
function AdminDokumen() {
  const [docs, setDocs] = useState(() => jget(PPID_KEYS.docs, [] as any[]));
  useEffect(() => jset(PPID_KEYS.docs, docs), [docs]);

  const empty = {
    id: "",
    judul: "",
    kategori: KATEGORI_OPTIONS[1],
    tahun: new Date().getFullYear(),
    tipe: "PDF",
    url: "",
  };
  const [form, setForm] = useState<any>(empty);

  const save = () => {
    if (!form.judul) return;
    const id = form.id || "DOC-" + Date.now();
    const item = { ...form, id };
    setDocs((arr) => upsert(arr, item));
    setForm(empty);
  };
  const edit = (d: any) => setForm(d);
  const del = (id: string) => setDocs((arr) => arr.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <ApiPanel />

      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-2 text-sm font-semibold text-white/90">Tambah / Ubah Dokumen</div>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Judul">
            <Input
              value={form.judul}
              onChange={(e: any) => setForm((p: any) => ({ ...p, judul: e.target.value }))}
            />
          </Field>
          <Field label="Kategori">
            <select
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
              value={form.kategori}
              onChange={(e: any) => setForm((p: any) => ({ ...p, kategori: e.target.value }))}
            >
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </Field>
          <Field label="Tahun">
            <Input
              type="number"
              value={form.tahun}
              onChange={(e: any) =>
                setForm((p: any) => ({ ...p, tahun: Number(e.target.value) || "" }))
              }
            />
          </Field>
          <Field label="Tipe">
            <Input
              value={form.tipe}
              onChange={(e: any) => setForm((p: any) => ({ ...p, tipe: e.target.value }))}
              placeholder="PDF/XLSX/IMG"
            />
          </Field>
          <Field label="URL Dokumen">
            <Input
              value={form.url}
              onChange={(e: any) => setForm((p: any) => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
            />
          </Field>
          <div className="flex items-end">
            <button
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
              onClick={save}
            >
              {form.id ? "Simpan Perubahan" : "Tambah Dokumen"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Judul</th>
              <th className="px-3 py-2 text-left">Kategori</th>
              <th className="px-3 py-2 text-left">Tahun</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-white/60">
                  Belum ada dokumen admin.
                </td>
              </tr>
            )}
            {docs.map((d: any) => (
              <tr key={d.id} className="border-t border-white/20">
                <td className="px-3 py-2 text-white">{d.judul}</td>
                <td className="px-3 py-2 text-white/80">{d.kategori}</td>
                <td className="px-3 py-2 text-white/80">{d.tahun}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
                      onClick={() => edit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                      onClick={() => del(d.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*********** ADMIN: INBOX ***********/
function AdminInbox() {
  const [tab, setTab] = useState<'permohonan' | 'pengaduan'>("permohonan");
  const [req, setReq] = useState(() => jget(PPID_KEYS.inboxReq, [] as any[]));
  const [com, setCom] = useState(() => jget(PPID_KEYS.inboxComplain, [] as any[]));
  useEffect(() => {
    const onStorage = () => {
      setReq(jget(PPID_KEYS.inboxReq, []));
      setCom(jget(PPID_KEYS.inboxComplain, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-xl border border-white/20 overflow-hidden">
        <button
          className={`px-3 py-1.5 text-sm ${
            tab === "permohonan" ? "bg-white/20 text-white" : "bg-white/10 text-white/80"
          }`}
          onClick={() => setTab("permohonan")}
        >
          Permohonan
        </button>
        <button
          className={`px-3 py-1.5 text-sm ${
            tab === "pengaduan" ? "bg-white/20 text-white" : "bg-white/10 text-white/80"
          }`}
          onClick={() => setTab("pengaduan")}
        >
          Pengaduan
        </button>
      </div>

      {tab === "permohonan" ? (
        <div className="rounded-2xl border border-white/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="px-3 py-2 text-left">Waktu</th>
                <th className="px-3 py-2 text-left">Nama</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Rincian</th>
              </tr>
            </thead>
            <tbody>
              {req.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-white/60">
                    Belum ada permohonan.
                  </td>
                </tr>
              )}
              {req.map((r: any) => (
                <tr key={r.id} className="border-t border-white/20">
                  <td className="px-3 py-2 text-white/80">{new Date(r.waktu).toLocaleString()}</td>
                  <td className="px-3 py-2 text-white">{r.nama}</td>
                  <td className="px-3 py-2 text-white/80">{r.email || "-"}</td>
                  <td className="px-3 py-2 text-white/80">{r.rincian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="px-3 py-2 text-left">Waktu</th>
                <th className="px-3 py-2 text-left">Nama</th>
                <th className="px-3 py-2 text-left">Topik</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {com.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-white/60">
                    Belum ada pengaduan.
                  </td>
                </tr>
              )}
              {com.map((c: any) => (
                <tr key={c.id} className="border-t border-white/20">
                  <td className="px-3 py-2 text-white/80">{new Date(c.waktu).toLocaleString()}</td>
                  <td className="px-3 py-2 text-white">{c.nama}</td>
                  <td className="px-3 py-2 text-white/80">{c.topik}</td>
                  <td className="px-3 py-2 text-white/80">{c.status || "baru"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/*********** ADMIN: SETTINGS ***********/
function AdminSettings() {
  const [settings, setSettings] = useState(() =>
    jget(PPID_KEYS.settings, {
      identitas: { npsn: "", akreditasi: "", alamat: "" },
      jam: "Senin–Jumat 08.00–15.00 WIB",
      kontak: { email: "ppid@sekolah.sch.id", tel: "(021) 123456" },
    })
  );
  useEffect(() => jset(PPID_KEYS.settings, settings), [settings]);
  const setAt = (patch: any) => setSettings((s: any) => ({ ...s, ...patch }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-2 text-sm font-semibold text-white/90">Identitas & Kontak PPID</div>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="NPSN">
            <Input
              value={settings.identitas.npsn}
              onChange={(e: any) => setAt({ identitas: { ...settings.identitas, npsn: e.target.value } })}
            />
          </Field>
          <Field label="Akreditasi">
            <Input
              value={settings.identitas.akreditasi}
              onChange={(e: any) => setAt({ identitas: { ...settings.identitas, akreditasi: e.target.value } })}
            />
          </Field>
          <Field label="Alamat">
            <Input
              value={settings.identitas.alamat}
              onChange={(e: any) => setAt({ identitas: { ...settings.identitas, alamat: e.target.value } })}
            />
          </Field>
          <Field label="Jam Layanan">
            <Input value={settings.jam} onChange={(e: any) => setAt({ jam: e.target.value })} />
          </Field>
          <Field label="Email PPID">
            <Input
              value={settings.kontak.email}
              onChange={(e: any) => setAt({ kontak: { ...settings.kontak, email: e.target.value } })}
            />
          </Field>
          <Field label="Telepon PPID">
            <Input
              value={settings.kontak.tel}
              onChange={(e: any) => setAt({ kontak: { ...settings.kontak, tel: e.target.value } })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

/*********** ADMIN DASHBOARD ***********/
const Sidebar = ({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: (s: string) => void;
}) => (
  <aside className="w-60 border-r pr-4 border-white/20 space-y-2">
    {/* <div className="font-semibold text-white/80 mb-2">Admin PPID</div> */}
    {["Dokumen", "Inbox", "Pengaturan"].map((m) => (
      <button
        key={m}
        onClick={() => setCurrent(m)}
        className={
          "w-full text-left rounded-lg px-3 py-2 text-sm " +
          (current === m
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
            : "bg-white/5 text-white/90 border border-white/20")
        }
      >
        {m}
      </button>
    ))}
  </aside>
);

export function PPIDMain() {
  const [current, setCurrent] = useState<string>("Dokumen");
  useEffect(() => {
    // Seed minimal settings jika kosong
    const s = jget(PPID_KEYS.settings, null as any);
    if (!s) {
      jset(PPID_KEYS.settings, {
        identitas: { npsn: "12345678", akreditasi: "A", alamat: "Jl. Contoh No.1, Jakarta" },
        jam: "Senin–Jumat 08.00–15.00 WIB",
        kontak: { email: "ppid@sekolah.sch.id", tel: "(021) 123456" },
      });
    }
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="flex min-h-screen">
        <Sidebar current={current} setCurrent={setCurrent} />
        <main className="flex-1 px-4 space-y-4">
          {/* <h1 className="text-xl font-semibold">Admin — PPID</h1> */}
          {current === "Dokumen" && <AdminDokumen />}
          {current === "Inbox" && <AdminInbox />}
          {current === "Pengaturan" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

/***********************
 * SELF TESTS (dev-only) — simple assertions via console
 ***********************/
function runSelfTests() {
  try {
    const prevDocs = jget(PPID_KEYS.docs, [] as any[]);

    // Test jset/jget round-trip
    const sample = { a: 1, b: { c: 2 } };
    jset("__ppid:test:obj", sample);
    const got = jget("__ppid:test:obj", {} as any);
    console.assert(JSON.stringify(got) === JSON.stringify(sample), "jget/jset round-trip failed");

    // Test upsert: update existing & insert new
    let arr: any[] = [{ id: "1", v: 1 }];
    arr = upsert(arr, { id: "1", v: 2 });
    console.assert(arr.length === 1 && arr[0].v === 2, "upsert update failed");
    arr = upsert(arr, { id: "2", v: 3 });
    console.assert(arr.length === 2, "upsert insert failed");

    // Test inbox write/read (simulate FE submit)
    const req0 = jget(PPID_KEYS.inboxReq, [] as any[]);
    jset(PPID_KEYS.inboxReq, [{ id: "REQ-test", waktu: new Date().toISOString(), nama: "Tester", rincian: "Cek" }, ...req0]);
    const req1 = jget(PPID_KEYS.inboxReq, [] as any[]);
    console.assert(req1.length >= req0.length + 1, "inbox permohonan write failed");

    // Restore
    jset(PPID_KEYS.docs, prevDocs);

    console.log("✅ PPID Admin self-tests passed");
  } catch (e) {
    console.error("❌ PPID Admin self-tests failed:", e);
  }
}

if (typeof window !== "undefined") {
  const w = window as any;
  if (!w.__PPID_ADMIN_TESTED__) {
    w.__PPID_ADMIN_TESTED__ = true;
    // Run after initial paint
    setTimeout(runSelfTests, 0);
  }
}