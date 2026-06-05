export default function InputField({
  label,
  error,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-600">
        {label}
      </label>

      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl border
          bg-white text-sm outline-none transition-all

          ${
            error
              ? 'border-red-300 focus:ring-red-100'
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
          }
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}