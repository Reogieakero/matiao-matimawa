// components/document-application-form.tsx

import type React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { documentTypes } from "@/lib/service-data"

interface DocumentApplicationFormProps {
  formData: {
    fullName: string
    address: string
    contactNumber: string
    documentType: string
    purpose: string
  }
  submitting: boolean
  handleFormChange: (key: keyof DocumentApplicationFormProps['formData'], value: string) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function DocumentApplicationForm({
  formData,
  submitting,
  handleFormChange,
  handleSubmit,
}: DocumentApplicationFormProps) {
  return (
    <Card>
      <CardHeader className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <CardTitle>Apply for a Document</CardTitle>
        <CardDescription>
          Fill out the form below to request a document from the barangay.
          Please ensure all information is accurate.
        </CardDescription>
      </CardHeader>
      <CardContent className="animate-in fade-in-0 duration-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={(e) =>
                  handleFormChange("fullName", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="09XX-XXX-XXXX"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleFormChange("contactNumber", e.target.value)
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Blk 1 Lot 2, Purok Sampaguita, Barangay Matiao"
              value={formData.address}
              onChange={(e) =>
                handleFormChange("address", e.target.value)
              }
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                required
                value={formData.documentType}
                onValueChange={(value) =>
                  handleFormChange("documentType", value)
                }
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Briefly state the reason for your request (e.g., job application, school enrollment)."
                value={formData.purpose}
                onChange={(e) =>
                  handleFormChange("purpose", e.target.value)
                }
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}