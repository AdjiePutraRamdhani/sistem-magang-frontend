import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  LayoutDashboard,
  CheckSquare,
  Loader2,
} from 'lucide-react'

import Card from '../ui/Card'

const statsConfig = [
  {
    key: 'total_peserta',
    label: 'Total Peserta Magang',
    icon: Users,
    color: 'bg-blue-600',
  },
  {
    key: 'menunggu',
    label: 'Menunggu Persetujuan',
    icon: UserPlus,
    color: 'bg-amber-500',
  },
  {
    key: 'aktif',
    label: 'Sedang Aktif Magang',
    icon: LayoutDashboard,
    color: 'bg-emerald-500',
  },
  {
    key: 'sudah_sertifikat',
    label: 'Selesai & Dinilai',
    icon: CheckSquare,
    color: 'bg-violet-600',
  },
]

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsConfig.map((item, index) => {
        const Icon = item.icon

        return (
          <motion.div
                key={item.key}
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
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.color}`}>
              <Icon size={20} className="text-white" />
            </div>

            <p className="text-gray-500 text-sm font-medium mb-1">
              {item.label}
            </p>

            <h3 className="text-3xl font-bold text-gray-900">
              {stats?.[item.key] || 0}
            </h3>
          </motion.div>
        )
      })}
    </div>
  )
}