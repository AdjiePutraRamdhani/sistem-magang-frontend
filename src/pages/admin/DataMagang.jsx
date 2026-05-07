import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { formatTanggal } from '../../utils/formatTanggal'
import { styles } from '../../styles/adminStyles'

// ================================================================
// HALAMAN: Kelola Data Magang
// ================================================================
export function AdminData() {
  const [data, setData]     = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [msg, setMsg]       = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api.get(`/admin/mahasiswa?search=${search}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/mahasiswa/${id}`)
      setDeleteId(null)
      load()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Gagal menghapus data.')
    }
  }

  return (
    <DashboardLayout menuItems={ADMIN_MENU} title="Kelola Data Magang">
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Data seluruh peserta magang</span>
          <input style={{ ...styles.input, width: '200px', marginBottom: 0 }}
            placeholder="Cari nama / instansi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {msg && <p style={{ ...styles.errText, padding: '10px 16px' }}>{msg}</p>}
        {loading ? <p style={styles.empty}>Memuat...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Nama peserta','Asal instansi','Pembimbing','Periode','Status','Aksi'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#aaa' }}>Data tidak tersedia</td></tr>
                  : data.map(item => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{item.nama_lengkap}</strong>
                        <br /><span style={styles.meta}>{item.program_studi}</span>
                      </td>
                      <td style={styles.td}>{item.asal_instansi}</td>
                      <td style={styles.td}>{item.pembimbing ?? <span style={{ color: '#aaa' }}>—</span>}</td>
                      <td style={styles.td}>{formatTanggal(item.tanggal_mulai)} – {formatTanggal(item.tanggal_selesai)}</td>
                      <td style={styles.td}><StatusBadge status={item.status} /></td>
                      <td style={styles.td}>
                        <button style={styles.btnReject}
                          onClick={() => setDeleteId(item.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Konfirmasi hapus */}
      {deleteId && (
        <Modal title="Konfirmasi hapus data" onClose={() => setDeleteId(null)}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
            Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div style={styles.modalBtns}>
            <button style={styles.btnSecondary} onClick={() => setDeleteId(null)}>Batal</button>
            <button style={styles.btnReject} onClick={() => handleDelete(deleteId)}>Ya, hapus</button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}