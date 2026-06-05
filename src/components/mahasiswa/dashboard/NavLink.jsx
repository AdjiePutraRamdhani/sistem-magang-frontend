export default function NavLink({
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 group ${
        active
          ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
          : 'text-on-primary/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
      <span className="text-sm">{label}</span>
    </a>
  )
}