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
import { Link, useOutletContext } from "react-router-dom";

export default function DashboardContent() {
  const { userRole, token, authLoading } = useAuth();
  const { activeItem, setActiveItem } = useOutletContext();

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
        // CLIENT  → GET /api/dashboard/client/get-post-in-progress
        // Returns: { activeProjects, recentJobPosts, completedJobs, dashboard }
        //
        // FREELANCER → GET /api/freelancer/get-post-in-progress  (note: no /dashboard/ prefix)
        // Returns: { activeProjects, completedJobs, dashboard }
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
  // dashboard.totalJobs           → completed contracts count
  // dashboard.totalActiveProjects → active contracts count
  // dashboard.totalSpending       → sum of completed contract bid amounts

  const getStats = () => {
    if (userRole === userRoles.FREELANCER) {
      return [
        {
          title: "Total Earnings",
          // ✅ totalSpending = sum of completed contract amounts for freelancer
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
          // ✅ totalJobs = completed contracts count
          value: (dashboardData.dashboard?.totalJobs ?? 0).toString(),
          icon: CheckCircle,
        },
        {
          title: "Success Rate",
          // Derived: completed / (completed + active) * 100
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
          // ✅ totalSpending = sum of completed contract bid amounts
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
          // ✅ totalJobs = completed contracts count
          value: (dashboardData.dashboard?.totalJobs ?? 0).toString(),
          icon: CheckCircle,
        },
        {
          title: "Hired Freelancers",
          // Derived: count distinct freelancers from activeProjects
          value: (() => {
            const ids = new Set(
              (dashboardData.activeProjects || [])
                .map(c => c.freelancer?.id)
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
  // Each item is a ContractDto:
  //   contract.id
  //   contract.status                          → "ACTIVE" | "COMPLETED"
  //   contract.job.jobTitle                    → project name
  //   contract.job.budget                      → budget
  //   contract.job.projectEndTime              → deadline
  //   contract.job.clientDto.companyName       → client name
  //   contract.acceptedBid.freelancerDto       → FreelancerDto
  //     .userDto.username                      → freelancer name
  //     .userDto.imageData                     → base64 avatar
  //   contract.freelancer                      → FreelancerDto (also available directly)

  const getProjects = () => {
    return (dashboardData.activeProjects || []).map((contract) => {
      const job             = contract.job;
      // freelancer available both from contract.freelancer and contract.acceptedBid.freelancerDto
      const freelancer      = contract.freelancer ?? contract.acceptedBid?.freelancerDto;
      const clientName      = job?.clientDto?.companyName ?? "N/A";
      const freelancerName  = freelancer?.userDto?.username ?? "No Freelancer";
      const freelancerImage = freelancer?.userDto?.imageData ?? null;

      return {
        title:          job?.jobTitle ?? "N/A",
        client:         clientName,
        freelancer:     freelancerName,
        freelancerImage,
        status:         contract.status,
        budget:         (job?.budget ?? 0).toLocaleString(),
        deadline:       job?.projectEndTime
          ? new Date(job.projectEndTime).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })
          : "N/A",
      };
    });
  };

  // ── Recent Activity ───────────────────────────────────────────────────────
  // CLIENT: recentJobPosts → List<JobDto>
  //   job.jobTitle, job.budget, job.proposalsCount, job.status, job.createdAt
  //
  // FREELANCER: no recent bids in this API — show completedJobs instead
  //   contract.job.jobTitle, contract.acceptedBid.amount, contract.status

  const getRecentActivity = () => {
    if (userRole === userRoles.FREELANCER) {
      return (dashboardData.completedJobs || []).map((contract) => ({
        title:    contract.job?.jobTitle ?? "N/A",
        budget:   `₹${(contract.acceptedBid?.amount ?? 0).toLocaleString()}`,
        status:   contract.status,
        postedAt: contract.createdAt
          ? new Date(contract.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "N/A",
      }));
    } else {
      // CLIENT: recentJobPosts → List<JobDto>
      return (dashboardData.recentJobPosts || []).map((job) => ({
        title:     job.jobTitle,
        budget:    `₹${(job.budget ?? 0).toLocaleString()}`,
        proposals: job.proposalsCount ?? 0,
        status:    job.status === "INACTIVE" ? "In Progress" : (job.status ?? "N/A"),
        postedAt:  job.createdAt
          ? new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "N/A",
      }));
    }
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

        {/* Active Projects — from contract.job + contract.freelancer */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg md:text-xl">
              {userRole === userRoles.FREELANCER ? "Active Projects" : "Active Projects"}
            </CardTitle>
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
                {projects.map((project, index) => (
                  <div key={index} className="rounded-lg border p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h4 className="font-semibold text-sm md:text-base">{project.title}</h4>
                      <Badge
                        variant={project.status === "COMPLETED" ? "default" : "outline"}
                        className="w-fit"
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">
                      {/* freelancer.userDto.username + imageData */}
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {project.freelancerImage && (
                          <img
                            src={`data:image/jpeg;base64,${project.freelancerImage}`}
                            alt={project.freelancer}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span>
                          {userRole === userRoles.FREELANCER
                            ? project.client
                            : project.freelancer}
                        </span>
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

                    <Button variant="outline" size="sm" className="w-full">
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
                          item.status === "COMPLETED" ? "default"
                          : item.status === "ACTIVE" || item.status === "In Progress" ? "outline"
                          : "secondary"
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {/* job.budget / acceptedBid.amount */}
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