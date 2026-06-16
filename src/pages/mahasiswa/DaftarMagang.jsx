import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Upload,
  Loader2
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import api from '@/api/axios'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MAHASISWA_MENU } from '@/constants/mahasiswaMenu'
import InputField from '../../components/form/InputField'
import PageTitle from '../../components/common/PageTitle'

export default function DaftarMagang() {
  const [showForm, setShowForm] = useState(false)
  const { user, mahasiswa, pendaftaran } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const sudahDaftar =
    pendaftaran &&
    [
        'menunggu_persetujuan',
        'disetujui',
        'aktif',
    ].includes(pendaftaran.status)

  const [form, setForm] = useState({
    tanggal_mulai: '',
    tanggal_selesai: '',
    surat_pengantar: null,
  })

  const isFormValid =
    form.tanggal_mulai &&
    form.tanggal_selesai &&
    form.surat_pengantar

    const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        setSubmitting(true)
        const data = new FormData()

        data.append(
        'tanggal_mulai',
        form.tanggal_mulai
        )

        data.append(
        'tanggal_selesai',
        form.tanggal_selesai
        )

        data.append(
        'file_surat',
        form.surat_pengantar
        )

        await api.post(
        '/mahasiswa/daftar',
        data,
        {
            headers: {
            'Content-Type':
                'multipart/form-data',
            },
        }
        )

        alert('Pendaftaran berhasil dikirim')
        setShowForm(false)
        window.location.reload()
    } catch (err) {
        setErrorMessage(
            err.response?.data?.message ||
            'Gagal mengirim pendaftaran'
            )
        } finally {
        setSubmitting(false)
    }
  }

  return (
    <>
      <PageTitle title="Dashboard Mahasiswa" />
        <DashboardLayout menuItems={MAHASISWA_MENU}>
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              bg-white p-20 rounded-3xl
              border border-gray-100
              text-center shadow-sm
            "
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ClipboardList
                size={52}
                className="mx-auto text-blue-600 mb-6"
              />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800">
              Form Pendaftaran Magang
            </h2>

            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Lengkapi data diri dan unggah dokumen
              persyaratan untuk mengajukan magang.
            </p>

            {sudahDaftar ? (
            <div
                className="
                mt-8
                inline-flex items-center
                px-6 py-3
                rounded-xl
                bg-green-50
                border border-green-200
                text-green-700
                font-semibold
                "
            >
                Pendaftaran sudah dikirim
            </div>
            ) : (
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowForm(true)}
                className="
                mt-8
                bg-blue-600 hover:bg-blue-700
                text-white
                px-8 py-3
                rounded-xl
                font-semibold
                shadow-lg shadow-blue-200
                transition
                "
            >
                Mulai Pendaftaran
            </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="
              bg-white
              rounded-3xl
              border border-gray-100
              shadow-sm
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800">
                Pendaftaran Magang
              </h1>

              <p className="text-gray-500 mt-2">
                Isi seluruh data dengan benar.
              </p>
            </div>

            {/* Form */}
            <form 
            onSubmit={handleSubmit}
            className="p-8 space-y-8">
                {errorMessage && (
                    <div
                        className="
                        bg-red-50 border border-red-200
                        text-red-600
                        px-4 py-3 rounded-xl
                        text-sm font-medium
                        "
                    >
                        {errorMessage}
                    </div>
                )}
                
              {/* Informasi Pribadi */}
                <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800">
                    Informasi Pribadi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                    </label>

                    <input
                        type="text"
                        value={user?.nama_lengkap || ''}
                        readOnly
                        className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-xl
                        bg-gray-50
                        text-gray-600
                        cursor-not-allowed
                        "
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-xl
                        bg-gray-50
                        text-gray-600
                        cursor-not-allowed
                        "
                    />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asal Sekolah / Kampus
                    </label>

                    <input
                        type="text"
                        value={user?.profile?.asal_instansi || ''}
                        readOnly
                        className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-xl
                        bg-gray-50
                        text-gray-600
                        cursor-not-allowed
                        "
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jurusan
                    </label>

                    <input
                        type="text"
                        value={user?.profile?.program_studi || ''}
                        readOnly
                        className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-xl
                        bg-gray-50
                        text-gray-600
                        cursor-not-allowed
                        "
                    />
                    </div>
                </div>
                </div>

              {/* Periode */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Periode Magang
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>

                    <InputField
                     type="date"
                     value={form.tanggal_mulai}
                     onChange={(e) =>
                      setForm({
                       ...form,
                       tanggal_mulai: e.target.value,
                      })
                     }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai
                    </label>

                    <InputField
                    type="date"
                    value={form.tanggal_selesai}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        tanggal_selesai: e.target.value,
                        })
                    }
                    />
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Dokumen Persyaratan
                </h2>

                <label
                  className="
                    border-2 border-dashed border-gray-200
                    rounded-2xl
                    p-10
                    flex flex-col items-center justify-center
                    text-center
                    cursor-pointer
                    hover:border-blue-400
                    hover:bg-blue-50/30
                    transition
                  "
                >
                  <Upload
                    size={40}
                    className="text-blue-600 mb-4"
                  />

                  <p className="font-semibold text-gray-700">
                    Upload Surat Pengantar
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    PDF maksimal 2MB
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                        setForm({
                        ...form,
                        surat_pengantar: e.target.files[0],
                        })
                    }
                    />

                    {form.surat_pengantar && (
                    <p className="mt-3 text-sm text-blue-600 font-medium">
                        {form.surat_pengantar.name}
                    </p>
                    )}
                </label>
              </div>

              {/* Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="
                    px-6 py-3 rounded-xl
                    border border-gray-200
                    font-medium
                    hover:bg-gray-50
                  "
                >
                  Batal
                </button>

                <motion.button
                    whileHover={isFormValid ? { scale: 1.02 } : {}}
                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className={`
                        px-8 py-3 rounded-xl
                        font-semibold
                        transition
                        ${
                        isFormValid
                            ? `
                            bg-blue-600 hover:bg-blue-700
                            text-white
                            shadow-lg shadow-blue-200
                            `
                            : `
                            bg-gray-200
                            text-gray-400
                            cursor-not-allowed
                            `
                        }
                        ${submitting
                        ? 'Mengirim...'
                        : 'Kirim Pendaftaran'}
                    `}
                    >
                    Kirim Pendaftaran
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
    </>
  )
}