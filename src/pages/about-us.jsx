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
    name: "Sarah Johnson",
    role: "CEO & Founder",
    description: "15+ years of experience in enterprise software development and AI technologies.",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    description: "Former Google engineer with expertise in cloud architecture and scalable systems.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    description: "Award-winning UX designer focused on creating intuitive and accessible interfaces.",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    description: "Full-stack developer specializing in modern web technologies and DevOps practices.",
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
            Founded in 2025, FreelanceGo is a platform that connects businesses with top freelance talent, empowering them to achieve
            unprecedented growth and efficiency through cutting-edge technology and expertise.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To empower businesses worldwide with innovative software solutions that drive growth, enhance
              productivity, and create meaningful impact in the digital age.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that technology should be accessible, intuitive, and transformative. Our team of experts works
              tirelessly to bridge the gap between complex technical capabilities and real-world business needs.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <div className="text-6xl md:text-8xl font-bold text-primary/30">AS</div>
            </div>
          </div>
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

      {/* Team Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            The talented individuals behind Amane Soft's success.
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

      {/* CTA Section */}
      <section className="container max-w-screen-2xl py-16 md:py-24">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Work Together?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Let's discuss how Amane Soft can help transform your business with our innovative solutions.
          </p>
          <Button size="lg" className="mt-6">
            Get in Touch
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
