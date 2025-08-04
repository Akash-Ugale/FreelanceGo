"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from "lucide-react"

const freelancerEarnings = {
  totalEarnings: 45750,
  thisMonth: 8500,
  lastMonth: 7200,
  pendingPayments: 2400,
  availableBalance: 6100,
  transactions: [
    {
      id: 1,
      project: "E-commerce Website Development",
      client: "TechCorp Inc.",
      amount: 2000,
      status: "Completed",
      date: "2024-01-25",
      type: "milestone",
    },
    {
      id: 2,
      project: "Mobile App UI/UX Design",
      client: "FitLife Startup",
      amount: 1500,
      status: "Completed",
      date: "2024-01-20",
      type: "milestone",
    },
    {
      id: 3,
      project: "Content Writing for Tech Blog",
      client: "DevInsights Media",
      amount: 800,
      status: "Pending",
      date: "2024-01-22",
      type: "hourly",
    },
    {
      id: 4,
      project: "API Integration Project",
      client: "DataTech Solutions",
      amount: 1200,
      status: "Completed",
      date: "2024-01-18",
      type: "fixed",
    },
  ],
}

const clientPayments = {
  totalEarnings: 78500, // Changed from totalSpent to totalEarnings
  thisMonth: 12300,
  lastMonth: 9800,
  pendingPayments: 3200,
  availableBalance: 8500, // Changed from escrowBalance to availableBalance
  transactions: [
    {
      id: 1,
      project: "Full-Stack Web Development",
      freelancer: "Sarah Johnson",
      amount: 3500,
      status: "Released",
      date: "2024-01-25",
      type: "milestone",
    },
    {
      id: 2,
      project: "Brand Identity Design",
      freelancer: "Mike Chen",
      amount: 2200,
      status: "In Escrow",
      date: "2024-01-23",
      type: "milestone",
    },
    {
      id: 3,
      project: "Mobile App Development",
      freelancer: "Emily Rodriguez",
      amount: 4500,
      status: "Released",
      date: "2024-01-20",
      type: "fixed",
    },
    {
      id: 4,
      project: "Content Strategy",
      freelancer: "Alex Rivera",
      amount: 1800,
      status: "Pending Release",
      date: "2024-01-22",
      type: "hourly",
    },
  ],
}



export default function EarningsContent({ userRole }) {
  const [timeFilter, setTimeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const data = userRole === "freelancer" ? freelancerEarnings : clientPayments

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "released":
        return "default"
      case "pending":
      case "pending release":
        return "secondary"
      case "in escrow":
        return "outline"
      default:
        return "outline"
    }
  }

  const getChangePercentage = () => {
    const change = ((data.thisMonth - data.lastMonth) / data.lastMonth) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    }
  }

  const change = getChangePercentage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {userRole === "freelancer" ? "Earnings" : "Payments"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {userRole === "freelancer"
              ? "Track your freelance income and payments"
              : "Manage your project payments and expenses"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {userRole === "freelancer" && (
            <Button size="sm">
              <Wallet className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "freelancer" ? "Total Earnings" : "Total Spent"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time {userRole === "freelancer" ? "earnings" : "spending"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {change.isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={change.isPositive ? "text-green-500" : "text-red-500"}>{change.value}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "freelancer" ? "Pending Payments" : "Pending Releases"}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === "freelancer" ? "Awaiting release" : "Awaiting approval"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "freelancer" ? "Available Balance" : "Escrow Balance"}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.availableBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === "freelancer" ? "Ready to withdraw" : "Held in escrow"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">
                {userRole === "freelancer" ? "Earnings History" : "Payment History"}
              </CardTitle>
              <CardDescription>
                {userRole === "freelancer"
                  ? "Track your income from completed projects"
                  : "Monitor your project payments and releases"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-escrow">In Escrow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-base">{transaction.project}</h4>
                  <p className="text-sm text-muted-foreground">
                    {userRole === "freelancer" ? transaction.client : transaction.freelancer}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    <span>{transaction.date}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">${transaction.amount.toLocaleString()}</div>
                    <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                      {transaction.status === "Completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {transaction.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                      {transaction.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods / Withdrawal Options */}
      {userRole === "freelancer" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Withdrawal Methods</CardTitle>
            <CardDescription>Manage your payout preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium">Bank Transfer</h4>
                  <p className="text-sm text-muted-foreground">Direct deposit to your bank account</p>
                </div>
                <Badge variant="default">Primary</Badge>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Wallet className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium">PayPal</h4>
                  <p className="text-sm text-muted-foreground">Instant transfer to PayPal</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
