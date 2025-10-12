"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  Send,
  Shield,
  Target,
  Calendar,
} from "lucide-react";
import { apiClient } from "@/api/AxiosServiceApi";
import { userRoles } from "@/utils/constants";

const mockprojects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description: "Building a modern e-commerce platform with React and Node.js",
    client: "TechCorp Inc.",
    freelancer: "Sarah Johnson",
    budget: 5000,
    status: "In Progress",
    progress: 65,
    startDate: "2024-01-15",
    deadline: "2024-03-15",
    milestones: [
      {
        id: 1,
        title: "Project Setup & Planning",
        amount: 1000,
        status: "Completed",
        dueDate: "2024-01-20",
      },
      {
        id: 2,
        title: "Frontend Development",
        amount: 2000,
        status: "In Progress",
        dueDate: "2024-02-15",
      },
      {
        id: 3,
        title: "Backend API Development",
        amount: 1500,
        status: "Pending",
        dueDate: "2024-02-28",
      },
      {
        id: 4,
        title: "Testing & Deployment",
        amount: 500,
        status: "Pending",
        dueDate: "2024-03-15",
      },
    ],
    escrow: {
      totalAmount: 5000,
      releasedAmount: 1000,
      pendingAmount: 2000,
      heldAmount: 2000,
    },
    messages: [
      {
        id: 1,
        sender: "client",
        message: "Great progress on the frontend! The design looks amazing.",
        timestamp: "2024-01-25 10:30 AM",
        senderName: "TechCorp Inc.",
      },
      {
        id: 2,
        sender: "freelancer",
        message:
          "Thank you! I'll have the user authentication ready by tomorrow.",
        timestamp: "2024-01-25 11:15 AM",
        senderName: "Sarah Johnson",
      },
      {
        id: 3,
        sender: "client",
        message: "Perfect. Also, can we add a wishlist feature?",
        timestamp: "2024-01-25 02:20 PM",
        senderName: "TechCorp Inc.",
      },
    ],
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Designing a fitness tracking mobile application",
    client: "FitLife Startup",
    freelancer: "Mike Chen",
    budget: 2500,
    status: "Review",
    progress: 90,
    startDate: "2024-01-10",
    deadline: "2024-02-10",
    milestones: [
      {
        id: 1,
        title: "Research & Wireframes",
        amount: 500,
        status: "Completed",
        dueDate: "2024-01-15",
      },
      {
        id: 2,
        title: "UI Design",
        amount: 1000,
        status: "Completed",
        dueDate: "2024-01-25",
      },
      {
        id: 3,
        title: "Prototyping",
        amount: 750,
        status: "In Review",
        dueDate: "2024-02-05",
      },
      {
        id: 4,
        title: "Final Delivery",
        amount: 250,
        status: "Pending",
        dueDate: "2024-02-10",
      },
    ],
    escrow: {
      totalAmount: 2500,
      releasedAmount: 1500,
      pendingAmount: 750,
      heldAmount: 250,
    },
    messages: [
      {
        id: 1,
        sender: "freelancer",
        message: "I've uploaded the latest prototypes for review.",
        timestamp: "2024-02-01 09:00 AM",
        senderName: "Mike Chen",
      },
      {
        id: 2,
        sender: "client",
        message:
          "The designs look fantastic! Just a few minor adjustments needed.",
        timestamp: "2024-02-01 02:30 PM",
        senderName: "FitLife Startup",
      }, 
    ],
  },
];

export default function ProjectsContent({ userRole }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

 useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Fetching projects with token:", token);

        const response = await apiClient.get(
          `/api/${
            userRole === userRoles.FREELANCER
              ? "active-projects-for-freelancer"
              : "dashboard/get-in-progress-post"
          }`
        );

        console.log("Project content Response:", response);

        setProjects(
          userRole === "CLIENT" ? clientRes.data : freelancerRes.data
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userRole]);

  // Message send handler
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
      // optionally: call API to save message
    }
  };

  // const handleSendMessage = () => {
  //   if (newMessage.trim()) {
  //     // Add message logic here
  //     setNewMessage("")
  //   }
  // }

  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "In Review":
        return "outline";
      default:
        return "outline";
    }
  };

  // 🌀 Loading / Error states
  if (loading)
    return <p className="p-6 text-muted-foreground">Loading projects...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!projects.length)
    return (
      <p className="p-6 text-muted-foreground">No active projects found.</p>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Active Projects
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {userRole === "freelancer"
            ? "Manage your ongoing freelance projects"
            : "Track and manage your hired projects"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Projects List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Projects</CardTitle>
            <CardDescription>Your active projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject.id === project.id
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {userRole === "freelancer"
                    ? project.client
                    : project.freelancer}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <Badge
                    variant={
                      project.status === "Completed" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-1 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">
                  {selectedProject.title}
                </CardTitle>
                <CardDescription>{selectedProject.description}</CardDescription>
              </div>
              <Badge
                variant={
                  selectedProject.status === "Completed"
                    ? "default"
                    : "secondary"
                }
              >
                {selectedProject.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="escrow">Escrow</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Budget</div>
                    <div className="text-lg font-bold">
                      ${selectedProject.budget.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Progress</div>
                    <div className="text-lg font-bold">
                      {selectedProject.progress}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProject.startDate}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Deadline</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProject.deadline}
                    </div>
                  </div>
                </div>

                <Progress value={selectedProject.progress} className="h-3" />

                {/* Team */}
                <div className="space-y-3">
                  <h4 className="font-medium">Team</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=C`}
                        />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {selectedProject.client}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Client
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=F`}
                        />
                        <AvatarFallback>F</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {selectedProject.freelancer}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Freelancer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Contract
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Assets
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <h4 className="font-medium">Project Milestones</h4>
                  {userRole === "client" && (
                    <Button size="sm">
                      <Target className="mr-2 h-4 w-4" />
                      Add Milestone
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone) => (
                    <Card key={milestone.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  milestone.status === "Completed"
                                    ? "bg-green-500"
                                    : milestone.status === "In Progress"
                                    ? "bg-blue-500"
                                    : milestone.status === "In Review"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <h5 className="font-medium">{milestone.title}</h5>
                              <Badge
                                variant={getMilestoneStatusColor(
                                  milestone.status
                                )}
                                className="text-xs"
                              >
                                {milestone.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <DollarSign className="mr-1 h-3 w-3" />$
                                {milestone.amount.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                Due: {milestone.dueDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {milestone.status === "In Review" &&
                              userRole === "client" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                  >
                                    Request Changes
                                  </Button>
                                  <Button size="sm">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                </>
                              )}
                            {milestone.status === "In Progress" &&
                              userRole === "freelancer" && (
                                <Button size="sm">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Submit Work
                                </Button>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="escrow" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Escrow Protection</h4>
                </div>

                {/* Escrow Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Budget
                      </div>
                      <div className="text-2xl font-bold">
                        ${selectedProject.escrow.totalAmount.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        Released
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {selectedProject.escrow.releasedAmount.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        Pending Release
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        ${selectedProject.escrow.pendingAmount.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        In Escrow
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${selectedProject.escrow.heldAmount.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Escrow Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Escrow Actions</CardTitle>
                    <CardDescription>
                      Manage milestone payments and releases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userRole === "client" &&
                      selectedProject.escrow.pendingAmount > 0 && (
                        <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">
                              Payment Pending Approval
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            $
                            {selectedProject.escrow.pendingAmount.toLocaleString()}{" "}
                            is ready for release upon milestone completion
                            approval.
                          </p>
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Release Payment
                          </Button>
                        </div>
                      )}

                    {userRole === "freelancer" && (
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Payment Status</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your earnings are protected by escrow. Payments are
                          released automatically upon milestone approval.
                        </p>
                        <div className="text-sm">
                          <div className="flex justify-between py-1">
                            <span>Completed & Released:</span>
                            <span className="font-medium text-green-600">
                              $
                              {selectedProject.escrow.releasedAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Awaiting Release:</span>
                            <span className="font-medium text-yellow-600">
                              $
                              {selectedProject.escrow.pendingAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Project Chat</h4>
                  <Badge variant="outline" className="text-xs">
                    {selectedProject.messages.length} messages
                  </Badge>
                </div>

                {/* Messages */}
                <Card>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                      {selectedProject.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            (userRole === "client" &&
                              message.sender === "client") ||
                            (userRole === "freelancer" &&
                              message.sender === "freelancer")
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              (userRole === "client" &&
                                message.sender === "client") ||
                              (userRole === "freelancer" &&
                                message.sender === "freelancer")
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            } rounded-lg p-3`}
                          >
                            <div className="text-sm font-medium mb-1">
                              {message.senderName}
                            </div>
                            <div className="text-sm">{message.message}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
