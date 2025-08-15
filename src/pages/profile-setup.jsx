"use client";

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import MouseMoveEffect from "@/components/mouse-move-effect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Briefcase,
  Star,
  MapPin,
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/navbar";
import FullscreenLoader from "@/components/FullScreenLoader";
import { apiClient } from "@/api/AxiosServiceApi";

// // Mock data for existing profiles
// const mockProfiles = {
//   freelancer: {
//     id: "1",
//     name: "John Doe",
//     email: "john@example.com",
//     avatar: "/placeholder.svg?height=80&width=80&text=JD",
//     role: "freelancer",
//     title: "Full Stack Developer",
//     location: "San Francisco, CA",
//     rating: 4.9,
//     completedJobs: 47,
//     joinedDate: "2023-01-15",
//     skills: ["React", "Node.js", "TypeScript", "Python"],
//     isActive: true,
//   },
//   // client: null // No client profile exists
// }

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    navigate("/");
  }

  const [existingFreelancer, setExistingFreelancer] = useState(null);
  const [existingClient, setExistingClient] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfiles() {
    try {
      const response = await apiClient.get("/api/check-role", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const { freelancer, client } = response;
      console.log(response);
      setExistingFreelancer(freelancer);
      setExistingClient(client);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    localStorage.setItem("token", token);

    fetchProfiles();
  }, []);

  const handleContinueAsExisting = (role) => {
    // In a real app, this would set the user session/context
    console.log(`Continuing as existing ${role}`);
    navigate("/dashboard?role=freelance");
  };

  const handleCreateNewProfile = (role) => {
    // In a real app, this would redirect to profile creation form
    console.log(`Creating new ${role} profile`);
    navigate(`/create-profile?role=${role}`);
  };

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
                  <Card className="relative overflow-hidden border-2 border-green-200 bg-green-50/50">
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
                              existingFreelancer.avatar || "/placeholder.svg"
                            }
                            alt={existingFreelancer.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {existingFreelancer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {existingFreelancer.name}
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-primary">
                            {existingFreelancer.title}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {existingFreelancer.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {existingFreelancer.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {existingFreelancer.completedJobs}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Jobs Completed
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {new Date(
                              existingFreelancer.joinedDate
                            ).getFullYear()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Member Since
                          </div>
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
                        onClick={() => handleContinueAsExisting("freelancer")}
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
                  <Card className="relative overflow-hidden border-2 border-blue-200 bg-blue-50/50">
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
                            src={existingClient.avatar || "/placeholder.svg"}
                            alt={existingClient.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {existingClient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {existingClient.name}
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-primary">
                            Client Account
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {existingClient.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Since{" "}
                              {new Date(
                                existingClient.joinedDate
                              ).getFullYear()}
                            </div>
                          </div>
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
                        onClick={() => handleContinueAsExisting("client")}
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
  );
}
