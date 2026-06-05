import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserPlus,
} from 'lucide-react'

export const ADMIN_MENU = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Persetujuan Magang',
    path: '/admin/persetujuan',
    icon: CheckSquare,
  },
  {
    label: 'Kelola Data Magang',
    path: '/admin/data',
    icon: Users,
  },
  {
    label: 'Tambah Pembimbing',
    path: '/admin/pembimbing',
    icon: UserPlus,
  },
]