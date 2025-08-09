import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

type Document = {
  id: number;
  title: string;
  category: string;
  content: string;
};

type Template = {
  id: number;
  title: string;
  type: string;
};

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: "Sermon Notes 08/04/2025",
      category: "Ministry Reports",
      content: "Sermon on faith...",
    },
    {
      id: 2,
      title: "Church Policy",
      category: "Policies",
      content: "Policy details...",
    },
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, title: "Baptism Certificate", type: "Certificate" },
    { id: 2, title: "Volunteer Agreement", type: "Agreement" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviewDocument = (id: number) => {
    console.log(`Previewing document ${id} via OCR search`);
  };

  const handleGenerateTemplate = (id: number) => {
    console.log(`Generating template ${id} via DocuSign`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Document Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Digital Filing System
          </h3>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full"
              aria-label="Search documents"
            />
            <div className="mt-4 space-y-2">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Category: {doc.category}
                    </div>
                    <motion.button
                      onClick={() => handlePreviewDocument(doc.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Preview ${doc.title}`}
                    >
                      Preview
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Template Library
          </h3>
          <div className="mt-4 space-y-2">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {template.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Type: {template.type}
                  </div>
                  <motion.button
                    onClick={() => handleGenerateTemplate(template.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Generate ${template.title}`}
                  >
                    Generate
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
