import { useState } from 'react'
import { motion } from 'framer-motion'

import DashboardLayout from '@/components/layout/DashboardLayout'

import PageHeader from '@/components/common/PageHeader'

import Card from '@/components/ui/Card'

import InputField from '@/components/form/InputField'
import SubmitButton from '@/components/form/SubmitButton'
import PasswordField from '@/components/form/PasswordField'

import api from '@/api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'

export default function TambahPembimbing() {
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
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout menuItems={ADMIN_MENU}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        <PageHeader
          title="Tambah Pembimbing"
          description="Buat akun untuk pembimbing instansi"
        />

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
      </motion.div>
    </DashboardLayout>
  )
}