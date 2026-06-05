import { Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import getCurrentDate from '@/utils/getCurrentDate'

export default function Topbar() {
  const { user } = useAuth()

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm shadow-black/5">
      {/* Tanggal */}
      <div className="text-gray-500 text-sm font-medium">
        {getCurrentDate()}
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        {/*<button className="text-gray-400 hover:text-gray-600 relative transition-colors">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>*/}

        <div className="h-8 w-px bg-gray-200" />

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">
              {user?.nama_lengkap || 'Administrator'}
            </p>

            <p className="text-xs text-gray-400">
              {user?.role || 'Admin'}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.nama_lengkap || 'Admin'}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}