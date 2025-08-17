import { useState, useEffect, useMemo } from "react"; // Import necessary hooks
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Award, TrendingUp, Calendar, Timer } from "lucide-react"; // Import Timer icon

export function ResultsSection() {
  // --- Start of new logic ---

  // 1. Define the target release date using useMemo to prevent recalculation on re-renders.
  const targetDate = useMemo(() => new Date('2025-08-17T09:00:00'), []);

  // 2. State to hold the remaining time and a flag for when the time is up.
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeUp, setIsTimeUp] = useState(new Date() >= targetDate);

  // 3. useEffect to set up the countdown timer.
  useEffect(() => {
    // If the time is already up, don't start the timer.
    if (isTimeUp) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        // Calculate remaining time
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Time is up, update the state and clear the interval.
        setIsTimeUp(true);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup function: clear the interval when the component unmounts.
    return () => clearInterval(timer);
  }, [isTimeUp, targetDate]);

  // --- End of new logic ---

  const handleResultsClick = () => {
    window.open('https://script.google.com/macros/s/AKfycbyuNoWmX_CnKj2eK87KhK1Q7-ze-HOV3J4xVnblbizB7dg7d0z9B1jKWxGn2M3nKXqK2Q/exec', '_blank', 'noopener,noreferrer');
  };

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
  ];

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
              <section id="on-results-section"></section>
            </Card>
            
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="max-w-md mx-auto shadow-elegant hover-lift transition-smooth">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary mb-2">
                {isTimeUp ? "Access Results Portal" : "Results Will Be Live Soon"}
              </CardTitle>
              <CardDescription className="text-base">
                {isTimeUp 
                  ? "Click below to view detailed results and download certificates." 
                  : "The results portal will unlock automatically on August 17, 2025, at 9:00 AM."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* --- Conditional Button Rendering --- */}
              {isTimeUp ? (
                <Button
                  onClick={handleResultsClick}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group shadow-glow hover:shadow-elegant transition-smooth"
                >
                  <span>View Results Portal</span>
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
              ) : (
                <Button
                  disabled
                  size="lg"
                  className="w-full font-semibold group shadow-elegant transition-smooth"
                >
                  <Timer className="w-5 h-5 mr-2" />
                  <span>
                    {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
                  </span>
                </Button>
              )}
              {/* --- End of Conditional Rendering --- */}

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