import { useState } from "react"; // ✅ 1. Import useState
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false); // ✅ 2. State for animation

  const scrollToResults = () => {
    document.getElementById('on-results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ 3. New handler function for animated navigation
  const handleNavigate = (path: string) => {
    setIsNavigating(true); // Start animation
    setTimeout(() => {
      navigate(path);
      // No need to reset state here, as the component will unmount
    }, 400); // 400ms delay
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background and Decorative Elements... (no changes here) */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-school-light-blue/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-school-gold/30 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 school-container text-center text-white">
        <div className="animate-fade-in-up space-y-8">
          {/* School Logo and Name... (no changes here) */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/school-logo.png"
                alt="Sri Vinayaga Vidyalaya School Logo" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain floating-animation shadow-glow rounded-full bg-white/10 backdrop-blur-sm p-4"
              />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-glow" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-white drop-shadow-lg">SRI VINAYAGA</span>
              <span className="block text-accent drop-shadow-lg font-extrabold">VIDYALAYA</span>
              <span className="block text-white text-3xl md:text-4xl lg:text-5xl mt-2">SCHOOL</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Excellence in Education • Nurturing Future Leaders • Building Character
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8" style={{ animationDelay: '0.3s' }}>
            {/* ✅ 4. Updated Button with animation logic */}
            <Button 
              onClick={() => handleNavigate('/hall-ticket')}
              disabled={isNavigating} // Disable button during animation
              size="lg"
              className={`hero-gradient border-2 border-white/30 hover:border-white/50 text-white font-semibold px-8 py-3 hover-lift shadow-elegant backdrop-blur-sm transition-all
                ${isNavigating ? 'animate-pulse' : ''}
              `}
              variant="outline"
            >
              Download Hall Ticket
            </Button>
            
            <Button 
              onClick={scrollToResults}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 hover-lift shadow-elegant"
            >
              View Results
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator... (no changes here) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}