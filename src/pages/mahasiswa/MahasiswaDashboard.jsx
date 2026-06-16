import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatTanggal } from '@/utils/formatTanggal'

import api from '@/api/axios'
import {
  ClipboardList,
  Users,
  LayoutDashboard,
  UserRound,
  ArrowRight,
  Loader2,
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { MAHASISWA_MENU } from '@/constants/mahasiswaMenu'

export default function MahasiswaDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await api.get(
        '/mahasiswa/dashboard'
      )

      setData(
        res.data
      )
    } catch (err) {
      console.error(err)
      setError('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  console.log(data)
  console.log(data?.pendaftaran.tanggal_mulai)
  console.log(data?.mahasiswa.nama_lengkap)


  const statusText = !data?.pendaftaran
  ? 'Belum Terdaftar'
  : data?.pendaftaran.status ===
    'menunggu_persetujuan'
  ? 'Menunggu Persetujuan'
  : data?.pendaftaran.status === 'disetujui'
  ? 'Disetujui'
  : data?.pendaftaran.status === 'aktif'
  ? 'Magang Aktif'
  : data?.pendaftaran.status ===
    'selesai_dinilai'
  ? 'Selesai Dinilai'
  : data?.pendaftaran.status ===
    'sudah_sertifikat'
  ? 'Selesai Magang'
  : 'Ditolak'

  const currentStep = (() => {
    if (!data?.pendaftaran) return 1

    switch (data?.pendaftaran.status) {
      case 'menunggu_persetujuan':
        return 2

      case 'disetujui':
        return 3

      case 'aktif':
        return 4

      case 'selesai_dinilai':
        return 5

      case 'sudah_sertifikat':
        return 6

      case 'ditolak':
        return 1

      default:
        return 1
    }
  })()
  
  const steps = [
    {
      id: 1,
      label: 'Registrasi akun',
    },
    {
      id: 2,
      label: 'Menunggu persetujuan',
    },
    {
      id: 3,
      label: 'Disetujui',
    },
    {
      id: 4,
      label: 'Magang aktif',
    },
    {
      id: 5,
      label: 'Selesai dinilai',
    },
    {
      id: 6,
      label: 'Sertifikat',
    },
  ]

  const stats = [
    {
      title: 'Status Pendaftaran',
      value: statusText,
      tanggal_mulai:
        data?.pendaftaran.tanggal_mulai,
      tanggal_selesai:
        data?.pendaftaran.tanggal_selesai,
      icon: ClipboardList,
      color: 'bg-blue-600',
    },
    {
      title: 'Pembimbing',
      value:
        data?.pendaftaran?.pembimbing.nama_lengkap ||
        'Belum Ditentukan',
      jabatan:
        data?.pendaftaran?.pembimbing.jabatan,
      bidang:
        data?.pendaftaran?.pembimbing.bidang,
      phone:
        data?.pendaftaran?.pembimbing.no_telepon,
      icon: Users,
      color: 'bg-emerald-600',
    },
    {
      title: 'Personal Info',
      value:
        data?.mahasiswa.nama_lengkap,
      email:
        data?.mahasiswa.email,
      nim_nisn:
        data?.mahasiswa.nim_nisn,
      program_studi:
        data?.mahasiswa.program_studi,
      asal_instansi:
        data?.mahasiswa.asal_instansi,
      icon: UserRound,
      color: 'bg-violet-600',
    },
  ]

  if (loading) {
    return (
      <DashboardLayout
        menuItems={MAHASISWA_MENU}
        title="Dashboard Mahasiswa"
      >
        <div className="
          flex items-center justify-center
          h-[70vh]
        ">
          <div className="text-center">

            <Loader2
              size={50}
              className="
                animate-spin
                text-blue-600
                mx-auto
              "
            />

            <p className="mt-5 text-gray-500">
              Memuat data...
            </p>

          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        menuItems={MAHASISWA_MENU}
        title="Dashboard Mahasiswa"
      >
        <div className="
          bg-red-50
          border border-red-200
          text-red-600
          p-5
          rounded-2xl
        ">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout menuItems={MAHASISWA_MENU}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Hero Section */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            relative overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            via-blue-900
            to-indigo-900
            p-8 md:p-10
            text-white
          "
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full" />
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-white rounded-full" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold leading-tight"
            >
              Selamat Datang 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-blue-100 text-lg leading-relaxed"
            >
              Pantau proses magangmu mulai dari
              pendaftaran hingga sertifikat selesai.
            </motion.p>

            {!loading && !data?.pendaftaran && (
              <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/mahasiswa/daftar')}
              className="
                mt-8
                inline-flex items-center gap-2
                bg-white text-blue-700
                px-6 py-3
                rounded-xl
                font-semibold
                shadow-lg
                hover:bg-blue-50
                transition
              "
            >
              Daftar Magang
              <ArrowRight size={18} />
            </motion.button>
            )}
          </div>
        </motion.div>
        

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-100
            p-8
          "
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Progress Magang
              </h2>

              <p className="text-gray-500 mt-1">
                Ikuti perkembangan proses magangmu
              </p>
            </div>

            <div className="
              hidden md:flex
              bg-blue-50
              text-blue-700
              px-4 py-2
              rounded-xl
              text-sm
              font-semibold
            ">
              Step {currentStep} / 6
            </div>
          </div>

          <div className="relative">
            {/* Line */}
            <div
              className="
                absolute top-5 left-0
                h-[3px]
                bg-blue-600
                rounded-full
                transition-all duration-500
              "
              style={{
                width: `${((currentStep - 1) / 5) * 100}%`,
              }}
            />

            <div className="
              absolute top-5 left-0
              w-[20%] h-[3px]
              bg-blue-600
              rounded-full
              transition-all duration-500
            " />

            <div className="
              relative
              grid grid-cols-2 md:grid-cols-6
              gap-8
            ">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`
                      w-12 h-12 rounded-2xl
                      flex items-center justify-center
                      font-bold text-sm
                      transition-all duration-300
                      ${
                        step.id <= currentStep
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>

                  <p
                    className={`
                      mt-4 text-xs font-bold uppercase leading-relaxed
                      ${
                        step.id <= currentStep
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="
              mt-12
              bg-blue-50
              border border-blue-100
              rounded-2xl
              p-5
              flex items-center gap-3
            "
          >
            <span className="text-2xl">
              📝
            </span>

            <div className="text-sm text-blue-700 font-medium">
              {!data?.pendaftaran ? (
                <p>Kamu belum melakukan pendaftaran magang.</p>
              ) : data?.pendaftaran.status === 'menunggu_persetujuan' ? (
                <p>Pendaftaran sedang menunggu persetujuan admin.</p>
              ) : data?.pendaftaran.status === 'disetujui' ? (
                <p>Pendaftaran magang telah disetujui.</p>
              ) : data?.pendaftaran.status === 'ditolak' ? (
                <>
                  <p>Pendaftaran magang ditolak.</p>

                  {data?.pendaftaran.alasan_tolak && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-red-700">
                        Alasan Penolakan:
                      </p>
                      <p className="text-red-600">
                        {data?.pendaftaran.alasan_tolak}
                      </p>
                    </div>
                  )}
                </>
              ) : data?.pendaftaran.status === 'aktif' ? (
                <p>Magang sedang berlangsung.</p>
              ) : data?.pendaftaran.status === 'selesai_dinilai' ? (
                <p>
                  Sudah dinilai dan menunggu pembimbing mengupload
                  sertifikat magang.
                </p>
              ) : data?.pendaftaran.status === 'sudah_sertifikat' ? (
                <p>
                  Magang selesai dan sertifikat magang sudah terbit.
                </p>
              ) : (
                <p>Status tidak diketahui.</p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                className="
                  bg-white
                  rounded-3xl
                  border border-gray-100
                  p-6
                  shadow-sm
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center mb-5
                    ${item.color}
                  `}
                >
                  <Icon
                    size={22}
                    className="text-white"
                  />
                </div>

                <p className="text-gray-500 text-sm font-medium">
                  {item.title}
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {item.value}
                </h3>

                {item.jabatan && (
                  <p className="text-sm text-gray-600 mt-2">
                    Jabatan: {item.jabatan}
                  </p>
                )}

                {item.bidang && (
                  <p className="text-sm text-gray-500">
                    Bidang: {item.bidang}
                  </p>
                )}

                {item.phone && (
                  <p className="text-sm text-blue-600 mt-2">
                    📞 {item.phone}
                  </p>
                )}

                {item.email && (
                  <p className="text-sm text-gray-600 mt-2">
                    {item.email}
                  </p>
                )}

                {item.nim_nisn && (
                  <p className="text-sm text-gray-500">
                    NIM: {item.nim_nisn}
                  </p>
                )}

                {item.program_studi && (
                  <p className="text-sm text-gray-500">
                    Jurusan: {item.program_studi}
                  </p>
                )}

                {item.asal_instansi && (
                  <p className="text-sm text-gray-500">
                    Asal Instansi: {item.asal_instansi}
                  </p>
                )}

                {item.tanggal_mulai && (
                  <p className="text-sm text-gray-500 mt-2">
                    Mulai: {formatTanggal(item.tanggal_mulai)}
                  </p>
                )}

                {item.tanggal_selesai && (
                  <p className="text-sm text-gray-500">
                    Selesai: {formatTanggal(item.tanggal_selesai)}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}