import { motion } from 'framer-motion'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useDashboard from '../../hooks/useDashboard'
import Loading from '../../components/common/Loading'
import DashboardTable from '../../components/dashboard/DashboardTable'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

export default function KelolaData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mahasiswa, setMahasiswa] = useState([])

  useEffect(() => {
    fetchMahasiswa()
  }, [])

  const fetchMahasiswa = async () => {
    try {
      const response = await api.get('/admin/mahasiswa')

      console.log(response.data)

      setMahasiswa(response.data)
    } catch (err) {
      console.error(err)
      console.error(err.response)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil data mahasiswa'
      )
    } finally {
      setLoading(false)
    }
  }

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
             <div className="text-red-500">{error}</div>
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
              Kelola Data Magang 📝
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
              Kelola data peserta magang.
            </motion.p>
          </div>
        </motion.div>
          <Card className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Daftar Mahasiswa Magang
                </h2>

                <span className="text-xs text-gray-400 font-medium">
                  {mahasiswa.length} entri
                </span>
              </div>
              
              <Card>
                <DashboardTable
                  data={mahasiswa}
                  showActions={false}
                />

                {mahasiswa.length === 0 && (
                  <div className="p-20 text-center text-gray-400">
                    Belum ada data
                  </div>
                )}
              </Card>
            </div>
          </Card>
        </motion.div>
    </DashboardLayout>
  )
}