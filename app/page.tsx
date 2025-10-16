  import { Navbar } from "@/components/navbar"
  import { Footer } from "@/components/footer"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Bell, FileText, Phone, Users, MessageSquare, Shield } from "lucide-react"
  import Link from "next/link"
  import Image from "next/image"

  import HeroBackgroundImage from "@/public/Matiao.jpg" //

  // 2. Assign the imported image object's 'src' property to the constant
  const HERO_BACKGROUND_URL = HeroBackgroundImage.src;

  export default function HomePage() {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center" 
              style={{ backgroundImage: `url('${HERO_BACKGROUND_URL}')` }}
            />
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
          <section className="relative py-16 md:py-20 bg-gradient-to-b from-background via-muted/40 to-background overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-5 bg-[url('/pattern-grid.svg')] bg-repeat" />

            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <div className="relative h-[420px] rounded-3xl overflow-hidden group shadow-xl order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 rounded-3xl" />
                  <Image
                    src="/barangay-hall-building-community-center.jpg"
                    alt="Barangay Matiao Hall"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-border shadow-md">
                    <h3 className="font-semibold text-lg text-foreground">Barangay Matiao Hall</h3>
                    <p className="text-sm text-muted-foreground">The heart of community leadership and service</p>
                  </div>
                </div>

                {/* Right: Text */}
                <div className="space-y-8 order-1 lg:order-2">
                  <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary tracking-wide">
                    About Our Barangay
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                    A Strong, United, and <span className="text-primary">Progressive</span> Community
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Barangay Matiao stands as a thriving and dynamic community at the heart of our municipality.
                    With deep cultural roots and a spirit of unity, we have transformed from a small settlement into
                    one of the most progressive barangays in the region — committed to service, inclusivity, and innovation.
                  </p>

                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Our leadership continues to promote transparency, order, and active participation among residents.
                      Through dedicated governance and citizen collaboration, Barangay Matiao ensures peace, development,
                      and opportunities for all.
                    </p>
                    <p>
                      With this online portal, we aim to bring public service closer to your fingertips — offering access
                      to documents, updates, and programs that strengthen our shared vision of a better and more connected
                      community.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button size="lg" asChild>
                      <Link href="/officials">Meet Our Officials</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/announcements">See Latest Updates</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Services (Closer to About Section) */}
          <section className="pt-8 pb-16 md:pt-10 md:pb-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Quick Access Services</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Access essential barangay services with just a few clicks.
                </p>
              </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: "Announcements", desc: "Stay updated with the latest news, advisories, and events.", icon: <Bell className="h-6 w-6" />, href: "/announcements" },
        { title: "Document Services", desc: "Apply for barangay clearance, certificates, and more.", icon: <FileText className="h-6 w-6" />, href: "/services" },
        { title: "Emergency Hotlines", desc: "Quick access to police, fire, and health services.", icon: <Phone className="h-6 w-6" />, href: "/hotlines" },
        { title: "Barangay Officials", desc: "Meet your local officials and check their availability.", icon: <Users className="h-6 w-6" />, href: "/officials" },
        { title: "Report Issues", desc: "Submit concerns, suggestions, or community issues.", icon: <MessageSquare className="h-6 w-6" />, href: "/contact" },
        { title: "Public Safety", desc: "Access safety guidelines and emergency procedures.", icon: <Shield className="h-6 w-6" />, href: "/announcements?category=Public+Safety" },
      ].map((service, i) => (
        <Card
          key={i}
          className="group relative border border-border/60 bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 hover:shadow-xl rounded-2xl"
        >
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              {service.icon}
            </div>
            <CardTitle className="text-xl font-semibold mb-2">{service.title}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {service.desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button variant="secondary" className="rounded-full px-6" asChild>
              <Link href={service.href}>Open</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
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