import { motion, AnimatePresence } from "motion/react";
import {
  FileCheck,
  Info,
  X,
  Loader2,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Upload,
  Building,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { apiCall } from "@/lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

// Maximum file sizes
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Accepted file types
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Default document categories for Projects
const DEFAULT_CATEGORIES = [
  "RERA Certificate",
  "Title Clearance Certificate",
  "Encumbrance Certificate",
  "Commencement Certificate",
  "Building Plan Approval",
  "Occupancy Certificate",
  "Municipal Approval",
  "Fire NOC",
  "Environmental Clearance",
  "Sanctioned Plan",
  "Legal Opinion",
  "Sale Deed",
  "Power of Attorney",
  "Tax Receipt",
  "Other",
];

export default function LegalDocsProjectStep() {
  const { saveAndContinue, formData, setCurrentStepSubmitHandler } =
    useProjectFormV2();

  // Unified documents list
  const [documentsList, setDocumentsList] = useState(
    formData?.legalDocuments || []
  );
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    const existingCategories =
      formData?.legalDocuments?.map((doc) => doc.category).filter(Boolean) ||
      [];
    const uniqueExisting = [...new Set(existingCategories)];
    const combined = [...DEFAULT_CATEGORIES, ...uniqueExisting];
    return [...new Set(combined)];
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      legalDocuments: formData?.legalDocuments || [],
    },
  });

  const { setValue } = methods;

  // Count documents
  const documentCount = documentsList.length;

  // Validation: At least 1 document recommended (but not required)
  const isValid = true; // Legal docs are optional

  // Helper function to check if file is duplicate
  const isDuplicateFile = useCallback(
    (newFile) => {
      return documentsList.some(
        (doc) =>
          doc.filename === newFile.name && doc.fileSize === newFile.size
      );
    },
    [documentsList]
  );

  // Handle document upload
  const handleDocumentUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const errors = [];
      const newDocuments = [];

      // Validate all files first
      for (const file of files) {
        // Check for duplicates
        if (isDuplicateFile(file)) {
          errors.push(`${file.name} is already uploaded`);
          continue;
        }

        // Check file type
        if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
          errors.push(
            `${file.name}: Invalid file type. Only PDF, JPEG, PNG, and WebP are allowed.`
          );
          continue;
        }

        // Check file size
        if (file.size > MAX_DOCUMENT_SIZE) {
          errors.push(
            `${file.name}: File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit.`
          );
          continue;
        }

        newDocuments.push(file);
      }

      if (errors.length > 0) {
        setUploadErrors(errors);
        return;
      }

      if (newDocuments.length === 0) {
        return;
      }

      setIsUploading(true);
      setUploadErrors([]);

      const uploadedDocs = [];

      for (const file of newDocuments) {
        try {
          const docId = `doc-${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}`;

          setUploadProgress((prev) => ({ ...prev, [docId]: 0 }));

          // Get presigned URL from backend
          const response = await apiCall(
            `${backendUrl}/api/upload/presigned-urls`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                folder: "listing/projects/legal-docs",
                count: 1,
                contentType: file.type,
                expiresIn: 600,
              }),
            }
          );

          const presignedData = response.data.urls[0];

          // Upload to S3
          const xhr = new XMLHttpRequest();

          await new Promise((resolve, reject) => {
            xhr.upload.addEventListener("progress", (e) => {
              if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                setUploadProgress((prev) => ({
                  ...prev,
                  [docId]: percentComplete,
                }));
              }
            });

            xhr.addEventListener("load", () => {
              if (xhr.status === 200) {
                resolve();
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            });

            xhr.addEventListener("error", () => {
              reject(new Error("Upload failed"));
            });

            xhr.open("PUT", presignedData.uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.setRequestHeader("x-amz-acl", "public-read");
            xhr.send(file);
          });

          // Create document object
          const newDoc = {
            id: docId,
            url: presignedData.fileUrl,
            filename: file.name,
            category: "Other",
            title: file.name.replace(/\.[^/.]+$/, ""),
            issueDate: "",
            validUntil: "",
            remarks: "",
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            uploading: false,
          };

          uploadedDocs.push(newDoc);

          // Update progress to 100%
          setUploadProgress((prev) => ({ ...prev, [docId]: 100 }));

          // Clear progress after delay
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[docId];
              return newProgress;
            });
          }, 1000);
        } catch (error) {
          console.error("Upload error:", error);
          errors.push(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        setUploadErrors(errors);
      }

      if (uploadedDocs.length > 0) {
        const updatedList = [...documentsList, ...uploadedDocs];
        setDocumentsList(updatedList);
        setValue("legalDocuments", updatedList);
      }

      setIsUploading(false);

      // Reset file input
      e.target.value = "";
    },
    [documentsList, setValue, isDuplicateFile]
  );

  // Update document metadata
  const updateDocumentMetadata = useCallback(
    (id, field, value) => {
      const updatedList = documentsList.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      );
      setDocumentsList(updatedList);
      setValue("legalDocuments", updatedList);

      // If category is changed and it's a new category, add it to allCategories
      if (field === "category" && !allCategories.includes(value)) {
        setAllCategories([...allCategories, value]);
      }
    },
    [documentsList, setValue, allCategories]
  );

  // Remove document
  const removeDocument = useCallback(
    (id) => {
      const updatedList = documentsList.filter((doc) => doc.id !== id);
      setDocumentsList(updatedList);
      setValue("legalDocuments", updatedList);
    },
    [documentsList, setValue]
  );

  // Handle form submission
  const handleContinue = () => {
    saveAndContinue({ legalDocuments: documentsList });
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
  }, [handleContinue, setCurrentStepSubmitHandler]);

  // Pro tips for legal documents
  const legalDocsTips = [
    "RERA certificate is mandatory for projects under RERA jurisdiction",
    "Upload clear, legible copies of all legal documents",
    "Ensure certificates are valid and not expired",
    "Title clearance and encumbrance certificates build buyer trust",
    "Include all relevant approval documents from authorities",
    "Keep documents organized with proper titles and categories",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Legal Documents & RERA
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Upload RERA certificate and other legal documents
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Error Display */}
          <AnimatePresence>
            {uploadErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                      Upload Errors:
                    </p>
                    <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                      {uploadErrors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Section */}
          <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex-shrink-0"
              >
                <input
                  id="document-upload"
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() =>
                    document.getElementById("document-upload").click()
                  }
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Legal Documents
                    </>
                  )}
                </Button>
              </label>

              {/* Document Count */}
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-orange-600" />
                <span className="text-muted-foreground">
                  {documentCount} {documentCount === 1 ? "Document" : "Documents"}
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    Legal documents are optional but highly recommended
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Accepted formats: PDF, JPEG, PNG, WebP (max 10MB each)
                  </p>
                </div>
              </div>
            </div>

            {/* Documents List */}
            {documentsList.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <Building className="w-12 h-12 text-muted-foreground" />
                  <FileCheck className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  No documents uploaded yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Add Legal Documents&quot; to start uploading
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentsList.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    allCategories={allCategories}
                    onUpdateMetadata={updateDocumentMetadata}
                    onRemove={removeDocument}
                    uploadProgress={uploadProgress[doc.id]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  Pro Tips for Legal Documents:
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                  {legalDocsTips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Document Card Component - Displays individual document with metadata inputs
 */
function DocumentCard({
  document,
  allCategories,
  onUpdateMetadata,
  onRemove,
  uploadProgress,
}) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const isUploading = document.uploading || false;

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return allCategories;
    return allCategories.filter((cat) =>
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [allCategories, categorySearch]);

  // Check if search text is a new category (not in list)
  const isNewCategory =
    categorySearch &&
    !allCategories.some(
      (cat) => cat.toLowerCase() === categorySearch.toLowerCase()
    );

  const borderColor = "hover:border-orange-500";

  return (
    <Card
      className={`border-2 ${borderColor} transition-all ${
        isUploading ? "opacity-70" : ""
      }`}
    >
      <CardContent className="pt-4 space-y-3">
        {/* Document Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {document.filename || "Document"}
              </p>
              <p className="text-xs text-muted-foreground">
                {(document.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(document.id)}
            className="flex-shrink-0"
            disabled={isUploading}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Document Metadata */}
        {!isUploading && (
          <>
            {/* Category */}
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select
                value={document.category}
                onValueChange={(value) =>
                  onUpdateMetadata(document.id, "category", value)
                }
                onOpenChange={setCategoryOpen}
                open={categoryOpen}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Search or add new..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-8 mb-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isNewCategory) {
                          e.preventDefault();
                          onUpdateMetadata(
                            document.id,
                            "category",
                            categorySearch
                          );
                          setCategorySearch("");
                          setCategoryOpen(false);
                        }
                      }}
                    />
                  </div>
                  {isNewCategory && (
                    <SelectItem
                      value={categorySearch}
                      onSelect={() => {
                        onUpdateMetadata(
                          document.id,
                          "category",
                          categorySearch
                        );
                        setCategorySearch("");
                        setCategoryOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-3 h-3" />
                        <span>Add &quot;{categorySearch}&quot;</span>
                      </div>
                    </SelectItem>
                  )}
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label className="text-xs">Document Title</Label>
              <Input
                value={document.title || ""}
                onChange={(e) =>
                  onUpdateMetadata(document.id, "title", e.target.value)
                }
                placeholder="Enter document title..."
                maxLength={200}
                className="h-9"
              />
            </div>

            {/* Issue Date & Valid Until */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Issue Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    type="date"
                    value={document.issueDate || ""}
                    onChange={(e) =>
                      onUpdateMetadata(document.id, "issueDate", e.target.value)
                    }
                    className="h-9 pl-7 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Valid Until</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    type="date"
                    value={document.validUntil || ""}
                    onChange={(e) =>
                      onUpdateMetadata(
                        document.id,
                        "validUntil",
                        e.target.value
                      )
                    }
                    className="h-9 pl-7 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1">
              <Label className="text-xs">Remarks</Label>
              <Input
                value={document.remarks || ""}
                onChange={(e) =>
                  onUpdateMetadata(document.id, "remarks", e.target.value)
                }
                placeholder="Additional notes..."
                maxLength={500}
                className="h-9"
              />
            </div>

            {/* View Document Link */}
            {document.url && (
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                View document
              </a>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
