import { useEffect, useRef, useState } from "react";
import { UserPlus, Briefcase, MessageSquare, Wallet, ArrowRight } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import MouseMoveEffect from "@/components/mouse-move-effect";

const steps = [
  {
    icon: <UserPlus className="h-7 w-7" />,
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds using Google OAuth. Tell us whether you're here to hire or to work — and we'll personalize your experience from day one.",
    color: "from-blue-500/20 to-blue-600/10",
    glow: "group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-500/40",
    iconBg: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
  },
  {
    icon: <Briefcase className="h-7 w-7" />,
    number: "02",
    title: "Post or Find Projects",
    description:
      "Clients can post detailed project briefs in minutes. Freelancers can browse hundreds of opportunities filtered by skill, budget, and timeline.",
    color: "from-purple-500/20 to-purple-600/10",
    glow: "group-hover:shadow-purple-500/20",
    border: "group-hover:border-purple-500/40",
    iconBg: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20",
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    number: "03",
    title: "Connect & Collaborate",
    description:
      "Chat directly, share files, and align on deliverables — all within FreelanceGo. No emails, no third-party tools, no confusion.",
    color: "from-cyan-500/20 to-cyan-600/10",
    glow: "group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20",
  },
  {
    icon: <Wallet className="h-7 w-7" />,
    number: "04",
    title: "Complete & Get Paid",
    description:
      "Work gets done, milestones get approved, and payments are released securely. Freelancers get paid on time, every time.",
    color: "from-emerald-500/20 to-emerald-600/10",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
  },
];

function StepCard({ step, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
    >
      {/* Glow bg on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute inset-0 rounded-2xl border border-transparent ${step.border} transition-all duration-500`} />

      {/* Step number */}
      <span className="relative text-xs font-bold tracking-widest text-white/20 uppercase">
        Step {step.number}
      </span>

      {/* Icon */}
      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${step.iconBg}`}>
        {step.icon}
      </div>

      {/* Content */}
      <div className="relative space-y-2">
        <h3 className="text-xl font-bold text-white">{step.title}</h3>
        <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
      </div>

      {/* Connector arrow — hidden on last card and on mobile */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-background border border-white/10">
          <ArrowRight className="h-4 w-4 text-white/30" />
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative bg-background px-4">
      <Navbar />
      <MouseMoveEffect />

      {/* Background gradients */}
      <div className="pointer-events-none fixed z-[-1] inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 bg-cyan-500/5 blur-[80px]" />
      </div>

      {/* Hero heading */}
      <section className="container max-w-screen-2xl py-20 md:py-28">
        <div
          className="text-center space-y-5 transition-all duration-1000"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(20px)" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase">
            Simple Process
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            How{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-transparent">
              FreelanceGo
            </span>{" "}
            Works
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/50 leading-relaxed">
            Start your freelancing journey in just four simple steps — whether you're here to hire talent or land your next big project.
          </p>
        </div>
      </section>

      {/* Steps grid */}
      <section className="container max-w-screen-2xl pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </section>

      {/* FAQ / Extra context */}
      <section className="container max-w-screen-2xl pb-24 md:pb-32">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Why choose FreelanceGo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
            {[
              { title: "Secure Payments", desc: "Funds are held in escrow until milestones are approved — zero risk for both sides." },
              { title: "Vetted Talent", desc: "Every freelancer on the platform has a verified profile, ratings, and work history." },
              { title: "No Hidden Fees", desc: "Transparent pricing with no surprise charges. What you see is exactly what you pay." },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}