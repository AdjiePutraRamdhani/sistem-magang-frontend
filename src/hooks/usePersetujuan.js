import { useEffect, useState } from 'react'

import { getPendingPendaftaran } from '@/services/adminServices'

export default function usePersetujuan() {
  const [pendaftaran, setPendaftaran] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

const handleApprove = async (id) => {
  await approvePendaftaran(id)

  setPendaftaran((prev) =>
    prev.filter((item) => item.id !== id)
  )
}
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingPendaftaran()

        setPendaftaran(
          Array.isArray(data)
            ? data
            : []
        )
      } catch (err) {
        console.error(err)

        setError('Gagal memuat data persetujuan')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    pendaftaran,
    loading,
    error,
  }
}