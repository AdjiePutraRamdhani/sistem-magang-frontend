import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { formatTanggal } from '../../utils/formatTanggal'
import { styles } from '../../styles/adminStyles'

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
    <DashboardLayout menuItems={ADMIN_MENU} title="Persetujuan Magang">
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
                      {formatTanggal(item.tanggal_mulai)} –<br />{formatTanggal(item.tanggal_selesai)}
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