import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, FileText, Phone, Users, MessageSquare, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/abstract-blue-swirls.png')] opacity-10 bg-cover bg-center" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Welcome to Barangay Matiao Online Portal
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                Your gateway to community services, announcements, and local government information. We're here to serve
                you better.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/services">Apply for Documents</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
                  asChild
                >
                  <Link href="/announcements">View Announcements</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Barangay Matiao */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Barangay Matiao</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Barangay Matiao is a vibrant and progressive community located in the heart of our municipality.
                    With a rich history spanning decades, we have grown from a small settlement into a thriving barangay
                    that serves thousands of residents with dedication and excellence.
                  </p>
                  <p>
                    Our barangay is committed to providing quality services, maintaining peace and order, and fostering
                    community development. We take pride in our strong sense of community, where neighbors help
                    neighbors and everyone works together for the common good.
                  </p>
                  <p>
                    Through this online portal, we continue our mission of transparency and accessibility, making it
                    easier for residents to access government services, stay informed about community events, and
                    participate in local governance.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/officials">Meet Our Officials</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/announcements">Latest Updates</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                <Image src="/barangay-hall-building-community-center.jpg" alt="Barangay Matiao Hall" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Services */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access Services</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need from your barangay, just a click away
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Bell className="h-6 w-6" />
                  </div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Stay updated with the latest news, advisories, and community events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/announcements">View All</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle>Document Services</CardTitle>
                  <CardDescription>
                    Apply for barangay clearance, certificates, and other documents online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/services">Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <CardTitle>Emergency Hotlines</CardTitle>
                  <CardDescription>Quick access to police, fire, health, and disaster response teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/hotlines">View Hotlines</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Barangay Officials</CardTitle>
                  <CardDescription>Meet your local officials and check their availability status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/officials">View Officials</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <CardTitle>Report Issues</CardTitle>
                  <CardDescription>Submit concerns, suggestions, or report community issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/contact">Submit Report</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle>Public Safety</CardTitle>
                  <CardDescription>
                    Access safety guidelines, emergency procedures, and community programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/announcements?category=Public+Safety">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Barangay Matiao is dedicated to providing efficient, transparent, and accessible services to all
                residents. Through this online portal, we aim to bridge the gap between the community and local
                government, making it easier for you to access information and services you need.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
