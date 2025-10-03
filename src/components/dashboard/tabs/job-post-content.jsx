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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { userRoles } from "@/utils/constants"
import {
  AlertCircle,
  Archive,
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
  Trash2,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function JobPostsContent({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJobs, setSelectedJobs] = useState([])
  const [selectedTab, setSelectedTab] = useState("all")
  const [jobPosts, setJobPosts] = useState([])
  const { authLoading } = useAuth()

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/api/dashboard/get-post")
        console.log("Job Posts:", response.data.content)
        setJobPosts(
          Array.isArray(response.data.content) ? response.data.content : []
        )
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  }, [])

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
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
    switch (status.toUpperCase()) {
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

  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch = job.jobTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || job.status.toLowerCase() === statusFilter
    const matchesTab =
      selectedTab === "all" || job.status.toLowerCase() === selectedTab
    return matchesSearch && matchesStatus && matchesTab
  })

  const getJobStats = () => {
    const total = jobPosts.length
    const active = jobPosts.filter((job) => job.status === "ACTIVE").length
    const completed = jobPosts.filter(
      (job) => job.status === "COMPLETED"
    ).length
    const drafts = jobPosts.filter((job) => job.status === "DRAFT").length
    const totalProposals = jobPosts.reduce(
      (sum, job) => sum + (job.bidDto?.length || 0),
      0
    )
    const totalViews = 0 // not provided in backend
    return { total, active, completed, drafts, totalProposals, totalViews }
  }

  const stats = getJobStats()

  const toggleJobSelection = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    )
  }

  const selectAllJobs = () => {
    setSelectedJobs(filteredJobs.map((job) => job.id))
  }

  const clearSelection = () => {
    setSelectedJobs([])
  }

  if (authLoading) {
    return null
  }

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

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProposals}</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="hidden"
            >
              <TabsList>
                <TabsTrigger value="all">All ({jobPosts.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Active ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="draft">Drafts ({stats.drafts})</TabsTrigger>
              </TabsList>
            </Tabs>

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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedJobs.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedJobs.length} job{selectedJobs.length > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="bg-transparent"
                >
                  Clear
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  selectedJobs.includes(job.id) ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedJobs.includes(job.id)}
                    onCheckedChange={() => toggleJobSelection(job.id)}
                    className="mt-1"
                  />

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
                              {job.budget ? job.budget.toLocaleString() : "N/A"}
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
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Deadline:{" "}
                              {new Date(
                                job.projectEndTime
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash className="h-3 w-3" />
                        </Button>
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Job
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Job
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't posted any jobs yet"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Your First Job
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
