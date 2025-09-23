import { motion } from "framer-motion"
import { useEffect } from "react"

export default function FullScreenLoader({ show = true, size = 128 }) {
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [show])

  if (!show) return null

  const containerStyle = {
    width: size,
    height: size,
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm p-6"
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex items-center justify-center"
          style={containerStyle}
        >
          {/* Rotating gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full p-1"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-white to-blue-400 shadow-xl"></div>
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          className="text-foreground text-sm font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading
        </motion.div>
      </div>
    </div>
  )
}