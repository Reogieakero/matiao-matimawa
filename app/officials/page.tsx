import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfficialsContent } from "@/components/officials-content"

export default function OfficialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Barangay Officials</h1>
            <p className="text-lg text-primary-foreground/90">Meet your local government officials and their status</p>
          </div>
        </div>
        <OfficialsContent />
      </main>
      <Footer />
    </div>
  )
}
