import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServicesContent } from "@/components/services-content"

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-accent text-accent-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Document Services</h1>
            <p className="text-lg text-accent-foreground/90">
              Apply for barangay documents and track your application status
            </p>
          </div>
        </div>
        <ServicesContent />
      </main>
      <Footer />
    </div>
  )
}
