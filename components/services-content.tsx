"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, XCircle, Loader2, DollarSign, CheckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentApplication, Document } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Community Tax Certificate",
]

const documentsInfo: Document[] = [
  {
    id: "1",
    name: "Barangay Clearance",
    description: "Official document certifying your good moral character and residency",
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
    requirements: ["Business Registration", "Valid ID", "Proof of Residency", "Business Plan"],
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

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusIcons = {
  Pending: Clock,
  Approved: CheckCircle,
  Completed: CheckCircle,
  Rejected: XCircle,
}

export function ServicesContent() {
  const [applications, setApplications] = useState<DocumentApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    contactNumber: "",
    documentType: "",
    purpose: "",
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Application Submitted",
          description: "Your document application has been submitted successfully.",
        })
        setFormData({
          fullName: "",
          address: "",
          contactNumber: "",
          documentType: "",
          purpose: "",
        })
        fetchApplications()
      } else {
        throw new Error("Failed to submit application")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  useRealtime({
    eventTypes: ["application:updated"],
    onUpdate: (data) => {
      console.log("[v0] Received application update:", data)
      fetchApplications()
    },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <Tabs defaultValue="documents" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Available Documents</TabsTrigger>
          <TabsTrigger value="apply">Apply for Document</TabsTrigger>
          <TabsTrigger value="status">Track Application</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Barangay Documents</h2>
              <p className="text-muted-foreground">View available documents, requirements, and pricing</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentsInfo.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {doc.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Price:</span>
                        <Badge variant="secondary" className="text-base">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {doc.price === 0 ? "FREE" : `₱${doc.price}`}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Document Application Form</CardTitle>
              <CardDescription>Fill out the form below to apply for barangay documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      placeholder="+63-912-345-6789"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, Barangay Matiao"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                    required
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
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
                    placeholder="Please state the purpose of your application..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>Track the status of your document applications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-2">Submit your first application to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const StatusIcon = statusIcons[application.status]
                    return (
                      <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{application.documentType}</h3>
                            <p className="text-sm text-muted-foreground">{application.fullName}</p>
                          </div>
                          <Badge className={statusColors[application.status]}>
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
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
