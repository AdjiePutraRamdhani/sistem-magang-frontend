import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowLeft, Search, User, Mail, Phone, Shield, Trash2, Users } from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'

import PageHeader from '@/components/common/PageHeader'
import PageTitle from '../../components/common/PageTitle'
import Loading from '../../components/common/Loading'

import Card from '@/components/ui/Card'

import InputField from '@/components/form/InputField'
import SubmitButton from '@/components/form/SubmitButton'
import PasswordField from '@/components/form/PasswordField'

import api from '@/api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'

export default function TambahPembimbing() {
  const [pembimbingList, setPembimbingList] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    no_telepon: '',
    nip: '',
    jabatan: '',
    bidang: '',
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchPembimbing()
  }, [])

  const fetchPembimbing = async () => {
    setLoadingList(true)
    try {
      const response = await api.get('/admin/pembimbing')
      setPembimbingList(response.data)
    } catch (err) {
      console.error('Gagal mengambil data pembimbing', err)
    } finally {
      setLoadingList(false)
    }
  }

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pembimbing ${nama}?`)) {
      try {
        await api.delete(`/admin/pembimbing/${id}`)
        alert('Pembimbing berhasil dihapus')
        fetchPembimbing()
      } catch (err) {
        console.error('Gagal menghapus pembimbing', err)
        alert(err.response?.data?.message || 'Gagal menghapus pembimbing')
      }
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setErrors({})

    try {
      await api.post('/admin/pembimbing', form)

      alert('Pembimbing berhasil ditambahkan')

      setForm({
        nama_lengkap: '',
        email: '',
        password: '',
        no_telepon: '',
        nip: '',
        jabatan: '',
        bidang: '',
      })
      setShowForm(false)
      fetchPembimbing()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPembimbing = pembimbingList.filter((p) => {
    const search = searchTerm.toLowerCase()
    return (
      (p.nama_lengkap || '').toLowerCase().includes(search) ||
      (p.nip || '').toLowerCase().includes(search) ||
      (p.email || '').toLowerCase().includes(search) ||
      (p.jabatan || '').toLowerCase().includes(search) ||
      (p.bidang || '').toLowerCase().includes(search)
    )
  })

  return (
    <>
      <PageTitle title="Dashboard Admin" />
      <DashboardLayout menuItems={ADMIN_MENU}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {showForm ? (
            // FORM TAMBAH PEMBIMBING
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setErrors({})
                  }}
                  className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <PageHeader
                  title="Tambah Pembimbing"
                  description="Buat akun untuk pembimbing instansi"
                />
              </div>

              <Card className="max-w-2xl">
                <form
                  onSubmit={handleSubmit}
                  className="p-8 space-y-6"
                >
                  <InputField
                    label="Nama Lengkap"
                    name="nama_lengkap"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                    error={errors.nama_lengkap?.[0]}
                    placeholder="Nama lengkap"
                  />

                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email?.[0]}
                    placeholder="Email"
                  />

                  <PasswordField
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password?.[0]}
                    placeholder="Password"
                  />

                  <InputField
                    label="Nomor Telepon"
                    name="no_telepon"
                    value={form.no_telepon}
                    onChange={handleChange}
                    error={errors.no_telepon?.[0]}
                    placeholder="08xxxxxxxxxx"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="NIP"
                      name="nip"
                      value={form.nip}
                      onChange={handleChange}
                      error={errors.nip?.[0]}
                      placeholder="Nomor Induk Pegawai"
                    />

                    <InputField
                      label="Jabatan"
                      name="jabatan"
                      value={form.jabatan}
                      onChange={handleChange}
                      error={errors.jabatan?.[0]}
                      placeholder="Jabatan"
                    />
                  </div>

                  <InputField
                    label="Bidang"
                    name="bidang"
                    value={form.bidang}
                    onChange={handleChange}
                    error={errors.bidang?.[0]}
                    placeholder="Bidang / Divisi"
                  />

                  <SubmitButton loading={loading}>
                    Tambah Pembimbing
                  </SubmitButton>
                </form>
              </Card>
            </div>
          ) : (
            // DAFTAR PEMBIMBING
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                  title="Daftar Pembimbing"
                  description="Kelola akun pembimbing instansi yang aktif dalam sistem"
                />
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1E3A5F] hover:bg-[#152943] text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-900/10"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Pembimbing
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pembimbing (nama, NIP, email, jabatan, bidang)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 text-sm bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl outline-none transition-all"
                  />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Total: {filteredPembimbing.length} Pembimbing
                </div>
              </div>

              {/* Table / Grid */}
              {loadingList ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                  <Loading />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Pembimbing
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Jabatan & Bidang
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Kontak & Identitas
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Total Bimbingan
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredPembimbing.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="font-medium">Tidak ada pembimbing ditemukan</p>
                            </td>
                          </tr>
                        ) : (
                          filteredPembimbing.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-gray-50/30 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {p.nama_lengkap?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {p.nama_lengkap}
                                    </p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                      <Shield className="w-3.5 h-3.5 text-gray-400" />
                                      NIP. {p.nip || '-'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-gray-700">
                                  {p.jabatan || '-'}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {p.bidang || '-'}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    {p.email || '-'}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    {p.no_telepon || '-'}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                  <Users className="w-3.5 h-3.5" />
                                  {p.total_mhs || 0} Mahasiswa
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDelete(p.id, p.nama_lengkap)}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all shadow-sm"
                                  title="Hapus Pembimbing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </DashboardLayout>
    </>
  )
}