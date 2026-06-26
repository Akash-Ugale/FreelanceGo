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
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  IndianRupee,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/api/AxiosServiceApi.js";


// ─── API helper ────────────────────────────────────────────────────────────────
const fetchEarnings = async (page, size) => {
  const res = await apiClient.get(
    `/api/earnings-dashboard?page=${page}&size=${size}`
  )
  return res.data
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

const getStatusMeta = (status) => {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Completed",
      }
    case "active":
      return {
        color: "bg-blue-100 text-blue-800",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Active",
      }
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="h-4 w-4" />,
        label: "Pending",
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: <Clock className="h-4 w-4" />,
        label: status || "Unknown",
      }
  }
}

const MONTHLY_GOAL = 5000

// ─── Component ─────────────────────────────────────────────────────────────────
export default function EarningsContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const pageSize = 5

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchEarnings(page, pageSize)
      setData(result)
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  // ── Derived values ────────────────────────────────────────────────────────
  const totalEarnings = data?.totalEarnings ?? 0
  const inEscrow = data?.inEscrow ?? 0
  const avgPerProject = data?.avgEarningsPerProject ?? 0
  const contracts = data?.recentContracts ?? []
  const totalPages = data?.totalPages ?? 1
  const totalContracts = data?.totalContracts ?? 0

  const completedCount = contracts.filter(
    (c) => (c.status || "").toLowerCase() === "completed"
  ).length
  const activeCount = contracts.filter(
    (c) => (c.status || "").toLowerCase() === "active"
  ).length

  const goalProgress = Math.min((totalEarnings / MONTHLY_GOAL) * 100, 100)

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading earnings…</p>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
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

      {/* ── Overview Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalContracts} contract{totalContracts !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(inEscrow)}</div>
            <p className="text-xs text-muted-foreground">Held in active contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Project</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(avgPerProject)}</div>
            <p className="text-xs text-muted-foreground">From completed contracts</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
            <CardDescription>Breakdown of your current earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Completed Earnings */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-green-100">
                      Completed Earnings
                    </p>
                    <p className="text-xs text-gray-600 dark:text-green-300">
                      Released to you
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-green-700 dark:text-green-400">
                <IndianRupee className="h-5 w-5" />
                {fmt(totalEarnings)}
              </div>
              </div>

              {/* In Escrow */}
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-blue-100">
                      In Escrow
                    </p>
                    <p className="text-xs text-gray-600 dark:text-blue-300">
                      Held in active contracts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-blue-700 dark:text-blue-400">
                  <IndianRupee className="h-5 w-5" />
                  {fmt(inEscrow)}
                </div>
              </div>

              {/* Avg per Project */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Avg per Project
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From completed work
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                  <IndianRupee className="h-5 w-5" />
                  {fmt(avgPerProject)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Tax Documents
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Payment Schedule
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* ── Recent Contracts ── */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>Your latest earnings from contracts</CardDescription>
          </div>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-1" />
          )}
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <IndianRupee className="h-8 w-8" />
              <p className="text-sm">No contracts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract, idx) => {
                const meta = getStatusMeta(contract.status)
                const amount = contract.acceptedBid?.amount ?? contract.amount ?? 0
                const jobTitle =
                  contract.job?.jobTitle ??
                  contract.jobTitle ??
                  `Contract #${contract.id ?? idx + 1}`
                const clientName =
                  contract.client?.userDto?.username ??
                  contract.clientName ??
                  "Client"
                const date =
                  contract.createdAt ?? contract.job?.createAt ?? null

                return (
                  <div
                    key={contract.id ?? idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <div>
                        <p className="font-medium">{jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{clientName}</p>
                        {date && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 font-medium">
                        <IndianRupee className="h-4 w-4" />
                        {fmt(amount)}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${meta.color}`}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1 || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Goal Progress ── */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Goal</CardTitle>
         <CardDescription>
          Track your progress toward ₹{MONTHLY_GOAL.toLocaleString()} goal
        </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Earnings</span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {fmt(totalEarnings)}
                  /
                  <IndianRupee className="h-4 w-4" />
                  {MONTHLY_GOAL.toLocaleString()}
                </span>
              </div>
              <Progress value={goalProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(goalProgress)}%
                </p>
                <p className="text-xs text-muted-foreground">Goal Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
