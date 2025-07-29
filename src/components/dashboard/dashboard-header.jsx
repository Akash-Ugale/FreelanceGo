import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User, LogOut, CreditCard, HelpCircle, Menu } from "lucide-react"
import DashboardSidebarContent from "./dashboard-sidebar-content"

export default function DashboardHeader({ userRole, onRoleChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleRole = () => {
    onRoleChange(userRole === "freelancer" ? "client" : "freelancer")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <DashboardSidebarContent userRole={userRole} onItemClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg md:text-xl">FreelanceGo</span>
          </Link>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs md:text-sm text-muted-foreground">Switch to:</span>
          <Button
            variant={userRole === "freelancer" ? "default" : "outline"}
            size="sm"
            onClick={toggleRole}
            className="text-xs md:text-sm"
          >
            {userRole === "freelancer" ? "Client View" : "Freelancer View"}
          </Button>
          <Badge variant={userRole === "freelancer" ? "default" : "secondary"} className="text-xs">
            {userRole === "freelancer" ? "Freelancer" : "Client"}
          </Badge>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  {userRole === "freelancer" ? "Freelancer" : "Client"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleRole}>
                  Switch to {userRole === "freelancer" ? "Client" : "Freelancer"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full">
                <Avatar className="h-9 w-9 md:h-10 md:w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">{userRole}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
