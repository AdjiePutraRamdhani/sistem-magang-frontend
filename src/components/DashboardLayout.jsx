import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
 
// Komponen layout ini dipakai bersama oleh semua dashboard
// (Admin, Mahasiswa, Pembimbing) agar tampilan sidebar & topbar
// konsisten di seluruh aplikasi.
export default function DashboardLayout({ children, menuItems, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)
 
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await api.post('/logout')
    } finally {
      logout()
      navigate('/login')
    }
  }
 
  // Ambil inisial nama untuk avatar (contoh: "Hasan Basri" → "HB")
  const initials = user?.nama_lengkap
    ?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
 
  return (
    <div style={styles.shell}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>RIAU</div>
          <div>
            <div style={styles.brandName}>Sistem Pendataan Magang</div>
            <div style={styles.brandSub}>Dispusip Prov. Riau</div>
          </div>
        </div>
 
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? (
                  <span style={styles.badge}>{item.badge}</span>
                ) : null}
              </div>
            )
          })}
        </nav>
 
        {/* Info user + tombol logout */}
        <div style={styles.userBox}>
          <div style={styles.avatar}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.nama_lengkap}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={styles.logoutBtn}
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
 
      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>{title}</div>
          <div style={styles.topbarDate}>
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long', day: 'numeric',
              month: 'long', year: 'numeric'
            })}
          </div>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  )
}
 
const styles = {
  shell: { display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', fontSize: '13px' },
  sidebar: { width: '210px', flexShrink: 0, background: '#0C447C', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' },
  brand: { padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { width: '34px', height: '34px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: '#0C447C', flexShrink: 0 },
  brandName: { color: '#fff', fontSize: '11px', fontWeight: '500', lineHeight: 1.4 },
  brandSub: { color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '2px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', margin: '1px 8px', borderRadius: '6px', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', fontSize: '12px', transition: 'background 0.15s' },
  navItemActive: { background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: '500' },
  badge: { marginLeft: 'auto', background: '#E24B4A', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px' },
  userBox: { padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '9px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B5D4F4', fontSize: '11px', fontWeight: '600', flexShrink: 0 },
  userName: { color: '#fff', fontSize: '12px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'capitalize' },
  logoutBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '16px', padding: '0', flexShrink: 0 },
  main: { flex: 1, background: '#F0F4F8', display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topbar: { background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  topbarTitle: { fontSize: '15px', fontWeight: '600', color: '#111' },
  topbarDate: { fontSize: '12px', color: '#999' },
  content: { padding: '20px 24px', flex: 1 },
}
 