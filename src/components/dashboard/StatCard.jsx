export default function StatCard({
  icon: Icon,
  label,
  count,
  colorClass,
  iconBgClass,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {label}
          </p>

          <h3 className="text-3xl font-bold text-gray-800">
            {count}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}
        >
          <Icon
            className="text-white"
            size={22}
          />
        </div>
      </div>
    </div>
  )
}