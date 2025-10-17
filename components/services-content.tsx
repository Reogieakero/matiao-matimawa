// components/services-content.tsx
"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRealtime } from "@/hooks/use-realtime"
import { DocumentListCard } from "./document-list-card"
import { DocumentApplicationForm } from "./document-application-form"
import { ApplicationStatusCard } from "./application-status-card"
import { documentsInfo, DocumentApplication } from "@/lib/service-data"
import { FileText } from "lucide-react"

// Initial Form State
const initialFormData = {
  fullName: "",
  address: "",
  contactNumber: "",
  documentType: "",
  purpose: "",
}

// Helper component for TabsContent animation
const AnimatedTabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <TabsContent value={value} className="mt-6 animate-in fade-in-0 duration-500">
    {children}
  </TabsContent>
)

// --- Component ---
export function ServicesContent() {
  const [applications, setApplications] = useState<DocumentApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState(initialFormData)

  const handleFormChange = (key: keyof typeof initialFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      // Simulate API delay for a nicer UI
      await new Promise((resolve) => setTimeout(resolve, 300))
      const response = await fetch("/api/applications")
      if (!response.ok) throw new Error("Failed to fetch applications")
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("[ServicesContent] Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (Object.values(formData).some((value) => !value)) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      })
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          status: "Pending",
        }),
      })

      if (response.ok) {
        toast({
          title: "Application Submitted",
          description: "Your document application has been submitted successfully.",
        })
        setFormData(initialFormData) // Reset form
        fetchApplications()
      } else {
        throw new Error("Failed to submit application")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Realtime hook
  useRealtime({
    eventTypes: ["application:updated"],
    onUpdate: () => {
      console.log("Received application update. Refreshing...")
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

        {/* Documents Tab */}
        <AnimatedTabsContent value="documents">
          <div className="space-y-6">
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Barangay Documents</h2>
              <p className="text-muted-foreground">View available documents, requirements, and pricing</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentsInfo.map((doc, index) => (
                <DocumentListCard key={doc.id} document={doc} index={index} />
              ))}
            </div>
          </div>
        </AnimatedTabsContent>

        {/* Apply Tab */}
        <AnimatedTabsContent value="apply">
          <DocumentApplicationForm
            formData={formData}
            submitting={submitting}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}
          />
        </AnimatedTabsContent>

        {/* Status Tab */}
        <AnimatedTabsContent value="status">
          <Card>
            <CardHeader className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>Track the status of your document applications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4 animate-in fade-in-0 duration-700">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 animate-in fade-in-0 duration-500">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-2">Submit your first application to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application, index) => (
                    <ApplicationStatusCard key={application.id} application={application} index={index} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
