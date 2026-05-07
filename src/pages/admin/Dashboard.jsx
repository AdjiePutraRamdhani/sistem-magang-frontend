import { Link } from 'react-router-dom'

import DashboardLayout from '@/components/DashboardLayout'

import DashboardTable from '@/components/dashboard/DashboardTable'
import StatsGrid from '@/components/dashboard/StatsGrid'

import Loading from '@/components/common/Loading'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'

import useDashboard from '@/hooks/useDashboard'

import { ADMIN_MENU } from '@/constants/adminMenu'
import { styles } from '@/styles/adminStyles'

// ================================================================
// HALAMAN: Dashboard Utama
// ================================================================
export default function AdminDashboard() {
  const {
    stats,
    pendaftaran,
    loading,
    error,
  } = useDashboard()

  if (loading) {
    return (
      <DashboardLayout
        menuItems={ADMIN_MENU}
        title="Dashboard"
      >
        <Loading />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
    <DashboardLayout menuItems={ADMIN_MENU} title="Dashboard">
      <ErrorState message={error} />
    </DashboardLayout>
    )
  }

  return (
    <DashboardLayout menuItems={ADMIN_MENU} title="Dashboard">
      {/* Kartu statistik */}
      <StatsGrid stats={stats} />

      {/* Tabel pendaftaran terbaru yang menunggu */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Pendaftaran menunggu persetujuan</span>
          <Link to="/admin/persetujuan" style={styles.panelLink}>Lihat semua →</Link>
        </div>
        {pendaftaran.length === 0
          ? <EmptyState message="Tidak ada pendaftaran yang menunggu." />
          : <DashboardTable data={pendaftaran} showActions={false} />
        }
      </div>
    </DashboardLayout>
  )
}
