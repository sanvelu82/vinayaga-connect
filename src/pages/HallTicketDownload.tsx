import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
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

// --- INTERFACE (FROM YOUR LATEST LOGIC) ---
interface StudentData {
  name: string;
  dob: string;
  className: string;
  section: string;
  registerNumber: string;
  photoUrl: string;
}

const HallTicketDownload = () => {
  // --- STATE AND HOOKS (FROM YOUR LATEST LOGIC + UI) ---
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registerNumber: "",
    dob: "",
    classSection: "",
  });
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // --- FUNCTIONS (ALL FROM YOUR LATEST LOGIC) ---
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
      console.error("Fetch Error:", error);
      toast({ title: "Search Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadFromTemplate = async () => {
    if (!studentData) return;
    setIsDownloading(true);

    const getCoordinatesForClass = (className: string) => {
      // Your specific coordinates
      switch (className) {
        case "V": return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
        case "IV":  return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
        case "III": return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
        case "II":  return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
        case "I":   return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
        default:    return { name: { x: 100, y: 629 }, regNo: { x: 147, y: 607 }, class: { x: 103, y: 585 }, dob: { x: 160, y: 563 }, photo: { x: 428, y: 528.5, width: 108.5, height: 123.5 } };
      }
    };

    try {
      const classNameForTemplate = studentData.className;
      const templatePath = `/templates/${classNameForTemplate}.pdf`;
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Template not found for class "${classNameForTemplate}". Check filename.`);
      }
      
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const firstPage = pdfDoc.getPages()[0];

      const coords = getCoordinatesForClass(classNameForTemplate);
      const commonOptions = { font, size: 12, color: rgb(0, 0, 0) };

      firstPage.drawText(studentData.name, { ...coords.name, ...commonOptions });
      firstPage.drawText(studentData.registerNumber, { ...coords.regNo, ...commonOptions });
      firstPage.drawText((studentData.className === "LKG" && studentData.section === "D") ? "UKG - C" : `${studentData.className} - ${studentData.section}`, { ...coords.class, ...commonOptions });
      firstPage.drawText(studentData.dob, { ...coords.dob, ...commonOptions });

      try {
        const photoResponse = await fetch(studentData.photoUrl);
        if (photoResponse.ok) {
          const photoBytes = await photoResponse.arrayBuffer();
          let studentImage;
          if (studentData.photoUrl.toLowerCase().endsWith('.jpg') || studentData.photoUrl.toLowerCase().endsWith('.jpeg')) {
            studentImage = await pdfDoc.embedJpg(photoBytes);
          } else {
            studentImage = await pdfDoc.embedPng(photoBytes);
          }
          firstPage.drawImage(studentImage, coords.photo);
        }
      } catch (imgError) { console.error("Could not embed image.", imgError); }

      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `hall-ticket-${studentData.registerNumber}.pdf`, "application/pdf");

    } catch (err: any) {
      console.error("Failed to generate PDF:", err);
      toast({ title: "Download Failed", description: err.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };


  // --- JSX (FROM YOUR PREFERRED UI) ---
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
              {!studentData ? (
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
                    <Label htmlFor="classSection">Class & Section</Label>
                    <Select onValueChange={handleSelectChange} value={formData.classSection} required>
                      <SelectTrigger><SelectValue placeholder="Select Class & Section" /></SelectTrigger>
                      <SelectContent>
                        {/* Add all your class sections here */}
                        <SelectItem value="V">V</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                        <SelectItem value="III-A">III - A</SelectItem>
                        <SelectItem value="III-B">III - B</SelectItem>
                        <SelectItem value="II-A">II - A</SelectItem>
                        <SelectItem value="II-B">II - B</SelectItem>
                        <SelectItem value="I-A">I - A</SelectItem>
                        <SelectItem value="I-B">I - B</SelectItem>
                        <SelectItem value="I-C">I - C</SelectItem>
                        <SelectItem value="UKG-A">UKG - A</SelectItem>
                        <SelectItem value="UKG-B">UKG - B</SelectItem>
                        <SelectItem value="LKG-D">UKG - C</SelectItem>
                        {/* <SelectItem value="LKG-A">LKG - A</SelectItem>
                        <SelectItem value="LKG-B">LKG - B</SelectItem>
                        <SelectItem value="LKG-C">LKG - C</SelectItem> */}
                        {/* You can add back the other sections as needed */}
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
              ) : (
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