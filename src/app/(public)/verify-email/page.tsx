"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { motion } from "framer-motion";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-xl rounded-2xl border border-gray-100 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
              <MailCheck className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-800 pt-4">
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <p className="text-gray-600">
              We've sent a verification link to your email address. Please check your inbox (and spam folder) to complete your registration.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
