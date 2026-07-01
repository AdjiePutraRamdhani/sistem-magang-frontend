import React from 'react';
import { 
  Award, Users, ArrowRight, MapPin, Phone, Mail, FileText, 
  CheckCircle2, UserPlus, ChevronRight, BookOpen, GraduationCap, Building2, ShieldCheck, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import Login from './Login';
import { useNavigate } from 'react-router-dom'
import logoRiau from '@/assets/logo-riau.png'
import { useEffect, useState } from 'react'
import api from '@/api/axios'


export default function LandingPageView({
  onEnterLogin,
  onSelectRole,
}) {

    const navigate = useNavigate()
    const [overview, setOverview] = useState({
    total_pendaftaran: 0,
    menunggu_verifikasi: 0,
    pembimbing_aktif: 0,
    sertifikat_terbit: 0,
    })

    const [peserta, setPeserta] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingPeserta, setLoadingPeserta] = useState(false)

    useEffect(() => {
      loadOverview()
      loadPeserta()
    }, [])

    const loadOverview = async () => {
      try {
        const res = await api.get('/landing/overview')
        setOverview(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    const loadPeserta = async (search = '') => {
      setLoadingPeserta(true)
      try {
        const res = await api.get('/landing/peserta', {
          params: { search }
        })
        setPeserta(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingPeserta(false)
      }
    }

    const handleSearch = (e) => {
      const val = e.target.value
      setSearchQuery(val)
      loadPeserta(val)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const getStatusBadge = (status) => {
      switch (status) {
        case 'aktif':
          return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Aktif</span>
        case 'disetujui':
          return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">Disetujui</span>
        case 'selesai_dinilai':
        case 'sudah_sertifikat':
          return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700">Alumni</span>
        default:
          return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700 uppercase">{status}</span>
      }
    }

    const fadeUp = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
        duration: 0.7,
        },
    },
    }

    const reveal = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
        duration: 0.6,
        },
    },
    }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col text-gray-800 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Institution Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm border border-gray-100">
                <img 
                  src={logoRiau}
                  alt="Logo Riau" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Pemerintah Provinsi Riau</p>
                <h1 className="text-[#1E3A5F] font-extrabold text-base leading-tight tracking-tight uppercase mt-0.5">DISPUSIP PROV. RIAU</h1>
                <p className="text-[11px] text-gray-500 font-semibold leading-none mt-0.5">Dinas Perpustakaan dan Kearsipan</p>
              </div>
            </div>

            {/* Quick CTAs / Login Button */}
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
              >
                Masuk Sistem
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
        duration: 0.8,
        ease: 'easeOut',
        }}
        className="relative bg-gradient-to-br from-[#1E3A5F] via-[#254A75] to-[#1E3A5F] py-20 lg:py-28 text-white overflow-hidden">

        {/* Subtle decorative grid background */}
        <motion.div
        animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
        }}
        transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />

        <motion.div
        animate={{
            x: [0, -50, 0],
            y: [0, 20, 0],
        }}
        transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
        }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"
        />
        
        {/* Floating background gradient light circles */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-36 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-black tracking-wider uppercase border border-white/10">
              <ShieldCheck size={14} /> Program Magang Resmi DISPUSIP
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white">
              Bangun Karir & Kompetensi Hebat Anda Di Sini
            </h2>

            <p className="text-gray-200 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Sistem Informasi Pendataan Magang Elektronik Dinas Perpustakaan dan Kearsipan Provinsi Riau. Wadah resmi peningkatan kapabilitas akademik melalui kerja praktik nyata.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
              >
                Mulai Pendaftaran Sekarang 
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <a 
                href="#alur"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white text-sm font-bold rounded-lg transition-all"
              >
                Lihat Alur Program
              </a>
            </div>
          </div>

          {/* Interactive Mockup Representation */}
          <div className="lg:col-span-5">
            <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{
                opacity: 1,
                x: 0,
                y: [0, -8, 0],
            }}
            transition={{
                opacity: { duration: 0.8 },
                x: { duration: 0.8 },
                y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                },
            }}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[11px] font-black tracking-widest text-[#5CD895] uppercase">Live Overview</span>
              </div>

              {/* Simulated UI list */}
              <div className="space-y-4 text-left">
                <div className="space-y-3">
                    <div className="bg-white/95 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-600">
                            Total Pendaftaran
                        </span>

                        <span className="text-2xl font-black text-blue-600">
                            {overview.total_pendaftaran}
                        </span>
                        </div>
                    </div>

                    <div className="bg-white/95 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-600">
                            Menunggu Verifikasi
                        </span>

                        <span className="text-2xl font-black text-yellow-500">
                            {overview.menunggu_verifikasi}
                        </span>
                        </div>
                    </div>

                    <div className="bg-white/95 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-600">
                            Pembimbing Aktif
                        </span>

                        <span className="text-2xl font-black text-emerald-600">
                            {overview.pembimbing_aktif}
                        </span>
                        </div>
                    </div>

                    <div className="bg-[#1A73E8] rounded-xl p-4 text-white">
                        <div className="flex justify-between items-center">
                        <span className="font-bold">
                            Sertifikat Terbit
                        </span>

                        <span className="text-2xl font-black">
                            {overview.sertifikat_terbit}
                        </span>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Program Statistics Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <motion.div
            whileHover={{
                y: -5,
                scale: 1.05,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
            }}
            className="p-4"
            >
              <p className="text-[#1A73E8] text-3xl font-black">500+</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wide">Penerima Manfaat Magang</p>
            </motion.div>

            <motion.div
            whileHover={{
                y: -5,
                scale: 1.05,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
            }} className="p-4 pt-6 md:pt-4"
            >
              <p className="text-emerald-600 text-3xl font-black">45+</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wide">Instansi & Kampus Riau</p>
            </motion.div>

            <motion.div
            whileHover={{
                y: -5,
                scale: 1.05,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
            }} className="p-4 pt-6 md:pt-4"
            >
              <p className="text-[#1E3A5F] text-3xl font-black">20+</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wide">Pembimbing & Mentor Ahli</p>
            </motion.div>
            
            <motion.div
            whileHover={{
                y: -5,
                scale: 1.05,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
            }} className="p-4 pt-6 md:pt-4"
            >
              <p className="text-purple-600 text-3xl font-black">100%</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wide">Digital Transparan</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Peserta Magang Section */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[#1A73E8] font-black text-[11px] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Daftar Peserta</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F] mt-4 tracking-tight">Peserta Magang Aktif & Alumni</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
              Daftar siswa dan mahasiswa yang sedang atau telah menyelesaikan program magang resmi di DISPUSIP Provinsi Riau.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, instansi, atau program studi..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm"
              />
              <Search className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Table / Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingPeserta ? (
              <div className="p-12 text-center text-gray-500 font-medium">
                Memuat data peserta...
              </div>
            ) : peserta.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-medium">
                Tidak ada data peserta ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asal Instansi / Prodi</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Periode Magang</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pembimbing</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {peserta.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#1A73E8] font-bold text-sm">
                              {p.nama_lengkap ? p.nama_lengkap.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{p.nama_lengkap}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-700 text-sm">{p.asal_instansi}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.program_studi}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {formatDate(p.tanggal_mulai)} - {formatDate(p.tanggal_selesai)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.pembimbing ? (
                            <span className="font-medium text-gray-700">{p.pembimbing}</span>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Belum ditunjuk</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(p.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Target User & Platform Capabilities */}
      <motion.section
        className="bg-white py-20 lg:py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-black text-[11px] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Fitur Utama Sistem</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F] mt-4 tracking-tight">Sinergi Integrasi Digital Tiga Pengguna</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 font-medium leading-relaxed">Sistem Informasi ini didesain khusus guna menjembatani komunikasi, pembagian berkas, dan transparansi antara Mahasiswa, Instansi Pembimbing, serta Dinas Kearsipan.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Box 1 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }} 
            className="bg-white p-8 rounded-xl border border-gray-100 hover:border-blue-500/30 shadow-sm hover:shadow-lg transition-all group duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center p-3 mb-6 transition-colors group-hover:bg-[#1A73E8]/10 text-blue-600">
                <GraduationCap size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1E3A5F]">Pendaftaran & Tracking Mandiri</h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-semibold mt-2.5">
                Mahasiswa mendaftar dengan membuat profil serta mengunduh scan Surat Pengantar, memantau proses verifikasi administrasi secara transparan, serta memonitor keabsahan magang aktif secara realitime.
              </p>
            </motion.div>

            {/* Box 2 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, }} 
            className="bg-white p-8 rounded-xl border border-gray-100 hover:border-emerald-500/30 shadow-sm hover:shadow-lg transition-all group duration-300">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center p-3 mb-6 transition-colors group-hover:bg-emerald-600/10 text-emerald-600">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1E3A5F]">Evaluasi & Penilaian Pembimbing</h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-semibold mt-2.5">
                Pembimbing Lapangan dapat memberikan nilai kompetensi kuantitatif (attitude, teamwork, teknis, dll) langsung lewat ponsel/desktop serta menyematkan hasil penilaian peserta bimbingan secara instan.
              </p>
            </motion.div>

            {/* Box 3 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, }} 
            className="bg-white p-8 rounded-xl border border-gray-100 hover:border-purple-500/30 shadow-sm hover:shadow-lg transition-all group duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center p-3 mb-6 transition-colors group-hover:bg-purple-600/10 text-purple-600">
                <Award size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#1E3A5F]">E-Sertifikat Terverifikasi</h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-semibold mt-2.5">
                Penerbitan digital sertifikat otentik dengan kode QR dinamis. Peserta yang dinyatakan lulus dapat mengunduh berkas PDF kualitas cetak tinggi kapan saja dan di mana saja.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Alur Pendaftaran Section */}
      <motion.section
        id="alur"
        className="bg-[#F8F9FA] py-20 lg:py-24 border-t border-gray-100 relative"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-black text-[11px] tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full">Sederhana & Mudah</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F] mt-4 tracking-tight">4 Langkah Alur Penyelenggaraan Magang</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 font-medium leading-relaxed">Dari registrasi awal hingga perolehan dokumen tanda kelulusan magang di DISPUSIP Provinsi Riau.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }} 
            className="bg-white p-6 rounded-xl border border-gray-100 text-left relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#1E3A5F] text-white rounded-full flex items-center justify-center font-extrabold text-sm mb-4">1</div>
              <h5 className="text-sm font-bold text-[#1E3A5F]">Pengajuan Berkas</h5>
              <p className="text-xs text-gray-500 mt-2 font-semibold leading-relaxed">Siswa/Mahasiswa melengkapi draf identitas serta mengunggah proposal penawaran atau surat rekomendasi perguruan tinggi asal.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, }} 
            className="bg-white p-6 rounded-xl border border-gray-100 text-left relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-sm mb-4">2</div>
              <h5 className="text-sm font-bold text-[#1E3A5F]">Verifikasi Dokumen</h5>
              <p className="text-xs text-gray-500 mt-2 font-semibold leading-relaxed">Dinas Kearsipan Prov Riau memeriksa kelayakan berkas administratif dan menentukan Pembimbing Lapangan/Mentor terkait.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, }} 
            className="bg-white p-6 rounded-xl border border-gray-100 text-left relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-extrabold text-sm mb-4">3</div>
              <h5 className="text-sm font-bold text-[#1E3A5F]">Pekerjaan & Pelatihan</h5>
              <p className="text-xs text-gray-500 mt-2 font-semibold leading-relaxed">Pelaksanaan program kerja praktik lapangan di bawah koordinasi mentor. Mahasiswa mendapatkan transfer ilmu kearsipan nyata.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6, }} 
            className="bg-white p-6 rounded-xl border border-gray-100 text-left relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-extrabold text-sm mb-4">4</div>
              <h5 className="text-sm font-bold text-[#1E3A5F]">Unduh Sertifikat</h5>
              <p className="text-xs text-gray-500 mt-2 font-semibold leading-relaxed">Pembimbing memberikan nilai akhir bimbingan. Sertifikat legalisir berpenomeran otomatis akan langsung aktif terbit di dalam sistem.</p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <motion.button 
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-extrabold hover:underline"
            >
              Mulai Langkah Pertama Sekarang <ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="bg-[#101F33] text-white border-t border-white/5 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          {/* Col 1 */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 border border-gray-100">
                <img 
                  src={logoRiau} 
                  alt="Logo Riau" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <p className="text-[#5CD895] font-black tracking-widest text-sm uppercase">DISPUSIP RIAU</p>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm">
              Sistem Elektronik Pendataan Program Magang Terintegrasi Penilaian Handal dan Unduh Sertifikat Mandiri di Dinas Perpustakaan dan Kearsipan Provinsi Riau.
            </p>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h6 className="text-[11px] font-black text-[#5CD895] uppercase tracking-wider">Kontak & Lokasi Kantor</h6>
            <div className="space-y-3 text-xs text-gray-400 font-semibold">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Jenderal Sudirman No. 462, Pekanbaru, Riau, Indonesia 28121</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <span>(0761) 854388, 854389</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                <span>dispusip@riau.go.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            &copy; 2026 Pemerintah Provinsi Riau - Dinas Perpustakaan dan Kearsipan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            <span>Kebijakan Privasi</span>
            <span>Syarat & Ketentuan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
