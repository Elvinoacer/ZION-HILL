"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion"; // Import motion
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import { useSession } from "next-auth/react";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        throw new Error(errorData.message || "Failed to submit baptism application.");
      }

      toast.success("Baptism application submitted successfully! We will contact you soon.");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        reasonForBaptism: "",
        previousChurch: "",
        howHeard: "",
      });
      // router.push("/"); // Redirect to home or a thank you page
    } catch (error: any) {
      console.error("Error submitting baptism application:", error);
      toast.error(error.message || "Failed to submit baptism application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-none bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-extrabold text-blue-800 tracking-tight">Baptism Application</CardTitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-gray-600 mt-2"
            >
              Fill out the form below to apply for baptism.
            </motion.p>
          </CardHeader>
          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              <motion.div variants={itemVariants}>
                <Label htmlFor="fullName" className="text-gray-700 font-medium mb-1 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-gray-700 font-medium mb-1 block">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium mb-1 block">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium mb-1 block">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="reasonForBaptism" className="text-gray-700 font-medium mb-1 block">
                  Reason for Baptism
                </Label>
                <Textarea
                  id="reasonForBaptism"
                  name="reasonForBaptism"
                  value={formData.reasonForBaptism}
                  onChange={handleChange}
                  placeholder="Share your personal testimony and why you wish to be baptized."
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="previousChurch" className="text-gray-700 font-medium mb-1 block">
                  Previous Church Affiliation (Optional)
                </Label>
                <Input
                  id="previousChurch"
                  name="previousChurch"
                  value={formData.previousChurch}
                  onChange={handleChange}
                  placeholder="Name of previous church, if any."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label htmlFor="howHeard" className="text-gray-700 font-medium mb-1 block">
                  How did you hear about our church? (Optional)
                </Label>
                <Input
                  id="howHeard"
                  name="howHeard"
                  value={formData.howHeard}
                  onChange={handleChange}
                  placeholder="e.g., Friend, Online, Event"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
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
