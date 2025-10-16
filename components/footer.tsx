import Link from "next/link"
import { Facebook, Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Barangay Matiao</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Serving our community with dedication and transparency. Your trusted local government unit.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:barangaymatiao@example.com"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Barangay Hall, Matiao, Philippines</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">(123) 456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">info@barangaymatiao.gov.ph</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Office Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p>Monday - Friday</p>
                  <p className="font-medium text-foreground">8:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p>Saturday</p>
                  <p className="font-medium text-foreground">8:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Barangay Matiao. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
