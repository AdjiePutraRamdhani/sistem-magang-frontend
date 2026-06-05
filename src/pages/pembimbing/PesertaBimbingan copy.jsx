import { motion } from 'framer-motion'
import {
  Search,
  Users,
  CalendarDays,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { PEMBIMBING_MENU } from '@/constants/pembimbingMenu'

export default function PesertaBimbingan() {
  const peserta = [
    {
      id: 1,
      nama: 'Adjie Putra Ramdhani',
      prodi: 'Teknik Informatika',
      instansi: 'UIN SUSKA RIAU',
      selesai: '18 Juni 2026',
      status: 'Belum Dinilai',
    },
    {
      id: 2,
      nama: 'Nabila Azzahra',
      prodi: 'Sistem Informasi',
      instansi: 'UNILAK',
      selesai: '25 Juni 2026',
      status: 'Aktif',
    },
  ]

  return (
    <DashboardLayout
      menuItems={PEMBIMBING_MENU}
      title="Peserta Bimbingan"
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
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Users size={28} />
              </div>

              <div>
                <p className="text-emerald-100 text-sm font-medium">
                  Dashboard Pembimbing
                </p>

                <h1 className="text-3xl md:text-4xl font-bold">
                  Peserta Bimbingan
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-emerald-100 leading-relaxed text-lg">
              Kelola peserta magang, pantau progres kegiatan,
              dan lakukan penilaian peserta dengan lebih mudah.
            </p>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Total Peserta',
              value: '2',
              icon: Users,
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Belum Dinilai',
              value: '1',
              icon: ClipboardCheck,
              color: 'from-amber-500 to-orange-500',
            },
            {
              title: 'Sedang Aktif',
              value: '1',
              icon: GraduationCap,
              color: 'from-emerald-500 to-teal-600',
            },
          ].map((item, index) => {
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
                  y: -5,
                }}
                className="
                  relative overflow-hidden
                  rounded-3xl
                  bg-white
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
                    bg-gradient-to-br ${item.color}
                    flex items-center justify-center
                    shadow-lg mb-5
                  `}
                >
                  <Icon
                    size={26}
                    className="text-white"
                  />
                </div>

                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>

                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gray-50" />
              </motion.div>
            )
          })}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            bg-white
            rounded-3xl
            border border-gray-100
            shadow-sm
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Daftar Peserta
                </h2>

                <p className="text-gray-500 mt-1">
                  Monitoring peserta magang bimbingan
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search
                  size={18}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Cari peserta..."
                  className="
                    w-full
                    pl-11 pr-4 py-3
                    rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500/20
                    focus:border-emerald-500
                    transition-all
                  "
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Peserta
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Instansi
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Selesai
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {peserta.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * index,
                    }}
                    className="
                      border-t border-gray-100
                      hover:bg-gray-50/70
                      transition-colors
                    "
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            w-12 h-12 rounded-2xl
                            bg-gradient-to-br
                            from-blue-500
                            to-teal-600
                            flex items-center justify-center
                            text-white font-bold
                            shadow-md
                          "
                        >
                          {item.nama.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {item.nama}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {item.prodi}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <GraduationCap size={16} />
                        {item.instansi}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays size={16} />
                        {item.selesai}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`
                          inline-flex items-center
                          px-4 py-2 rounded-full
                          text-xs font-bold
                          ${
                            item.status === 'Belum Dinilai'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }
                        `}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <motion.button
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="
                          inline-flex items-center gap-2
                          px-5 py-2.5
                          rounded-xl
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          text-sm
                          font-semibold
                          transition
                          shadow-md shadow-emerald-200
                        "
                      >
                        Beri Nilai
                        <ArrowRight size={16} />
                      </motion.button>
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
