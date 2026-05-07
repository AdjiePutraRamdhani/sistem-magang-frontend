import { useEffect, useState } from 'react'
import {
  getDashboard,
  getPendingPendaftaran
} from '@/services/adminServices'

export default function useDashboard() {
  const [stats, setStats] = useState(null)
  const [pendaftaran, setPendaftaran] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, pendaftaranData] =
          await Promise.all([
            getDashboard(),
            getPendingPendaftaran(),
          ])

        setStats(statsData)

        setPendaftaran(
          Array.isArray(pendaftaranData)
            ? pendaftaranData.slice(0, 5)
            : []
        )
      } catch (err) {
        console.error(err)
        setError('Gagal memuat dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    stats,
    pendaftaran,
    loading,
    error,
  }
}