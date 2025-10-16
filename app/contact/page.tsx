import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact-content"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Contact & Report</h1>
            <p className="text-lg text-primary-foreground/90">
              Submit your concerns, suggestions, or report community issues
            </p>
          </div>
        </div>
        <ContactContent />
      </main>
      <Footer />
    </div>
  )
}
