import { motion } from 'framer-motion'
import { CheckSquare } from 'lucide-react'

export default function EmptyDashboard() {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="w-48 h-48 bg-gray-50/50 rounded-full flex items-center justify-center mb-6"
      >
        <div className="relative">
          <div className="w-24 h-32 bg-white rounded-lg border-2 border-gray-200 shadow-sm p-4 flex flex-col gap-2">
            <div className="w-full h-2 bg-gray-100 rounded" />

            <div className="w-2/3 h-2 bg-gray-100 rounded" />

            <div className="mt-auto flex justify-center">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <CheckSquare
                  className="text-green-500"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-gray-200 rounded-t-lg" />
        </div>
      </motion.div>

      <p className="text-gray-400 font-medium tracking-tight">
        Tidak ada pendaftaran yang menunggu.
      </p>
    </div>
  )
}