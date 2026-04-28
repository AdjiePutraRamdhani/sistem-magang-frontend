import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
 
// Label badge status yang tampil di tabel
const STATUS_LABEL = {
  menunggu_persetujuan: { text: 'Menunggu',  bg: '#FAEEDA', color: '#633806' },
  disetujui:            { text: 'Disetujui', bg: '#EAF3DE', color: '#27500A' },
  ditolak:              { text: 'Ditolak',   bg: '#FEE2E2', color: '#991B1B' },
  aktif:                { text: 'Aktif',     bg: '#E6F1FB', color: '#0C447C' },
  selesai_dinilai:      { text: 'Selesai',   bg: '#F3E8FF', color: '#6B21A8' },
}
 
function StatusBadge({ status }) {
  const s = STATUS_LABEL[status] || { text: status, bg: '#eee', color: '#333' }
  return (
    <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px',
      background: s.bg, color: s.color, fontWeight: '500', whiteSpace: 'nowrap' }}>
      {s.text}
    </span>
  )
}
 
// Menu navigasi sidebar khusus Admin
const MENU = [
  { path: '/admin/dashboard',    icon: '⊞', label: 'Dashboard' },
  { path: '/admin/persetujuan',  icon: '📋', label: 'Persetujuan magang' },
  { path: '/admin/data',         icon: '👤', label: 'Kelola data magang' },
  { path: '/admin/pembimbing',   icon: '➕', label: 'Tambah pembimbing' },
]
 
// ================================================================
// HALAMAN: Dashboard Utama
// ================================================================
export function AdminDashboard() {
  const [stats, setStats]           = useState(null)
  const [pendaftaran, setPendaftaran] = useState([])
  const [loading, setLoading]       = useState(true)
 
  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/pendaftaran?status=menunggu_persetujuan'),
    ]).then(([statsRes, pdRes]) => {
      setStats(statsRes.data)
      setPendaftaran(pdRes.data.slice(0, 5)) // tampilkan 5 terbaru saja
    }).finally(() => setLoading(false))
  }, [])
 
  if (loading) return <DashboardLayout menuItems={MENU} title="Dashboard"><p>Memuat...</p></DashboardLayout>
 
  return (
    <DashboardLayout menuItems={MENU} title="Dashboard">
      {/* Kartu statistik */}
      <div style={styles.statGrid}>
        {[
          { label: 'Total peserta magang', value: stats?.total_peserta ?? 0, color: '#111' },
          { label: 'Menunggu persetujuan', value: stats?.menunggu ?? 0,       color: '#BA7517' },
          { label: 'Sedang aktif magang',  value: stats?.aktif ?? 0,          color: '#185FA5' },
          { label: 'Selesai & dinilai',    value: stats?.selesai_dinilai ?? 0,color: '#3B6D11' },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
 
      {/* Tabel pendaftaran terbaru yang menunggu */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Pendaftaran menunggu persetujuan</span>
          <a href="/admin/persetujuan" style={styles.panelLink}>Lihat semua →</a>
        </div>
        {pendaftaran.length === 0
          ? <p style={styles.empty}>Tidak ada pendaftaran yang menunggu.</p>
          : <Table data={pendaftaran} showActions={false} />
        }
      </div>
    </DashboardLayout>
  )
}
 
// ================================================================
// HALAMAN: Persetujuan Magang
// ================================================================
export function AdminPersetujuan() {
  const [data, setData]               = useState([])
  const [pembimbing, setPembimbing]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)   // pendaftaran yang dipilih
  const [modal, setModal]             = useState(null)   // 'setujui' | 'tolak'
  const [pembimbingId, setPembimbingId] = useState('')
  const [alasan, setAlasan]           = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [msg, setMsg]                 = useState('')
 
  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/admin/pendaftaran'),
      api.get('/admin/pembimbing'),
    ]).then(([pdRes, pbRes]) => {
      setData(pdRes.data)
      setPembimbing(pbRes.data)
    }).finally(() => setLoading(false))
  }, [])
 
  useEffect(() => { load() }, [load])
 
  const openModal = (item, type) => {
    setSelected(item)
    setModal(type)
    setPembimbingId('')
    setAlasan('')
    setMsg('')
  }
 
  const closeModal = () => { setModal(null); setSelected(null) }
 
  const handleSetujui = async () => {
    if (!pembimbingId) { setMsg('Pilih pembimbing terlebih dahulu.'); return }
    setSubmitting(true)
    try {
      await api.post(`/admin/pendaftaran/${selected.id}/setujui`, { pembimbing_id: pembimbingId })
      closeModal()
      load()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Gagal menyetujui.')
    } finally { setSubmitting(false) }
  }
 
  const handleTolak = async () => {
    if (!alasan.trim()) { setMsg('Alasan penolakan wajib diisi.'); return }
    setSubmitting(true)
    try {
      await api.post(`/admin/pendaftaran/${selected.id}/tolak`, { alasan_tolak: alasan })
      closeModal()
      load()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Gagal menolak.')
    } finally { setSubmitting(false) }
  }
 
  return (
    <DashboardLayout menuItems={MENU} title="Persetujuan Magang">
      {loading ? <p>Memuat...</p> : (
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <span style={styles.panelTitle}>Daftar pendaftaran masuk</span>
            <span style={{ fontSize: '12px', color: '#999' }}>{data.length} entri</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Nama peserta','Asal instansi','Periode','Tgl. daftar','Status','Aksi'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{item.nama_lengkap}</strong>
                      <br /><span style={styles.meta}>{item.program_studi}</span>
                    </td>
                    <td style={styles.td}>{item.asal_instansi}</td>
                    <td style={styles.td}>
                      {item.tanggal_mulai} –<br />{item.tanggal_selesai}
                    </td>
                    <td style={styles.td}>{item.created_at?.slice(0,10)}</td>
                    <td style={styles.td}><StatusBadge status={item.status} /></td>
                    <td style={styles.td}>
                      <div style={styles.btnGroup}>
                        {item.status === 'menunggu_persetujuan' && (<>
                          <button style={styles.btnApprove} onClick={() => openModal(item, 'setujui')}>Setujui</button>
                          <button style={styles.btnReject}  onClick={() => openModal(item, 'tolak')}>Tolak</button>
                        </>)}
                        {item.status !== 'menunggu_persetujuan' && (
                          <span style={{ fontSize: '11px', color: '#aaa' }}>Sudah diproses</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
 
      {/* Modal Setujui */}
      {modal === 'setujui' && (
        <Modal title={`Setujui pendaftaran — ${selected?.nama_lengkap}`} onClose={closeModal}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '14px' }}>
            Pilih pembimbing yang akan ditugaskan untuk peserta ini:
          </p>
          <select style={styles.input} value={pembimbingId}
            onChange={e => setPembimbingId(e.target.value)}>
            <option value="">-- Pilih pembimbing --</option>
            {pembimbing.map(p => (
              <option key={p.id} value={p.id}>
                {p.nama_lengkap} {p.jabatan ? `(${p.jabatan})` : ''}
              </option>
            ))}
          </select>
          {msg && <p style={styles.errText}>{msg}</p>}
          <div style={styles.modalBtns}>
            <button style={styles.btnSecondary} onClick={closeModal}>Batal</button>
            <button style={styles.btnApprove} onClick={handleSetujui} disabled={submitting}>
              {submitting ? 'Memproses...' : 'Setujui'}
            </button>
          </div>
        </Modal>
      )}
 
      {/* Modal Tolak */}
      {modal === 'tolak' && (
        <Modal title={`Tolak pendaftaran — ${selected?.nama_lengkap}`} onClose={closeModal}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>
            Berikan alasan penolakan yang jelas agar peserta dapat memperbaiki pengajuannya:
          </p>
          <textarea
            style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
            placeholder="Tuliskan alasan penolakan..."
            value={alasan}
            onChange={e => setAlasan(e.target.value)}
          />
          {msg && <p style={styles.errText}>{msg}</p>}
          <div style={styles.modalBtns}>
            <button style={styles.btnSecondary} onClick={closeModal}>Batal</button>
            <button style={styles.btnReject} onClick={handleTolak} disabled={submitting}>
              {submitting ? 'Memproses...' : 'Tolak'}
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
 
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
    <DashboardLayout menuItems={MENU} title="Kelola Data Magang">
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
                      <td style={styles.td}>{item.tanggal_mulai} – {item.tanggal_selesai}</td>
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
 
// ================================================================
// KOMPONEN PEMBANTU
// ================================================================
 
// Komponen tabel sederhana yang dipakai di dashboard
function Table({ data }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            {['Nama','Asal instansi','Periode','Status'].map(h =>
              <th key={h} style={styles.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={styles.tr}>
              <td style={styles.td}><strong>{item.nama_lengkap}</strong></td>
              <td style={styles.td}>{item.asal_instansi}</td>
              <td style={styles.td}>{item.tanggal_mulai} – {item.tanggal_selesai}</td>
              <td style={styles.td}><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
// Komponen modal/popup
function Modal({ title, children, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>{title}</span>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}
 
// ================================================================
// STYLES
// ================================================================
const styles = {
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' },
  statCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px' },
  statLabel: { fontSize: '11px', color: '#666', marginBottom: '6px' },
  statVal: { fontSize: '26px', fontWeight: '700' },
  panel: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' },
  panelHead: { padding: '13px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: '#111' },
  panelLink: { fontSize: '12px', color: '#185FA5' },
  empty: { padding: '24px', textAlign: 'center', color: '#aaa', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  thead: { background: '#F9FAFB' },
  th: { padding: '9px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '500', color: '#666', borderBottom: '1px solid #E5E7EB' },
  tr: { borderBottom: '1px solid #F3F4F6', cursor: 'default' },
  td: { padding: '10px 16px', color: '#111', verticalAlign: 'middle' },
  meta: { fontSize: '11px', color: '#999' },
  btnGroup: { display: 'flex', gap: '6px' },
  btnApprove: { fontSize: '11px', padding: '4px 11px', borderRadius: '4px', cursor: 'pointer', background: '#EAF3DE', color: '#27500A', border: '1px solid #97C459', fontWeight: '500' },
  btnReject: { fontSize: '11px', padding: '4px 11px', borderRadius: '4px', cursor: 'pointer', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', fontWeight: '500' },
  btnSecondary: { fontSize: '12px', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', background: '#F3F4F6', color: '#444', border: '1px solid #D1D5DB' },
  input: { padding: '8px 11px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', width: '100%', boxSizing: 'border-box', marginBottom: '12px', outline: 'none' },
  errText: { fontSize: '12px', color: '#DC2626', margin: '4px 0 10px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  modalHead: { padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: '14px', fontWeight: '600', color: '#111' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#999' },
  modalBody: { padding: '20px' },
  modalBtns: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' },
}
 