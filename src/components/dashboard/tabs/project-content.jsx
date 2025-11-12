import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DollarSign,
  Target,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/api/AxiosServiceApi";
import { userRoles } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext.jsx";
import { format } from "date-fns";

export default function ProjectsContent() {
  const { userRole } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isProjectsPaneCollapsed, setIsProjectsPaneCollapsed] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const endpoint =
          userRole === userRoles.FREELANCER
            ? "/api/active-projects-for-freelancer"
            : "/api/dashboard/get-in-progress-post";
        const res = await apiClient.get(endpoint);
        const formatted = (res.data || []).map((p) => ({
          id: p.id,
          title: p.job?.jobTitle ?? "Untitled",
          description: p.job?.jobDescription ?? "",
          requiredSkills: p.job?.requiredSkills ?? [],
          experienceLevel: p.job?.experienceLevel ?? "",
          proposalsCount: p.job?.proposalsCount ?? p.proposalsCount ?? 0,
          client: {
            id: p.client?.id ?? null,
            companyName:
              p.client?.companyName ?? p.client?.userDto?.username ?? "Client",
            name:
              p.client?.userDto?.username ?? p.client?.companyName ?? "Client",
            email: p.client?.userDto?.email ?? "N/A",
            phone: p.client?.phone ?? "N/A",
            bio: p.client?.bio ?? "",
            imageData: p.client?.userDto?.imageData ?? null,
          },
          freelancer: {
            id: p.freelancer?.id ?? p.freelancerDto?.id ?? null,
            name:
              p.freelancer?.userDto?.username ??
              p.freelancerDto?.userDto?.username ??
              p.freelancer?.username ??
              "Freelancer",
            email:
              p.freelancer?.userDto?.email ??
              p.freelancerDto?.userDto?.email ??
              "N/A",
            phone: p.freelancer?.phone ?? p.freelancerDto?.phone ?? "N/A",
            bio: p.freelancer?.bio ?? p.freelancerDto?.bio ?? "",
            imageData:
              p.freelancer?.userDto?.imageData ??
              p.freelancerDto?.userDto?.imageData ??
              null,
            designation:
              p.freelancer?.designation ?? p.freelancerDto?.designation ?? "",
            portfolioUrl:
              p.freelancer?.portfolioUrl ?? p.freelancerDto?.portfolioUrl ?? "",
            skills: p.freelancer?.skills ?? p.freelancerDto?.skills ?? [],
          },
          budget: p.job?.budget ?? 0,
          status: p.phase ?? p.status ?? "IN_PROGRESS",
          progress: typeof p.progress === "number" ? p.progress : 50,
          startDate: new Date(p.job?.projectStartTime),
          deadline: new Date(p.job?.projectEndTime),
          milestones: p.milestones ?? p.job?.milestones ?? [],
          files: p.job?.file ? [p.job.file] : [],
        }));
        setProjects(formatted);
        console.log(formatted);
        setSelectedProject((prev) => prev ?? formatted[0] ?? null);
      } catch (err) {
        console.error(err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userRole]);

  if (loading)
    return <p className="p-6 text-muted-foreground">Loading projects...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!projects.length)
    return (
      <p className="p-6 text-muted-foreground">No active projects found.</p>
    );

  const getMilestoneStatusColor = (status) => {
    if (!status) return "outline";
    if (status.toLowerCase().includes("complete")) return "default";
    if (status.toLowerCase().includes("progress")) return "secondary";
    return "outline";
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setShowFullDesc(false);
    setShowMobileDetails(true);
  };

  const handleBackToList = () => {
    setShowMobileDetails(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Active Projects
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {userRole === userRoles.FREELANCER
            ? "Manage your ongoing freelance projects"
            : "Track and manage your hired projects"}
        </p>
      </div>

      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Left list - Hidden on mobile when details are shown */}
        {isProjectsPaneCollapsed ? (
          <div className="hidden lg:flex items-start pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsProjectsPaneCollapsed(false)}
              aria-label="Expand projects pane"
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Card
            className={`lg:w-80 lg:flex-shrink-0 ${showMobileDetails ? "hidden lg:block" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <CardDescription>Your active projects</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex h-8 w-8"
                  onClick={() => setIsProjectsPaneCollapsed(true)}
                  aria-label="Collapse projects pane"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectProject(project)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSelectProject(project)
                  }
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 truncate">
                    {userRole === userRoles.FREELANCER
                      ? project.client.name
                      : project.freelancer.name}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <Badge
                      variant={
                        project.status?.toLowerCase?.() === "completed"
                          ? "default"
                          : "secondary"
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
        )}

        {/* Right details - Shown on mobile when project is selected */}
        <Card
          className={`flex-1 ${!showMobileDetails ? "hidden lg:block" : ""}`}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2 lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                  </Button>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <h1>{selectedProject?.title}</h1>
                  <Badge
                    variant={
                      selectedProject?.status?.toLowerCase?.() === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className={"self-start"}
                  >
                    {selectedProject?.status}
                  </Badge>
                </CardTitle>

                {/* Description with toggle */}
                <div className="mt-1">
                  <p
                    className={`text-sm text-muted-foreground ${showFullDesc ? "" : "line-clamp-3"}`}
                  >
                    {selectedProject?.description}
                  </p>

                  {selectedProject?.description &&
                    selectedProject.description.length > 200 && (
                      <Button
                        aria-expanded={showFullDesc}
                        onClick={() => setShowFullDesc((s) => !s)}
                        variant={"link"}
                        className={"p-0 text-sm"}
                      >
                        {showFullDesc ? "Show less" : "Show more"}
                        {showFullDesc ? (
                          <ChevronUp className={"w-4 h-4"} />
                        ) : (
                          <ChevronDown className={"w-4 h-4"} />
                        )}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Top meta row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 *:bg-muted/30 *:border *:p-3 *:rounded-md">
              <div className="space-y-1">
                <div className="text-sm font-medium">Budget</div>
                <div className="text-lg font-bold">
                  ${selectedProject?.budget?.toLocaleString()}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Progress</div>
                <div className="text-lg font-bold">
                  {selectedProject?.progress}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Start Date</div>
                <div className="text-lg font-bold">
                  {format(selectedProject?.startDate, "PP")}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Deadline</div>
                <div className="text-lg font-bold">
                  {format(selectedProject?.deadline, "PP")}
                </div>
              </div>
            </div>

            <Progress value={selectedProject?.progress} className="h-3 mb-4" />

            {/* Client & Freelancer side-by-side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client card */}

              <div
                className={
                  "relative p-4 bg-muted/50 border rounded-lg flex gap-4 overflow-hidden"
                }
              >
                <div className="absolute top-0 right-0">
                  <p className={"p-2 px-3 text-sm font-bold text-primary"}>
                    Client
                  </p>
                </div>
                <Avatar className="h-12 w-12">
                  {selectedProject?.client?.imageData ? (
                    <AvatarImage
                      src={`data:image/jpeg;base64,${selectedProject.client.imageData}`}
                    />
                  ) : (
                    <AvatarFallback>
                      {(selectedProject?.client?.name || "C").charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <div className="font-medium">
                    {selectedProject?.client?.companyName ||
                      selectedProject?.client?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProject?.client?.email}
                  </div>
                  {selectedProject?.client?.phone && (
                    <div className="text-sm text-muted-foreground">
                      Phone: {selectedProject.client.phone}
                    </div>
                  )}
                  {selectedProject?.client?.bio && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {selectedProject.client.bio}
                    </div>
                  )}
                </div>
              </div>

              {/* Freelancer card */}
              <div
                className={
                  "relative p-4 rounded-lg flex gap-4 border bg-muted/50 flex-1 overflow-hidden"
                }
              >
                <div className="absolute top-0 right-0">
                  <p className={"p-2 px-3 text-sm text-primary font-bold"}>
                    Freelancer
                  </p>
                </div>
                <Avatar className="h-12 w-12">
                  {selectedProject?.freelancer?.imageData ? (
                    <AvatarImage
                      src={`data:image/jpeg;base64,${selectedProject.freelancer.imageData}`}
                    />
                  ) : (
                    <AvatarFallback>
                      {(selectedProject?.freelancer?.name || "F").charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <div className="font-medium">
                    {selectedProject?.freelancer?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProject?.freelancer?.email}
                  </div>
                  {selectedProject?.freelancer?.designation && (
                    <div className="text-sm text-muted-foreground">
                      Role: {selectedProject.freelancer.designation}
                    </div>
                  )}
                  {selectedProject?.freelancer?.portfolioUrl && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Portfolio:{" "}
                      <a
                        className="underline text-primary"
                        href={selectedProject.freelancer.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {selectedProject.freelancer.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions and milestones list */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex flex-wrap gap-2">
                {selectedProject?.files?.length > 0 && (
                  <a
                    href={selectedProject.files[0]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" /> View File
                    </Button>
                  </a>
                )}

                <Button size="sm" variant="outline">
                  <Target className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
