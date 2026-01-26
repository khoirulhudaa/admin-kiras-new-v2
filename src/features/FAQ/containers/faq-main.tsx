// components/admin/FaqEditor.tsx
import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

// ────────────────────────────────────────────────
// Shared Utilities (sama seperti di atas)
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

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 resize-y min-h-[100px]",
      className
    )}
  />
);

const ISave = () => (
  <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
    💾
  </span>
);

// ────────────────────────────────────────────────
// Komponen Utama: FaqEditor
// ────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqMain() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolData = useSchool();
  const schoolId = schoolData?.data[0]?.id;

  const BASE_URL = "https://be-school.kiraproject.id/faq";

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
          setFaqs(
            Array.isArray(rec.faqs)
              ? rec.faqs.map((f: any) => ({
                  question: f.question || "",
                  answer: f.answer || "",
                }))
              : []
          );
          setRecordId(rec.id);
        }
      } catch {
        showAlert("Gagal memuat data FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, showAlert]);

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return showAlert("School ID tidak tersedia");

    setSaving(true);

    if (faqs.some((f) => !f.question.trim() || !f.answer.trim())) {
      showAlert("Semua pertanyaan dan jawaban wajib diisi");
      setSaving(false);
      return;
    }

    try {
      const payload = { schoolId, faqs };

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

      showAlert("FAQ berhasil disimpan!");
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !schoolId) return <div className="py-10 text-center text-white/70">Memuat data FAQ...</div>;

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
            {saving ? "Menyimpan..." : "Simpan FAQ"}
          </button>
        </div>

        <div className="space-y-6 pb-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Pertanyaan {idx + 1}</div>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
                  disabled={saving}
                >
                  Hapus
                </button>
              </div>

              <Input
                value={faq.question}
                onChange={(e) => updateFaq(idx, "question", e.target.value)}
                placeholder="Pertanyaan..."
                className="mb-4"
                disabled={saving}
              />

              <TextArea
                value={faq.answer}
                onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                placeholder="Jawaban lengkap..."
                rows={5}
                disabled={saving}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2.5 text-xs text-blue-300 hover:bg-blue-500/20"
            disabled={saving}
          >
            + Tambah Pertanyaan Baru
          </button>
        </div>
      </form>
    </div>
  );
}