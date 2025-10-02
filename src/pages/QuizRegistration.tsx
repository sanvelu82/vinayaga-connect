// src/pages/QuizRegistration.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function QuizRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    // Replace with your actual cloud function URL
    const functionBaseUrl = 'YOUR_CLOUD_FUNCTION_REGION-YOUR_PROJECT_ID.cloudfunctions.net';

    const orderResponse = await fetch(`https://${functionBaseUrl}/createQuizOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000, currency: 'INR' }), // ₹50.00
    });
    const order = await orderResponse.json();

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: order.amount,
      currency: order.currency,
      name: 'Vinayaga Matric Hr. Sec. School',
      description: 'Quiz Competition Registration',
      image: '/school-logo.png',
      order_id: order.id,
      handler: async (response: any) => {
        const verifyResponse = await fetch(`https://${functionBaseUrl}/verifyQuizPayment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            registrationDetails: { name, email, contact },
          }),
        });
        const result = await verifyResponse.json();
        if (result.status === 'success') {
          setRegistrationId(result.registrationId);
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: { name, email, contact },
      theme: { color: '#3399cc' },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (registrationId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[450px]">
          <CardHeader><CardTitle>Registration Successful!</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Thank you for registering. Your registration is confirmed.</p>
            <p className="font-semibold">Your Registration ID is:</p>
            <p className="text-xl font-bold p-2 bg-gray-100 rounded mb-4">{registrationId}</p>
            <p className="mb-4">Please save this ID. You will need it to download your hall ticket.</p>
            <a href="/download-quiz-hall-ticket">
              <Button>Download Your Hall Ticket Now</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[450px]">
        <CardHeader><CardTitle>Quiz Competition Registration</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" placeholder="Enter your contact number" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Register & Pay ₹50'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}