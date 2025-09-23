import { Button } from "@/components/ui/button"
import { Github, Menu } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img src="/freelancego-logo.svg" alt="" className="w-5 h-5" />
          <span className="font-bold">FreelanceGo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {/* <Link
            to="/find-work"
            className="transition-colors hover:text-primary"
          >
            Find Work
          </Link>
          <Link
            to="/find-talent"
            className="transition-colors hover:text-primary"
          >
            Find Talent
          </Link> */}
          <Link
            to="/how-it-works"
            className="transition-colors hover:text-primary"
          >
            How It Works
          </Link>
          <Link to="/about-us" className="transition-colors hover:text-primary">
            About Us
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://github.com/amanesoft"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <a href="https://freelancegobackend.onrender.com/oauth2/authorization/google">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </a>
          <a href="https://freelancegobackend.onrender.com/oauth2/authorization/google">
            <Button size="sm" className="text-white">
              Join FreelanceGo
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-4">
            {/* <Link
              to="/find-work"
              className="block text-sm font-medium transition-colors hover:text-primary"
            >
              Find Work
            </Link>
            <Link
              to="/find-talent"
              className="block text-sm font-medium transition-colors hover:text-primary"
            >
              Find Talent
            </Link> */}
            <Link
              to="/how-it-works"
              className="block text-sm font-medium transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              to="/about-us"
              className="block text-sm font-medium transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <a href="https://freelancegobackend.onrender.com/oauth2/authorization/google">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </a>
              <a to="https://freelancegobackend.onrender.com/oauth2/authorization/google">
                <Button size="sm" className="w-full text-white">
                  Join FreelanceGo
                </Button>
              </a>
            </div>
            <a
              href="https://github.com/koustubh-lab/FreelanceGo"
              target="_blank"
              rel="noreferrer"
              className="block "
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
