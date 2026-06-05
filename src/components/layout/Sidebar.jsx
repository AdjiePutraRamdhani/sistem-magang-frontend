import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ClipboardList, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import logoRiau from '@/assets/logo-riau.png'
import api from '@/api/axios'

export default function Sidebar({ menuItems = [] }) {
  const { pathname } = useLocation()

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (err) {
      console.error(err)
    } finally {
      logout()
      navigate('/home')
    }
  }

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50 shadow-sm shadow-black/5">
      {/* Logo */}
      <div className="border-b border-gray-200 shadow-sm shadow-black/5">
        <div className="p-6 mb-2 bg-white rounded-b-lg">
          <div className="flex items-center gap-3">
            <img
              src={logoRiau}
              alt="Logo Dispursip"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h2 className="text-sm font-bold text-gray-800 leading-tight">
                Sistem Informasi Pendataan Magang
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Dispursip Prov. Riau
              </p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg overflow-hidden ${
                active
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeMenu"
                  className="absolute inset-0 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <item.icon
                size={20}
                className={`relative z-10 ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              />

              <span className="relative z-10 text-sm">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 p-2 px-4 transition-colors"
        >
          <LogOut size={18} />

          Keluar
        </button>
      </div>
    </aside>
  )
}