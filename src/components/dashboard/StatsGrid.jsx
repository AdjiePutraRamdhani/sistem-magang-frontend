import { styles } from '../../styles/adminStyles'

export default function StatsGrid({ stats }) {
  const items = [
    {
      label: 'Total peserta magang',
      value: stats?.total_peserta ?? 0,
      color: '#111',
    },
    {
      label: 'Menunggu persetujuan',
      value: stats?.menunggu ?? 0,
      color: '#BA7517',
    },
    {
      label: 'Sedang aktif magang',
      value: stats?.aktif ?? 0,
      color: '#185FA5',
    },
    {
      label: 'Selesai & dinilai',
      value: stats?.selesai_dinilai ?? 0,
      color: '#3B6D11',
    },
  ]

  return (
    <div style={styles.statGrid}>
      {items.map((s) => (
        <div key={s.label} style={styles.statCard}>
          <div style={styles.statLabel}>
            {s.label}
          </div>

          <div
            style={{
              ...styles.statVal,
              color: s.color,
            }}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}