import { apiClient } from "@/api/AxiosServiceApi";
import InlineLoader from "@/components/InlineLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { userRoles } from "@/utils/constants";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Trash,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "all",         label: "All Status" },
  { value: "active",      label: "Active" },
  { value: "completed",   label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "cancelled",   label: "Cancelled" },
];

const PHASE_CONFIG = {
  PENDING:     { color: "outline",     border: "border-l-yellow-500", Icon: Clock },
  IN_PROGRESS: { color: "default",     border: "border-l-blue-500",   Icon: Play },
  SUCCESS:     { color: "secondary",   border: "border-l-green-500",  Icon: CheckCircle },
  FAILED:      { color: "destructive", border: "border-l-red-500",    Icon: AlertCircle },
};

const phaseConfig = (phase) =>
  PHASE_CONFIG[phase?.toUpperCase()] ?? { color: "outline", border: "border-l-gray-300", Icon: FileText };

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Filter Popover ───────────────────────────────────────────────────────────
function FilterPopover({ statusFilter, onStatusChange, onReset, activeCount }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent relative">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Filters</p>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Status
          </Label>
          <div className="flex flex-col gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(opt.value);
                  setOpen(false);
                }}
                className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobPostsContent({ userRole }) {
  const [searchInput, setSearchInput]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allJobPosts, setAllJobPosts] = useState([]);
  const [jobPosts, setJobPosts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [totalJobs, setTotalJobs]       = useState(0);
  const [expandedJobs, setExpandedJobs] = useState({});

  const debouncedSearch = useDebounce(searchInput, 400);
  const { authLoading } = useAuth();
  const navigate = useNavigate();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(
    async (pageNum = 0, status = statusFilter, search = debouncedSearch) => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/dashboard/get-post", {
          params: {
            page: pageNum,
            size: 5,
            // Only send status when not "all" — match whatever your backend expects
            ...(status !== "all" && { status }),
            ...(search.trim() && { search: search.trim() }),
          },
        });
        const { content, totalPages, totalElements } = response.data;
        // setJobPosts(Array.isArray(content) ? content : []);
        const jobs = Array.isArray(content) ? content : [];

        setAllJobPosts(jobs);
        setTotalPages(totalPages ?? 0);
        setTotalJobs(totalElements ?? 0);
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to fetch job posts:", err);
        setJobPosts([]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusFilter, debouncedSearch],
  );

  // Re-fetch whenever debounced search or status changes; reset to page 0
  useEffect(() => {
    fetchPosts(0, statusFilter, debouncedSearch);
  }, [debouncedSearch, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
  let filtered = [...allJobPosts];

  // // Search Filter
  // if (searchInput.trim()) {
  //   const searchTerm = searchInput.toLowerCase();

  //   filtered = filtered.filter((job) =>
  //     job.jobTitle?.toLowerCase().includes(searchTerm)
  //   );
  // }
    if (searchInput.trim()) {
    const searchTerm = searchInput.toLowerCase();

    filtered = filtered.filter((job) => {
      const title = job.jobTitle?.toLowerCase() || "";
      const description = job.jobDescription?.toLowerCase() || "";
      const category = job.category?.toLowerCase() || "";

      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.includes(searchTerm)
      );
    });
  }

  // // Status Filter
  // if (statusFilter !== "all") {
  //   filtered = filtered.filter(
  //     (job) =>
  //       job.status?.toLowerCase() === statusFilter.toLowerCase()
  //   );
  // }

  if (statusFilter !== "all") {
  filtered = filtered.filter((job) => {
    switch (statusFilter) {
      case "active":
        return job.status === "ACTIVE";

      case "completed":
        return job.phase === "SUCCESS";

      case "in-progress":
        return job.phase === "IN_PROGRESS";

      case "cancelled":
        return job.phase === "FAILED";

      default:
        return true;
    }
  });
}

  setJobPosts(filtered);
}, [allJobPosts, searchInput, statusFilter]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setPage(0);
  };

  const handleReset = () => {
    setSearchInput("");
    setStatusFilter("all");
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchPosts(newPage, statusFilter, debouncedSearch);
    }
  };

  const toggleJobDescription = (jobId) =>
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));

  // Count active filters (exclude "all" status and empty search)
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (searchInput.trim() ? 1 : 0);

  // ── Freelancer guard ───────────────────────────────────────────────────────
  if (userRole === userRoles.FREELANCER) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Switch to Client Role</CardTitle>
            <CardDescription>
              You need to be in client mode to manage job posts. Switch your
              role to access this feature.
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

  if (authLoading) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Job Posts
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your posted jobs and track their performance
          </p>
        </div>
        <div className="flex justify-end *:flex-1 sm:*:flex-none items-center space-x-2">
          <FilterPopover
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            onReset={handleReset}
            activeCount={activeFilterCount}
          />
          <Button size="sm" onClick={() => navigate("/dashboard/post-job")}>
            <Plus className="h-4 w-4" />
            <span className="inline ml-2">Post New Job</span>
          </Button>
        </div>
      </div>

      {/* Search + Status inline bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
              <Input
                placeholder="Search jobs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 w-full"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status select */}
            <Select
              value={statusFilter}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                  <button onClick={() => handleStatusChange("all")} aria-label="Remove status filter">
                    
                  </button>
                </Badge>
              )}
              {searchInput.trim() && (
                <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                  
                  <button onClick={() => setSearchInput("")} aria-label="Clear search">
                    
                  </button>
                </Badge>
              )}
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                
              </button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <InlineLoader />
            </div>
          ) : jobPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilterCount > 0
                  ? "No jobs match your current filters."
                  : "You haven't posted any jobs yet."}
              </p>
              {activeFilterCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobPosts.map((job) => {
                const { color, border, Icon } = phaseConfig(job.phase);
                const isExpanded = expandedJobs[job.id];
                const longDesc = (job.jobDescription?.length ?? 0) > 200;

                return (
                  <div
                    key={job.id}
                    className={`border rounded-lg border-l-4 ${border} p-4 sm:p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="space-y-4">
                      {/* Title + phase badge */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-2">
                            <h3 className="font-semibold text-base sm:text-lg break-words">
                              {job.jobTitle}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {/* Status Badge */}
                              <Badge className={job.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {job.status}
                              </Badge>

                              {/* Phase Badge */}
                              {job.phase && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {job.phase.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description with toggle */}
                        {job.jobDescription && (
                          <div className="mt-1">
                            <p
                              className={`text-sm text-muted-foreground whitespace-pre-wrap ${
                                longDesc && !isExpanded ? "line-clamp-3" : ""
                              }`}
                            >
                              {job.jobDescription}
                            </p>
                            {longDesc && (
                              <button
                                onClick={() => toggleJobDescription(job.id)}
                                className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 mt-1"
                                aria-label={isExpanded ? "Show less" : "Show more"}
                              >
                                {isExpanded ? (
                                  <><ChevronUp className="h-3 w-3" /> Show less</>
                                ) : (
                                  <><ChevronDown className="h-3 w-3" /> Show more</>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Skills + Attachment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {job.requiredSkills?.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-xs font-medium">Required Skills:</h3>
                            <div className="flex flex-wrap gap-2">
                              {job.requiredSkills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {job.file && (
                          <div className="space-y-1">
                            <h3 className="text-xs font-medium">Attachment:</h3>
                            <a href={job.file} target="_blank" rel="noopener noreferrer">
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                Open Link
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Metadata grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/50 border px-3 py-2 rounded-md">
                          <IndianRupee className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            Budget: {job.budget ? job.budget.toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 border px-3 py-2 rounded-md">
                          <Users className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            Proposals: {job.proposalsCount ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 border px-3 py-2 rounded-md">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 border px-3 py-2 rounded-md">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            Deadline: {format(new Date(job.projectEndTime), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Link to={`/dashboard/job/${job.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="sm:w-auto w-full"
                            >
                              <MoreVertical className="h-4 w-4 sm:mr-0 mr-2" />
                              <span className="sm:hidden">More Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="top" className="w-48">
                            <DropdownMenuItem
                              disabled={job.status !== "ACTIVE"}
                              onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!job.proposalsCount}
                              onClick={() => navigate(`/dashboard/job/${job.id}/bids`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Review Bids
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            {job.status === "ACTIVE" && (
                              <DropdownMenuItem className="text-primary">
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            {job.status === "INACTIVE" && job.phase === "PENDING" && (
                              <DropdownMenuItem className="text-green-500">
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  Page {page + 1} of {totalPages} ({totalJobs} total jobs)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0 || loading}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page + 1 >= totalPages || loading}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}