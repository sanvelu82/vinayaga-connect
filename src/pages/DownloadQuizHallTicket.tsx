// src/pages/DownloadQuizHallTicket.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Make sure you have created firebaseConfig.ts

interface HallTicketData {
  name: string;
  email: string;
  registrationId: string;
}

export function DownloadQuizHallTicket() {
  const [regId, setRegId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hallTicket, setHallTicket] = useState<HallTicketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!regId) {
      setError("Please enter a Registration ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setHallTicket(null);

    try {
      const docRef = doc(db, 'quizRegistrations', regId); // Querying the NEW collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHallTicket(docSnap.data() as HallTicketData);
      } else {
        setError("No hall ticket found for this Quiz Registration ID.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching your hall ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (hallTicket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-center">Quiz Competition Hall Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img src="/school-logo.png" alt="School Logo" className="mx-auto h-16 w-16" />
              <h2 className="text-xl font-semibold">Vinayaga Matric Hr. Sec. School</h2>
            </div>
            <div><strong>Name:</strong> {hallTicket.name}</div>
            <div><strong>Registration ID:</strong> <span className="font-bold">{hallTicket.registrationId}</span></div>
            <div className="border-t pt-4 mt-4 text-center">
              <p><strong>Date:</strong> October 12, 2025</p>
              <p><strong>Time:</strong> 10:00 AM</p>
              <p><strong>Venue:</strong> School Auditorium</p>
            </div>
             <Button onClick={() => window.print()} className="w-full">
              Print / Save as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[450px]">
        <CardHeader><CardTitle>Download Quiz Hall Ticket</CardTitle></CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="regId">Quiz Registration ID</Label>
              <Input
                id="regId"
                placeholder="Enter your Quiz ID (e.g., VMHSS-QZ-...)"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleDownload} disabled={loading}>
              {loading ? 'Searching...' : 'Get My Hall Ticket'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}