"use client"

import  React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

// Mock job data
const jobData = {
  job_001: {
    id: "job_001",
    title: "Full-Stack React Developer for E-commerce Platform",
    description:
      "We're looking for an experienced full-stack developer to build a modern e-commerce platform with React, Node.js, and PostgreSQL. The project includes user authentication, payment integration, inventory management, and admin dashboard.",
    budget: { type: "fixed", amount: 5000, range: { min: 4000, max: 6000 } },
    timeline: "8-10 weeks",
    skills: ["React", "Node.js", "PostgreSQL", "Stripe API", "TypeScript", "AWS"],
    experienceLevel: "Expert",
    client: {
      name: "TechStart Inc.",
      avatar: "/placeholder.svg?height=60&width=60&text=TS",
      rating: 4.8,
      jobsPosted: 15,
      hireRate: 85,
      location: "San Francisco, CA",
      memberSince: "2022-03-15",
    },
    postedDate: "2024-01-20T10:00:00Z",
    proposalsCount: 12,
  },
}

export default function SubmitProposal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get("jobId") //  || "job_001"

  const [currentStep, setCurrentStep] = useState(1)
  const [bidAmount, setBidAmount] = useState("")
  const [timeline, setTimeline] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

//   const job = jobData[jobId as keyof typeof jobData]
const job = jobData[jobId]

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">The job you're trying to apply for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard/browse-jobs")}>Browse Jobs</Button>
        </div>
      </div>
    )
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Proposal Submitted Successfully!</h1>
              <p className="text-muted-foreground text-lg">
                Your proposal for "{job.title}" has been sent to the client.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">${bidAmount}</div>
                    <div className="text-sm text-muted-foreground">Your Bid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{timeline}</div>
                    <div className="text-sm text-muted-foreground">Timeline</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{attachments.length}</div>
                    <div className="text-sm text-muted-foreground">Attachments</div>
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
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <h4 className="font-semibold">Client Review</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The client will review your proposal along with others and may reach out with questions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <h4 className="font-semibold">Interview</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If selected, you'll be invited for an interview to discuss the project in detail.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <h4 className="font-semibold">Get Hired</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If chosen, you'll receive a contract and can start working on the project.
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
              <Button onClick={() =>navigate("/dashboard/proposals")}>View My Proposals</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm" onClick={() => navigate()} className="bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Submit Proposal</h1>
                <p className="text-muted-foreground">Step {currentStep} of 3</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={getStepProgress()} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Proposal Details</span>
                <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Cover Letter</span>
                <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Review & Submit</span>
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Proposal Details</h3>
                      <p className="text-muted-foreground mb-6">Set your bid amount and timeline for this project.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Bid Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            placeholder="5000"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Client's budget: {formatBudget(job.budget)}</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Timeline</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="8 weeks"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Client's timeline: {job.timeline}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Bidding Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Research similar projects to set competitive pricing</li>
                            <li>• Consider your experience level and project complexity</li>
                            <li>• Be realistic with timelines to build trust</li>
                            <li>• Factor in revisions and testing time</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Cover Letter & Attachments</h3>
                      <p className="text-muted-foreground mb-6">
                        Write a compelling cover letter and attach relevant files.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cover Letter</label>
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
                        <span className={coverLetter.length < 100 ? "text-red-500" : "text-green-600"}>
                          {coverLetter.length < 100 ? "Minimum 100 characters required" : "Good length"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium">Attachments (Optional)</label>

                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="bg-transparent"
                        >
                          Choose Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
                        </p>
                      </div>

                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Attached Files</h4>
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Review Your Proposal</h3>
                      <p className="text-muted-foreground mb-6">Please review your proposal before submitting.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${bidAmount}</div>
                        <div className="text-sm text-muted-foreground">Your Bid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{timeline}</div>
                        <div className="text-sm text-muted-foreground">Timeline</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Cover Letter</h4>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-line">{coverLetter}</p>
                      </div>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Attachments ({attachments.length})</h4>
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-1">Before You Submit</h4>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Double-check your bid amount and timeline</li>
                            <li>• Ensure your cover letter addresses the client's needs</li>
                            <li>• Verify all attachments are relevant and professional</li>
                            <li>• Remember: you can't edit your proposal after submission</li>
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
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceedToNext()}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !canProceedToNext()}>
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
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{formatBudget(job.budget)}</div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{job.timeline}</div>
                      <div className="text-xs text-muted-foreground">Timeline</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Client Information</h4>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job.client.avatar || "/placeholder.svg"} alt={job.client.name} />
                        <AvatarFallback>
                          {job.client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h5 className="font-semibold">{job.client.name}</h5>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{job.client.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{job.client.jobsPosted} jobs posted</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.client.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Posted:</span>
                      <span>{formatDate(job.postedDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Proposals:</span>
                      <span>{job.proposalsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
