import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Trash2,
  Plus,
  Info,
  Check,
  ChevronsUpDown,
  Tags,
  Eye,
  X,
  Loader2,
  Upload
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldLabel,
} from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import ProTipV2 from '../shared/ProTipV2';
import { uploadMultipleFiles } from '@/lib/uploadUtils';

// Maximum file size
const MAX_PLAN_SIZE = 10 * 1024 * 1024; // 10MB

// Accepted file types (images and PDFs for floor plans)
const ACCEPTED_PLAN_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Default category suggestions for property plans
const DEFAULT_CATEGORIES = [
  'Floor Plan',
  'Site Plan',
  'Layout Plan',
  'Master Plan',
  '2D Floor Plan',
  '3D Floor Plan',
  'Electrical Layout',
  'Plumbing Layout',
  'Ground Floor Plan',
  'First Floor Plan',
  'Second Floor Plan',
  'Basement Plan',
  'Terrace Plan',
  'Parking Layout',
  'Landscape Plan',
  'Building Elevation',
  'Other',
];

export default function PropertyPlanUploadStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();
  
  const [propertyPlans, setPropertyPlans] = useState(formData?.propertyPlans || []);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    // Extract unique categories from existing plans
    const existingCategories = (formData?.propertyPlans || [])
      .map(plan => plan.category)
      .filter(Boolean);
    const uniqueExisting = [...new Set(existingCategories)];
    
    // Combine with defaults, removing duplicates
    const combined = [...DEFAULT_CATEGORIES, ...uniqueExisting];
    return [...new Set(combined)];
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      propertyPlans: formData?.propertyPlans || [],
    },
  });

  const { setValue } = methods;

  // Optional step, can always continue
  const isValid = true;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle property plan upload
  const handlePlanUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    const newErrors = [];
    const validFiles = [];

    // Step 1: Validate files
    files.forEach((file) => {
      // Validate file type
      if (!ACCEPTED_PLAN_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: Invalid file type. Only PDF, JPG, PNG, and WebP are allowed.`);
        return;
      }

      // Validate file size
      if (file.size > MAX_PLAN_SIZE) {
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
      e.target.value = '';
      return;
    }

    // Step 2: Create temporary plan items with uploading status
    const tempPlanItems = validFiles.map((file) => {
      const isPDF = file.type === 'application/pdf';
      const previewUrl = isPDF ? null : URL.createObjectURL(file);
      
      return {
        id: `plan-${Date.now()}-${Math.random()}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        preview: previewUrl,
        category: '',
        title: '',
        description: '',
        docType: '',
        uploading: true,
        uploadProgress: 0,
        url: null,
        key: null,
        uploadedAt: new Date().toISOString(),
      };
    });

    // Add to plans list immediately to show uploading state
    const updatedPlans = [...propertyPlans, ...tempPlanItems];
    setPropertyPlans(updatedPlans);

    // Step 3: Upload files to S3
    setIsUploading(true);
    try {
      const folder = 'listing-drafts/plans';

      const uploadResults = await uploadMultipleFiles(
        validFiles,
        folder,
        (fileIndex, progress) => {
          const planId = tempPlanItems[fileIndex].id;
          setUploadProgress((prev) => ({
            ...prev,
            [planId]: progress,
          }));
        }
      );

      // Step 4: Update plan items with upload results
      setPropertyPlans((currentPlans) => {
        return currentPlans.map((plan) => {
          const tempIndex = tempPlanItems.findIndex((t) => t.id === plan.id);
          if (tempIndex === -1) return plan;

          const result = uploadResults[tempIndex];
          if (result.success) {
            return {
              ...plan,
              uploading: false,
              url: result.url,
              key: result.key,
              file: null, // Remove file object after upload
            };
          } else {
            return {
              ...plan,
              uploading: false,
              uploadFailed: true,
              uploadError: result.error,
            };
          }
        });
      });

      setValue('propertyPlans', updatedPlans, { shouldValidate: true });

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
      console.error('Upload error:', error);
      setUploadErrors([`Upload failed: ${error.message}`]);
      setTimeout(() => setUploadErrors([]), 5000);

      // Remove failed items
      setPropertyPlans((currentPlans) =>
        currentPlans.filter(
          (plan) => !tempPlanItems.some((t) => t.id === plan.id)
        )
      );
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }

    // Reset input
    e.target.value = '';
  }, [propertyPlans, setValue]);

  // Update plan metadata
  const updatePlanMetadata = useCallback((id, field, value) => {
    const updated = propertyPlans.map(plan => 
      plan.id === id ? { ...plan, [field]: value } : plan
    );
    setPropertyPlans(updated);
    setValue('propertyPlans', updated, { shouldValidate: true });
    
    // If category field is updated and it's a new category, add it to the list
    if (field === 'category' && value && !allCategories.includes(value)) {
      setAllCategories(prev => [...prev, value]);
    }
  }, [propertyPlans, setValue, allCategories]);

  // Remove plan
  const removePlan = useCallback((id) => {
    const updated = propertyPlans.filter(plan => plan.id !== id);
    setPropertyPlans(updated);
    setValue('propertyPlans', updated, { shouldValidate: true });
    
    // Revoke object URL to prevent memory leak
    const removed = propertyPlans.find(plan => plan.id === id);
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
  }, [propertyPlans, setValue]);

  // Handle form submission
  const handleContinue = () => {
    // Validate all uploads are complete
    const hasUploadingItems = propertyPlans.some((plan) => plan.uploading);
    if (hasUploadingItems) {
      setUploadErrors(['Please wait for all uploads to complete before continuing']);
      setTimeout(() => setUploadErrors([]), 5000);
      return;
    }

    // Validate all uploads succeeded
    const hasFailedItems = propertyPlans.some((plan) => plan.uploadFailed);
    if (hasFailedItems) {
      setUploadErrors(['Some files failed to upload. Please remove them and try again.']);
      setTimeout(() => setUploadErrors([]), 5000);
      return;
    }

    // Clean property plan data: remove File objects and preview URLs before sending to backend
    // Keep only the metadata (url, key, title, category, description, docType, fileName, fileSize, fileType, uploadedAt)
    const cleanedPropertyPlans = propertyPlans.map((plan) => ({
      url: plan.url,
      key: plan.key,
      title: plan.title || '',
      category: plan.category || '',
      description: plan.description || '',
      docType: plan.docType || '',
      fileName: plan.fileName,
      fileSize: plan.fileSize,
      fileType: plan.fileType,
      uploadedAt: plan.uploadedAt,
    }));

    const data = {
      propertyPlans: cleanedPropertyPlans,
    };
    saveAndContinue(data);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
    return () => setCurrentStepSubmitHandler(null);
  }, [handleContinue, setCurrentStepSubmitHandler]);

  // Pro tips for property plan upload
  const planTips = [
    'Upload clear, high-resolution floor plans for better visibility',
    'Include dimensions and labels on plans for accurate representation',
    'PDFs are preferred for technical drawings and architectural plans',
    'Add multiple views (2D, 3D) to help buyers visualize the space better',
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
          Property Plans
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Upload floor plans, layouts, and architectural drawings
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
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Upload Errors:</p>
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
            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="plan-upload" className="cursor-pointer flex-shrink-0">
                <input
                  id="plan-upload"
                  type="file"
                  accept={ACCEPTED_PLAN_TYPES.join(',')}
                  multiple
                  onChange={handlePlanUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() => document.getElementById('plan-upload').click()}
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
                      Add Property Plans
                    </>
                  )}
                </Button>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  <LayoutGrid className="w-3 h-3 mr-1" />
                  {propertyPlans.length} {propertyPlans.length === 1 ? 'plan' : 'plans'}
                </Badge>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    All property plans are optional but highly recommended
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supported: PDF, JPG, PNG, WebP (max 10MB per file)
                  </p>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            {propertyPlans.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">No property plans uploaded yet</p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Add Property Plans&quot; to start uploading
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyPlans.map((plan) => (
                  <PropertyPlanCard
                    key={plan.id}
                    plan={plan}
                    allCategories={allCategories}
                    onUpdateMetadata={updatePlanMetadata}
                    onRemove={removePlan}
                    formatFileSize={formatFileSize}
                    uploadProgress={uploadProgress[plan.id]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <ProTipV2 title="Property Plan Best Practices" tips={planTips} />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Property Plan Card Component - Displays individual plan with metadata inputs
 */
function PropertyPlanCard({ plan, allCategories, onUpdateMetadata, onRemove, formatFileSize, uploadProgress }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const isUploading = plan.uploading || false;
  
  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return allCategories;
    return allCategories.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [allCategories, categorySearch]);
  
  // Check if search text is a new category (not in list)
  const isNewCategory = categorySearch && 
    !allCategories.some(cat => cat.toLowerCase() === categorySearch.toLowerCase());
  
  // Get file icon based on type
  const isPDF = plan.fileType === 'application/pdf';
  const isImage = plan.fileType.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group border-2 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
    >
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* Preview Thumbnail */}
        <div className="relative w-full sm:w-28 h-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
          {isPDF ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50">
              <span className="text-3xl sm:text-4xl mb-1">📄</span>
              <p className="text-[10px] font-semibold text-red-700 dark:text-red-300">PDF</p>
            </div>
          ) : isImage && plan.preview ? (
            <img
              src={plan.preview}
              alt={plan.title || 'Property plan'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <LayoutGrid className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${uploadProgress || 0}%` }}
                />
              </div>
              <p className="text-white text-xs font-medium">
                {uploadProgress || 0}%
              </p>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className={cn(
            "absolute inset-0 bg-black/60 opacity-0 transition-all duration-200 flex items-center justify-center gap-1.5",
            !isUploading && "group-hover:opacity-100"
          )}>
            {isImage && plan.preview && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 w-7 sm:w-auto sm:px-2.5 p-0 sm:p-2"
                onClick={() => setShowPreview(true)}
                disabled={isUploading}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1 text-xs">View</span>
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="h-7 w-7 sm:w-auto sm:px-2.5 p-0 sm:p-2"
              onClick={() => onRemove(plan.id)}
              disabled={isUploading}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1 text-xs">Delete</span>
            </Button>
          </div>

          {/* Type Badge */}
          <div className="absolute top-1.5 left-1.5">
            <Badge 
              variant="secondary" 
              className={cn(
                "backdrop-blur-md text-white text-[10px] h-5 px-2 font-medium shadow-sm",
                isUploading ? "bg-orange-600/90" : "bg-orange-600/90"
              )}
            >
              {isUploading ? 'Uploading' : isPDF ? 'PDF' : 'Image'}
            </Badge>
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Uploading Banner */}
          {isUploading && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md px-3 py-2 mb-2">
              <p className="text-xs text-orange-700 dark:text-orange-400 font-medium flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                Uploading to cloud storage...
              </p>
            </div>
          )}
          
          {/* File Info Header */}
          <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-xs truncate text-gray-900 dark:text-gray-100">{plan.fileName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatFileSize(plan.fileSize)}
            </p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Title Input - Full Width */}
            <div className="sm:col-span-2">
              <FieldLabel className="text-[10px] mb-1 font-medium">Title</FieldLabel>
              <Input
                placeholder="e.g., Ground Floor Layout"
                value={plan.title}
                onChange={(e) => onUpdateMetadata(plan.id, 'title', e.target.value)}
                className="h-8 text-xs"
                disabled={isUploading}
              />
            </div>
            
            {/* Doc Type Dropdown */}
            <div>
              <FieldLabel className="text-[10px] mb-1 font-medium flex items-center h-[14px]">Doc Type</FieldLabel>
              <Select
                value={plan.docType}
                onValueChange={(value) => onUpdateMetadata(plan.id, 'docType', value)}
              >
                <SelectTrigger className="h-8 text-xs" disabled={isUploading}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Category Input */}
            <div>
              <FieldLabel className="text-[10px] mb-1 font-medium flex items-center gap-1 h-[14px]">
                <Tags className="w-2.5 h-2.5" />
                Category
              </FieldLabel>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className={cn(
                      "w-full justify-between h-8 text-xs font-normal",
                      !plan.category && "text-muted-foreground"
                    )}
                    disabled={isUploading}
                  >
                    <span className="truncate">{plan.category || "Select..."}</span>
                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search or type new category..."
                  value={categorySearch}
                  onValueChange={setCategorySearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {isNewCategory ? (
                      <div className="py-2 px-2 text-sm">
                        <p className="text-muted-foreground mb-2">
                          Category not found. Press Enter to add:
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-orange-600 border-orange-500"
                          onClick={() => {
                            onUpdateMetadata(plan.id, 'category', categorySearch);
                            setCategoryOpen(false);
                            setCategorySearch('');
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add &quot;{categorySearch}&quot;
                        </Button>
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
                          onUpdateMetadata(plan.id, 'category', category);
                          setCategoryOpen(false);
                          setCategorySearch('');
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3",
                            plan.category === category ? "opacity-100" : "opacity-0"
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
            
            {/* Description Input - Full Width */}
            <div className="sm:col-span-2">
              <FieldLabel className="text-[10px] mb-1 font-medium">Description (Optional)</FieldLabel>
              <Textarea
                placeholder="Add details about this plan..."
                value={plan.description}
                onChange={(e) => onUpdateMetadata(plan.id, 'description', e.target.value)}
                className="text-xs min-h-[52px] resize-none"
                rows={2}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal for Images */}
      {showPreview && isImage && plan.preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img src={plan.preview} alt={plan.title} className="w-full h-full object-contain rounded-lg" />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setShowPreview(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}


