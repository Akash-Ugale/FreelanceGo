"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Briefcase,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  MessageSquare,
  Eye,
  UserCheck,
  PlusCircle,
} from "lucide-react"

const freelancerStats = [
  {
    title: "Total Earnings",
    value: "$12,450",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Active Projects",
    value: "8",
    change: "+2",
    changeType: "positive",
    icon: Briefcase,
  },
  {
    title: "Pending Proposals",
    value: "15",
    change: "-3",
    changeType: "negative",
    icon: Clock,
  },
  {
    title: "Success Rate",
    value: "87%",
    change: "+5%",
    changeType: "positive",
    icon: TrendingUp,
  },
]

const clientStats = [
  {
    title: "Total Spent",
    value: "$24,850",
    change: "+18.2%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Active Projects",
    value: "12",
    change: "+4",
    changeType: "positive",
    icon: Briefcase,
  },
  {
    title: "Job Posts",
    value: "6",
    change: "+1",
    changeType: "positive",
    icon: PlusCircle,
  },
  {
    title: "Hired Freelancers",
    value: "23",
    change: "+7",
    changeType: "positive",
    icon: UserCheck,
  },
]

const freelancerProjects = [
  {
    title: "E-commerce Website Development",
    client: "TechCorp Inc.",
    status: "In Progress",
    budget: "$2,500",
    deadline: "Dec 15, 2024",
    progress: 65,
  },
  {
    title: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    status: "Review",
    budget: "$1,800",
    deadline: "Dec 10, 2024",
    progress: 90,
  },
  {
    title: "Content Writing for Blog",
    client: "Marketing Pro",
    status: "Completed",
    budget: "$500",
    deadline: "Nov 30, 2024",
    progress: 100,
  },
]

const clientProjects = [
  {
    title: "Mobile App Development",
    freelancer: "Sarah Johnson",
    status: "In Progress",
    budget: "$5,000",
    deadline: "Jan 20, 2025",
    progress: 45,
  },
  {
    title: "Brand Identity Design",
    freelancer: "Mike Chen",
    status: "Review",
    budget: "$2,200",
    deadline: "Dec 18, 2024",
    progress: 80,
  },
  {
    title: "Website Redesign",
    freelancer: "Alex Rivera",
    status: "Completed",
    budget: "$3,500",
    deadline: "Dec 1, 2024",
    progress: 100,
  },
]

const freelancerBids = [
  {
    title: "React Native App Development",
    budget: "$3,000 - $5,000",
    bidAmount: "$3,500",
    status: "Pending",
    submittedAt: "2 hours ago",
  },
  {
    title: "WordPress Theme Customization",
    budget: "$800 - $1,200",
    bidAmount: "$950",
    status: "Shortlisted",
    submittedAt: "1 day ago",
  },
  {
    title: "Logo Design Project",
    budget: "$200 - $400",
    bidAmount: "$300",
    status: "Rejected",
    submittedAt: "3 days ago",
  },
]

const clientProposals = [
  {
    title: "Full-Stack Web Development",
    proposals: 12,
    budget: "$4,000 - $6,000",
    status: "Reviewing",
    postedAt: "3 hours ago",
  },
  {
    title: "Social Media Graphics",
    proposals: 8,
    budget: "$500 - $800",
    status: "Hired",
    postedAt: "2 days ago",
  },
  {
    title: "Content Strategy",
    proposals: 15,
    budget: "$1,200 - $2,000",
    status: "Active",
    postedAt: "1 week ago",
  },
]

export default function DashboardContent({ userRole }) {
  const stats = userRole === "freelancer" ? freelancerStats : clientStats
  const projects = userRole === "freelancer" ? freelancerProjects : clientProjects
  const recentActivity = userRole === "freelancer" ? freelancerBids : clientProposals

  const getQuickActions = () => {
    if (userRole === "freelancer") {
      return [
        { icon: Search, label: "Browse Jobs", href: "/dashboard/browse-jobs" },
        { icon: Plus, label: "Create Proposal", href: "/dashboard/proposals/new" },
        { icon: Star, label: "Update Profile", href: "/dashboard/profile" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
      ]
    } else {
      return [
        { icon: PlusCircle, label: "Post a Job", href: "/dashboard/post-job" },
        { icon: Eye, label: "Review Proposals", href: "/dashboard/proposals-review" },
        { icon: UserCheck, label: "Manage Freelancers", href: "/dashboard/hired-freelancers" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
      ]
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {userRole === "freelancer" ? "Freelancer" : "Client"} Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === "freelancer"
              ? "Welcome back! Here's what's happening with your freelance work."
              : "Welcome back! Here's an overview of your projects and hiring activity."}
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          {userRole === "freelancer" ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Proposal
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a Job
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {userRole === "freelancer" ? "Recent Projects" : "Active Projects"}
            </CardTitle>
            <CardDescription className="text-sm">
              {userRole === "freelancer"
                ? "Your active and recently completed projects"
                : "Projects you're currently managing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h4 className="font-semibold text-sm md:text-base">{project.title}</h4>
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "default"
                          : project.status === "In Progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="w-fit"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {userRole === "freelancer" ? project.client : project.freelancer}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" />
                      {project.budget}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {project.deadline}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {userRole === "freelancer" ? "Recent Bids" : "Recent Job Posts"}
            </CardTitle>
            <CardDescription className="text-sm">
              {userRole === "freelancer"
                ? "Your latest proposal submissions"
                : "Your recent job postings and proposals"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm leading-tight pr-2">{item.title}</h4>
                    <Badge
                      variant={
                        item.status === "Shortlisted" || item.status === "Hired"
                          ? "default"
                          : item.status === "Pending" || item.status === "Reviewing"
                          ? "secondary"
                          : item.status === "Active"
                          ? "outline"
                          : "destructive"
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {userRole === "freelancer" ? (
                      <>
                        <div>Budget: {item.budget}</div>
                        <div>Your bid: {item.bidAmount}</div>
                        <div>{item.submittedAt}</div>
                      </>
                    ) : (
                      <>
                        <div>Budget: {item.budget}</div>
                        <div>Proposals: {item.proposals}</div>
                        <div>{item.postedAt}</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            {userRole === "freelancer"
              ? "Common tasks to help you find work and manage projects"
              : "Common tasks to help you hire talent and manage projects"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {getQuickActions().map((action, index) => (
              <Button key={index} variant="outline" className="h-16 md:h-20 flex-col space-y-2 bg-transparent">
                <action.icon className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-xs md:text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
