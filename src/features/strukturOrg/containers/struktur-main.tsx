// import { Dialog, Transition } from '@headlessui/react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import React, { useCallback, useEffect, useRef, useState } from 'react';

// // Theme Tokens
// const THEME_TOKENS = {
//   smkn13: {
//     '--brand-primary': '#10b981',
//     '--brand-primaryText': '#ffffff',
//     '--brand-accent': '#f59e0b',
//     '--brand-bg': '#0a0a0a',
//     '--brand-surface': 'rgba(24,24,27,0.8)',
//     '--brand-surfaceText': '#f3f4f6',
//     '--brand-subtle': '#27272a',
//     '--brand-pop': '#3b82f6',
//   },
// };

// // Utility: clsx
// const clsx = (...args) => args.filter(Boolean).join(' ');

// // Mini Icons
// const Icon = ({ label }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16, display: 'inline-flex', justifyContent: 'center' }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;
// const IPlus = () => <Icon label="＋" />;
// const IEdit = () => <Icon label="✏️" />;
// const IDelete = () => <Icon label="🗑️" />;
// const ISpinner = () => (
//   <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
// );

// // Utility Components
// const Field = ({ label, hint, children, className }) => (
//   <label className={clsx('block', className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
//       className
//     )}
//   />
// );

// const ImageUpload = ({ value, onChange, label = 'Unggah Foto' }) => {
//   const fileRef = useRef(null);
//   const onPick = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     onChange(f);
//   };
//   return (
//     <div className="rounded-xl border border-white/10 p-3">
//       <div className="mb-2 text-xs font-medium text-white">{label}</div>
//       <div className="flex items-center gap-3">
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           onChange={onPick}
//           className="text-xs"
//         />
//         <button
//           type="button"
//           onClick={() => fileRef.current?.click()}
//           className="rounded-lg border border-white/20 px-3 py-1.5 text-xs"
//         >
//           Pilih File
//         </button>
//       </div>
//       {value && (
//         <div className="mt-3">
//           <img
//             src={typeof value === 'string' ? `https://dev.kiraproject.id${value}` : URL.createObjectURL(value)}
//             alt="preview"
//             className="max-h-[200px] w-[200px] rounded-lg border border-white/10"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// // Custom useAlert Hook
// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: '', isVisible: false });

//   const showAlert = useCallback((message) => {
//     setAlert({ message, isVisible: true });
//     setTimeout(() => setAlert({ message: '', isVisible: false }), 5000);
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: '', isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// // Alert Component
// const Alert = ({ message, onClose }) => {
//   const isSuccess = message.includes('successfully');
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         'mb-4 rounded-xl border p-4 text-sm',
//         isSuccess
//           ? 'border-green-500/30 bg-green-500/10 text-green-300'
//           : 'border-red-500/30 bg-red-500/10 text-red-300'
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             'ml-4',
//             isSuccess ? 'text-green-300 hover:text-green-400' : 'text-red-300 hover:text-red-400'
//           )}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // Data Interface
// const Employee = () => ({
//   id: null,
//   nama: '',
//   jabatan: '',
//   foto: null,
//   sortOrder: '1',
//   isActive: true,
// });

// const API_URL = 'https://dev.kiraproject.id/api/school-employees';

// export const EmployeeManager = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
//   const { alert, showAlert, hideAlert } = useAlert();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);

//   const token = localStorage.getItem('token');

//   // Fetch employees (GET)
//   const fetchEmployees = async () => {
//     if (!token) {
//       showAlert('Token autentikasi tidak ditemukan. Silakan login.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.get(API_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Cache-Control': 'no-cache',
//           Pragma: 'no-cache',
//           Expires: '0',
//         },
//         params: { t: new Date().getTime() },
//       });
//       const normalizedData = response.data.data.map((employee) => ({
//         ...employee,
//         isActive: employee.isActive !== undefined ? employee.isActive : true,
//       }));
//       setEmployees(normalizedData);
//     } catch (err) {
//       console.error('Error fetching employees:', err);
//       showAlert('Gagal memuat data pegawai');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create employee (POST)
//   const createEmployee = async (employee) => {
//     try {
//       const formData = new FormData();
//       formData.append('nama', employee.nama);
//       formData.append('jabatan', employee.jabatan);
//       formData.append('sortOrder', employee.sortOrder);
//       formData.append('isActive', employee.isActive.toString());
//       if (employee.foto) formData.append('foto', employee.foto);

//       await axios.post(API_URL, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       await fetchEmployees();
//       showAlert('Data saved successfully');
//     } catch (err) {
//       console.error('Error creating employee:', err);
//       showAlert('Gagal menambahkan pegawai');
//       throw err;
//     }
//   };

//   // Update employee (PUT)
//   const updateEmployee = async (id, employee) => {
//     try {
//       const formData = new FormData();
//       formData.append('nama', employee.nama);
//       formData.append('jabatan', employee.jabatan);
//       formData.append('sortOrder', employee.sortOrder);
//       formData.append('isActive', employee.isActive.toString());
//       if (employee.foto && employee.foto instanceof File) {
//         formData.append('foto', employee.foto);
//       }

//       await axios.put(`${API_URL}/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       await fetchEmployees();
//       showAlert('Data updated successfully');
//     } catch (err) {
//       console.error('Error updating employee:', err);
//       showAlert('Gagal memperbarui pegawai');
//       throw err;
//     }
//   };

//   // Delete employee (DELETE)
//   const deleteEmployee = async (id) => {
//     setDeleteLoadingIds((prev) => [...prev, id]);
//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       await fetchEmployees();
//       showAlert('Data deleted successfully');
//     } catch (err) {
//       console.error('Error deleting employee:', err);
//       showAlert('Gagal menghapus pegawai');
//     } finally {
//       setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
//     }
//   };

//   // Fetch employees on mount
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Handle adding new employee
//   const addEmployee = () => {
//     setEditingEmployee(Employee());
//     setIsModalOpen(true);
//   };

//   // Handle editing existing employee
//   const startEditing = (employee) => {
//     setEditingEmployee({ ...employee });
//     setIsModalOpen(true);
//   };

//   // Handle form input changes
//   const handleInputChange = (field, value) => {
//     setEditingEmployee((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingEmployee.nama || !editingEmployee.jabatan) {
//       showAlert('Nama dan jabatan harus diisi');
//       return;
//     }
//     setLoading(true);
//     try {
//       if (editingEmployee.id) {
//         await updateEmployee(editingEmployee.id, editingEmployee);
//       } else {
//         await createEmployee(editingEmployee);
//       }
//       setIsModalOpen(false);
//       setEditingEmployee(null);
//     } catch (err) {
//       // Errors are handled in createEmployee/updateEmployee
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle modal close
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingEmployee(null);
//   };

//   return (
//     <div className="min-h-screen py-6" style={THEME_TOKENS.smkn13}>
//       {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       <div className="rounded-2xl border border-white/20 p-4">
//         <div className="mb-3 flex items-center justify-between">
//           <div className="text-sm font-semibold text-white">Daftar Pegawai</div>
//           <button
//             type="button"
//             onClick={addEmployee}
//             disabled={loading}
//             className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 disabled:opacity-50"
//           >
//             <IPlus /> Tambah Pegawai
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           {loading && !isModalOpen && (
//             <div className="flex justify-center py-4">
//               <ISpinner />
//             </div>
//           )}
//           {!loading && (
//             <table className="min-w-full border-collapse border border-white/20">
//               <thead>
//                 <tr className="bg-white/10">
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Nama</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Jabatan</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Urutan</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Status Aktif</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Foto</th>
//                   <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((employee) => (
//                   <tr key={employee.id} className="border-b border-white/20">
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.nama}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.jabatan}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.sortOrder}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.isActive ? 'Aktif' : 'Nonaktif'}</td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">
//                       {employee.foto ? (
//                         <img
//                           src={`https://dev.kiraproject.id${employee.foto}`}
//                           alt="employee"
//                           className="max-h-[50px] w-[50px] rounded-lg border border-white/10"
//                         />
//                       ) : (
//                         '-'
//                       )}
//                     </td>
//                     <td className="border border-white/20 px-4 py-2 text-sm text-white">
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           onClick={() => startEditing(employee)}
//                           disabled={loading || deleteLoadingIds.includes(employee.id)}
//                           className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
//                         >
//                           <IEdit /> Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => deleteEmployee(employee.id)}
//                           disabled={loading || deleteLoadingIds.includes(employee.id)}
//                           className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
//                         >
//                           {deleteLoadingIds.includes(employee.id) ? <ISpinner /> : <><IDelete /> Hapus</>}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {employees.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
//                       Tidak ada data pegawai
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Modal for Form */}
//       <Transition appear show={isModalOpen} as={React.Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-90" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-3xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
//                   <Dialog.Title className="mb-3 text-sm font-semibold text-white">
//                     {editingEmployee?.id ? 'Edit Pegawai' : 'Tambah Pegawai'}
//                   </Dialog.Title>
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid gap-4 md:grid-cols-2">
//                       <Field label="Nama">
//                         <Input
//                           value={editingEmployee?.nama || ''}
//                           onChange={(e) => handleInputChange('nama', e.target.value)}
//                           placeholder="Masukkan nama pegawai"
//                           disabled={loading}
//                         />
//                       </Field>
//                       <Field label="Jabatan">
//                         <Input
//                           value={editingEmployee?.jabatan || ''}
//                           onChange={(e) => handleInputChange('jabatan', e.target.value)}
//                           placeholder="Masukkan jabatan"
//                           disabled={loading}
//                         />
//                       </Field>
//                       <Field label="Urutan">
//                         <Input
//                           type="number"
//                           value={editingEmployee?.sortOrder || '1'}
//                           onChange={(e) => handleInputChange('sortOrder', e.target.value)}
//                           placeholder="Masukkan urutan"
//                           disabled={loading}
//                         />
//                       </Field>
//                       <Field label="Status Aktif">
//                         <select
//                           value={editingEmployee?.isActive !== undefined ? editingEmployee.isActive.toString() : 'true'}
//                           onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
//                           className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
//                           disabled={loading}
//                         >
//                           <option value="true">Aktif</option>
//                           <option value="false">Nonaktif</option>
//                         </select>
//                       </Field>
//                       <div className="md:col-span-2">
//                         <ImageUpload
//                           value={editingEmployee?.foto}
//                           onChange={(file) => handleInputChange('foto', file)}
//                           label="Foto Pegawai (opsional)"
//                         />
//                       </div>
//                     </div>
//                     <div className="flex justify-end gap-2 mt-4">
//                       <button
//                         type="button"
//                         onClick={handleCloseModal}
//                         className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
//                         disabled={loading}
//                       >
//                         {loading ? <ISpinner /> : <ISave />} {editingEmployee?.id ? 'Update' : 'Simpan'}
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };



// pages/OrganisasiSekolah.tsx (atau components/OrganisasiMain.tsx)
import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSpinner, FaTrash, FaTimes } from "react-icons/fa";

const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-5 rounded-xl border p-4 text-sm shadow-sm",
        isSuccess ? "border-green-500/30 bg-green-900/20 text-green-200" : "border-red-500/30 bg-red-900/20 text-red-200"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line leading-relaxed">{message}</div>
        <button type="button" onClick={onClose} className="ml-3 text-lg font-bold">✕</button>
      </div>
    </motion.div>
  );
};

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

interface OrganizationItem {
  id: number;
  position: string;
  parentId: number | null;
  assignedEmployeeId: number | null;
  description?: string | null;
  schoolId: number;
  isActive: boolean;
  GuruTendik?: {
    id: number;
    nama: string;
    photoUrl?: string | null;
    jenisKelamin: string;
    role: string;
  } | null;
  Children?: OrganizationItem[];
  Parent?: OrganizationItem | null;
}

interface EmployeeOption {
  id: number;
  nama: string;
  role: string;
}

const API_BASE_ORG = "https://be-school.kiraproject.id/organisasi"; // sesuaikan
const API_GURU_TENDIK = "https://be-school.kiraproject.id/guruTendik"; // sesuaikan endpoint list guru

export default function EmployeeManager() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]); // untuk dropdown assign
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrganizationItem | null>(null);

  // Form state
  const [form, setForm] = useState({
    position: "",
    parentId: "" as string | number, // string untuk select value
    assignedEmployeeId: "" as string | number,
    description: "",
  });

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const { alert, showAlert, hideAlert } = useAlert();

  const fetchOrganizations = useCallback(async () => {
    if (!schoolId) return showAlert("School ID tidak ditemukan");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_ORG}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
      setOrganizations(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat data organisasi: ${err.message}`);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  const fetchEmployees = useCallback(async () => {
    if (!schoolId) return;
    try {
      const res = await fetch(`${API_GURU_TENDIK}?schoolId=${schoolId}`);
      if (!res.ok) throw new Error("Gagal load guru/tendik");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEmployees(json.data.map((e: any) => ({ id: e.id, nama: e.nama, role: e.role })));
      }
    } catch (err) {
      console.error("Gagal load employees:", err);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      fetchOrganizations();
      fetchEmployees();
    }
  }, [schoolId, fetchOrganizations, fetchEmployees]);

  const openModal = (item?: OrganizationItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        position: item.position,
        parentId: item.parentId ?? "",
        assignedEmployeeId: item.assignedEmployeeId ?? "",
        description: item.description ?? "",
      });
    } else {
      setEditingItem(null);
      setForm({ position: "", parentId: "", assignedEmployeeId: "", description: "" });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.position.trim()) return showAlert("Nama posisi wajib diisi");

    const payload = {
      position: form.position.trim(),
      parentId: form.parentId ? Number(form.parentId) : null,
      assignedEmployeeId: form.assignedEmployeeId ? Number(form.assignedEmployeeId) : null,
      description: form.description.trim() || null,
      schoolId: Number(schoolId),
    };

    setLoading(true);
    try {
      let res: Response;
      if (editingItem) {
        // UPDATE
        res = await fetch(`${API_BASE_ORG}/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch(API_BASE_ORG, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal menyimpan");
      }

      showAlert(editingItem ? "Posisi berhasil diperbarui" : "Posisi baru berhasil ditambahkan");
      closeModal();
      fetchOrganizations();
    } catch (err: any) {
      showAlert(`Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus posisi ini? Sub-posisi harus dihapus/dipindah terlebih dahulu.")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_ORG}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Gagal menghapus");
      }
      showAlert("Posisi berhasil dihapus");
      fetchOrganizations();
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (items: OrganizationItem[], level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-4 hover:border-blue-500/40 transition group mb-2",
            level > 0 && "ml-8 border-l-2 border-l-blue-500/40"
          )}
        >
          <div className="flex items-center gap-4 flex-1">
            {item.GuruTendik?.photoUrl ? (
              <img
                src={item.GuruTendik.photoUrl}
                alt={item.GuruTendik.nama}
                className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {item.GuruTendik?.nama?.[0] || "?"}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-white group-hover:text-blue-300 transition">
                {item.position}
              </h4>
              {item.GuruTendik && (
                <p className="text-sm text-white/70">
                  {item.GuruTendik.nama} {item.GuruTendik.jenisKelamin === "Laki-laki" ? "♂" : "♀"}
                </p>
              )}
              {item.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal(item)}
              className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-blue-300 hover:bg-blue-600/40 transition text-sm flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={loading}
              className="rounded-lg bg-red-600/20 px-3 py-1.5 text-red-300 hover:bg-red-600/40 transition text-sm flex items-center gap-1 disabled:opacity-50"
            >
              <FaTrash /> Hapus
            </button>
          </div>
        </div>

        {item.Children && item.Children.length > 0 && (
          <div className="mt-1 mb-4">{renderTree(item.Children, level + 1)}</div>
        )}
      </React.Fragment>
    ));
  };

  const rootItems = organizations.filter((item) => item.parentId === null);

  // Filter parent options: exclude self saat edit, dan hanya yang parentId null atau level atas (opsional)
  const parentOptions = organizations.filter(
    (opt) => !editingItem || opt.id !== editingItem.id // hindari circular
  );

  
  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;
  const IEdit = () => <Icon label="✏️" />;
  const IDelete = () => <Icon label="🗑️" />;

  return (
    <div className="space-y-6 py-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 transition shadow-md"
        >
          <ISave /> Tambah Posisi Baru
        </button>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>


        {loading && !modalOpen ? (
          <div className="py-16 text-center text-white/60 flex items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-2xl" /> Memuat...
          </div>
        ) : rootItems.length === 0 ? (
          <div className="py-16 text-center text-white/50">
            Belum ada struktur organisasi.
            <br />
            Tambahkan posisi baru untuk memulai.
          </div>
        ) : (
          <div className="space-y-2">{renderTree(rootItems)}</div>
        )}
      </div>

      {/* MODAL CREATE / EDIT */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="absolute top-0 right-0 w-full h-screen overflow-auto max-w-md border border-white/10 bg-black/70 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 border-b border-white/30 pb-5">
                <h3 className="text-xl font-bold text-white">
                  {editingItem ? "Edit Posisi" : "Tambah Posisi Baru"}
                </h3>
                <button onClick={closeModal} className="text-white/70 hover:text-white">
                  <X size={30} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-white/80 mb-1">Nama Posisi *</label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white placeholder-white/40 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Wakil Kepala Sekolah Bid. Kurikulum"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-1">Parent Position (opsional)</label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Tidak ada (level atas) --</option>
                    {parentOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-1">Assign ke Guru/Tendik (opsional)</label>
                  <select
                    value={form.assignedEmployeeId}
                    onChange={(e) => setForm({ ...form, assignedEmployeeId: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Belum di-assign --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nama} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-1">Deskripsi Tugas (opsional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white placeholder-white/40 focus:border-blue-500 outline-none min-h-[80px]"
                    placeholder="Tanggung jawab utama posisi ini..."
                  />
                </div>

                <div className="w-full grid grid-cols-2 border-t border-white/30 pt-6 justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    {editingItem ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}