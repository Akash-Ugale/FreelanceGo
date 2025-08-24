import { apiClient } from "@/api/AxiosServiceApi"
import FullscreenLoader from "@/components/FullScreenLoader"
import MouseMoveEffect from "@/components/mouse-move-effect"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, Briefcase, CheckCircle, Plus, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  if (!token) {
    navigate("/")
  }

  const [existingFreelancer, setExistingFreelancer] = useState(null)
  const [existingClient, setExistingClient] = useState(null)
  const [existingUser, setExistingUser] = useState(null)

  const [loading, setLoading] = useState(true)

  async function fetchProfiles() {
    try {
      const response = await apiClient.get("/api/check-role", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      const {
        data: { freelancer, client, user },
      } = response
      console.log(response)
      setExistingFreelancer(freelancer)
      setExistingClient(client)
      setExistingUser(user)
    } catch (error) {
      console.error("Failed to fetch profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem("token", token)
    fetchProfiles()
  }, [])

  const handleContinueAsExisting = async (role) => {
    setLoading(true)
    try {
      const response = await apiClient.post(
        `/api/update-role?role=${role}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      console.log(response)
      const {
        status,
        data: { token: newToken },
      } = response
      if (status === 200) {
        localStorage.setItem("token", newToken)
        setTimeout(() => {
          navigate("/dashboard", { replace: true })
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to check role:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNewProfile = (role) => {
    navigate(`/create-profile?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <FullscreenLoader show={loading} />
      <MouseMoveEffect />

      {/* Background gradients */}
      <div
        className="pointer-events-none fixed inset-0 "
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
            <h1 className="text-3xl font-bold mb-4">Welcome to FreelanceGo</h1>
            <p className="text-muted-foreground text-lg">
              Choose how you'd like to continue with your account
            </p>
          </div>

          {/* Existing Profiles Section */}
          {(existingFreelancer || existingClient) && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Your Existing Profiles
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
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
                              `data:image/jpeg;base64,${existingUser.imageData}` ||
                              "/placeholder.svg"
                            }
                            alt={existingUser.username}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {existingUser.username
                              ?.split(" ")
                              ?.map((n) => n[0])
                              ?.join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {existingUser.username}
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-primary">
                            {existingFreelancer?.designation}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="text-center p-3 bg-muted/50 mb-2 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {new Date(
                            existingFreelancer?.joinedDate || Date.now()
                          ).getFullYear()}
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
                          {existingFreelancer.skills
                            .slice(0, 3)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {existingFreelancer.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{existingFreelancer.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleContinueAsExisting("FREELANCER")}
                        className="w-full"
                        size="lg"
                      >
                        Continue as Freelancer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {existingClient && (
                  <Card className="relative overflow-hidden border">
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
                              `data:image/jpeg;base64,${existingUser.imageData}` ||
                              "/placeholder.svg"
                            }
                            alt={existingUser.username}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {existingUser.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {existingUser.username}
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-primary">
                            Client Account
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {existingClient.projectsPosted}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Projects Posted
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {existingClient.freelancersHired}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Freelancers Hired
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleContinueAsExisting("CLIENT")}
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

          {/* Create New Profile Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" />
              {existingFreelancer || existingClient
                ? "Create Additional Profile"
                : "Create Your Profile"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Freelancer Option */}
              {!existingFreelancer && (
                <Card className="cursor-pointer transition-all duration-500 hover:shadow-lg border-2 hover:border-primary/50">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">
                      Join as Freelancer
                    </CardTitle>
                    <CardDescription className="text-base">
                      Offer your skills and work on exciting projects
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Browse and bid on projects
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Showcase your portfolio
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Get paid securely
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Build your reputation
                      </li>
                    </ul>

                    <Button
                      onClick={() => handleCreateNewProfile("freelancer")}
                      className="w-full"
                      size="lg"
                    >
                      Create Freelancer Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Client Option */}
              {!existingClient && (
                <Card className="cursor-pointer transition-all duration-500 hover:shadow-lg border-2 hover:border-primary/50">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Join as Client</CardTitle>
                    <CardDescription className="text-base">
                      Hire talented freelancers for your projects
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Post projects and get proposals
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Access top talent worldwide
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Secure payment protection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        24/7 customer support
                      </li>
                    </ul>

                    <Button
                      onClick={() => handleCreateNewProfile("client")}
                      className="w-full"
                      size="lg"
                    >
                      Create Client Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Need help getting started?{" "}
              <Link href="/contact-us" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
