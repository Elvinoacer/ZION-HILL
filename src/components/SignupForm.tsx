
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
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
        body: JSON.stringify(values),
      });

      toast.success("Registration successful! Please check your email.");
      router.push(`/verify-email?callbackUrl=${callbackUrl}`);
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="grid gap-2">
        <Label
          htmlFor="name"
          className="text-sm sm:text-base font-medium text-gray-700"
        >
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...form.register("name")}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
        />
        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-sm sm:text-base font-medium text-gray-700"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...form.register("email")}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
        />
        {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
      </div>
      <div className="grid gap-2 relative">
        <Label
          htmlFor="password"
          className="text-sm sm:text-base font-medium text-gray-700"
        >
          Password
        </Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          {...form.register("password")}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all pr-10"
        />
        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-8 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
      </div>
      <div className="grid gap-2 relative">
        <Label
          htmlFor="confirm-password"
          className="text-sm sm:text-base font-medium text-gray-700"
        >
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          {...form.register("confirmPassword")}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all pr-10"
        />
        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-8 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        {form.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>}
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
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-green-500 text-sm text-center"
          >
            {success}
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
          "Sign Up"
        )}
      </Button>
    </form>
  );
};
