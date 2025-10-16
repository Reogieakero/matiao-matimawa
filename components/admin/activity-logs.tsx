"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { activityLogs } from "@/lib/activity-log"
import { Activity } from "lucide-react"

const actionColors: Record<string, string> = {
  CREATE_ANNOUNCEMENT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UPDATE_ANNOUNCEMENT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE_ANNOUNCEMENT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CREATE_HOTLINE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UPDATE_HOTLINE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE_HOTLINE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  UPDATE_OFFICIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  UPDATE_APPLICATION: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  UPDATE_REPORT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

export function ActivityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <p className="text-muted-foreground">Track all admin activities and changes</p>
      </div>

      {activityLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No activity logs yet</p>
            <p className="text-sm text-muted-foreground mt-2">Actions will be logged here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <Card key={log.id}>
              <CardHeader className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={actionColors[log.action] || "bg-muted text-muted-foreground"}>
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{log.details}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
