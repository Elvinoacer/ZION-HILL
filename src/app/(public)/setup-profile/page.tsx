"use client";

import { useSetupStore } from "@/store/setupStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Phone, Home, Calendar, UploadCloud, Search, Plus, ArrowRight, ArrowLeft, Check, Users, Loader2 } from "lucide-react";

const ProgressIndicator = ({ step }: { step: number }) => {
  const steps = ["Profile", "Family", "Review"];

  return (
    <div className="flex items-start justify-center mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = step > stepNumber;
        const isCurrent = step === stepNumber;

        return (
          <div key={label} className="flex items-center w-1/3">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isCompleted ? "bg-blue-600 text-white" : isCurrent ? "bg-blue-100 text-blue-600 border-2 border-blue-500" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check size={20} /> : <span className="font-bold">{stepNumber}</span>}
              </div>
              <p className={`mt-2 text-[11px] leading-tight sm:text-xs md:text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-auto border-t-2 transition-all duration-300 mx-2 sm:mx-4 ${isCompleted ? 'border-blue-600' : 'border-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};


const Step1 = () => {
  const { formData, setFormData } = useSetupStore();
  const [imagePreview, setImagePreview] = useState<string | null>(formData.photo);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Label htmlFor="photo" className="cursor-pointer">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:border-gray-400 transition-all">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-full" />
            ) : (
              <UploadCloud size={40} />
            )}
          </div>
        </Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        <p className="text-sm text-gray-500">Upload a profile picture</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700"><Phone size={16} /> Phone</Label>
          <Input id="phone" placeholder="e.g., +1 234 567 890" value={formData.phone} onChange={(e) => setFormData({ phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthdate" className="flex items-center gap-2 text-gray-700"><Calendar size={16} /> Birthdate</Label>
          <Input id="birthdate" type="date" value={formData.birthdate} onChange={(e) => setFormData({ birthdate: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2 text-gray-700"><Home size={16} /> Address</Label>
        <Input id="address" placeholder="e.g., 123 Main St, Anytown, USA" value={formData.address} onChange={(e) => setFormData({ address: e.target.value })} />
      </div>
    </motion.div>
  );
};

const Step2 = () => {
  const { formData, setFormData } = useSetupStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await safeFetch(`/api/families/search?query=${searchQuery}`);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to search for families.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="p-4 border rounded-lg bg-white">
        <Label className="text-base sm:text-lg font-semibold flex items-center gap-2"><Users size={20}/> Join an Existing Family</Label>
        <p className="text-sm text-gray-500 mb-4">Search for your family unit to join them.</p>
        <div className="flex gap-2">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by family name..." />
          <Button onClick={handleSearch} disabled={isLoading} size="icon">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search size={18} />}</Button>
        </div>
        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
          {hasSearched && searchResults.length === 0 && (
            <p className='text-center text-gray-500 py-4'>No families found. You can create a new one below.</p>
          )}
          {searchResults.map((family) => (
            <div key={family.id} className={`p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-all ${formData.familyId === family.id ? 'bg-blue-100 border-blue-400' : ''}`}
              onClick={() => setFormData({ familyId: family.id, newFamilyName: '' })}>
              <p className="font-medium text-sm">{family.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="p-4 border rounded-lg bg-white">
        <Label htmlFor="newFamilyName" className="text-base sm:text-lg font-semibold flex items-center gap-2"><Plus size={20}/> Create a New Family</Label>
        <p className="text-sm text-gray-500 mb-4">If you can't find your family, create a new one.</p>
        <Input id="newFamilyName" placeholder="e.g., The Smiths" value={formData.newFamilyName} onChange={(e) => setFormData({ newFamilyName: e.target.value, familyId: null })} />
      </div>
    </motion.div>
  )
}

const Step3 = () => {
  const { formData } = useSetupStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Review Your Information</h3>
        <p className="text-gray-500 text-sm">Please confirm the details below are correct.</p>
      </div>
      <div className="border rounded-lg p-4 sm:p-6 bg-white space-y-4">
        <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0">
          <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Profile Picture</strong>
          {formData.photo ? <img src={formData.photo} alt="Preview" className="h-16 w-16 object-cover rounded-full" /> : <span className="text-gray-500 text-sm">Not provided</span>}
        </div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0 border-t sm:border-t-0">
          <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Phone</strong>
          <span className="text-gray-800 text-sm">{formData.phone || "Not provided"}</span>
        </div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0 border-t sm:border-t-0">
          <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Address</strong>
          <span className="text-gray-800 text-sm">{formData.address || "Not provided"}</span>
        </div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0 border-t sm:border-t-0">
          <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Birthdate</strong>
          <span className="text-gray-800 text-sm">{formData.birthdate || "Not provided"}</span>
        </div>
        {formData.familyId && (
          <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0 border-t sm:border-t-0">
            <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Joining Family</strong>
            <span className="text-gray-800 font-semibold text-sm">ID: {formData.familyId}</span>
          </div>
        )}
        {formData.newFamilyName && (
          <div className="flex flex-col items-start sm:flex-row sm:items-center pt-2 first:pt-0 border-t sm:border-t-0">
            <strong className="sm:w-1/3 text-gray-600 text-sm mb-1 sm:mb-0">Creating Family</strong>
            <span className="text-gray-800 font-semibold text-sm">{formData.newFamilyName}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SetupProfilePage = () => {
  const { data: session, status } = useSession();
  const { step, setStep, formData, setFormData } = useSetupStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async () => {
    const imageInput = document.getElementById('photo') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    if (!imageFile) return formData.photo || null;

    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);
    try {
      const response = await safeFetch<{ url: string }>("/api/upload-image", { method: "POST", body: uploadFormData });
      setFormData({ photo: response.url });
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // @ts-expect-error
  if (session?.user?.profileComplete) {
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl || "/member/dashboard");
    return null;
  }

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (step === 1) {
        await handleImageUpload();
      }
      setStep(step + 1);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await safeFetch("/api/profile/setup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success("Profile setup complete! Welcome!");
      
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/member/dashboard");
    } catch (error) {
      toast.error("Failed to complete profile setup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl border-gray-200">
        <CardHeader className="text-center border-b p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Complete Your Profile</CardTitle>
          <p className="text-sm text-gray-500">Let's get your account ready.</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <ProgressIndicator step={step} />
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between items-center">
            <div>
              {step > 1 && <Button variant="outline" onClick={handleBack} disabled={isLoading}><ArrowLeft size={16} className="mr-2"/> Back</Button>}
            </div>
            <div>
              {step < 3 && <Button onClick={handleNext} disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <>Next <ArrowRight size={16} className="ml-2"/></>}</Button>}
              {step === 3 && <Button onClick={handleSubmit} disabled={isLoading} className="bg-green-600 hover:bg-green-700">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Finishing...</> : <>Finish Setup <Check size={16} className="ml-2"/></>}</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupProfilePage;
