"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface Certificate {
  id: string;
  certificateType: string;
  recipientName: string;
  cloudinaryUrl: string;
  issuedDate: string;
  user: { name: string; email: string };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null
  );
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [certificateToPreview, setCertificateToPreview] = useState<
    string | null
  >(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/certificates");
      if (!response.ok) {
        throw new Error(`Failed to load certificates: ${response.status}`);
      }
      const data = await response.json();
      setCertificates(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load certificates", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCertificateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/certificates/${certificateToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete certificate: ${response.status}`);
      }

      setCertificates(
        certificates.filter((cert) => cert.id !== certificateToDelete)
      );
      setIsDeleteDialogOpen(false);
      setCertificateToDelete(null);

      toast.success("Certificate deleted successfully", {
        action: {
          label: "Undo",
          onClick: () => fetchCertificates(),
        },
      });
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to delete certificate", {
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewClick = (url: string) => {
    setCertificateToPreview(url);
    setIsPreviewDialogOpen(true);
  };

  const handleViewInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Certificates
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 gap-2"
            onClick={fetchCertificates}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Try Again
          </Button>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex flex-col gap-2 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Certificate Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600"
        >
          Manage and review all issued certificates
        </motion.p>
        <Link href="/certificate-generator" passHref>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Generate New Certificate
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mb-8 max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-5"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredCertificates.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6">
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm
                ? "No matching certificates found"
                : "No certificates issued yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search query"
                : "When certificates are issued, they will appear here"}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            ) : (
              <Button onClick={fetchCertificates}>Refresh</Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="certificates-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden bg-white shadow-lg rounded-xl border border-gray-100"
          >
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Recipient
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Certificate Type
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Issued By
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Issued Date
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((certificate, index) => (
                  <motion.tr
                    key={certificate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="font-medium text-blue-600">
                            {certificate.recipientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {certificate.recipientName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {certificate.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-700 bg-blue-50"
                      >
                        {certificate.certificateType}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {certificate.user.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(certificate.issuedDate), "PPP")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(certificate.issuedDate), "pp")}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePreviewClick(certificate.cloudinaryUrl)
                              }
                              className="group border-blue-100 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Eye className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewInNewTab(certificate.cloudinaryUrl)
                              }
                              className="group border-green-100 hover:bg-green-50 hover:border-green-200"
                            >
                              <ExternalLink className="h-4 w-4 text-green-500 group-hover:text-green-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open in New Tab</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(certificate.id)}
                              className="hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">
              Delete Certificate?
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 py-4">
            This action cannot be undone. The certificate will be permanently
            removed.
          </div>
          <DialogFooter className="sm:justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center overflow-auto bg-gray-50 rounded-lg">
            {certificateToPreview ? (
              <Document
                file={certificateToPreview}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                  console.error("Error loading PDF:", error);
                  toast.error("Failed to load PDF", {
                    description: error.message,
                  });
                }}
                loading={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <p className="text-gray-500">Loading certificate...</p>
                  </div>
                }
                noData={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">No certificate to display</p>
                  </div>
                }
              >
                {numPages &&
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="border border-gray-200 shadow-sm"
                    />
                  ))}
              </Document>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <FileText className="h-8 w-8 text-gray-400" />
                <p className="text-gray-500">
                  No certificate selected for preview
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsPreviewDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
