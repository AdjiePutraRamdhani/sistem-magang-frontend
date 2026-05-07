import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

const MENU = [
  { path: '/pembimbing/dashboard', icon: '⊞', label: 'Beranda' },
  { path: '/pembimbing/peserta',   icon: '👥', label: 'Peserta bimbingan' },
]

function formatTanggal(str) {
  if (!str) return '—'
  const [y, m, d] = str.slice(0, 10).split('-')
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
  return `${parseInt(d)} ${bulan[parseInt(m) - 1]} ${y}`
}

const STATUS = {
  disetujui:       { text: 'Disetujui',       bg: '#EAF3DE', color: '#27500A' },
  aktif:           { text: 'Aktif',           bg: '#E6F1FB', color: '#0C447C' },
  selesai_dinilai: { text: 'Selesai dinilai', bg: '#F3E8FF', color: '#6B21A8' },
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
      // Tampilkan peserta yang belum dinilai atau sudah dinilai tapi belum ada sertifikat
      setPeserta(
        pesertaRes.data
          .filter(p => !p.sudah_dinilai || (p.sudah_dinilai && !p.sudah_sertifikat))
          .slice(0, 5)
      )
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
          { label: 'Total peserta bimbingan', value: stats?.total_peserta   ?? 0, color: '#111' },
          { label: 'Belum dinilai',           value: stats?.belum_dinilai   ?? 0, color: '#BA7517' },
          { label: 'Selesai dinilai',         value: stats?.selesai_dinilai ?? 0, color: '#3B6D11' },
          { label: 'Menunggu sertifikat',     value: stats?.belum_sertifikat ?? 0, color: '#6B21A8' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Banner pengingat */}
      {(stats?.belum_dinilai ?? 0) > 0 && (
        <div style={{ background: '#FAEEDA', color: '#633806', padding: '11px 16px',
          borderRadius: '8px', fontSize: '13px', marginBottom: '10px' }}>
          ⏰ Ada <strong>{stats.belum_dinilai} peserta</strong> yang belum dinilai.{' '}
          <a href="/pembimbing/peserta" style={{ color: '#633806', fontWeight: '600' }}>
            Beri penilaian →
          </a>
        </div>
      )}
      {(stats?.belum_sertifikat ?? 0) > 0 && (
        <div style={{ background: '#F3E8FF', color: '#6B21A8', padding: '11px 16px',
          borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
          📄 Ada <strong>{stats.belum_sertifikat} peserta</strong> yang sudah dinilai tapi belum ada sertifikat.{' '}
          <a href="/pembimbing/peserta" style={{ color: '#6B21A8', fontWeight: '600' }}>
            Upload sertifikat →
          </a>
        </div>
      )}

      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Perlu tindakan segera</span>
          <a href="/pembimbing/peserta" style={styles.panelLink}>Lihat semua →</a>
        </div>
        {peserta.length === 0 ? (
          <p style={styles.empty}>🎉 Semua peserta sudah dinilai dan bersertifikat!</p>
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
                      {!item.sudah_dinilai ? 'Beri nilai' : 'Upload sertifikat'}
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
// HALAMAN: Daftar Peserta + Form Penilaian + Upload Sertifikat
// ================================================================
export function PembimbingPeserta() {
  const [peserta, setPeserta]     = useState([])
  const [loading, setLoading]     = useState(true)

  // State untuk form penilaian
  const [selectedNilai, setSelectedNilai] = useState(null)
  const [formNilai, setFormNilai]   = useState({
    kedisiplinan: 80, kemampuan_teknis: 80,
    sikap: 80, kehadiran: 80, catatan: ''
  })
  const [submittingNilai, setSubmittingNilai] = useState(false)

  // State untuk form upload sertifikat
  const [selectedSertifikat, setSelectedSertifikat] = useState(null)
  const [formSertifikat, setFormSertifikat] = useState({ no_sertifikat: '', file_pdf: null })
  const [submittingSertifikat, setSubmittingSertifikat] = useState(false)

  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = useCallback(() => {
    setLoading(true)
    api.get('/pembimbing/peserta')
      .then(res => setPeserta(res.data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const nilaiTotal = Math.round(
    (parseInt(formNilai.kedisiplinan || 0) +
     parseInt(formNilai.kemampuan_teknis || 0) +
     parseInt(formNilai.sikap || 0) +
     parseInt(formNilai.kehadiran || 0)) / 4
  )

  const handlePilihNilai = (item) => {
    if (item.sudah_dinilai) return
    setSelectedNilai(item)
    setSelectedSertifikat(null)
    setMsg({ type: '', text: '' })
    setFormNilai({ kedisiplinan: 80, kemampuan_teknis: 80, sikap: 80, kehadiran: 80, catatan: '' })
    setTimeout(() => {
      document.getElementById('form-aksi')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handlePilihSertifikat = (item) => {
    setSelectedSertifikat(item)
    setSelectedNilai(null)
    setMsg({ type: '', text: '' })
    setFormSertifikat({ no_sertifikat: '', file_pdf: null })
    setTimeout(() => {
      document.getElementById('form-aksi')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSubmitNilai = async (e) => {
    e.preventDefault()
    setSubmittingNilai(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await api.post(`/pembimbing/nilai/${selectedNilai.id}`, formNilai)
      setMsg({ type: 'success', text: res.data.message })
      setSelectedNilai(null)
      load()
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyimpan penilaian.'
      })
    } finally { setSubmittingNilai(false) }
  }

  const handleSubmitSertifikat = async (e) => {
    e.preventDefault()
    if (!formSertifikat.file_pdf) {
      setMsg({ type: 'error', text: 'Pilih file PDF sertifikat terlebih dahulu.' })
      return
    }
    setSubmittingSertifikat(true)
    setMsg({ type: '', text: '' })
    try {
      const fd = new FormData()
      fd.append('no_sertifikat', formSertifikat.no_sertifikat)
      fd.append('file_pdf', formSertifikat.file_pdf)
      const res = await api.post(
        `/pembimbing/sertifikat/${selectedSertifikat.id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setMsg({ type: 'success', text: res.data.message })
      setSelectedSertifikat(null)
      load()
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Gagal mengupload sertifikat.'
      })
    } finally { setSubmittingSertifikat(false) }
  }

  const periodeSelesai = (tanggalSelesai) => new Date(tanggalSelesai) <= new Date()

  return (
    <DashboardLayout menuItems={MENU} title="Peserta Bimbingan">

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
                  {['Nama peserta','Asal instansi','Periode magang','Status','Nilai','Sertifikat','Aksi'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peserta.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#aaa' }}>
                      Belum ada peserta yang ditugaskan ke kamu.
                    </td>
                  </tr>
                ) : peserta.map(item => (
                  <tr key={item.id}
                    style={{
                      ...styles.tr,
                      background: (selectedNilai?.id === item.id || selectedSertifikat?.id === item.id)
                        ? '#EBF3FB' : 'transparent'
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
                          ✓ {item.penilaian.nilai_total}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#aaa' }}>Belum</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {item.sudah_sertifikat ? (
                        <span style={{ fontSize: '12px', color: '#6B21A8', fontWeight: '500' }}>
                          ✓ Terupload
                        </span>
                      ) : item.sudah_dinilai ? (
                        <span style={{ fontSize: '12px', color: '#BA7517' }}>Belum diupload</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#ccc' }}>—</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Tombol Beri Nilai */}
                        {!item.sudah_dinilai && (
                          !periodeSelesai(item.tanggal_selesai) ? (
                            <span style={{ fontSize: '10px', color: '#ccc',
                              padding: '3px 8px', borderRadius: '4px',
                              background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                              Belum bisa
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePilihNilai(item)}
                              style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px',
                                background: selectedNilai?.id === item.id ? '#0C447C' : '#E6F1FB',
                                color: selectedNilai?.id === item.id ? '#fff' : '#0C447C',
                                border: '1px solid #85B7EB', cursor: 'pointer', fontWeight: '500' }}>
                              {selectedNilai?.id === item.id ? 'Dipilih ✓' : 'Beri nilai'}
                            </button>
                          )
                        )}
                        {/* Tombol Upload Sertifikat */}
                        {item.sudah_dinilai && (
                          <button
                            onClick={() => handlePilihSertifikat(item)}
                            style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px',
                              background: selectedSertifikat?.id === item.id
                                ? '#6B21A8' : item.sudah_sertifikat ? '#F3E8FF' : '#EAF3DE',
                              color: selectedSertifikat?.id === item.id
                                ? '#fff' : item.sudah_sertifikat ? '#6B21A8' : '#27500A',
                              border: `1px solid ${item.sudah_sertifikat ? '#C4B5FD' : '#97C459'}`,
                              cursor: 'pointer', fontWeight: '500' }}>
                            {selectedSertifikat?.id === item.id
                              ? 'Dipilih ✓'
                              : item.sudah_sertifikat ? '📄 Ganti sertifikat' : '📤 Upload sertifikat'}
                          </button>
                        )}
                        {item.sudah_dinilai && item.sudah_sertifikat && item.sertifikat?.file_pdf && (
                          <a href={item.sertifikat.file_pdf} target="_blank" rel="noreferrer"
                            style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px',
                              background: '#F9FAFB', color: '#555',
                              border: '1px solid #E5E7EB', textDecoration: 'none',
                              fontWeight: '500', textAlign: 'center' }}>
                            👁 Lihat
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== FORM PENILAIAN ===== */}
      {selectedNilai && (
        <div id="form-aksi" style={{ ...styles.panel, borderTop: '3px solid #0C447C' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%',
              background: '#E6F1FB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#0C447C', fontSize: '14px',
              fontWeight: '700', flexShrink: 0 }}>
              {selectedNilai.nama_lengkap.split(' ').slice(0,2).map(w => w[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>
                {selectedNilai.nama_lengkap}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                {selectedNilai.program_studi} · {selectedNilai.asal_instansi}
              </div>
            </div>
            <button onClick={() => setSelectedNilai(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none',
                color: '#999', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          <form onSubmit={handleSubmitNilai}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#111',
              marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
              Penilaian per aspek (0 – 100)
            </div>
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
                      {formNilai[key]}
                    </span>
                  </div>
                  <input type="range" min="0" max="100"
                    value={formNilai[key]}
                    onChange={e => setFormNilai({ ...formNilai, [key]: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#0C447C' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
                    <span>0</span><span>50</span><span>100</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#E6F1FB', borderRadius: '8px', padding: '14px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#0C447C' }}>Nilai total (rata-rata otomatis)</div>
                <div style={{ fontSize: '11px', color: '#378ADD', marginTop: '2px' }}>Dihitung dari 4 aspek</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0C447C' }}>{nilaiTotal}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#444', marginBottom: '6px' }}>
                Catatan tambahan <span style={{ color: '#aaa' }}>(opsional)</span>
              </label>
              <textarea
                value={formNilai.catatan}
                onChange={e => setFormNilai({ ...formNilai, catatan: e.target.value })}
                placeholder="Catatan, kelebihan, atau saran pengembangan..."
                style={{ width: '100%', padding: '9px 12px', fontSize: '13px',
                  border: '1px solid #D1D5DB', borderRadius: '6px',
                  boxSizing: 'border-box', minHeight: '80px',
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setSelectedNilai(null)}
                style={{ flex: 1, padding: '10px', background: '#F3F4F6',
                  color: '#444', border: '1px solid #D1D5DB',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={submittingNilai}
                style={{ flex: 2, padding: '10px', background: '#0C447C',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  opacity: submittingNilai ? 0.7 : 1 }}>
                {submittingNilai ? 'Menyimpan...' : '✓ Simpan penilaian'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== FORM UPLOAD SERTIFIKAT ===== */}
      {selectedSertifikat && (
        <div id="form-aksi" style={{ ...styles.panel, borderTop: '3px solid #6B21A8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%',
              background: '#F3E8FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#6B21A8', fontSize: '14px',
              fontWeight: '700', flexShrink: 0 }}>
              {selectedSertifikat.nama_lengkap.split(' ').slice(0,2).map(w => w[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>
                Upload Sertifikat — {selectedSertifikat.nama_lengkap}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                {selectedSertifikat.program_studi} · {selectedSertifikat.asal_instansi}
              </div>
            </div>
            <button onClick={() => setSelectedSertifikat(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none',
                color: '#999', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          {/* Info: sertifikat sudah ada sebelumnya */}
          {selectedSertifikat.sudah_sertifikat && (
            <div style={{ background: '#FAEEDA', color: '#633806', padding: '10px 14px',
              borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>
              ⚠️ Peserta ini sudah memiliki sertifikat (No. {selectedSertifikat.sertifikat?.no_sertifikat}).
              Upload baru akan mengganti sertifikat lama.
            </div>
          )}

          <div style={{ background: '#F3E8FF', borderRadius: '8px', padding: '12px 14px',
            fontSize: '12px', color: '#6B21A8', marginBottom: '16px' }}>
            📋 <strong>Catatan:</strong> Sertifikat dibuat oleh instansi (offline), kemudian file PDF-nya
            diupload ke sini agar bisa diakses dan diunduh oleh peserta magang.
          </div>

          <form onSubmit={handleSubmitSertifikat}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#444', marginBottom: '6px' }}>
                Nomor sertifikat <span style={{ color: '#E24B4A' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: DISPUSIP/MAG/2026/001"
                value={formSertifikat.no_sertifikat}
                onChange={e => setFormSertifikat({ ...formSertifikat, no_sertifikat: e.target.value })}
                required
                style={{ width: '100%', padding: '9px 12px', fontSize: '13px',
                  border: '1px solid #D1D5DB', borderRadius: '6px',
                  boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#444', marginBottom: '6px' }}>
                File sertifikat (PDF) <span style={{ color: '#E24B4A' }}>*</span>
              </label>
              <label style={{ display: 'block', border: '1.5px dashed #C4B5FD',
                borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                background: '#FAFAFF' }}>
                <input type="file" accept=".pdf" style={{ display: 'none' }}
                  onChange={e => setFormSertifikat({ ...formSertifikat, file_pdf: e.target.files[0] })} />
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  {formSertifikat.file_pdf
                    ? formSertifikat.file_pdf.name
                    : 'Klik untuk pilih file PDF sertifikat'}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>
                  Format PDF, maks. 5 MB
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setSelectedSertifikat(null)}
                style={{ flex: 1, padding: '10px', background: '#F3F4F6',
                  color: '#444', border: '1px solid #D1D5DB',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={submittingSertifikat}
                style={{ flex: 2, padding: '10px', background: '#6B21A8',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  opacity: submittingSertifikat ? 0.7 : 1 }}>
                {submittingSertifikat ? 'Mengupload...' : '📤 Upload sertifikat'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}

const styles = {
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' },
  statCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px' },
  statLabel: { fontSize: '11px', color: '#666', marginBottom: '6px' },
  statVal: { fontSize: '24px', fontWeight: '700' },
  panel: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '14px', padding: '18px 20px', overflow: 'hidden' },
  panelHead: { padding: '0 0 13px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: '#111' },
  panelLink: { fontSize: '12px', color: '#185FA5', textDecoration: 'none' },
  empty: { padding: '24px', textAlign: 'center', color: '#aaa', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '0' },
  thead: { background: '#F9FAFB' },
  th: { padding: '9px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '500', color: '#666', borderBottom: '1px solid #E5E7EB' },
  tr: { borderBottom: '1px solid #F3F4F6' },
  td: { padding: '10px 16px', color: '#111', verticalAlign: 'middle' },
  meta: { fontSize: '11px', color: '#999' },
  aspekGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' },
}