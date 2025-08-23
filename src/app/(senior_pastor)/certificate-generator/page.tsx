"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";

export default function CertificateGenerator() {
  const initialFormData = {
    certificateType: "",
    recipientName: "",
    dateOfEvent: "",
    eventName: "",
    pastorName: "",
    churchName: "Grace Community Church",
    churchLocation: "New York, NY",
    certificateId: "",
    briefDescription:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
    churchLogo: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [cloudinaryFinalUrl, setCloudinaryFinalUrl] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false); // New state for upload status
  const [uploadError, setUploadError] = useState<string | null>(null); // New state for upload error
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // State to store fetched users
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Placeholder for fetching users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormData({ ...formData, [name]: ev.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.certificateType ||
      !formData.recipientName ||
      !formData.dateOfEvent ||
      !formData.pastorName ||
      !formData.churchName ||
      !formData.churchLocation
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (
      formData.certificateType === "Course Completion Certificate" &&
      !formData.eventName
    ) {
      alert(
        "Please provide the Event/Course Name for Course Completion Certificate."
      );
      return;
    }

    // Auto-generate certificate ID if not provided
    let certId = formData.certificateId;
    if (!certId) {
      certId = "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Generate PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Background color
    doc.setFillColor(248, 250, 252); // Light blue-gray
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    // Border design
    doc.setDrawColor(59, 130, 246); // Blue-500
    doc.setLineWidth(1.5);
    doc.rect(
      15,
      15,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 30
    );

    // Ornamental corners
    doc.setFillColor(59, 130, 246);
    doc.rect(15, 15, 10, 10, "F");
    doc.rect(doc.internal.pageSize.getWidth() - 25, 15, 10, 10, "F");
    doc.rect(15, doc.internal.pageSize.getHeight() - 25, 10, 10, "F");
    doc.rect(
      doc.internal.pageSize.getWidth() - 25,
      doc.internal.pageSize.getHeight() - 25,
      10,
      10,
      "F"
    );

    // Church logo
    if (formData.churchLogo) {
      const format = formData.churchLogo
        .split(";")[0]
        .split("/")[1]
        .toUpperCase();
      doc.addImage(formData.churchLogo, format, 30, 25, 40, 40);
    }

    // Header
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55); // Gray-800
    doc.text(formData.churchName, doc.internal.pageSize.getWidth() / 2, 45, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99); // Gray-600
    doc.text(
      formData.churchLocation,
      doc.internal.pageSize.getWidth() / 2,
      55,
      { align: "center" }
    );

    // Certificate title
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216); // Blue-700
    doc.text(
      `Certificate of ${formData.certificateType.replace(" Certificate", "")}`,
      doc.internal.pageSize.getWidth() / 2,
      80,
      { align: "center" }
    );

    // Decorative line
    doc.setDrawColor(29, 78, 216);
    doc.setLineWidth(1);
    doc.line(60, 90, doc.internal.pageSize.getWidth() - 60, 90);

    // Main content
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    doc.text(
      "This is to certify that",
      doc.internal.pageSize.getWidth() / 2,
      110,
      { align: "center" }
    );

    // Recipient name
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216);
    doc.text(
      formData.recipientName,
      doc.internal.pageSize.getWidth() / 2,
      130,
      { align: "center" }
    );

    // Certificate body
    let bodyText = "";
    switch (formData.certificateType) {
      case "Baptism Certificate":
        bodyText = `has been baptized in the name of the Father, the Son, and the Holy Spirit\non this ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}\nat ${formData.churchName}, ${formData.churchLocation}.`;
        break;
      case "Membership Certificate":
        bodyText = `is hereby recognized as an official member of ${
          formData.churchName
        }\nwith all the rights and privileges thereof, effective ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}.`;
        break;
      case "Dedication Certificate":
        bodyText = `has been dedicated to the Lord on this ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}\nat ${formData.churchName}, ${
          formData.churchLocation
        }\nwith the prayer that they may grow in wisdom and stature,\nand in favor with God and man.`;
        break;
      case "Course Completion Certificate":
        bodyText = `has successfully completed the requirements for\n"${
          formData.eventName
        }"\non this ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}\nat ${formData.churchName}, ${formData.churchLocation}.`;
        break;
      case "Other":
        bodyText = `is awarded this certificate on ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}\nin recognition of faithful service to ${formData.churchName}.`;
        break;
      default:
        bodyText = `is awarded this certificate on ${format(
          new Date(formData.dateOfEvent),
          "do MMMM, yyyy"
        )}.`;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(bodyText, doc.internal.pageSize.getWidth() / 2, 155, {
      align: "center",
    });

    // Optional description
    if (formData.briefDescription) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(75, 85, 99);
      doc.text(
        formData.briefDescription,
        doc.internal.pageSize.getWidth() / 2,
        180,
        {
          align: "center",
          maxWidth: 160,
        }
      );
    }

    // Signature section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    doc.text("_________________________", 60, 200);
    doc.text(formData.pastorName, 60, 210);
    doc.text("Pastor", 60, 216);
    doc.text(formData.churchName, 60, 222);

    doc.text(
      "_________________________",
      doc.internal.pageSize.getWidth() - 100,
      200
    );
    doc.text("Church Secretary", doc.internal.pageSize.getWidth() - 100, 210);
    doc.text(formData.churchName, doc.internal.pageSize.getWidth() - 100, 216);

    // Certificate ID and date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Certificate ID: ${certId}`,
      30,
      doc.internal.pageSize.getHeight() - 20
    );
    doc.text(
      `Issued on: ${format(new Date(formData.dateOfEvent), "MMMM do, yyyy")}`,
      doc.internal.pageSize.getWidth() - 70,
      doc.internal.pageSize.getHeight() - 20
    );

    // Generate blob URL for preview and download
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setGeneratedPdfUrl(url);

    // Temporary: Add a download link for the locally generated PDF
    const tempDownloadLink = document.createElement("a");
    tempDownloadLink.href = url;
    tempDownloadLink.download = "local_certificate.pdf";
    tempDownloadLink.textContent = "Download Local PDF";
    tempDownloadLink.style.display = "block";
    tempDownloadLink.style.marginTop = "10px";
    document.body.appendChild(tempDownloadLink);
    // End Temporary

    // Upload PDF to Cloudinary
    setIsUploading(true);
    setUploadError(null);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append(
        "file",
        pdfBlob,
        `${formData.recipientName.replace(
          /\s/g,
          "_"
        )}_${formData.certificateType.replace(/\s/g, "_")}.pdf`
      );

      const uploadResponse = await fetch("/api/upload-certificate", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          errorData.message || "Failed to upload PDF to Cloudinary"
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("Cloudinary URL:", uploadResult.url);
      console.log("Cloudinary Upload Result:", uploadResult); // Added for debugging
      setCloudinaryFinalUrl(uploadResult.url); // Store the Cloudinary URL in state
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAssignCertificate = async (user: any) => {
    if (!cloudinaryFinalUrl) {
      alert("Please generate and upload the certificate first.");
      return;
    }

    try {
      const saveCertificateResponse = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          certificateType: formData.certificateType,
          cloudinaryUrl: cloudinaryFinalUrl,
          issuedDate: formData.dateOfEvent,
          eventName: formData.eventName,
          pastorName: formData.pastorName,
          churchName: formData.churchName,
          churchLocation: formData.churchLocation,
          certificateId:
            formData.certificateId ||
            "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          briefDescription: formData.briefDescription,
          recipientName: formData.recipientName,
        }),
      });

      if (!saveCertificateResponse.ok) {
        const errorData = await saveCertificateResponse.json();
        throw new Error(
          errorData.message || "Failed to save certificate details to database"
        );
      }
      console.log("Certificate assigned and saved to database!");
      alert(`Certificate successfully assigned to ${user.name}!`);
      setIsAssignUserModalOpen(false);
      setSelectedUser(user);
    } catch (error: any) {
      console.error("Error assigning certificate:", error);
      alert(`Error assigning certificate: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Church Certificate Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            Create beautiful, professional certificates for your church members
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Certificate Details
              </h2>
              <p className="text-blue-300">
                Fill out the form to generate your certificate
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {isUploading && (
                <div className="text-center text-blue-400 font-medium">
                  Uploading certificate... Please wait.
                </div>
              )}
              {uploadError && (
                <div className="text-center text-red-400 font-medium">
                  Error uploading: {uploadError}
                </div>
              )}
              <div>
                <label
                  htmlFor="certificateType"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Certificate Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="certificateType"
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                >
                  <option value="">Select Type</option>
                  <option value="Baptism Certificate">
                    Baptism Certificate
                  </option>
                  <option value="Membership Certificate">
                    Membership Certificate
                  </option>
                  <option value="Dedication Certificate">
                    Dedication Certificate
                  </option>
                  <option value="Course Completion Certificate">
                    Course Completion Certificate
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="recipientName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Recipient's Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="dateOfEvent"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Date of Event <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfEvent"
                    name="dateOfEvent"
                    value={formData.dateOfEvent}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                  />
                </div>

                {formData.certificateType ===
                  "Course Completion Certificate" && (
                  <div>
                    <label
                      htmlFor="eventName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Course/Event Name
                    </label>
                    <input
                      type="text"
                      id="eventName"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      placeholder="e.g., Foundations of Faith"
                      className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="pastorName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Pastor's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pastorName"
                    name="pastorName"
                    value={formData.pastorName}
                    onChange={handleChange}
                    placeholder="e.g., Pastor Jane Smith"
                    required
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="churchName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Church Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="churchName"
                    name="churchName"
                    value={formData.churchName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="churchLocation"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Church Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="churchLocation"
                  name="churchLocation"
                  value={formData.churchLocation}
                  onChange={handleChange}
                  placeholder="e.g., City, State, Country"
                  required
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="churchLogo"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Church Logo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-200 text-white">
                    <span>Choose File</span>
                    <input
                      type="file"
                      id="churchLogo"
                      name="churchLogo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-400">
                    {formData.churchLogo ? "Logo selected" : "No file chosen"}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="certificateId"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Certificate ID (Optional)
                </label>
                <input
                  type="text"
                  id="certificateId"
                  name="certificateId"
                  value={formData.certificateId}
                  onChange={handleChange}
                  placeholder="Auto-generated if blank"
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="briefDescription"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Personalized Message (Optional)
                </label>
                <textarea
                  id="briefDescription"
                  name="briefDescription"
                  value={formData.briefDescription}
                  onChange={handleChange}
                  placeholder="Add a scripture verse or special message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold py-2.5 px-5 rounded-lg hover:from-blue-800 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-lg text-base"
              >
                Generate Certificate
              </button>
            </form>
          </div>

          {generatedPdfUrl && (
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
              <div className="bg-gradient-to-r from-green-800 to-emerald-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Certificate Preview
                </h2>
                <p className="text-green-300">
                  Your beautiful certificate is ready!
                </p>
              </div>
              <div className="p-6">
                <iframe src={generatedPdfUrl} width="100%" height="500px" />
                <a
                  href={generatedPdfUrl}
                  download={`${formData.recipientName.replace(
                    /\s/g,
                    "_"
                  )}_${formData.certificateType.replace(/\s/g, "_")}.pdf`}
                  className="block mt-6 w-full bg-gradient-to-r from-green-700 to-emerald-800 text-white font-bold py-2.5 px-5 rounded-lg hover:from-green-800 hover:to-emerald-900 text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 shadow-lg text-base"
                >
                  Download Certificate
                </a>

                <Button
                  onClick={() => setIsAssignUserModalOpen(true)}
                  className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg text-base"
                >
                  Assign Certificate to User
                </Button>

                <Dialog
                  open={isAssignUserModalOpen}
                  onOpenChange={setIsAssignUserModalOpen}
                >
                  <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700/50 shadow-lg">
                    <DialogHeader className="bg-gray-700/30 p-4">
                      <DialogTitle className="text-xl font-bold text-blue-400">Assign Certificate to User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500"
                      />
                      <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-md">
                        {users
                          .filter((user) =>
                            user.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer"
                              onClick={() => {
                                handleAssignCertificate(user);
                              }}
                            >
                              <span className="text-gray-200">{user.name}</span>
                              {selectedUser?.id === user.id && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-green-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
