import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { formatTanggal } from '../../utils/formatTanggal'
import { styles } from '../../styles/adminStyles'

// ================================================================
// HALAMAN: Tambah Pembimbing (FIX BUG 5)
// ================================================================
export function AdminTambahPembimbing() {
  const [form, setForm]         = useState({ nama_lengkap: '', email: '', password: '', nip: '', jabatan: '', bidang: '' })
  const [errors, setErrors]     = useState({})
  const [success, setSuccess]   = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post('/admin/pembimbing', form)
      setSuccess('Akun pembimbing berhasil dibuat.')
      setForm({ nama_lengkap: '', email: '', password: '', nip: '', jabatan: '', bidang: '' })
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally { setSubmitting(false) }
  }

  const ErrorMsg = ({ field }) => errors[field]
    ? <p style={{ fontSize: '12px', color: '#DC2626', margin: '4px 0 0' }}>{errors[field][0]}</p>
    : null

  return (
    <DashboardLayout menuItems={ADMIN_MENU} title="Tambah Pembimbing">
      <div style={{ maxWidth: '520px' }}>
        <div style={styles.panel}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '18px' }}>
            Buat akun Pembimbing Instansi
          </div>

          {success && (
            <div style={{ background: '#EAF3DE', color: '#27500A', padding: '10px 14px',
              borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.th}>Nama lengkap *</label>
              <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange}
                style={styles.input} placeholder="Nama pembimbing" />
              <ErrorMsg field="nama_lengkap" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.th}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                style={styles.input} placeholder="email@dispusip.go.id" />
              <ErrorMsg field="email" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.th}>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                style={styles.input} placeholder="Min. 8 karakter" />
              <ErrorMsg field="password" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={styles.th}>NIP</label>
                <input name="nip" value={form.nip} onChange={handleChange}
                  style={styles.input} placeholder="Nomor Induk Pegawai" />
              </div>
              <div>
                <label style={styles.th}>Jabatan</label>
                <input name="jabatan" value={form.jabatan} onChange={handleChange}
                  style={styles.input} placeholder="Jabatan di instansi" />
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={styles.th}>Bidang / Divisi</label>
              <input name="bidang" value={form.bidang} onChange={handleChange}
                style={styles.input} placeholder="Bidang atau divisi" />
            </div>
            <button type="submit" disabled={submitting}
              style={{ width: '100%', padding: '10px', background: '#0C447C', color: '#fff',
                border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Menyimpan...' : 'Buat akun pembimbing'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}