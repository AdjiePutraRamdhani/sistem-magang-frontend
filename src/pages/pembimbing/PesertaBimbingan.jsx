// src/pages/pembimbing/PesertaBimbingan.jsx

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  CalendarDays,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { PEMBIMBING_MENU } from '@/constants/pembimbingMenu'
import api from '@/api/axios'

export default function PesertaBimbingan() {

  const [peserta, setPeserta] = useState([])
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedPeserta, setSelectedPeserta] = useState(null)

  const [formNilai, setFormNilai] = useState({
    kedisiplinan: '',
    kemampuan_teknis: '',
    sikap: '',
    kehadiran: '',
    catatan: '',
  })

  const [loadingNilai, setLoadingNilai] = useState(false)

  const fields = [
    'kedisiplinan',
    'kemampuan_teknis',
    'sikap',
    'kehadiran',
  ]

  for (const field of fields) {

    const value = Number(formNilai[field])

    if (value < 0 || value > 100) {

      alert('Nilai harus antara 0 sampai 100')

      return
    }
  }

  async function handleSubmitNilai(e) {

    e.preventDefault()

    try {

      setLoadingNilai(true)

      await api.post(
        `/pembimbing/nilai/${selectedPeserta.id}`,
        {
          kedisiplinan: Number(formNilai.kedisiplinan),
          kemampuan_teknis: Number(formNilai.kemampuan_teknis),
          sikap: Number(formNilai.sikap),
          kehadiran: Number(formNilai.kehadiran),
          catatan: formNilai.catatan,
        }
      )

      // refresh data peserta
      fetchPeserta()

      // reset modal
      setSelectedPeserta(null)

      setFormNilai({
        kedisiplinan: '',
        kemampuan_teknis: '',
        sikap: '',
        kehadiran: '',
        catatan: '',
      })

    } catch (err) {

      console.error(err)

      alert(
        err?.response?.data?.message ||
        'Gagal menyimpan nilai'
      )

    } finally {

      setLoadingNilai(false)

    }
  }

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

  // Filter Search
  const filteredPeserta = useMemo(() => {

    return peserta.filter((item) => {

      const keyword = search.toLowerCase()

      return (
        item.nama_lengkap.toLowerCase().includes(keyword) ||
        item.program_studi.toLowerCase().includes(keyword) ||
        item.asal_instansi.toLowerCase().includes(keyword)
      )
    })

  }, [peserta, search])

  // Summary
  const totalPeserta = peserta.length

  const belumDinilai = peserta.filter(
    (item) => !item.sudah_dinilai
  ).length

  const sedangAktif = peserta.filter(
    (item) => item.status === 'aktif'
  ).length

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

  return (
    <DashboardLayout
      menuItems={PEMBIMBING_MENU}
      title="Peserta Bimbingan"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >

        {/* Hero */}
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
            <div className="
              absolute -top-20 -right-20
              w-72 h-72
              bg-white rounded-full
            " />

            <div className="
              absolute bottom-0 left-0
              w-56 h-56
              bg-white rounded-full
            " />
          </div>

          <div className="relative z-10">

            <div className="
              flex items-center gap-3
              mb-5
            ">
              <div className="
                w-14 h-14 rounded-2xl
                bg-white/20
                backdrop-blur
                flex items-center justify-center
              ">
                <Users size={28} />
              </div>

              <div>
                <p className="
                  text-emerald-100
                  text-sm
                  font-medium
                ">
                  Dashboard Pembimbing
                </p>

                <h1 className="
                  text-3xl md:text-4xl
                  font-bold
                ">
                  Peserta Bimbingan
                </h1>
              </div>
            </div>

            <p className="
              max-w-2xl
              text-emerald-100
              leading-relaxed
              text-lg
            ">
              Kelola peserta magang, pantau progres kegiatan,
              dan lakukan penilaian peserta dengan lebih mudah.
            </p>

          </div>
        </motion.div>

        {/* Summary */}
        <div className="
          grid grid-cols-1
          md:grid-cols-3
          gap-6
        ">
          {[
            {
              title: 'Total Peserta',
              value: totalPeserta,
              icon: Users,
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Belum Dinilai',
              value: belumDinilai,
              icon: ClipboardCheck,
              color: 'from-amber-500 to-orange-500',
            },
            {
              title: 'Sedang Aktif',
              value: sedangAktif,
              icon: GraduationCap,
              color: 'from-emerald-500 to-teal-600',
            },
          ].map((item, index) => {

            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -5,
                }}
                className="
                  relative overflow-hidden
                  rounded-3xl
                  bg-white
                  border border-gray-100
                  p-6
                  shadow-sm
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                <div
                  className={`
                    w-14 h-14 rounded-2xl
                    bg-gradient-to-br ${item.color}
                    flex items-center justify-center
                    shadow-lg mb-5
                  `}
                >
                  <Icon
                    size={26}
                    className="text-white"
                  />
                </div>

                <p className="
                  text-sm font-medium
                  text-gray-500
                ">
                  {item.title}
                </p>

                <h3 className="
                  mt-2
                  text-3xl
                  font-bold
                  text-gray-900
                ">
                  {item.value}
                </h3>

                <div className="
                  absolute -right-6 -bottom-6
                  w-24 h-24 rounded-full
                  bg-gray-50
                " />
              </motion.div>
            )
          })}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            bg-white
            rounded-3xl
            border border-gray-100
            shadow-sm
            overflow-hidden
          "
        >

          {/* Header */}
          <div className="
            p-6
            border-b border-gray-100
          ">
            <div className="
              flex flex-col md:flex-row
              md:items-center
              md:justify-between
              gap-4
            ">

              <div>
                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-800
                ">
                  Daftar Peserta
                </h2>

                <p className="text-gray-500 mt-1">
                  Monitoring peserta magang bimbingan
                </p>
              </div>

              <div className="
                relative
                w-full md:w-80
              ">
                <Search
                  size={18}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari peserta..."
                  className="
                    w-full
                    pl-11 pr-4 py-3
                    rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500/20
                    focus:border-emerald-500
                    transition-all
                  "
                />
              </div>

            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>

                  <th className="
                    px-6 py-4 text-left
                    text-xs font-bold
                    text-gray-500 uppercase
                  ">
                    Peserta
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    text-xs font-bold
                    text-gray-500 uppercase
                  ">
                    Instansi
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    text-xs font-bold
                    text-gray-500 uppercase
                  ">
                    Selesai
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    text-xs font-bold
                    text-gray-500 uppercase
                  ">
                    Status
                  </th>

                  <th className="
                    px-6 py-4 text-centre
                    text-xs font-bold
                    text-gray-500 uppercase
                  ">
                    Aksi
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredPeserta.map((item, index) => (

                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 * index,
                    }}
                    className="
                      border-t border-gray-100
                      hover:bg-gray-50/70
                      transition-colors
                    "
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="
                          w-12 h-12 rounded-2xl
                          bg-gradient-to-br
                          from-blue-500 to-teal-600
                          flex items-center justify-center
                          text-white font-bold
                          shadow-md
                        ">
                          {item.nama_lengkap.charAt(0)}
                        </div>

                        <div>

                          <h3 className="
                            font-bold text-gray-900
                          ">
                            {item.nama_lengkap}
                          </h3>

                          <p className="
                            text-sm text-gray-500 mt-1
                          ">
                            {item.program_studi}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">
                      <div className="
                        flex items-center gap-2
                        text-gray-700 font-medium
                      ">
                        <GraduationCap size={16} />
                        {item.asal_instansi}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="
                        flex items-center gap-2
                        text-gray-700
                      ">
                        <CalendarDays size={16} />
                        {item.tanggal_selesai}
                      </div>
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`
                          inline-flex items-center
                          px-4 py-2 rounded-full
                          text-xs font-bold border

                          ${
                            item.sudah_dinilai
                              ? `
                                bg-emerald-50
                                text-emerald-700
                                border-emerald-200
                              `
                              : `
                                bg-amber-50
                                text-amber-700
                                border-amber-200
                              `
                          }
                        `}
                      >
                        {
                          item.sudah_dinilai
                            ? 'Sudah Dinilai'
                            : 'Belum Dinilai'
                        }
                      </span>

                    </td>

                    <td className="
                      px-6 py-5
                      text-right
                    ">

                      <motion.button
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() => setSelectedPeserta(item)}
                        className={`
                          inline-flex items-center gap-2
                          px-5 py-2.5 rounded-xl
                          text-white text-sm font-semibold
                          transition shadow-md

                          ${
                            item.sudah_dinilai
                              ? `
                                bg-emerald-600
                                hover:bg-emerald-700
                              `
                              : `
                                bg-blue-600
                                hover:bg-blue-700
                              `
                          }
                        `}
                      >
                        {
                          item.sudah_dinilai
                            ? 'Lihat Nilai'
                            : 'Beri Nilai'
                        }

                        <ArrowRight size={16} />
                      </motion.button>

                    </td>

                  </motion.tr>
                ))}
              </tbody>

            </table>

            {/* Modal Nilai */}
            {selectedPeserta && (

              <div className="
                fixed inset-0 z-50
                bg-black/40
                backdrop-blur-sm
                flex items-center justify-center
                p-4
              ">

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="
                    w-full max-w-2xl
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                  "
                >

                  {/* Header */}
                  <div className="
                    p-6 border-b border-gray-100
                  ">
                    <h2 className="
                      text-2xl font-bold
                      text-gray-900
                    ">
                      Penilaian Peserta
                    </h2>

                    <p className="
                      text-gray-500 mt-1
                    ">
                      {selectedPeserta.nama_lengkap}
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmitNilai}
                    className="p-6 space-y-5"
                  >

                    <div className="
                      grid grid-cols-1 md:grid-cols-2
                      gap-5
                    ">

                      {[
                        {
                          label: 'Kedisiplinan',
                          key: 'kedisiplinan',
                        },
                        {
                          label: 'Kemampuan Teknis',
                          key: 'kemampuan_teknis',
                        },
                        {
                          label: 'Sikap',
                          key: 'sikap',
                        },
                        {
                          label: 'Kehadiran',
                          key: 'kehadiran',
                        },
                      ].map((item) => (

                        <div key={item.key}>
                          <label className="
                            block mb-2
                            text-sm font-semibold
                            text-gray-700
                          ">
                            {item.label}
                          </label>

                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={formNilai[item.key]}
                            onChange={(e) =>
                              setFormNilai({
                                ...formNilai,
                                [item.key]: e.target.value,
                              })
                            }
                            className="
                              w-full
                              px-4 py-3
                              rounded-2xl
                              border border-gray-200
                              focus:outline-none
                              focus:ring-2
                              focus:ring-blue-500/20
                              focus:border-blue-500
                            "
                          />
                        </div>

                      ))}

                    </div>

                    <div>
                      <label className="
                        block mb-2
                        text-sm font-semibold
                        text-gray-700
                      ">
                        Catatan
                      </label>

                      <textarea
                        rows={4}
                        value={formNilai.catatan}
                        onChange={(e) =>
                          setFormNilai({
                            ...formNilai,
                            catatan: e.target.value,
                          })
                        }
                        className="
                          w-full
                          px-4 py-3
                          rounded-2xl
                          border border-gray-200
                          resize-none
                          focus:outline-none
                          focus:ring-2
                          focus:ring-blue-500/20
                          focus:border-blue-500
                        "
                        placeholder="Tambahkan catatan penilaian..."
                      />
                    </div>
                    <p className="mt-2 text-xs text-black-400 italic">
                      Nilai harus antara 0 - 100
                    </p>

                    {/* Footer */}
                    <div className="
                      flex items-center justify-end
                      gap-3 pt-3
                    ">

                      <button
                        type="button"
                        onClick={() => setSelectedPeserta(null)}
                        className="
                          px-5 py-3
                          rounded-2xl
                          border border-gray-200
                          text-gray-700
                          font-semibold
                          hover:bg-gray-50
                        "
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        disabled={loadingNilai}
                        className="
                          px-6 py-3
                          rounded-2xl
                          bg-blue-600
                          hover:bg-blue-700
                          disabled:opacity-50
                          text-white
                          font-semibold
                          transition
                        "
                      >
                        {
                          loadingNilai
                            ? 'Menyimpan...'
                            : 'Simpan Nilai'
                        }
                      </button>

                    </div>

                  </form>

                </motion.div>

              </div>

            )}

            {filteredPeserta.length === 0 && (
              <div className="
                py-16 text-center
                text-gray-500
              ">
                Tidak ada peserta ditemukan.
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}