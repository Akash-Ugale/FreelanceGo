"use client"

import { apiClient } from "@/api/AxiosServiceApi"
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
import {
  Briefcase,
  Eye,
  FileText,
  Filter,
  Loader2,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react" // <-- Added Loader2 icon
import { useEffect, useRef, useState } from "react" // <-- Added useRef and useEffect
import { useNavigate } from "react-router-dom"

// --- INFINITE SCROLL CONFIGURATION ---
const ITEMS_PER_PAGE = 3 // Number of items to load initially and in subsequent batches
// --- END CONFIGURATION ---

const uncontractedProjects = [
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
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Stripe API",
      "TypeScript",
      "AWS",
    ],
    experienceLevel: "Expert",
    projectType: "Long-term",
    location: "Remote",
    bidsCount: 12,
    status: "active",
    clientInfo: {
      name: "TechStart Inc.",
      rating: 4.8,
      jobsPosted: 15,
      hireRate: 85,
      location: "San Francisco, CA",
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
    skills: [
      "Figma",
      "UI/UX Design",
      "Mobile Design",
      "Prototyping",
      "User Research",
      "Adobe Creative Suite",
    ],
    experienceLevel: "Intermediate",
    projectType: "Medium-term",
    location: "Remote",
    bidsCount: 8,
    status: "active",
    clientInfo: {
      name: "FitLife Solutions",
      rating: 4.6,
      jobsPosted: 7,
      hireRate: 71,
      location: "Austin, TX",
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
    skills: [
      "Technical Writing",
      "SEO",
      "Content Strategy",
      "JavaScript",
      "Python",
      "Developer Relations",
    ],
    experienceLevel: "Expert",
    projectType: "Ongoing",
    location: "Remote",
    bidsCount: 15,
    status: "active",
    clientInfo: {
      name: "DevHub Media",
      rating: 4.9,
      jobsPosted: 23,
      hireRate: 92,
      location: "Remote",
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
    skills: [
      "WordPress",
      "PHP",
      "MySQL",
      "JavaScript",
      "Plugin Development",
      "LMS",
    ],
    experienceLevel: "Intermediate",
    projectType: "Medium-term",
    location: "Remote",
    bidsCount: 6,
    status: "active",
    clientInfo: {
      name: "EduTech Solutions",
      rating: 4.7,
      jobsPosted: 11,
      hireRate: 78,
      location: "New York, NY",
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
    bidsCount: 9,
    status: "active",
    clientInfo: {
      name: "Analytics Pro",
      rating: 4.8,
      jobsPosted: 19,
      hireRate: 89,
      location: "Chicago, IL",
    },
  },
  // Added an extra project to ensure scrolling behavior for the demo
  {
    id: "job_006",
    title: "Serverless Architecture Migration Consultant",
    description:
      "Migrate existing monolithic API to a serverless architecture using AWS Lambda and DynamoDB. Requires strong expertise in event-driven design patterns.",
    budget: {
      type: "fixed",
      amount: 8000,
      range: { min: 7000, max: 9000 },
    },
    timeline: "12 weeks",
    postedDate: "2024-01-18T15:00:00Z",
    category: "Web Development",
    skills: [
      "AWS Lambda",
      "Serverless",
      "DynamoDB",
      "Node.js",
      "CloudFormation",
    ],
    experienceLevel: "Expert",
    projectType: "Long-term",
    location: "Remote",
    bidsCount: 18,
    status: "active",
    clientInfo: {
      name: "CloudNative Inc.",
      rating: 4.9,
      jobsPosted: 30,
      hireRate: 95,
      location: "Seattle, WA",
    },
  },
]

export default function ReviewProposalsContent() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")

  // --- INFINITE SCROLL & LOADING STATES ---
  const [itemsToDisplay, setItemsToDisplay] = useState(ITEMS_PER_PAGE)
  const [isObservingLoad, setIsObservingLoad] = useState(false)
  const loadMoreRef = useRef(null)
  // --- END INFINITE SCROLL & LOADING STATES ---

  const filteredProjects = uncontractedProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesCategory =
      categoryFilter === "all" || project.category === categoryFilter

    const matchesBudget =
      budgetFilter === "all" ||
      (budgetFilter === "under-1000" && project.budget.amount < 1000) ||
      (budgetFilter === "1000-3000" &&
        project.budget.amount >= 1000 &&
        project.budget.amount <= 3000) ||
      (budgetFilter === "3000-5000" &&
        project.budget.amount >= 3000 &&
        project.budget.amount <= 5000) ||
      (budgetFilter === "over-5000" && project.budget.amount > 5000)

    return matchesSearch && matchesCategory && matchesBudget
  })

  // --- INFINITE SCROLL LOGIC ---
  const projectsOnPage = filteredProjects.slice(0, itemsToDisplay)
  const hasMore = itemsToDisplay < filteredProjects.length

  // Effect to reset pagination when filters change
  useEffect(() => {
    setItemsToDisplay(ITEMS_PER_PAGE)
    setIsObservingLoad(false)
  }, [searchTerm, categoryFilter, budgetFilter])

  // Effect to handle Intersection Observer
  useEffect(() => {
    // Only set up observer if there are more items to load and we're not currently loading
    if (!hasMore || isObservingLoad) return

    const loadNextPage = () => {
      setIsObservingLoad(true)
      // Simulate a network/data fetch delay (e.g., 1 second)
      setTimeout(() => {
        setItemsToDisplay((prevCount) => prevCount + ITEMS_PER_PAGE)
        setIsObservingLoad(false)
      }, 1000)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // If the ref element is visible (intersecting), load the next page
        if (entries[0].isIntersecting) {
          loadNextPage()
        }
      },
      { rootMargin: "200px" } // Start loading when the element is 200px from the viewport
    )

    const currentRef = loadMoreRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        // Clean up the observer when the component unmounts or dependencies change
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, isObservingLoad, filteredProjects.length])
  // --- END INFINITE SCROLL LOGIC ---

  const fetchActiveProjects = async () => {
    try {
      const response = await apiClient.get("/api/review-my-proposals")
      const { data } = response
      console.log("Review proposals:", response)
    } catch (error) {
      console.error("Error fetching active projects:", error)
    }
  }

  useEffect(() => {
    fetchActiveProjects()
  }, [])

  const getProjectStats = () => {
    const totalProjects = uncontractedProjects.length
    const totalBids = uncontractedProjects.reduce(
      (sum, project) => sum + project.bidsCount,
      0
    )
    const avgBidsPerProject = totalBids / totalProjects
    const highestBids = Math.max(
      ...uncontractedProjects.map((p) => p.bidsCount)
    )

    return {
      totalProjects,
      totalBids,
      avgBidsPerProject: Math.round(avgBidsPerProject),
      highestBids,
    }
  }

  const stats = getProjectStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const getBidsColor = (count) => {
    if (count < 5) return "text-red-600"
    if (count < 10) return "text-yellow-600"
    return "text-green-600"
  }

  const handleShowBids = (projectId) => {
    navigate(`/dashboard/project-bids/${projectId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Review Proposals
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your active job posts and review incoming proposals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Awaiting proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalBids}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Bids/Project
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.avgBidsPerProject}
            </div>
            <p className="text-xs text-muted-foreground">Average interest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Bids</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.highestBids}
            </div>
            <p className="text-xs text-muted-foreground">
              Most popular project
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by project title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Design & Creative">Design & Creative</SelectItem>
            <SelectItem value="Writing & Translation">
              Writing & Translation
            </SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <Select value={budgetFilter} onValueChange={setBudgetFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            <SelectItem value="under-1000">Under $1,000</SelectItem>
            <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
            <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
            <SelectItem value="over-5000">Over $5,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {/* Changed mapping to use projectsOnPage instead of filteredProjects */}
        {projectsOnPage.map((project, index) => {
          // Determine if this is the last item AND there are more items to load.
          const isLastProject = index === projectsOnPage.length - 1
          const refProps = isLastProject && hasMore ? { ref: loadMoreRef } : {}

          return (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow"
              {...refProps}
            >
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Project Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span>Posted: {formatDate(project.postedDate)}</span>
                        <span>•</span>
                        <span>ID: {project.id}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${getBudgetColor(
                          project.budget.amount
                        )}`}
                      >
                        {formatBudget(project.budget)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.budget.type === "fixed"
                          ? "Fixed Price"
                          : "Hourly Rate"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {project.timeline}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Timeline
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {project.experienceLevel}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Experience
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {project.projectType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {project.clientInfo.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {project.clientInfo.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{project.clientInfo.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span>
                              {project.clientInfo.jobsPosted} jobs posted
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {project.clientInfo.hireRate}% hire rate
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{project.clientInfo.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <h5 className="font-semibold">Required Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      {/* Edit/View buttons were commented out, keeping them out */}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        {project.bidsCount === 1 ? "proposal" : "proposals"}{" "}
                        received
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleShowBids(project.id)}
                        disabled={project.bidsCount === 0}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Show Bids
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* --- INFINITE SCROLL LOADING & END OF LIST INDICATORS --- */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isObservingLoad ? (
            <div className="flex items-center text-blue-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Loading more proposals...</span>
            </div>
          ) : (
            // This state is hit right before the observer loads the next page
            <p className="text-muted-foreground text-sm">
              Scroll down to load more
            </p>
          )}
        </div>
      )}

      {!hasMore && filteredProjects.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border-t mt-6">
          You've reached the end of the matching projects list.
        </div>
      )}
      {/* --- END INFINITE SCROLL INDICATORS --- */}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or post a new job to get started.
          </p>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
      )}
    </div>
  )
}
