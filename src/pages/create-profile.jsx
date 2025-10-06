"use client"

import { apiClient } from "@/api/AxiosServiceApi"
import FullScreenLoader from "@/components/FullScreenLoader"
import MouseMoveEffect from "@/components/mouse-move-effect"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { ArrowLeft, ArrowRight, Briefcase, Plus, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const skillSuggestions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Vue.js",
  "Angular",
  "PHP",
  "Laravel",
  "WordPress",
  "Shopify",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "SEO",
  "Digital Marketing",
  "Data Analysis",
  "Machine Learning",
]

const experienceLevels = [
  { value: "ENTRY_LEVEL", label: "Entry Level (0-2 years)" },
  { value: "INTERMEDIATE", label: "Intermediate (2-5 years)" },
  { value: "EXPERT", label: "Expert (5+ years)" },
]

export default function CreateProfile() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get("role")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { token, setToken } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
    designation: "",
    hourlyRate: "",
    experienceLevel: "",
    skills: [],
    portfolioUrl: "",
    doesHaveCompany: true,
    companyName: "",
    website: "",
  })

  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkill, setCustomSkill] = useState("")

  useEffect(() => {
    if (!role || (role !== "freelancer" && role !== "client")) {
      navigate("/profile-setup")
    }
  }, [role, navigate])

  // 🔍 Validation based on role
  const validateForm = () => {
    if (!formData.phone.trim()) return toast.error("Phone number is required")

    const bioLength = formData.bio.trim().length
    if (!formData.bio.trim()) return toast.error("Bio is required")
    if (bioLength < 50) return toast.error("Bio must be at least 50 characters")
    if (bioLength > 500) return toast.error("Bio cannot exceed 500 characters")

    if (role === "freelancer") {
      if (!formData.designation.trim())
        return toast.error("Professional title is required")
      if (!formData.experienceLevel)
        return toast.error("Experience level is required")
      if (selectedSkills.length === 0)
        return toast.error("Please add at least one skill")
    }

    if (role === "client") {
      if (formData.doesHaveCompany && !formData.companyName.trim())
        return toast.error("Company name is required")
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm() !== true) return

    setLoading(true)
    try {
      const response = await apiClient.post(
        `/api/create-profile/${role}`,
        {
          ...formData,
          skills: selectedSkills,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )

      const { status, data } = response
      if (status !== 200) {
        toast.error("Failed to create profile")
        return
      }

      const { token: newToken } = data
      if (!newToken) {
        console.error("Token not received from backend")
        return
      }

      localStorage.setItem("token", newToken)
      setToken(newToken)
      toast.success("Profile created successfully")
      setTimeout(() => navigate("/dashboard"), 2000)
    } catch (error) {
      console.error("Failed to create profile:", error)
      toast.error("Something went wrong while creating profile")
    } finally {
      setLoading(false)
    }
  }

  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setCustomSkill("")
  }

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  if (!role) return null

  return (
    <div className="min-h-screen bg-background">
      <FullScreenLoader show={loading} />
      <MouseMoveEffect />
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                {role === "freelancer" ? (
                  <User className="h-8 w-8 text-primary" />
                ) : (
                  <Briefcase className="h-8 w-8 text-primary" />
                )}
                Create {role === "freelancer" ? "Freelancer" : "Client"} Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                {role === "freelancer"
                  ? "Set up your freelancer profile to start bidding on projects"
                  : "Set up your client profile to start posting projects"}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Tell us about yourself to create your {role} profile
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone">Enter Phone Number</Label>
                  <Input
                    id="phone"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    value={formData.phone}
                  />
                </div>

                {role === "freelancer" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Developer"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level *</Label>
                      <Select
                        value={formData.experienceLevel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, experienceLevel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Skills *</Label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSkill(customSkill)
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addSkill(customSkill)}
                            disabled={!customSkill}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {skillSuggestions
                            .filter((skill) => !selectedSkills.includes(skill))
                            .slice(0, 8)
                            .map((skill) => (
                              <Button
                                key={skill}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addSkill(skill)}
                                className="text-xs"
                              >
                                {skill}
                              </Button>
                            ))}
                        </div>

                        {selectedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="default"
                                className="gap-1"
                              >
                                {skill}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeSkill(skill)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input
                        id="portfolio"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            portfolioUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="grid gap-4 px-3 py-2 bg-muted/40 rounded-md mb-3">
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          id="has-a-company"
                          checked={formData.doesHaveCompany}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              doesHaveCompany: checked === true,
                            }))
                          }
                        />
                        <Label
                          htmlFor="has-a-company"
                          className="cursor-pointer"
                        >
                          Have a Company
                        </Label>
                      </div>
                    </div>

                    {formData.doesHaveCompany && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                companyName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="website">Company Website</Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://yourcompany.com"
                            value={formData.website}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                website: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder={
                      role === "freelancer"
                        ? "Tell clients about your experience, skills, and what makes you unique..."
                        : "Tell freelancers about your company and the types of projects you work on..."
                    }
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
