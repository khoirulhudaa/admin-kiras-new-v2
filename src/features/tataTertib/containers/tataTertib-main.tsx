// components/admin/SchoolRulesEditor.tsx
import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

// ────────────────────────────────────────────────
// Shared Utilities (sama seperti di VisiMisi)
// ────────────────────────────────────────────────

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);

  return { alert, showAlert, hideAlert };
};

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx("ml-4", isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400")}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50",
      className
    )}
  />
);

interface ListEditorProps {
  items: string[];
  onChange: (list: string[]) => void;
  onDelete: (index: number) => void;
  placeholder?: string;
}

const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, onDelete, placeholder = "Masukkan aturan..." }) => {
  const setAt = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const add = () => onChange([...items, ""]);
  const up = (index: number) => {
    if (index <= 0) return;
    const copy = [...items];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onChange(copy);
  };
  const down = (index: number) => {
    if (index >= items.length - 1) return;
    const copy = [...items];
    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={text} onChange={(e) => setAt(index, e.target.value)} placeholder={placeholder} />
          <button type="button" onClick={() => up(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            ↑
          </button>
          <button type="button" onClick={() => down(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            ↓
          </button>
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs text-blue-300 hover:bg-blue-500/20"
      >
        Tambah Aturan
      </button>
    </div>
  );
};

const ISave = () => (
  <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
    💾
  </span>
);

// ────────────────────────────────────────────────
// Komponen Utama: SchoolRulesEditor
// ────────────────────────────────────────────────

export function TataTertibMain() {
  const [rules, setRules] = useState<string[]>([]);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolData = useSchool();
  const schoolId = schoolData?.data[0]?.id;

  const BASE_URL = "https://be-school.kiraproject.id/tata-tertib";

  useEffect(() => {
    if (!schoolId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const records = json.success ? json.data : json;

        if (Array.isArray(records) && records.length > 0) {
          const rec = records[0];
          setRules(Array.isArray(rec.rules) ? rec.rules : []);
          setRecordId(rec.id);
        }
      } catch {
        showAlert("Gagal memuat tata tertib");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, showAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return showAlert("School ID tidak tersedia");

    setSaving(true);

    const cleaned = rules.filter((r) => r.trim());

    if (cleaned.length === 0) {
      showAlert("Setidaknya satu aturan harus diisi");
      setSaving(false);
      return;
    }

    try {
      const payload = { schoolId, rules: cleaned };

      let res: Response;
      if (recordId) {
        res = await fetch(`${BASE_URL}/${recordId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Gagal menyimpan");

      const result = await res.json();
      if (!recordId && result.data?.id) setRecordId(result.data.id);

      showAlert("Tata tertib berhasil disimpan!");
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !schoolId) return <div className="py-10 text-center text-white/70">Memuat aturan sekolah...</div>;

  return (
    <div className="space-y-6">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-start pt-4 pb-6">
          <button
            type="submit"
            disabled={saving}
            className={clsx(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              saving ? "bg-blue-800/50 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            <ISave />
            {saving ? "Menyimpan..." : "Simpan Tata Tertib"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 text-base font-semibold text-white">Daftar Tata Tertib Sekolah</div>
          <ListEditor items={rules} onChange={setRules} onDelete={(i) => setRules(rules.filter((_, idx) => idx !== i))} />
        </div>
      </form>
    </div>
  );
}