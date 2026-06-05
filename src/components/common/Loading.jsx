import {
  Loader2,
} from 'lucide-react'

export default function Loading() {
  return (
    <div className="
          flex items-center justify-center
          h-[70vh]
        ">
          <div className="text-center">

            <Loader2
              size={50}
              className="
                animate-spin
                text-blue-600
                mx-auto
              "
            />

            <p className="mt-5 text-gray-500">
              Memuat peserta magang...
            </p>

          </div>
        </div>
  )
}