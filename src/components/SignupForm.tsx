
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeFetch } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." })
    .regex(/^[a-zA-Z][a-zA-Z\s\-'.]*$/, { message: "Name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(100, { message: "Password must be less than 100 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);

    try {
      await safeFetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, callbackUrl }),
      });

      toast.success("Registration successful! Please check your email.");
      router.push(`/verify-email?callbackUrl=${callbackUrl || ''}`);
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

 return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g. John Doe"
          {...form.register("name")}
          className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {form.formState.errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
          className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {form.formState.errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.email.message}</p>}
      </div>
      <div className="grid gap-2 relative">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.password.message}</p>}
      </div>
      <div className="grid gap-2 relative">
        <Label
          htmlFor="confirm-password"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            {...form.register("confirmPassword")}
            className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.confirmPassword.message}</p>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs bg-red-50 p-3 rounded-lg text-center font-medium border border-red-100"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-green-600 text-xs bg-green-50 p-3 rounded-lg text-center font-medium border border-green-100"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
      >
        {form.formState.isSubmitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...</>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
};
