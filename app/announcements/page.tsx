import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnnouncementsContent } from "@/components/announcements-content"

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Announcements & Advisories</h1>
            <p className="text-lg text-primary-foreground/90">
              Stay informed with the latest updates from Barangay Matiao
            </p>
          </div>
        </div>
        <AnnouncementsContent />
      </main>
      <Footer />
    </div>
  )
}
