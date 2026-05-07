export function formatTanggal(str) {
  if (!str) return '—'

  const [y, m, d] = str.slice(0, 10).split('-')

  const bulan = [
    'Jan','Feb','Mar','Apr','Mei','Jun',
    'Jul','Agt','Sep','Okt','Nov','Des'
  ]

  return `${parseInt(d)} ${bulan[parseInt(m) - 1]} ${y}`
}