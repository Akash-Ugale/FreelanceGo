import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import MouseMoveEffect from "@/components/mouse-move-effect"
const values = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Innovation",
    description: "We constantly push the boundaries of technology to deliver cutting-edge solutions.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaboration",
    description: "We believe in the power of teamwork and building strong partnerships with our clients.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Excellence",
    description: "We strive for perfection in every project, delivering quality that exceeds expectations.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Integrity",
    description: "We conduct business with honesty, transparency, and ethical practices.",
  },
]

const team = [
  {
    name: "Omkar Wagh",
    role: "Backend Developer",
    description: "Java Backend Developer specializing in Spring Boot, Microservices, REST APIs, and MySQL.",
  },
  {
    name: "Abhishek Thakare",
    role: "Backend Developer",
    description: "Passionate backend developer focused on building scalable and efficient web applications.",
  },
  {
    name: "Koustubh Karande",
    role: "Software Developer",
    description: "Software Developer with 6 months of training experience at Kody Technolab Ltd., specializing in Java, Spring Boot, REST APIs, and backend development.",
},
  
  {
    name: "Akash Ugale",
    role: "Frontend Developer",
    description: "Frontend Developer focused on building responsive and user-friendly web applications.",
  },
]

export default function AboutUs() {
  return (
    <div className="min-h-screen relative bg-background px-4">
      <Navbar />
      <MouseMoveEffect/>
            {/* Background gradients */}
            <div className="pointer-events-none fixed z-[-1] inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
              <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
              <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
            </div>

      {/* Hero Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">FreelanceGo</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Founded in 2026, FreelanceGo is a freelance marketplace that bridges
            the gap between talented professionals and businesses worldwide —
            making collaboration simpler, smarter, and more rewarding for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to redefine the way the world works — by connecting
              skilled freelancers with the clients who need them most, faster and
              more transparently than ever before.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built FreelanceGo because finding the right talent — or the right
              opportunity — shouldn't be complicated. Whether you're a business
              looking to scale quickly or a freelancer ready to do your best work,
              our platform makes every match feel effortless and every transaction
              feel secure.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe the future of work is flexible, global, and human. Our team
              is committed to building tools that put people first — from smart
              matching and secure payments to transparent reviews and real support.
            </p>
          </div>
          <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex flex-col items-center justify-center gap-6 p-8">
                
                {/* Logo */}
                <div className="relative">
                  <img
                    src="/freelance-go-transparent.svg"
                    alt="FreelanceGo"
                    className="h-20 w-20 object-contain drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                </div>

                {/* Brand name */}
                <div className="text-center space-y-2">
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    FreelanceGo
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium tracking-widest uppercase">
                    Find Your Perfect Match
                  </p>
                </div>

                {/* Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-full" />

                {/* Tagline */}
                <p className="text-center text-muted-foreground text-sm md:text-base max-w-[220px] leading-relaxed">
                  Connecting talent with opportunity, one project at a time.
                </p>

                {/* Decorative blobs */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-primary/20 rounded-full blur-lg animate-pulse" />
                <div className="absolute bottom-4 left-4 w-14 h-14 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </div>
        </div>
      </section>

     

      {/* Team Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            The passionate individuals behind FreelanceGo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center p-6 ">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

       {/* Values Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            The principles that guide everything we do and shape our company culture.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Work Together?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Whether you're here to hire or to be hired, FreelanceGo is built for you.
              Join our growing community and start your journey today.
            </p>
            <Button
              size="lg"
              className="mt-6"
              onClick={() => { window.location.href = "https://freelancegobackend.onrender.com/oauth2/authorization/google"; }}
            >
              Get Started Free
            </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
