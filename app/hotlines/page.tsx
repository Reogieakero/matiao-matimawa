import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HotlinesContent } from "@/components/hotlines-content"

export default function HotlinesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-destructive text-destructive-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Emergency Hotlines</h1>
            <p className="text-lg text-destructive-foreground/90">
              Quick access to emergency services and response teams
            </p>
          </div>
        </div>
        <HotlinesContent />
      </main>
      <Footer />
    </div>
  )
}
