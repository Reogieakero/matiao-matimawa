// components/application-status-card.tsx

import { Badge } from "@/components/ui/badge"
import {
  statusColors,
  statusIcons,
  type DocumentApplication,
  type DocumentApplicationStatus,
} from "@/lib/service-data"

interface ApplicationStatusCardProps {
  application: DocumentApplication
  index: number
}

export function ApplicationStatusCard({
  application,
  index,
}: ApplicationStatusCardProps) {
  const StatusIcon =
    statusIcons[application.status as DocumentApplicationStatus]

  return (
    <div
      key={application.id}
      // Apply staggered fade-in animation
  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {application.documentType}
          </h3>
          <p className="text-sm text-muted-foreground">
            {application.fullName}
          </p>
        </div>
        <Badge
          className={
            statusColors[application.status as DocumentApplicationStatus]
          }
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {application.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Purpose:</span>
          <p className="font-medium">{application.purpose}</p>
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
    </div>
  )
}