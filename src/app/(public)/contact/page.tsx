"use client";
import { churchConfig } from "@/lib/church-config";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock,
  Send,
  Heart,
  Church,
  Cross,
  Calendar,
  Users,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import react-leaflet components to ensure they are only rendered on the client-side
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Default church location (example: New York City)
const DEFAULT_LATITUDE = 40.7128;
const DEFAULT_LONGITUDE = -74.006;
const DEFAULT_ZOOM = 13;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Sending your message...", { id: "contact-form" });

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you soon.", {
        id: "contact-form",
      });
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to send message: ${error.message}`, {
        id: "contact-form",
      });
    }
  };

  const faqs = [
    {
      question: "What are your service times?",
      answer:
        "Our main worship service is every Sunday at 10:00 AM. We also have a midweek Bible study on Wednesdays at 7:00 PM.",
    },
    {
      question: "Do you have programs for children?",
      answer:
        "Yes, we offer engaging Sunday School classes for children of all ages during our main service, and various youth activities throughout the week.",
    },
    {
      question: "How can I get involved?",
      answer:
        "There are many ways to get involved! You can join a small group, volunteer for a ministry, or attend our new members' class. Please fill out the contact form or speak to a team member after service.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-cover bg-center rounded-2xl shadow-xl overflow-hidden"
          style={{
            backgroundImage: "url('/images/community-prayer.png')",
            minHeight: "300px", // Adjusted for better mobile view
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-800/70 flex flex-col items-center justify-center text-center p-6 sm:p-8">
            <div className="max-w-4xl space-y-4 sm:space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm"
              >
                <Church className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                Connect With {churchConfig.name}
              </h1>
              <p className="text-base sm:text-xl text-blue-100 mb-4 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                We're here to answer your questions, listen to your needs, and
                welcome you into our faith community.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-100 text-sm sm:text-base"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-300 animate-pulse" />
                <span>Where faith, hope, and love come together</span>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Information & Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100 h-full flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                <Cross className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                Reach Out Directly
              </h2>
              <div className="space-y-6 sm:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-4 sm:space-x-5 p-3 sm:p-4 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors"
                >
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                      Email Us
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">{churchConfig.contact.email}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-4 sm:space-x-5 p-3 sm:p-4 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors"
                >
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                      Call Us
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">{churchConfig.contact.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start space-x-4 sm:space-x-5 p-3 sm:p-4 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors"
                >
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-full mt-1">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                      Visit Us
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      {churchConfig.contact.address}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-4 sm:space-x-5 p-3 sm:p-4 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors"
                >
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-full">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                      Office Hours
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </p>
                    <p className="text-sm sm:text-base text-slate-600">
                      Saturday - Sunday: Closed (except for services)
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 sm:mt-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Connect With Our Community
              </h3>
              <div className="flex space-x-3 sm:space-x-5 justify-center lg:justify-start">
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href={churchConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-2 sm:p-3 rounded-full text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <Facebook size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href={churchConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-100 p-2 sm:p-3 rounded-full text-sky-500 hover:bg-sky-200 transition-colors"
                >
                  <Twitter size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href={churchConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-100 p-2 sm:p-3 rounded-full text-pink-500 hover:bg-pink-200 transition-colors"
                >
                  <Instagram size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href={churchConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-100 p-2 sm:p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Youtube size={24} />
                </motion.a>
              </div>
            </motion.div>
          </motion.section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
              <Send className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-1.5 sm:space-y-2"
              >
                <Label htmlFor="name" className="text-slate-700 font-medium text-sm sm:text-base">
                  Your Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-1.5 sm:space-y-2"
              >
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm sm:text-base">
                  Your Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your email address"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-1.5 sm:space-y-2"
              >
                <Label htmlFor="subject" className="text-slate-700 font-medium text-sm sm:text-base">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="What is this regarding?"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-1.5 sm:space-y-2"
              >
                <Label htmlFor="message" className="text-slate-700 font-medium text-sm sm:text-base">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5} // Adjusted rows for better mobile view
                  required
                  className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm sm:text-base"
                  placeholder="How can we help you today?"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Send Message
                </Button>
              </motion.div>
            </form>
          </motion.section>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
              Find answers to common questions about our church community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="h-full p-5 sm:p-7 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 group hover:border-blue-200">
                  <CardHeader className="p-0 mb-4 sm:mb-5">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Additional FAQ card for more information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="h-full p-5 sm:p-7 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                <CardHeader className="p-0 mb-4 sm:mb-5">
                  <div className="bg-white p-1.5 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">
                    Have more questions?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 sm:mb-5">
                    We're always happy to answer any other questions you might
                    have about our church community.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Location Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 sm:mb-4">
              Find Us on the Map
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
              Come visit us at our location. We'd love to welcome you in person!
            </p>
          </div>

          <div className="w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer
              center={[DEFAULT_LATITUDE, DEFAULT_LONGITUDE]}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[DEFAULT_LATITUDE, DEFAULT_LONGITUDE]}>
                <Popup>
                  <div className="text-center p-1 sm:p-2">
                    <Church className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                    <strong className="text-sm sm:text-base">{churchConfig.name}</strong>
                    <br />
                    <span className="text-xs sm:text-sm">{churchConfig.contact.address}</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center text-slate-600 mt-4 sm:mt-6 text-sm sm:text-base"
          >
            Click{" "}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${DEFAULT_LATITUDE},${DEFAULT_LONGITUDE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              here
            </a>{" "}
            for directions on Google Maps.
          </motion.p>
        </motion.section>
      </div>

      <Toaster position="bottom-right" richColors />
    </motion.div>
  );
};

export default ContactPage;
