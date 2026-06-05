import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ADMIN_MENU } from '@/constants/adminMenu'

import DashboardLayout from '@/components/layout/DashboardLayout'

import DashboardTable from '@/components/dashboard/DashboardTable'
import StatsGrid from '@/components/dashboard/StatsGrid'
import EmptyDashboard from '@/components/dashboard/EmptyDashboard'

import Loading from '@/components/common/Loading'
import ErrorState from '@/components/common/ErrorState'

import useDashboard from '@/hooks/useDashboard'
import PageHeader from '@/components/common/PageHeader'
import Card from '@/components/ui/Card'


export default function AdminDashboard() {
  const {
    stats,
    pendaftaran,
    loading,
    error,
  } = useDashboard()

  if (loading) {
    return (
      <DashboardLayout menuItems={ADMIN_MENU}>
        <Loading />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout menuItems={ADMIN_MENU}>
        <ErrorState message={error} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout menuItems={ADMIN_MENU}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        {/* Header */}
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
              Dashboard Admin 🛡️
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
              Ringkasan data magang terbaru.
            </motion.p>
          </div>
        </motion.div>

        {/* Statistik */}
        <StatsGrid stats={stats} />

        {/* Tabel */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Card className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Pendaftaran Menunggu Persetujuan
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Daftar pengajuan magang terbaru.
              </p>
            </div>

            <Link
              to="/admin/persetujuan"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Lihat semua →
            </Link>
          </Card>

          {pendaftaran.length === 0 ? (
            <EmptyDashboard />
          ) : (
            <DashboardTable
              data={pendaftaran}
            />
          )}
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}