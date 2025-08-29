"use client";

import { useSetupStore } from "@/store/setupStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, Phone, Home, Calendar, UploadCloud, Search, Plus, ArrowRight, ArrowLeft, Check, Users } from "lucide-react";

const ProgressIndicator = ({ step }: { step: number }) => {
  const steps = ["Profile Info", "Family Details", "Review & Finish"];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = step > stepNumber;
        const isCurrent = step === stepNumber;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? "bg-blue-600 text-white" : isCurrent ? "bg-blue-100 text-blue-600 border-2 border-blue-500" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check size={20} /> : <span className="font-bold">{stepNumber}</span>}
              </div>
              <p className={`mt-2 text-xs sm:text-sm text-center font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-auto border-t-2 transition-all duration-300 mx-4 ${isCompleted ? 'border-blue-600' : 'border-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};


const Step1 = () => {
  const { formData, setFormData } = useSetupStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.photo);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Label htmlFor="photo" className="cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:border-gray-400 transition-all">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-full" />
            ) : (
              <UploadCloud size={40} />
            )}
          </div>
        </Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        <p className="text-sm text-gray-500">Click the icon to upload a profile picture</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <Label className="text-lg font-semibold flex items-center gap-2"><Users size={20}/> Join an Existing Family</Label>
        <p className="text-sm text-gray-500 mb-4">Search for your family unit to join them.</p>
        <div className="flex gap-2">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by family name..." />
          <Button onClick={handleSearch} disabled={isLoading}>{isLoading ? "..." : <Search size={18} />}</Button>
        </div>
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          {searchResults.map((family) => (
            <div key={family.id} className={`p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-all ${formData.familyId === family.id ? 'bg-blue-100 border-blue-400' : ''}`}
              onClick={() => setFormData({ familyId: family.id, newFamilyName: '' })}>
              <p className="font-medium">{family.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <Label htmlFor="newFamilyName" className="text-lg font-semibold flex items-center gap-2"><Plus size={20}/> Create a New Family</Label>
        <p className="text-sm text-gray-500 mb-4">If you can't find your family, create a new one.</p>
        <Input id="newFamilyName" placeholder="e.g., The Smiths" value={formData.newFamilyName} onChange={(e) => setFormData({ newFamilyName: e.target.value, familyId: null })} />
      </div>
    </motion.div>
  )
}

const Step3 = () => {
  const { formData } = useSetupStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Review Your Information</h3>
        <p className="text-gray-500">Please confirm that the details below are correct before finishing.</p>
      </div>
      <div className="border rounded-lg p-6 bg-white space-y-4 divide-y">
        <div className="flex items-center pt-4 first:pt-0">
          <strong className="w-1/3 text-gray-600">Profile Picture</strong>
          {formData.photo && <img src={formData.photo} alt="Preview" className="h-20 w-20 object-cover rounded-full" />}
        </div>
        <div className="flex items-center pt-4 first:pt-0">
          <strong className="w-1/3 text-gray-600">Phone</strong>
          <span className="text-gray-800">{formData.phone}</span>
        </div>
        <div className="flex items-center pt-4 first:pt-0">
          <strong className="w-1/3 text-gray-600">Address</strong>
          <span className="text-gray-800">{formData.address}</span>
        </div>
        <div className="flex items-center pt-4 first:pt-0">
          <strong className="w-1/3 text-gray-600">Birthdate</strong>
          <span className="text-gray-800">{formData.birthdate}</span>
        </div>
        {formData.familyId && (
          <div className="flex items-center pt-4 first:pt-0">
            <strong className="w-1/3 text-gray-600">Joining Family</strong>
            <span className="text-gray-800 font-semibold">ID: {formData.familyId}</span>
          </div>
        )}
        {formData.newFamilyName && (
          <div className="flex items-center pt-4 first:pt-0">
            <strong className="w-1/3 text-gray-600">Creating Family</strong>
            <span className="text-gray-800 font-semibold">{formData.newFamilyName}</span>
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
    router.push("/member/dashboard");
    return null;
  }

  const handleNext = async () => {
    if (step === 1) {
      await handleImageUpload();
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await safeFetch("/api/profile/setup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success("Profile setup complete! Welcome!");
      router.push("/member/dashboard");
    } catch (error) {
      toast.error("Failed to complete profile setup.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4 font-sans">
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border-gray-200">
        <CardHeader className="text-center border-b p-6">
          <CardTitle className="text-3xl font-bold text-gray-800">Complete Your Profile</CardTitle>
          <p className="text-gray-500">Let's get your account ready for you.</p>
        </CardHeader>
        <CardContent className="p-6 sm:p-10">
          <ProgressIndicator step={step} />
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex justify-between items-center">
            <div>
              {step > 1 && <Button variant="outline" onClick={handleBack}><ArrowLeft size={16} className="mr-2"/> Back</Button>}
            </div>
            <div>
              {step < 3 && <Button onClick={handleNext}>Next <ArrowRight size={16} className="ml-2"/></Button>}
              {step === 3 && <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Finish Setup <Check size={16} className="ml-2"/></Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupProfilePage;
