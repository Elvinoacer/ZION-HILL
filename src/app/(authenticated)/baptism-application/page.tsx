"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Calendar,
  Church,
  Info,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function BaptismApplicationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: session?.user.email || "",
    phoneNumber: "",
    dateOfBirth: "",
    reasonForBaptism: "",
    previousChurch: "",
    howHeard: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    session?.user &&
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
      }));
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/baptism-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to submit baptism application."
        );
      }

      toast.success(
        "Baptism application submitted successfully! We will contact you soon."
      );
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        reasonForBaptism: "",
        previousChurch: "",
        howHeard: "",
      });
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      console.error("Error submitting baptism application:", error);
      toast.error(error.message || "Failed to submit baptism application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <Card className="bg-white/95 shadow-xl rounded-2xl border border-gray-100 backdrop-blur-sm">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Baptism Application
            </CardTitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm sm:text-base text-gray-600 mt-2"
            >
              Take the next step in your spiritual journey. Fill out the form
              below to apply for baptism.
            </motion.p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="m@example.com"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" /> Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="reasonForBaptism"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Church className="h-4 w-4" /> Reason for Baptism
                </Label>
                <Textarea
                  id="reasonForBaptism"
                  name="reasonForBaptism"
                  value={formData.reasonForBaptism}
                  onChange={handleChange}
                  placeholder="Share your personal testimony and why you wish to be baptized."
                  rows={5}
                  required
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="previousChurch"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Church className="h-4 w-4" /> Previous Church Affiliation
                  (Optional)
                </Label>
                <Input
                  id="previousChurch"
                  name="previousChurch"
                  value={formData.previousChurch}
                  onChange={handleChange}
                  placeholder="Name of previous church, if any"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="howHeard"
                  className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                >
                  <Info className="h-4 w-4" /> How Did You Hear About Us?
                  (Optional)
                </Label>
                <Input
                  id="howHeard"
                  name="howHeard"
                  value={formData.howHeard}
                  onChange={handleChange}
                  placeholder="e.g., Friend, Online, Event"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg py-2.5 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
