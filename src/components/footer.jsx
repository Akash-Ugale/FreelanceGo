import { Link } from "react-router-dom"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <h2 className="font-bold">FreelanceGo</h2>
          <p className="text-sm text-muted-foreground">Connecting talent with opportunity worldwide.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">For Freelancers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/find-work" className="text-muted-foreground transition-colors hover:text-primary">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to="/how-to-freelance" className="text-muted-foreground transition-colors hover:text-primary">
                  How to Freelance
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">For Clients</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/find-talent" className="text-muted-foreground transition-colors hover:text-primary">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link to="/how-to-hire" className="text-muted-foreground transition-colors hover:text-primary">
                  How to Hire
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/freelancego"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com/freelancego"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com/company/freelancego"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FreelanceGo, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
