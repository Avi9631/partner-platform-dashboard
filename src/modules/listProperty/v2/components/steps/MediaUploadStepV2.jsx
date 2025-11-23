import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
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
  Tags
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldLabel,
} from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
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
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import ProTipV2 from '../shared/ProTipV2';

// Maximum file sizes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Accepted file types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Default category suggestions
const DEFAULT_CATEGORIES = [
  'Exterior View',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Balcony',
  'Parking',
  'Common Area',
  'Amenities',
  'Garden',
  'Virtual Tour',
  'Location',
  'Floor Plan',
  'Other',
];

export default function MediaUploadStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Unified media list (both images and videos)
  const [mediaList, setMediaList] = useState(formData?.mediaList || []);
  const [uploadErrors, setUploadErrors] = useState([]);
  
  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    // Extract unique categories from existing media
    const existingCategories = (formData?.mediaList || [])
      .map(item => item.category)
      .filter(Boolean);
    const uniqueExisting = [...new Set(existingCategories)];
    
    // Combine with defaults, removing duplicates
    const combined = [...DEFAULT_CATEGORIES, ...uniqueExisting];
    return [...new Set(combined)];
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      mediaList: formData?.mediaList || [],
    },
  });

  const { setValue } = methods;

  // Count images and videos
  const imageCount = mediaList.filter(m => m.type === 'image').length;
  const videoCount = mediaList.filter(m => m.type === 'video').length;

  // Validation: At least one image is required
  const isValid = imageCount > 0;

  // Handle unified media upload (images and videos)
  const handleMediaUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const newErrors = [];
    const validMedia = [];

    files.forEach((file) => {
      // Determine if it's an image or video
      const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

      // Validate file type
      if (!isImage && !isVideo) {
        newErrors.push(`${file.name}: Invalid file type. Only images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV) are allowed.`);
        return;
      }

      // Validate file size
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      const maxSizeText = isImage ? '5MB' : '50MB';
      
      if (file.size > maxSize) {
        newErrors.push(`${file.name}: File too large. Maximum size is ${maxSizeText}.`);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      validMedia.push({
        id: `media-${Date.now()}-${Math.random()}`,
        file,
        preview: previewUrl,
        title: '',
        category: '',
        description: '',
        type: isImage ? 'image' : 'video',
      });
    });

    if (newErrors.length > 0) {
      setUploadErrors(newErrors);
      setTimeout(() => setUploadErrors([]), 5000);
    }

    if (validMedia.length > 0) {
      const updatedMedia = [...mediaList, ...validMedia];
      setMediaList(updatedMedia);
      setValue('mediaList', updatedMedia, { shouldValidate: true });
    }

    // Reset input
    e.target.value = '';
  }, [mediaList, setValue]);

  // Update media metadata
  const updateMediaMetadata = useCallback((id, field, value) => {
    const updated = mediaList.map(media => 
      media.id === id ? { ...media, [field]: value } : media
    );
    setMediaList(updated);
    setValue('mediaList', updated, { shouldValidate: true });
    
    // If category field is updated and it's a new category, add it to the list
    if (field === 'category' && value && !allCategories.includes(value)) {
      setAllCategories(prev => [...prev, value]);
    }
  }, [mediaList, setValue, allCategories]);

  // Remove media
  const removeMedia = useCallback((id) => {
    const updated = mediaList.filter(media => media.id !== id);
    setMediaList(updated);
    setValue('mediaList', updated, { shouldValidate: true });
    
    // Revoke object URL to prevent memory leak
    const removed = mediaList.find(media => media.id === id);
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
  }, [mediaList, setValue]);

  // Handle form submission
  const handleContinue = () => {
    const data = {
      mediaList,
    };
    saveAndContinue(data);
  };

  // Pro tips for media upload
  const mediaTips = [
    'Upload high-quality images with good lighting for better visibility',
    'Include photos of all rooms, amenities, and exterior views',
    'Videos should be short (30-60 seconds) and showcase key features',
    'Add descriptive titles to help buyers understand each image/video',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Property Media
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Add photos and videos to showcase your property
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

          {/* Unified Upload Section */}
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="media-upload" className="cursor-pointer flex-shrink-0">
                <input
                  id="media-upload"
                  type="file"
                  accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')}
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() => document.getElementById('media-upload').click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images or Videos
                </Button>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <FileImage className="w-3 h-3 mr-1" />
                  {imageCount} {imageCount === 1 ? 'image' : 'images'}
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <FileVideo className="w-3 h-3 mr-1" />
                  {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                </Badge>
                <Badge variant="secondary">
                  Total: {mediaList.length}
                </Badge>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    At least one image is required <span className="text-red-500">*</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Images: JPEG, PNG, WebP (max 5MB) • Videos: MP4, WebM, MOV (max 50MB)
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
                <p className="text-sm text-muted-foreground mb-2">No media uploaded yet</p>
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
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <ProTipV2 title="Media Best Practices" tips={mediaTips} />
        </div>
      </motion.div>

      <SaveAndContinueFooter
        onBack={previousStep}
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
function MediaCard({ media, allCategories, onUpdateMetadata, onRemove }) {
  const [showPreview, setShowPreview] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const isVideo = media.type === 'video';
  
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

  // Get border color based on media type
  const borderColor = isVideo 
    ? 'hover:border-purple-500' 
    : 'hover:border-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn("border-2 rounded-lg overflow-hidden transition-all", borderColor)}
    >
      {/* Preview */}
      <div className="relative aspect-video bg-muted">
        {isVideo ? (
          <video
            src={media.preview}
            className="w-full h-full object-cover"
            controls={false}
          />
        ) : (
          <img
            src={media.preview}
            alt={media.title || 'Property media'}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => onRemove(media.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant="secondary" 
            className={cn(
              "backdrop-blur-sm text-white",
              isVideo ? "bg-purple-600/90" : "bg-blue-600/90"
            )}
          >
            {isVideo ? <Video className="w-3 h-3 mr-1" /> : <Image className="w-3 h-3 mr-1" />}
            {isVideo ? 'Video' : 'Image'}
          </Badge>
        </div>
      </div>

      {/* Metadata Inputs */}
      <div className="p-3 space-y-3">
        <div>
          <FieldLabel className="text-xs">Title</FieldLabel>
          <Input
            placeholder="e.g., Living Room View"
            value={media.title}
            onChange={(e) => onUpdateMetadata(media.id, 'title', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        
        <div>
          <FieldLabel className="text-xs flex items-center gap-1">
            <Tags className="w-3 h-3" />
            Category
          </FieldLabel>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className={cn(
                  "w-full justify-between h-8 text-sm font-normal",
                  !media.category && "text-muted-foreground"
                )}
              >
                {media.category || "Select or add category..."}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
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
                            onUpdateMetadata(media.id, 'category', categorySearch);
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
                          onUpdateMetadata(media.id, 'category', category);
                          setCategoryOpen(false);
                          setCategorySearch('');
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3",
                            media.category === category ? "opacity-100" : "opacity-0"
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
        
        <div>
          <FieldLabel className="text-xs">Description</FieldLabel>
          <Textarea
            placeholder="Add a brief description..."
            value={media.description}
            onChange={(e) => onUpdateMetadata(media.id, 'description', e.target.value)}
            className="text-sm min-h-[60px]"
            rows={2}
          />
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {isVideo ? (
              <video src={media.preview} controls className="w-full h-full rounded-lg" />
            ) : (
              <img src={media.preview} alt={media.title} className="w-full h-full object-contain rounded-lg" />
            )}
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
