import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { User, MapPin, Globe, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { contactInfoSchema } from '../../../schemas/contactInfoSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function ContactInfoStepV2() {
  const { formData, saveAndContinue, previousStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState(formData?.socialLinks || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: formData || {},
  });

  useEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
      if (formData.socialLinks) {
        setSocialLinks(formData.socialLinks);
      }
    }
  }, [formData, setValue]);

  const addSocialLink = () => {
    const newLink = { type: 'website', url: '' };
    const updatedLinks = [...socialLinks, newLink];
    setSocialLinks(updatedLinks);
    setValue('socialLinks', updatedLinks);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    setValue('socialLinks', updatedLinks);
  };

  const updateSocialLink = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
    setValue('socialLinks', updatedLinks);
  };

  const socialLinkTypes = [
    { value: 'website', label: 'Website' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'other', label: 'Other' },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await saveAndContinue(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How can potential clients reach you?
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Primary Contact */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Primary Contact</h4>
              
    
              <Controller
                name="primaryContactEmail"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email <span className="text-red-500">*</span></FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="contact@company.com"
                      className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="primaryContactPhone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone <span className="text-red-500">*</span></FieldLabel>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+91 9876543210"
                      className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

 

            {/* Online Presence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Online Presence
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialLink}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-3">
                {socialLinks.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No links added yet. Click "Add Link" to add your social media or website URLs.
                  </p>
                ) : (
                  socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="w-1/3">
                        <Controller
                          name={`socialLinks.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                updateSocialLink(index, 'type', value);
                              }}
                            >
                              <SelectTrigger className={errors.socialLinks?.[index]?.type ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {socialLinkTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <Controller
                          name={`socialLinks.${index}.url`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <Input
                                type="url"
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  updateSocialLink(index, 'url', e.target.value);
                                }}
                                placeholder="https://..."
                                className={errors.socialLinks?.[index]?.url ? 'border-red-500' : ''}
                              />
                              {errors.socialLinks?.[index]?.url && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.socialLinks[index].url.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SaveAndContinueFooter
        onBack={previousStep}
        showBack={true}
        isLoading={isSubmitting}
        loadingText="Saving..."
      />
    </form>
  );
}
