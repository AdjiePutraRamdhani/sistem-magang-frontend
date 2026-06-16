import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageTitle from '../components/common/PageTitle'
import bgLogin from '@/assets/bg-login.jpeg'
import logoRiau from '@/assets/logo-riau.png'
import api from '../api/axios'
 
export default function Login() {

  // State form
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  // State show/hide password
  const [showPassword, setShowPassword] = useState(false)

  // State error
  const [error, setError] = useState('')

  // State loading
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
 
  // Fungsi ini dipanggil setiap kali user mengetik di input form.
  // 'name' adalah nama field (email/password), 'value' adalah isinya.
  // Spread operator '...' menyalin semua nilai form yang ada,
  // lalu hanya mengubah field yang baru saja diketik.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })

    if (error) {
      setError('')
    }
  }
 
  const handleSubmit = async (e) => {
    // Mencegah form melakukan reload halaman (perilaku default HTML)
    e.preventDefault()
    setError('')
    setLoading(true)
 
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi')
      setLoading(false)
      return
    }

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
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors

        const messages = Object.values(errors)
        .flat()
        .join('\n')

        setError(messages)
      } else {
        const msg = err.response?.data?.message || 'Login gagal. Coba lagi.'
        setError(msg)
      }

    } finally {
      // Blok 'finally' selalu berjalan, baik sukses maupun gagal
      setLoading(false)
    }
  }
 
  return (
    <>
      <PageTitle title="Login" />
        <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <img
        src={bgLogin}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        {/* Kiri */}
        <div className="hidden lg:flex flex-1 px-20 text-white">
          <div className="max-w-xl">
            <img
              src={logoRiau}
              alt="Logo"
              className="w-24 h-24 object-contain mb-6"
            />

            <h1 className="text-5xl font-bold leading-tight">
              Sistem Informasi
              <br />
              Pendataan Magang
            </h1>

            <p className="mt-6 text-xl text-gray-200">
              Dinas Perpustakaan dan Kearsipan
              Provinsi Riau
            </p>

            <div className="w-24 h-1 bg-blue-500 mt-8 rounded-full" />

            <p className="mt-8 text-gray-300 leading-relaxed">
              Platform pengelolaan data magang mahasiswa dan siswa
              secara terintegrasi untuk mendukung proses administrasi,
              monitoring, dan pelaporan kegiatan magang.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[55%] flex justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              relative z-10
              w-full max-w-lg
              bg-white
              rounded-3xl
              shadow-2x1
              overflow-hidden
              shadow-sm
              border
              border-gray-100
              "
          >
            {/* Header Section */}
            <div className="
            bg-gradient-to-r
            from-[#163A63]
            to-[#24538A]
            py-6
            px-8
            flex
            items-center
            gap-4
            ">
              <img
                src={logoRiau}
                alt="Logo Dispursip"
                className="w-20 h-20 object-contain"
              />
              
              <div className="relative z-10 flex-1">
                <h1 className="text-white font-semibold text-lg leading-tight uppercase tracking-tight">
                  Sistem Informasi Pendataan Magang
                </h1>
                <p className="text-gray-300 text-xs mt-0.5 opacity-90 uppercase tracking-wide">
                  Dinas Perpustakaan dan Kearsipan Provinsi Riau
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <Link
              to="/home"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Kembali 
            </Link>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1E3A5F]">
                  Masuk ke sistem
                </h2>

                <p className="text-gray-500 mt-1">
                  Gunakan akun yang telah terdaftar
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3">
                      <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-sm font-medium leading-tight whitespace-pre-line">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Masukkan email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-[#F8F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <motion.button
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-3 px-4 rounded-full font-medium transition-colors shadow-md shadow-blue-500/20 text-white
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-[#1A73E8] hover:bg-[#1557B0]'
                  }`}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </motion.button>
              </form>

              {/* Links */}
              <div className="mt-8 space-y-4 text-center">   
                <div className="text-sm text-gray-600">
                  Mahasiswa/Siswa baru?{' '}
                  <Link to="/register" className="text-[#1A73E8] hover:underline font-semibold">
                    Daftar akun di sini
                  </Link>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Akun Admin & Pembimbing dibuat oleh Administrator sistem
                </p>
              </div>
            </div>
          </motion.div>
        </div>      
      </div>      
    </div>
    </>
  )
}