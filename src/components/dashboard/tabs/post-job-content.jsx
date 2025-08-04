"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Plus,
  X,
  Save,
  Eye,
  Send,
  AlertCircle,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  FileText,
  Settings,
} from "lucide-react"



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
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    description: "",
    requirements: "",
    timeline: "",
    budgetType: "fixed",
    budgetAmount: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    experienceLevel: "",
    projectSize: "",
    screeningQuestions: [""],
    visibility: "public",
    featuredListing: false,
  })

  if (userRole === "freelancer") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Switch to Client Role</CardTitle>
            <CardDescription>
              You need to be in client mode to post jobs. Switch your role to access this feature.
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

  const isTabComplete = (tab) => {
    switch (tab) {
      case "basics":
        return jobData.title && jobData.category && selectedSkills.length > 0
      case "details":
        return jobData.description && jobData.requirements && jobData.timeline
      case "budget":
        return jobData.budgetType === "fixed" ? jobData.budgetAmount : jobData.hourlyRateMin && jobData.hourlyRateMax
      case "review":
        return true
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground text-sm md:text-base">Find the perfect freelancer for your project</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Job Posting Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Job Details</CardTitle>
          <CardDescription>Provide comprehensive information to attract the right freelancers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics" className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Basics</span>
                {isTabComplete("basics") && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
                {isTabComplete("details") && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
                {isTabComplete("budget") && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-title">Job Title *</Label>
                  <Input
                    id="job-title"
                    placeholder="e.g. Build a responsive e-commerce website"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={jobData.category}
                    onValueChange={(value) => setJobData({ ...jobData, category: value })}
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

                <div>
                  <Label>Required Skills *</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">
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
                      <Button onClick={addCustomSkill} variant="outline" className="bg-transparent">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience-level">Experience Level</Label>
                  <Select
                    value={jobData.experienceLevel}
                    onValueChange={(value) => setJobData({ ...jobData, experienceLevel: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail. What are you looking to accomplish?"
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements, deliverables, and expectations"
                    value={jobData.requirements}
                    onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Select
                    value={jobData.timeline}
                    onValueChange={(value) => setJobData({ ...jobData, timeline: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1-week">Less than 1 week</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-2-months">1-2 months</SelectItem>
                      <SelectItem value="2-6-months">2-6 months</SelectItem>
                      <SelectItem value="more-than-6-months">More than 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Screening Questions (Optional)</Label>
                  <div className="mt-2 space-y-3">
                    {jobData.screeningQuestions.map((question, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder={`Question ${index + 1}`}
                          value={question}
                          onChange={(e) => updateScreeningQuestion(index, e.target.value)}
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
                    <Button variant="outline" size="sm" onClick={addScreeningQuestion} className="bg-transparent">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label>Budget Type *</Label>
                  <RadioGroup
                    value={jobData.budgetType}
                    onValueChange={(value) => setJobData({ ...jobData, budgetType: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Price Project</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly Rate</Label>
                    </div>
                  </RadioGroup>
                </div>

                {jobData.budgetType === "fixed" ? (
                  <div>
                    <Label htmlFor="budget-amount">Project Budget *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="budget-amount"
                        type="number"
                        placeholder="5000"
                        value={jobData.budgetAmount}
                        onChange={(e) => setJobData({ ...jobData, budgetAmount: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourly-min">Minimum Rate *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="hourly-min"
                          type="number"
                          placeholder="25"
                          value={jobData.hourlyRateMin}
                          onChange={(e) => setJobData({ ...jobData, hourlyRateMin: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hourly-max">Maximum Rate *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="hourly-max"
                          type="number"
                          placeholder="75"
                          value={jobData.hourlyRateMax}
                          onChange={(e) => setJobData({ ...jobData, hourlyRateMax: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="project-size">Project Size</Label>
                  <Select
                    value={jobData.projectSize}
                    onValueChange={(value) => setJobData({ ...jobData, projectSize: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select project size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt;$1,000)</SelectItem>
                      <SelectItem value="medium">Medium ($1,000 - $5,000)</SelectItem>
                      <SelectItem value="large">Large ($5,000 - $10,000)</SelectItem>
                      <SelectItem value="very-large">Very Large (&gt;$10,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div>
                  <Label>Job Visibility</Label>
                  <RadioGroup
                    value={jobData.visibility}
                    onValueChange={(value) => setJobData({ ...jobData, visibility: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public - Anyone can see and apply</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private - Only invited freelancers can apply</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={jobData.featuredListing}
                    onCheckedChange={(checked) => setJobData({ ...jobData, featuredListing: checked})}
                  />
                  <Label htmlFor="featured">Featured Listing (+$25) - Get more visibility</Label>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl">{jobData.title || "Job Title"}</h3>
                      <p className="text-muted-foreground">{jobData.category || "Category"}</p>
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
                        {jobData.description || "Project description will appear here..."}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {jobData.budgetType === "fixed"
                            ? `$${jobData.budgetAmount || "0"} fixed`
                            : `$${jobData.hourlyRateMin || "0"}-$${jobData.hourlyRateMax || "0"}/hr`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{jobData.timeline || "Timeline"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" className="bg-transparent">
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Post Job
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
