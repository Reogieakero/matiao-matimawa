export type AnnouncementCategory =
  | "General"
  | "Health"
  | "Emergency"
  | "Events"
  | "Public Safety"
  | "Community Development"

export interface Announcement {
  id: string
  title: string
  category: AnnouncementCategory
  content: string
  date: string
  createdAt: string
  posterUrl?: string
}

export type HotlineCategory = "Fire" | "Police" | "Army" | "Medical" | "Disaster Response" | "Other"

export interface Hotline {
  id: string
  name: string
  department: string
  number: string
  description?: string
  category?: HotlineCategory
}

export type OfficialStatus = "On Duty" | "On Leave" | "On Site"

export type OfficialCategory = "Barangay Officials" | "SK" | "Staff"

export interface Official {
  id: string
  name: string
  position: string
  contact: string
  status: OfficialStatus
  category: OfficialCategory
  imageUrl?: string
}

export interface DocumentApplication {
  id: string
  fullName: string
  address: string
  contactNumber: string
  documentType: string
  purpose: string
  status: "Pending" | "Approved" | "Completed" | "Rejected"
  submittedAt: string
  updatedAt: string
}

export interface Document {
  id: string
  name: string
  description: string
  requirements: string[]
  price: number
}

export interface Report {
  id: string
  name?: string
  issueType: string
  description: string
  imageUrl?: string
  status: "Pending" | "Resolved"
  submittedAt: string
  updatedAt: string
}
