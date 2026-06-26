import { apiClient } from "@/api/AxiosServiceApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { userRoles } from "@/utils/constants";
import {
  Briefcase,
  Clock,
  IndianRupee,
  Plus,
  PlusCircle,
  TrendingUp,
  UserCheck,
  Users,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function DashboardContent() {
  const { userRole, token, authLoading } = useAuth();
  const { setActiveItem } = useOutletContext();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    activeProjects: [],   // List<ContractDto>
    recentJobPosts: [],   // List<JobDto>  (client only)
    completedJobs: [],    // List<ContractDto>
    dashboard: {
      totalJobs: 0,
      totalActiveProjects: 0,
      totalSpending: 0.0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !token || !userRole) return;

    (async () => {
      try {
        setLoading(true);
        const endpoint =
          userRole === userRoles.FREELANCER
            ? "/api/freelancer/get-post-in-progress"
            : "/api/dashboard/client/get-post-in-progress";

        const { data } = await apiClient.get(endpoint);
        setDashboardData(data);
        console.log("Dashboard Data:", data);
      } catch (error) {
        console.error("Dashboard fetch error:", error?.response?.data ?? error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, authLoading, userRole]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const getStats = () => {
    if (userRole === userRoles.FREELANCER) {
      return [
        {
          title: "Total Earnings",
          value: `₹${(dashboardData.dashboard?.totalSpending ?? 0).toLocaleString()}`,
          icon: IndianRupee,
        },
        {
          title: "Active Projects",
          value: (dashboardData.dashboard?.totalActiveProjects ?? 0).toString(),
          icon: Briefcase,
        },
        {
          title: "Completed Jobs",
          value: (dashboardData.dashboard?.totalJobs ?? 0).toString(),
          icon: CheckCircle,
        },
        {
          title: "Success Rate",
          value: (() => {
            const completed = dashboardData.dashboard?.totalJobs ?? 0;
            const active    = dashboardData.dashboard?.totalActiveProjects ?? 0;
            const total     = completed + active;
            return total === 0 ? "0%" : `${Math.round((completed / total) * 100)}%`;
          })(),
          icon: TrendingUp,
        },
      ];
    } else {
      return [
        {
          title: "Total Spent",
          value: `₹${(dashboardData.dashboard?.totalSpending ?? 0).toLocaleString()}`,
          icon: IndianRupee,
        },
        {
          title: "Active Projects",
          value: (dashboardData.dashboard?.totalActiveProjects ?? 0).toString(),
          icon: Briefcase,
        },
        {
          title: "Completed Jobs",
          value: (dashboardData.dashboard?.totalJobs ?? 0).toString(),
          icon: CheckCircle,
        },
        {
          title: "Hired Freelancers",
          // Count distinct freelancers across active projects
          value: (() => {
            const ids = new Set(
              (dashboardData.activeProjects || [])
                .map(c => c.freelancer?.id ?? c.acceptedBid?.freelancerDto?.id)
                .filter(Boolean)
            );
            return ids.size.toString();
          })(),
          icon: UserCheck,
        },
      ];
    }
  };

  // ── Active Projects ───────────────────────────────────────────────────────
  // FIX 1: Added contractId so "View Project Details" can navigate
  // FIX 2: Pull client image from contract.client when viewer is a FREELANCER
  const getProjects = () => {
    return (dashboardData.activeProjects || []).map((contract) => {
      const job = contract.job;

      // Freelancer data — prefer contract.freelancer, fallback to acceptedBid
      const freelancer      = contract.freelancer ?? contract.acceptedBid?.freelancerDto;
      const freelancerName  = freelancer?.userDto?.username ?? "No Freelancer";
      const freelancerImage = freelancer?.userDto?.imageData ?? null;

      // Client data — from contract.client or job.clientDto
      const client      = contract.client ?? job?.clientDto;
      const clientName  = client?.companyName ?? "N/A";
      const clientImage = client?.userDto?.imageData ?? null;

      // Pass both raw values — two badges shown in JSX (same pattern as JobPostsContent)
      // contract.status = "ACTIVE" | "COMPLETED"
      // job.phase       = "IN_PROGRESS" | "PENDING" | "SUCCESS" | "FAILED" | null
      const contractStatus = contract.status ?? "N/A";
      const jobPhase       = job?.phase ?? null;

      return {
        contractId:     contract.id,
        jobId:          job?.id,
        title:          job?.jobTitle ?? "N/A",
        clientName,
        clientImage,
        freelancerName,
        freelancerImage,
        contractStatus,   // e.g. "ACTIVE"  → green badge
        jobPhase,         // e.g. "IN_PROGRESS" → blue badge (shown only when present)
        budget:           (job?.budget ?? 0).toLocaleString(),
        deadline:         job?.projectEndTime
          ? new Date(job.projectEndTime).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })
          : "N/A",
      };
    });
  };

  // ── Recent Activity ───────────────────────────────────────────────────────
  // FIX 3: Better status label for recentJobPosts using both status + phase
  const getJobStatusLabel = (job) => {
    if (job.phase === "IN_PROGRESS") return "In Progress";
    if (job.status === "ACTIVE")     return "Open";
    if (job.status === "INACTIVE" && !job.phase) return "Open";   // posted, no phase yet
    return job.status ?? "N/A";
  };

  const getRecentActivity = () => {
    if (userRole === userRoles.FREELANCER) {
      // Completed jobs — contract.createdAt may be null (API returns null); handle gracefully
      return (dashboardData.completedJobs || []).map((contract) => ({
        title:    contract.job?.jobTitle ?? "N/A",
        budget:   `₹${(contract.acceptedBid?.amount ?? 0).toLocaleString()}`,
        status:   contract.status ?? "N/A",
        // FIX 4: contract.createdAt is null in real API data — show "N/A" safely
        postedAt: contract.createdAt
          ? new Date(contract.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "N/A",
      }));
    } else {
      return (dashboardData.recentJobPosts || []).map((job) => ({
        title:     job.jobTitle ?? "N/A",
        budget:    `₹${(job.budget ?? 0).toLocaleString()}`,
        proposals: job.proposalsCount ?? 0,
        status:    getJobStatusLabel(job),                   // FIX 3
        postedAt:  job.createdAt
          ? new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "N/A",
      }));
    }
  };

  // ── View Project Details handler ──────────────────────────────────────────
  // Navigates to /dashboard/job/:jobId — same route used in JobPostsContent
  const handleViewProject = (jobId) => {
    if (!jobId) return;
    const route = `/dashboard/job/${jobId}`;
    setActiveItem(route);
    navigate(route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats          = getStats();
  const projects       = getProjects();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {userRole === userRoles.FREELANCER ? "Freelancer" : "Client"} Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === userRoles.FREELANCER
              ? "Welcome back! Here's what's happening with your freelance work."
              : "Welcome back! Here's an overview of your projects and hiring activity."}
          </p>
        </div>
        <Link
          to={userRole === userRoles.FREELANCER ? "/dashboard/browse-jobs" : "/dashboard/post-job"}
          onClick={() =>
            setActiveItem(
              userRole === userRoles.FREELANCER ? "/dashboard/browse-jobs" : "/dashboard/post-job"
            )
          }
        >
          <Button className="w-full sm:w-auto">
            {userRole === userRoles.FREELANCER ? (
              <><Plus className="mr-2 h-4 w-4" />Browse Jobs</>
            ) : (
              <><PlusCircle className="mr-2 h-4 w-4" />Post a Job</>
            )}
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Active Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg md:text-xl">Active Projects</CardTitle>
            <CardDescription className="text-sm">
              {userRole === userRoles.FREELANCER
                ? "Your currently active contracts"
                : "Projects you're currently managing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active projects yet
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.contractId} className="rounded-lg border p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h4 className="font-semibold text-sm md:text-base">{project.title}</h4>
                      {/* Two badges — mirrors JobPostsContent exactly */}
                      <div className="flex flex-wrap gap-2">
                        {/* contract.status badge */}
                        {/* <Badge
                          className={
                            project.contractStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          
                        </Badge> */}

                        {/* job.phase badge — only when phase exists */}
                        {project.jobPhase && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {project.jobPhase.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">
                      {/* FIX 2: show client info (with image) when viewer is FREELANCER,
                               show freelancer info (with image) when viewer is CLIENT */}
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {userRole === userRoles.FREELANCER ? (
                          <>
                            {project.clientImage && (
                              <img
                                src={`data:image/jpeg;base64,${project.clientImage}`}
                                alt={project.clientName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span>{project.clientName}</span>
                          </>
                        ) : (
                          <>
                            {project.freelancerImage && (
                              <img
                                src={`data:image/jpeg;base64,${project.freelancerImage}`}
                                alt={project.freelancerName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span>{project.freelancerName}</span>
                          </>
                        )}
                      </div>

                      {/* job.budget */}
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {project.budget}
                      </span>

                      {/* job.projectEndTime */}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.deadline}
                      </span>
                    </div>

                    {/* "View Project Details" navigates to /dashboard/job/:jobId */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewProject(project.jobId)}
                    >
                      View Project Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg md:text-xl">
              {userRole === userRoles.FREELANCER ? "Completed Jobs" : "Recent Job Posts"}
            </CardTitle>
            <CardDescription className="text-sm">
              {userRole === userRoles.FREELANCER
                ? "Your recently completed contracts"
                : "Your recent job postings and proposals received"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {userRole === userRoles.FREELANCER
                  ? "No completed jobs yet"
                  : "No recent job posts"}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm leading-tight pr-2">{item.title}</h3>
                      <Badge
                        variant={
                          item.status === "COMPLETED"   ? "default"
                          : item.status === "In Progress" ? "outline"
                          : item.status === "Open"       ? "secondary"
                          : "secondary"
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> {item.budget}
                      </div>
                      {/* CLIENT ONLY: job.proposalsCount */}
                      {userRole !== userRoles.FREELANCER && (
                        <div>Proposals: {item.proposals}</div>
                      )}
                      <div>{item.postedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}