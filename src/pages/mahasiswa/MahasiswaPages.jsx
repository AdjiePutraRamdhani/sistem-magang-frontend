import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

const MENU = [
  { path: '/mahasiswa/dashboard',  icon: '⊞', label: 'Beranda' },
  { path: '/mahasiswa/daftar',     icon: '📋', label: 'Daftar magang' },
  { path: '/mahasiswa/sertifikat', icon: '🎓', label: 'Sertifikat magang' },
]

const STEPS = [
  { key: 'registrasi',           label: 'Registrasi akun' },
  { key: 'menunggu_persetujuan', label: 'Menunggu persetujuan' },
  { key: 'disetujui',            label: 'Disetujui' },
  { key: 'aktif',                label: 'Magang aktif' },
  { key: 'selesai_dinilai',      label: 'Selesai dinilai' },
]

const stepIndex = (status) => ({
  null: 0, menunggu_persetujuan: 1, ditolak: 1,
  disetujui: 2, aktif: 3, selesai_dinilai: 4,
}[status] ?? 0)

const STATUS = {
  menunggu_persetujuan: { text: 'Menunggu persetujuan', bg: '#FAEEDA', color: '#633806' },
  disetujui:            { text: 'Disetujui',            bg: '#EAF3DE', color: '#27500A' },
  ditolak:              { text: 'Ditolak',              bg: '#FEE2E2', color: '#991B1B' },
  aktif:                { text: 'Aktif',                bg: '#E6F1FB', color: '#0C447C' },
  selesai_dinilai:      { text: 'Selesai dinilai',      bg: '#F3E8FF', color: '#6B21A8' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || { text: status, bg: '#eee', color: '#333' }
  return (
    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.color, fontWeight: '500' }}>
      {s.text}
    </span>
  )
}

// Helper format tanggal: "2026-04-28T00:00:00Z" atau "2026-04-28" → "28 Apr 2026"
function formatTanggal(str) {
  if (!str) return '—'
  const [y, m, d] = str.slice(0, 10).split('-')
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
  return `${parseInt(d)} ${bulan[parseInt(m) - 1]} ${y}`
}

// ================================================================
// HALAMAN: Beranda Mahasiswa
// ================================================================
export function MahasiswaDashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const location              = useLocation()

  // Refresh setiap kali pengguna kembali ke halaman ini
  useEffect(() => {
    setLoading(true)
    api.get('/mahasiswa/dashboard')
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [location.pathname])

  if (loading) return (
    <DashboardLayout menuItems={MENU} title="Beranda"><p>Memuat...</p></DashboardLayout>
  )

  const pd       = data?.pendaftaran
  const aktifIdx = stepIndex(pd?.status ?? null)

  return (
    <DashboardLayout menuItems={MENU} title="Beranda">
      <div style={styles.panel}>
        <div style={styles.panelTitle}>Status magang kamu</div>
        <div style={styles.stepper}>
          {STEPS.map((step, i) => {
            const done   = i < aktifIdx
            const active = i === aktifIdx
            return (
              <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '13px', left: '50%', right: '-50%',
                    height: '2px', background: done ? '#0C447C' : '#E5E7EB', zIndex: 0 }} />
                )}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', zIndex: 1,
                  background: done ? '#0C447C' : active ? '#fff' : '#F3F4F6',
                  color: done ? '#fff' : active ? '#0C447C' : '#999',
                  border: active ? '2px solid #0C447C' : done ? 'none' : '2px solid #E5E7EB',
                  boxShadow: active ? '0 0 0 4px #D6E9F8' : 'none',
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '6px',
                  lineHeight: 1.3, color: active ? '#0C447C' : done ? '#444' : '#aaa',
                  fontWeight: active ? '600' : 'normal' }}>
                  {step.label}
                </div>
              </div>
            )
          })}
        </div>

        {!pd && <div style={{ ...styles.banner, background: '#E6F1FB', color: '#0C447C' }}>
          📝 Kamu belum mendaftar magang.{' '}
          <a href="/mahasiswa/daftar" style={{ color: '#0C447C', fontWeight: '600' }}>Daftar sekarang →</a>
        </div>}
        {pd?.status === 'menunggu_persetujuan' && <div style={{ ...styles.banner, background: '#FAEEDA', color: '#633806' }}>
          ⏳ Pendaftaran sedang ditinjau Admin. Harap menunggu.
        </div>}
        {pd?.status === 'ditolak' && <div style={{ ...styles.banner, background: '#FEE2E2', color: '#991B1B' }}>
          ❌ Ditolak. Alasan: <strong>{pd.alasan_tolak}</strong>. Silakan ajukan kembali.
        </div>}
        {pd?.status === 'disetujui' && <div style={{ ...styles.banner, background: '#EAF3DE', color: '#27500A' }}>
          ✅ Disetujui! Pembimbing: <strong>{pd.pembimbing ?? '—'}</strong>.
        </div>}
        {pd?.status === 'aktif' && <div style={{ ...styles.banner, background: '#E6F1FB', color: '#0C447C' }}>
          🎯 Sedang aktif magang. Pembimbing: <strong>{pd.pembimbing}</strong>.
        </div>}
        {pd?.status === 'selesai_dinilai' && <div style={{ ...styles.banner, background: '#EAF3DE', color: '#27500A' }}>
          🎉 Magang selesai!{' '}
          <a href="/mahasiswa/sertifikat" style={{ color: '#27500A', fontWeight: '600' }}>Unduh sertifikat →</a>
        </div>}
      </div>

      {pd && (
        <div style={styles.grid2}>
          <div style={styles.card}>
            <div style={styles.cardHead}>Detail pendaftaran</div>
            <div style={styles.cardBody}>
              {[
                ['Nama lengkap',    data.mahasiswa.nama_lengkap],
                ['Asal instansi',   data.mahasiswa.asal_instansi],
                ['Program studi',   data.mahasiswa.program_studi],
                ['Tanggal mulai',   formatTanggal(pd.tanggal_mulai)],
                ['Tanggal selesai', formatTanggal(pd.tanggal_selesai)],
                ['Pembimbing',      pd.pembimbing ?? 'Belum ditentukan'],
              ].map(([label, val]) => (
                <div key={label} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{label}</span>
                  <span style={styles.infoVal}>{val}</span>
                </div>
              ))}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Status</span>
                <StatusBadge status={pd.status} />
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHead}>Nilai magang</div>
            <div style={styles.cardBody}>
              {pd.penilaian ? (
                <>
                  <div style={styles.nilaiGrid}>
                    {[['Kedisiplinan', pd.penilaian.kedisiplinan],
                      ['Kemampuan teknis', pd.penilaian.kemampuan_teknis],
                      ['Sikap', pd.penilaian.sikap],
                      ['Kehadiran', pd.penilaian.kehadiran]
                    ].map(([label, val]) => (
                      <div key={label} style={styles.nilaiBox}>
                        <div style={styles.nilaiLabel}>{label}</div>
                        <div style={styles.nilaiVal}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={styles.nilaiTotal}>
                    <div style={{ fontSize: '12px', color: '#185FA5' }}>Nilai total</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#0C447C' }}>{pd.penilaian.nilai_total}</div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#aaa' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
                  <div style={{ fontSize: '12px' }}>Penilaian belum tersedia.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

// ================================================================
// HALAMAN: Formulir Pendaftaran Magang
// ================================================================
export function MahasiswaDaftar() {
  const [mahasiswa, setMahasiswa]   = useState(null)
  const [form, setForm]             = useState({ tanggal_mulai: '', tanggal_selesai: '' })
  const [file, setFile]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors]         = useState({})
  const [success, setSuccess]       = useState('')
  const [blocked, setBlocked]       = useState(false)

  useEffect(() => {
    api.get('/mahasiswa/dashboard').then(res => {
      setMahasiswa(res.data.mahasiswa)
      const pd = res.data.pendaftaran
      if (pd && ['menunggu_persetujuan','disetujui','aktif'].includes(pd.status)) {
        setBlocked(true)
      }
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setSubmitting(true)
    const fd = new FormData()
    fd.append('tanggal_mulai',   form.tanggal_mulai)
    fd.append('tanggal_selesai', form.tanggal_selesai)
    if (file) fd.append('file_surat', file)
    try {
      const res = await api.post('/mahasiswa/daftar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(res.data.message)
      setForm({ tanggal_mulai: '', tanggal_selesai: '' })
      setFile(null)
      setBlocked(true)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || { general: [err.response.data.message] })
      }
    } finally { setSubmitting(false) }
  }

  if (loading) return <DashboardLayout menuItems={MENU} title="Daftar Magang"><p>Memuat...</p></DashboardLayout>

  return (
    <DashboardLayout menuItems={MENU} title="Daftar Magang">
      <div style={{ maxWidth: '560px' }}>
        <div style={styles.card}>
          <div style={styles.cardHead}>Formulir pendaftaran magang</div>
          <div style={styles.cardBody}>
            {blocked && !success && <div style={{ ...styles.banner, background: '#FAEEDA', color: '#633806', marginBottom: '16px' }}>
              ⚠️ Kamu sudah memiliki pendaftaran yang sedang berjalan.
            </div>}
            {success && <div style={{ ...styles.banner, background: '#EAF3DE', color: '#27500A', marginBottom: '16px' }}>
              ✅ {success} Kembali ke <a href="/mahasiswa/dashboard" style={{ color: '#27500A', fontWeight: '600' }}>beranda</a> untuk melihat status.
            </div>}
            {errors.general && <div style={{ ...styles.banner, background: '#FEE2E2', color: '#991B1B', marginBottom: '16px' }}>
              {errors.general[0]}
            </div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama lengkap</label>
                <input style={{ ...styles.input, background: '#F9FAFB', color: '#888' }} value={mahasiswa?.nama_lengkap || ''} readOnly />
                <p style={styles.hint}>Diambil otomatis dari akun kamu</p>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Asal instansi</label>
                  <input style={{ ...styles.input, background: '#F9FAFB', color: '#888' }} value={mahasiswa?.asal_instansi || ''} readOnly />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Program studi</label>
                  <input style={{ ...styles.input, background: '#F9FAFB', color: '#888' }} value={mahasiswa?.program_studi || ''} readOnly />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tanggal mulai <span style={{ color: '#E24B4A' }}>*</span></label>
                  <input style={styles.input} type="date" value={form.tanggal_mulai} disabled={blocked}
                    onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })} />
                  {errors.tanggal_mulai && <p style={styles.errText}>{errors.tanggal_mulai[0]}</p>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tanggal selesai <span style={{ color: '#E24B4A' }}>*</span></label>
                  <input style={styles.input} type="date" value={form.tanggal_selesai} disabled={blocked}
                    onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} />
                  {errors.tanggal_selesai && <p style={styles.errText}>{errors.tanggal_selesai[0]}</p>}
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Surat pengantar <span style={{ color: '#E24B4A' }}>*</span></label>
                <label style={{ ...styles.uploadBox, opacity: blocked ? 0.5 : 1, cursor: blocked ? 'not-allowed' : 'pointer' }}>
                  <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} disabled={blocked}
                    onChange={e => setFile(e.target.files[0])} />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>{file ? file.name : 'Klik untuk unggah atau seret file ke sini'}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>Format PDF atau DOCX, maks. 5 MB</div>
                </label>
                {errors.file_surat && <p style={styles.errText}>{errors.file_surat[0]}</p>}
              </div>
              <button type="submit" disabled={submitting || blocked}
                style={{ ...styles.btnPrimary, opacity: (submitting || blocked) ? 0.6 : 1 }}>
                {submitting ? 'Mengirim...' : 'Kirim pendaftaran'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ================================================================
// HALAMAN: Sertifikat Magang
// ================================================================
export function MahasiswaSertifikat() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/mahasiswa/sertifikat').then(res => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout menuItems={MENU} title="Sertifikat Magang"><p>Memuat...</p></DashboardLayout>

  return (
    <DashboardLayout menuItems={MENU} title="Sertifikat Magang">
      {!data?.tersedia ? (
        <div style={{ maxWidth: '480px' }}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px' }}>Sertifikat belum tersedia</div>
                <div style={{ fontSize: '13px' }}>{data?.message}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '600px' }}>
          <div style={styles.sertifCard}>
            <div style={styles.sertifHeader}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>No. {data.sertifikat.no_sertifikat}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{data.sertifikat.nama_lengkap}</div>
            </div>
            <div style={styles.sertifBody}>
              {[
                ['Asal instansi',  data.sertifikat.asal_instansi],
                ['Program studi',  data.sertifikat.program_studi],
                ['Periode magang', `${formatTanggal(data.sertifikat.tanggal_mulai)} – ${formatTanggal(data.sertifikat.tanggal_selesai)}`],
                ['Pembimbing',     data.sertifikat.pembimbing],
                ['Diterbitkan',    formatTanggal(data.sertifikat.diterbitkan_at)],
              ].map(([label, val]) => (
                <div key={label} style={styles.sertifRow}>
                  <span style={styles.sertifKey}>{label}</span>
                  <span style={styles.sertifVal}>{val || '—'}</span>
                </div>
              ))}
              <div style={styles.sertifRow}>
                <span style={styles.sertifKey}>Nilai akhir</span>
                <span style={{ ...styles.sertifVal, fontSize: '18px', fontWeight: '700', color: '#0C447C' }}>{data.sertifikat.nilai_total} / 100</span>
              </div>
            </div>
          </div>
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHead}>Nilai per aspek</div>
              <div style={styles.cardBody}>
                <div style={styles.nilaiGrid}>
                  {[['Kedisiplinan', data.sertifikat.kedisiplinan],
                    ['Kemampuan teknis', data.sertifikat.kemampuan_teknis],
                    ['Sikap', data.sertifikat.sikap],
                    ['Kehadiran', data.sertifikat.kehadiran]
                  ].map(([label, val]) => (
                    <div key={label} style={styles.nilaiBox}>
                      <div style={styles.nilaiLabel}>{label}</div>
                      <div style={styles.nilaiVal}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={styles.nilaiTotal}>
                  <div style={{ fontSize: '11px', color: '#185FA5' }}>Nilai total</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#0C447C' }}>{data.sertifikat.nilai_total}</div>
                </div>
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardHead}>Unduh sertifikat</div>
              <div style={styles.cardBody}>
                <div style={{ ...styles.banner, background: '#EAF3DE', color: '#27500A', marginBottom: '14px' }}>✅ Sertifikat siap diunduh.</div>
                <button style={styles.btnPrimary} onClick={() => window.print()}>📥 Unduh / Cetak Sertifikat</button>
                <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '10px' }}>Gunakan "Save as PDF" pada dialog cetak browser</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

const styles = {
  panel: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '18px 20px', marginBottom: '14px' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '20px' },
  stepper: { display: 'flex', alignItems: 'flex-start', marginBottom: '16px' },
  banner: { padding: '10px 14px', borderRadius: '6px', fontSize: '13px', lineHeight: 1.5 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  card: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' },
  cardHead: { padding: '12px 16px', borderBottom: '1px solid #E5E7EB', fontSize: '13px', fontWeight: '600', color: '#111' },
  cardBody: { padding: '14px 16px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F3F4F6', fontSize: '12px' },
  infoLabel: { color: '#888' },
  infoVal: { fontWeight: '500', color: '#111', textAlign: 'right' },
  nilaiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  nilaiBox: { background: '#F9FAFB', borderRadius: '6px', padding: '10px', textAlign: 'center' },
  nilaiLabel: { fontSize: '10px', color: '#888', marginBottom: '4px' },
  nilaiVal: { fontSize: '20px', fontWeight: '700', color: '#0C447C' },
  nilaiTotal: { background: '#E6F1FB', borderRadius: '6px', padding: '12px', textAlign: 'center', marginTop: '8px' },
  formGroup: { marginBottom: '14px', flex: 1 },
  formRow: { display: 'flex', gap: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#444', marginBottom: '5px' },
  input: { width: '100%', padding: '8px 11px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' },
  hint: { fontSize: '11px', color: '#aaa', margin: '4px 0 0' },
  errText: { fontSize: '12px', color: '#DC2626', margin: '4px 0 0' },
  uploadBox: { display: 'block', border: '1.5px dashed #D1D5DB', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  btnPrimary: { width: '100%', padding: '10px', background: '#0C447C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  sertifCard: { border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' },
  sertifHeader: { background: '#0C447C', padding: '16px 20px' },
  sertifBody: { padding: '14px 20px' },
  sertifRow: { display: 'flex', gap: '8px', padding: '6px 0', borderBottom: '1px solid #F3F4F6', fontSize: '13px' },
  sertifKey: { color: '#888', width: '140px', flexShrink: 0 },
  sertifVal: { color: '#111', fontWeight: '500' },
}