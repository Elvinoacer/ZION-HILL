import { useState } from "react";
import { motion } from "framer-motion";
import { User, Upload } from "lucide-react";
import { User as PrismaUser, Asset } from "@/generated/prisma";

interface MissionarySupportProps {
  missionaries: PrismaUser[];
  documents: Asset[];
}

export default function MissionarySupport({ missionaries, documents }: MissionarySupportProps) {
  const handleUploadDocument = (file: File) => {
    console.log(`Uploading ${file.name} to /api/documents with AWS S3`);
    // In a real app, you would call a Zustand action here to upload the document
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Missionary Support
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Missionary Profiles
          </h3>
          <div className="mt-4 space-y-4">
            {missionaries.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No missionaries found.
              </div>
            ) : (
              missionaries.map((missionary, index) => (
                <motion.div
                  key={missionary.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {missionary.name}
                    </div>
                    <div className="text-sm text-gray-600 text-wrap">{missionary.bio || "N/A"}</div>
                    <a
                      href={missionary.supportLink || "#"}
                      className="text-sm text-blue-600 hover:underline"
                      aria-label={`Support ${missionary.name}`}
                    >
                      Support This Missionary
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Secure Document Uploads
          </h3>
          <div className="mt-4">
            <label
              htmlFor="document-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer"
            >
              Upload Document
              <input
                id="document-upload"
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleUploadDocument(e.target.files[0])
                }
                aria-label="Upload visa or report"
              />
            </label>
            <div className="mt-4 space-y-2">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  No documents found.
                </div>
              ) : (
                documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                  >
                    <Upload className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: {doc.type}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
