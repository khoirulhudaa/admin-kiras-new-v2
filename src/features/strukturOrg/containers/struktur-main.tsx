import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Theme Tokens
const THEME_TOKENS = {
  smkn13: {
    '--brand-primary': '#10b981',
    '--brand-primaryText': '#ffffff',
    '--brand-accent': '#f59e0b',
    '--brand-bg': '#0a0a0a',
    '--brand-surface': 'rgba(24,24,27,0.8)',
    '--brand-surfaceText': '#f3f4f6',
    '--brand-subtle': '#27272a',
    '--brand-pop': '#3b82f6',
  },
};

// Utility: clsx
const clsx = (...args) => args.filter(Boolean).join(' ');

// Mini Icons
const Icon = ({ label }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: 'inline-flex', justifyContent: 'center' }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IPlus = () => <Icon label="＋" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;
const ISpinner = () => (
  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
);

// Utility Components
const Field = ({ label, hint, children, className }) => (
  <label className={clsx('block', className)}>
    {label && <div className="mb-1 text-xs font-medium text-white">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      'w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none',
      className
    )}
  />
);

const ImageUpload = ({ value, onChange, label = 'Unggah Foto' }) => {
  const fileRef = useRef(null);
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onChange(f);
  };
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="mb-2 text-xs font-medium text-white">{label}</div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="text-xs"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs"
        >
          Pilih File
        </button>
      </div>
      {value && (
        <div className="mt-3">
          <img
            src={typeof value === 'string' ? `https://dev.kiraproject.id${value}` : URL.createObjectURL(value)}
            alt="preview"
            className="max-h-[200px] w-[200px] rounded-lg border border-white/10"
          />
        </div>
      )}
    </div>
  );
};

// Custom useAlert Hook
const useAlert = () => {
  const [alert, setAlert] = useState({ message: '', isVisible: false });

  const showAlert = useCallback((message) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: '', isVisible: false }), 5000);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: '', isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component
const Alert = ({ message, onClose }) => {
  const isSuccess = message.includes('successfully');
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        'mb-4 rounded-xl border p-4 text-sm',
        isSuccess
          ? 'border-green-500/30 bg-green-500/10 text-green-300'
          : 'border-red-500/30 bg-red-500/10 text-red-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            'ml-4',
            isSuccess ? 'text-green-300 hover:text-green-400' : 'text-red-300 hover:text-red-400'
          )}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Data Interface
const Employee = () => ({
  id: null,
  nama: '',
  jabatan: '',
  foto: null,
  sortOrder: '1',
  isActive: true,
});

const API_URL = 'https://dev.kiraproject.id/api/school-employees';

export const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
  const { alert, showAlert, hideAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch employees (GET)
  const fetchEmployees = async () => {
    if (!token) {
      showAlert('Token autentikasi tidak ditemukan. Silakan login.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
        params: { t: new Date().getTime() },
      });
      const normalizedData = response.data.data.map((employee) => ({
        ...employee,
        isActive: employee.isActive !== undefined ? employee.isActive : true,
      }));
      setEmployees(normalizedData);
    } catch (err) {
      console.error('Error fetching employees:', err);
      showAlert('Gagal memuat data pegawai');
    } finally {
      setLoading(false);
    }
  };

  // Create employee (POST)
  const createEmployee = async (employee) => {
    try {
      const formData = new FormData();
      formData.append('nama', employee.nama);
      formData.append('jabatan', employee.jabatan);
      formData.append('sortOrder', employee.sortOrder);
      formData.append('isActive', employee.isActive.toString());
      if (employee.foto) formData.append('foto', employee.foto);

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchEmployees();
      showAlert('Data saved successfully');
    } catch (err) {
      console.error('Error creating employee:', err);
      showAlert('Gagal menambahkan pegawai');
      throw err;
    }
  };

  // Update employee (PUT)
  const updateEmployee = async (id, employee) => {
    try {
      const formData = new FormData();
      formData.append('nama', employee.nama);
      formData.append('jabatan', employee.jabatan);
      formData.append('sortOrder', employee.sortOrder);
      formData.append('isActive', employee.isActive.toString());
      if (employee.foto && employee.foto instanceof File) {
        formData.append('foto', employee.foto);
      }

      await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchEmployees();
      showAlert('Data updated successfully');
    } catch (err) {
      console.error('Error updating employee:', err);
      showAlert('Gagal memperbarui pegawai');
      throw err;
    }
  };

  // Delete employee (DELETE)
  const deleteEmployee = async (id) => {
    setDeleteLoadingIds((prev) => [...prev, id]);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchEmployees();
      showAlert('Data deleted successfully');
    } catch (err) {
      console.error('Error deleting employee:', err);
      showAlert('Gagal menghapus pegawai');
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle adding new employee
  const addEmployee = () => {
    setEditingEmployee(Employee());
    setIsModalOpen(true);
  };

  // Handle editing existing employee
  const startEditing = (employee) => {
    setEditingEmployee({ ...employee });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditingEmployee((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployee.nama || !editingEmployee.jabatan) {
      showAlert('Nama dan jabatan harus diisi');
      return;
    }
    setLoading(true);
    try {
      if (editingEmployee.id) {
        await updateEmployee(editingEmployee.id, editingEmployee);
      } else {
        await createEmployee(editingEmployee);
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      // Errors are handled in createEmployee/updateEmployee
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen py-6" style={THEME_TOKENS.smkn13}>
      {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Daftar Pegawai</div>
          <button
            type="button"
            onClick={addEmployee}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 disabled:opacity-50"
          >
            <IPlus /> Tambah Pegawai
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading && !isModalOpen && (
            <div className="flex justify-center py-4">
              <ISpinner />
            </div>
          )}
          {!loading && (
            <table className="min-w-full border-collapse border border-white/20">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Nama</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Jabatan</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Urutan</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Status Aktif</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Foto</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-white/20">
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.nama}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.jabatan}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.sortOrder}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{employee.isActive ? 'Aktif' : 'Nonaktif'}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      {employee.foto ? (
                        <img
                          src={`https://dev.kiraproject.id${employee.foto}`}
                          alt="employee"
                          className="max-h-[50px] w-[50px] rounded-lg border border-white/10"
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(employee)}
                          disabled={loading || deleteLoadingIds.includes(employee.id)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
                        >
                          <IEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEmployee(employee.id)}
                          disabled={loading || deleteLoadingIds.includes(employee.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
                        >
                          {deleteLoadingIds.includes(employee.id) ? <ISpinner /> : <><IDelete /> Hapus</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
                      Tidak ada data pegawai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Form */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                  <Dialog.Title className="mb-3 text-sm font-semibold text-white">
                    {editingEmployee?.id ? 'Edit Pegawai' : 'Tambah Pegawai'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Nama">
                        <Input
                          value={editingEmployee?.nama || ''}
                          onChange={(e) => handleInputChange('nama', e.target.value)}
                          placeholder="Masukkan nama pegawai"
                          disabled={loading}
                        />
                      </Field>
                      <Field label="Jabatan">
                        <Input
                          value={editingEmployee?.jabatan || ''}
                          onChange={(e) => handleInputChange('jabatan', e.target.value)}
                          placeholder="Masukkan jabatan"
                          disabled={loading}
                        />
                      </Field>
                      <Field label="Urutan">
                        <Input
                          type="number"
                          value={editingEmployee?.sortOrder || '1'}
                          onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                          placeholder="Masukkan urutan"
                          disabled={loading}
                        />
                      </Field>
                      <Field label="Status Aktif">
                        <select
                          value={editingEmployee?.isActive !== undefined ? editingEmployee.isActive.toString() : 'true'}
                          onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                          className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                          disabled={loading}
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Nonaktif</option>
                        </select>
                      </Field>
                      <div className="md:col-span-2">
                        <ImageUpload
                          value={editingEmployee?.foto}
                          onChange={(file) => handleInputChange('foto', file)}
                          label="Foto Pegawai (opsional)"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
                        disabled={loading}
                      >
                        {loading ? <ISpinner /> : <ISave />} {editingEmployee?.id ? 'Update' : 'Simpan'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};