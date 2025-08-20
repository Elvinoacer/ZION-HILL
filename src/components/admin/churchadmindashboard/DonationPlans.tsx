"use client";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ImagePlus,
  Trash2,
  Edit,
  BarChart2,
  HandHeart,
  Loader2,
  X,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  goalAmount: z.coerce.number().min(0).optional(),
  type: z.enum(["PROJECT", "MINISTRY", "USER_REQUEST", "GENERAL"]),
  imageUrl: z.string().optional(),
});

interface DonationPlan {
  id: string;
  name: string;
  description: string | null;
  goalAmount: number | null;
  type: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function DonationPlans({ searchQuery }: { searchQuery: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationPlans, setDonationPlans] = useState<DonationPlan[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [editingPlan, setEditingPlan] = useState<DonationPlan | null>(null);
  const router = useRouter();

  const filteredDonationPlans = donationPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      goalAmount: 0,
      type: "GENERAL",
      imageUrl: "",
    },
  });

  const fetchDonationPlans = async () => {
    try {
      const response = await fetch("/api/donation-plans");
      if (!response.ok) {
        throw new Error("Failed to fetch donation plans.");
      }
      const data = await response.json();
      setDonationPlans(data);
    } catch (error: any) {
      toast.error("Failed to load donation plans.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonationPlans();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    console.log("Submitting form. editingPlan:", editingPlan);
    try {
      let imageUrl = editingPlan?.imageUrl || ""; // Preserve existing image if not changed
      if (selectedImageFile) {
        const formData = new FormData();
        console.log("Selected image file:", selectedImageFile);
        formData.append("file", selectedImageFile);
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to upload image.");
        }
        imageUrl = result.url;
      }

      let apiResponse;
      if (editingPlan) {
        // Update existing plan
        apiResponse = await fetch(`/api/donation-plans/${editingPlan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, imageUrl }),
        });
      } else {
        // Create new plan
        apiResponse = await fetch("/api/donation-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, imageUrl }),
        });
      }

      if (!apiResponse.ok) {
        throw new Error(
          editingPlan
            ? "Failed to update donation plan."
            : "Failed to create donation plan."
        );
      }

      toast.success(
        editingPlan
          ? "Donation plan updated successfully!"
          : "Donation plan created successfully!"
      );
      form.reset();
      setSelectedImageFile(null);
      setImagePreview(null);
      setEditingPlan(null); // Clear editing state
      fetchDonationPlans();
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan: DonationPlan) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      description: plan.description || "",
      goalAmount: plan.goalAmount || 0,
      type: plan.type as "PROJECT" | "MINISTRY" | "USER_REQUEST" | "GENERAL",
      imageUrl: plan.imageUrl || "",
    });
    setImagePreview(plan.imageUrl);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    form.reset();
    setSelectedImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/donation-plans/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete donation plan.");
      }

      toast.success("Donation plan deleted successfully.");
      fetchDonationPlans();
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-800";
      case "MINISTRY":
        return "bg-purple-100 text-purple-800";
      case "USER_REQUEST":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Donation Plans</h1>
        <p className="text-gray-600 mt-2">
          Create and manage donation plans for your church
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Donation Plan Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-6 w-6 text-indigo-600" />
              <span>{editingPlan ? "Edit Plan" : "Create New Plan"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {editingPlan && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      Cancel Edit
                    </Button>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., New Building Fund"
                          {...field}
                          className="focus:ring-2 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of the donation plan."
                          {...field}
                          className="min-h-[100px] focus:ring-2 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Amount (KES)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            KES
                          </span>
                          <Input
                            type="number"
                            {...field}
                            className="pl-12 focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="Select a plan type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PROJECT">Project</SelectItem>
                          <SelectItem value="MINISTRY">Ministry</SelectItem>
                          <SelectItem value="USER_REQUEST">
                            User Request
                          </SelectItem>
                          <SelectItem value="GENERAL">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Plan Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editingPlan ? "Saving..." : "Creating..."}
                    </span>
                  ) : (
                    editingPlan ? "Save Changes" : "Create Plan"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Existing Donation Plans */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Existing Plans
            </h2>
            <Badge variant="outline" className="px-3 py-1">
              {donationPlans.length} Plans
            </Badge>
          </div>

          <AnimatePresence>
            {filteredDonationPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg"
              >
                <HandHeart className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  No donation plans found.
                </h3>
                <p className="text-gray-500 text-center mt-2">
                  Adjust your search or create a new plan.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDonationPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-40">
                        <img
                          src={plan.imageUrl || "/images/donation-default.jpg"}
                          alt={plan.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <Badge className={getBadgeVariant(plan.type)}>
                            {plan.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {plan.description || "No description provided"}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Goal Amount</p>
                            <p className="font-medium">
                              {plan.goalAmount
                                ? `KES ${plan.goalAmount.toLocaleString()}`
                                : "Not specified"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                router.push(
                                  `/finance-administrator/donation-plans/${plan.id}`
                                )
                              }
                              className="text-indigo-600 hover:bg-indigo-50"
                            >
                              <BarChart2 className="h-4 w-4 mr-2" />
                              Stats
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(plan)}
                              className="text-gray-600 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(plan.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
