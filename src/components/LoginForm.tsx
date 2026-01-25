
"use client";
import { churchConfig } from "@/lib/church-config";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/member/dashboard";

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
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
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
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <Lock className="h-4 w-4 text-blue-500" /> One-Time Password
              </Label>
              <Input
                type="text"
                id="otp"
                placeholder="Enter 6-digit code"
                {...otpForm.register("otp")}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-lg tracking-widest"
                maxLength={6}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-red-500 text-xs mt-1 font-medium bg-red-50 p-2 rounded">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>
            <div className="text-center text-sm text-gray-500 my-4">
              {countdown > 0 ? (
                <p>Code expires in <span className="font-semibold text-blue-600">{countdown}s</span></p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleGenerateOtp(form.getValues())}
                  disabled={form.formState.isSubmitting}
                  className="text-blue-600 p-0 h-auto font-medium"
                >
                  Resend Code
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={otpForm.formState.isSubmitting || countdown === 0 || isRedirecting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Logging in...
                </>
              ) : otpForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
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
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <Mail className="h-4 w-4 text-gray-400" /> Email Address
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...form.register("email")}
                className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2 relative">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <Lock className="h-4 w-4 text-gray-400" /> Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-9 w-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-100"
                >
                  <p className="text-red-600 text-xs text-center font-medium">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Sending Code...
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
