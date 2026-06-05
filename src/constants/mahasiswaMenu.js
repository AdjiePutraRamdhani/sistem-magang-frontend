import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
} from 'lucide-react'

export const MAHASISWA_MENU = [
  {
    label: 'Status Magang',
    path: '/mahasiswa/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Daftar Magang',
    path: '/mahasiswa/daftar',
    icon: UserPlus,
  },
  {
    label: 'Sertifikat Magang',
    path: '/mahasiswa/sertifikat',
    icon: ClipboardList,
  },
]