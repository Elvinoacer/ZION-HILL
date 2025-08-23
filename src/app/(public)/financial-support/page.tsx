'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle, Loader, ShieldCheck, Heart } from "lucide-react";
import { toast, Toaster } from 'sonner';

export default function FinancialSupportPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amountRequested: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your request...');

    try {
      const response = await fetch("/api/financial-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amountRequested: parseFloat(formData.amountRequested),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request.");
      }

      toast.success("Request submitted successfully! We will be in touch.", { id: toastId });
      setFormData({ name: '', email: '', phone: '', amountRequested: '', reason: '' });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <RequestForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <SupportInfo />
                </motion.div>
            </div>
        </main>
        <Toaster richColors />
    </div>
  );
}

const Header = () => (
    <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center py-16 md:py-24 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
            <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Financial Support</h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">A helping hand for our community members in times of need. All requests are handled with care and confidentiality.</p>
        </div>
    </motion.header>
);

const RequestForm = ({ formData, handleChange, handleSubmit, isSubmitting }) => (
    <Card className="shadow-xl rounded-2xl border-gray-200/80 p-4 sm:p-6">
        <CardHeader className="p-0 mb-4 sm:mb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">Support Request Form</CardTitle>
            <CardDescription className="text-sm sm:text-base">Please fill out the form below. All information is confidential.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <FormInput icon={User} name="name" placeholder="Your Name (Optional)" value={formData.name} onChange={handleChange} />
                <FormInput icon={Mail} name="email" type="email" placeholder="Your Email (Optional)" value={formData.email} onChange={handleChange} />
                <FormInput icon={Phone} name="phone" type="tel" placeholder="Your Phone (Optional)" value={formData.phone} onChange={handleChange} />
                <FormInput icon={DollarSign} name="amountRequested" type="number" placeholder="Amount Requested (KES)" value={formData.amountRequested} onChange={handleChange} required />
                <div>
                    <Label htmlFor="reason" className="sr-only">Reason for Request</Label>
                    <Textarea id="reason" name="reason" placeholder="Please describe the reason for your request..." value={formData.reason} onChange={handleChange} required rows={4} className="text-sm sm:text-base p-3 sm:p-4" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full text-base sm:text-lg py-3 sm:py-4">
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />} 
                    {isSubmitting ? "Submitting..." : "Submit Secure Request"}
                </Button>
            </form>
        </CardContent>
    </Card>
);

const FormInput = ({ icon: Icon, ...props }) => (
    <div>
        <Label htmlFor={props.name} className="sr-only">{props.placeholder}</Label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input id={props.name} {...props} className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base" />
        </div>
    </div>
);

const SupportInfo = () => (
    <div className="space-y-6 sm:space-y-8">
        <InfoCard 
            icon={ShieldCheck} 
            title="Our Commitment to You"
            text="We are committed to supporting our church family with compassion and discretion. Every request is reviewed prayerfully by our pastoral care team."
        />
        <InfoCard 
            icon={MessageSquare} 
            title="The Process"
            text="Once your request is submitted, a member of our confidential care team will reach out to you within 2-3 business days to discuss your request further."
        />
        <div className="text-center text-xs sm:text-sm text-gray-500 p-3 sm:p-4 bg-gray-100 rounded-lg">
            <p>"Carry each other’s burdens, and in this way you will fulfill the law of Christ."</p>
            <p className="font-semibold mt-1">- Galatians 6:2</p>
        </div>
    </div>
);

const InfoCard = ({ icon: Icon, title, text }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-lg p-4 sm:p-6">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-0 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <p className="text-gray-600 text-sm sm:text-base">{text}</p>
        </CardContent>
    </Card>
);
