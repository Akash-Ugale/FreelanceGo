"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { userRoles } from "@/utils/constants";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  Layers,
  Loader2,
  MessageSquare,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/api/AxiosServiceApi.js";

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchMyProposals() {
  const response = await apiClient.get("/api/review-my-proposals");
  return response.data;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyProposals();
        if (!cancelled) setProposals(data);
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message ?? "Failed to load proposals.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { proposals, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN").format(amount);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function base64ToDataUrl(base64) {
  if (!base64) return undefined;
  return `data:image/png;base64,${base64}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_META = {
  ACTIVE: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    color: "bg-red-100 text-red-600 border-red-200",
  },
  "UNDER REVIEW": {
    label: "Under Review",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  NEW: {
    label: "New",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  INTERVIEWED: {
    label: "Interviewed",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
};

function StatusBadge({ status = "" }) {
  const meta = STATUS_META[status.toUpperCase()] ?? {
    label: status,
    color: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}

// ─── Experience Badge ─────────────────────────────────────────────────────────

const EXP_META = {
  ENTRY: {
    label: "Entry Level",
    color: "bg-sky-50 text-sky-600 border-sky-200",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    color: "bg-violet-50 text-violet-600 border-violet-200",
  },
  EXPERT: {
    label: "Expert",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
};

function ExperienceBadge({ level }) {
  if (!level) return null;
  const meta = EXP_META[level.toUpperCase()] ?? {
    label: level,
    color: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${meta.color}`}
    >
      <Layers className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({ proposal, userRole }) {
  const { clientDto } = proposal;
  const avatarSrc = base64ToDataUrl(clientDto?.userDto?.imageData);
  const displayName =
    clientDto?.companyName ?? clientDto?.userDto?.username ?? "Client";

  const durationDays =
    proposal.projectStartTime && proposal.projectEndTime
      ? Math.ceil(
          (new Date(proposal.projectEndTime) -
            new Date(proposal.projectStartTime)) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  return (
    <div className="border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-card">
      {/* ── Top bar: title + status ── */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-base leading-snug truncate">
            {proposal.jobTitle}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="text-[9px]">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{displayName}</span>
            {clientDto?.userDto?.email && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {clientDto.userDto.email}
                </span>
              </>
            )}
            {clientDto?.phone && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {clientDto.phone}
                </span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border/60 mx-5" />

      {/* ── Description ── */}
      {proposal.jobDescription && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 px-5 pt-3">
          {proposal.jobDescription}
        </p>
      )}

      {/* ── Skills ── */}
      {proposal.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-3">
          {proposal.requiredSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs px-2 py-0"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {/* ── Meta row: dates · duration · experience ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 pt-3 text-xs text-muted-foreground">
        {proposal.projectStartTime && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(proposal.projectStartTime)}</span>
            {proposal.projectEndTime && (
              <>
                <span className="mx-0.5">→</span>
                <span>{formatDate(proposal.projectEndTime)}</span>
              </>
            )}
          </div>
        )}
        {durationDays != null && (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {durationDays} days
          </div>
        )}
        <ExperienceBadge level={proposal.experienceLevel} />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border/60 mx-5 mt-4" />

      {/* ── Footer: budget + posted date + actions ── */}
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        {/* Budget */}
        <div className="flex items-baseline gap-1">
          <div className="flex items-center text-lg font-bold tabular-nums">
            <IndianRupee className="h-4 w-4" />
            {formatBudget(proposal.budget)}
          </div>
          <span className="text-xs text-muted-foreground">budget</span>
          {proposal.createdAt && (
            <>
              <span className="text-muted-foreground/40 mx-1">·</span>
              <span className="text-xs text-muted-foreground">
                Posted {formatDate(proposal.createdAt)}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {proposal.file && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent h-8 px-3 text-xs"
              onClick={() => window.open(proposal.file, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Brief
            </Button>
          )}
          {userRole === userRoles.CLIENT ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent h-8 px-3 text-xs"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Message
              </Button>
              <Button size="sm" className="h-8 px-3 text-xs">
                Hire
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent h-8 px-3 text-xs"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ title, value, sub, icon: Icon, iconClass }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconClass ?? "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ProposalsContent({ userRole }) {
  const { proposals, loading, error } = useProposals();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const stats = useMemo(
    () => ({
      total: proposals.length,
      active: proposals.filter((p) => p.status === "ACTIVE").length,
      pending: proposals.filter((p) => p.status === "PENDING").length,
      declined: proposals.filter((p) => p.status === "DECLINED").length,
    }),
    [proposals],
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(proposals.map((p) => p.status).filter(Boolean))],
    [proposals],
  );

  const filtered = useMemo(
    () =>
      proposals.filter((p) => {
        const matchSearch =
          !searchTerm ||
          p.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.clientDto?.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.requiredSkills?.some((s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase()),
          );

        const matchStatus =
          statusFilter === "all" ||
          p.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchSearch && matchStatus;
      }),
    [proposals, searchTerm, statusFilter],
  );

  const isFreelancer = userRole === userRoles.FREELANCER;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading proposals…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {isFreelancer ? "My Proposals" : "Review Proposals"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isFreelancer
              ? "Track your submitted proposals and their status"
              : "Review and manage incoming proposals from freelancers"}
          </p>
        </div>
        {!isFreelancer && (
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={stats.total}
          sub="All proposals"
          icon={FileText}
        />
        <StatCard
          title="Active"
          value={stats.active}
          sub="Currently open"
          icon={CheckCircle}
          iconClass="text-emerald-600"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          sub="Awaiting action"
          icon={Clock}
          iconClass="text-amber-500"
        />
        <StatCard
          title="Declined"
          value={stats.declined}
          sub="Not selected"
          icon={XCircle}
          iconClass="text-red-500"
        />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title, client, or skill…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((s) => (
              <SelectItem key={s} value={s.toLowerCase()}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {isFreelancer ? "Submitted Proposals" : "Received Proposals"}
          </CardTitle>
          <CardDescription>
            {filtered.length} of {proposals.length} proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Briefcase className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No proposals found</p>
              <p className="text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userRole={userRole}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
