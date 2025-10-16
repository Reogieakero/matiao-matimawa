"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentApplication } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Barangay ID",
  "Other",
]

export function ManageApplications() {
  const [applications, setApplications] = useState<DocumentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDocument, setFilterDocument] = useState<string>("All")
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications")
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("[v0] Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string, fullName: string) => {
    try {
      const response = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Application status changed to ${newStatus}`,
        })
        addActivityLog("UPDATE_APPLICATION", `Changed status of ${fullName}'s application to ${newStatus}`)
        fetchApplications()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const filteredApplications = applications.filter(
    (app) => filterDocument === "All" || app.documentType === filterDocument,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Applications</h2>
          <p className="text-muted-foreground">Review and update document application status</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterDocument === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterDocument("All")}
        >
          All
        </Button>
        {documentTypes.map((docType) => (
          <Button
            key={docType}
            variant={filterDocument === docType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterDocument(docType)}
          >
            {docType}
          </Button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 line-clamp-1">{application.fullName}</CardTitle>
                    <Badge className={statusColors[application.status]}>{application.status}</Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Document:</span>
                    <p className="font-medium">{application.documentType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Purpose:</span>
                    <p className="font-medium line-clamp-2">{application.purpose}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contact:</span>
                    <p className="font-medium">{application.contactNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <p className="font-medium">
                      {new Date(application.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Select
                  value={application.status}
                  onValueChange={(value) => handleStatusChange(application.id, value, application.fullName)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
