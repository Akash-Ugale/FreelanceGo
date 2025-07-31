import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect } from "react"

export default function FullscreenLoader({ show = true, className = "" }) {
  // Scroll lock
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [show])

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background to-muted bg-opacity-20 backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        className="relative w-32 h-32"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Outer glowing pulse ring */}
        {/* <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-40" /> */}

        {/* Rotating multi-ring spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-muted border-t-primary animate-spin" />
        <div className="absolute inset-4 rounded-full border-2 border-muted border-b-primary animate-spin-reverse" />
        <div className="absolute inset-8 rounded-full border border-muted border-l-primary animate-spin" />

        {/* Orbiting dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2" />
          </div>
          <div className="relative w-full h-full animate-spin-slower-reverse">
            <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-muted-foreground rounded-full translate-x-1/2" />
          </div>
        </div>

        {/* Branding */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-center text-lg font-semibold tracking-widest text-muted-foreground"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >

          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
