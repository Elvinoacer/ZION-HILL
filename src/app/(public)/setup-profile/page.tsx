"use client";

import { useSetupStore } from "@/store/setupStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Step1 = () => {
  const { formData, setFormData } = useSetupStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await safeFetch<{ url: string }>("/api/upload-image", { method: "POST", body: formData });
      setFormData({ photo: response.url });
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo">Profile Picture</Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-full" />}
        <Button onClick={handleImageUpload} disabled={!imageFile}>Upload</Button>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ phone: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={formData.address} onChange={(e) => setFormData({ address: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Input id="birthdate" type="date" value={formData.birthdate} onChange={(e) => setFormData({ birthdate: e.target.value })} />
      </div>
    </div>
  );
};

const Step2 = () => {
  const { formData, setFormData } = useSetupStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const results = await safeFetch(`/api/families/search?query=${searchQuery}`);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to search for families.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Find your Family</Label>
        <div className="flex gap-2">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your family..." />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="mt-4 space-y-2">
          {searchResults.map((family) => (
            <div key={family.id} className={`p-2 border rounded-lg cursor-pointer ${formData.familyId === family.id ? 'bg-blue-100' : ''}`}
              onClick={() => setFormData({ familyId: family.id, newFamilyName: '' })}>
              {family.name}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">OR</div>
      <div>
        <Label htmlFor="newFamilyName">Create a new Family</Label>
        <Input id="newFamilyName" value={formData.newFamilyName} onChange={(e) => setFormData({ newFamilyName: e.target.value, familyId: null })} />
      </div>
    </div>
  )
}

const Step3 = () => {
  const { formData } = useSetupStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review your information</h3>
      <div><strong>Phone:</strong> {formData.phone}</div>
      <div><strong>Address:</strong> {formData.address}</div>
      <div><strong>Birthdate:</strong> {formData.birthdate}</div>
      {formData.photo && <div><strong>Photo:</strong> <img src={formData.photo} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-full" /></div>}
      {formData.familyId && <div><strong>Family ID:</strong> {formData.familyId}</div>}
      {formData.newFamilyName && <div><strong>New Family Name:</strong> {formData.newFamilyName}</div>}
    </div>
  )
}

const SetupProfilePage = () => {
  const { data: session, status } = useSession();
  const { step, setStep, formData } = useSetupStore();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>; // Or a spinner
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

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await safeFetch("/api/profile/setup", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Profile setup complete!");
      router.push("/member/dashboard");
    } catch (error) {
      toast.error("Failed to complete profile setup.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Setup Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-center text-sm text-gray-500">Step {step} of 3</p>
          </div>
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
          </motion.div>
          <div className="mt-6 flex justify-between">
            {step > 1 && <Button onClick={handleBack}>Back</Button>}
            {step < 3 && <Button onClick={handleNext}>Next</Button>}
            {step === 3 && <Button onClick={handleSubmit}>Finish</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupProfilePage;