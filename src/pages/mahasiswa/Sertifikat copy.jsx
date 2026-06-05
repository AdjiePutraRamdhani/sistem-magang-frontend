import { motion } from 'framer-motion'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { MAHASISWA_MENU } from '@/constants/mahasiswaMenu'

export default function Sertifikat() {
  return (
    <DashboardLayout menuItems={MAHASISWA_MENU}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          bg-white p-20 rounded-xl
          border border-gray-100
          text-center
        "
      >
        <div
          className="
            w-20 h-20 bg-gray-50 rounded-full
            flex items-center justify-center
            mx-auto mb-6
          "
        >
          <span className="text-4xl">
            🎓
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          Sertifikat Belum Tersedia
        </h2>

        <p className="text-gray-500 mt-2">
          Sertifikat akan muncul setelah magang selesai.
        </p>
      </motion.div>
    </DashboardLayout>
  )
}