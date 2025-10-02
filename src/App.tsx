import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/login/StudentLogin";
import ParentLogin from "./pages/login/ParentLogin";
import FacultyLogin from "./pages/login/FacultyLogin";
import AdminLogin from "./pages/login/AdminLogin";
import HallTicketDownload from "./pages/HallTicketDownload";
import { QuizRegistration } from './pages/QuizRegistration';
import { DownloadQuizHallTicket } from './pages/DownloadQuizHallTicket';
import { Advertisement } from "./pages/Advertisement";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAdOpen, setIsAdOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAdOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="school-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/parent" element={<ParentLogin />} />
              <Route path="/login/faculty" element={<FacultyLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/hall-ticket" element={<HallTicketDownload />} />
              <Route path="/quiz-registration" element={<QuizRegistration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Advertisement
            isOpen={isAdOpen}
            onClose={() => setIsAdOpen(false)}
            imageUrl="https://i.ibb.co/mCmk676Y/Untitled-2.webp"
            linkUrl="https://ibb.co/4ZczPxP"
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;