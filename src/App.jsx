import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import LandingPageView from './pages/LandingPageView'
import Login from './pages/Login'
import Register from './pages/Register'

/* Admin */
import Dashboard from './pages/admin/AdminDashboard'
import Persetujuan from './pages/admin/Persetujuan'
import KelolaData from './pages/admin/KelolaData'
import TambahPembimbing from './pages/admin/TambahPembimbing'

/* Mahasiswa */
import MahasiswaDashboard from './pages/mahasiswa/MahasiswaDashboard'
import DaftarMagang from './pages/mahasiswa/DaftarMagang'
import Sertifikat from './pages/mahasiswa/Sertifikat'

/* Pembimbing */
import PembimbingDashboard from './pages/pembimbing/PembimbingDashboard'
import PesertaBimbingan from './pages/pembimbing/PesertaBimbingan'
import SertifikatPeserta from './pages/pembimbing/SertifikatPeserta'

const Guard = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>
    {children}
  </ProtectedRoute>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC */}
          <Route
            path="/home"
            element={<LandingPageView />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <Guard roles={['admin']}>
                <Dashboard />
              </Guard>
            }
          />

          <Route
            path="/admin/persetujuan"
            element={
              <Guard roles={['admin']}>
                <Persetujuan />
              </Guard>
            }
          />

          <Route
            path="/admin/data"
            element={
              <Guard roles={['admin']}>
                <KelolaData />
              </Guard>
            }
          />

          <Route
            path="/admin/pembimbing"
            element={
              <Guard roles={['admin']}>
                <TambahPembimbing />
              </Guard>
            }
          />

          {/* MAHASISWA */}
          <Route
            path="/mahasiswa/dashboard"
            element={
              <Guard roles={['mahasiswa']}>
                <MahasiswaDashboard />
              </Guard>
            }
          />

          <Route
            path="/mahasiswa/daftar"
            element={
              <Guard roles={['mahasiswa']}>
                <DaftarMagang />
              </Guard>
            }
          />

          <Route
            path="/mahasiswa/sertifikat"
            element={
              <Guard roles={['mahasiswa']}>
                <Sertifikat />
              </Guard>
            }
          />

          {/* PEMBIMBING */}
          <Route
            path="/pembimbing/dashboard"
            element={
              <Guard roles={['pembimbing']}>
                <PembimbingDashboard />
              </Guard>
            }
          />

          <Route
            path="/pembimbing/peserta"
            element={
              <Guard roles={['pembimbing']}>
                <PesertaBimbingan />
              </Guard>
            }
          />

          <Route
            path="/pembimbing/sertifikat"
            element={
              <Guard roles={['pembimbing']}>
                <SertifikatPeserta />
              </Guard>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}