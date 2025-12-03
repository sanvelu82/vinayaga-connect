// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Info } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // --- ACTIVE COMPONENT: "COMING SOON" PAGE ---
// // This is the code that is currently active and will be displayed.
// const HallTicketDownload = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
//       {/* Left Branding Panel */}
//       <div className="hidden bg-gray-100 lg:flex flex-col items-center justify-center p-8 text-center hero-gradient text-white">
//         <img
//           src="/school-logo.png"
//           alt="School Logo"
//           className="w-32 h-32 mb-6 shadow-glow rounded-full bg-white/10 p-4"
//         />
//         <h1 className="text-4xl font-bold tracking-tight">
//           Examination Portal
//         </h1>
//         <p className="mt-4 text-white/80 max-w-sm">
//           Stay tuned for updates on the upcoming midterm examinations. Best of
//           luck!
//         </p>
//       </div>

//       {/* Right Interactive Panel */}
//       <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="absolute top-6 left-6 text-muted-foreground"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>

//         <div className="w-full max-w-md space-y-8">
//           <Card className="shadow-xl">
//             <CardHeader className="text-center">
//               <CardTitle className="text-2xl font-bold tracking-tight">
//                 Hall Ticket Information
//               </CardTitle>
//               <CardDescription>
//                 Updates on availability will be posted here.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
//                 <Info className="mx-auto h-12 w-12 text-blue-500 mb-4" />
//                 <p className="text-lg font-semibold text-foreground">
//                   Coming Soon
//                 </p>
//                 <p className="mt-1">
//                   The hall ticket for the Second Mid-Term will be released soon.
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HallTicketDownload;



// ==================================================================
// --- ORIGINAL HALL TICKET GENERATION LOGIC (COMMENTED OUT) ---
// To restore functionality, comment out the code above and uncomment
// the code block below.
// ==================================================================

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

// --- PDF IMPORTS ---
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"; 
import download from "downloadjs";

// --- INTERFACE ---
interface StudentData {
  name: string;
  dob: string;
  className: string;
  section: string;
  registerNumber: string;
  photoUrl: string;
}

const HallTicketDownload = () => {
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

  // --- PDF GENERATION LOGIC ---
  const handleDownloadFromTemplate = async () => {
    if (!studentData) return;
    setIsDownloading(true);

    // ---------------------------------------------------------
    // 📍 COORDINATES CONFIGURATION
    // ---------------------------------------------------------
    const getCoordinates = (className: string) => {
       return {
        regNo:   { x: 160, y: 640 }, 
        name:    { x: 160, y: 612 },
        class:   { x: 160, y: 583 },
        section: { x: 320, y: 582 },
        dob:     { x: 160, y: 553 },
        // 🗓️ NEW COORDINATE FOR DATE & TIME
        generatedDate: { x: 30, y: 105 }, // Bottom right corner
        photo:   { x: 462.5, y: 537.3, width: 90, height: 104 }
      };
    };

    try {
      // 1. LOAD TEMPLATE
      const templateFilename = `${studentData.className}.pdf`;
      const templatePath = `/templates/${templateFilename}`; 
      
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Template not found for Class ${studentData.className}`);
      }
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 2. LOAD CUSTOM FONT (Cambria)
      pdfDoc.registerFontkit(fontkit);
      const fontUrl = '/fonts/Cambria.ttf';
      const fontResponse = await fetch(fontUrl);
      if (!fontResponse.ok) {
         throw new Error("Could not find Cambria.ttf in public/fonts folder.");
      }
      const fontBytes = await fontResponse.arrayBuffer();
      const cambriaFont = await pdfDoc.embedFont(fontBytes);

      const firstPage = pdfDoc.getPages()[0];
      const coords = getCoordinates(studentData.className);
      
      const textOptions = { font: cambriaFont, size: 11, color: rgb(0, 0, 0) };

      // 3. DRAW TEXT
      firstPage.drawText(studentData.registerNumber, { ...coords.regNo, ...textOptions });
      firstPage.drawText(studentData.name, { ...coords.name, ...textOptions });
      firstPage.drawText(studentData.className, { ...coords.class, ...textOptions });
      firstPage.drawText(studentData.section, { ...coords.section, ...textOptions });
      firstPage.drawText(studentData.dob, { ...coords.dob, ...textOptions });

      // 🗓️ DRAW GENERATED DATE AND TIME (WITH SECONDS)
      const now = new Date();
      // Format example: "12/03/2025, 10:30:45 AM"
      const dateTimeString = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Change to false if you want 24-hour format
      });

      firstPage.drawText(`Generated on: ${dateTimeString}`, { 
          ...coords.generatedDate, 
          font: cambriaFont, 
          size: 9, 
          color: rgb(0.3, 0.3, 0.3) 
      });

      // 4. EMBED PHOTO
      try {
        if (studentData.photoUrl) {
          const photoResponse = await fetch(studentData.photoUrl);
          if (photoResponse.ok) {
            const photoBytes = await photoResponse.arrayBuffer();
            let studentImage;
            const isJpg = studentData.photoUrl.toLowerCase().match(/\.(jpeg|jpg)$/);
            
            if (isJpg) studentImage = await pdfDoc.embedJpg(photoBytes);
            else studentImage = await pdfDoc.embedPng(photoBytes);
            
            firstPage.drawImage(studentImage, coords.photo);
          }
        }
      } catch (imgError) { 
        console.error("Could not embed image.", imgError); 
      }

      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `hall-ticket-${studentData.registerNumber}.pdf`, "application/pdf");

    } catch (err: any) {
      console.error("Failed to generate PDF:", err);
      toast({ title: "Download Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-gray-100 lg:flex flex-col items-center justify-center p-8 text-center hero-gradient text-white">
        <img src="/school-logo.png" alt="School Logo" className="w-32 h-32 mb-6 shadow-glow rounded-full bg-white/10 p-4" />
        <h1 className="text-4xl font-bold tracking-tight">Showcase Your Knowledge</h1>
        <p className="mt-4 text-white/80 max-w-sm">
          Please enter your credentials to access your examination hall ticket. Best of luck for your exams!
        </p>
      </div>

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
                      
                      {/* 👇 UPDATE THIS LINE 👇 */}
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        
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
                        <SelectItem value="LKG-A">LKG - A</SelectItem>
                        <SelectItem value="LKG-B">LKG - B</SelectItem>
                        <SelectItem value="LKG-C">LKG - C</SelectItem>
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