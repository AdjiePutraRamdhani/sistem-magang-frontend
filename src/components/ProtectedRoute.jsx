import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 
// Komponen ini membungkus halaman-halaman yang butuh autentikasi.
// Cara kerjanya sederhana: cek dulu apakah user sudah login
// dan apakah role-nya sesuai. Kalau iya, tampilkan halaman.
// Kalau tidak, alihkan ke halaman yang tepat.
//
// Penggunaan di App.jsx:
// <ProtectedRoute allowedRoles={['admin']}>
//   <DashboardAdmin />
// </ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
 
  // Selama pengecekan token berlangsung (loading), tampilkan layar kosong
  // dulu agar tidak ada "kedipan" halaman login sebelum redirect.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh', color: '#666' }}>
        Memuat...
      </div>
    )
  }
 
  // Jika tidak ada user (belum login), arahkan ke halaman login.
  // 'replace' berarti halaman ini tidak masuk ke history browser,
  // sehingga tombol "back" tidak akan kembali ke halaman yang dilindungi.
  if (!user) {
    return <Navigate to="/home" replace />
  }
 
  // Jika role user tidak termasuk dalam daftar yang diizinkan,
  // arahkan ke halaman yang sesuai dengan role-nya masing-masing.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'mahasiswa') return <Navigate to="/mahasiswa/dashboard" replace />
    if (user.role === 'pembimbing') return <Navigate to="/pembimbing/dashboard" replace />
  }
 
  // Semua pengecekan lolos — tampilkan halaman yang diminta.
  return children
}
 