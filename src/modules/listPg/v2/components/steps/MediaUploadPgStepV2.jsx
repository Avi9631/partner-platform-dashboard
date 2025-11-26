import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload,
  Image as ImageIcon,
  Video,
  Eye,
  Trash2,
  Edit2,
  Play,
  Plus,
  Minus,
  RotateCcw,
  Check,
  AlertCircle,
  Info,
  Camera,
  Film,
  Globe,
  Settings,
  Folder,
  Grid,
  List,
  Search,
  Filter,
  Star,
  Download,
  Share2,
  Maximize2,
  ZoomIn,
  Tag,
  Clock,
  FileText,
  Palette
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import mediaUploadPgSchema, { 
  MEDIA_CATEGORIES, 
  VIDEO_TYPES, 
  VIRTUAL_TOUR_PLATFORMS,
  imageSchema,
  videoSchema,
  virtualTourSchema
} from '../../../schemas/mediaUploadPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

export default function MediaUploadPgStepV2() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [activeTab, setActiveTab] = useState('images');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const logger = useMemo(() => createStepLogger('Media Upload PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(mediaUploadPgSchema),
    mode: 'onChange',
    defaultValues: {
      media: {
        images: formData?.media?.images || [],
        videos: formData?.media?.videos || [],
        virtualTours: formData?.media?.virtualTours || [],
        galleries: formData?.media?.galleries || [],
        coverImage: formData?.media?.coverImage || undefined,
        statistics: formData?.media?.statistics || {
          totalImages: 0,
          totalVideos: 0,
          totalVirtualTours: 0,
          storageUsed: 0,
        },
      },
      uploadSettings: formData?.uploadSettings || {
        allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
        allowedVideoFormats: ['mp4', 'mov', 'avi', 'webm'],
        maxImageSize: 10485760,
        maxVideoSize: 104857600,
        compressionEnabled: true,
        watermarkEnabled: false,
        autoGenerateThumbnails: true,
      },
      displayPreferences: formData?.displayPreferences || {
        showImageCaptions: true,
        enableImageZoom: true,
        enableSlideshow: true,
        slideshowSpeed: 4000,
        enableLightbox: true,
        showMediaCount: true,
      },
      seoSettings: formData?.seoSettings || {
        generateAltText: true,
        optimizeForWeb: true,
        lazyLoading: true,
        generateSitemap: false,
      },
      // Legacy fields
      propertyImages: formData?.propertyImages || [],
      roomImages: formData?.roomImages || [],
      washroomImages: formData?.washroomImages || [],
      amenitiesImages: formData?.amenitiesImages || [],
      virtualTourUrl: formData?.virtualTourUrl || '',
      videos: formData?.videos || [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage, update: updateImage } = useFieldArray({
    control: form.control,
    name: 'media.images',
  });

  const { fields: videoFields, append: appendVideo, remove: removeVideo, update: updateVideo } = useFieldArray({
    control: form.control,
    name: 'media.videos',
  });

  const { fields: virtualTourFields, append: appendVirtualTour, remove: removeVirtualTour } = useFieldArray({
    control: form.control,
    name: 'media.virtualTours',
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Update statistics when media changes
  useEffect(() => {
    const images = form.watch('media.images') || [];
    const videos = form.watch('media.videos') || [];
    const virtualTours = form.watch('media.virtualTours') || [];
    
    form.setValue('media.statistics', {
      totalImages: images.length,
      totalVideos: videos.length,
      totalVirtualTours: virtualTours.length,
      storageUsed: images.reduce((acc, img) => acc + (img.fileSize || 0), 0) + 
                  videos.reduce((acc, vid) => acc + (vid.fileSize || 0), 0),
      lastUpdated: new Date().toISOString(),
    });
  }, [form.watch('media.images'), form.watch('media.videos'), form.watch('media.virtualTours'), form]);

  // Filter images by category
  const filteredImages = useMemo(() => {
    const images = form.watch('media.images') || [];
    if (selectedCategory === 'all') return images;
    return images.filter(img => img.category === selectedCategory);
  }, [form.watch('media.images'), selectedCategory]);

  // Load sample media data
  const loadSampleMedia = () => {
    const sampleImages = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        category: 'exterior',
        caption: 'Main entrance and building exterior',
        altText: 'Modern PG building exterior with landscaped entrance',
        tags: ['exterior', 'entrance', 'building'],
        isPrimary: true,
        isPublic: true,
        sortOrder: 1,
        fileSize: 524288,
        dimensions: { width: 800, height: 600 },
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        category: 'rooms',
        subcategory: 'single_room',
        caption: 'Spacious single occupancy room with modern furnishing',
        altText: 'Clean single room with bed, desk and wardrobe',
        tags: ['room', 'single', 'furnished'],
        isPublic: true,
        sortOrder: 2,
        fileSize: 445633,
        dimensions: { width: 800, height: 600 },
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&h=600&fit=crop',
        category: 'common_areas',
        caption: 'Modern common area with comfortable seating',
        altText: 'Bright common room with sofas and recreational facilities',
        tags: ['common area', 'lounge', 'recreation'],
        isPublic: true,
        sortOrder: 3,
        fileSize: 678954,
        dimensions: { width: 800, height: 600 },
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        category: 'kitchen_dining',
        caption: 'Hygienic kitchen and dining facility',
        altText: 'Clean modular kitchen with dining area',
        tags: ['kitchen', 'dining', 'food'],
        isPublic: true,
        sortOrder: 4,
        fileSize: 512000,
        dimensions: { width: 800, height: 600 },
      },
    ];

    const sampleVideos = [
      {
        id: '1',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: 'property_tour',
        platform: 'youtube',
        title: 'Complete Property Walkthrough',
        description: 'Take a virtual tour of our premium PG facilities',
        duration: 180,
        isPublic: true,
        sortOrder: 1,
      },
    ];

    const sampleVirtualTours = [
      {
        id: '1',
        url: 'https://my.matterport.com/show/?m=sample123',
        platform: 'matterport',
        title: '360° Virtual Property Tour',
        description: 'Interactive 3D tour of the entire property',
        isActive: true,
        accessType: 'public',
      },
    ];

    form.setValue('media.images', sampleImages);
    form.setValue('media.videos', sampleVideos);
    form.setValue('media.virtualTours', sampleVirtualTours);
    
    // Set cover image
    form.setValue('media.coverImage', {
      url: sampleImages[0].url,
      caption: sampleImages[0].caption,
      position: 'center',
    });
  };

  // Add new image
  const addImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: '',
      category: 'exterior',
      caption: '',
      altText: '',
      tags: [],
      isPrimary: false,
      isPublic: true,
      sortOrder: imageFields.length + 1,
    };
    appendImage(newImage);
    setEditingItem({ type: 'image', index: imageFields.length, item: newImage });
    setShowEditDialog(true);
  };

  // Add new video
  const addVideo = () => {
    const newVideo = {
      id: Date.now().toString(),
      url: '',
      type: 'property_tour',
      platform: 'youtube',
      title: '',
      description: '',
      isPublic: true,
      sortOrder: videoFields.length + 1,
    };
    appendVideo(newVideo);
    setEditingItem({ type: 'video', index: videoFields.length, item: newVideo });
    setShowEditDialog(true);
  };

  // Add new virtual tour
  const addVirtualTour = () => {
    const newTour = {
      id: Date.now().toString(),
      url: '',
      platform: 'custom',
      title: '',
      description: '',
      isActive: true,
      accessType: 'public',
    };
    appendVirtualTour(newTour);
    setEditingItem({ type: 'virtualTour', index: virtualTourFields.length, item: newTour });
    setShowEditDialog(true);
  };

  // Edit media item
  const editItem = (type, index, item) => {
    setEditingItem({ type, index, item });
    setShowEditDialog(true);
  };

  // Save edited item
  const saveEditedItem = (updatedItem) => {
    if (editingItem?.type === 'image') {
      updateImage(editingItem.index, updatedItem);
    } else if (editingItem?.type === 'video') {
      updateVideo(editingItem.index, updatedItem);
    } else if (editingItem?.type === 'virtualTour') {
      // Virtual tours don't have an update function, so we handle it differently
      const currentTours = form.getValues('media.virtualTours');
      currentTours[editingItem.index] = updatedItem;
      form.setValue('media.virtualTours', currentTours);
    }
    setShowEditDialog(false);
    setEditingItem(null);
  };

  // Set as primary image
  const setPrimaryImage = (index) => {
    const images = form.getValues('media.images');
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    form.setValue('media.images', updatedImages);
    
    // Update cover image
    if (images[index]) {
      form.setValue('media.coverImage', {
        url: images[index].url,
        caption: images[index].caption,
        position: 'center',
      });
    }
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  const getMediaStats = () => {
    const stats = form.watch('media.statistics') || {};
    return {
      totalImages: stats.totalImages || 0,
      totalVideos: stats.totalVideos || 0,
      totalVirtualTours: stats.totalVirtualTours || 0,
      storageUsed: stats.storageUsed || 0,
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = getMediaStats();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Media Upload & Management
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload high-quality images, videos, and virtual tours to showcase your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Media Statistics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-600" />
                  Media Overview
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadSampleMedia}
                >
                  Load Sample Media
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.totalImages}</div>
                  <div className="text-sm text-muted-foreground">Images</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.totalVideos}</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{stats.totalVirtualTours}</div>
                  <div className="text-sm text-muted-foreground">Virtual Tours</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{formatFileSize(stats.storageUsed)}</div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Management Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-orange-600" />
                Media Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="images">Images ({stats.totalImages})</TabsTrigger>
                  <TabsTrigger value="videos">Videos ({stats.totalVideos})</TabsTrigger>
                  <TabsTrigger value="tours">Virtual Tours ({stats.totalVirtualTours})</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="space-y-6">
                  {/* Image Management Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {MEDIA_CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addImage}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                  </div>

                  {/* Images Grid/List */}
                  {filteredImages.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No images uploaded yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by uploading high-quality images of your property
                      </p>
                      <Button onClick={addImage} className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload First Image
                      </Button>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                      {filteredImages.map((image, index) => (
                        <div key={image.id || index} className={viewMode === 'grid' ? 'group relative' : 'flex items-center gap-4 p-4 border rounded-lg'}>
                          {viewMode === 'grid' ? (
                            <>
                              <div className="aspect-video relative overflow-hidden rounded-lg border">
                                <img
                                  src={image.url}
                                  alt={image.altText || image.caption}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {image.isPrimary && (
                                  <Badge className="absolute top-2 left-2 bg-orange-500">
                                    <Star className="w-3 h-3 mr-1" />
                                    Primary
                                  </Badge>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => editItem('image', index, image)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  {!image.isPrimary && (
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => setPrimaryImage(index)}
                                      title="Set as primary image"
                                    >
                                      <Star className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {MEDIA_CATEGORIES.find(cat => cat.id === image.category)?.label}
                                </Badge>
                                {image.caption && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {image.caption}
                                  </p>
                                )}
                                {image.fileSize && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatFileSize(image.fileSize)}
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-20 h-20 relative overflow-hidden rounded-lg border shrink-0">
                                <img
                                  src={image.url}
                                  alt={image.altText || image.caption}
                                  className="w-full h-full object-cover"
                                />
                                {image.isPrimary && (
                                  <Badge className="absolute top-0 left-0 bg-orange-500 text-xs">
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {MEDIA_CATEGORIES.find(cat => cat.id === image.category)?.label}
                                  </Badge>
                                  {image.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <h4 className="font-medium truncate">{image.caption || 'Untitled Image'}</h4>
                                <p className="text-sm text-muted-foreground truncate">{image.altText}</p>
                                {image.fileSize && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(image.fileSize)} • {image.dimensions?.width}×{image.dimensions?.height}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editItem('image', index, image)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                {!image.isPrimary && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPrimaryImage(index)}
                                    title="Set as primary image"
                                  >
                                    <Star className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="space-y-6">
                  {/* Video Management Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Property Videos</h3>
                    <Button
                      type="button"
                      onClick={addVideo}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>

                  {/* Videos List */}
                  {videoFields.length === 0 ? (
                    <div className="text-center py-12">
                      <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No videos uploaded yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add engaging videos to showcase your property features
                      </p>
                      <Button onClick={addVideo} className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload First Video
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {videoFields.map((video, index) => (
                        <Card key={video.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center shrink-0">
                              {video.thumbnail ? (
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Play className="w-8 h-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {VIDEO_TYPES.find(type => type.id === video.type)?.label}
                                </Badge>
                                <Badge variant="secondary">{video.platform}</Badge>
                              </div>
                              <h4 className="font-medium truncate">{video.title || 'Untitled Video'}</h4>
                              <p className="text-sm text-muted-foreground truncate">{video.description}</p>
                              {video.duration && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => editItem('video', index, video)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeVideo(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tours" className="space-y-6">
                  {/* Virtual Tours Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Virtual Tours</h3>
                    <Button
                      type="button"
                      onClick={addVirtualTour}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Virtual Tour
                    </Button>
                  </div>

                  {/* Virtual Tours List */}
                  {virtualTourFields.length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No virtual tours added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create immersive virtual tours for better property showcase
                      </p>
                      <Button onClick={addVirtualTour} className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Tour
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {virtualTourFields.map((tour, index) => (
                        <Card key={tour.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg flex items-center justify-center shrink-0">
                              <Globe className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {VIRTUAL_TOUR_PLATFORMS.find(platform => platform.id === tour.platform)?.label}
                                </Badge>
                                <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                                  {tour.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <h4 className="font-medium truncate">{tour.title || 'Untitled Tour'}</h4>
                              <p className="text-sm text-muted-foreground truncate">{tour.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Access: {tour.accessType}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(tour.url, '_blank')}
                                disabled={!tour.url}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => editItem('virtualTour', index, tour)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeVirtualTour(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  {/* Upload Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-orange-600" />
                        Upload Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="uploadSettings.maxImageSize"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Maximum Image Size (MB)</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                max="50"
                                onChange={(e) => field.onChange(parseInt(e.target.value) * 1048576)}
                                value={Math.round(field.value / 1048576)}
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name="uploadSettings.maxVideoSize"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Maximum Video Size (MB)</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                min="10"
                                max="500"
                                onChange={(e) => field.onChange(parseInt(e.target.value) * 1048576)}
                                value={Math.round(field.value / 1048576)}
                              />
                            </Field>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <Controller
                          name="uploadSettings.compressionEnabled"
                          control={form.control}
                          render={({ field }) => (
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <Label className="text-base font-medium">
                                  Enable Image Compression
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically compress images to reduce file size
                                </p>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />

                        <Controller
                          name="uploadSettings.autoGenerateThumbnails"
                          control={form.control}
                          render={({ field }) => (
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <Label className="text-base font-medium">
                                  Auto-Generate Thumbnails
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically create thumbnails for videos
                                </p>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Display Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-orange-600" />
                        Display Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Controller
                        name="displayPreferences.enableSlideshow"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-base font-medium">
                                Enable Image Slideshow
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically cycle through property images
                              </p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <Controller
                        name="displayPreferences.enableLightbox"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-base font-medium">
                                Enable Lightbox View
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Allow full-screen image viewing
                              </p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <AnimatePresence>
                        {form.watch('displayPreferences.enableSlideshow') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Controller
                              name="displayPreferences.slideshowSpeed"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Slideshow Speed (milliseconds)</FieldLabel>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="1000"
                                    max="10000"
                                    step="500"
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </Field>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Media Best Practices
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Upload high-quality images in good lighting conditions</li>
                    <li>• Include photos of all room types, common areas, and amenities</li>
                    <li>• Add descriptive captions and alt text for better accessibility</li>
                    <li>• Use videos to showcase the property walkthrough</li>
                    <li>• Virtual tours provide immersive viewing experiences</li>
                    <li>• Set a compelling primary image as your property cover</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Edit {editingItem?.type === 'image' ? 'Image' : editingItem?.type === 'video' ? 'Video' : 'Virtual Tour'}
                </DialogTitle>
              </DialogHeader>
              {editingItem && (
                <EditMediaForm
                  type={editingItem.type}
                  item={editingItem.item}
                  onSave={saveEditedItem}
                  onCancel={() => setShowEditDialog(false)}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onSaveAndContinue={form.handleSubmit(onSubmit)}
            onBack={previousStep}
            nextDisabled={!form.formState.isValid || stats.totalImages < 3}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}

// Edit Media Form Component
function EditMediaForm({ type, item, onSave, onCancel }) {
  const [formData, setFormData] = useState(item);

  const handleSave = () => {
    onSave(formData);
  };

  if (type === 'image') {
    return (
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Caption</Label>
          <Input
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="Describe this image..."
          />
        </div>
        <div>
          <Label>Alt Text (for accessibility)</Label>
          <Input
            value={formData.altText}
            onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
            placeholder="Alternative text for screen readers..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
          />
          <Label>Make this image public</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">Save</Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="space-y-4">
        <div>
          <Label>Video URL</Label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div>
          <Label>Video Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Video title..."
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Video description..."
            rows={3}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
          />
          <Label>Make this video public</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">Save</Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </div>
    );
  }

  if (type === 'virtualTour') {
    return (
      <div className="space-y-4">
        <div>
          <Label>Virtual Tour URL</Label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://my.matterport.com/show/?m=..."
          />
        </div>
        <div>
          <Label>Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) => setFormData({ ...formData, platform: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIRTUAL_TOUR_PLATFORMS.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Tour title..."
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tour description..."
            rows={3}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label>Active tour</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">Save</Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </div>
    );
  }

  return null;
}