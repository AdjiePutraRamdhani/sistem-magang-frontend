// src/pages/pembimbing/PembimbingDashboard.jsx

import { motion } from 'framer-motion'
import {
  Users,
  CheckSquare,
  Award,
  Clock3,
  ArrowRight,
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { PEMBIMBING_MENU } from '@/constants/pembimbingMenu'

export default function PembimbingDashboard() {
  const stats = [
    {
      title: 'Total Peserta',
      value: '12',
      icon: Users,
      bg: 'bg-blue-600',
    },
    {
      title: 'Belum Dinilai',
      value: '3',
      icon: Clock3,
      bg: 'bg-amber-500',
    },
    {
      title: 'Selesai Dinilai',
      value: '8',
      icon: CheckSquare,
      bg: 'bg-emerald-600',
    },
    {
      title: 'Sertifikat Terbit',
      value: '5',
      icon: Award,
      bg: 'bg-violet-600',
    },
  ]

  const peserta = [
    {
      nama: 'Adjie Putra Ramdhani',
      jurusan: 'Teknik Informatika',
      instansi: 'UIN SUSKA RIAU',
      selesai: '18 Juni 2026',
      status: 'Belum Dinilai',
    },
    {
      nama: 'Nabila Putri',
      jurusan: 'Sistem Informasi',
      instansi: 'Universitas Riau',
      selesai: '22 Juni 2026',
      status: 'Aktif',
    },
  ]

  return (
    <DashboardLayout
      menuItems={PEMBIMBING_MENU}
      title="Dashboard Pembimbing"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Hero */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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

          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Dashboard Pembimbing 👨‍🏫
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="
                mt-4
                text-blue-100
                max-w-2xl
                leading-relaxed
              "
            >
              Pantau peserta magang, proses penilaian,
              serta perkembangan peserta bimbingan
              secara realtime.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                mt-8
                inline-flex items-center gap-2
                bg-white text-blue-700
                px-6 py-3
                rounded-2xl
                font-semibold
                shadow-lg
              "
            >
              Kelola Peserta
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        ">
          {stats.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
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
                    w-14 h-14 rounded-2xl
                    flex items-center justify-center
                    mb-5
                    ${item.bg}
                  `}
                >
                  <Icon
                    size={24}
                    className="text-white"
                  />
                </div>

                <p className="text-gray-500 text-sm font-medium">
                  {item.title}
                </p>

                <h3 className="mt-2 text-4xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </motion.div>
            )
          })}
        </div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="
            flex items-center gap-4
            bg-amber-50
            border border-amber-100
            rounded-2xl
            p-5
          "
        >
          <div className="
            w-12 h-12 rounded-xl
            bg-amber-100
            flex items-center justify-center
          ">
            ⏰
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-amber-900">
              Penilaian Belum Diselesaikan
            </h3>

            <p className="text-sm text-amber-700 mt-1">
              Masih ada peserta yang belum diberikan penilaian akhir.
            </p>
          </div>

          <button className="
            px-5 py-2.5
            rounded-xl
            bg-amber-500
            text-white
            text-sm
            font-semibold
            hover:bg-amber-600
            transition
          ">
            Beri Nilai
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="
            bg-white
            rounded-3xl
            border border-gray-100
            shadow-sm
            overflow-hidden
          "
        >
          <div className="
            p-6
            border-b border-gray-100
            flex items-center justify-between
          ">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Peserta Bimbingan
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Daftar peserta yang sedang dibimbing
              </p>
            </div>

            <button className="
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-700
            ">
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Peserta
                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Instansi
                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Selesai
                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {peserta.map((item, index) => (
                  <motion.tr
                    key={item.nama}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.6 + index * 0.1,
                    }}
                    className="
                      border-b border-gray-50
                      hover:bg-blue-50/40
                      transition
                    "
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="
                          w-12 h-12 rounded-2xl
                          bg-blue-100
                          flex items-center justify-center
                          font-bold text-blue-700
                        ">
                          {item.nama.charAt(0)}
                        </div>

                        <div>
                          <p className="font-bold text-gray-800">
                            {item.nama}
                          </p>

                          <p className="
                            text-xs
                            text-gray-400
                            uppercase
                            mt-1
                            font-semibold
                          ">
                            {item.jurusan}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {item.instansi}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {item.selesai}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`
                        px-3 py-1.5 rounded-full
                        text-xs font-bold
                        border
                        ${
                          item.status === 'Belum Dinilai'
                            ? `
                              bg-amber-50
                              text-amber-600
                              border-amber-100
                            `
                            : `
                              bg-emerald-50
                              text-emerald-600
                              border-emerald-100
                            `
                        }
                      `}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button className="
                        px-5 py-2
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                        text-sm
                        font-semibold
                        hover:bg-blue-100
                        transition
                      ">
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}