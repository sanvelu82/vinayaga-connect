import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Award, TrendingUp, Calendar } from "lucide-react"

export function ResultsSection() {
  const handleResultsClick = () => {
    window.open('https://script.google.com/macros/s/AKfycbxgk9l0ajoKvjFjpWmnPg1kJVRulAX3ABAHpE0XVctLz2RwkW42ikNaHO_5W47CkGA4Eg/exec', '_blank', 'noopener,noreferrer')
  }

  const resultTypes = [
    {
      title: "First MID-Term Examinations",
      description: "Class UKG & 5th Board Results",
      icon: <Award className="w-6 h-6" />,
      status: "Available"
    },
    {
      title: "Monthly Assessments",
      description: "Progress reports and continuous evaluation",
      icon: <TrendingUp className="w-6 h-6" />,
      status: "Updated"
    },
    {
      title: "Semester Results",
      description: "Comprehensive semester performance reports",
      icon: <Calendar className="w-6 h-6" />,
      status: "Latest"
    }
  ]

  return (
    <section id="results-section" className="py-20 bg-secondary/30">
      <div className="school-container">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Academic Results & Reports
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive academic results, progress reports, and performance analytics
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {resultTypes.map((result, index) => (
            <Card 
              key={result.title}
              className="group relative overflow-hidden border-2 hover:border-primary/30 transition-smooth hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-smooth">
                    {result.icon}
                  </div>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {result.status}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                  {result.title}
                </CardTitle>
                <CardDescription>
                  {result.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="max-w-md mx-auto shadow-elegant hover-lift transition-smooth">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary mb-2">Access Results Portal</CardTitle>
              <CardDescription className="text-base">
                Click below to view detailed results and download certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleResultsClick}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group shadow-glow hover:shadow-elegant transition-smooth"
              >
                <span>View Results Portal</span>
                <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Results are updated regularly. Contact administration for any queries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
