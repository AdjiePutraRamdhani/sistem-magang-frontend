import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({
  label,
  error,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full px-4 py-3 pr-12 rounded-xl border
            bg-white text-sm outline-none transition-all

            ${
              error
                ? 'border-red-300 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }
          `}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-gray-600
            transition-colors
          "
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}