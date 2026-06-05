import { Check } from 'lucide-react'

export default function Step({
  number,
  label,
  status = 'pending',
}) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'

  return (
    <div className="flex flex-col items-center text-center w-32 relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest transition-all duration-500 ${
          isCompleted
            ? 'bg-primary text-white shadow-md'
            : isCurrent
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-highest text-on-surface-variant'
        }`}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 stroke-[3px]" />
        ) : (
          <span className="font-bold">{number}</span>
        )}
      </div>

      <p
        className={`mt-4 text-[13px] font-medium leading-tight ${
          isCompleted || isCurrent
            ? 'text-primary'
            : 'text-on-surface-variant/60'
        }`}
      >
        {label}
      </p>
    </div>
  )
}