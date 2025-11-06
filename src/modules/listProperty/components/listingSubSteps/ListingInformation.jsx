import { FileText, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useListPropertyStore from '../../store/useListPropertyStore';

export default function ListingInformation() {
  const { formData, updateFormData } = useListPropertyStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <FileText className="w-5 h-5" />
        Listing Information
      </h3>
      
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          Listing Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className="h-9 text-sm"
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">
          {formData.title?.length || 0}/100 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm">
          Property Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail. Include unique features, nearby landmarks, connectivity, etc."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="min-h-[100px] text-sm"
          maxLength={1000}
          required
        />
        <p className="text-xs text-muted-foreground">
          {formData.description?.length || 0}/1000 characters
        </p>
      </div>
    </div>
  );
}
