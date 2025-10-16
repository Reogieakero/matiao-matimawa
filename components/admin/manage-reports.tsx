"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Report } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

const issueTypes = [
  "Infrastructure",
  "Public Safety",
  "Health & Sanitation",
  "Noise Complaint",
  "Street Lighting",
  "Waste Management",
  "Water Supply",
  "Other",
]

export function ManageReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filterIssue, setFilterIssue] = useState<string>("All")
  const { toast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("[v0] Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: "Pending" | "Resolved", issueType: string) => {
    try {
      const response = await fetch("/api/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Report marked as ${newStatus}`,
        })
        addActivityLog("UPDATE_REPORT", `Marked ${issueType} report as ${newStatus}`)
        fetchReports()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const filteredReports = reports.filter((report) => filterIssue === "All" || report.issueType === filterIssue)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Reports</h2>
        <p className="text-muted-foreground">Review and resolve community reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filterIssue === "All" ? "default" : "outline"} size="sm" onClick={() => setFilterIssue("All")}>
          All
        </Button>
        {issueTypes.map((issue) => (
          <Button
            key={issue}
            variant={filterIssue === issue ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterIssue(issue)}
          >
            {issue}
          </Button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reports found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 line-clamp-1">{report.issueType}</CardTitle>
                    <Badge className={statusColors[report.status]}>{report.status}</Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">{report.name ? `By: ${report.name}` : "Anonymous"}</p>
                  <p className="line-clamp-3">{report.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {report.status === "Pending" ? (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(report.id, "Resolved", report.issueType)}
                    className="w-full"
                  >
                    Mark Resolved
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(report.id, "Pending", report.issueType)}
                    className="w-full"
                  >
                    Reopen
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
