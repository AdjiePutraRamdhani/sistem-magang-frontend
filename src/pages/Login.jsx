import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
 
export default function Login() {
  // State untuk menyimpan nilai input form
  const [form, setForm] = useState({ email: '', password: '' })
 
  // State untuk menyimpan pesan error dari server
  const [error, setError] = useState('')
 
  // State untuk menandai apakah request sedang berjalan
  // (dipakai untuk menonaktifkan tombol agar tidak diklik dua kali)
  const [loading, setLoading] = useState(false)
 
  const { login } = useAuth()
  const navigate = useNavigate()
 
  // Fungsi ini dipanggil setiap kali user mengetik di input form.
  // 'name' adalah nama field (email/password), 'value' adalah isinya.
  // Spread operator '...' menyalin semua nilai form yang ada,
  // lalu hanya mengubah field yang baru saja diketik.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
 
  const handleSubmit = async (e) => {
    // Mencegah form melakukan reload halaman (perilaku default HTML)
    e.preventDefault()
    setError('')
    setLoading(true)
 
    try {
      const res = await api.post('/login', form)
      const { token, user } = res.data
 
      // Simpan token dan data user ke localStorage via AuthContext
      login(token, user)
 
      // Arahkan user ke dashboard sesuai role-nya masing-masing
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'mahasiswa') navigate('/mahasiswa/dashboard')
      else if (user.role === 'pembimbing') navigate('/pembimbing/dashboard')
 
    } catch (err) {
      // Ambil pesan error dari response Laravel.
      // Operator '?.' adalah optional chaining — mencegah error
      // jika salah satu properti tidak ada (misalnya tidak ada koneksi internet)
      const msg = err.response?.data?.message || 'Login gagal. Coba lagi.'
      setError(msg)
    } finally {
      // Blok 'finally' selalu berjalan, baik sukses maupun gagal
      setLoading(false)
    }
  }
 
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
          <h2 style={styles.cardTitle}>Masuk ke sistem</h2>
          <p style={styles.cardSub}>Gunakan akun yang telah terdaftar</p>
 
          {/* Banner info untuk mahasiswa baru */}
          <div style={styles.infoBanner}>
            Mahasiswa/Siswa baru?{' '}
            <Link to="/register" style={styles.link}>Daftar akun di sini</Link>
          </div>
 
          {/* Pesan error — hanya tampil jika ada error */}
          {error && <div style={styles.errorBanner}>{error}</div>}
 
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
 
            <div style={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={styles.label}>Password</label>
              </div>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
 
            <button
              type="submit"
              style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
 
          <p style={styles.footerNote}>
            Akun Admin & Pembimbing dibuat oleh Administrator sistem
          </p>
        </div>
      </div>
    </div>
  )
}
 
// Objek styles — cara menulis CSS langsung di dalam file React (inline styles).
// Untuk proyek yang lebih besar, lebih baik menggunakan file CSS terpisah
// atau library seperti Tailwind CSS.
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#F0F4F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: { width: '100%', maxWidth: '440px' },
  header: {
    background: '#0C447C',
    padding: '16px 20px',
    borderRadius: '10px 10px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logo: {
    width: '40px', height: '40px',
    background: '#fff', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '10px', fontWeight: '600', color: '#0C447C', flexShrink: 0,
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: '13px', fontWeight: '500' },
  headerSub: { margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '11px' },
  card: {
    background: '#fff',
    borderRadius: '0 0 10px 10px',
    padding: '28px 28px 32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cardTitle: { margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' },
  cardSub: { margin: '0 0 20px', fontSize: '13px', color: '#666' },
  infoBanner: {
    background: '#E6F1FB', color: '#0C447C',
    padding: '10px 14px', borderRadius: '6px',
    fontSize: '13px', marginBottom: '20px',
  },
  errorBanner: {
    background: '#FEE2E2', color: '#991B1B',
    padding: '10px 14px', borderRadius: '6px',
    fontSize: '13px', marginBottom: '16px',
    border: '1px solid #FECACA',
  },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#444', marginBottom: '6px' },
  input: {
    width: '100%', padding: '9px 12px',
    fontSize: '14px', border: '1px solid #D1D5DB',
    borderRadius: '6px', boxSizing: 'border-box',
    outline: 'none', color: '#1a1a1a',
  },
  btnPrimary: {
    width: '100%', padding: '10px',
    background: '#0C447C', color: '#fff',
    border: 'none', borderRadius: '6px',
    fontSize: '14px', fontWeight: '500',
    cursor: 'pointer', marginTop: '8px',
  },
  link: { color: '#185FA5', textDecoration: 'underline', cursor: 'pointer' },
  footerNote: {
    fontSize: '12px', color: '#999',
    textAlign: 'center', marginTop: '16px', marginBottom: 0,
  },
}
 