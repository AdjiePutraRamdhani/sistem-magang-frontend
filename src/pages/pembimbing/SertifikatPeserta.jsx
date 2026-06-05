import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Award,
  Check,
  Download,
  Trash2,
  Upload,
  Loader2,
} from 'lucide-react'
import api from '../../api/axios'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PEMBIMBING_MENU } from '@/constants/pembimbingMenu'


export default function SertifikatPeserta() {
  const [peserta, setPeserta] = useState([])  
  const [search, setSearch] = useState('')
  const [uploadingId, setUploadingId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
      fetchPeserta()
    }, [])
  
    async function fetchPeserta() {
  
      try {
  
        setLoading(true)
  
        const response = await api.get('/pembimbing/peserta')
  
        setPeserta(response.data)
  
      } catch (err) {
  
        console.error(err)
  
        setError('Gagal mengambil data peserta.')
  
      } finally {
  
        setLoading(false)
  
      }
    }

  if (loading) {
    return (
      <DashboardLayout
        menuItems={PEMBIMBING_MENU}
        title="Peserta Bimbingan"
      >
        <div className="
          flex items-center justify-center
          h-[70vh]
        ">
          <div className="text-center">

            <Loader2
              size={50}
              className="
                animate-spin
                text-blue-600
                mx-auto
              "
            />

            <p className="mt-5 text-gray-500">
              Memuat peserta bimbingan...
            </p>

          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        menuItems={PEMBIMBING_MENU}
        title="Peserta Bimbingan"
      >
        <div className="
          bg-red-50
          border border-red-200
          text-red-600
          p-5
          rounded-2xl
        ">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  // Filter peserta yang sudah selesai dinilai
  const completedParticipants = peserta.filter(
    (p) =>
      p.status === 'Selesai Dinilai' ||
      p.status === 'Sertifikat Diunggah'
  )

  const filtered = completedParticipants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase())
  )

  const handleSimulateUpload = (id) => {
    setUploadingId(id)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          setTimeout(() => {
            const student = peserta.find(
              (p) => p.id === id
            )

            onUploadCertificate(id, {
              fileName: `Sertifikat_Magang_${
                student
                  ? student.name.replace(/\s+/g, '_')
                  : 'Peserta'
              }.pdf`,
              fileSize: '245 KB',
            })

            setUploadingId(null)
          }, 400)

          return 100
        }

        return prev + 20
      })
    }, 120)
  }

  return (
    <DashboardLayout
      menuItems={PEMBIMBING_MENU}
      title="Sertifikat Peserta"
    >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-bold">
                        Sertifikat Peserta 🎓
                    </h1>

                    <p className="mt-2 text-blue-100">
                        Kelola dan unggah sertifikat peserta magang yang telah selesai dinilai.
                    </p>
                    </div>

                    
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <motion.div
                    whileHover={{ y: -4 }}
                    className="
                    relative overflow-hidden
                    rounded-3xl
                    bg-white
                    border border-gray-100
                    p-6
                    shadow-sm
                    hover:shadow-xl
                    transition-all duration-300"
                >
                    <p className="text-gray-500 text-sm">
                    Total Peserta
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-900">
                    {peserta.length}
                    </h2>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="
                    relative overflow-hidden
                    rounded-3xl
                    bg-white
                    border border-gray-100
                    p-6
                    shadow-sm
                    hover:shadow-xl
                    transition-all duration-300"
                >
                    <p className="text-gray-500 text-sm">
                    Sertifikat Diunggah
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                    {
                        completedParticipants.filter(
                        p => p.status === 'Sertifikat Diunggah'
                        ).length
                    }
                    </h2>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="
                    relative overflow-hidden
                    rounded-3xl
                    bg-white
                    border border-gray-100
                    p-6
                    shadow-sm
                    hover:shadow-xl
                    transition-all duration-300"
                >
                    <p className="text-gray-500 text-sm">
                    Menunggu Upload
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-amber-500">
                    {
                        completedParticipants.filter(
                        p => p.status !== 'Sertifikat Diunggah'
                        ).length
                    }
                    </h2>
                </motion.div>
            </div>

            <div
            className="
                bg-white rounded-xl
                shadow-sm border border-gray-100
                overflow-hidden
            "
            >
            <div
                className="
                p-5 px-6
                border-b border-gray-100
                flex flex-col sm:flex-row
                items-start sm:items-center
                justify-between gap-4
                "
            >
                <div>
                <h2 className="text-sm font-bold text-[#1E3A5F]">
                    Upload Sertifikat Magang
                </h2>

                <p
                    className="
                    text-xs text-gray-400
                    mt-0.5 font-medium
                    "
                >
                    Unggah berkas sertifikat bimbingan yang
                    telah selesai dinilai
                </p>
                </div>

                <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Cari nama / instansi..."
                    value={search}
                    onChange={(e) =>
                    setSearch(e.target.value)
                    }
                    className="
                    w-full pl-11 pr-4 py-3
                    bg-gray-50
                    border border-gray-200
                    rounded-xl
                    text-sm
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-500
                    transition-all
                    "
                />

                <div
                    className="
                    absolute inset-y-0 left-3
                    flex items-center
                    pointer-events-none
                    text-gray-400
                    "
                >
                    <Search
                        size={18}
                        className="text-gray-400"
                    />
                </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 text-center"
                    >
                    <div
                        className="
                        w-24 h-24
                        mx-auto
                        rounded-full
                        bg-blue-50
                        flex items-center justify-center
                        mb-6
                        "
                    >
                        <Award
                        size={36}
                        className="text-blue-600"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800">
                        Belum Ada Sertifikat
                    </h3>

                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Peserta yang telah selesai dinilai akan muncul di sini untuk proses upload sertifikat magang.
                    </p>
                </motion.div>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr
                        className="
                        bg-gray-50/30
                        border-b border-gray-100
                        "
                    >
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                        Nama Peserta
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                        Asal Instansi
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">
                        Nilai Rata-Rata
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                        Status Berkas
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">
                        Aksi
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                    {filtered.map((item) => (
                        <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                backgroundColor: '#f8fafc',
                            }}
                            className="
                                transition-all
                            "
                        >
                        <td className="px-6 py-4">
                            <div>
                            <p className="text-sm font-bold text-gray-800">
                                {item.name}
                            </p>

                            <p
                                className="
                                text-[10px]
                                text-gray-400
                                font-bold
                                uppercase
                                mt-0.5
                                tracking-tight
                                "
                            >
                                {item.studyProgram}
                            </p>
                            </div>
                        </td>

                        <td className="px-6 py-4">
                            <span
                            className="
                                text-xs font-bold
                                text-gray-700
                                tracking-tight
                            "
                            >
                            {item.institution}
                            </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-blue-900">
                                {item.grade?.avg}
                            </span>

                            <span
                                className="
                                px-2 py-1
                                rounded-full
                                text-[10px]
                                font-black
                                bg-blue-100
                                text-blue-700
                                "
                                
                            >
                                {item.grade?.avg >= 90
                                    ? 'A'
                                    : item.grade?.avg >= 80
                                    ? 'B'
                                    : item.grade?.avg >= 70
                                    ? 'C'
                                    : 'D'
                                }
                            </span>
                            </div>
                        </td>

                        <td className="px-6 py-4">
                            {item.status ===
                            'Sertifikat Diunggah' ? (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <Check
                                size={14}
                                className="
                                    bg-emerald-100
                                    p-0.5
                                    rounded-full
                                    text-emerald-700
                                "
                                />

                                <div>
                                <span className="text-xs font-bold block">
                                    Sertifikat Diunggah
                                </span>

                                <span
                                    className="
                                    text-[9px]
                                    text-gray-400
                                    font-bold
                                    block mt-0.5
                                    truncate
                                    max-w-[150px]
                                    "
                                >
                                    {
                                    item.certificate
                                        ?.fileName
                                    }
                                </span>
                                </div>
                            </div>
                            ) : (
                            <div className="flex items-center gap-2 text-amber-600">
                                <div
                                className="
                                    w-2 h-2
                                    rounded-full
                                    bg-amber-500
                                    animate-pulse
                                "
                                />

                                <span className="text-xs font-bold">
                                Menunggu Diunggah
                                </span>
                            </div>
                            )}
                        </td>

                        <td className="px-6 py-4 text-center">
                            {uploadingId === item.id ? (
                            <div className="inline-flex flex-col items-center w-full max-w-[140px]">
                                <span
                                className="
                                    text-[9px]
                                    font-bold
                                    text-blue-600
                                    animate-pulse
                                    mb-1
                                "
                                >
                                Mengunggah...
                                ({uploadProgress}%)
                                </span>

                                <div
                                className="
                                    w-full bg-gray-100
                                    h-1 rounded-full
                                    overflow-hidden
                                "
                                >
                                <div
                                    className="
                                    bg-blue-600
                                    h-full
                                    transition-all
                                    duration-150
                                    "
                                    style={{
                                    width: `${uploadProgress}%`,
                                    }}
                                />
                                </div>
                            </div>
                            ) : item.status ===
                            'Sertifikat Diunggah' ? (
                            <div className="flex items-center justify-center gap-1.5">
                                <span
                                className="
                                    text-[9px]
                                    text-gray-400
                                    font-bold
                                    bg-gray-50
                                    border border-gray-100
                                    rounded
                                    px-1.5 py-0.5
                                "
                                >
                                {
                                    item.certificate
                                    ?.fileSize
                                }
                                </span>

                                <button
                                onClick={() =>
                                    alert(
                                    `Mengunduh file: ${item.certificate?.fileName}`
                                    )
                                }
                                className="
                                    p-1 px-2.5
                                    rounded
                                    text-[10px]
                                    bg-gray-50
                                    border border-gray-200
                                    text-gray-600
                                    hover:bg-gray-100
                                    font-bold
                                    flex items-center gap-1
                                "
                                >
                                <Download size={11} />
                                Unduh
                                </button>

                                <button
                                onClick={() =>
                                    onDeleteCertificate(
                                    item.id
                                    )
                                }
                                className="
                                    p-1.5
                                    hover:bg-red-50
                                    text-red-500
                                    rounded
                                "
                                >
                                <Trash2 size={13} />
                                </button>
                            </div>
                            ) : (
                            <button
                                onClick={() =>
                                handleSimulateUpload(
                                    item.id
                                )
                                }
                                className="
                                group
                                px-4 py-2
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
                                text-white
                                font-semibold
                                shadow-lg
                                shadow-blue-200
                                hover:scale-105
                                transition-all
                                inline-flex
                                items-center
                                gap-2
                                "
                            >
                                <Upload size={12} />
                                Pilih & Unggah
                            </button>
                            )}
                        </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </motion.div>
    </DashboardLayout>
    
  )
}