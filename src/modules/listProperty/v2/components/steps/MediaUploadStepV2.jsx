import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  Image,
  Video,
  X,
  FileImage,
  FileVideo,
  Eye,
  Trash2,
  Plus,
  Info,
  Check,
  ChevronsUpDown,
  Tags,
  Upload,
  Loader2,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { usePropertyFormV2 } from "../../context/PropertyFormContextV2";
import ProTipV2 from "../shared/ProTipV2";
import { uploadMultipleFiles } from "@/lib/uploadUtils";

// Maximum file sizes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB for other files

// Common image and video types (for type detection)
const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
];
const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/avi",
  "video/mpeg",
  "video/x-msvideo",
];

// Document type options
const DOCUMENT_TYPES = [
  { value: "media", label: "Photo/Video" },
  { value: "property_plan", label: "Property Plan" },
  { value: "document", label: "Legal Document" },
];

// Default category suggestions
const DEFAULT_CATEGORIES = [
  "Exterior View",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Balcony",
  "Parking",
  "Common Area",
  "Amenities",
  "Garden",
  "Virtual Tour",
  "Location",
  "Floor Plan",
  "Site Plan",
  "Layout Plan",
  "Master Plan",
  "Title Deed",
  "Sale Deed",
  "RERA Certificate",
  "NOC",
  "Tax Receipt",
  "Ownership Documents",
  "Legal Documents",
  "Other",
];

export default function MediaUploadStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();

  // Ensure all media items have IDs when loading from draft
  const normalizeMediaData = (mediaData) => {
    if (!Array.isArray(mediaData)) return [];
    return mediaData.map((item) => ({
      ...item,
      id: item.id || `media-${Date.now()}-${Math.random()}`, // Generate ID if missing
    }));
  };

  // Unified media list (both images and videos)
  const [mediaList, setMediaList] = useState(() => normalizeMediaData(formData?.mediaData));
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    // Extract unique categories from existing media
    const existingCategories = (formData?.mediaData || [])
      .map((item) => item.category)
      .filter(Boolean);
    const uniqueExisting = [...new Set(existingCategories)];

    // Combine with defaults, removing duplicates
    const combined = [...DEFAULT_CATEGORIES, ...uniqueExisting];
    return [...new Set(combined)];
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      mediaData: normalizeMediaData(formData?.mediaData),
    },
  });

  const { setValue } = methods;

  // Count images and videos
  const imageCount = mediaList.filter((m) => m.type === "image").length;
  const videoCount = mediaList.filter((m) => m.type === "video").length;

  // Validation: At least one image is required
  const isValid = imageCount > 0;

  // Helper function to check if file is duplicate
  const isDuplicateFile = useCallback(
    (newFile) => {
      return mediaList.some((media) => {
        if (!media.file) return false;
        return (
          media.file.name === newFile.name &&
          media.file.size === newFile.size &&
          media.file.lastModified === newFile.lastModified
        );
      });
    },
    [mediaList]
  );

  // Handle unified media upload (any file type)
  const handleMediaUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      const newErrors = [];
      const validFiles = [];

      // Step 1: Validate files
      files.forEach((file) => {
        // Check for duplicate
        if (isDuplicateFile(file)) {
          newErrors.push(`"${file.name}" is already added`);
          return;
        }

        // Determine file type
        const isImage = IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/');
        const isVideo = VIDEO_TYPES.includes(file.type) || file.type.startsWith('video/');
        const isDocument = !isImage && !isVideo; // Everything else is a document

        // Validate file size based on type
        let maxSize = MAX_FILE_SIZE;
        let maxSizeText = "20MB";
        if (isImage) {
          maxSize = MAX_IMAGE_SIZE;
          maxSizeText = "5MB";
        } else if (isVideo) {
          maxSize = MAX_VIDEO_SIZE;
          maxSizeText = "50MB";
        }

        if (file.size > maxSize) {
          newErrors.push(
            `"${file.name}" exceeds the maximum size of ${maxSizeText}.`
          );
          return;
        }

        validFiles.push({ file, isImage, isVideo, isDocument });
      });

      if (newErrors.length > 0) {
        setUploadErrors(newErrors);
        setTimeout(() => setUploadErrors([]), 5000);
      }

      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }

      // Step 2: Create temporary media items with previews and uploading status
      const tempMediaItems = validFiles.map(({ file, isImage, isVideo, isDocument }) => {
        let type = "image";
        let docType = "media";
        if (isVideo) {
          type = "video";
          docType = "media";
        } else if (isDocument) {
          type = "document";
          docType = "document";
        }

        return {
          id: `media-${Date.now()}-${Math.random()}`,
          file,
          preview: isDocument ? null : URL.createObjectURL(file),
          title: "",
          category: "",
          description: "",
          type: type,
          docType: docType,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploading: true,
          uploadProgress: 0,
          url: null,
          key: null,
        };
      });

      // Add to media list immediately to show uploading state
      const updatedMedia = [...mediaList, ...tempMediaItems];
      setMediaList(updatedMedia);

      // Step 3: Upload files to S3
      setIsUploading(true);

      try {
        const filesToUpload = validFiles.map((vf) => vf.file);
        const folder = "listing-drafts/images";

        // Upload with progress tracking
        const uploadResults = await uploadMultipleFiles(
          filesToUpload,
          folder,
          (index, progress) => {
            const mediaId = tempMediaItems[index].id;
            setUploadProgress((prev) => ({
              ...prev,
              [mediaId]: progress,
            }));
          }
        );

        // Step 4: Update media items with upload results
        setMediaList((currentMedia) => {
          return currentMedia.map((media) => {
            const tempIndex = tempMediaItems.findIndex((t) => t.id === media.id);
            if (tempIndex === -1) return media;

            const result = uploadResults[tempIndex];
            if (result.success) {
              return {
                ...media,
                uploading: false,
                url: result.url,
                key: result.key,
              };
            } else {
              // Upload failed - mark as failed
              return {
                ...media,
                uploading: false,
                uploadFailed: true,
                uploadError: result.error,
              };
            }
          });
        });

        // Update form value
        setValue("mediaData", updatedMedia, { shouldValidate: true });

        // Check for failed uploads
        const failedUploads = uploadResults.filter((r) => !r.success);
        if (failedUploads.length > 0) {
          const failureErrors = failedUploads.map(
            (f) => `Failed to upload "${f.file.name}": ${f.error}`
          );
          setUploadErrors(failureErrors);
          setTimeout(() => setUploadErrors([]), 5000);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadErrors([`Upload failed: ${error.message}`]);
        setTimeout(() => setUploadErrors([]), 5000);

        // Remove failed items from media list
        setMediaList((currentMedia) =>
          currentMedia.filter(
            (media) => !tempMediaItems.some((t) => t.id === media.id)
          )
        );
      } finally {
        setIsUploading(false);
      }

      // Reset input
      e.target.value = "";
    },
    [mediaList, setValue, isDuplicateFile]
  );

  // Update media metadata
  const updateMediaMetadata = useCallback(
    (id, field, value) => {
      const updated = mediaList.map((media) =>
        media.id === id ? { ...media, [field]: value } : media
      );
      setMediaList(updated);
      setValue("mediaData", updated, { shouldValidate: true });

      // If category field is updated and it's a new category, add it to the list
      if (field === "category" && value && !allCategories.includes(value)) {
        setAllCategories((prev) => [...prev, value]);
      }
    },
    [mediaList, setValue, allCategories]
  );

  // Remove media
  const removeMedia = useCallback(
    (id) => {
      const updated = mediaList.filter((media) => media.id !== id);
      setMediaList(updated);
      setValue("mediaData", updated, { shouldValidate: true });

      // Revoke object URL to prevent memory leak
      const removed = mediaList.find((media) => media.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
    },
    [mediaList, setValue]
  );

  // Handle form submission
  const handleContinue = useCallback(() => {
    // Validate all uploads are complete
    const hasUploadingItems = mediaList.some((media) => media.uploading);
    if (hasUploadingItems) {
      setUploadErrors(["Please wait for all uploads to complete before continuing"]);
      setTimeout(() => setUploadErrors([]), 5000);
      return;
    }

    // Validate all uploads succeeded
    const hasFailedItems = mediaList.some((media) => media.uploadFailed);
    if (hasFailedItems) {
      setUploadErrors(["Some files failed to upload. Please remove them and try again."]);
      setTimeout(() => setUploadErrors([]), 5000);
      return;
    }

    // Clean media data: remove File objects and preview URLs before sending to backend
    // Keep only schema-compliant fields: url, docType, title, category, description, fileSize
    const cleanedMediaData = mediaList.map((media) => ({
      url: media.url,
      docType: media.docType || undefined,
      title: media.title ? media.title.substring(0, 200) : undefined,
      category: media.category ? media.category.substring(0, 100) : undefined,
      description: media.description ? media.description.substring(0, 500) : undefined,
      fileSize: media.fileSize || undefined,
    }));

    const data = {
      mediaData: cleanedMediaData,
    };
    saveAndContinue(data);
  }, [mediaList, saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
    return () => setCurrentStepSubmitHandler(null);
  }, [handleContinue, setCurrentStepSubmitHandler]);

  // Pro tips for media upload
  const mediaTips = [
    "Upload high-quality images with good lighting for better visibility",
    "Include photos of all rooms, amenities, and exterior views",
    "Videos should be short (30-60 seconds) and showcase key features",
    "Add descriptive titles to help buyers understand each image/video",
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
          Media & Documents
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Add photos, videos, floor plans, and legal documents
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Upload Errors */}
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

          {/* Unified Upload Section */}
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex-shrink-0"
              >
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() =>
                    document.getElementById("media-upload").click()
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
                      Add Media & Documents
                    </>
                  )}
                </Button>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                >
                  <FileImage className="w-3 h-3 mr-1" />
                  {imageCount} {imageCount === 1 ? "image" : "images"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                >
                  <FileVideo className="w-3 h-3 mr-1" />
                  {videoCount} {videoCount === 1 ? "video" : "videos"}
                </Badge>
                <Badge variant="secondary">Total: {mediaList.length}</Badge>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    At least one image is required{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Accepts any file type • Images (max 5MB) • Videos (max 50MB) • Other files (max 20MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Media Grid */}
            {mediaList.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <Image className="w-12 h-12 text-muted-foreground" />
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  No media uploaded yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Add Images or Videos&quot; to start uploading
                </p>Media & Document
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediaList.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    allCategories={allCategories}
                    onUpdateMetadata={updateMediaMetadata}
                    onRemove={removeMedia}
                    uploadProgress={uploadProgress[media.id]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          {/* <ProTipV2 title="Media Best Practices" tips={mediaTips} /> */}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Enhanced Media Card Component - Modern UI/UX with better visual hierarchy
 */
function MediaCard({ media, allCategories, onUpdateMetadata, onRemove, uploadProgress }) {
  const [showPreview, setShowPreview] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  
  const isVideo = media.type === "video";
  const isDocument = media.type === "document";
  const isUploading = media.uploading || false;
  const uploadFailed = media.uploadFailed || false;

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
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  // Get file icon for documents
  const getFileIcon = () => {
    if (media.fileType === 'application/pdf') return FileText;
    if (media.fileType?.includes('word')) return FileText;
    return FileText;
  };
  
  const FileIcon = isDocument ? getFileIcon() : null;

  // Get theme colors based on media type
  const getThemeColors = () => {
    if (uploadFailed) {
      return {
        gradient: "from-red-500/10 via-red-400/5 to-transparent",
        border: "border-red-300 dark:border-red-700",
        hoverBorder: "hover:border-red-400 dark:hover:border-red-600",
        shadow: "hover:shadow-red-200/50 dark:hover:shadow-red-900/30",
        badge: "bg-red-600/90",
        icon: "text-red-600",
        accent: "text-red-600 dark:text-red-400",
      };
    }
    if (isVideo) {
      return {
        gradient: "from-purple-500/10 via-purple-400/5 to-transparent",
        border: "border-purple-200 dark:border-purple-800",
        hoverBorder: "hover:border-purple-400 dark:hover:border-purple-600",
        shadow: "hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
        badge: "bg-purple-600/90",
        icon: "text-purple-600",
        accent: "text-purple-600 dark:text-purple-400",
      };
    }
    if (isDocument) {
      return {
        gradient: "from-green-500/10 via-green-400/5 to-transparent",
        border: "border-green-200 dark:border-green-800",
        hoverBorder: "hover:border-green-400 dark:hover:border-green-600",
        shadow: "hover:shadow-green-200/50 dark:hover:shadow-green-900/30",
        badge: "bg-green-600/90",
        icon: "text-green-600",
        accent: "text-green-600 dark:text-green-400",
      };
    }
    return {
      gradient: "from-blue-500/10 via-blue-400/5 to-transparent",
      border: "border-blue-200 dark:border-blue-800",
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
      shadow: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30",
      badge: "bg-blue-600/90",
      icon: "text-blue-600",
      accent: "text-blue-600 dark:text-blue-400",
    };
  };

  const themeColors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-300",
        "bg-white dark:bg-gray-900 border-2",
        themeColors.border,
        themeColors.hoverBorder,
        "shadow-sm hover:shadow-xl",
        themeColors.shadow,
        isUploading && "ring-2 ring-orange-400/50 ring-offset-2"
      )}
    >
      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 transition-opacity duration-300",
        themeColors.gradient,
        isHovered && !isUploading && "opacity-100"
      )} />

      <div className="relative flex flex-col">
        {/* Preview Section */}
        <div className="relative">
          <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            {isDocument ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/50 mb-3">
                    <FileIcon className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center px-4 line-clamp-2">
                    {media.fileName}
                  </p>
                  <Badge variant="outline" className="mt-2 text-[10px] bg-white/50 dark:bg-black/30">
                    {formatFileSize(media.fileSize)}
                  </Badge>
                </motion.div>
              </div>
            ) : isVideo ? (
              <video
                src={media.preview || media.url}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                controls={false}
              />
            ) : (
              <img
                src={media.preview || media.url}
                alt={media.title || "Property media"}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Uploading Overlay */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-orange-900/95 via-orange-800/90 to-orange-900/95 backdrop-blur-sm"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Upload className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="w-full max-w-[200px] space-y-2">
                    <div className="relative h-2 bg-orange-950 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress || 0}%` }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 rounded-full shadow-lg"
                      />
                      <motion.div
                        animate={{ x: [0, 200, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </div>
                    <p className="text-white text-sm font-bold text-center tracking-wide">
                      {uploadProgress || 0}% Uploaded
                    </p>
                  </div>
                  <p className="text-orange-200 text-xs text-center font-medium">
                    Processing your file...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Failed Upload Overlay */}
            {uploadFailed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center p-6">
                  <X className="w-12 h-12 text-white mx-auto mb-3" />
                  <p className="text-white font-semibold mb-1">Upload Failed</p>
                  <p className="text-red-200 text-xs">{media.uploadError || "Please try again"}</p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons Overlay */}
            <AnimatePresence>
              {isHovered && !isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-10 px-4 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg"
                      onClick={() => setShowPreview(true)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-10 px-4 shadow-lg"
                      onClick={() => onRemove(media.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                className={cn(
                  "backdrop-blur-md text-white text-xs h-6 px-3 font-semibold shadow-lg border-0",
                  isUploading ? "bg-orange-600/95" : themeColors.badge
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Uploading
                  </>
                ) : uploadFailed ? (
                  <>
                    <X className="w-3 h-3 mr-1.5" />
                    Failed
                  </>
                ) : isVideo ? (
                  <>
                    <Video className="w-3 h-3 mr-1.5" />
                    Video
                  </>
                ) : isDocument ? (
                  <>
                    <FileText className="w-3 h-3 mr-1.5" />
                    Document
                  </>
                ) : (
                  <>
                    <Image className="w-3 h-3 mr-1.5" />
                    Image
                  </>
                )}
              </Badge>
            </div>

            {/* File Size Badge */}
            {!isUploading && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-white text-[10px] h-5 px-2 border-0 shadow-lg">
                  {formatFileSize(media.fileSize)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="relative p-4 space-y-4">
          {/* Form Fields */}
          <div className="space-y-3">
            {/* Title Input */}
            <div>
              <FieldLabel className="text-xs mb-1.5 font-semibold flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5" />
                Title
                <span className="text-muted-foreground font-normal text-[10px] ml-auto">
                  {media.title?.length || 0}/200
                </span>
              </FieldLabel>
              <Input
                placeholder="e.g., Spacious Living Room with Natural Light"
                value={media.title}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    onUpdateMetadata(media.id, "title", value);
                  }
                }}
                maxLength={200}
                className="h-9 text-sm transition-all focus:ring-2 focus:ring-offset-0"
                disabled={isUploading}
              />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Document Type Select */}
              <div>
                <FieldLabel className="text-xs mb-1.5 font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Document Type
                </FieldLabel>
                <Select
                  value={media.docType}
                  onValueChange={(value) =>
                    onUpdateMetadata(media.id, "docType", value)
                  }
                >
                  <SelectTrigger className="h-9 text-sm" disabled={isUploading}>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="media">
                      <div className="flex items-center gap-2">
                        <Image className="w-3.5 h-3.5" />
                        Photo/Video
                      </div>
                    </SelectItem>
                    <SelectItem value="property_plan">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-3.5 h-3.5" />
                        Property Plan
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Legal Document
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Select */}
              <div>
                <FieldLabel className="text-xs mb-1.5 font-semibold flex items-center gap-1.5">
                  <Tags className="w-3.5 h-3.5" />
                  Category
                </FieldLabel>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className={cn(
                        "w-full justify-between h-9 text-sm font-normal transition-all",
                        !media.category && "text-muted-foreground"
                      )}
                      disabled={isUploading}
                    >
                      <span className="truncate">
                        {media.category || "Select category..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search or add new category..."
                        value={categorySearch}
                        onValueChange={setCategorySearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {isNewCategory ? (
                            <div className="py-3 px-3 text-sm">
                              <p className="text-muted-foreground mb-3 text-xs">
                                Category not found. Create a new one:
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-orange-600 border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 font-medium"
                                onClick={() => {
                                  const trimmedCategory = categorySearch.trim();
                                  if (trimmedCategory.length <= 100) {
                                    onUpdateMetadata(
                                      media.id,
                                      "category",
                                      trimmedCategory
                                    );
                                    setCategoryOpen(false);
                                    setCategorySearch("");
                                  }
                                }}
                                disabled={categorySearch.trim().length > 100}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add &quot;{categorySearch.slice(0, 50)}{categorySearch.length > 50 ? '...' : ''}&quot;
                              </Button>
                              {categorySearch.trim().length > 100 && (
                                <p className="text-xs text-red-500 mt-2">
                                  Category name too long (max 100 chars)
                                </p>
                              )}
                            </div>
                          ) : (
                            "No categories found."
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredCategories.map((category) => (
                            <CommandItem
                              key={category}
                              value={category}
                              onSelect={() => {
                                onUpdateMetadata(media.id, "category", category);
                                setCategoryOpen(false);
                                setCategorySearch("");
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  media.category === category
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {category}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <FieldLabel className="text-xs mb-1.5 font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Description
                <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                <span className="text-muted-foreground font-normal text-[10px] ml-auto">
                  {media.description?.length || 0}/500
                </span>
              </FieldLabel>
              <Textarea
                placeholder="Add a detailed description to help buyers understand this media..."
                value={media.description}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    onUpdateMetadata(media.id, "description", value);
                  }
                }}
                maxLength={500}
                className="text-sm min-h-[70px] resize-none transition-all focus:ring-2 focus:ring-offset-0"
                rows={3}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  src={media.preview || media.url}
                  controls
                  autoPlay
                  className="w-full h-full rounded-2xl shadow-2xl"
                />
              ) : isDocument ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-2xl">
                  <FileIcon className="w-24 h-24 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">{media.fileName}</h3>
                  <p className="text-muted-foreground mb-4">{formatFileSize(media.fileSize)}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open(media.url, '_blank')}
                  >
                    Open Document
                  </Button>
                </div>
              ) : (
                <img
                  src={media.preview || media.url}
                  alt={media.title}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
              )}
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-12 right-0 h-10 w-10 rounded-full shadow-lg"
                onClick={() => setShowPreview(false)}
              >
                <X className="w-5 h-5" />
              </Button>
              {media.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                  <h3 className="text-white text-lg font-semibold">{media.title}</h3>
                  {media.description && (
                    <p className="text-gray-300 text-sm mt-1">{media.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


