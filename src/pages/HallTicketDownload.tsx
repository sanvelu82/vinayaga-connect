import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Re-import useNavigate
import { Loader2, ArrowLeft } from "lucide-react"; // ✅ 2. Re-import ArrowLeft icon
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

interface StudentData {
  name: string;
  dob: string;
  className: string;
  section: string;
  registerNumber: string;
  photoUrl: string;
}

const HallTicketDownload = () => {
  const navigate = useNavigate(); // ✅ 3. Initialize navigate
  const [formData, setFormData] = useState({
    registerNumber: "",
    dob: "",
    classSection: "",
  });
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // All your functions remain the same
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, classSection: value });
  };
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setStudentData(null);
    const functionUrl = "https://us-central1-attendence-9a3fe.cloudfunctions.net/getStudentData";
    
    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "An unexpected error occurred.");
      }
      setStudentData(responseData);
      toast({ title: "Success", description: "Student data fetched successfully!" });
    } catch (error: any) {
      toast({ title: "Search Failed", description: error.message || "An error occurred while fetching data.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };
  const handleDownloadFromTemplate = async () => { /* ... Your existing PDF logic ... */ };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Branding Panel */}
      <div className="hidden bg-gray-100 lg:flex flex-col items-center justify-center p-8 text-center hero-gradient text-white">
        <img src="/school-logo.png" alt="School Logo" className="w-32 h-32 mb-6 shadow-glow rounded-full bg-white/10 p-4" />
        <h1 className="text-4xl font-bold tracking-tight">Showcase Your Knowledge</h1>
        <p className="mt-4 text-white/80 max-w-sm">
          Please enter your credentials to access your examination hall ticket. Best of luck for your exams!
        </p>
      </div>

      {/* Right Interactive Panel */}
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* ✅ 4. Back Button Added Here */}
        <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-muted-foreground"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        
        <div className="w-full max-w-md space-y-8">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Hall Ticket Download</CardTitle>
              <CardDescription>
                Provide your details to find your ticket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!studentData && (
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="registerNumber">Register Number</Label>
                    <Input id="registerNumber" name="registerNumber" type="text" required value={formData.registerNumber} onChange={handleChange} placeholder="e.g., 201421A001" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" required value={formData.dob} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="classSection">Class</Label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V">V</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full !mt-6" disabled={isSearching}>
                    {isSearching ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                    ) : (
                      "Search for Hall Ticket"
                    )}
                  </Button>
                </form>
              )}

              {studentData && (
                <div className="text-center animate-fade-in-up">
                  <h3 className="text-lg font-semibold">Student Found!</h3>
                  <p className="text-muted-foreground">{studentData.name} ({studentData.registerNumber})</p>
                  <Button onClick={handleDownloadFromTemplate} className="w-full mt-6" disabled={isDownloading}>
                    {isDownloading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
                    ) : (
                      "Download Hall Ticket"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setStudentData(null)} className="w-full mt-2">
                    Search Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HallTicketDownload;