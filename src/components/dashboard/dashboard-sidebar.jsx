import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Home,
  MessageSquare,
  PlusCircle,
  Search,
  Star,
  UserCheck,
} from "lucide-react"
import { useState } from "react"
import DashboardSidebarContentCollapsed from "./dashboard-sidebar-collapsed"
import DashboardSidebarContent from "./dashboard-sidebar-content"

const freelancerItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Browse Jobs", href: "/dashboard/browse-jobs", icon: Search },
  { title: "My Proposals", href: "/dashboard/proposals", icon: FileText },
  { title: "Active Projects", href: "/dashboard/projects", icon: Briefcase },
  { title: "Bid History", href: "/dashboard/bid-history", icon: Clock },
  { title: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

const clientItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Post a Job", href: "/dashboard/post-job", icon: PlusCircle },
  { title: "My Job Posts", href: "/dashboard/job-posts", icon: FileText },
  { title: "Review Proposals", href: "/dashboard/proposals-review", icon: Eye },
  { title: "Active Projects", href: "/dashboard/projects", icon: Briefcase },
  {
    title: "Hired Freelancers",
    href: "/dashboard/hired-freelancers",
    icon: UserCheck,
  },
  { title: "Payments", href: "/dashboard/payments", icon: DollarSign },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

export default function DashboardSidebar({ userRole }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative hidden md:flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Sidebar Content */}
      {!collapsed && (
        <DashboardSidebarContent
          userRole={userRole}
          freelancerItems={freelancerItems}
          clientItems={clientItems}
        />
      )}

      {/* Collapsed State */}
      {collapsed && (
        <div className="flex flex-col items-center py-6 space-y-4">
          <DashboardSidebarContentCollapsed
            userRole={userRole}
            collapsed
            freelancerItems={freelancerItems}
            clientItems={clientItems}
          />
        </div>
      )}
    </div>
  )
}
