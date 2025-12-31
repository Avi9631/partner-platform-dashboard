import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  Bed,
  Plus,
  X,
  DollarSign,
  Square,
  Check,
  Users,
  Snowflake,
  Droplets,
  MapPin,
  Wind,
  IndianRupee,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePgFormV2 } from "../../context/PgFormContextV2";
import roomTypesPgSchema from "../../../schemas/roomTypesPgSchema";
import { createStepLogger } from "../../../../listProperty/utils/validationLogger";
import { uploadMultipleFiles } from "@/lib/uploadUtils";
import { z } from "zod";

// Room amenities list matching JSON structure
const ROOM_AMENITIES = [
  { name: "Queen Size Bed", icon: Bed },
  { name: "Single Bed", icon: Bed },
  { name: "Double Bed", icon: Bed },
  { name: "2 Single Beds", icon: Bed },
  { name: "3 Single Beds", icon: Bed },
  { name: "Premium Mattress", icon: Bed },
  { name: "Mattress Included", icon: Bed },
  { name: "Large Cupboard", icon: Square },
  { name: "2 Cupboards", icon: Square },
  { name: "3 Cupboards", icon: Square },
  { name: "Study Table & Chair", icon: Square },
  { name: "2 Study Tables", icon: Square },
  { name: "Study Tables", icon: Square },
  { name: "AC", icon: Snowflake },
  { name: "3 Fans", icon: Wind },
  { name: "Attached Bathroom", icon: Droplets },
  { name: "Common Bathroom", icon: Droplets },
  { name: "Balcony", icon: MapPin },
  { name: "High Speed WiFi", icon: Square },
  { name: "Mini Refrigerator", icon: Square },
  { name: "Shared Refrigerator", icon: Square },
  { name: "TV", icon: Square },
  { name: "Window", icon: Square },
];

// Pricing types from JSON structure
const PRICING_TYPES = [
  "Monthly Rent",
  "Security Deposit",
  "Maintenance Charges",
  "Food (Optional)",
  "Electricity",
  "Booking Amount",
];

export default function RoomTypesPgStep() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePgFormV2();
  const [showAmenitiesDialog, setShowAmenitiesDialog] = useState(false);
  const [selectedAmenitiesRoomIndex, setSelectedAmenitiesRoomIndex] =
    useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [tempRoomData, setTempRoomData] = useState(null);
  const [currentSheetTab, setCurrentSheetTab] = useState("basic");
  const [sheetValidationErrors, setSheetValidationErrors] = useState({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState([]);

  const logger = useMemo(() => createStepLogger("Room Types PG Step V2"), []);

  // Wrap the array schema in an object for form compatibility with useFieldArray
  const formSchema = useMemo(() => z.object({
    roomTypes: roomTypesPgSchema
  }), []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      roomTypes: formData?.roomTypes?.length > 0 ? formData.roomTypes : [],
    },
  });

  const {
    fields: roomTypes,
    append: addRoomType,
    remove: removeRoomType,
  } = useFieldArray({
    control: form.control,
    name: "roomTypes",
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Validate tab completion
  const validateTabCompletion = (roomData) => {
    const errors = {};

    // Basic tab validation
    if (!roomData.name?.trim()) {
      errors.basic = "Room name is required";
    } else if (
      !roomData.roomSize ||
      (typeof roomData.roomSize === "string" && !roomData.roomSize.trim()) ||
      (typeof roomData.roomSize === "number" && roomData.roomSize <= 0)
    ) {
      errors.basic = "Room size is required";
    }

    // Pricing tab validation
    if (!roomData.pricing || roomData.pricing.length === 0) {
      errors.pricing = "At least one pricing item is required";
    } else {
      const hasInvalidPricing = roomData.pricing.some(
        (p) => !p.type || p.amount < 0
      );
      if (hasInvalidPricing) {
        errors.pricing = "All pricing items must have type and valid amount";
      }
    }

    // Amenities tab validation
    if (!roomData.amenities || roomData.amenities.length === 0) {
      errors.amenities = "Please select at least one amenity";
    }

    // Availability tab validation
    if (!roomData.availability?.nextAvailability) {
      errors.availability = "Next availability is required";
    }

    return errors;
  };

  // Check if tab is complete
  const isTabComplete = (tabName, roomData) => {
    if (!roomData) return false;
    const errors = validateTabCompletion(roomData);
    return !errors[tabName];
  };

  // Check if all tabs are complete
  const areAllTabsComplete = (roomData) => {
    if (!roomData) return false;
    const errors = validateTabCompletion(roomData);
    return Object.keys(errors).length === 0;
  };

  // Add new room type
  const handleAddRoomType = () => {
    const newRoom = {
      name: "",
      category: "Single sharing",
      roomSize: "",
      pricing: [
        { type: "Monthly Rent", amount: 0, currency: "INR", mandatory: true },
        {
          type: "Security Deposit",
          amount: 0,
          currency: "INR",
          mandatory: true,
          refundable: true,
        },
      ],
      availability: {
        soldOut: false,
        nextAvailability: "",
      },
      refundPolicy: "",
      amenities: [],
      images: [],
    };
    setTempRoomData(newRoom);
    setEditingRoomIndex(null);
    setCurrentSheetTab("basic");
    setSheetValidationErrors({});
    setIsSheetOpen(true);
  };

  // Edit room type
  const handleEditRoomType = (index) => {
    const roomToEdit = form.getValues(`roomTypes.${index}`);
    setTempRoomData({ ...roomToEdit });
    setEditingRoomIndex(index);
    setCurrentSheetTab("basic");
    setSheetValidationErrors(validateTabCompletion({ ...roomToEdit }));
    setIsSheetOpen(true);
  };

  // Save room from sheet
  const handleSaveRoomFromSheet = () => {
    if (!tempRoomData) return;

    // Validate all tabs
    const errors = validateTabCompletion(tempRoomData);
    setSheetValidationErrors(errors);

    // If there are errors, switch to the first tab with error
    if (Object.keys(errors).length > 0) {
      const firstErrorTab = Object.keys(errors)[0];
      setCurrentSheetTab(firstErrorTab);
      return;
    }

    if (editingRoomIndex !== null) {
      // Update existing room
      form.setValue(`roomTypes.${editingRoomIndex}`, tempRoomData);
    } else {
      // Add new room
      addRoomType(tempRoomData);
    }

    setIsSheetOpen(false);
    setTempRoomData(null);
    setEditingRoomIndex(null);
    setCurrentSheetTab("basic");
    setSheetValidationErrors({});
  };

  // Update temp room data
  const updateTempRoomField = (fieldPath, value) => {
    setTempRoomData((prev) => {
      const newData = { ...prev };
      const keys = fieldPath.split(".");
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      // Revalidate after update
      const errors = validateTabCompletion(newData);
      setSheetValidationErrors(errors);

      return newData;
    });
  };

  // Duplicate room type
  const duplicateRoomType = (index) => {
    const roomToDuplicate = form.getValues(`roomTypes.${index}`);
    addRoomType({
      ...roomToDuplicate,
      name: `${roomToDuplicate.name} (Copy)`,
    });
  };

  // Add pricing item
  const addPricingItem = (roomIndex) => {
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentPricing = tempRoomData.pricing || [];
      updateTempRoomField("pricing", [
        ...currentPricing,
        {
          type: "Maintenance Charges",
          amount: 0,
          currency: "INR",
          mandatory: true,
          frequency: "monthly",
        },
      ]);
    } else {
      // Working with form data
      const currentPricing =
        form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
      form.setValue(`roomTypes.${roomIndex}.pricing`, [
        ...currentPricing,
        {
          type: "Maintenance Charges",
          amount: 0,
          currency: "INR",
          mandatory: true,
          frequency: "monthly",
        },
      ]);
    }
  };

  // Remove pricing item
  const removePricingItem = (roomIndex, pricingIndex) => {
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentPricing = tempRoomData.pricing || [];
      updateTempRoomField(
        "pricing",
        currentPricing.filter((_, i) => i !== pricingIndex)
      );
    } else {
      // Working with form data
      const currentPricing =
        form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
      form.setValue(
        `roomTypes.${roomIndex}.pricing`,
        currentPricing.filter((_, i) => i !== pricingIndex)
      );
    }
  };

  // Toggle room amenity
  const toggleAmenity = (roomIndex, amenityName) => {
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentAmenities = tempRoomData.amenities || [];
      const existingIndex = currentAmenities.findIndex(
        (a) => a.name === amenityName
      );

      if (existingIndex >= 0) {
        updateTempRoomField(
          "amenities",
          currentAmenities.filter((_, i) => i !== existingIndex)
        );
      } else {
        const amenityData = ROOM_AMENITIES.find((a) => a.name === amenityName);
        updateTempRoomField("amenities", [
          ...currentAmenities,
          { name: amenityName, available: true },
        ]);
      }
    } else {
      // Working with form data
      const currentAmenities =
        form.getValues(`roomTypes.${roomIndex}.amenities`) || [];
      const existingIndex = currentAmenities.findIndex(
        (a) => a.name === amenityName
      );

      if (existingIndex >= 0) {
        // Remove amenity
        form.setValue(
          `roomTypes.${roomIndex}.amenities`,
          currentAmenities.filter((_, i) => i !== existingIndex)
        );
      } else {
        // Add amenity
        const amenityData = ROOM_AMENITIES.find((a) => a.name === amenityName);
        form.setValue(`roomTypes.${roomIndex}.amenities`, [
          ...currentAmenities,
          { name: amenityName, available: true, icon: amenityData?.icon },
        ]);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newErrors = [];
    const validFiles = [];

    // Validate files
    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        newErrors.push(
          `${file.name}: Invalid file type. Only images are allowed.`
        );
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        newErrors.push(`${file.name}: File too large. Maximum size is 10MB.`);
        return;
      }

      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      setUploadErrors(newErrors);
      setTimeout(() => setUploadErrors([]), 5000);
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    // Create temporary image items
    const tempImages = validFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      fileSize: file.size,
      uploading: true,
      uploadProgress: 0,
      url: null,
    }));

    // Add to tempRoomData immediately to show uploading state
    if (tempRoomData) {
      setTempRoomData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...tempImages],
      }));

      // Start upload
      try {
        const uploadResults = await uploadMultipleFiles(
          validFiles,
          "listing-drafts/room-images",
          (fileIndex, progress) => {
            const imageId = tempImages[fileIndex].id;
            setUploadProgress((prev) => ({
              ...prev,
              [imageId]: progress,
            }));
          }
        );

        // Update images with upload results
        setTempRoomData((prev) => {
          const existingImages = prev.images || [];
          const updatedImages = existingImages
            .map((img) => {
              const tempIndex = tempImages.findIndex((t) => t.id === img.id);
              if (tempIndex !== -1) {
                const result = uploadResults[tempIndex];
                if (result.success) {
                  return {
                    url: result.url,
                    fileSize: img.fileSize,
                  };
                } else {
                  newErrors.push(`${result.file.name}: ${result.error}`);
                  return null; // Remove failed uploads
                }
              }
              return img;
            })
            .filter(Boolean);

          return { ...prev, images: updatedImages };
        });

        if (newErrors.length > 0) {
          setUploadErrors(newErrors);
          setTimeout(() => setUploadErrors([]), 5000);
        }
      } catch (error) {
        console.error("Upload error:", error);
        newErrors.push(`Upload failed: ${error.message}`);
        setUploadErrors(newErrors);
        setTimeout(() => setUploadErrors([]), 5000);

        // Remove uploading images on error
        setTempRoomData((prev) => ({
          ...prev,
          images: (prev.images || []).filter((img) => !img.uploading),
        }));
      } finally {
        setUploadProgress({});
      }
    }

    event.target.value = "";
  };

  // Remove image
  const removeImage = (imageIndex) => {
    if (tempRoomData) {
      const newImages = [...(tempRoomData.images || [])];
      newImages.splice(imageIndex, 1);
      setTempRoomData((prev) => ({
        ...prev,
        images: newImages,
      }));
    }
  };

  // Upload images for all room types
  const uploadRoomImages = async (roomTypes) => {
    // Process each room type
    const uploadedRoomTypes = await Promise.all(
      roomTypes.map(async (room) => {
        if (!room.images || room.images.length === 0) {
          return { ...room, images: [] };
        }

        // Filter images that already have URLs (already uploaded)
        const imagesToUpload = room.images.filter(
          (img) => img.file && !img.url
        );
        const alreadyUploaded = room.images.filter((img) => img.url);

        if (imagesToUpload.length === 0) {
          // All images already uploaded, just return the URLs
          return {
            ...room,
            images: alreadyUploaded.map((img) => ({ url: img.url })),
          };
        }

        // Upload new images to S3
        try {
          const uploadResults = await uploadMultipleFiles(
            imagesToUpload.map((img) => img.file),
            "listing-drafts/room-images"
          );

          const successfulUploads = uploadResults
            .filter((result) => result.success)
            .map((result) => ({ url: result.url }));

          return {
            ...room,
            images: [
              ...alreadyUploaded.map((img) => ({ url: img.url })),
              ...successfulUploads,
            ],
          };
        } catch (error) {
          console.error("Error uploading room images:", error);
          // Return room with only already uploaded images
          return {
            ...room,
            images: alreadyUploaded.map((img) => ({ url: img.url })),
          };
        }
      })
    );

    return uploadedRoomTypes;
  };

  const onSubmit = async (data) => {
    try {
      setIsUploadingImages(true);
      logger.logSubmission(data, form.formState.errors);

      // Upload all room images before saving
      const roomTypesWithUploadedImages = await uploadRoomImages(
        data.roomTypes
      );

      // Update data with uploaded image URLs
      const finalData = {
        ...data,
        roomTypes: roomTypesWithUploadedImages,
      };

      saveAndContinue(finalData);
    } catch (error) {
      console.error("Error uploading images:", error);
      // You might want to show a toast notification here
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, [form.handleSubmit]);

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-7xl mx-auto ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-2xl   font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Room Types & Pricing
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Configure different room types with detailed pricing, amenities, and
          availability
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4 md:space-y-6"
        >
          {/* Add Room Type Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold">
              Room Types Configuration
            </h3>
            <Button
              type="button"
              onClick={handleAddRoomType}
              variant="outline"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Room Type</span>
              <span className="sm:hidden">Add Room</span>
            </Button>
          </div>

          {/* Room Types Accordion */}
          <div className="space-y-3 md:space-y-4">
            {roomTypes.length === 0 ? (
              <div className="text-center py-8 md:py-12 border-2 border-dashed rounded-lg">
                <Bed className="w-8 md:w-12 h-8 md:h-12 mx-auto text-muted-foreground/50 mb-2 md:mb-4" />
                <p className="text-base md:text-lg font-medium text-muted-foreground mb-1 md:mb-2">
                  No room types added yet
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                  Start by adding your first room type
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {roomTypes.map((roomType, index) => {
                  const roomData = form.watch(`roomTypes.${index}`);
                  const hasErrors = form.formState.errors.roomTypes?.[index];

                  return (
                    <Card
                      key={roomType.id}
                      className={`${
                        hasErrors
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                      }`}
                    >
                      <CardHeader className="">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <Bed className="w-4 md:w-5 h-4 md:h-5 text-orange-600" />
                              <span className="font-medium text-sm md:text-base">
                                {roomData?.name || `Room Type ${index + 1}`}{" "}
                                <span className="text-muted-foreground text-xs">
                                  {roomData?.category}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditRoomType(index)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => duplicateRoomType(index)}
                              className="h-8 w-8 p-0"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {roomTypes.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeRoomType(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </form>
      </motion.div>

      {/* Room Type Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-screen h-screen max-w-none sm:w-screen sm:max-w-none flex flex-col p-0">
          <div className="p-6 border-b">
            <SheetHeader>
              <SheetTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {editingRoomIndex !== null
                  ? "Edit Room Type"
                  : "Add New Room Type"}
              </SheetTitle>
              <SheetDescription>
                Configure room details, pricing, amenities, and availability
              </SheetDescription>
            </SheetHeader>
          </div>

          {tempRoomData && (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <Tabs
                  value={currentSheetTab}
                  onValueChange={setCurrentSheetTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="basic" className="relative">
                      <span className="flex items-center gap-1.5">
                        Basic
                        {isTabComplete("basic", tempRoomData) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : sheetValidationErrors.basic ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : null}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="relative">
                      <span className="flex items-center gap-1.5">
                        Pricing
                        {isTabComplete("pricing", tempRoomData) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : sheetValidationErrors.pricing ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : null}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="images" className="relative">
                      <span className="flex items-center gap-1.5">
                        Images
                        {tempRoomData.images &&
                        tempRoomData.images.length > 0 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : null}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="amenities" className="relative">
                      <span className="flex items-center gap-1.5">
                        Amenities
                        {isTabComplete("amenities", tempRoomData) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : sheetValidationErrors.amenities ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : null}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="availability" className="relative">
                      <span className="flex items-center gap-1.5">
                        Availability
                        {isTabComplete("availability", tempRoomData) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : sheetValidationErrors.availability ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : null}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="mt-6 space-y-6">
                      {sheetValidationErrors.basic && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-600 font-medium">
                            {sheetValidationErrors.basic}
                          </p>
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <Label>
                            Room Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={tempRoomData.name || ""}
                            onChange={(e) =>
                              updateTempRoomField("name", e.target.value)
                            }
                            placeholder="e.g., Single Occupancy AC"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>
                            Room Category{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={tempRoomData.category || "Single sharing"}
                            onValueChange={(value) =>
                              updateTempRoomField("category", value)
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single sharing">
                                Single Sharing
                              </SelectItem>
                              <SelectItem value="Double sharing">
                                Double Sharing
                              </SelectItem>
                              <SelectItem value="Triple sharing">
                                Triple Sharing
                              </SelectItem>
                              <SelectItem value="Four sharing">
                                Four Sharing
                              </SelectItem>
                              <SelectItem value="Six sharing">
                                Six Sharing
                              </SelectItem>
                              <SelectItem value="Private room">
                                Private Room
                              </SelectItem>
                              <SelectItem value="Studio">Studio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>
                            Room Size <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={tempRoomData.roomSize || ""}
                            onChange={(e) =>
                              updateTempRoomField("roomSize", e.target.value)
                            }
                            placeholder="e.g., 120 sq.ft"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>
                            Refund Policy{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            value={tempRoomData.refundPolicy || ""}
                            onChange={(e) =>
                              updateTempRoomField(
                                "refundPolicy",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 100% refund if cancelled 15 days before move-in"
                            className="mt-2 min-h-[80px]"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="mt-6 space-y-6">
                      {sheetValidationErrors.pricing && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-600 font-medium">
                            {sheetValidationErrors.pricing}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Pricing Details
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addPricingItem(null)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {tempRoomData.pricing?.map(
                          (pricingItem, pricingIndex) => (
                            <div
                              key={pricingIndex}
                              className="relative border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg p-3 md:p-4 space-y-3 hover:shadow-md transition-shadow"
                            >
                              {/* Row 1: Type, Amount, Frequency and Delete */}
                              <div className="flex flex-wrap gap-2 md:gap-3 items-end">
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[180px]">
                                  <FieldGroup>
                                    <FieldLabel className="text-xs font-semibold text-foreground">
                                      Type{" "}
                                      <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Select
                                      value={pricingItem.type || "Monthly Rent"}
                                      onValueChange={(value) => {
                                        const updatedPricing = [
                                          ...tempRoomData.pricing,
                                        ];
                                        updatedPricing[pricingIndex].type =
                                          value;
                                        updateTempRoomField(
                                          "pricing",
                                          updatedPricing
                                        );
                                      }}
                                    >
                                      <SelectTrigger className="h-9 mt-1 bg-white dark:bg-gray-900">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {PRICING_TYPES.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FieldGroup>
                                </div>

                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[140px]">
                                  <FieldGroup>
                                    <FieldLabel className="text-xs font-semibold text-foreground">
                                      Amount (₹){" "}
                                      <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <div className="relative mt-1">
                                      <IndianRupee className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-orange-600" />
                                      <Input
                                        type="number"
                                        min="0"
                                        value={pricingItem.amount || 0}
                                        onChange={(e) => {
                                          const updatedPricing = [
                                            ...tempRoomData.pricing,
                                          ];
                                          updatedPricing[pricingIndex].amount =
                                            parseInt(e.target.value) || 0;
                                          updateTempRoomField(
                                            "pricing",
                                            updatedPricing
                                          );
                                        }}
                                        placeholder="0"
                                        className="pl-8 h-9 bg-white dark:bg-gray-900 font-medium"
                                      />
                                    </div>
                                  </FieldGroup>
                                </div>

                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[130px]">
                                  <FieldGroup>
                                    <FieldLabel className="text-xs font-semibold text-foreground">
                                      Frequency
                                    </FieldLabel>
                                    <Select
                                      value={pricingItem.frequency || "monthly"}
                                      onValueChange={(value) => {
                                        const updatedPricing = [
                                          ...tempRoomData.pricing,
                                        ];
                                        updatedPricing[pricingIndex].frequency =
                                          value;
                                        updateTempRoomField(
                                          "pricing",
                                          updatedPricing
                                        );
                                      }}
                                    >
                                      <SelectTrigger className="h-9 mt-1 bg-white dark:bg-gray-900">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="monthly">
                                          Monthly
                                        </SelectItem>
                                        <SelectItem value="one_time">
                                          One-Time
                                        </SelectItem>
                                        <SelectItem value="per_unit">
                                          Per Unit
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FieldGroup>
                                </div>

                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 w-full sm:w-auto">
                                  <Switch
                                    id={`mandatory-${pricingIndex}`}
                                    checked={pricingItem.mandatory || false}
                                    onCheckedChange={(checked) => {
                                      const updatedPricing = [
                                        ...tempRoomData.pricing,
                                      ];
                                      updatedPricing[pricingIndex].mandatory =
                                        checked;
                                      updateTempRoomField(
                                        "pricing",
                                        updatedPricing
                                      );
                                    }}
                                    className="scale-90"
                                  />
                                  <Label
                                    htmlFor={`mandatory-${pricingIndex}`}
                                    className="text-xs cursor-pointer font-medium"
                                  >
                                    Mandatory
                                  </Label>
                                </div>

                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 w-full sm:w-auto">
                                  <Switch
                                    id={`refundable-${pricingIndex}`}
                                    checked={pricingItem.refundable || false}
                                    onCheckedChange={(checked) => {
                                      const updatedPricing = [
                                        ...tempRoomData.pricing,
                                      ];
                                      updatedPricing[pricingIndex].refundable =
                                        checked;
                                      updateTempRoomField(
                                        "pricing",
                                        updatedPricing
                                      );
                                    }}
                                    className="scale-90"
                                  />
                                  <Label
                                    htmlFor={`refundable-${pricingIndex}`}
                                    className="text-xs cursor-pointer font-medium"
                                  >
                                    Refundable
                                  </Label>
                                </div>

                                <div className="w-full sm:w-auto sm:ml-auto">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removePricingItem(null, pricingIndex)
                                    }
                                    className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                                    title="Remove pricing item"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                 
                              {/* Row 3: Note Input (Full Width) */}
                              <div className="pt-1">
                                <FieldGroup>
                                  <FieldLabel className="text-xs font-medium text-muted-foreground">
                                    Note (Optional)
                                  </FieldLabel>
                                  <Input
                                    value={pricingItem.note || ""}
                                    onChange={(e) => {
                                      const updatedPricing = [
                                        ...tempRoomData.pricing,
                                      ];
                                      updatedPricing[pricingIndex].note =
                                        e.target.value;
                                      updateTempRoomField(
                                        "pricing",
                                        updatedPricing
                                      );
                                    }}
                                    placeholder="e.g., Includes electricity up to 100 units"
                                    className="h-9 text-xs bg-white dark:bg-gray-900 "
                                  />
                                </FieldGroup>
                              </div>
                            </div>
                          )
                        )}

                        {(!tempRoomData.pricing ||
                          tempRoomData.pricing.length === 0) && (
                          <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <DollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground mb-4">
                              No pricing items added
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addPricingItem(null)}
                            >
                              Add First Pricing Item
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="images" className="mt-6 space-y-6">
                      {/* Upload Errors */}
                      {uploadErrors.length > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-red-600 font-medium mb-1">
                              Upload Errors:
                            </p>
                            <ul className="text-xs text-red-600 space-y-0.5">
                              {uploadErrors.map((error, idx) => (
                                <li key={idx}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Room Images</h3>
                        <Badge variant="secondary">
                          {tempRoomData.images?.length || 0} Images
                        </Badge>
                      </div>

                      {/* Upload Section */}
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="room-image-upload"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <label
                          htmlFor="room-image-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Click to upload room images
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 10MB each
                            </p>
                          </div>
                          {/* <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.preventDefault()}
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Choose Files
                          </Button> */}
                        </label>
                      </div>

                      {/* Image Preview Grid */}
                      {tempRoomData.images && tempRoomData.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {tempRoomData.images.map((image, index) => {
                            const isUploading = image.uploading || false;
                            const progress =
                              uploadProgress[image.id] ||
                              image.uploadProgress ||
                              0;

                            return (
                              <div
                                key={image.id || index}
                                className="relative group"
                              >
                                <div className="aspect-video rounded-lg overflow-hidden border-2 border-muted">
                                  <img
                                    src={image.url || (image.file ? URL.createObjectURL(image.file) : '')}
                                    alt={`Room image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />

                                  {/* Upload Progress Overlay */}
                                  {isUploading && (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                                      <Upload className="w-5 h-5 text-white animate-pulse" />
                                      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-orange-500 transition-all duration-300"
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                      <p className="text-white text-xs font-medium">
                                        {progress}%
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {!isUploading && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}

                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                  {isUploading ? (
                                    <>
                                      <Upload className="w-3 h-3" />
                                      Uploading...
                                    </>
                                  ) : image.url ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                                      Image {index + 1}
                                    </>
                                  ) : (
                                    `Image ${index + 1}`
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No images uploaded yet
                          </p>
                        </div>
                      )}

        
                    </TabsContent>

                    {/* Amenities Tab */}
                    <TabsContent value="amenities" className="mt-6 space-y-6">
                      {sheetValidationErrors.amenities && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-600 font-medium">
                            {sheetValidationErrors.amenities}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Room Amenities
                        </h3>
                        <Badge variant="secondary">
                          {tempRoomData.amenities?.length || 0} Selected
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {ROOM_AMENITIES.map((amenity) => {
                          const isSelected =
                            tempRoomData.amenities?.some(
                              (a) => a.name === amenity.name
                            ) || false;
                          const IconComponent = amenity.icon;

                          return (
                            <button
                              key={amenity.name}
                              type="button"
                              onClick={() => toggleAmenity(null, amenity.name)}
                              className={`p-4 text-left border-2 rounded-lg transition-all ${
                                isSelected
                                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                  : "border-muted hover:border-orange-500/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent
                                  className={`w-5 h-5 ${
                                    isSelected
                                      ? "text-orange-600"
                                      : "text-muted-foreground"
                                  }`}
                                />
                                <span className="text-sm font-medium flex-1">
                                  {amenity.name}
                                </span>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-orange-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </TabsContent>

                    {/* Availability Tab */}
                    <TabsContent
                      value="availability"
                      className="mt-6 space-y-6"
                    >
                      {sheetValidationErrors.availability && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-600 font-medium">
                            {sheetValidationErrors.availability}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Next Availability */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">
                            Next Availability <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={
                              tempRoomData.availability?.nextAvailability || ""
                            }
                            onValueChange={(value) =>
                              updateTempRoomField(
                                "availability.nextAvailability",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Immediate">Immediate</SelectItem>
                              <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                              <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                              <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                              <SelectItem value="After 1 month">After 1 month</SelectItem>
                              <SelectItem value="After 2 months">After 2 months</SelectItem>
                              <SelectItem value="After 3 months">After 3 months</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            When will this room be available for booking?
                          </p>
                        </div>

                        {/* Room Status */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Room Status</Label>
                          <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors h-11">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="sheet-soldout" className="cursor-pointer font-medium text-sm">
                                Currently Sold Out
                              </Label>
                            </div>
                            <Switch
                              id="sheet-soldout"
                              checked={
                                tempRoomData.availability?.soldOut || false
                              }
                              onCheckedChange={(checked) =>
                                updateTempRoomField(
                                  "availability.soldOut",
                                  checked
                                )
                              }
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Toggle if all rooms of this type are currently unavailable
                          </p>
                        </div>
                      </div>
                      


                      {/* Availability Summary */}
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Availability Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Next Available
                              </span>
                              <span className="text-lg font-bold text-orange-600">
                                {tempRoomData.availability?.nextAvailability || "Not set"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Status
                              </span>
                              <span
                                className={`text-lg font-bold ${
                                  tempRoomData.availability?.soldOut
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {tempRoomData.availability?.soldOut
                                  ? "Sold Out"
                                  : "Available"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <div className="border-t p-6 bg-background">
                <SheetFooter className="gap-3 flex-col sm:flex-row">
                  <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsSheetOpen(false);
                        setTempRoomData(null);
                        setEditingRoomIndex(null);
                        setCurrentSheetTab("basic");
                        setSheetValidationErrors({});
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveRoomFromSheet}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex-1 sm:flex-none"
                      disabled={!areAllTabsComplete(tempRoomData)}
                      title={
                        !areAllTabsComplete(tempRoomData)
                          ? "Please complete all tabs before saving"
                          : ""
                      }
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {editingRoomIndex !== null ? "Update Room" : "Add Room"}
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
