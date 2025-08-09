import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Upload } from "lucide-react";

type Partner = {
  id: number;
  name: string;
  type: string;
  mouUrl: string;
};

type SharedDocument = {
  id: number;
  name: string;
  url: string;
};

export default function PartnershipPortal() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 1,
      name: "Nairobi Community Church",
      type: "International Church",
      mouUrl: "/documents/mou_nairobi.pdf",
    },
  ]);

  const [sharedDocs, setSharedDocs] = useState<SharedDocument[]>([
    {
      id: 1,
      name: "Mission Report 2025.pdf",
      url: "/documents/mission_report.pdf",
    },
  ]);

  const handleShareDocument = (file: File) => {
    console.log(`Sharing ${file.name} with partners via /api/share`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Partnership Portal
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage MOUs</h3>
          <div className="mt-4 space-y-2">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Handshake className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {partner.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Type: {partner.type}
                  </div>
                  <a
                    href={partner.mouUrl}
                    className="text-sm text-blue-600 hover:underline"
                    aria-label={`View MOU for ${partner.name}`}
                  >
                    View MOU
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Document Sharing
          </h3>
          <div className="mt-4">
            <label
              htmlFor="share-document"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer"
            >
              Share Document
              <input
                id="share-document"
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleShareDocument(e.target.files[0])
                }
                aria-label="Share document with partners"
              />
            </label>
            <div className="mt-4 space-y-2">
              {sharedDocs.map((doc, index) => (
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
                    <a
                      href={doc.url}
                      className="text-sm text-blue-600 hover:underline"
                      aria-label={`View ${doc.name}`}
                    >
                      View Document
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
