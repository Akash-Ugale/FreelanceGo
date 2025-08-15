"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  DollarSign,
  Briefcase,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const hiredFreelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    title: "Full-Stack Developer",
    rating: 4.9,
    completedJobs: 47,
    totalEarned: 28500,
    currentProjects: 2,
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    hiredDate: "2023-08-15",
    lastActive: "2024-01-25",
    status: "Active",
    projects: [
      {
        name: "E-commerce Platform",
        status: "In Progress",
        progress: 75,
        budget: 5000,
        deadline: "2024-02-15",
      },
      {
        name: "API Integration",
        status: "Completed",
        progress: 100,
        budget: 2500,
        deadline: "2024-01-20",
      },
    ],
    performance: {
      onTimeDelivery: 95,
      qualityScore: 4.8,
      communicationRating: 4.9,
      rehireRate: 85,
    },
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    title: "UI/UX Designer",
    rating: 4.8,
    completedJobs: 32,
    totalEarned: 18200,
    currentProjects: 1,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    hiredDate: "2023-11-20",
    lastActive: "2024-01-24",
    status: "Active",
    projects: [
      {
        name: "Mobile App Design",
        status: "In Progress",
        progress: 60,
        budget: 3000,
        deadline: "2024-02-28",
      },
      {
        name: "Brand Identity",
        status: "Completed",
        progress: 100,
        budget: 2200,
        deadline: "2024-01-10",
      },
    ],
    performance: {
      onTimeDelivery: 90,
      qualityScore: 4.7,
      communicationRating: 4.8,
      rehireRate: 75,
    },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    title: "Mobile Developer",
    rating: 5.0,
    completedJobs: 28,
    totalEarned: 22800,
    currentProjects: 0,
    skills: ["React Native", "iOS", "Android", "Firebase"],
    hiredDate: "2023-09-10",
    lastActive: "2024-01-20",
    status: "Available",
    projects: [
      {
        name: "Fitness App",
        status: "Completed",
        progress: 100,
        budget: 4500,
        deadline: "2024-01-15",
      },
      {
        name: "Social Media App",
        status: "Completed",
        progress: 100,
        budget: 3800,
        deadline: "2023-12-20",
      },
    ],
    performance: {
      onTimeDelivery: 100,
      qualityScore: 5.0,
      communicationRating: 4.9,
      rehireRate: 90,
    },
  },
];

export default function HiredFreelancersContent({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  if (userRole === "freelancer") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Switch to Client Role</CardTitle>
            <CardDescription>
              You need to be in client mode to view hired freelancers. Switch
              your role to access this feature.
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
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "available":
        return "secondary";
      case "busy":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredFreelancers = hiredFreelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      freelancer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOverallStats = () => {
    const totalFreelancers = hiredFreelancers.length;
    const activeProjects = hiredFreelancers.reduce(
      (sum, f) => sum + f.currentProjects,
      0
    );
    const totalSpent = hiredFreelancers.reduce(
      (sum, f) => sum + f.totalEarned,
      0
    );
    const avgRating =
      hiredFreelancers.reduce((sum, f) => sum + f.rating, 0) / totalFreelancers;
    return { totalFreelancers, activeProjects, totalSpent, avgRating };
  };

  const stats = getOverallStats();

  const selectedFreelancerData = selectedFreelancer
    ? hiredFreelancers.find((f) => f.id === selectedFreelancer)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Hired Freelancers
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your team of freelancers and track their performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            Find Talent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Freelancers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFreelancers}</div>
            <p className="text-xs text-muted-foreground">Hired to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Team performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search freelancers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Freelancers List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Freelancers</CardTitle>
              <CardDescription>
                Manage your hired talent and track their work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedFreelancer === freelancer.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedFreelancer(freelancer.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={freelancer.avatar || "/placeholder.svg"}
                          alt={freelancer.name}
                        />
                        <AvatarFallback>
                          {freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {freelancer.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {freelancer.title}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(freelancer.status)}>
                            {freelancer.status}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{freelancer.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{freelancer.completedJobs} jobs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              ${freelancer.totalEarned.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{freelancer.currentProjects} active</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {freelancer.skills.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {freelancer.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{freelancer.skills.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Hired: {freelancer.hiredDate}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-transparent"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Assign Project
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                  Performance Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Freelancer Details */}
        <div>
          {selectedFreelancerData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedFreelancerData.avatar || "/placeholder.svg"}
                      alt={selectedFreelancerData.name}
                    />
                    <AvatarFallback>
                      {selectedFreelancerData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {selectedFreelancerData.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedFreelancerData.title}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Rating
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {selectedFreelancerData.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Completed Jobs
                        </span>
                        <span className="font-medium">
                          {selectedFreelancerData.completedJobs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Earned
                        </span>
                        <span className="font-medium">
                          ${selectedFreelancerData.totalEarned.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Last Active
                        </span>
                        <span className="font-medium">
                          {selectedFreelancerData.lastActive}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedFreelancerData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4 mt-4">
                    {selectedFreelancerData.projects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {project.name}
                          </h4>
                          <Badge
                            variant={
                              project.status === "Completed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>${project.budget.toLocaleString()}</span>
                            <span>Due: {project.deadline}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-Time Delivery</span>
                          <span>
                            {selectedFreelancerData.performance.onTimeDelivery}%
                          </span>
                        </div>
                        <Progress
                          value={
                            selectedFreelancerData.performance.onTimeDelivery
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score</span>
                          <span>
                            {selectedFreelancerData.performance.qualityScore}/5
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedFreelancerData.performance.qualityScore /
                              5) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Communication</span>
                          <span>
                            {
                              selectedFreelancerData.performance
                                .communicationRating
                            }
                            /5
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedFreelancerData.performance
                              .communicationRating /
                              5) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rehire Rate</span>
                          <span>
                            {selectedFreelancerData.performance.rehireRate}%
                          </span>
                        </div>
                        <Progress
                          value={selectedFreelancerData.performance.rehireRate}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a freelancer to view details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
