import { useState, useEffect, useCallback } from "react";
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
import {
  Search,
  Clock,
  Eye,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { userRoles } from "@/utils/constants.js";
import { useAuth } from "@/context/AuthContext.jsx";
import FullScreenLoader from "@/components/FullScreenLoader.jsx";
import { apiClient } from "@/api/AxiosServiceApi.js";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtAmount(n) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN");
}

function capitalise(str = "") {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── badge helpers ───────────────────────────────────────────────────────────

const BID_STATUS_VARIANT = {
  ACCEPTED: "default",
  PENDING: "outline",
  REJECTED: "destructive",
};

const JOB_PHASE_VARIANT = {
  IN_PROGRESS: "secondary",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

function getBidStatusVariant(status = "") {
  return BID_STATUS_VARIANT[status.toUpperCase()] ?? "outline";
}

function getJobPhaseVariant(phase = "") {
  return JOB_PHASE_VARIANT[phase.toUpperCase()] ?? "outline";
}

// ─── stat cards ─────────────────────────────────────────────────────────────

function ClientStatCards({ data }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Total Jobs
          </CardTitle>
          <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {data["Total Jobs"] ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Hired
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {data["Hired"] ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            In Review
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {data["In Review"] ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Completed
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {data["Completed"] ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Total Proposals
          </CardTitle>
          <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {data["Total Proposals"] ?? 0}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FreelancerStatCards({ bids = [] }) {
  const total = bids.length;
  const won = bids.filter(
    (b) => b.myBid?.status?.toUpperCase() === "ACCEPTED",
  ).length;
  const pending = bids.filter(
    (b) => b.myBid?.status?.toUpperCase() === "PENDING",
  ).length;
  const rejected = bids.filter(
    (b) => b.myBid?.status?.toUpperCase() === "REJECTED",
  ).length;
  const successRate = total ? Math.round((won / total) * 100) : 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Total Bids
          </CardTitle>
          <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Won</CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {won}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Pending
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {pending}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Rejected
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {rejected}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Success Rate
          </CardTitle>
          <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {successRate}%
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ─── job card (client view) ──────────────────────────────────────────────────

function JobCard({ item }) {
  const { job, myBid } = item;
  const freelancer = myBid?.freelancerDto;
  const freelancerName = freelancer?.userDto?.username ?? "—";

  return (
    <div className="rounded-lg border p-4 md:p-6 space-y-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
        <div className="space-y-1 flex-1 pr-0 sm:pr-4">
          <h3 className="font-semibold text-base md:text-lg">{job.jobTitle}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.jobDescription}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {job.phase && (
            <Badge variant={getJobPhaseVariant(job.phase)}>
              {capitalise(job.phase)}
            </Badge>
          )}
          {myBid?.status && (
            <Badge variant={getBidStatusVariant(myBid.status)}>
              {capitalise(myBid.status)}
            </Badge>
          )}
        </div>
      </div>

      {/* Required skills */}
      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.requiredSkills.map((s) => (
            <Badge key={s} variant="outline" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium">Budget</div>
          <div className="text-muted-foreground">{fmtAmount(job.budget)}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Bid Amount</div>
          <div className="text-muted-foreground font-semibold text-green-600">
            {fmtAmount(myBid?.amount)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Proposals</div>
          <div className="text-muted-foreground">{job.proposalsCount ?? 0}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Posted</div>
          <div className="text-muted-foreground">{fmtDate(job.createdAt)}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Project Start</div>
          <div className="text-muted-foreground">
            {fmtDate(job.projectStartTime)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Project End</div>
          <div className="text-muted-foreground">
            {fmtDate(job.projectEndTime)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Experience Level</div>
          <div className="text-muted-foreground">
            {capitalise(job.experienceLevel)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Hired Freelancer</div>
          <div className="text-muted-foreground">
            {myBid?.status?.toUpperCase() === "ACCEPTED"
              ? freelancerName
              : "None"}
          </div>
        </div>
      </div>

      {/* Freelancer info (when bid is accepted) */}
      {myBid?.status?.toUpperCase() === "ACCEPTED" && freelancer && (
        <div className="rounded-md bg-muted/40 border p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Accepted Freelancer
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="font-medium">{freelancerName}</span>
            <span className="text-muted-foreground">
              {freelancer.designation}
            </span>
            <span className="text-muted-foreground">
              {freelancer.userDto?.email}
            </span>
          </div>
          {freelancer.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {freelancer.skills.slice(0, 6).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {freelancer.skills.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{freelancer.skills.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t space-y-2 sm:space-y-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {job.proposalsCount ?? 0} proposal
            {job.proposalsCount !== 1 ? "s" : ""} received
          </span>
          {myBid?.timeRequired && (
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {myBid.timeRequired}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {freelancer?.portfolioUrl && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => window.open(freelancer.portfolioUrl, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          )}
          <Button variant="outline" size="sm" className="bg-transparent">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── bid card (freelancer view) ──────────────────────────────────────────────

function BidCard({ item }) {
  const { job, myBid } = item;
  const client = job?.clientDto;
  const clientName = client?.companyName ?? client?.userDto?.username ?? "—";

  return (
    <div className="rounded-lg border p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
        <div className="space-y-1 flex-1 pr-0 sm:pr-4">
          <h3 className="font-semibold text-base md:text-lg">{job.jobTitle}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.jobDescription}
          </p>
        </div>
        <Badge variant={getBidStatusVariant(myBid?.status)}>
          {capitalise(myBid?.status)}
        </Badge>
      </div>

      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.requiredSkills.map((s) => (
            <Badge key={s} variant="outline" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium">Client</div>
          <div className="text-muted-foreground">{clientName}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Budget</div>
          <div className="text-muted-foreground">{fmtAmount(job.budget)}</div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Your Bid</div>
          <div className="text-muted-foreground font-semibold text-green-600">
            {fmtAmount(myBid?.amount)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Submitted</div>
          <div className="text-muted-foreground">
            {fmtDate(myBid?.submittedAt)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Time Required</div>
          <div className="text-muted-foreground">
            {myBid?.timeRequired ?? "—"}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Project End</div>
          <div className="text-muted-foreground">
            {fmtDate(job.projectEndTime)}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t space-y-2 sm:space-y-0">
        <span className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Submitted: {fmtDate(myBid?.submittedAt)}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto bg-transparent"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}

// ─── pagination ──────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className={i !== currentPage ? "bg-transparent" : ""}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function BidHistoryContent({ userRole }) {
  const { authLoading } = useAuth();

  // ── api state ──
  const [apiData, setApiData] = useState(null); // raw response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── ui state ──
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(0);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchBidHistory = useCallback(
    async (page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/bid-history`);
        const { data } = res;
        setApiData(data);
        setCurrentPage(data["Current Page"] ?? page);
      } catch (err) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [apiData],
  );

  useEffect(() => {
    fetchBidHistory(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── page change ────────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBidHistory(page);
  };

  // ── derived data ───────────────────────────────────────────────────────────
  const rawItems = apiData?.JobWithBid ?? [];

  const filteredItems = rawItems
    .filter((item) => {
      const title = item.job?.jobTitle?.toLowerCase() ?? "";
      const bidStatus = item.myBid?.status?.toLowerCase() ?? "";
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || bidStatus === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "amount")
        return (b.myBid?.amount ?? 0) - (a.myBid?.amount ?? 0);
      if (sortBy === "status")
        return (a.myBid?.status ?? "").localeCompare(b.myBid?.status ?? "");
      // default: date
      return (
        new Date(b.myBid?.submittedAt ?? 0) -
        new Date(a.myBid?.submittedAt ?? 0)
      );
    });

  const totalPages = apiData?.["Total Pages"] ?? 1;
  const isFreelancer = userRole === userRoles.FREELANCER;

  // ── loading / error guards ─────────────────────────────────────────────────
  if (authLoading) return <FullScreenLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {isFreelancer ? "Bid History" : "Job Posting History"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {isFreelancer
            ? "Track all your proposal submissions and their outcomes"
            : "Manage your job postings and review proposals"}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto bg-transparent border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => fetchBidHistory(currentPage)}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats */}
      {apiData && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {isFreelancer ? (
            <FreelancerStatCards bids={rawItems} />
          ) : (
            <ClientStatCards data={apiData} />
          )}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    isFreelancer
                      ? "Search by project title..."
                      : "Search by job title..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {isFreelancer
              ? `Your Bids (${filteredItems.length})`
              : `Your Jobs (${filteredItems.length})`}
          </CardTitle>
          <CardDescription className="text-sm">
            {isFreelancer
              ? "Complete history of your proposal submissions"
              : "Complete history of your job postings"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Loading skeleton */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Loading bid history…</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <FileText className="h-8 w-8 opacity-40" />
              <p className="text-sm">No results found.</p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Items */}
          {!loading && filteredItems.length > 0 && (
            <div className="space-y-4">
              {filteredItems.map((item) =>
                isFreelancer ? (
                  <BidCard key={item.myBid?.id ?? item.job?.id} item={item} />
                ) : (
                  <JobCard key={item.job?.id ?? item.myBid?.id} item={item} />
                ),
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
