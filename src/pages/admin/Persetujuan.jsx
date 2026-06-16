import { motion, AnimatePresence } from 'framer-motion'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { approvePendaftaran, rejectPendaftaran, } from '@/services/adminServices'
import { useState, useEffect } from 'react'
import api from '@/api/axios'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useDashboard from '../../hooks/useDashboard'
import Loading from '@/components/common/Loading'
import PageTitle from '../../components/common/PageTitle'
import DashboardTable from '../../components/dashboard/DashboardTable'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import usePersetujuan from '../../hooks/usePersetujuan'
import ErrorState from '@/components/common/ErrorState'
import EmptyDashboard from '../../components/dashboard/EmptyDashboard'
import EmptyState from '@/components/common/EmptyState'
import Modal from '../../components/modal/Modal'


export default function AdminPersetujuan() {
  const [selectedId, setSelectedId] = useState(null)
  const [selectedPembimbing, setSelectedPembimbing] = useState('')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pembimbingList, setPembimbingList] = useState([])

  const handleViewSurat = (url) => {
  console.log('PDF URL:', url)

  setPdfUrl(url)
  setShowPdfModal(true)
}

  const fetchPembimbing = async () => {
    try {
      const res = await api.get('/admin/pembimbing')

      setPembimbingList(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPembimbing()
  }, [])

  const handleApprove = async () => {
  try {
    await api.post(
      `/admin/pendaftaran/${selectedId}/setujui`,
      {
        pembimbing_id: selectedPembimbing,
      }
    )

    setPendaftaran((prev) =>
      prev.filter((item) => item.id !== selectedId)
    )

    setShowApproveModal(false)

    setSelectedId(null)
    setSelectedPembimbing('')
  } catch (err) {
    console.error(err)
  }
}

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')

  const handleReject = async () => {
    try {
      await rejectPendaftaran(
        selectedId,
        rejectReason
      )

      setPendaftaran((prev) =>
        prev.filter((item) => item.id !== selectedId)
      )

      setShowRejectModal(false)

      setSelectedId(null)
      setRejectReason('')
    } catch (err) {
        console.log(err.response.data)

      alert('Gagal menolak pendaftaran')
    }
  }
  
  const {
    pendaftaran: initialData,
    loading,
    error,
  } = usePersetujuan()

  const [pendaftaran, setPendaftaran] = useState([])  

  useEffect(() => {
    setPendaftaran(initialData)
  }, [initialData])

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
    <>
      <PageTitle title="Dashboard Admin" />
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
              Persetujuan Magang 📜
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
              Daftar pendaftaran yang menunggu persetujuan.
            </motion.p>
          </div>
        </motion.div>

        <Card>
          {pendaftaran.length === 0 ? (
            <EmptyState
              title="Belum ada pendaftaran"
              description="Data persetujuan akan muncul di sini."
            />
          ) : (
            <DashboardTable
              data={pendaftaran}
              onView={(url) => {
                handleViewSurat(url)
              }}
                onApprove={(id) => {
                setSelectedId(id)
                setShowApproveModal(true)
              }}
              onReject={(id) => {
                setSelectedId(id)
                setShowRejectModal(true)
              }}
              showActions
            />
          )}
        </Card>
      </motion.div>
      
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white">
            Pilih Pembimbing
          </h2>

          <p className="text-blue-100 text-sm">
            Tentukan pembimbing mahasiswa
          </p>
        </div>

        <div className="p-6">
          <select
            value={selectedPembimbing}
            onChange={(e) =>
              setSelectedPembimbing(e.target.value)
            }
            className="
              w-full rounded-xl border
              px-4 py-3
              focus:ring-4 focus:ring-blue-100
              focus:border-blue-500
            "
          >
            <option value="">Pilih pembimbing</option>

            {pembimbingList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_lengkap}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowApproveModal(false)}
              className="
                px-5 py-2.5
                rounded-xl
                border
                hover:bg-gray-50
              "
            >
              Batal
            </button>

            <button
              onClick={handleApprove}
              className="
                px-5 py-2.5
                rounded-xl
                bg-blue-600 text-white
                hover:bg-blue-700
                shadow-lg shadow-blue-500/20
              "
            >
              Setujui
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white">
            Tolak Pengajuan
          </h2>

          <p className="text-red-100 text-sm">
            Berikan alasan penolakan
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={rejectReason}
            onChange={(e) =>
              setRejectReason(e.target.value)
            }
            rows={5}
            placeholder="Masukkan alasan penolakan..."
            className="
              w-full rounded-xl border
              px-4 py-3
              resize-none
              focus:ring-4 focus:ring-red-100
              focus:border-red-500
            "
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowRejectModal(false)
                setRejectReason('')
              }}
              className="
                px-5 py-2.5
                rounded-xl border
                hover:bg-gray-50
              "
            >
              Batal
            </button>

            <button
              onClick={handleReject}
              className="
                px-5 py-2.5
                rounded-xl
                bg-red-600 text-white
                hover:bg-red-700
                shadow-lg shadow-red-500/20
              "
            >
              Tolak
            </button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {showPdfModal && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPdfModal(false)}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 100,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                fixed inset-4 z-50
                bg-white rounded-3xl
                shadow-2xl overflow-hidden
                flex flex-col
              "
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div>
                  <h2 className="text-xl font-bold">
                    Surat Pengantar Magang
                  </h2>

                  <p className="text-sm text-gray-500">
                    Preview dokumen
                  </p>
                </div>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="
                    w-10 h-10
                    rounded-full
                    hover:bg-gray-100
                  "
                >
                  ✕
                </button>
              </div>

              <iframe
                src={pdfUrl}
                title="Preview PDF"
                className="flex-1 w-full"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
        
    </DashboardLayout>
    </>
  )
}