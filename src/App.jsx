import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import { AdminDashboard, AdminPersetujuan, AdminData } from './pages/admin/AdminPages'
import { MahasiswaDashboard, MahasiswaDaftar, MahasiswaSertifikat } from './pages/mahasiswa/MahasiswaPages'

const DashboardPembimbing = () => <h1 style={{ padding: '2rem' }}>Dashboard Pembimbing 🚧</h1>

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publik */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin/dashboard"   element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/persetujuan" element={<ProtectedRoute allowedRoles={['admin']}><AdminPersetujuan /></ProtectedRoute>} />
          <Route path="/admin/data"        element={<ProtectedRoute allowedRoles={['admin']}><AdminData /></ProtectedRoute>} />

          {/* Mahasiswa */}
          <Route path="/mahasiswa/dashboard"  element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaDashboard /></ProtectedRoute>} />
          <Route path="/mahasiswa/daftar"     element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaDaftar /></ProtectedRoute>} />
          <Route path="/mahasiswa/sertifikat" element={<ProtectedRoute allowedRoles={['mahasiswa']}><MahasiswaSertifikat /></ProtectedRoute>} />

          {/* Pembimbing */}
          <Route path="/pembimbing/dashboard" element={<ProtectedRoute allowedRoles={['pembimbing']}><DashboardPembimbing /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}