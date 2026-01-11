import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { 
  Eye, EyeOff, Trash2, Archive, Bell, 
  Settings as SettingsIcon, Save, TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';
import { draftApi } from '@/services/draftService';

export default function ProjectSettings({ draftId, project, onUpdate }) {
  const [settings, setSettings] = useState({
    enableLeads: true,
    emailNotifications: true,
    smsNotifications: false,
    showPhoneNumber: true,
    allowSiteVisits: true,
    featuredListing: false,
  });
  const [loading, setLoading] = useState(false);

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await settingsApi.updateProjectSettings(draftId, settings);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      setLoading(true);
      const newStatus = project.draftStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      
      // TODO: Replace with actual API call
      // await draftApi.updateDraftStatus(draftId, newStatus);
      
      toast.success(
        newStatus === 'PUBLISHED' 
          ? 'Project is now visible to public' 
          : 'Project is now hidden from public'
      );
      onUpdate();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await draftApi.archiveDraft(draftId);
      
      toast.success('Project archived successfully');
      onUpdate();
    } catch (error) {
      console.error('Error archiving:', error);
      toast.error('Failed to archive project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await draftApi.deleteDraft(draftId);
      
      toast.success('Project deleted successfully');
      // Navigate back to list page
      window.location.href = '/list-project';
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const isPublished = project.draftStatus === 'PUBLISHED';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your project listing settings
        </p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Lead Management
          </CardTitle>
          <CardDescription>
            Configure how you want to handle leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableLeads">Accept Leads</Label>
              <p className="text-sm text-gray-500">
                Allow potential buyers to contact you
              </p>
            </div>
            <Switch
              id="enableLeads"
              checked={settings.enableLeads}
              onCheckedChange={() => handleToggleSetting('enableLeads')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowSiteVisits">Allow Site Visits</Label>
              <p className="text-sm text-gray-500">
                Enable site visit scheduling
              </p>
            </div>
            <Switch
              id="allowSiteVisits"
              checked={settings.allowSiteVisits}
              onCheckedChange={() => handleToggleSetting('allowSiteVisits')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive email alerts for new leads
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggleSetting('emailNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive SMS alerts for new leads
              </p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggleSetting('smsNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showPhoneNumber">Show Phone Number</Label>
              <p className="text-sm text-gray-500">
                Display your phone number publicly
              </p>
            </div>
            <Switch
              id="showPhoneNumber"
              checked={settings.showPhoneNumber}
              onCheckedChange={() => handleToggleSetting('showPhoneNumber')}
            />
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={loading}
            className="w-full sm:w-auto gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPublished ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your project listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                {isPublished ? 'Listing is Public' : 'Listing is Private'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {isPublished 
                  ? 'Your project is visible to everyone' 
                  : 'Your project is only visible to you'}
              </p>
            </div>
            <Button 
              onClick={handleToggleVisibility}
              disabled={loading}
              variant={isPublished ? 'outline' : 'default'}
              className="gap-2"
            >
              {isPublished ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Make Private
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Make Public
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="featuredListing" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Featured Listing
              </Label>
              <p className="text-sm text-gray-500">
                Boost visibility with premium placement (Paid feature)
              </p>
            </div>
            <Switch
              id="featuredListing"
              checked={settings.featuredListing}
              onCheckedChange={() => handleToggleSetting('featuredListing')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your project listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Archive className="h-4 w-4" />
                Archive Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will hide your project from the public. You can restore it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>
                  Archive
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  project listing and all associated data including leads and analytics.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
