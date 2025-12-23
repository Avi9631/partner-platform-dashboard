import { motion, AnimatePresence } from "motion/react";
import {
  Image,
  Video,
  Upload,
  X,
  Info,
  Loader2,
  Plus,
  Check,
  ChevronDown,
  Film,
  MapPin,
  Building,
  Camera,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import { MEDIA_CATEGORIES, VIDEO_TYPES } from "../../../schemas/mediaUploadProjectSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { uploadMultipleFiles } from "@/lib/uploadUtils";

// Maximum file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Accepted file types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Default category suggestions for Projects
const DEFAULT_CATEGORIES = [
  "Exterior View",
  "Interior View",
  "Sample Flat",
  "Lobby",
  "Amenities",
  "Swimming Pool",
  "Gym",
  "Clubhouse",
  "Children's Play Area",
  "Garden",
  "Parking",
  "Construction Progress",
  "Master Plan",
  "Floor Plan",
  "Location Map",
  "Night View",
  "Aerial View",
  "Other",
];

export default function MediaUploadProjectStep() {
  const { saveAndContinue, goToPreviousStep, formData, currentStep } = useProjectFormV2();

  // Unified media list (both images and videos)
  const [mediaList, setMediaList] = useState(formData?.mediaData || []);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    const existingCategories = (formData?.mediaData || [])
      .map((m) => m.category)
      .filter(Boolean);
    const uniqueCategories = new Set([
      ...DEFAULT_CATEGORIES,
      ...existingCategories,
    ]);
    return Array.from(uniqueCategories);
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      mediaData: formData?.mediaData || [],
    },
  });

  const { setValue } = methods;

  // Count images and videos
  const imageCount = mediaList.filter((m) => m.type === "image").length;
  const videoCount = mediaList.filter((m) => m.type === "video").length;

  // Validation: At least 3 images required
  const isValid = imageCount >= 3;

  // Helper function to check if file is duplicate
  const isDuplicateFile = useCallback(
    (newFile) => {
      return mediaList.some(
        (media) =>
          media.filename === newFile.name &&
          media.fileSize === newFile.size &&
          media.lastModified === newFile.lastModified
      );
    },
    [mediaList]
  );

  // Handle unified media upload (images and videos)
  const handleMediaUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      const newErrors = [];
      const validFiles = [];

      // Step 1: Validate files
      files.forEach((file) => {
        // Check for duplicate files
        if (isDuplicateFile(file)) {
          newErrors.push(
            `${file.name}: This file has already been uploaded.`
          );
          return;
        }

        // Determine if it's an image or video
        const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
        const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

        // Validate file type
        if (!isImage && !isVideo) {
          newErrors.push(
            `${file.name}: Invalid file type. Only images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV) are allowed.`
          );
          return;
        }

        // Validate file size
        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
        const maxSizeText = isImage ? "10MB" : "100MB";

        if (file.size > maxSize) {
          newErrors.push(
            `${file.name}: File too large. Maximum size is ${maxSizeText}.`
          );
          return;
        }

        validFiles.push({ file, isImage, isVideo });
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
      const tempMediaItems = validFiles.map(({ file, isImage, isVideo }) => ({
        id: `media-${Date.now()}-${Math.random()}`,
        file,
        filename: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file),
        title: file.name.split(".")[0],
        category: isImage ? "exterior" : "project_walkthrough",
        caption: "",
        type: isImage ? "image" : "video",
        uploading: true,
        uploadProgress: 0,
        url: null,
        key: null,
        isPrimary: mediaList.length === 0 && isImage,
      }));

      // Add to media list immediately to show uploading state
      const updatedMedia = [...mediaList, ...tempMediaItems];
      setMediaList(updatedMedia);

      // Step 3: Upload files to S3
      setIsUploading(true);
      try {
        // Determine folder based on first file type
        const folder = validFiles[0].isImage
          ? 'listing/projects/images'
          : 'listing/projects/videos';

        const uploadResults = await uploadMultipleFiles(
          validFiles.map((v) => v.file),
          folder,
          (fileIndex, progress) => {
            // Update progress for specific file
            const mediaId = tempMediaItems[fileIndex].id;
            setUploadProgress((prev) => ({
              ...prev,
              [mediaId]: progress,
            }));
          }
        );

        // Step 4: Update media items with upload results
        const finalMediaItems = tempMediaItems.map((item, index) => {
          const result = uploadResults[index];
          if (result.success) {
            return {
              ...item,
              uploading: false,
              uploadProgress: 100,
              url: result.url,
              key: result.key,
              file: null, // Remove file object after upload
            };
          } else {
            newErrors.push(`${result.file.name}: ${result.error}`);
            return null; // Remove failed uploads
          }
        }).filter(Boolean);

        // Update media list with uploaded items
        const finalList = [
          ...mediaList,
          ...finalMediaItems,
        ];
        setMediaList(finalList);
        setValue("mediaData", finalList, { shouldValidate: true });

        if (newErrors.length > 0) {
          setUploadErrors(newErrors);
          setTimeout(() => setUploadErrors([]), 5000);
        }
      } catch (error) {
        console.error("Upload error:", error);
        newErrors.push(`Upload failed: ${error.message}`);
        setUploadErrors(newErrors);
        setTimeout(() => setUploadErrors([]), 5000);

        // Remove uploading items on error
        setMediaList(mediaList);
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }

      // Reset input
      e.target.value = "";
    },
    [mediaList, setValue, isDuplicateFile]
  );

  // Update media metadata
  const updateMediaMetadata = useCallback(
    (id, field, value) => {
      const updatedList = mediaList.map((media) =>
        media.id === id ? { ...media, [field]: value } : media
      );
      setMediaList(updatedList);
      setValue("mediaData", updatedList);

      // Add new category if it doesn't exist
      if (field === "category" && !allCategories.includes(value)) {
        setAllCategories((prev) => [...prev, value]);
      }
    },
    [mediaList, setValue, allCategories]
  );

  // Remove media
  const removeMedia = useCallback(
    (id) => {
      const updatedList = mediaList.filter((media) => media.id !== id);
      setMediaList(updatedList);
      setValue("mediaData", updatedList);

      // Clean up preview URL if exists
      const media = mediaList.find((m) => m.id === id);
      if (media?.preview && media.preview.startsWith("blob:")) {
        URL.revokeObjectURL(media.preview);
      }
    },
    [mediaList, setValue]
  );

  // Handle form submission
  const handleContinue = () => {
    if (!isValid) {
      setUploadErrors(["Please upload at least 3 images of your project"]);
      return;
    }

    const data = {
      mediaData: mediaList,
      media: {
        images: mediaList.filter((m) => m.type === "image"),
        videos: mediaList.filter((m) => m.type === "video"),
        statistics: {
          totalImages: imageCount,
          totalVideos: videoCount,
          lastUpdated: new Date().toISOString(),
        },
      },
    };

    saveAndContinue(data);
  };

 
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Project Media Gallery
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Add photos and videos to showcase your project
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-4 md:space-y-6">
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

          {/* Upload Section */}
          <div className="space-y-4">
            {/* Upload Button and Stats */}
            <div className="flex flex-col gap-4">
              {/* Upload Button - Full width on mobile */}
              <label
                htmlFor="media-upload"
                className="cursor-pointer w-full sm:w-auto"
              >
                <input
                  id="media-upload"
                  type="file"
                  accept={[
                    ...ACCEPTED_IMAGE_TYPES,
                    ...ACCEPTED_VIDEO_TYPES,
                  ].join(",")}
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 h-12 sm:h-10 text-base sm:text-sm font-medium"
                  onClick={() =>
                    document.getElementById("media-upload").click()
                  }
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
                      Add Images or Videos
                    </>
                  )}
                </Button>
              </label>

              {/* Media Count - Better mobile layout */}
              <div className="flex items-center gap-3 sm:gap-4 text-sm">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium text-blue-700 dark:text-blue-400">
                    {imageCount} {imageCount === 1 ? "Image" : "Images"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/20 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="font-medium text-purple-700 dark:text-purple-400">
                    {videoCount} {videoCount === 1 ? "Video" : "Videos"}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Info */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 md:w-6 md:h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 text-sm md:text-base">
                    At least 3 images are required{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-1 text-xs md:text-sm text-muted-foreground">
                    <p>• Images: JPEG, PNG, WebP (max 10MB)</p>
                    <p>• Videos: MP4, WebM, MOV (max 100MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Grid or Empty State */}
            {mediaList.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 md:p-12 text-center bg-gray-50/50 dark:bg-gray-900/20">
                <div className="flex justify-center gap-4 mb-4">
                  <Building className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/60" />
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/60" />
                </div>
                <p className="text-sm md:text-base font-medium text-muted-foreground mb-2">
                  No media uploaded yet
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Click &quot;Add Images or Videos&quot; to start uploading
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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

 
        </div>
      </motion.div>

      <SaveAndContinueFooter
        onBack={goToPreviousStep}
        onSaveAndContinue={handleContinue}
        nextDisabled={!isValid}
        showBack={true}
      />
    </div>
  );
}

/**
 * Media Card Component - Displays individual image/video with metadata inputs
 */
function MediaCard({
  media,
  allCategories,
  onUpdateMetadata,
  onRemove,
  uploadProgress,
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const isVideo = media.type === "video";
  const isUploading = media.uploading || false;

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

  // Get border color based on media type
  const borderColor = isVideo
    ? "hover:border-purple-500"
    : "hover:border-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "border-2 rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md",
        borderColor,
        isUploading && "opacity-60 pointer-events-none"
      )}
    >
      {/* Preview Section */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
            <Film className="w-12 h-12 md:w-16 md:h-16 text-purple-500" />
            <div className="absolute top-2 right-2 bg-purple-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
              VIDEO
            </div>
          </div>
        ) : (
          <>
            <img
              src={media.preview || media.url}
              alt={media.title || "Project media"}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            {media.isPrimary && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <Check className="w-3 h-3" />
                Cover Image
              </div>
            )}
          </>
        )}

        {/* Upload Progress */}
        {isUploading && uploadProgress !== undefined && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin mx-auto mb-3" />
              <p className="text-lg md:text-xl font-semibold">{Math.round(uploadProgress)}%</p>
              <p className="text-xs md:text-sm text-white/80 mt-1">Uploading...</p>
            </div>
          </div>
        )}

        {/* Remove Button - Larger touch target for mobile */}
        <button
          onClick={() => onRemove(media.id)}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 md:p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg"
          disabled={isUploading}
          aria-label="Remove media"
        >
          <X className="w-5 h-5 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Metadata Section */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Title */}
        <div>
          <Label className="text-xs md:text-sm font-medium mb-2 block">Title</Label>
          <Input
            value={media.title || ""}
            onChange={(e) => onUpdateMetadata(media.id, "title", e.target.value)}
            placeholder={isVideo ? "e.g., Project Walkthrough" : "e.g., Exterior View"}
            className="text-sm md:text-base h-10 md:h-11"
            disabled={isUploading}
          />
        </div>

        {/* Category Selector */}
        <div>
          <Label className="text-xs md:text-sm font-medium mb-2 block">Category</Label>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-full justify-between text-sm md:text-base h-10 md:h-11"
                disabled={isUploading}
              >
                <span className="truncate">{media.category || "Select category..."}</span>
                <ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search or create category..."
                  value={categorySearch}
                  onValueChange={setCategorySearch}
                />
                <CommandEmpty>
                  {isNewCategory ? (
                    <button
                      className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded"
                      onClick={() => {
                        onUpdateMetadata(media.id, "category", categorySearch);
                        setCategoryOpen(false);
                        setCategorySearch("");
                      }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Create &quot;{categorySearch}&quot;
                    </button>
                  ) : (
                    "No category found."
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => {
                        onUpdateMetadata(media.id, "category", category);
                        setCategoryOpen(false);
                        setCategorySearch("");
                      }}
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
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Caption */}
        <div>
          <Label className="text-xs md:text-sm font-medium mb-2 block">Caption (Optional)</Label>
          <Textarea
            value={media.caption || ""}
            onChange={(e) =>
              onUpdateMetadata(media.id, "caption", e.target.value)
            }
            placeholder="Add a description..."
            className="text-sm md:text-base min-h-[80px] md:min-h-[60px] resize-none"
            maxLength={200}
            disabled={isUploading}
          />
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
            {(media.caption || "").length}/200 characters
          </p>
        </div>

        {/* Set as Primary (Images only) */}
        {!isVideo && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-gray-50/50 dark:bg-gray-900/20">
            <input
              type="checkbox"
              id={`primary-${media.id}`}
              checked={media.isPrimary || false}
              onChange={(e) =>
                onUpdateMetadata(media.id, "isPrimary", e.target.checked)
              }
              className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              disabled={isUploading}
            />
            <Label
              htmlFor={`primary-${media.id}`}
              className="text-xs md:text-sm cursor-pointer font-medium flex-1"
            >
              Set as cover image
            </Label>
          </div>
        )}

        {/* File Info */}
        <div className="text-xs md:text-sm text-muted-foreground pt-3 border-t">
          <p className="truncate" title={media.filename}>
            <span className="font-medium">File:</span> {media.filename}
          </p>
          <p className="mt-1">
            <span className="font-medium">Size:</span>{" "}
            {media.fileSize
              ? `${(media.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : "Unknown size"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
