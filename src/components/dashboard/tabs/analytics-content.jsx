"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/api/AxiosServiceApi"
import { userRoles } from "@/utils/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Clock,
  DollarSign,
  Download,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { useState ,useEffect} from "react"
import axios from "axios"
const freelancerAnalytics = {
  overview: {
    totalEarnings: 45750,
    thisMonth: 8500,
    lastMonth: 7200,
    activeProjects: 3,
    completedProjects: 28,
    avgRating: 4.8,
    profileViews: 234,
    proposalsSent: 45,
    proposalsAccepted: 12,
  },
  earningsTrend: [
    { month: "Aug", amount: 6200 },
    { month: "Sep", amount: 7100 },
    { month: "Oct", amount: 6800 },
    { month: "Nov", amount: 7200 },
    { month: "Dec", amount: 8100 },
    { month: "Jan", amount: 8500 },
  ],
  skillsPerformance: [
    { skill: "React", projects: 12, earnings: 18500, avgRating: 4.9 },
    { skill: "Node.js", projects: 10, earnings: 15200, avgRating: 4.8 },
    { skill: "Python", projects: 8, earnings: 12000, avgRating: 4.7 },
    { skill: "UI/UX", projects: 6, earnings: 9800, avgRating: 4.9 },
  ],
  clientSatisfaction: {
    excellent: 75,
    good: 20,
    average: 5,
    poor: 0,
  },
}

const clientAnalytics = {
  overview: {
    totalSpent: 78500,
    thisMonth: 12300,
    lastMonth: 9800,
    activeProjects: 5,
    completedProjects: 18,
    hiredFreelancers: 12,
    avgProjectRating: 4.6,
    totalJobPosts: 25,
    avgTimeToHire: 3.2,
  },
  spendingTrend: [
    { month: "Aug", amount: 8200 },
    { month: "Sep", amount: 9100 },
    { month: "Oct", amount: 8800 },
    { month: "Nov", amount: 9800 },
    { month: "Dec", amount: 11200 },
    { month: "Jan", amount: 12300 },
  ],
  categoryBreakdown: [
    { category: "Web Development", spent: 32500, projects: 8 },
    { category: "Design", spent: 18200, projects: 6 },
    { category: "Mobile Development", spent: 15800, projects: 4 },
    { category: "Writing", spent: 12000, projects: 7 },
  ],
  hiringMetrics: {
    timeToHire: 3.2,
    proposalsPerJob: 8.5,
    successfulHires: 85,
    rehireRate: 65,
  },
}

export default function AnalyticsContent({ userRole }) {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📊 Fetch Analytics based on user role
   useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Fetching analytics with token:", token);
        console.log(userRole)
        // ✅ Choose API endpoint dynamically
        const response = await apiClient.get(
          `/api/${
            userRole === userRoles.FREELANCER
              ? "freelancer-analytics"
              : "dashboard/client-analytics"
          }`
        );

        console.log("Analytics Response:", response.data);

        // ✅ Set analytics data
        setAnalytics(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userRole]);


  // 📈 Percentage Change Calculator
  const getChangePercentage = (current, previous) => {
    if (!previous || previous === 0) return { value: "0.0", isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    };
  };

 // 🧮 Compute Earnings Change (example metric)
const earningsChange =
  analytics && analytics.overview
    ? getChangePercentage(
        analytics.overview.thisMonth || 0,
        analytics.overview.lastMonth || 0
      )
    : { value: "0.0", isPositive: true }; // Use a fallback

  // 🌀 Loading / Error / Empty states
  if (loading)
    return <p className="p-6 text-muted-foreground">Loading analytics...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!analytics)
    return (
      <p className="p-6 text-muted-foreground">
        No analytics data available.
      </p>
    );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === userRoles.FREELANCER
              ? "Track your freelance performance and growth"
              : "Monitor your hiring metrics and project outcomes"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === userRoles.FREELANCER ? "Total Earnings" : "Total Spent"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(userRole === userRoles.FREELANCER
                ? analytics.overview?.totalEarnings ?? 0 // Safely access overview and use 0 as a fallback
                : analytics.overview?.totalSpent ?? 0      // Safely access overview and use 0 as a fallback
              ).toLocaleString()}
            </div> 

            <p className="text-xs text-muted-foreground flex items-center">
              {earningsChange.isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  earningsChange.isPositive ? "text-green-500" : "text-red-500"
                }
              >
                {earningsChange.value}%
              </span>
              <span className="ml-1">from last month</span>
            </p>
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
            <div className="text-2xl font-bold">
              {analytics.overview?.activeProjects??0}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === userRoles.FREELANCER ? "Avg Rating" : "Hired Freelancers"}
            </CardTitle>
            {userRole === userRoles.FREELANCER ? (
              <Star className="h-4 w-4 text-yellow-600" />
            ) : (
              <Users className="h-4 w-4 text-purple-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === userRoles.FREELANCER
                ? analytics?.overview?.avgRating ?? 'N/A'
                : analytics?.overview?.hiredFreelancers?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === userRoles.FREELANCER
                ? "Client satisfaction"
                : "Total hired"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === userRoles.FREELANCER ? "Success Rate" : "Avg Time to Hire"}
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === userRoles.FREELANCER
                ? `${(
                    (analytics?.overview?.proposalsAccepted ??0 /
                      analytics?.overview?.proposalsSent ?? 1) *
                    100
                  ).toFixed(1)}%`
                : `${analytics.overview?.avgTimeToHire??'N/A'} days`}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === userRoles.FREELANCER
                ? "Proposal acceptance"
                : "Average hiring time"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {userRole === userRoles.FREELANCER
                  ? "Earnings Trend"
                  : "Spending Trend"}
              </CardTitle>
              <CardDescription>
                {userRole === userRoles.FREELANCER
                  ? "Track your income over time"
                  : "Monitor your project spending patterns"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(userRole === userRoles.FREELANCER
                  ? analytics.earningsTrend??[]
                  : analytics.spendingTrend??[]
                ).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (item.amount /
                                Math.max(
                                  ...(userRole === userRoles.FREELANCER
                                    ? analytics.earningsTrend ?? []
                                    : analytics.spendingTrend ?? []
                                  ).map((d) => d.amount)
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-16 text-right">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {userRole === userRoles.FREELANCER
                  ? "Top Skills"
                  : "Category Breakdown"}
              </CardTitle>
              <CardDescription>
                {userRole === userRoles.FREELANCER
                  ? "Your most profitable skills"
                  : "Spending by project category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRole === userRoles.FREELANCER
                  ? (analytics.skillsPerformance??[]).map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {skill.skill}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            ${skill.earnings.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{skill.projects} projects</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{skill.avgRating}</span>
                          </div>
                        </div>
                        <Progress
                          value={
                            (skill.earnings /
                              Math.max(
                                ...(analytics.skillsPerformance??[]).map((s) => s.earnings)
                              )) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    ))
                  : (analytics.categoryBreakdown??[]).map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {category.category}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            ${category.spent.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.projects} projects
                        </div>
                        <Progress
                          value={
                            (category.spent /
                              Math.max(
                                ...(analytics.categoryBreakdown??[]).map((c) => c.spent)
                              )) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {userRole === userRoles.FREELANCER ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Client Satisfaction</CardTitle>
                <CardDescription>
                  Breakdown of client feedback ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Excellent (5 stars)</span>
                      <span className="text-sm font-medium">
                        {analytics.clientSatisfaction?.excellent??'0'}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.clientSatisfaction?.excellent??'0'}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Good (4 stars)</span>
                      <span className="text-sm font-medium">
                        {analytics.clientSatisfaction?.good??'0'}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.clientSatisfaction?.good??'0'}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average (3 stars)</span>
                      <span className="text-sm font-medium">
                        {analytics.clientSatisfaction?.average??'0'}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.clientSatisfaction?.average??'0'}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Poor (1-2 stars)</span>
                      <span className="text-sm font-medium">
                        {analytics.clientSatisfaction?.poor??'0'}%
                      </span>
                    </div>
                    <Progress
                      value={analytics.clientSatisfaction?.poor??'0'}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Performance Insights</CardTitle>
                <CardDescription>
                  Key metrics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Strong Performance</p>
                      <p className="text-xs text-muted-foreground">
                        Your React skills are in high demand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Opportunity</p>
                      <p className="text-xs text-muted-foreground">
                        Consider raising your hourly rate by 15%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Tip</p>
                      <p className="text-xs text-muted-foreground">
                        Respond to proposals within 2 hours for better success
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hiring Metrics</CardTitle>
                <CardDescription>
                  Your recruitment performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Time to Hire</span>
                    <span className="text-lg font-bold">
                      {analytics.hiringMetrics?.timeToHire??'N/A'} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Proposals per Job</span>
                    <span className="text-lg font-bold">
                      {analytics.hiringMetrics?.proposalsPerJob??'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful Hires</span>
                    <span className="text-lg font-bold">
                      {analytics.hiringMetrics?.successfulHires??'N/A'}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rehire Rate</span>
                    <span className="text-lg font-bold">
                      {analytics.hiringMetrics?.rehireRate??'N/A'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hiring Insights</CardTitle>
                <CardDescription>
                  Recommendations to improve your hiring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border bg-muted rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Great Hiring Rate</p>
                      <p className="text-xs text-muted-foreground">
                        85% of your job posts result in successful hires
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border bg-muted rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">High Rehire Rate</p>
                      <p className="text-xs text-muted-foreground">
                        65% of freelancers work with you again
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Tip</p>
                      <p className="text-xs text-muted-foreground">
                        Detailed job descriptions get 40% more quality proposals
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
  )
}
