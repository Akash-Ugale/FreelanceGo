"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/api/AxiosServiceApi";
import { useAuth } from "@/context/AuthContext";
import { userRoles } from "@/utils/constants";
import {
  Briefcase,
  Clock,
  IndianRupee,
  Download,
  Star,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AnalyticsContent() {
  // ✅ useAuth() called INSIDE the component — correct
  const { userRole, userId } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFreelancer = userRole === userRoles.FREELANCER;

  useEffect(() => {
    if (!userRole) return;
    // Guard: client needs userId before calling
    if (!isFreelancer && !userId) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Freelancer → GET /api/freelancer-analytics
        // Client     → GET /api/dashboard/client-analytics/{userId}
        const endpoint = isFreelancer
          ? "/api/freelancer-analytics"
          : `/api/dashboard/client-analytics/${userId}`;
        console.log(userId);
        const res = await apiClient.get(endpoint);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err?.response?.data ?? err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    })();
    console.log("userRole:", userRole);
    console.log("userId:", userId);
  }, [userRole, userId]);

  if (loading)
    return (
      <div className="p-10 text-center text-muted-foreground flex justify-center">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    );
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;
  if (!analytics)
    return (
      <p className="p-6 text-muted-foreground text-center">
        No analytics data available.
      </p>
    );

  // ── Shared ─────────────────────────────────────────────────────────────────
  const totalMoney = isFreelancer
    ? (analytics.totalEarnings ?? 0)
    : (analytics.totalSpent ?? 0);
  const activeProjectsCount = analytics.activeProjects ?? 0;


  const handleExport = () => {
  const blob = new Blob(
    [JSON.stringify(analytics, null, 2)],
    { type: "application/json" }
  );

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics.json";
  a.click();

  window.URL.revokeObjectURL(url);
};

  // ── Freelancer: categoryEarnings + jobsWonPerCategory ─────────────────────
  const skillsData = Object.entries(analytics.categoryEarnings || {}).map(
    ([skill, earnings]) => ({
      skill,
      earnings,
      projects: analytics.jobsWonPerCategory?.[skill] ?? 0,
    }),
  );
  const maxSkillEarnings =
    skillsData.length > 0
      ? Math.max(...skillsData.map((s) => s.earnings || 0))
      : 1;

  // ── Client: categorySpending ──────────────────────────────────────────────
  const categoryData = Object.entries(analytics.categorySpending || {}).map(
    ([category, spent]) => ({
      category,
      spent,
    }),
  );
  const maxCategorySpent =
    categoryData.length > 0
      ? Math.max(...categoryData.map((c) => c.spent || 0))
      : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {isFreelancer
              ? "Track your freelance performance and growth"
              : "Monitor your hiring metrics and project outcomes"}
          </p>
        </div>
        <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={handleExport}
            >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Earnings / Total Spent → totalEarnings / totalSpent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFreelancer ? "Total Earnings" : "Total Spent"}
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalMoney.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isFreelancer
                ? "From completed contracts"
                : "Across all contracts"}
            </p>
          </CardContent>
        </Card>

        {/* 2. Active Projects → activeProjects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently running
            </p>
          </CardContent>
        </Card>

        {/* 3. winRatePercent / hiredFreelancers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFreelancer ? "Win Rate" : "Hired Freelancers"}
            </CardTitle>
            {isFreelancer ? (
              <Star className="h-4 w-4 text-yellow-600" />
            ) : (
              <Users className="h-4 w-4 text-purple-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFreelancer
                ? `${(analytics.winRatePercent ?? 0).toFixed(1)}%`
                : (analytics.hiredFreelancers ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isFreelancer ? "Proposals accepted" : "Distinct freelancers"}
            </p>
          </CardContent>
        </Card>

        {/* 4. avgTimeToCompleteDays / avgTimeToHire */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFreelancer ? "Avg Completion" : "Avg Time to Hire"}
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFreelancer
                ? `${(analytics.avgTimeToCompleteDays ?? 0).toFixed(0)} days`
                : `${(analytics.avgTimeToHire ?? 0).toFixed(0)} days`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isFreelancer ? "Per project" : "Job post to hire"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Middle Row ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Overview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {isFreelancer ? "Performance Overview" : "Hiring Overview"}
              </CardTitle>
              <CardDescription>
                {isFreelancer
                  ? "Key metrics across your contracts and bids"
                  : "Recruitment and spend breakdown"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFreelancer ? (
                <div className="space-y-5">
                  {/* proposalsSubmitted */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Send className="h-4 w-4" /> Proposals Submitted
                    </span>
                    <span className="text-lg font-bold">
                      {analytics.proposalsSubmitted ?? 0}
                    </span>
                  </div>

                  {/* completedProjects */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />{" "}
                      Completed Projects
                    </span>
                    <span className="text-lg font-bold">
                      {analytics.completedProjects ?? 0}
                    </span>
                  </div>

                  {/* avgBidAmount */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Bid Amount
                    </span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {(analytics.avgBidAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {/* winRatePercent */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-bold">
                        {(analytics.winRatePercent ?? 0).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.winRatePercent ?? 0}
                      className="h-2"
                    />
                  </div>

                  {/* rehireRatePercent */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Client Rehire Rate
                      </span>
                      <span className="font-bold">
                        {(analytics.rehireRatePercent ?? 0).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.rehireRatePercent ?? 0}
                      className="h-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* avgProposalsPerJob */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Proposals Per Job
                    </span>
                    <span className="text-lg font-bold">
                      {(analytics.avgProposalsPerJob ?? 0).toFixed(1)}
                    </span>
                  </div>

                  {/* successfulHireRate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Successful Hire Rate
                      </span>
                      <span className="font-bold">
                        {(analytics.successfulHireRate ?? 0).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.max(
                        0,
                        Math.min(analytics.successfulHireRate ?? 0, 100)
                      )}
                      className="h-2"
                    />
                  </div>

                  {/* rehireRate — COUNT not % */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Freelancers Rehired
                    </span>
                    <span className="text-lg font-bold">
                      {analytics.rehireRate ?? 0}
                    </span>
                  </div>

                  {/* avgTimeToHire */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Time to Hire
                    </span>
                    <span className="text-lg font-bold">
                      {(analytics.avgTimeToHire ?? 0).toFixed(0)} days
                    </span>
                  </div>

                  {/* totalSpent */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Spent
                    </span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {(analytics.totalSpent ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Category chart */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {isFreelancer ? "Earnings by Category" : "Spending by Category"}
              </CardTitle>
              <CardDescription>
                {isFreelancer
                  ? "Income across job categories"
                  : "Budget by category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {isFreelancer ? (
                  skillsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      No category data available.
                    </p>
                  ) : (
                    skillsData.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.skill}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            ₹{(item.earnings || 0).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.projects} job{item.projects !== 1 ? "s" : ""}{" "}
                          won
                        </div>
                        <Progress
                          value={
                            ((item.earnings || 0) / maxSkillEarnings) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    ))
                  )
                ) : categoryData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No category data available.
                  </p>
                ) : (
                  categoryData.map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate pr-2">
                          {cat.category}
                        </span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          ₹{(cat.spent || 0).toLocaleString()}
                        </Badge>
                      </div>
                      <Progress
                        value={
                          maxCategorySpent > 0
                            ? ((cat.spent || 0) / maxCategorySpent) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isFreelancer ? (
          <>
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Performance Summary</CardTitle>
                <CardDescription>
                  All metrics from your analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      label: "Win Rate",
                      value: `${(analytics.winRatePercent ?? 0).toFixed(1)}%`,
                      progress: analytics.winRatePercent ?? 0,
                    },
                    {
                      label: "Rehire Rate",
                      value: `${(analytics.rehireRatePercent ?? 0).toFixed(1)}%`,
                      progress: analytics.rehireRatePercent ?? 0,
                    },
                    {
                      label: "Completed Projects",
                      value: `${analytics.completedProjects ?? 0}`,
                      progress: Math.min(
                        (analytics.completedProjects ?? 0) * 10,
                        100,
                      ),
                    },
                    {
                      label: "Proposals Submitted",
                      value: `${analytics.proposalsSubmitted ?? 0}`,
                      progress: Math.min(
                        (analytics.proposalsSubmitted ?? 0) * 5,
                        100,
                      ),
                    },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {stat.label}
                        </span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                      <Progress value={stat.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Freelancer Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Performance Insights</CardTitle>
                <CardDescription>
                  Key metrics and recommendations
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">

                  {/* Earnings */}
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-green-100">
                          Earnings
                        </p>
                        <p className="text-xs text-gray-600 dark:text-green-300">
                          Total ₹
                          {(analytics.totalEarnings ?? 0).toLocaleString()} earned across
                          all completed contracts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Opportunity */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-blue-100">
                          Opportunity
                        </p>
                        <p className="text-xs text-gray-600 dark:text-blue-300">
                          {(analytics.winRatePercent ?? 0) >= 50
                            ? "Great win rate! Keep applying to relevant projects."
                            : "Tailor proposals more closely to each job requirement."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-yellow-100">
                          Tip
                        </p>
                        <p className="text-xs text-gray-600 dark:text-yellow-300">
                          Respond to new proposals within 2 hours for better success rates.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Client: Hiring Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hiring Metrics</CardTitle>
                <CardDescription>
                  Your recruitment performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Avg Time to Hire
                    </span>
                    <span className="text-lg font-bold">
                      {(analytics.avgTimeToHire ?? 0).toFixed(0)} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Proposals per Job
                    </span>
                    <span className="text-lg font-bold">
                      {(analytics.avgProposalsPerJob ?? 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Successful Hire Rate
                    </span>
                    <span className="text-lg font-bold">
                      {(analytics.successfulHireRate ?? 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Freelancers Rehired
                    </span>
                    <span className="text-lg font-bold">
                      {analytics.rehireRate ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hiring Insights</CardTitle>
                <CardDescription>
                  Recommendations to improve your hiring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border bg-muted/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Solid Hiring Rate</p>
                      <p className="text-xs text-muted-foreground">
                        Your job posts consistently attract quality talent.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Talent Retention</p>
                      <p className="text-xs text-muted-foreground">
                        {(analytics.rehireRate ?? 0) > 0
                          ? `${analytics.rehireRate} freelancer(s) have worked with you more than once.`
                          : "Build long-term relationships by rehiring trusted freelancers."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Tip</p>
                      <p className="text-xs text-muted-foreground">
                        Detailed job descriptions can reduce Time-to-Hire by up
                        to 30%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
