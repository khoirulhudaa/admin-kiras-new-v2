import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

// Types
interface GuruTendikItem {
  id?: number;
  name: string;
  unit: string;
  role: string;
  subjects: string;
  status: string;
  years: number;
  email: string;
  phone: string;
  photo: string;
  photoUrl: string;
}

interface GuruTendik {
  items: GuruTendikItem[];
}

// Utility: clsx
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Base URL for images
const BASE_URL = "https://dev.kiraproject.id";

// Icon Component
function Icon({ label }: { label: string }) {
  return (
    <span
      aria-hidden
      className="inline-block align-middle select-none"
      style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
    >
      {label}
    </span>
  );
}

function IPlus() { return <Icon label="＋" />; }
function ISave() { return <Icon label="💾" />; }
function ITrash() { return <Icon label="🗑️" />; }
function IClose() { return <Icon label="✖" />; }

// Form Components
function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block w-full", className)}>
      {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
      {children}
      {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
    </label>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
        className
      )}
    />
  );
}

function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onChange("");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch(`${BASE_URL}/api/guru-tendik/upload/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onChange(data.url);
        toast.success("Photo uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload photo");
        onChange("");
      }
    } catch (error) {
      toast.error("Error uploading photo");
      onChange("");
    }
  }

  return (
    <>
      <div className="flex items-center w-full gap-4">
        {value && (
          <img
            src={`${BASE_URL}${value}`}
            alt="preview"
            className="h-12 relative top-1 w-12 rounded-md object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg"; // Fallback image
            }}
          />
        )}
        <Field label={label}>
          <div className="flex w-full flex-1 items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
        </Field>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${BASE_URL}${value}`}
                alt="zoomed preview"
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg"; // Fallback image
                }}
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <IClose />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Dropdown Options
const UNIT_OPTIONS = ["RPL", "TKJ", "Akuntansi", "Pemasaran", "Umum"];
const ROLE_OPTIONS = ["Guru", "Tendik", "Wali Kelas", "Kepala Sekolah"];
const STATUS_OPTIONS = ["PNS", "Honorer", "Kontrak"];

// Normalize Function
function normalize(state: any): GuruTendik {
  const out = { ...state };
  out.items = Array.isArray(out.items)
    ? out.items.map((item: any) => ({
        id: item.id ? Number(item.id) : undefined,
        name: String(item.name || "").trim(),
        unit: UNIT_OPTIONS.includes(item.unit) ? item.unit : UNIT_OPTIONS[0] || "",
        role: ROLE_OPTIONS.includes(item.role) ? item.role : ROLE_OPTIONS[0] || "",
        subjects: String(item.subjects || "").trim(),
        status: STATUS_OPTIONS.includes(item.status)
          ? item.status
          : STATUS_OPTIONS[0] || "",
        years: Number(item.years || 0),
        email: String(item.email || "").trim(),
        phone: String(item.phone || "").trim(),
        photo: String(item.photo || ""),
        photoUrl: String(item.photoUrl || item.photo || ""),
      }))
    : [];
  if (out.items.length === 0) {
    out.items = [
      {
        name: "",
        unit: UNIT_OPTIONS[0] || "",
        role: ROLE_OPTIONS[0] || "",
        subjects: "",
        status: STATUS_OPTIONS[0] || "",
        years: 0,
        email: "",
        phone: "",
        photo: "",
        photoUrl: "",
      },
    ];
  }
  return out;
}

export function FormGuruTendik() {
  const [v, setV] = useState<GuruTendik>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemLoading, setItemLoading] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setV(normalize({ items: data.items || [] }));
        } else {
          setError(data.error || "Failed to fetch data");
          toast.error(data.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem("admin:web:gurutendik", JSON.stringify(v));
    } catch {
      console.error("Failed to save guru-tendik to localStorage");
    }
  }, [v]);

  function setItem(i: number, patch: Partial<GuruTendikItem>) {
    setV((p) => {
      const a = [...(p.items || [])];
      a[i] = { ...a[i], ...patch, photoUrl: patch.photo || a[i].photoUrl };
      return normalize({ ...p, items: a });
    });
  }

  function addItem() {
    setV((p) => {
      const newItem = {
        name: "",
        unit: UNIT_OPTIONS[0] || "",
        role: ROLE_OPTIONS[0] || "",
        subjects: "",
        status: STATUS_OPTIONS[0] || "",
        years: 0,
        email: "",
        phone: "",
        photo: "",
        photoUrl: "",
      };
      const updated = {
        ...p,
        items: [newItem, ...(p.items || [])],
      };
      return normalize(updated);
    });
  }

  async function delItem(i: number) {
    const item = v.items[i];
    if (!item.id) {
      setV((p) => normalize({
        ...p,
        items: (p.items || []).filter((_: any, idx: number) => idx !== i),
      }));
      toast.success("Item removed locally");
      return;
    }

    setItemLoading((prev) => [...prev, i]);
    try {
      const response = await fetch(`${BASE_URL}/api/guru-tendik/items/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setV((p) => normalize({
          ...p,
          items: (p.items || []).filter((_: any, idx: number) => idx !== i),
        }));
        toast.success(data.message || "Item deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setItemLoading((prev) => prev.filter((idx) => idx !== i));
    }
  }

  async function handleItemSave(i: number) {
    const item = v.items[i];
    if (!item.name) {
      toast.error("Nama wajib diisi");
      return;
    }

    setItemLoading((prev) => [...prev, i]);
    try {
      const method = item.id ? "PUT" : "POST";
      const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ items: [{ ...item, photoUrl: undefined }] }), // Exclude photoUrl
      });
      const data = await response.json();
      if (response.ok) {
        const refreshResponse = await fetch(`${BASE_URL}/api/guru-tendik`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok) {
          setV(normalize({ items: refreshData.items || [] }));
          toast.success(data.message || "Item saved successfully");
        } else {
          toast.error(refreshData.error || "Failed to refresh data");
        }
      } else {
        toast.error(data.error || "Failed to save/update item");
      }
    } catch (error) {
      toast.error("Error saving/updating item");
    } finally {
      setItemLoading((prev) => prev.filter((idx) => idx !== i));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (v.items.some((item) => !item.name)) {
      toast.error("Semua nama wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const method = v.items.some((item) => item.id) ? "PUT" : "POST";
      const response = await fetch(`${BASE_URL}/api/guru-tendik`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: v.items.map((item) => ({ ...item, photoUrl: undefined })), // Exclude photoUrl
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const refreshResponse = await fetch(`${BASE_URL}/api/guru-tendik`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok) {
          setV(normalize({ items: refreshData.items || [] }));
          toast.success(data.message || "Data saved successfully");
        } else {
          setError(refreshData.error || "Failed to refresh data");
          toast.error(refreshData.error || "Failed to refresh data");
        }
      } else {
        toast.error(data.error || "Failed to save/update data");
      }
    } catch (error) {
      toast.error("Error saving/updating data");
    } finally {
      setLoading(false);
    }
  }

  // Filter items based on search query
  const filteredItems = v.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-white/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Guru & Tendik</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="search" className="text-sm">Cari nama</label>
                <Input
                  type="text"
                  value={searchQuery}
                  className="w-[400px]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan nama..."
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-md text-emerald-300"
              >
                <IPlus /> Tambah
              </button>
            </div>
          </div>
          <AnimatePresence>
            {filteredItems.map((it, i) => (
              <motion.div
                key={it.id || i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border border-white/20 p-3 mb-3"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nama (Wajib)">
                    <Input
                      value={it.name}
                      onChange={(e) => setItem(i, { name: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Unit">
                    <select
                      value={it.unit}
                      onChange={(e) => setItem(i, { unit: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                    >
                      {UNIT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-black">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Peran">
                    <select
                      value={it.role}
                      onChange={(e) => setItem(i, { role: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-black">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Mapel (jika Guru)">
                    <Input
                      value={it.subjects}
                      onChange={(e) => setItem(i, { subjects: e.target.value })}
                      disabled={it.role !== "Guru" && it.role !== "Wali Kelas"}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={it.status}
                      onChange={(e) => setItem(i, { status: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-black">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Masa Kerja (tahun)">
                    <Input
                      type="number"
                      value={it.years || 0}
                      onChange={(e) => setItem(i, { years: Number(e.target.value || 0) })}
                      min={0}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={it.email}
                      onChange={(e) => setItem(i, { email: e.target.value })}
                    />
                  </Field>
                  <Field label="Telepon">
                    <Input
                      type="tel"
                      value={it.phone}
                      onChange={(e) => setItem(i, { phone: e.target.value })}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <ImageUpload
                      value={it.photoUrl}
                      onChange={(d) => setItem(i, { photo: d, photoUrl: d })}
                      label="Foto (maks 2MB, opsional)"
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleItemSave(i)}
                    disabled={itemLoading.includes(i) || loading}
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300",
                      (itemLoading.includes(i) || loading) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ISave /> Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => delItem(i)}
                    disabled={itemLoading.includes(i) || loading}
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300",
                      (itemLoading.includes(i) || loading) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ITrash /> Hapus
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || itemLoading.length > 0}
            className={clsx(
              "inline-flex items-center gap-2 rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-semibold",
              (loading || itemLoading.length > 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-500"
            )}
          >
            <ISave /> Simpan Semua
          </button>
        </div>
      </form>
    </>
  );
}