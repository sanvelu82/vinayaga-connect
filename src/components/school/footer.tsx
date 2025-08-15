import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="school-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/school-logo.png"
                alt="School Logo" 
                className="w-10 h-10 object-contain bg-white/10 rounded-full p-1"
              />
              <div>
                <h3 className="font-bold text-lg">Sri Vinayaga</h3>
                <p className="text-sm text-primary-foreground/80">Vidyalaya School</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Committed to excellence in education and nurturing future leaders with strong moral values.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">About Us</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">Academics</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">Admissions</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">Faculty</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">Events</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/80">123 Education Street, Learning City</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/80">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/80">info@vinayagaschool.edu</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-smooth hover-lift">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-smooth hover-lift">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-smooth hover-lift">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-primary-foreground/70">
              Stay connected for updates and announcements
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm text-primary-foreground/80">
            © 2024 Sri Vinayaga Vidyalaya School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}