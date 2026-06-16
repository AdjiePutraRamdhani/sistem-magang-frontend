import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Download,
  Loader2,
  Calendar,
  Building2,
  User,
  FileBadge,
} from 'lucide-react'

import api from '@/api/axios'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MAHASISWA_MENU } from '@/constants/mahasiswaMenu'
import PageTitle from '../../components/common/PageTitle'

export default function Sertifikat() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSertifikat()
  }, [])

  const fetchSertifikat = async () => {
    try {
      setLoading(true)

      const response = await api.get('/mahasiswa/sertifikat')

      setData(response.data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat data sertifikat')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout menuItems={MAHASISWA_MENU}>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2
              size={50}
              className="animate-spin text-blue-600 mx-auto"
            />

            <p className="mt-4 text-gray-500">
              Memuat sertifikat...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout menuItems={MAHASISWA_MENU}>
        <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-2xl">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <PageTitle title="Dashboard Mahasiswa" />
        <DashboardLayout menuItems={MAHASISWA_MENU}>
      {!data?.tersedia ? (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            bg-white rounded-3xl
            border border-gray-100
            shadow-sm
            p-12 md:p-20
            text-center
          "
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              w-24 h-24
              rounded-full
              bg-gradient-to-br
              from-blue-50
              to-indigo-100
              flex items-center justify-center
              mx-auto mb-6
            "
          >
            <Award
              size={42}
              className="text-blue-600"
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800">
            Sertifikat Belum Tersedia
          </h2>

          <p className="text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
            {data?.pesan ||
              'Sertifikat akan tersedia setelah pembimbing menyelesaikan proses penilaian dan mengunggah sertifikat magang Anda.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div
            className="
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              rounded-3xl
              p-8
              text-white
              shadow-lg
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-white/15
                  flex items-center justify-center
                "
              >
                <Award size={32} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Sertifikat Magang
                </h1>

                <p className="text-blue-100 mt-1">
                  Sertifikat telah diterbitkan dan siap diunduh.
                </p>
              </div>
            </div>
          </div>

          {/* Detail */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-gray-100
              shadow-sm
              overflow-hidden
            "
          >
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<User size={18} />}
                  label="Nama Peserta"
                  value={data.sertifikat.nama_lengkap}
                />

                <InfoItem
                  icon={<Building2 size={18} />}
                  label="Instansi"
                  value={data.sertifikat.asal_instansi}
                />

                <InfoItem
                  icon={<FileBadge size={18} />}
                  label="Nomor Sertifikat"
                  value={data.sertifikat.no_sertifikat}
                />

                <InfoItem
                  icon={<Calendar size={18} />}
                  label="Tanggal Terbit"
                  value={data.sertifikat.diterbitkan_at}
                />
              </div>

              <div className="mt-8">
                <a
                  href={data.sertifikat.url_pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center gap-2
                    px-6 py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    transition-all
                    hover:scale-105
                  "
                >
                  <Download size={18} />
                  Unduh Sertifikat
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
    </>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div
      className="
        p-5 rounded-2xl
        border border-gray-100
        bg-gray-50/60
      "
    >
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="font-bold text-gray-800">
        {value || '-'}
      </p>
    </div>
  )
}