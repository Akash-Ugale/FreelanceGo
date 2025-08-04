"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Star,
  Clock,
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"


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
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedTab, setSelectedTab] = useState("overview")

  const data = userRole === "freelancer" ? freelancerAnalytics : clientAnalytics

  const getChangePercentage = (current, previous) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    }
  }

  const earningsChange = getChangePercentage(
    userRole === "freelancer" ? data.overview.thisMonth : data.overview.thisMonth,
    userRole === "freelancer" ? freelancerAnalytics.overview.lastMonth : clientAnalytics.overview.lastMonth,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === "freelancer"
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
              {userRole === "freelancer" ? "Total Earnings" : "Total Spent"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(userRole === "freelancer" ? data.overview.totalEarnings : data.overview.totalSpent).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {earningsChange.isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={earningsChange.isPositive ? "text-green-500" : "text-red-500"}>
                {earningsChange.value}%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "freelancer" ? "Avg Rating" : "Hired Freelancers"}
            </CardTitle>
            {userRole === "freelancer" ? (
              <Star className="h-4 w-4 text-yellow-600" />
            ) : (
              <Users className="h-4 w-4 text-purple-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === "freelancer" ? data.overview.avgRating : data.overview.hiredFreelancers}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === "freelancer" ? "Client satisfaction" : "Total hired"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "freelancer" ? "Success Rate" : "Avg Time to Hire"}
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === "freelancer"
                ? `${((data.overview.proposalsAccepted / data.overview.proposalsSent) * 100).toFixed(1)}%`
                : `${data.overview.avgTimeToHire} days`}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === "freelancer" ? "Proposal acceptance" : "Average hiring time"}
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
                {userRole === "freelancer" ? "Earnings Trend" : "Spending Trend"}
              </CardTitle>
              <CardDescription>
                {userRole === "freelancer" ? "Track your income over time" : "Monitor your project spending patterns"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(userRole === "freelancer" ? data.earningsTrend : data.spendingTrend).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(item.amount / Math.max(...(userRole === "freelancer" ? data.earningsTrend : data.spendingTrend).map((d) => d.amount))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-16 text-right">${item.amount.toLocaleString()}</span>
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
                {userRole === "freelancer" ? "Top Skills" : "Category Breakdown"}
              </CardTitle>
              <CardDescription>
                {userRole === "freelancer" ? "Your most profitable skills" : "Spending by project category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRole === "freelancer"
                  ? data.skillsPerformance.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.skill}</span>
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
                          value={(skill.earnings / Math.max(...data.skillsPerformance.map((s) => s.earnings))) * 100}
                          className="h-2"
                        />
                      </div>
                    ))
                  : data.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <Badge variant="secondary" className="text-xs">
                            ${category.spent.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{category.projects} projects</div>
                        <Progress
                          value={(category.spent / Math.max(...data.categoryBreakdown.map((c) => c.spent))) * 100}
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
        {userRole === "freelancer" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Client Satisfaction</CardTitle>
                <CardDescription>Breakdown of client feedback ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Excellent (5 stars)</span>
                      <span className="text-sm font-medium">{data.clientSatisfaction.excellent}%</span>
                    </div>
                    <Progress value={data.clientSatisfaction.excellent} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Good (4 stars)</span>
                      <span className="text-sm font-medium">{data.clientSatisfaction.good}%</span>
                    </div>
                    <Progress value={data.clientSatisfaction.good} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average (3 stars)</span>
                      <span className="text-sm font-medium">{data.clientSatisfaction.average}%</span>
                    </div>
                    <Progress value={data.clientSatisfaction.average} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Poor (1-2 stars)</span>
                      <span className="text-sm font-medium">{data.clientSatisfaction.poor}%</span>
                    </div>
                    <Progress value={data.clientSatisfaction.poor} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Performance Insights</CardTitle>
                <CardDescription>Key metrics and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Strong Performance</p>
                      <p className="text-xs text-muted-foreground">Your React skills are in high demand</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Opportunity</p>
                      <p className="text-xs text-muted-foreground">Consider raising your hourly rate by 15%</p>
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
                <CardDescription>Your recruitment performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Time to Hire</span>
                    <span className="text-lg font-bold">{data.hiringMetrics.timeToHire} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Proposals per Job</span>
                    <span className="text-lg font-bold">{data.hiringMetrics.proposalsPerJob}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful Hires</span>
                    <span className="text-lg font-bold">{data.hiringMetrics.successfulHires}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rehire Rate</span>
                    <span className="text-lg font-bold">{data.hiringMetrics.rehireRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hiring Insights</CardTitle>
                <CardDescription>Recommendations to improve your hiring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Great Hiring Rate</p>
                      <p className="text-xs text-muted-foreground">85% of your job posts result in successful hires</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">High Rehire Rate</p>
                      <p className="text-xs text-muted-foreground">65% of freelancers work with you again</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
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
