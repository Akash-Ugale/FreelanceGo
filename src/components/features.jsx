import { Brain, Cloud, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "Smart Job Matching",
    description:
      "Our AI-powered algorithm connects you with the most relevant opportunities based on your skills and preferences.",
    icon: Brain,
  },
  {
    name: "Secure Payments",
    description:
      "Protected transactions with milestone-based payments and dispute resolution to ensure everyone gets paid.",
    icon: Shield,
  },
  {
    name: "Real-time Collaboration",
    description: "Built-in messaging, file sharing, and project management tools to keep your work flowing smoothly.",
    icon: Zap,
  },
  {
    name: "Global Talent Pool",
    description: "Access to thousands of skilled freelancers worldwide or find clients from every corner of the globe.",
    icon: Cloud,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-16 md:py-24 lg:py-32 px-4">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
          Why Choose FreelanceGo?
        </h2>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg">
          Everything you need to succeed in the freelance economy, all in one platform.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-6 md:p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              <h3 className="font-bold text-lg sm:text-xl">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
