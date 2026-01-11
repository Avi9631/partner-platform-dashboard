import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Copy,
  ExternalLink,
  Share2,
  Bell,
  Globe,
  Check,
  AlertTriangle,
  Sparkles,
  Link2,
  BellRing,
  Shield,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { propertyApi } from '@/services/propertyService';
import { draftApi } from '@/services/draftService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

export default function PropertySettings({ draftId, property, onUpdate }) {
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(property?.draftStatus?.toLowerCase() === 'published');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [showOnMap, setShowOnMap] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const propertyUrl = `${window.location.origin}/property/${draftId}`;

  const handleTogglePublish = async () => {
    try {
      setPublishing(true);
      const newStatus = isPublished ? 'DRAFT' : 'PUBLISHED';
      const response = await draftApi.updateListingDraft(draftId, { draftStatus: newStatus });
      
      if (response.success) {
        setIsPublished(!isPublished);
        toast.success(`Property ${isPublished ? 'unpublished' : 'published'} successfully`);
        onUpdate();
      } else {
        toast.error('Failed to update property status');
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Error updating property status');
    } finally {
      setPublishing(false);
    }
  };
const handleArchive = async () => {
    try {
      setArchiving(true);
      const response = await draftApi.updateListingDraft(draftId, { draftStatus: 'ARCHIVED' });
      
      if (response.success) {
        toast.success('Property archived successfully');
        navigate('/list-property');
      } else {
        toast.error('Failed to archive property');
      }
    } catch (error) {
      console.error('Error archiving property:', error);
      toast.error('Error archiving property');
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await draftApi.deleteListingDraft(draftId);
      
      if (response.success) {
        toast.success('Property deleted successfully');
        navigate('/list-property');
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    } finally {
      setDeleting(false);
    }
  };
const copyPropertyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    toast.success('Property link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.draftData?.title || 'Property Listing',
          text: 'Check out this property',
          url: propertyUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share property');
        }
      }
    } else {
      copyPropertyLink();
    }
  };
return (
    <div className="space-y-6 pb-8">
      {/* Enhanced Header with Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Property Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage visibility, notifications, and other property settings
                </p>
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isPublished ? 'published' : 'draft'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {isPublished ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 text-sm px-3 py-1.5 gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Live
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700 text-sm px-3 py-1.5 gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Draft
                </Badge>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Enhanced Visibility Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-orange-100 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/50">
                  <Globe className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                Visibility Settings
              </CardTitle>
              <CardDescription>
                Control how your property appears to potential customers
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="space-y-6 pt-6">
            {/* Enhanced Published Status */}
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">Property Status</Label>
                    {isPublished && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="font-medium">Active</span>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isPublished 
                      ? '🎉 Your property is live and visible to everyone'
                      : '📝 Your property is in draft mode and not visible to others'
                    }
                  </p>
                  {isPublished && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-md border border-green-200 dark:border-green-800"
                    >
                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span>Discoverable by all users on the platform</span>
                    </motion.div>
                  )}
                </div>
                <Button
                  onClick={handleTogglePublish}
                  disabled={publishing}
                  size="lg"
                  variant={isPublished ? 'outline' : 'default'}
                  className={`gap-2 min-w-[140px] ${
                    isPublished 
                      ? 'border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20 dark:hover:text-red-400' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30'
                  }`}
                >
                  {publishing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="w-4 h-4" />
                      </motion.div>
                      {isPublished ? 'Unpublishing...' : 'Publishing...'}
                    </>
                  ) : isPublished ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Publish Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">Show on Map</Label>
                    {showOnMap && (
                      <Badge variant="outline" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Display this property on map-based search results
                  </p>
                </div>
                <Switch 
                  checked={showOnMap} 
                  onCheckedChange={setShowOnMap}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-blue-100 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <BellRing className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Notification Settings
              </CardTitle>
              <CardDescription>
                Stay updated on new leads and property activity
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border border-blue-100 dark:border-blue-900">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Email Notifications</Label>
                  {emailNotifications && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📧 Receive email alerts for new leads and inquiries
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
 
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Share & Copy Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-900 transition-colors">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-purple-100 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50">
                  <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                Share Property
              </CardTitle>
              <CardDescription>
                Share your property listing with potential buyers
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="space-y-4 pt-6">
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={propertyUrl}
                    readOnly
                    className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono focus:outline-none focus:border-purple-400 dark:focus:border-purple-600 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Link2 className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <Button 
                  onClick={copyPropertyLink} 
                  variant="outline" 
                  size="lg"
                  className="gap-2 min-w-[100px] border-2 hover:border-purple-400 dark:hover:border-purple-600"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="checked"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                <Button 
                  onClick={shareProperty} 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview your listing
                </span>
              </div>
              <a
                href={propertyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                Open in new tab →
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-2 border-red-200 dark:border-red-900 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-b-2 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/50">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription>
                ⚠️ Irreversible actions that permanently affect this property
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="space-y-4 pt-6">
            {/* Archive Property */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-5 border-2 border-yellow-200 dark:border-yellow-900 rounded-xl bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/20 dark:to-transparent hover:border-yellow-300 dark:hover:border-yellow-800 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 mt-1">
                  <Archive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Archive Property
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">
                      Reversible
                    </Badge>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Hide this property from all listings. You can restore it later from your archived properties.
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="lg"
                    disabled={archiving}
                    className="gap-2 border-2 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/20 min-w-[120px]"
                  >
                    {archiving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Settings className="w-4 h-4" />
                        </motion.div>
                        Archiving...
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Archive
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-yellow-600" />
                      Archive Property?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      This property will be hidden from all listings. You can restore it later from your archived properties.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleArchive}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Archive Property
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>

            {/* Delete Property */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-5 border-2 border-red-300 dark:border-red-800 rounded-xl bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/30 dark:to-transparent hover:border-red-400 dark:hover:border-red-700 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 mt-1">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                    Delete Property
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                      Permanent
                    </Badge>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Permanently delete this property. This action cannot be undone and will remove all associated data.
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="lg"
                    className="gap-2 shadow-lg shadow-red-500/30 min-w-[120px]" 
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Settings className="w-4 h-4" />
                        </motion.div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      Delete Property Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base space-y-2">
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        ⚠️ This action cannot be undone!
                      </p>
                      <p>
                        This will permanently delete the property listing and all associated data including:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                        <li>Property details and images</li>
                        <li>Analytics and view history</li>
                        <li>All leads and inquiries</li>
                        <li>Saved preferences</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
