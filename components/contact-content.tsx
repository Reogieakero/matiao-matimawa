"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Loader2, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const issueTypes = [
  "Infrastructure",
  "Public Safety",
  "Health & Sanitation",
  "Noise Complaint",
  "Street Lighting",
  "Waste Management",
  "Water Supply",
  "Other",
]

export function ContactContent() {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    issueType: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Report Submitted",
          description: "Thank you for your report. We will review it shortly.",
        })
        setFormData({
          name: "",
          issueType: "",
          description: "",
        })
      } else {
        throw new Error("Failed to submit report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">info@barangaymatiao.gov.ph</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">(123) 456-7890</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-lg">Visit Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">Mon-Fri, 8:00 AM - 5:00 PM</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report an Issue or Suggestion</CardTitle>
            <CardDescription>
              Help us improve our community by reporting issues or sharing your suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">You can submit anonymously by leaving this blank</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select
                    value={formData.issueType}
                    onValueChange={(value) => setFormData({ ...formData, issueType: value })}
                    required
                  >
                    <SelectTrigger id="issueType">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about the issue or your suggestion..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
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
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
