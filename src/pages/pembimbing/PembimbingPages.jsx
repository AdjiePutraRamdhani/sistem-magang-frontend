import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

const MENU = [
  { path: '/pembimbing/dashboard', icon: '⊞', label: 'Beranda' },
  { path: '/pembimbing/peserta',   icon: '👥', label: 'Peserta bimbingan' },
]

// Helper format tanggal — sama seperti di MahasiswaPages
// "2026-04-28T00:00:00Z" → "28 Apr 2026"
function formatTanggal(str) {
  if (!str) return '—'
  const [y, m, d] = str.slice(0, 10).split('-')
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
  return `${parseInt(d)} ${bulan[parseInt(m) - 1]} ${y}`
}

// Komponen badge status — sama polanya dengan halaman lain
// agar tampilan konsisten di seluruh aplikasi
const STATUS = {
  disetujui:       { text: 'Disetujui',      bg: '#EAF3DE', color: '#27500A' },
  aktif:           { text: 'Aktif',          bg: '#E6F1FB', color: '#0C447C' },
  selesai_dinilai: { text: 'Selesai dinilai',bg: '#F3E8FF', color: '#6B21A8' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || { text: status, bg: '#eee', color: '#333' }
  return (
    <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px',
      background: s.bg, color: s.color, fontWeight: '500' }}>
      {s.text}
    </span>
  )
}

// ================================================================
// HALAMAN: Beranda Pembimbing
// ================================================================
export function PembimbingDashboard() {
  const [stats, setStats]     = useState(null)
  const [peserta, setPeserta] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/pembimbing/dashboard'),
      api.get('/pembimbing/peserta'),
    ]).then(([statsRes, pesertaRes]) => {
      setStats(statsRes.data)
      // Di beranda, tampilkan hanya peserta yang belum dinilai
      // sebagai pengingat prioritas bagi pembimbing
      setPeserta(pesertaRes.data.filter(p => !p.sudah_dinilai).slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout menuItems={MENU} title="Beranda">
      <p>Memuat...</p>
    </DashboardLayout>
  )

  return (
    <DashboardLayout menuItems={MENU} title="Beranda">

      {/* Kartu statistik */}
      <div style={styles.statGrid}>
        {[
          { label: 'Total peserta bimbingan', value: stats?.total_peserta ?? 0,   color: '#111' },
          { label: 'Belum dinilai',           value: stats?.belum_dinilai ?? 0,   color: '#BA7517' },
          { label: 'Selesai dinilai',         value: stats?.selesai_dinilai ?? 0, color: '#3B6D11' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Banner peringatan jika ada peserta yang belum dinilai */}
      {(stats?.belum_dinilai ?? 0) > 0 && (
        <div style={{ background: '#FAEEDA', color: '#633806', padding: '11px 16px',
          borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
          ⏰ Ada <strong>{stats.belum_dinilai} peserta</strong> yang belum dinilai.{' '}
          <a href="/pembimbing/peserta" style={{ color: '#633806', fontWeight: '600' }}>
            Beri penilaian sekarang →
          </a>
        </div>
      )}

      {/* Tabel peserta yang perlu segera dinilai */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Peserta yang perlu dinilai</span>
          <a href="/pembimbing/peserta" style={styles.panelLink}>Lihat semua →</a>
        </div>
        {peserta.length === 0 ? (
          <p style={styles.empty}>🎉 Semua peserta sudah dinilai!</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['Nama peserta', 'Asal instansi', 'Selesai magang', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peserta.map(item => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{item.nama_lengkap}</strong>
                    <br /><span style={styles.meta}>{item.program_studi}</span>
                  </td>
                  <td style={styles.td}>{item.asal_instansi}</td>
                  <td style={styles.td}>{formatTanggal(item.tanggal_selesai)}</td>
                  <td style={styles.td}><StatusBadge status={item.status} /></td>
                  <td style={styles.td}>
                    <a href="/pembimbing/peserta"
                      style={{ fontSize: '11px', padding: '4px 11px', borderRadius: '4px',
                        background: '#E6F1FB', color: '#0C447C', border: '1px solid #85B7EB',
                        textDecoration: 'none', fontWeight: '500' }}>
                      Beri nilai
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}

// ================================================================
// HALAMAN: Daftar Peserta Bimbingan + Form Penilaian
//
// Kedua fitur ini digabung dalam satu halaman karena alurnya
// sangat terhubung: pembimbing memilih peserta dari daftar,
// lalu form penilaian muncul di bawah untuk peserta tersebut.
// Ini menghindari navigasi yang berlebihan.
// ================================================================
export function PembimbingPeserta() {
  const [peserta, setPeserta]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null) // peserta yang dipilih untuk dinilai
  const [form, setForm]           = useState({
    kedisiplinan: 80, kemampuan_teknis: 80,
    sikap: 80, kehadiran: 80, catatan: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg]             = useState({ type: '', text: '' })

  const load = useCallback(() => {
    setLoading(true)
    api.get('/pembimbing/peserta')
      .then(res => setPeserta(res.data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  // Hitung nilai total secara real-time berdasarkan nilai di form
  const nilaiTotal = Math.round(
    (parseInt(form.kedisiplinan || 0) +
     parseInt(form.kemampuan_teknis || 0) +
     parseInt(form.sikap || 0) +
     parseInt(form.kehadiran || 0)) / 4
  )

  const handlePilih = (item) => {
    // Hanya peserta yang belum dinilai yang bisa dipilih
    if (item.sudah_dinilai) return
    setSelected(item)
    setMsg({ type: '', text: '' })
    // Reset form ke nilai default 80 setiap kali memilih peserta baru
    setForm({ kedisiplinan: 80, kemampuan_teknis: 80, sikap: 80, kehadiran: 80, catatan: '' })
    // Scroll ke form penilaian agar langsung terlihat
    setTimeout(() => {
      document.getElementById('form-penilaian')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSlider = (field, value) => {
    setForm(prev => ({ ...prev, [field]: parseInt(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await api.post(`/pembimbing/nilai/${selected.id}`, form)
      setMsg({ type: 'success', text: res.data.message })
      setSelected(null)
      load() // refresh daftar peserta
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyimpan penilaian.'
      })
    } finally { setSubmitting(false) }
  }

  // Cek apakah tanggal selesai magang sudah lewat
  // Ini untuk menonaktifkan tombol "Beri Nilai" jika magang belum selesai
  const periodeSelesai = (tanggalSelesai) => {
    return new Date(tanggalSelesai) <= new Date()
  }

  return (
    <DashboardLayout menuItems={MENU} title="Peserta Bimbingan">

      {/* Notifikasi global (sukses/error) */}
      {msg.text && (
        <div style={{
          background: msg.type === 'success' ? '#EAF3DE' : '#FEE2E2',
          color: msg.type === 'success' ? '#27500A' : '#991B1B',
          padding: '11px 16px', borderRadius: '8px',
          fontSize: '13px', marginBottom: '14px'
        }}>
          {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
      )}

      {/* Tabel daftar peserta */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Semua peserta bimbingan saya</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{peserta.length} peserta</span>
        </div>
        {loading ? <p style={styles.empty}>Memuat...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Nama peserta','Asal instansi','Periode magang','Status','Penilaian','Aksi'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peserta.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#aaa' }}>
                      Belum ada peserta yang ditugaskan ke kamu.
                    </td>
                  </tr>
                ) : peserta.map(item => (
                  <tr key={item.id}
                    style={{
                      ...styles.tr,
                      // Highlight baris yang sedang dipilih
                      background: selected?.id === item.id ? '#EBF3FB' : 'transparent'
                    }}>
                    <td style={styles.td}>
                      <strong>{item.nama_lengkap}</strong>
                      <br /><span style={styles.meta}>{item.program_studi}</span>
                    </td>
                    <td style={styles.td}>{item.asal_instansi}</td>
                    <td style={styles.td}>
                      {formatTanggal(item.tanggal_mulai)} –<br />
                      {formatTanggal(item.tanggal_selesai)}
                    </td>
                    <td style={styles.td}><StatusBadge status={item.status} /></td>
                    <td style={styles.td}>
                      {item.sudah_dinilai ? (
                        <span style={{ fontSize: '12px', color: '#3B6D11', fontWeight: '500' }}>
                          ✓ Nilai: {item.penilaian.nilai_total}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#aaa' }}>Belum dinilai</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {item.sudah_dinilai ? (
                        <span style={{ fontSize: '11px', color: '#aaa' }}>Selesai</span>
                      ) : !periodeSelesai(item.tanggal_selesai) ? (
                        // Tombol dinonaktifkan jika periode belum selesai
                        <span style={{ fontSize: '11px', color: '#ccc',
                          padding: '4px 11px', borderRadius: '4px',
                          background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                          Belum bisa
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePilih(item)}
                          style={{ fontSize: '11px', padding: '4px 11px', borderRadius: '4px',
                            background: selected?.id === item.id ? '#0C447C' : '#E6F1FB',
                            color: selected?.id === item.id ? '#fff' : '#0C447C',
                            border: '1px solid #85B7EB', cursor: 'pointer', fontWeight: '500' }}>
                          {selected?.id === item.id ? 'Dipilih ✓' : 'Beri nilai'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form penilaian — hanya muncul jika ada peserta yang dipilih */}
      {selected && (
        <div id="form-penilaian" style={{ ...styles.panel, borderTop: '3px solid #0C447C' }}>

          {/* Info peserta yang sedang dinilai */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%',
              background: '#E6F1FB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#0C447C', fontSize: '14px',
              fontWeight: '700', flexShrink: 0 }}>
              {selected.nama_lengkap.split(' ').slice(0,2).map(w => w[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>
                {selected.nama_lengkap}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                {selected.program_studi} · {selected.asal_instansi} ·
                Periode: {formatTanggal(selected.tanggal_mulai)} – {formatTanggal(selected.tanggal_selesai)}
              </div>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none',
                color: '#999', cursor: 'pointer', fontSize: '18px' }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#111',
              marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
              Penilaian per aspek (0 – 100)
            </div>

            {/* Slider untuk setiap aspek penilaian */}
            <div style={styles.aspekGrid}>
              {[
                { key: 'kedisiplinan',     label: 'Kedisiplinan' },
                { key: 'kemampuan_teknis', label: 'Kemampuan teknis' },
                { key: 'sikap',            label: 'Sikap' },
                { key: 'kehadiran',        label: 'Kehadiran' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: '8px', fontSize: '12px' }}>
                    <span style={{ fontWeight: '500', color: '#444' }}>{label}</span>
                    <span style={{ fontWeight: '700', color: '#0C447C', fontSize: '15px' }}>
                      {form[key]}
                    </span>
                  </div>
                  {/* input[type=range] adalah slider HTML bawaan browser.
                      Setiap kali digeser, handleSlider() dipanggil dan
                      nilai di form terupdate — React akan otomatis
                      memperbarui tampilan angka di sebelahnya. */}
                  <input type="range" min="0" max="100"
                    value={form[key]}
                    onChange={e => handleSlider(key, e.target.value)}
                    style={{ width: '100%', accentColor: '#0C447C' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
                    <span>0</span><span>50</span><span>100</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tampilan nilai total yang dihitung real-time */}
            <div style={{ background: '#E6F1FB', borderRadius: '8px', padding: '14px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#0C447C' }}>
                  Nilai total (rata-rata otomatis)
                </div>
                <div style={{ fontSize: '11px', color: '#378ADD', marginTop: '2px' }}>
                  Dihitung dari 4 aspek di atas
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0C447C' }}>
                {nilaiTotal}
              </div>
            </div>

            {/* Catatan tambahan */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#444', marginBottom: '6px' }}>
                Catatan tambahan <span style={{ color: '#aaa' }}>(opsional)</span>
              </label>
              <textarea
                value={form.catatan}
                onChange={e => setForm({ ...form, catatan: e.target.value })}
                placeholder="Tuliskan catatan, kelebihan, atau saran pengembangan untuk peserta..."
                style={{ width: '100%', padding: '9px 12px', fontSize: '13px',
                  border: '1px solid #D1D5DB', borderRadius: '6px',
                  boxSizing: 'border-box', minHeight: '80px',
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setSelected(null)}
                style={{ flex: 1, padding: '10px', background: '#F3F4F6',
                  color: '#444', border: '1px solid #D1D5DB',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={submitting}
                style={{ flex: 2, padding: '10px', background: '#0C447C',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Menyimpan...' : '✓ Simpan penilaian'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}

const styles = {
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' },
  statCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px' },
  statLabel: { fontSize: '11px', color: '#666', marginBottom: '6px' },
  statVal: { fontSize: '26px', fontWeight: '700' },
  panel: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '14px', overflow: 'hidden' },
  panelHead: { padding: '13px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: '#111' },
  panelLink: { fontSize: '12px', color: '#185FA5', textDecoration: 'none' },
  empty: { padding: '24px', textAlign: 'center', color: '#aaa', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  thead: { background: '#F9FAFB' },
  th: { padding: '9px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '500', color: '#666', borderBottom: '1px solid #E5E7EB' },
  tr: { borderBottom: '1px solid #F3F4F6' },
  td: { padding: '10px 16px', color: '#111', verticalAlign: 'middle' },
  meta: { fontSize: '11px', color: '#999' },
  aspekGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' },
}