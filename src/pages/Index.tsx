import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/school/app-sidebar"
import { HeroSection } from "@/components/school/hero-section"
import { ResultsSection } from "@/components/school/results-section"
import { Footer } from "@/components/school/footer"
import { InteractiveFeatures } from "@/components/school/interactive-features"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const Index = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header with sidebar trigger */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sri Vinayaga Vidyalaya School
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("https://maps.app.goo.gl/nqKhc4gGPuBKybdw7", "_blank")}
                className="text-muted-foreground hover:text-primary"
              >
                <MapPin className="h-4 w-4 mr-1" />
                School Location
              </Button>
              <ThemeToggle />
              <div className="text-sm text-muted-foreground hidden md:block">
                Excellence in Education Since 1995
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 space-y-0">
            <HeroSection />
            
            {/* Interactive Dashboard Section */}
            <section className="py-16 bg-gradient-to-b from-background via-secondary/20 to-background">
              <div className="school-container">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="text-center animate-fade-in">
                      <h2 className="text-3xl font-bold text-foreground mb-4">
                        Live School Dashboard
                      </h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real-time insights and interactive features for our school community
                      </p>
                      <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
                    </div>
                    
                    <ResultsSection />
                  </div>
                  
                  <div className="lg:col-span-1 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                    <InteractiveFeatures />
                  </div>
                </div>
              </div>
            </section>
            
            <Footer />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
