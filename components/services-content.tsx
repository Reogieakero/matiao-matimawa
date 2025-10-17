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
import { FileText, ClipboardList, PenSquare, SearchCheck, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

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

  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("documents")

  // Navigation helper
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      

      {/* Main content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="documents" value={activeTab} onValueChange={handleTabChange} className="mx-auto">
          {/* Process steps (hidden on small screens) */}
          <div className="hidden sm:flex justify-center gap-16 mb-12">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleTabChange("documents")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleTabChange("documents")}
              className="flex flex-col items-center cursor-pointer focus:outline-none"
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  activeTab === "documents" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}>
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="text-sm">1. Browse Documents</div>
              </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleTabChange("apply")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleTabChange("apply")}
              className="flex flex-col items-center cursor-pointer focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                activeTab === "apply" ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}>
                <PenSquare className="h-6 w-6" />
              </div>
              <div className="text-sm">2. Apply</div>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleTabChange("status")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleTabChange("status")}
              className="flex flex-col items-center cursor-pointer focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                activeTab === "status" ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}>
                <SearchCheck className="h-6 w-6" />
              </div>
              <div className="text-sm">3. Track Status</div>
            </div>
          </div>

        {/* Tabs removed — top step icons act as navigation controls now */}

        {/* Documents Tab */}
        <AnimatedTabsContent value="documents">
          <div className="space-y-8">
                        <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-2">Barangay Documents</h2>
              <p className="text-gray-600 mb-4">
                Browse through our available documents, view requirements, and check processing fees
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  <span>Choose a document from the list below</span>
                </div>
                <div className="flex items-center gap-2">
                  <PenSquare className="h-5 w-5 text-blue-600" />
                  <span>Click "Apply for Document" when ready</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {documentsInfo.map((doc, index) => (
                <DocumentListCard 
                  key={doc.id} 
                  document={doc} 
                  index={index} 
                  className="hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => handleTabChange("apply")}
                className="group"
                size="lg"
              >
                <span>Apply for Document</span>
                <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
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
          <Card className="border-0 sm:border shadow-none sm:shadow">
            <CardHeader className="animate-in fade-in-0 slide-in-from-top-2 duration-300 px-3 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">Your Applications</CardTitle>
              <CardDescription className="text-base">Track the status of your document applications</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {loading ? (
                <div className="space-y-3 sm:space-y-4 animate-in fade-in-0 duration-700">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-muted rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted/50 rounded w-full" />
                        <div className="h-3 bg-muted/50 rounded w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 sm:py-16 animate-in fade-in-0 duration-500">
                  <div className="rounded-full bg-muted/10 p-4 inline-flex mb-4 sm:mb-6">
                    <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto mb-6">
                    Start by submitting your first document application. We'll help you track its progress here.
                  </p>
                  <Button
                    onClick={() => handleTabChange("apply")}
                    className="inline-flex items-center gap-2"
                    size="lg"
                  >
                    Apply for Document
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 animate-in fade-in-0 duration-500">
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
    </>
  )
}
