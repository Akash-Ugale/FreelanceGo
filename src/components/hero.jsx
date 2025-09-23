import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-16 md:py-24 lg:py-32 text-center px-4">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-transparent">
          Find Your Perfect
          <br />
          Freelance Match
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground text-base sm:text-lg md:text-xl sm:leading-8">
          Connect talented freelancers with amazing projects. Whether you're looking to hire skilled professionals or
          find your next gig, FreelanceGo makes it simple and secure.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button size="lg" className="w-full sm:w-auto text-white">
          Start Hiring
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
          Find Work
        </Button>
      </div>
    </section>
  )
}
