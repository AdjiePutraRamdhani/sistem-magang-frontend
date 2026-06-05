import { Eye, Check, X, } from 'lucide-react'
import { formatTanggal } from '@/utils/formatTanggal'
import StatusBadge from '@/components/common/StatusBadge'
import { Link } from 'react-router-dom'

export default function DashboardTable({
  data = [],
  onView,
  onApprove,
  onReject,
  showActions = true,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Nama Peserta
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Asal Instansi
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Periode
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Nama Pembimbing
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>

            {showActions && (
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Aksi
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              {/* Nama */}
              <td className="px-6 py-5">
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.nama_lengkap}
                  </p>

                  <p className="text-sm text-gray-400">
                    {item.email}
                  </p>
                </div>
              </td>

              {/* Instansi */}
              <td className="px-6 py-5 text-sm text-gray-600">
                {item.asal_instansi}
              </td>

              {/* Periode */}
              <td className="px-6 py-5 text-sm text-gray-600">
                {formatTanggal(item.tanggal_mulai)}
                {' '}-
                {' '}
                {formatTanggal(item.tanggal_selesai)}
              </td>

              {/* Nama Pembimbing */}
              <td className="px-6 py-5 text-sm text-gray-600">
                {item.pembimbing}
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <StatusBadge status={item.status} />
              </td>

              {/* Aksi */}
              {showActions && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(item.file_surat_url)}
                      className="
                        p-2 rounded-lg
                        bg-blue-50 text-blue-600
                        hover:bg-blue-100
                      "
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onApprove(item.id)}
                      className="
                        p-2 rounded-lg
                        bg-green-50 text-green-600
                        hover:bg-green-100
                      "
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() => onReject(item.id)}
                      className="
                        p-2 rounded-lg
                        bg-red-50 text-red-600
                        hover:bg-red-100
                      "
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}