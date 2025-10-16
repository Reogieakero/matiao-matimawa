export interface ActivityLog {
  id: string
  action: string
  details: string
  timestamp: string
}

export const activityLogs: ActivityLog[] = []

export function addActivityLog(action: string, details: string) {
  activityLogs.unshift({
    id: Date.now().toString(),
    action,
    details,
    timestamp: new Date().toISOString(),
  })
  // Keep only last 100 logs
  if (activityLogs.length > 100) {
    activityLogs.pop()
  }
}
