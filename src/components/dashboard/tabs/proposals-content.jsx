"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RUPEE, userRoles } from "@/utils/constants"
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Search,
  Star,
  User,
  XCircle,
} from "lucide-react"
import { useState } from "react"

const freelancerProposals = [
  {
    id: 1,
    jobTitle: "E-commerce Website Development",
    client: "TechCorp Inc.",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 2500,
    status: "Under Review",
    submittedDate: "2024-01-25",
    coverLetter:
      "I have extensive experience in e-commerce development with React and Node.js...",
    timeline: "6 weeks",
    category: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    clientRating: 4.8,
    clientJobs: 12,
  },
  {
    id: 2,
    jobTitle: "Mobile App UI/UX Design",
    client: "FitLife Startup",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 1800,
    status: "Accepted",
    submittedDate: "2024-01-20",
    coverLetter:
      "Your fitness app project aligns perfectly with my design expertise...",
    timeline: "4 weeks",
    category: "Design",
    skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
    clientRating: 4.9,
    clientJobs: 8,
  },
  {
    id: 3,
    jobTitle: "Content Writing for Tech Blog",
    client: "DevInsights Media",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 800,
    status: "Declined",
    submittedDate: "2024-01-18",
    coverLetter:
      "I specialize in technical content writing with 5+ years experience...",
    timeline: "2 weeks",
    category: "Writing",
    skills: ["Technical Writing", "SEO", "Content Strategy"],
    clientRating: 4.6,
    clientJobs: 25,
  },
]

const clientProposals = [
  {
    id: 1,
    jobTitle: "Full-Stack Web Development",
    freelancer: "Sarah Johnson",
    freelancerAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 3500,
    status: "New",
    submittedDate: "2024-01-25",
    coverLetter:
      "I'm excited to work on your full-stack project. With 8+ years of experience...",
    timeline: "8 weeks",
    freelancerRating: 4.9,
    completedJobs: 47,
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    hourlyRate: 85,
  },
  {
    id: 2,
    jobTitle: "Brand Identity Design",
    freelancer: "Mike Chen",
    freelancerAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 2200,
    status: "Shortlisted",
    submittedDate: "2024-01-23",
    coverLetter:
      "Your brand identity project caught my attention. I have extensive experience...",
    timeline: "5 weeks",
    freelancerRating: 4.8,
    completedJobs: 32,
    skills: ["Brand Design", "Logo Design", "Adobe Creative Suite"],
    hourlyRate: 65,
  },
  {
    id: 3,
    jobTitle: "Mobile App Development",
    freelancer: "Emily Rodriguez",
    freelancerAvatar: "/placeholder.svg?height=40&width=40",
    bidAmount: 4500,
    status: "Interviewed",
    submittedDate: "2024-01-20",
    coverLetter:
      "I'm passionate about mobile development and would love to bring your app idea to life...",
    timeline: "10 weeks",
    freelancerRating: 5.0,
    completedJobs: 28,
    skills: ["React Native", "iOS", "Android", "Firebase"],
    hourlyRate: 90,
  },
]

export default function ProposalsContent({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTab, setSelectedTab] = useState("all")

  const proposals =
    userRole === userRoles.FREELANCER ? freelancerProposals : clientProposals

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "hired":
        return "default"
      case "under review":
      case "new":
        return "secondary"
      case "shortlisted":
      case "interviewed":
        return "outline"
      case "declined":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getProposalStats = () => {
    if (userRole === userRoles.FREELANCER) {
      const total = freelancerProposals.length
      const accepted = freelancerProposals.filter(
        (p) => p.status === "Accepted"
      ).length
      const pending = freelancerProposals.filter(
        (p) => p.status === "Under Review"
      ).length
      const declined = freelancerProposals.filter(
        (p) => p.status === "Declined"
      ).length
      return { total, accepted, pending, declined }
    } else {
      const total = clientProposals.length
      const new_proposals = clientProposals.filter(
        (p) => p.status === "New"
      ).length
      const shortlisted = clientProposals.filter(
        (p) => p.status === "Shortlisted"
      ).length
      const interviewed = clientProposals.filter(
        (p) => p.status === "Interviewed"
      ).length
      return { total, new: new_proposals, shortlisted, interviewed }
    }
  }

  const stats = getProposalStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {userRole === userRoles.FREELANCER
              ? "My Proposals"
              : "Review Proposals"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === userRoles.FREELANCER
              ? "Track your submitted proposals and their status"
              : "Review and manage incoming proposals from freelancers"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          {userRole === "client" && (
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proposals
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === userRoles.FREELANCER ? "Submitted" : "Received"}
            </p>
          </CardContent>
        </Card>

        {userRole === userRoles.FREELANCER ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.accepted}</div>
                <p className="text-xs text-muted-foreground">
                  Success rate:{" "}
                  {((stats.accepted / stats.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Under review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Declined</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.declined}</div>
                <p className="text-xs text-muted-foreground">Not selected</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.new}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Shortlisted
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.shortlisted}</div>
                <p className="text-xs text-muted-foreground">Top candidates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Interviewed
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interviewed}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`Search ${
              userRole === userRoles.FREELANCER ? "jobs" : "freelancers"
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {userRole === userRoles.FREELANCER ? (
              <>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {userRole === userRoles.FREELANCER
              ? "Submitted Proposals"
              : "Received Proposals"}
          </CardTitle>
          <CardDescription>
            {userRole === userRoles.FREELANCER
              ? "Track the status of your job applications"
              : "Review and manage proposals from talented freelancers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            userRole === userRoles.FREELANCER
                              ? proposal.clientAvatar
                              : proposal.freelancerAvatar
                          }
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          {userRole === userRoles.FREELANCER
                            ? proposal.client
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : proposal.freelancer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {proposal.jobTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>
                              {userRole === userRoles.FREELANCER
                                ? proposal.client
                                : proposal.freelancer}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {userRole === userRoles.FREELANCER
                                ? proposal.clientRating
                                : proposal.freelancerRating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span>
                              {userRole === userRoles.FREELANCER
                                ? proposal.clientJobs
                                : proposal.completedJobs}{" "}
                              jobs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {proposal.coverLetter}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {proposal.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {proposal.submittedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Timeline: {proposal.timeline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <Badge variant={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${proposal.bidAmount.toLocaleString()}
                      </div>
                      {userRole === "client" && (
                        <div className="text-sm text-muted-foreground">
                          ${proposal.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {userRole === "client" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm">Hire</Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
