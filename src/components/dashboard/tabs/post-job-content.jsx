import { apiClient } from "@/api/AxiosServiceApi"
import FullScreenLoader from "@/components/FullScreenLoader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { userRoles } from "@/utils/constants"
import { format, formatISO, isBefore, startOfToday } from "date-fns"
import {
  AlertCircle,
  Briefcase,
  CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Send,
  Settings,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const jobCategories = [
  "Web Development",
  "Mobile Development",
  "Design & Creative",
  "Writing & Translation",
  "Digital Marketing",
  "Data Science",
  "DevOps & Cloud",
  "AI & Machine Learning",
]

const skillSuggestions = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Java",
  "Figma",
  "Adobe Creative Suite",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "SEO",
  "Social Media Marketing",
  "Google Ads",
  "Data Analysis",
  "Machine Learning",
  "SQL",
  "AWS",
  "Docker",
]

export default function PostJobContent({ userRole }) {
  const [currentTab, setCurrentTab] = useState("basics")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkill, setCustomSkill] = useState("")
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [jobData, setJobData] = useState({
    jobTitle: "",
    category: "",
    experienceLevel: "",
    jobDescription: "",
    requirement: "",
    timeline: "",
    budgetType: "fixed",
    budget: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    projectSize: "",
    screeningQuestions: [""],
    visibility: "public",
    featuredListing: false,
    projectStartTime: null,
    projectEndTime: null,
  })

  if (userRole === userRoles.FREELANCER) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Switch to Client Role</CardTitle>
            <CardDescription>
              You need to be in client mode to post jobs. Switch your role to
              access this feature.
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

  // Skill Management
  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }
  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }
  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim())
      setCustomSkill("")
    }
  }

  // Screening Questions
  const addScreeningQuestion = () => {
    setJobData({
      ...jobData,
      screeningQuestions: [...jobData.screeningQuestions, ""],
    })
  }
  const updateScreeningQuestion = (index, value) => {
    const updated = [...jobData.screeningQuestions]
    updated[index] = value
    setJobData({ ...jobData, screeningQuestions: updated })
  }
  const removeScreeningQuestion = (index) => {
    const updated = jobData.screeningQuestions.filter((_, i) => i !== index)
    setJobData({ ...jobData, screeningQuestions: updated })
  }

  // Validation
  const validateFields = () => {
    if (!jobData.jobTitle.trim()) {
      toast.error("Job title is required")
      setCurrentTab("basics")
      return false
    }
    if (!jobData.category) {
      toast.error("Category is required")
      setCurrentTab("basics")
      return false
    }
    if (!jobData.experienceLevel) {
      toast.error("Experience level is required")
      setCurrentTab("basics")
      return false
    }
    if (selectedSkills.length === 0) {
      toast.error("At least one skill is required")
      setCurrentTab("basics")
      return false
    }
    if (!jobData.jobDescription.trim()) {
      toast.error("Job description is required")
      setCurrentTab("details")
      return false
    }
    if (!jobData.requirement.trim()) {
      toast.error("Job requirements are required")
      setCurrentTab("details")
      return false
    }
    if (!jobData.budget) {
      toast.error("Project budget is required")
      setCurrentTab("details")
      return false
    }
    if (!jobData.projectStartTime) {
      toast.error("Project start date is required")
      setCurrentTab("details")
      return false
    }
    if (!jobData.projectEndTime) {
      toast.error("Project end date is required")
      setCurrentTab("details")
      return false
    }
    const today = startOfToday()
    if (isBefore(new Date(jobData.projectStartTime), today)) {
      toast.error("Project start date cannot be in the past")
      setCurrentTab("details")
      return false
    }
    if (isBefore(new Date(jobData.projectEndTime), today)) {
      toast.error("Project end date cannot be in the past")
      setCurrentTab("details")
      return false
    }
    if (
      isBefore(
        new Date(jobData.projectEndTime),
        new Date(jobData.projectStartTime)
      )
    ) {
      toast.error("End date cannot be before start date")
      setCurrentTab("details")
      return false
    }
    return true
  }

  const handlePostJob = async () => {
    if (!validateFields()) return
    setLoading(true)
    try {
      const response = await apiClient.post(
        "/api/dashboard/create-post",
        {
          ...jobData,
          requiredSkills: selectedSkills,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      if (response.status === 200) {
        toast.success("Job posted successfully!")
        navigate("/dashboard/job-posts")
      }
    } catch (error) {
      console.error("Error posting job:", error)
      toast.error("Something went wrong while posting the job")
    } finally {
      setLoading(false)
    }
  }

  const isTabComplete = (tab) => {
    switch (tab) {
      case "basics":
        return (
          jobData.jobTitle &&
          jobData.category &&
          jobData.experienceLevel &&
          selectedSkills.length > 0
        )
      case "details":
        return (
          jobData.jobDescription &&
          jobData.requirement &&
          jobData.budget &&
          jobData.projectStartTime &&
          jobData.projectEndTime
        )
      case "review":
        return true
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      <FullScreenLoader show={loading} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Post a New Job
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Find the perfect freelancer for your project
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Job Details</CardTitle>
          <CardDescription>
            Provide comprehensive information to attract the right freelancers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="basics"
                className="flex items-center space-x-2"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Basics</span>
                {isTabComplete("basics") && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
                {isTabComplete("details") && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
            </TabsList>

            {/* BASICS TAB */}
            <TabsContent value="basics" className="space-y-6 mt-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Build a responsive e-commerce website"
                  value={jobData.jobTitle}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobTitle: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={jobData.category}
                  onValueChange={(value) =>
                    setJobData({ ...jobData, category: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experience-level">Experience Level *</Label>
                <Select
                  value={jobData.experienceLevel}
                  onValueChange={(value) =>
                    setJobData({ ...jobData, experienceLevel: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="w-1/2" align="end">
                    <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <div>
                <Label>Required Skills *</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter((skill) => !selectedSkills.includes(skill))
                      .slice(0, 10)
                      .map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(skill)}
                          className="text-xs bg-transparent"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {skill}
                        </Button>
                      ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                    />
                    <Button
                      onClick={addCustomSkill}
                      variant="outline"
                      className="bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* DETAILS TAB */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail"
                    value={jobData.jobDescription}
                    onChange={(e) =>
                      setJobData({ ...jobData, jobDescription: e.target.value })
                    }
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements"
                    value={jobData.requirement}
                    onChange={(e) =>
                      setJobData({ ...jobData, requirement: e.target.value })
                    }
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="budget-amount">Project Budget *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="budget-amount"
                      type="number"
                      placeholder="5000"
                      value={jobData.budget}
                      onChange={(e) =>
                        setJobData({ ...jobData, budget: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-2">
                  <Label htmlFor="projectStartTime">Project Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal mt-1 ${
                          !jobData.projectStartTime && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {jobData.projectStartTime
                          ? format(new Date(jobData.projectStartTime), "PPP")
                          : "Pick a start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          jobData.projectStartTime
                            ? new Date(jobData.projectStartTime)
                            : undefined
                        }
                        onSelect={(date) =>
                          setJobData({
                            ...jobData,
                            projectStartTime: date ? formatISO(date) : null,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectEndTime">Project End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal mt-1 ${
                          !jobData.projectEndTime && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {jobData.projectEndTime
                          ? format(new Date(jobData.projectEndTime), "PPP")
                          : "Pick an end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          jobData.projectEndTime
                            ? new Date(jobData.projectEndTime)
                            : undefined
                        }
                        onSelect={(date) =>
                          setJobData({
                            ...jobData,
                            projectEndTime: date ? formatISO(date) : null,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Screening Questions */}
                <div>
                  <Label>Screening Questions (Optional)</Label>
                  <div className="mt-2 space-y-3">
                    {jobData.screeningQuestions.map((question, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder={`Question ${index + 1}`}
                          value={question}
                          onChange={(e) =>
                            updateScreeningQuestion(index, e.target.value)
                          }
                        />
                        {jobData.screeningQuestions.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeScreeningQuestion(index)}
                            className="bg-transparent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addScreeningQuestion}
                      className="bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* REVIEW TAB */}
            <TabsContent value="review" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-xl">
                      {jobData.jobTitle || "Job Title"}
                    </h3>
                    <p className="text-muted-foreground">
                      {jobData.category || "Category"} -{" "}
                      {jobData.experienceLevel || "Experience"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {jobData.jobDescription ||
                        "Project description will appear here..."}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{jobData.budget || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {jobData.projectStartTime
                          ? format(new Date(jobData.projectStartTime), "PP")
                          : "Start Date"}{" "}
                        -{" "}
                        {jobData.projectEndTime
                          ? format(new Date(jobData.projectEndTime), "PP")
                          : "End Date"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handlePostJob}>
                  <Send className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
