const statusStyles = {
  menunggu_persetujuan:
    'bg-amber-100 text-amber-700',

  diterima:
    'bg-green-100 text-green-700',

  ditolak:
    'bg-red-100 text-red-700',

  aktif:
    'bg-blue-100 text-blue-700',

  selesai:
    'bg-violet-100 text-violet-700',
}

export default function StatusBadge({
  status,
}) {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${statusStyles[status]}
      `}
    >
      {status.replaceAll('_', ' ')}
    </span>
  )
}