"use client";
import { churchConfig } from "@/lib/church-config";

import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeFetch } from "@/lib/api";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Login successful! Redirecting...");
      router.push("/member/dashboard");
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
              Login to {churchConfig.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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
                {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
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
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-8 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
              </div>
              {error === "Email not verified. Please check your inbox." && (
                <Button type="button" variant="link" onClick={async () => {
                  try {
                    await safeFetch("/api/auth/resend-verification", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email: form.getValues("email") }),
                    });
                    toast.success("Verification email sent. Please check your inbox.");
                  } catch (err) {
                    toast.error("Failed to resend verification email.");
                  }
                }}>
                  Resend verification email
                </Button>
              )}
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;