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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userRoles } from "@/utils/constants"
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

export default function EarningsContent({ userRole }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data with consistent structure
  const freelancerEarnings = {
    totalEarnings: 12450.0,
    thisMonth: 2850.0,
    lastMonth: 3200.0,
    pendingPayments: 1250.0,
    availableBalance: 8900.0,
    transactions: [
      {
        id: "1",
        project: "E-commerce Website Development",
        client: "TechCorp Inc.",
        amount: 2500.0,
        date: "2024-01-15",
        status: "completed",
        type: "project",
      },
      {
        id: "2",
        project: "Mobile App UI Design",
        client: "StartupXYZ",
        amount: 1800.0,
        date: "2024-01-10",
        status: "pending",
        type: "milestone",
      },
      {
        id: "3",
        project: "Website Maintenance",
        client: "LocalBiz",
        amount: 450.0,
        date: "2024-01-08",
        status: "completed",
        type: "hourly",
      },
    ],
  }

  const clientPayments = {
    totalEarnings: 8750.0, // Using totalEarnings for consistency
    thisMonth: 1950.0,
    lastMonth: 2100.0,
    pendingPayments: 850.0,
    availableBalance: 5200.0,
    transactions: [
      {
        id: "1",
        project: "Website Redesign",
        freelancer: "John Smith",
        amount: 3200.0,
        date: "2024-01-12",
        status: "completed",
        type: "project",
      },
      {
        id: "2",
        project: "Logo Design",
        freelancer: "Sarah Johnson",
        amount: 850.0,
        date: "2024-01-09",
        status: "in_escrow",
        type: "milestone",
      },
      {
        id: "3",
        project: "Content Writing",
        freelancer: "Mike Davis",
        amount: 600.0,
        date: "2024-01-05",
        status: "completed",
        type: "hourly",
      },
    ],
  }

  const data =
    userRole === userRoles.FREELANCER ? freelancerEarnings : clientPayments
  const monthlyChange = (
    ((data.thisMonth - data.lastMonth) / data.lastMonth) *
    100
  ).toFixed(1)
  const isPositiveChange = Number.parseFloat(monthlyChange) > 0

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_escrow":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_escrow":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Earnings
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View your earnings and transactions.
        </p>
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === userRoles.FREELANCER
                ? "Total Earnings"
                : "Total Spent"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time{" "}
              {userRole === userRoles.FREELANCER ? "earnings" : "spending"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.thisMonth.toLocaleString()}
            </div>
            <p
              className={`text-xs ${
                isPositiveChange ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositiveChange ? "+" : ""}
              {monthlyChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === userRoles.FREELANCER
                ? "Pending Payments"
                : "In Escrow"}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === userRoles.FREELANCER
                ? "Awaiting release"
                : "Held in escrow"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.availableBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {userRole === userRoles.FREELANCER ? "Earnings" : "Spending"}{" "}
              Overview
            </CardTitle>
            <CardDescription>
              Your {userRole === userRoles.FREELANCER ? "earnings" : "spending"}{" "}
              trend over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Mock chart area */}
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Chart visualization would go here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userRole === userRoles.FREELANCER ? (
              <>
                <Button className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Tax Documents
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Payment Schedule
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipts
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest{" "}
            {userRole === userRoles.FREELANCER ? "earnings" : "payments"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.project}</p>
                    <p className="text-sm text-muted-foreground">
                      {userRole === userRoles.FREELANCER
                        ? transaction.client
                        : transaction.freelancer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${transaction.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>
            Track your{" "}
            {userRole === userRoles.FREELANCER ? "earnings" : "spending"} goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Goal</span>
                <span>${data.thisMonth.toLocaleString()} / $5,000</span>
              </div>
              <Progress value={(data.thisMonth / 5000) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((data.thisMonth / 5000) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Goal Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    data.transactions.filter((t) => t.status === "completed")
                      .length
                  }
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    data.transactions.filter((t) => t.status === "pending")
                      .length
                  }
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
