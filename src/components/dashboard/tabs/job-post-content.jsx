import { apiClient } from "@/api/AxiosServiceApi"
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
import { useAuth } from "@/context/AuthContext"
import { userRoles } from "@/utils/constants"
import { format } from "date-fns"
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Pause,
  Plus,
  Search,
  Trash,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function JobPostsContent({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobPosts, setJobPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const { authLoading } = useAuth()

  const CURRENT_THEME = localStorage.getItem("theme")

  // 🧠 If user is freelancer — block job management
  if (userRole === userRoles.FREELANCER) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Switch to Client Role</CardTitle>
            <CardDescription>
              You need to be in client mode to manage job posts. Switch your
              role to access this feature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Switch to Client
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🧩 Fetch paginated job posts
  const fetchPosts = async (
    pageNum = 0,
    status = statusFilter,
    search = searchTerm
  ) => {
    setLoading(true)
    try {
      const response = await apiClient.get("/api/dashboard/get-post", {
        params: {
          page: pageNum,
          size: 5,
          status: status === "all" ? undefined : status,
          search: search.trim() || undefined,
        },
      })
      const { content, totalPages, totalElements } = response.data

      setJobPosts(Array.isArray(content) ? content : [])
      setTotalPages(totalPages)
      setTotalJobs(totalElements)
      setPage(pageNum)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(0, statusFilter, searchTerm)
  }, [statusFilter, searchTerm])

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "default"
      case "COMPLETED":
        return "secondary"
      case "PAUSED":
        return "outline"
      case "DRAFT":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "PAUSED":
        return <Pause className="h-4 w-4" />
      case "DRAFT":
        return <FileText className="h-4 w-4" />
      default:
        return null
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchPosts(newPage)
    }
  }

  if (authLoading) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Job Posts
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your posted jobs and track their performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val)
                  setPage(0)
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <l-ring
                size="40"
                stroke="5"
                bg-opacity="0"
                speed="2"
                color={CURRENT_THEME === "dark" ? "white" : "black"}
              ></l-ring>
            </div>
          ) : jobPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobPosts.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {job.jobTitle}
                            </h3>
                            <Badge
                              variant={getStatusColor(job.status)}
                              className="flex items-center space-x-1"
                            >
                              {getStatusIcon(job.status)}
                              <span>{job.status}</span>
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {job.clientDto?.companyName || "No category"}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {job.jobDescription}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.requiredSkills?.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {job.budget
                                  ? job.budget.toLocaleString()
                                  : "N/A"}
                                {job.budgetType === "hourly" && "/hr"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{job.bidDto?.length || 0} proposals</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>0 views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Posted:{" "}
                                {format(new Date(job.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                Deadline:{" "}
                                {format(
                                  new Date(job.projectEndTime),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages} ({totalJobs} total jobs)
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
