"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/AxiosServiceApi";
import InlineLoader from "@/components/InlineLoader";
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
  IndianRupee,
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
import { format } from "date-fns";

export default function HiredFreelancersContent({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  useEffect(() => {
    if (userRole === "freelancer") return;
    (async function fetchHiredFreelancers() {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/dashboard/hired-freelancers", {
          params: { page, size },
        });
        const data = res.data;

        setContracts(data.content || []);
        setTotalPages(data.totalPages || 1);

        if (data.content?.length > 0) {
          setSelectedContractId(data.content[0].id);
        }
      } catch (error) {
        console.error("Error fetching hired freelancers:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, userRole]);

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

  // ── helpers ────────────────────────────────────────────────────────────────

    const normalizeStatus = (status) =>
    status?.replace(/_/g, " ").toLowerCase();


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":   return "default";
      case "completed": return "secondary";
      case "cancelled": return "outline";
      default:         return "outline";
    }
  };

  // Derive a display-friendly name from FreelancerDto
  const getFreelancerName = (freelancer) =>
    freelancer?.userDto?.username || "Unknown";

  const getFreelancerAvatar = (freelancer) =>
    freelancer?.userDto?.imageData
      ? `data:image/png;base64,${freelancer.userDto.imageData}`
      : null;

  const getFreelancerInitials = (freelancer) => {
    const name = getFreelancerName(freelancer);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getProjectDuration = (job) => {
    if (!job?.projectStartTime || !job?.projectEndTime) return "N/A";
    const start = new Date(job.projectStartTime);
    const end   = new Date(job.projectEndTime);
    const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

 const getProjectProgress = (status) => {
  const normalizedStatus = status
    ?.replace(/_/g, " ")
    .toLowerCase();

  switch (normalizedStatus) {
    case "completed":
      return 100;

    case "in progress":
      return 60;

    case "active":
      return 40;

    default:
      return 0;
  }
};

  const formatHiredDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try { return format(new Date(dateStr), "PP"); }
    catch { return dateStr; }
  };

  // ── filtering ──────────────────────────────────────────────────────────────

  const filteredContracts = contracts.filter((contract) => {
    const freelancer = contract.freelancer;
    const name       = getFreelancerName(freelancer).toLowerCase();
    const title      = freelancer?.designation?.toLowerCase() || "";
    const status     = contract.status?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      title.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // ── stats (computed from ALL loaded contracts, not just filtered) ──────────

  const totalFreelancers = contracts.length;
  const activeProjects = contracts.filter((c) =>
  ["active", "in progress", "in_progress"].includes(
    normalizeStatus(c.status)
  )
).length;
  const totalSpent = contracts.reduce(
    (sum, c) => sum + (c.job?.budget ?? 0), 0
  );
  // No rating field in DTO — show N/A gracefully
  const avgRating = null;

  // ── selected contract ──────────────────────────────────────────────────────

  const selectedContract = selectedContractId
    ? contracts.find((c) => c.id === selectedContractId)
    : null;

  // ── render ─────────────────────────────────────────────────────────────────

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
            <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFreelancers}</div>
            <p className="text-xs text-muted-foreground">Hired to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalSpent.toLocaleString()}
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
            <div className="text-2xl font-bold">N/A</div>
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <InlineLoader />
        </div>
      ) : (
        <>
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
                    {filteredContracts.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No freelancers found</h3>
                        <p className="text-muted-foreground mb-4">
                          Try adjusting your search or filters.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      filteredContracts.map((contract) => {
                        const freelancer = contract.freelancer;
                        const job        = contract.job;

                        return (
                          <div
                            key={contract.id}
                            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                              selectedContractId === contract.id
                                ? "ring-2 ring-primary"
                                : ""
                            }`}
                            onClick={() => setSelectedContractId(contract.id)}
                          >
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12">
                                {getFreelancerAvatar(freelancer) ? (
                                  <AvatarImage
                                    src={getFreelancerAvatar(freelancer)}
                                    alt={getFreelancerName(freelancer)}
                                  />
                                ) : null}
                                <AvatarFallback>
                                  {getFreelancerInitials(freelancer)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {getFreelancerName(freelancer)}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                      {freelancer?.designation || "Freelancer"}
                                    </p>
                                  </div>
                                  <Badge variant={getStatusColor(contract.status)}>
                                    {contract.status}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="capitalize">
                                      {freelancer?.experienceLevel?.toLowerCase() || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>
                                      {job?.budget != null
                                      ? job.budget.toLocaleString()
                                      : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{getProjectDuration(job)}</span>
                                  </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1">
                                  {(freelancer?.skills || []).slice(0, 4).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {(freelancer?.skills || []).length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{freelancer.skills.length - 4}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    Hired: {formatHiredDate(contract.createdAt)}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-transparent"
                                      onClick={(e) => e.stopPropagation()}
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
                                          onClick={(e) => e.stopPropagation()}
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
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Freelancer Detail Panel */}
            <div>
              {selectedContract ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        {getFreelancerAvatar(selectedContract.freelancer) ? (
                          <AvatarImage
                            src={getFreelancerAvatar(selectedContract.freelancer)}
                            alt={getFreelancerName(selectedContract.freelancer)}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getFreelancerInitials(selectedContract.freelancer)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {getFreelancerName(selectedContract.freelancer)}
                        </CardTitle>
                        <CardDescription>
                          {selectedContract.freelancer?.designation || "Freelancer"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="projects">Project</TabsTrigger>
                        <TabsTrigger value="bid">Bid</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Experience</span>
                            <span className="font-medium capitalize">
                              {selectedContract.freelancer?.experienceLevel?.toLowerCase() || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Contract Status</span>
                            <Badge variant={getStatusColor(selectedContract.status)}>
                              {selectedContract.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="font-medium">
                              {selectedContract.freelancer?.phone || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Hired On</span>
                            <span className="font-medium">
                              {formatHiredDate(selectedContract.createdAt)}
                            </span>
                          </div>
                          {selectedContract.freelancer?.portfolioUrl && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Portfolio</span>
                              <a
                                href={selectedContract.freelancer.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary text-sm underline"
                              >
                                View
                              </a>
                            </div>
                          )}
                        </div>

                        {selectedContract.freelancer?.bio && (
                          <div>
                            <h4 className="font-medium mb-1">Bio</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedContract.freelancer.bio}
                            </p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {(selectedContract.freelancer?.skills || []).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Project Tab */}
                      <TabsContent value="projects" className="space-y-4 mt-4">
                        {selectedContract.job ? (
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                {selectedContract.job.jobTitle}
                              </h4>
                              <Badge
                                variant={
                                  selectedContract.job.phase === "COMPLETED"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {selectedContract.job.phase || selectedContract.job.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{getProjectProgress(selectedContract.job.phase || selectedContract.job.status)}%</span>
                              </div>
                              <Progress
                                value={getProjectProgress(selectedContract.job.phase || selectedContract.job.status)}
                                className="h-2"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3" />
                                  {selectedContract.job?.budget?.toLocaleString()}
                                </span>
                                <span>
                                  Due:{" "}
                                  {selectedContract.job.projectEndTime
                                    ? format(new Date(selectedContract.job.projectEndTime), "PP")
                                    : "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Start</span>
                                <span>
                                  {selectedContract.job.projectStartTime
                                    ? format(new Date(selectedContract.job.projectStartTime), "PP")
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Experience Required</span>
                                <span className="capitalize">
                                  {selectedContract.job.experienceLevel?.toLowerCase() || "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Required Skills */}
                            {selectedContract.job.requiredSkills?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground mb-1">Required Skills</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedContract.job.requiredSkills.map((s) => (
                                    <Badge key={s} variant="outline" className="text-xs">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No project data available.</p>
                        )}
                      </TabsContent>

                      {/* Bid Tab */}
                      <TabsContent value="bid" className="space-y-4 mt-4">
                        {selectedContract.acceptedBid ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Bid Amount</span>
                              <span className="font-medium flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                {selectedContract.acceptedBid.amount != null
                                  ? selectedContract.acceptedBid.amount.toLocaleString()
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Bid Status</span>
                              <Badge variant="default" className="text-xs">
                                {selectedContract.acceptedBid.status || "ACCEPTED"}
                              </Badge>
                            </div>
                            {selectedContract.acceptedBid.coverLetter && (
                              <div>
                                <h4 className="font-medium mb-1 text-sm">Proposal</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                                  {selectedContract.acceptedBid.coverLetter}
                                </p>
                              </div>
                            )}
                            {selectedContract.acceptedBid.timeRequired && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Delivery Days</span>
                                <span className="font-medium">
                                  {selectedContract.acceptedBid.timeRequired}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No bid data available.</p>
                        )}
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
        </>
      )}
    </div>
  );
}