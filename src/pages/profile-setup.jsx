import { apiClient } from "@/api/AxiosServiceApi"
import FullscreenLoader from "@/components/FullScreenLoader"
import MouseMoveEffect from "@/components/mouse-move-effect"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Plus,
  User,
  UserCircle,
} from "lucide-react"

import { useEffect, useMemo, useState } from "react"

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

export default function ProfileSetup() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [existingFreelancer, setExistingFreelancer] = useState(null)
  const [existingClient, setExistingClient] = useState(null)
  const [existingUser, setExistingUser] = useState(null)

  const [loading, setLoading] = useState(true)

  // Safe initials
  const userInitials = useMemo(() => {
    if (!existingUser?.username) return "U"

    return existingUser.username
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
  }, [existingUser])

  // Redirect if token missing
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true })
    }
  }, [token, navigate])

  // Fetch profiles
  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await apiClient.get("/api/check-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const { freelancer, client, user } = response.data

        setExistingFreelancer(freelancer || null)
        setExistingClient(client || null)
        setExistingUser(user || null)
      } catch (error) {
        console.error("Failed to fetch profiles:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      localStorage.setItem("token", token)
      fetchProfiles()
    }
  }, [token])

  // Continue existing role
  const handleContinueAsExisting = async (role) => {
    setLoading(true)

    try {
      const response = await apiClient.post(
        `/api/update-role?role=${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { status, data: newToken } = response

      if (status === 200) {
        localStorage.setItem("token", newToken)
        navigate("/dashboard", { replace: true })
      }
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create profile
  const handleCreateNewProfile = (role) => {
    navigate(`/create-profile?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <FullscreenLoader show={loading} />

      <MouseMoveEffect />

      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: -1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />

        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to FreelanceGo
            </h1>

            <p className="text-muted-foreground text-lg">
              Choose how you'd like to continue with your account
            </p>
          </div>

          {/* Existing Profiles */}
          {(existingFreelancer || existingClient) && (
            <div className="mb-12">

              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-foreground" />
                Existing Profiles
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Freelancer */}
                {existingFreelancer && (
                  <Card className="relative overflow-hidden border">

                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Active
                      </Badge>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">

                        <Avatar className="h-16 w-16">

                          <AvatarImage
                            src={
                              existingUser?.imageData
                                ? `data:image/jpeg;base64,${existingUser.imageData}`
                                : "/placeholder.svg"
                            }
                            alt={existingUser?.username || "User"}
                          />

                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {userInitials}
                          </AvatarFallback>

                        </Avatar>

                        <div className="flex-1">

                          <CardTitle className="text-xl mb-1 capitalize">
                            {existingUser?.username || "User"}
                          </CardTitle>

                          <CardDescription className="text-sm font-medium text-muted-foreground">
                            {existingFreelancer?.designation || "Freelancer"}
                          </CardDescription>

                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">

                      <div className="text-center p-3 bg-muted/50 mb-4 rounded-lg">

                        <div className="text-2xl font-bold text-primary">
                          {existingFreelancer?.joinedDate
                            ? new Date(existingFreelancer.joinedDate).getFullYear()
                            : new Date().getFullYear()}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Member Since
                        </div>

                      </div>

                      <div className="mb-4">

                        <div className="text-sm font-medium mb-2">
                          Top Skills
                        </div>

                        <div className="flex flex-wrap gap-2">

                          {existingFreelancer?.skills?.length > 0 ? (
                            <>
                              {existingFreelancer.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}

                              {existingFreelancer.skills.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  +{existingFreelancer.skills.length - 3} more
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline">
                              No Skills Added
                            </Badge>
                          )}

                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          handleContinueAsExisting("FREELANCER")
                        }
                        className="w-full"
                        size="lg"
                      >
                        Continue as Freelancer

                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                    </CardContent>
                  </Card>
                )}

                {/* Client */}
                {existingClient && (
                  <Card className="relative overflow-hidden border flex flex-col">

                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        Active
                      </Badge>
                    </div>

                    <CardHeader className="pb-4">

                      <div className="flex items-start gap-4">

                        <Avatar className="h-16 w-16">

                          <AvatarImage
                            src={
                              existingUser?.imageData
                                ? `data:image/jpeg;base64,${existingUser.imageData}`
                                : "/placeholder.svg"
                            }
                            alt={existingUser?.username || "User"}
                          />

                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {userInitials}
                          </AvatarFallback>

                        </Avatar>

                        <div className="flex-1">

                          <CardTitle className="text-xl mb-1 capitalize">
                            {existingUser?.username || "User"}
                          </CardTitle>

                          <CardDescription className="text-sm font-medium text-muted-foreground">
                            Client Account
                          </CardDescription>

                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex-1 flex flex-col">

                      <div className="grid grid-cols-2 gap-4 mb-4 flex-1">

                        <div className="text-center p-3 bg-muted rounded-lg">

                          <div className="text-2xl font-bold text-primary">
                            {existingClient?.projectsPosted || 0}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Projects Posted
                          </div>

                        </div>

                        <div className="text-center p-3 bg-muted rounded-lg">

                          <div className="text-2xl font-bold text-primary">
                            {existingClient?.freelancersHired || 0}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Freelancers Hired
                          </div>

                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          handleContinueAsExisting("CLIENT")
                        }
                        className="w-full"
                        size="lg"
                      >
                        Continue as Client

                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* NEW SECTION ADDED FOR NEW USERS */}
          {(!existingFreelancer || !existingClient) && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="h-6 w-6 text-foreground" />
                {existingFreelancer || existingClient ? "Add Another Profile" : "Create Your Profile"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Create Freelancer Card */}
                {!existingFreelancer && (
                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <Briefcase className="h-10 w-10 text-primary mb-2" />
                      <CardTitle>I am a Freelancer</CardTitle>
                      <CardDescription>
                        Find projects, submit proposals, and earn money doing what you love.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleCreateNewProfile("freelancer")}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Freelancer Profile
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Create Client Card */}
                {!existingClient && (
                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <User className="h-10 w-10 text-blue-500 mb-2" />
                      <CardTitle>I am a Client</CardTitle>
                      <CardDescription>
                        Post jobs, hire top talent, and manage your freelance projects.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleCreateNewProfile("client")}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Client Profile
                      </Button>
                    </CardContent>
                  </Card>
                )}

              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Need help getting started?{" "}
              <Link
                to="/contact-us"
                className="text-primary hover:underline"
              >
                Contact our support team
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}