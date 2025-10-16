"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Bell, Phone, Users, FileText, MessageSquare } from "lucide-react"
import { logout } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ManageAnnouncements } from "@/components/admin/manage-announcements"
import { ManageHotlines } from "@/components/admin/manage-hotlines"
import { ManageOfficials } from "@/components/admin/manage-officials"
import { ManageApplications } from "@/components/admin/manage-applications"
import { ManageReports } from "@/components/admin/manage-reports"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              BM
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Barangay Matiao</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="announcements" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="hotlines" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Hotlines</span>
            </TabsTrigger>
            <TabsTrigger value="officials" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Officials</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <ManageAnnouncements />
          </TabsContent>

          <TabsContent value="hotlines">
            <ManageHotlines />
          </TabsContent>

          <TabsContent value="officials">
            <ManageOfficials />
          </TabsContent>

          <TabsContent value="applications">
            <ManageApplications />
          </TabsContent>

          <TabsContent value="reports">
            <ManageReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
