import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2  } from 'lucide-react'
import logoRiau from '@/assets/logo-riau.png'
import bgLogin from '@/assets/bg-login.jpeg'

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
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [generalError, setGeneralError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const inputClass = (field) => `
    w-full px-4 py-2.5 bg-slate-50 border rounded-xl
    focus:ring-2 focus:border-transparent outline-none
    transition-all duration-200 hover:border-slate-300
    disabled:opacity-70 disabled:cursor-not-allowed
    ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-slate-200 focus:ring-blue-500'
    }
    `
  const passwordValid =
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)

  const passwordMatch =
    form.password_confirmation === '' ||
    form.password === form.password_confirmation
 
  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'no_telepon') {
      value = value.replace(/\D/g, '')
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }

    if (generalError) {
      setGeneralError('')
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setErrors({})
    setGeneralError('')
    setLoading(true)

    if (form.password !== form.password_confirmation) {
      setErrors({
        password_confirmation: ['Konfirmasi password tidak cocok.'],
      })
      setLoading(false)
      return
    }
 
    try {
      const res = await api.post('/register', form)
      const { token, user } = res.data
 
      login(token, user)
      setShowPassword(false)
      setShowConfirmPassword(false)
      navigate('/mahasiswa/dashboard')
 
    } catch (err) {
      // Error 422 dari Laravel berisi objek 'errors' dengan pesan per field.
      // Kita simpan ke state 'errors' agar bisa ditampilkan
      // di bawah masing-masing input yang bermasalah.
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setGeneralError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }
 
  // Helper untuk menampilkan pesan error di bawah input tertentu
  const ErrorMsg = ({ field }) =>
  errors[field] ? (
    <p className="text-xs text-red-500 mt-1">
      {errors[field][0]}
    </p>
  ) : null
 
  return (
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
        {/* KIRI */}
        <div className="hidden lg:flex flex-1 px-20 text-white">
          <div className="max-w-xl">
            <img
              src={logoRiau}
              alt="Logo"
              className="w-24 h-24 mb-6"
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
              Pendaftaran mahasiswa dan siswa magang dilakukan secara online
              melalui sistem ini.
            </p>
          </div>
        </div>

        {/* KANAN */}
        <div className="w-full lg:w-[55%] flex justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
    
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#163A63] to-[#24538A] p-6 md:p-8 text-white flex items-center gap-4">
              
              <img
                src={logoRiau}
                alt="Logo Dispursip"
                className="w-20 h-20 object-contain"
              />
    
              <div className="border-l border-white/30 pl-4 h-12 flex flex-col justify-center">
                <h1 className="text-lg md:text-xl font-bold leading-tight">
                  Reegistrasi Peserta Magang
                </h1>
    
                <p className="text-xs md:text-sm opacity-90 text-blue-50/80 uppercase tracking-wide">
                  Dinas Perpustakaan dan Kearsipan Provinsi Riau
                </p>
              </div>
            </div>
    
            {/* FORM */}
            <div className="p-6 md:p-10">
    
              {/* TITLE */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Buat akun baru
                </h2>
    
                <p className="text-slate-500 mt-1">
                  Khusus untuk Mahasiswa/Siswa Magang
                </p>
              </div>
    
              <form onSubmit={handleSubmit} className="space-y-8">
    
                {/* PERSONAL INFO */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    Personal Info
                  </h3>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                    {/* NAMA */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                        Nama lengkap <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        autoFocus
                        type="text"
                        name="nama_lengkap"
                        autoComplete="name"
                        required
                        placeholder="Nama sesuai KTP/KTM"
                        value={form.nama_lengkap}
                        onChange={handleChange}
                        className={inputClass('nama_lengkap')}
                      />
    
                      <ErrorMsg field="nama_lengkap" />
                    </div>
    
                    {/* EMAIL */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="contoh@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass('email')}
                      />
    
                      <ErrorMsg field="email" />
                    </div>
    
                    {/* TELEPON */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                        No. Telepon <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        type="text"
                        inputMode="numeric"
                        name="no_telepon"
                        maxLength={15}
                        autoComplete="tel"
                        placeholder="08xxxxxxxxxx"
                        value={form.no_telepon}
                        onChange={handleChange}
                        className={inputClass('no_telepon')}
                      />
    
                      <ErrorMsg field="no_telepon" />
                    </div>
    
                    {/* NIM */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5">
                        NIM / NISN <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        type="text"
                        name="nim_nisn"
                        placeholder="NIM atau NISN"
                        value={form.nim_nisn}
                        onChange={handleChange}
                        className={inputClass('nim_nisn')}
                      />
    
                      <ErrorMsg field="nim_nisn" />
                    </div>
                  </div>
                </div>
    
                {/* AKADEMIK */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    Academic Details
                  </h3>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                    {/* INSTANSI */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                        Asal instansi / kampus <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        type="text"
                        name="asal_instansi"
                        required
                        autoComplete="organization"
                        placeholder="Universitas / Sekolah"
                        value={form.asal_instansi}
                        onChange={handleChange}
                        className={inputClass('asal_instansi')}
                      />
    
                      <ErrorMsg field="asal_instansi" />
                    </div>
    
                    {/* PRODI */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5">
                        Program studi / jurusan <span className="text-red-500">*</span>
                      </label>
    
                      <input
                        disabled={loading}
                        type="text"
                        name="program_studi"
                        placeholder="Program studi"
                        value={form.program_studi}
                        onChange={handleChange}
                        className={inputClass('program_studi')}
                      />
    
                      <ErrorMsg field="program_studi" />
                    </div>
                  </div>
                </div>
    
                {/* PASSWORD */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    Security
                  </h3>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                    {/* PASSWORD */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
    
                      <div className="relative">
                        <input
                          disabled={loading}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          autoComplete="new-password"
                          required
                          placeholder="Min. 8 karakter"
                          value={form.password}
                          onChange={handleChange}
                          className={inputClass('password')}
                        />
    
                        <button
                          type="button"
                          disabled={loading}
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 
                          text-slate-400 hover:text-slate-600
                          transition-colors
                          disabled:cursor-not-allowed"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
    
                      <p
                        className={`text-[11px] mt-1 font-medium ${
                          passwordValid ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        Password minimal 8 karakter, kombinasi huruf dan angka
                      </p>
    
                      <ErrorMsg field="password" />
                    </div>
    
                    {/* KONFIRMASI PASSWORD */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                        Konfirmasi password <span className="text-red-500">*</span>
                      </label>
    
                      <div className="relative">
                        <input
                          disabled={loading}
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="password_confirmation"
                          required
                          placeholder="Ulangi password"
                          value={form.password_confirmation}
                          onChange={handleChange}
                          className={inputClass('password_confirmation')}
                        />
    
                        <button
                          type="button"
                          disabled={loading}
                          aria-label="Toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 
                          text-slate-400 hover:text-slate-600
                          transition-colors
                          disabled:cursor-not-allowed"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {form.password_confirmation && (
                        <p
                          className={`text-[11px] mt-1 font-medium ${
                            passwordMatch ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {passwordMatch
                            ? 'Konfirmasi password cocok'
                            : 'Konfirmasi password tidak cocok'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
    
                {/* BUTTON */}
                <div className="pt-4 space-y-4">
                  {generalError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      {generalError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={ loading || !passwordValid || !passwordMatch }
                    className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg
                    active:scale-[0.98] transition-all text-sm uppercase tracking-wider
                    disabled:opacity-80 disabled:cursor-not-allowed
                    ${
                      loading
                        ? 'bg-blue-400 cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Memproses...
                      </span>
                    ) : (
                        'Daftar'
                      )}
                  </button>
    
                  <p className="text-center text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link
                      to="/login"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
    
              </form>
            </div>
          </motion.div>
        </div>
      </div>      
    </div>
  )
}