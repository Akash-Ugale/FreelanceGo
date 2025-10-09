import {
  BarChart3,
  Briefcase,
  Clock,
  Eye,
  FileText,
  Home,
  IndianRupee,
  MessageSquare,
  PlusCircle,
  Search,
  Star,
  UserCheck,
} from "lucide-react"

export const freelancerItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Browse Jobs", href: "/dashboard/browse-jobs", icon: Search },
  { title: "My Proposals", href: "/dashboard/proposals", icon: FileText },
  { title: "Active Projects", href: "/dashboard/projects", icon: Briefcase },
  { title: "Bid History", href: "/dashboard/bid-history", icon: Clock },
  { title: "Earnings", href: "/dashboard/earnings", icon: IndianRupee },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

export const clientItems = [
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
  { title: "Payments", href: "/dashboard/payments", icon: IndianRupee },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]
