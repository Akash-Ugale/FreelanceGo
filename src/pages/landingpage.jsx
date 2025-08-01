import CTA from "@/components/cta"
import Features from "@/components/features"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import MouseMoveEffect from "@/components/mouse-move-effect"
import Navbar from "@/components/navbar"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])
  return (
    <div className="relative min-h-screen bg-background">
      <MouseMoveEffect />
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="px-3">
          <Hero />
          <Features />
          <CTA />
          <Footer />
        </div>
      </div>
    </div>
  )
}
