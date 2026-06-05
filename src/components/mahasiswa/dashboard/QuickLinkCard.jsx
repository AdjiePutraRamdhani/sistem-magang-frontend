import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function QuickLinkCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm hover:border-primary transition-all cursor-pointer group hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-colors text-primary">
          <Icon className="w-6 h-6" />
        </div>

        <motion.div
          whileHover={{ x: 3, y: -3 }}
          className="text-on-surface-variant opacity-40 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="w-5 h-5 -rotate-45" />
        </motion.div>
      </div>

      <h5 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h5>

      <p className="text-[13px] text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}