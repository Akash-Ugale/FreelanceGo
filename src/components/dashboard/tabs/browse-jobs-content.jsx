"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Star, MapPin, Users, Briefcase, Heart, Send, Eye } from "lucide-react"
import { Card,CardContent } from "@/components/ui/card"
const jobListings = [
  {
    id: "job_001",
    title: "Full-Stack React Developer for E-commerce Platform",
    description:
      "We're looking for an experienced full-stack developer to build a modern e-commerce platform with React, Node.js, and PostgreSQL. The project includes user authentication, payment integration, inventory management, and admin dashboard.",
    budget: {
      type: "fixed",
      amount: 5000,
      range: { min: 4000, max: 6000 },
    },
    timeline: "8-10 weeks",
    postedDate: "2024-01-20T10:00:00Z",
    category: "Web Development",
    skills: ["React", "Node.js", "PostgreSQL", "Stripe API", "TypeScript", "AWS"],
    experienceLevel: "Expert",
    projectType: "Long-term",
    location: "Remote",
    proposalsCount: 12,
    client: {
      name: "TechStart Inc.",
      avatar: "/placeholder.svg?height=60&width=60&text=TS",
      rating: 4.8,
      jobsPosted: 15,
      hireRate: 85,
      location: "San Francisco, CA",
      paymentVerified: true,
    },
  },
  {
    id: "job_002",
    title: "Mobile App UI/UX Design for Fitness App",
    description:
      "Design a modern, engaging UI/UX for a fitness tracking mobile app. We need wireframes, high-fidelity mockups, and interactive prototypes for both iOS and Android platforms. The design should motivate users and provide excellent user experience.",
    budget: {
      type: "fixed",
      amount: 3500,
      range: { min: 2500, max: 4000 },
    },
    timeline: "5-6 weeks",
    postedDate: "2024-01-22T14:30:00Z",
    category: "Design & Creative",
    skills: ["Figma", "UI/UX Design", "Mobile Design", "Prototyping", "User Research", "Adobe Creative Suite"],
    experienceLevel: "Intermediate",
    projectType: "Medium-term",
    location: "Remote",
    proposalsCount: 8,
    client: {
      name: "FitLife Solutions",
      avatar: "/placeholder.svg?height=60&width=60&text=FL",
      rating: 4.6,
      jobsPosted: 7,
      hireRate: 71,
      location: "Austin, TX",
      paymentVerified: true,
    },
  },
  {
    id: "job_003",
    title: "Content Writing for Tech Blog - Ongoing",
    description:
      "We need a skilled technical writer to create engaging blog posts for our developer-focused website. Topics include JavaScript frameworks, cloud computing, DevOps practices, and emerging technologies. Looking for someone who can explain complex concepts clearly.",
    budget: {
      type: "hourly",
      amount: 75,
      range: { min: 60, max: 90 },
    },
    timeline: "Ongoing",
    postedDate: "2024-01-25T09:15:00Z",
    category: "Writing & Translation",
    skills: ["Technical Writing", "SEO", "Content Strategy", "JavaScript", "Python", "Developer Relations"],
    experienceLevel: "Expert",
    projectType: "Ongoing",
    location: "Remote",
    proposalsCount: 15,
    client: {
      name: "DevHub Media",
      avatar: "/placeholder.svg?height=60&width=60&text=DH",
      rating: 4.9,
      jobsPosted: 23,
      hireRate: 92,
      location: "Remote",
      paymentVerified: true,
    },
  },
  {
    id: "job_004",
    title: "WordPress Plugin Development for E-learning Platform",
    description:
      "Develop a custom WordPress plugin for our e-learning platform. The plugin should handle course management, student enrollment, progress tracking, and certificate generation. Must be compatible with popular LMS plugins.",
    budget: {
      type: "fixed",
      amount: 2800,
      range: { min: 2000, max: 3500 },
    },
    timeline: "4-5 weeks",
    postedDate: "2024-01-23T16:45:00Z",
    category: "Web Development",
    skills: ["WordPress", "PHP", "MySQL", "JavaScript", "Plugin Development", "LMS"],
    experienceLevel: "Intermediate",
    projectType: "Medium-term",
    location: "Remote",
    proposalsCount: 6,
    client: {
      name: "EduTech Solutions",
      avatar: "/placeholder.svg?height=60&width=60&text=ET",
      rating: 4.7,
      jobsPosted: 11,
      hireRate: 78,
      location: "New York, NY",
      paymentVerified: true,
    },
  },
  {
    id: "job_005",
    title: "Data Analysis and Visualization Dashboard",
    description:
      "Create an interactive dashboard for business intelligence using Python, Pandas, and visualization libraries. The dashboard should connect to multiple data sources and provide real-time insights with customizable charts and reports.",
    budget: {
      type: "fixed",
      amount: 4200,
      range: { min: 3500, max: 5000 },
    },
    timeline: "6-7 weeks",
    postedDate: "2024-01-21T11:20:00Z",
    category: "Data Science",
    skills: ["Python", "Pandas", "Plotly", "Dash", "SQL", "Data Visualization"],
    experienceLevel: "Expert",
    projectType: "Long-term",
    location: "Remote",
    proposalsCount: 9,
    client: {
      name: "Analytics Pro",
      avatar: "/placeholder.svg?height=60&width=60&text=AP",
      rating: 4.8,
      jobsPosted: 19,
      hireRate: 89,
      location: "Chicago, IL",
      paymentVerified: true,
    },
  },
]

export default function BrowseJobsContent() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [savedJobs, setSavedJobs] = useState([])

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter

    const matchesBudget =
      budgetFilter === "all" ||
      (budgetFilter === "under-1000" && job.budget.amount < 1000) ||
      (budgetFilter === "1000-3000" && job.budget.amount >= 1000 && job.budget.amount <= 3000) ||
      (budgetFilter === "3000-5000" && job.budget.amount >= 3000 && job.budget.amount <= 5000) ||
      (budgetFilter === "over-5000" && job.budget.amount > 5000)

    const matchesExperience = experienceFilter === "all" || job.experienceLevel === experienceFilter

    return matchesSearch && matchesCategory && matchesBudget && matchesExperience
  })

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleSubmitProposal = (jobId) => {
    navigate(`/submit-proposal?jobId=${jobId}`)
  }

  const formatDate = (dateString) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - posted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const formatBudget = (budget) => {
    if (budget.type === "hourly") {
      return `$${budget.amount}/hr`
    }
    return `$${budget.amount.toLocaleString()}`
  }

  const getBudgetColor = (amount) => {
    if (amount < 1000) return "text-orange-600"
    if (amount < 3000) return "text-blue-600"
    if (amount < 5000) return "text-green-600"
    return "text-purple-600"
  }

  const getExperienceColor = (level) => {
    switch (level) {
      case "Entry":
        return "text-green-600"
      case "Intermediate":
        return "text-blue-600"
      case "Expert":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Browse Jobs</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Find your next freelance opportunity from {jobListings.length} available projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Heart className="mr-2 h-4 w-4" />
            Saved Jobs ({savedJobs.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by job title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Design & Creative">Design & Creative</SelectItem>
              <SelectItem value="Writing & Translation">Writing & Translation</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
            </SelectContent>
          </Select>

          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Budgets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="under-1000">Under $1,000</SelectItem>
              <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
              <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
              <SelectItem value="over-5000">Over $5,000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="Entry">Entry Level</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Job Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-xl pr-4">{job.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`${savedJobs.includes(job.id) ? "text-red-500" : "text-muted-foreground"} hover:text-red-500`}
                      >
                        <Heart className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>{formatDate(job.postedDate)}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                      <span>•</span>
                      <span className={getExperienceColor(job.experienceLevel)}>{job.experienceLevel}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{job.description}</p>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getBudgetColor(job.budget.amount)}`}>
                      {formatBudget(job.budget)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.budget.type === "fixed" ? "Fixed Price" : "Hourly Rate"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{job.timeline}</div>
                    <div className="text-sm text-muted-foreground">Timeline</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{job.proposalsCount}</div>
                    <div className="text-sm text-muted-foreground">Proposals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{job.projectType}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.client.avatar || "/placeholder.svg"} alt={job.client.name} />
                      <AvatarFallback>
                        {job.client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{job.client.name}</h4>
                        {job.client.paymentVerified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Payment Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{job.client.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.client.jobsPosted} jobs posted</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{job.client.hireRate}% hire rate</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.client.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h5 className="font-semibold">Required Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Users className="mr-2 h-4 w-4" />
                      View Client Profile
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">
                      {job.proposalsCount} {job.proposalsCount === 1 ? "proposal" : "proposals"}
                    </div>
                    <Button size="sm" onClick={() => handleSubmitProposal(job.id)}>
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

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
              setBudgetFilter("all")
              setExperienceFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
