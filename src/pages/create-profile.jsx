"use client";

import React, { useState, useEffect } from "react";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import MouseMoveEffect from "@/components/mouse-move-effect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Briefcase,
  DollarSign,
  Upload,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
];

const experienceLevels = [
  { value: "ENTRY_LEVEL", label: "Entry Level (0-2 years)" },
  { value: "INTERMEDIATE", label: "Intermediate (2-5 years)" },
  { value: "EXPERT", label: "Expert (5+ years)" },
];

export default function CreateProfile() {
  //   const router = useRouter()
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",

    // Freelancer specific
    title: "",
    hourlyRate: "",
    experience: "",
    skills: [],
    portfolio: "",

    // Client specific
    doesHaveCompany: false,
    companyName: "",
    website: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  useEffect(() => {
    if (!role || (role !== "freelancer" && role !== "client")) {
      navigate("/profile-setup");
    }
  }, [role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating profile:", {
      ...formData,
      skills: selectedSkills,
      role,
    });
    // In a real app, this would create the profile and redirect to dashboard
    navigate("/dashboard");
  };

  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setCustomSkill("");
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-background">
      <MouseMoveEffect />
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
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
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {formData.firstName[0]}
                      {formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                {/* Role-specific fields */}
                {role === "freelancer" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Developer, UI/UX Designer"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="hourlyRate"
                            type="number"
                            placeholder="25"
                            className="pl-10"
                            value={formData.hourlyRate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                hourlyRate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level *</Label>
                        <Select
                          value={formData.experience}
                          onValueChange={(value) =>
                            setFormData({ ...formData, experience: value })
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
                    </div>

                    {/* Skills */}
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
                                e.preventDefault();
                                addSkill(customSkill);
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

                        {/* Skill suggestions */}
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

                        {/* Selected skills */}
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
                        value={formData.portfolio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            portfolio: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="grid gap-4">
                      <div className="flex gap-3 items-center">
                        <Label>Have a Company</Label>
                        <Checkbox
                          value={formData.doesHaveCompany}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => {
                              return {
                                ...prev,
                                doesHaveCompany: checked === true,
                              };
                            })
                          }
                        />
                      </div>
                    </div>

                    {formData.doesHaveCompany && (
                      <>
                        <div className="space-y-2">
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
                            required
                          />
                        </div>

                        <div className="space-y-2">
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
                      </>
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
                    required
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
  );
}
