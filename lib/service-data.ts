// lib/service-data.ts

import { Clock, CheckCircle, XCircle } from "lucide-react"

// --- Types ---
export type Document = {
  id: string
  name: string
  description: string
  requirements: string[]
  price: number
}

export type DocumentApplication = {
  id: string
  fullName: string
  address: string
  contactNumber: string
  documentType: string
  purpose: string
  submittedAt: string // ISO string
  status: DocumentApplicationStatus
}

export type DocumentApplicationStatus =
  | "Pending"
  | "Approved"
  | "Completed"
  | "Rejected"

// --- Constants ---
export const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Community Tax Certificate",
]

export const documentsInfo: Document[] = [
  {
    id: "1",
    name: "Barangay Clearance",
    description:
      "Official document certifying your good moral character and residency",
    requirements: ["Valid ID", "Proof of Residency", "2x2 Photo"],
    price: 50,
  },
  {
    id: "2",
    name: "Certificate of Residency",
    description: "Proof of residence in Barangay Matiao",
    requirements: ["Valid ID", "Proof of Residency", "Barangay ID"],
    price: 30,
  },
  {
    id: "3",
    name: "Certificate of Indigency",
    description: "Document for indigent individuals for assistance programs",
    requirements: ["Valid ID", "Proof of Residency", "Income Statement"],
    price: 0,
  },
  {
    id: "4",
    name: "Business Permit",
    description: "Authorization to operate a business in the barangay",
    requirements: [
      "Business Registration",
      "Valid ID",
      "Proof of Residency",
      "Business Plan",
    ],
    price: 200,
  },
  {
    id: "5",
    name: "Community Tax Certificate",
    description: "Tax identification document for residents",
    requirements: ["Valid ID", "Proof of Residency", "Income Statement"],
    price: 75,
  },
]

export const statusColors: Record<DocumentApplicationStatus, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Approved:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Rejected:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export const statusIcons = {
  Pending: Clock,
  Approved: CheckCircle,
  Completed: CheckCircle,
  Rejected: XCircle,
}