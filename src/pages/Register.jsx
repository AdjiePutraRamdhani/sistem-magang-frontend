import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
 
export default function Register() {
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    nim_nisn: '',
    asal_instansi: '',
    program_studi: '',
    password: '',
    password_confirmation: '',
  })
 
  // errors menyimpan pesan error per field dari Laravel validation.
  // Contoh: { email: ['Email sudah digunakan.'], password: ['Min. 8 karakter.'] }
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Hapus error untuk field yang sedang diketik agar tidak mengganggu
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
 
    try {
      const res = await api.post('/register', form)
      const { token, user } = res.data
 
      login(token, user)
      navigate('/mahasiswa/dashboard')
 
    } catch (err) {
      // Error 422 dari Laravel berisi objek 'errors' dengan pesan per field.
      // Kita simpan ke state 'errors' agar bisa ditampilkan
      // di bawah masing-masing input yang bermasalah.
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setLoading(false)
    }
  }
 
  // Helper untuk menampilkan pesan error di bawah input tertentu
  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p style={styles.errorText}>{errors[field][0]}</p>
    ) : null
 
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>RIAU</div>
          <div>
            <p style={styles.headerTitle}>Sistem Informasi Pendataan Magang</p>
            <p style={styles.headerSub}>Dinas Perpustakaan dan Kearsipan Provinsi Riau</p>
          </div>
        </div>
 
        {/* Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Buat akun baru</h2>
          <p style={styles.cardSub}>Khusus untuk Mahasiswa/Siswa Magang</p>
 
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama lengkap <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" name="nama_lengkap"
                placeholder="Nama sesuai KTP/KTM" value={form.nama_lengkap}
                onChange={handleChange} required />
              <ErrorMsg field="nama_lengkap" />
            </div>
 
            <div style={styles.formGroup}>
              <label style={styles.label}>Email <span style={styles.req}>*</span></label>
              <input style={styles.input} type="email" name="email"
                placeholder="contoh@email.com" value={form.email}
                onChange={handleChange} required />
              <ErrorMsg field="email" />
            </div>
 
            {/* Dua input dalam satu baris */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>No. telepon</label>
                <input style={styles.input} type="text" name="no_telepon"
                  placeholder="08xxxxxxxxxx" value={form.no_telepon}
                  onChange={handleChange} />
                <ErrorMsg field="no_telepon" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>NIM / NISN</label>
                <input style={styles.input} type="text" name="nim_nisn"
                  placeholder="NIM atau NISN" value={form.nim_nisn}
                  onChange={handleChange} />
                <ErrorMsg field="nim_nisn" />
              </div>
            </div>
 
            <div style={styles.formGroup}>
              <label style={styles.label}>Asal instansi / kampus <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" name="asal_instansi"
                placeholder="Universitas / Sekolah" value={form.asal_instansi}
                onChange={handleChange} required />
              <ErrorMsg field="asal_instansi" />
            </div>
 
            <div style={styles.formGroup}>
              <label style={styles.label}>Program studi / jurusan</label>
              <input style={styles.input} type="text" name="program_studi"
                placeholder="Program studi" value={form.program_studi}
                onChange={handleChange} />
              <ErrorMsg field="program_studi" />
            </div>
 
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password <span style={styles.req}>*</span></label>
                <input style={styles.input} type="password" name="password"
                  placeholder="Min. 8 karakter" value={form.password}
                  onChange={handleChange} required />
                <ErrorMsg field="password" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Konfirmasi password <span style={styles.req}>*</span></label>
                <input style={styles.input} type="password" name="password_confirmation"
                  placeholder="Ulangi password" value={form.password_confirmation}
                  onChange={handleChange} required />
              </div>
            </div>
 
            <p style={styles.hint}>Password minimal 8 karakter, kombinasi huruf dan angka</p>
 
            <button
              type="submit"
              style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>
 
          <p style={styles.footerNote}>
            Sudah punya akun?{' '}
            <Link to="/login" style={styles.link}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
 
const styles = {
  wrapper: {
    minHeight: '100vh', background: '#F0F4F8',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '20px',
  },
  container: { width: '100%', maxWidth: '480px' },
  header: {
    background: '#0C447C', padding: '16px 20px',
    borderRadius: '10px 10px 0 0',
    display: 'flex', alignItems: 'center', gap: '14px',
  },
  logo: {
    width: '40px', height: '40px', background: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '10px', fontWeight: '600',
    color: '#0C447C', flexShrink: 0,
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: '13px', fontWeight: '500' },
  headerSub: { margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '11px' },
  card: {
    background: '#fff', borderRadius: '0 0 10px 10px',
    padding: '28px 28px 32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cardTitle: { margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' },
  cardSub: { margin: '0 0 20px', fontSize: '13px', color: '#666' },
  formGroup: { marginBottom: '14px', flex: 1 },
  formRow: { display: 'flex', gap: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#444', marginBottom: '5px' },
  req: { color: '#E24B4A' },
  input: {
    width: '100%', padding: '8px 11px', fontSize: '13px',
    border: '1px solid #D1D5DB', borderRadius: '6px',
    boxSizing: 'border-box', outline: 'none', color: '#1a1a1a',
  },
  errorText: { margin: '4px 0 0', fontSize: '12px', color: '#DC2626' },
  hint: { fontSize: '11px', color: '#999', margin: '-8px 0 14px' },
  btnPrimary: {
    width: '100%', padding: '10px', background: '#0C447C',
    color: '#fff', border: 'none', borderRadius: '6px',
    fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginTop: '4px',
  },
  link: { color: '#185FA5', textDecoration: 'underline' },
  footerNote: { fontSize: '13px', textAlign: 'center', marginTop: '16px', marginBottom: 0, color: '#555' },
}
 