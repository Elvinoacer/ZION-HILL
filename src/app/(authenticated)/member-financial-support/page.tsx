"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
  email: z
    .string()
    .email("Invalid email address.")
    .max(100, "Email cannot exceed 100 characters."),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?\d{10,15}$/.test(val),
      "Invalid phone number format."
    ),
  amountRequested: z.coerce
    .number()
    .min(1, "Amount must be greater than 0.")
    .max(1000000, "Amount cannot exceed KES 1,000,000."),
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters.")
    .max(500, "Reason cannot exceed 500 characters."),
});

export default function FinancialSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amountRequested: 0,
      reason: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isValid, dirtyFields },
  } = form;

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        amountRequested: 0,
        reason: "",
      });
    }
  }, [session, form]);

  useEffect(() => {
    // Calculate form progress based on filled fields
    const totalFields = Object.keys(formSchema.shape).length;
    const filledFields = Object.keys(dirtyFields).length;
    const progress = Math.round((filledFields / totalFields) * 100);
    setFormProgress(progress);
  }, [dirtyFields]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/financial-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request.");
      }

      setIsModalOpen(true);
      form.reset();
    } catch (error: any) {
      toast.error("An error occurred. Please try again.", {
        description: error.message,
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Financial Support Request
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
            Request financial assistance with confidence. All submissions are
            handled securely and confidentially.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Form Progress
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {formProgress}%
              </span>
            </div>
            <Progress value={formProgress} className="h-2 bg-gray-100" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        {...field}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+254..."
                        {...field}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountRequested"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Amount Requested (KES)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Reason for Request
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly explain your situation and why you need financial assistance."
                        {...field}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>Request Submitted</span>
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  Your financial support request has been successfully
                  submitted. We will review it and get back to you soon.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={handleModalClose}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </motion.div>
  );
}
