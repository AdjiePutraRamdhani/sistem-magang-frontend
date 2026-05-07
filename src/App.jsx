import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import { AdminPersetujuan } from './pages/admin/Persetujuan'
import { AdminData } from './pages/admin/DataMagang'
import { AdminTambahPembimbing } from './pages/admin/TambahPembimbing'
import { MahasiswaDashboard, MahasiswaDaftar, MahasiswaSertifikat } from './pages/mahasiswa/MahasiswaPages'
import { PembimbingDashboard, PembimbingPeserta } from './pages/pembimbing/PembimbingPages'

const Guard = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publik */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin/dashboard"   element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
          <Route path="/admin/persetujuan" element={<Guard roles={['admin']}><AdminPersetujuan /></Guard>} />
          <Route path="/admin/data"        element={<Guard roles={['admin']}><AdminData /></Guard>} />
          <Route path="/admin/pembimbing"  element={<Guard roles={['admin']}><AdminTambahPembimbing /></Guard>} />

          {/* Mahasiswa */}
          <Route path="/mahasiswa/dashboard"  element={<Guard roles={['mahasiswa']}><MahasiswaDashboard /></Guard>} />
          <Route path="/mahasiswa/daftar"     element={<Guard roles={['mahasiswa']}><MahasiswaDaftar /></Guard>} />
          <Route path="/mahasiswa/sertifikat" element={<Guard roles={['mahasiswa']}><MahasiswaSertifikat /></Guard>} />

          {/* Pembimbing */}
          <Route path="/pembimbing/dashboard" element={<Guard roles={['pembimbing']}><PembimbingDashboard /></Guard>} />
          <Route path="/pembimbing/peserta"   element={<Guard roles={['pembimbing']}><PembimbingPeserta /></Guard>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}