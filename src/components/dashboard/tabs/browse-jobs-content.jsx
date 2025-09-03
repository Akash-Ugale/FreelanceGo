import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"
import {
  Award,
  Bookmark,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Search,
  Send,
  Star,
  Users,
} from "lucide-react"
import { useState } from "react"

const jobs = [
  {
    id: 1,
    title: "Full-Stack React Developer for E-commerce Platform",
    description:
      "We're looking for an experienced full-stack developer to build a modern e-commerce platform using React, Node.js, and PostgreSQL. The project involves creating a responsive frontend, robust backend APIs, and integrating payment systems.",
    budget: "$3,000 - $5,000",
    duration: "2-3 months",
    skillsRequired: ["React", "Node.js", "PostgreSQL", "Stripe API"],
    client: {
      name: "TechCorp Solutions",
      rating: 4.8,
      reviewsCount: 23,
      location: "San Francisco, CA",
      verified: true,
    },
    postedAt: "2 hours ago",
    proposalsCount: 12,
    category: "Web Development",
    experienceLevel: "Expert",
    projectType: "Fixed Price",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design for Fitness App",
    description:
      "Design a modern, intuitive mobile app interface for a fitness tracking application. We need someone who can create wireframes, prototypes, and final designs that work well on both iOS and Android platforms.",
    budget: "$1,500 - $2,500",
    duration: "3-4 weeks",
    skillsRequired: ["Figma", "UI/UX Design", "Mobile Design", "Prototyping"],
    client: {
      name: "FitLife Startup",
      rating: 4.6,
      reviewsCount: 15,
      location: "Austin, TX",
      verified: true,
    },
    postedAt: "5 hours ago",
    proposalsCount: 8,
    category: "Design",
    experienceLevel: "Intermediate",
    projectType: "Fixed Price",
  },
  {
    id: 3,
    title: "Content Writer for Tech Blog",
    description:
      "We need a skilled content writer to create engaging blog posts about emerging technologies, software development trends, and industry insights. Must have experience writing technical content for developer audiences.",
    budget: "$50 - $100/hour",
    duration: "Ongoing",
    skillsRequired: [
      "Technical Writing",
      "SEO",
      "Content Strategy",
      "Research",
    ],
    client: {
      name: "DevInsights Media",
      rating: 4.9,
      reviewsCount: 41,
      location: "Remote",
      verified: true,
    },
    postedAt: "1 day ago",
    proposalsCount: 25,
    category: "Writing",
    experienceLevel: "Intermediate",
    projectType: "Hourly",
  },
]

const freelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Full-Stack Developer & UI/UX Designer",
    description:
      "Experienced developer with 8+ years in React, Node.js, and modern web technologies. Specialized in creating scalable web applications and beautiful user interfaces.",
    hourlyRate: "$75 - $120/hour",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Figma"],
    rating: 4.9,
    reviewsCount: 127,
    completedJobs: 89,
    location: "New York, NY",
    verified: true,
    availability: "Available now",
    portfolio: ["E-commerce Platform", "SaaS Dashboard", "Mobile App Design"],
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Mobile App Developer",
    description:
      "iOS and Android developer with expertise in React Native and Flutter. Passionate about creating smooth, performant mobile experiences that users love.",
    hourlyRate: "$60 - $95/hour",
    skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
    rating: 4.8,
    reviewsCount: 93,
    completedJobs: 67,
    location: "Seattle, WA",
    verified: true,
    availability: "Available in 2 weeks",
    portfolio: [
      "Fitness Tracking App",
      "Food Delivery App",
      "Social Media App",
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Content Strategist & Technical Writer",
    description:
      "Technical writer and content strategist with 6+ years of experience creating compelling content for tech companies, startups, and developer tools.",
    hourlyRate: "$45 - $75/hour",
    skills: ["Technical Writing", "Content Strategy", "SEO", "Documentation"],
    rating: 4.9,
    reviewsCount: 156,
    completedJobs: 203,
    location: "Remote",
    verified: true,
    availability: "Available now",
    portfolio: ["API Documentation", "Developer Guides", "Tech Blog Posts"],
  },
]

export default function BrowseJobsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [savedJobs, setSavedJobs] = useState([])
  const { userRole } = useAuth()

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    )
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || job.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    return matchesSearch
  })

  if (userRole === "client") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Find Talent
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Discover skilled freelancers for your projects
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Search Freelancers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by skills, name, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="w-full md:w-auto bg-transparent"
              >
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Freelancers List */}
        <div className="space-y-4">
          {filteredFreelancers.map((freelancer) => (
            <Card
              key={freelancer.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start space-x-4 lg:flex-col lg:items-center lg:space-x-0 lg:space-y-4 lg:min-w-[200px]">
                    <Avatar className="h-16 w-16 lg:h-20 lg:w-20">
                      <AvatarImage
                        src={`/placeholder.svg?height=80&width=80&text=${freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback>
                        {freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="lg:text-center">
                      <div className="flex items-center space-x-2 lg:justify-center">
                        <h3 className="font-semibold text-lg">
                          {freelancer.name}
                        </h3>
                        {freelancer.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {freelancer.title}
                      </p>
                      <div className="flex items-center space-x-1 mt-1 lg:justify-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {freelancer.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({freelancer.reviewsCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {freelancer.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">
                          {freelancer.hourlyRate}
                        </div>
                        <div className="text-muted-foreground">Hourly Rate</div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {freelancer.completedJobs}
                        </div>
                        <div className="text-muted-foreground">
                          Jobs Completed
                        </div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {freelancer.location}
                        </div>
                        <div className="text-muted-foreground">Location</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600">
                          {freelancer.availability}
                        </div>
                        <div className="text-muted-foreground">
                          Availability
                        </div>
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Recent Work:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.portfolio.map((work, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {work}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:min-w-[120px]">
                    <Button size="sm" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Browse Jobs
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Find your next freelance opportunity
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Search Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web development">Web Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="over-5000">Over $5,000</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full md:w-auto bg-transparent"
            >
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {job.budget}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {job.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {job.proposalsCount} proposals
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {job.experienceLevel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{job.category}</Badge>
                    <Badge variant="secondary">{job.projectType}</Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Client Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${job.client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback className="text-xs">
                        {job.client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {job.client.name}
                        </span>
                        {job.client.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {job.client.rating} ({job.client.reviewsCount})
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {job.client.location}
                        </span>
                        <span>{job.postedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className={
                        savedJobs.includes(job.id) ? "text-blue-600" : ""
                      }
                    >
                      <Bookmark
                        className={`mr-2 h-4 w-4 ${
                          savedJobs.includes(job.id) ? "fill-current" : ""
                        }`}
                      />
                      {savedJobs.includes(job.id) ? "Saved" : "Save"}
                    </Button>
                    <Button size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Proposal
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
