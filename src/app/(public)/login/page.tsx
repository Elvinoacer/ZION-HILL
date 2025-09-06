"use client";
import { churchConfig } from "@/lib/church-config";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeFetch } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpForm && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpForm, countdown]);

  const handleGenerateOtp = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      await safeFetch("/api/auth/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });
      setShowOtpForm(true);
      setCountdown(60);
      toast.success("OTP sent to your email.");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    setError(null);
    try {
      await safeFetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.getValues("email"),
          otp: values.otp,
        }),
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: form.getValues("email"),
        password: form.getValues("password"),
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setIsRedirecting(true);
        toast.success("Login successful! Redirecting...");
        router.push("/member/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-xl rounded-2xl border border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              {showOtpForm
                ? "Enter OTP"
                : `Login to ${churchConfig.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {showOtpForm ? (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                    className="space-y-5"
                  >
                    <div className="grid gap-2">
                      <Label
                        htmlFor="otp"
                        className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" /> One-Time Password
                      </Label>
                      <Input
                        type="text"
                        id="otp"
                        placeholder="123456"
                        {...otpForm.register("otp")}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="text-red-500 text-xs">
                          {otpForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      {countdown > 0 ? (
                        <p>OTP expires in {countdown} seconds</p>
                      ) : (
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => handleGenerateOtp(form.getValues())}
                          disabled={form.formState.isSubmitting}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={otpForm.formState.isSubmitting || countdown === 0 || isRedirecting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg py-2.5 transition-all duration-300"
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Redirecting...
                        </>
                      ) : otpForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={form.handleSubmit(handleGenerateOtp)}
                    className="space-y-5"
                  >
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="m@example.com"
                        {...form.register("email")}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-xs">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2 relative">
                      <Label
                        htmlFor="password"
                        className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" /> Password
                      </Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        {...form.register("password")}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-8 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      {form.formState.errors.password && (
                        <p className="text-red-500 text-xs">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm text-center"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg py-2.5 transition-all duration-300"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Please wait
                        </>
                      ) : (
                        "Get OTP"
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
