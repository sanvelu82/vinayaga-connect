import { HeroSection } from "@/components/school/hero-section"
import { LoginSection } from "@/components/school/login-section"
import { ResultsSection } from "@/components/school/results-section"
import { Footer } from "@/components/school/footer"

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LoginSection />
      <ResultsSection />
      <Footer />
    </div>
  );
};

export default Index;
