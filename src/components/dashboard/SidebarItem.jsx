export default function SidebarItem({
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 rounded-l-none'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      <Icon
        size={20}
        className={active ? 'text-blue-600' : 'text-gray-400'}
      />

      <span className="text-sm">
        {label}
      </span>
    </div>
  )
}