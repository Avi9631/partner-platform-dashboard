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

  // Pro tips for media upload
  const mediaTips = [
    "Upload high-quality images with good lighting for better visibility",
    "Include photos of exterior, sample flats, amenities, and construction progress",
    "Floor plans and master plans help buyers understand the layout",
    "Videos should showcase key features and amenities (1-2 minutes ideal)",
    "Add descriptive titles and categories to help buyers navigate",
    "Show completed areas and current construction status clearly",
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
          Project Media Gallery
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Add photos and videos to showcase your project
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

          {/* Upload Section */}
          <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex-shrink-0"
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
                      Add Images or Videos
                    </>
                  )}
                </Button>
              </label>

              {/* Media Count */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="text-muted-foreground">
                    {imageCount} {imageCount === 1 ? "Image" : "Images"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-600" />
                  <span className="text-muted-foreground">
                    {videoCount} {videoCount === 1 ? "Video" : "Videos"}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Info */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    At least 3 images are required{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Images: JPEG, PNG, WebP (max 10MB) • Videos: MP4, WebM, MOV
                    (max 100MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Media Grid or Empty State */}
            {mediaList.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <Building className="w-12 h-12 text-muted-foreground" />
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  No media uploaded yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Add Images or Videos&quot; to start uploading
                </p>
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

          {/* Pro Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  Pro Tips for Better Listings:
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                  {mediaTips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
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
        "border-2 rounded-lg overflow-hidden transition-all",
        borderColor,
        isUploading && "opacity-60"
      )}
    >
      {/* Preview Section */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-12 h-12 text-purple-500" />
            <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
              VIDEO
            </div>
          </div>
        ) : (
          <>
            <img
              src={media.preview || media.url}
              alt={media.title || "Project media"}
              className="w-full h-full object-cover"
            />
            {media.isPrimary && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                Cover Image
              </div>
            )}
          </>
        )}

        {/* Upload Progress */}
        {isUploading && uploadProgress !== undefined && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={() => onRemove(media.id)}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
          disabled={isUploading}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <Label className="text-xs font-medium mb-1">Title</Label>
          <Input
            value={media.title || ""}
            onChange={(e) => onUpdateMetadata(media.id, "title", e.target.value)}
            placeholder={isVideo ? "e.g., Project Walkthrough" : "e.g., Exterior View"}
            className="text-sm"
            disabled={isUploading}
          />
        </div>

        {/* Category Selector */}
        <div>
          <Label className="text-xs font-medium mb-1">Category</Label>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-full justify-between text-sm"
                disabled={isUploading}
              >
                {media.category || "Select category..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
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
          <Label className="text-xs font-medium mb-1">Caption (Optional)</Label>
          <Textarea
            value={media.caption || ""}
            onChange={(e) =>
              onUpdateMetadata(media.id, "caption", e.target.value)
            }
            placeholder="Add a description..."
            className="text-sm min-h-[60px] resize-none"
            maxLength={200}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {(media.caption || "").length}/200 characters
          </p>
        </div>

        {/* Set as Primary (Images only) */}
        {!isVideo && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`primary-${media.id}`}
              checked={media.isPrimary || false}
              onChange={(e) =>
                onUpdateMetadata(media.id, "isPrimary", e.target.checked)
              }
              className="rounded border-gray-300"
              disabled={isUploading}
            />
            <Label
              htmlFor={`primary-${media.id}`}
              className="text-xs cursor-pointer"
            >
              Set as cover image
            </Label>
          </div>
        )}

        {/* File Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>
            {media.filename} •{" "}
            {media.fileSize
              ? `${(media.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : "Unknown size"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
