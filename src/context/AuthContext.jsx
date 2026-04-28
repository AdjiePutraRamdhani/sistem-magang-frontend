import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
 
// Membuat "papan pengumuman" global.
// Komponen mana pun yang butuh data user bisa membaca dari sini.
const AuthContext = createContext(null)
 
export function AuthProvider({ children }) {
  // State 'user' menyimpan data user yang sedang login.
  // Kita coba ambil dari localStorage saat pertama kali aplikasi dibuka,
  // agar user tidak harus login ulang setiap kali refresh halaman.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
 
  const [loading, setLoading] = useState(true)
 
  // useEffect ini berjalan sekali saat aplikasi pertama kali dibuka.
  // Tugasnya memverifikasi apakah token yang tersimpan di localStorage
  // masih valid dengan cara memanggil endpoint /me di Laravel.
  // Kalau token sudah kadaluarsa, user akan otomatis di-logout.
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/me')
        .then((res) => setUser(res.data.user))
        .catch(() => logout()) // token tidak valid, logout otomatis
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])
 
  // Fungsi login: simpan token dan data user ke localStorage,
  // lalu update state agar semua komponen tahu ada yang login.
  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }
 
  // Fungsi logout: bersihkan semua data dari localStorage dan state.
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }
 
  return (
    // 'value' adalah data yang dibagikan ke semua komponen di bawahnya.
    // Komponen anak bisa mengakses user, login(), dan logout()
    // dari mana saja tanpa perlu prop drilling.
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
 
// Custom hook ini memudahkan komponen lain menggunakan AuthContext.
// Daripada menulis useContext(AuthContext) setiap saat,
// cukup tulis useAuth() saja.
export function useAuth() {
  return useContext(AuthContext)
}
 