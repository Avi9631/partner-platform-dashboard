import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import listingInformationSchema from '../schemas/listingInformationSchema';

const suggestedTags = [
  'Corner Unit',
  'Park Facing',
  'Road Facing',
  'Premium Location',
  'Newly Renovated',
  'Ready to Move',
  'Vastu Compliant',
  'Corner Plot',
  'Main Road',
  'Gated Community',
];

export default function ListingInformation() {
  const mainForm = useFormContext();
  const { updateStepValidation, currentStep } = usePropertyForm();

  const [tags, setTags] = useState(mainForm.watch('tags') || []);
  const [tagInput, setTagInput] = useState('');

  // Initialize React Hook Form with Zod validation
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(listingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      title: mainForm.watch('title') || '',
      description: mainForm.watch('description') || '',
    },
  });

  // Update form with tags
  useEffect(() => {
    mainForm.setValue('tags', tags);
  }, [tags, mainForm]);

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(currentStep, isValid);
  }, [isValid, currentStep, updateStepValidation]);

  // Sync form data with main form on field changes
  useEffect(() => {
    const subscription = watch((value) => {
      Object.keys(value).forEach((key) => {
        mainForm.setValue(key, value[key]);
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, mainForm]);

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

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
          {...register('title')}
          className={`h-9 text-sm ${errors.title ? 'border-red-500' : ''}`}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
        {!errors.title && (
          <p className="text-xs text-muted-foreground">
            {watch('title')?.length || 0}/100 characters
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm">
          Property Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail. Include unique features, nearby landmarks, connectivity, etc."
          {...register('description')}
          className={`min-h-[100px] text-sm ${errors.description ? 'border-red-500' : ''}`}
          maxLength={1000}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
        {!errors.description && (
          <p className="text-xs text-muted-foreground">
            {watch('description')?.length || 0}/1000 characters
          </p>
        )}
      </div>
    </div>
  );
}
