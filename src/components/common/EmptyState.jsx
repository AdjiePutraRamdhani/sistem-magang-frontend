import { ClipboardList } from 'lucide-react'

export default function EmptyState({
  title = 'Data kosong',
  description = 'Belum ada data tersedia.',
}) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <div
        className="
          w-20 h-20 rounded-2xl
          bg-gray-100
          flex items-center justify-center
          mb-5
        "
      >
        <ClipboardList
          size={36}
          className="text-gray-400"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>

      <p className="text-sm text-gray-400 mt-2 max-w-sm">
        {description}
      </p>
    </div>
  )
}