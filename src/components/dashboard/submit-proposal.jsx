import { apiClient } from "@/api/AxiosServiceApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContext"
import { format } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle,
  Clock,
  FileText,
  IndianRupee,
  Star,
  Upload,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import InlineLoader from "../InlineLoader"

export default function SubmitProposal() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get("jobId")

  const [currentStep, setCurrentStep] = useState(1)
  const [bidAmount, setBidAmount] = useState("")
  const [timeline, setTimeline] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [attachments, setAttachments] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [job, setJob] = useState(null)

  const [loading, setLoading] = useState(true)

  const fetchJobById = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/api/dashboard/get-post/${jobId}`)
      const { status, data } = response
      if (status === 200 && data.job) {
        const jobData = data.job
        if (jobData) {
          setJob({
            id: jobData.id,
            title: jobData.jobTitle,
            description: jobData.jobDescription,
            skills: jobData.requiredSkills,
            budget: { type: "fixed", amount: jobData.budget },
            timeline: `${format(
              new Date(jobData.projectStartTime),
              "PP"
            )} - ${format(new Date(jobData.projectEndTime), "PP")}`,
            postedDate: jobData.createdAt,
            client: {
              name: jobData.clientDto.userDto.username,
              avatar: `data:image/jpeg;base64,${jobData.clientDto.userDto.imageData}`,
              rating: 5,
              jobsPosted: 0,
              location: "",
              bio: jobData.clientDto.bio,
            },
          })
        }
      }
    } catch (error) {
      console.error("Error fetching job:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobById()
  }, [])

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const maxSize = 500 * 1024 // 500 KB in bytes
      if (file.size > maxSize) {
        toast.warning("File size exceeds 500 KB. Please select a smaller file.")
        return
      }
      setAttachments(file)
      toast.success("File uploaded successfully!")
    } else {
      toast.warning("File upload failed. Please try again.")
    }
  }

  const removeAttachment = () => {
    setAttachments(null)
    // Reset the file input
    const fileInput = document.getElementById("file-upload")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleBidSubmission = async () => {
    setIsSubmitting(true)

    const formData = new FormData()

    const bidDto = {
      jobDto: {
        id: jobId,
      },
      freelancerDto: {
        id: userId,
        experienceLevel: "ENTRY_LEVEL",
      },
      amount: bidAmount,
      timeRequired: timeline,
      coverLetter: coverLetter,
    }

    formData.append(
      "bid",
      new Blob([JSON.stringify(bidDto)], { type: "application/json" })
    )

    // Only append file if it exists
    if (attachments) {
      formData.append("file", attachments)
    }

    try {
      const response = await apiClient.post("/api/create-bid", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(response)
      if (response.status === 200) {
        toast.success("Proposal submitted successfully!")
        navigate("/dashboard/job-posts")
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting proposal:", error)
      toast.error("Something went wrong while submitting the proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    await handleBidSubmission()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatBudget = (budget) => {
    if (budget.type === "hourly") {
      return `$${budget.amount}/hr`
    }
    return `$${budget.amount.toLocaleString()}`
  }

  const getStepProgress = () => {
    return (currentStep / 3) * 100
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return bidAmount && timeline
      case 2:
        return coverLetter.length >= 100
      case 3:
        return true
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sm:px-4 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Proposal Submitted Successfully!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your proposal for "{job.title}" has been sent to the client.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${bidAmount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your Bid
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{timeline}</div>
                    <div className="text-sm text-muted-foreground">
                      Timeline
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {attachments ? 1 : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Attachments
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          1
                        </span>
                      </div>
                      <h4 className="font-semibold">Client Review</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The client will review your proposal along with others and
                      may reach out with questions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          2
                        </span>
                      </div>
                      <h4 className="font-semibold">Interview</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If selected, you'll be invited for an interview to discuss
                      the project in detail.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold">Get Hired</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If chosen, you'll receive a contract and can start working
                      on the project.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={() => navigate("/dashboard/browse-jobs")}
                variant="outline"
                className="bg-transparent"
              >
                Browse More Jobs
              </Button>
              <Button onClick={() => navigate("/dashboard/proposals")}>
                View My Proposals
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <InlineLoader />
          </div>
        ) : job ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Submit Proposal
                  </h1>
                  <p className="text-muted-foreground">
                    Step {currentStep} of 3
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <Progress value={getStepProgress()} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span
                    className={
                      currentStep >= 1 ? "text-primary font-medium" : ""
                    }
                  >
                    Proposal Details
                  </span>
                  <span
                    className={
                      currentStep >= 2 ? "text-primary font-medium" : ""
                    }
                  >
                    Cover Letter
                  </span>
                  <span
                    className={
                      currentStep >= 3 ? "text-primary font-medium" : ""
                    }
                  >
                    Review & Submit
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <Card>
                <CardContent className="p-6">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Proposal Details
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Set your bid amount and timeline for this project.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Your Bid Amount
                          </label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              type="number"
                              placeholder="1000"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Client's budget: {formatBudget(job.budget)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Timeline
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="8 weeks"
                              value={timeline}
                              onChange={(e) => setTimeline(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Client's timeline: {job.timeline}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-500 mb-1">
                              Bidding Tips
                            </h4>
                            <ul
                              className="text-sm text-blue-500 space-y-1"
                              style={{ listStyle: "disc" }}
                            >
                              <li>
                                Research similar projects to set competitive
                                pricing
                              </li>
                              <li>
                                Consider your experience level and project
                                complexity
                              </li>
                              <li>
                                Be realistic with timelines to build trust
                              </li>
                              <li>Factor in revisions and testing time</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Cover Letter & Attachments
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Write a compelling cover letter and attach relevant
                          files.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Cover Letter
                        </label>
                        <Textarea
                          placeholder="Dear Client,

I'm excited about your project and believe I'm the perfect fit for your needs. Here's why:

• [Your relevant experience]
• [Specific skills that match the requirements]
• [Examples of similar work you've done]
• [Your approach to this project]

I'd love to discuss your requirements in more detail. Looking forward to working with you!

Best regards,
[Your name]"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows={12}
                          className="resize-none"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{coverLetter.length} characters</span>
                          <span
                            className={
                              coverLetter.length < 100
                                ? "text-red-500"
                                : "text-green-600"
                            }
                          >
                            {coverLetter.length < 100
                              ? "Minimum 100 characters required"
                              : "Good length"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium">
                          Attachment (Optional)
                        </label>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop a file here, or click to browse
                          </p>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                            className="bg-transparent"
                          >
                            Choose File
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
                            (Max 500kb)
                          </p>
                        </div>

                        {attachments && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Attached File
                            </h4>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {attachments.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(attachments.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={removeAttachment}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Review Your Proposal
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Please review your proposal before submitting.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${bidAmount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Your Bid
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{timeline}</div>
                          <div className="text-sm text-muted-foreground">
                            Timeline
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Cover Letter</h4>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-line">
                            {coverLetter}
                          </p>
                        </div>
                      </div>

                      {attachments && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Attachment (1)</h4>
                          <div className="flex items-center space-x-3 p-2 border rounded">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{attachments.name}</span>
                          </div>
                        </div>
                      )}

                      <div className="border bg-muted rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-primary mb-1">
                              Before You Submit
                            </h4>
                            <ul className="text-sm text-primary space-y-1">
                              <li>
                                • Double-check your bid amount and timeline
                              </li>
                              <li>
                                • Ensure your cover letter addresses the
                                client's needs
                              </li>
                              <li>
                                • Verify all attachments are relevant and
                                professional
                              </li>
                              <li>
                                • Remember: you can't edit your proposal after
                                submission
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentStep === 1}
                      className="bg-transparent"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        disabled={!canProceedToNext()}
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canProceedToNext()}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Proposal"}
                        <Check className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Job Details */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-tight line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    <div className="grid gap-4 text-center">
                      <div className="bg-muted/50 p-2 rounded-md">
                        <div className="text-lg font-bold text-green-600">
                          {formatBudget(job.budget)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Budget
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="font-bold text-base">
                          {job.timeline}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Timeline
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Required Skills</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm p-3 py-2 justify-center bg-muted/20 hover:bg-muted/50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Client Information</h4>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger className="w-full" asChild>
                            <div
                              className="flex items-start space-x-3 p-2 border cursor-pointer bg-muted/20 rounded-md hover:bg-muted/50"
                              tabIndex={0}
                              role="button"
                              onClick={() => {
                                navigate(
                                  `/dashboard/client/profile/${job.client.id}`
                                )
                              }}
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={job.client.avatar || "/placeholder.svg"}
                                  alt={job.client.name}
                                />
                                <AvatarFallback>
                                  {job.client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex gap-2">
                                  <h5 className="font-semibold">
                                    {job.client.name}
                                  </h5>
                                  <div className="flex items-center space-x-1 text-xs bg-muted rounded-md px-3">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{job.client.rating}</span>
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Briefcase className="h-3 w-3" />
                                    <span>
                                      {job.client.jobsPosted} jobs posted
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-foreground text-background"
                            variant="outline"
                          >
                            <p>View Client's Profile</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Posted:</span>
                        <span>{formatDate(job.postedDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-red-500 font-bold text-3xl">Job not found</h1>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} size="sm">
                Reload Page
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
