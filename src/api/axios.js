import axios from 'axios'
 
// Membuat instance axios dengan konfigurasi default.
// Semua request yang menggunakan 'api' ini akan otomatis
// menyertakan baseURL dan header di bawah — kita tidak perlu
// menuliskannya berulang kali di setiap komponen.
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // alamat server Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})
 
// INTERCEPTOR REQUEST — dijalankan SEBELUM setiap request dikirim.
// Tugasnya: mengambil token dari localStorage (tempat penyimpanan
// browser) dan menyisipkannya ke header Authorization.
// Dengan ini, kita tidak perlu menambahkan token secara manual
// di setiap pemanggilan API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
 
// INTERCEPTOR RESPONSE — dijalankan SETELAH response diterima.
// Tugasnya: menangkap error 401 (Unauthorized) secara global.
// Jika token sudah kadaluarsa atau tidak valid, pengguna
// otomatis diarahkan kembali ke halaman login.
api.interceptors.response.use(
  (response) => response, // jika sukses, kembalikan response apa adanya
  (error) => {
    if (error.response?.status === 401) {
      // Hapus token yang tidak valid dari localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Arahkan ke halaman login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
 
export default api
 