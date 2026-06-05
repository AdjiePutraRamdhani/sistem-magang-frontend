import {
  Award,
  LayoutDashboard,
  Users2,
} from 'lucide-react'

export const PEMBIMBING_MENU = [
  {
    label: 'Dashboard',
    path: '/pembimbing/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Peserta Bimbingan',
    path: '/pembimbing/peserta',
    icon: Users2,
  },
  {
    label: 'Sertifikat Peserta',
    path: '/pembimbing/sertifikat',
    icon: Award,
  }
]