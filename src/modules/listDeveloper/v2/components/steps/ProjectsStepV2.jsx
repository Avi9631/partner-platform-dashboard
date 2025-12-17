import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Briefcase, X, Check, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { projectsSchema } from '../../../schemas/projectsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Mixed Use',
  'Plotted Development',
  'Integrated Township',
  'Villa Projects',
  'Affordable Housing',
  'Luxury Housing',
  'Retail',
  'IT Parks',
  'Industrial',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export default function ProjectsStepV2() {
  const { formData, saveAndContinue, previousStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [operatingStates, setOperatingStates] = useState([]);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projectTypes: [],
       operatingStates: [],
      ...formData,
    },
  });

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
      setProjectTypes(Array.isArray(formData.projectTypes) ? formData.projectTypes : []);
      setOperatingStates(Array.isArray(formData.operatingStates) ? formData.operatingStates : []);
    }
  }, [formData, setValue]);

  const handleProjectTypeChange = (type, checked) => {
    const updated = checked
      ? [...projectTypes, type]
      : projectTypes.filter((t) => t !== type);
    setProjectTypes(updated);
    setValue('projectTypes', updated, { shouldValidate: true });
  };
 


  const handleSelectState = (state) => {
    const currentStates = Array.isArray(operatingStates) ? operatingStates : [];
    const updated = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    setOperatingStates(updated);
    setValue('operatingStates', updated, { shouldValidate: true });
  };

  const handleRemoveState = (item) => {
    const currentStates = Array.isArray(operatingStates) ? operatingStates : [];
    const updated = currentStates.filter((s) => s !== item);
    setOperatingStates(updated);
    setValue('operatingStates', updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        projectTypes,
         operatingStates,
      };
      await saveAndContinue(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projects & Portfolio
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showcase your experience and portfolio
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="totalProjectsCompleted"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Completed Projects
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min="0"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                name="totalProjectsOngoing"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Ongoing Projects
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min="0"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="totalUnitsDelivered"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Total Units Delivered</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min="0"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

            {/* Project Types */}
            <div className="space-y-3">
              <FieldLabel>
                Project Types
              </FieldLabel>
              <Controller
                name="projectTypes"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {PROJECT_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-type-${type}`}
                          checked={field.value?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), type]
                              : (field.value || []).filter((t) => t !== type);
                            field.onChange(updatedValue);
                            setProjectTypes(updatedValue);
                          }}
                        />
                        <label
                          htmlFor={`project-type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.projectTypes && (
                <FieldError errors={[errors.projectTypes]} />
              )}
            </div>

 

            {/* Operating States */}
            <div className="space-y-3">
              <FieldLabel>
                Operating States
                <span className="text-xs text-gray-500 ml-2">
                  ({(operatingStates || []).length}/{INDIAN_STATES.length})
                </span>
              </FieldLabel>
              <Popover open={stateDropdownOpen} onOpenChange={setStateDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={stateDropdownOpen}
                    className={cn(
                      'w-full justify-between',
                      errors.operatingStates && 'border-red-500'
                    )}
                  >
                    <span className="truncate">
                      {!(operatingStates || []).length
                        ? 'Select states...'
                        : `${(operatingStates || []).length} state${(operatingStates || []).length > 1 ? 's' : ''} selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search states..." />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {INDIAN_STATES.map((state) => (
                          <CommandItem
                            key={state}
                            value={state}
                            onSelect={() => handleSelectState(state)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                (operatingStates || []).includes(state) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {state}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {operatingStates && operatingStates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {operatingStates.map((item, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveState(item)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {errors.operatingStates && (
                <FieldError errors={[errors.operatingStates]} />
              )}
            </div>
          </div>
        </div>
 
      <SaveAndContinueFooter
        onBack={previousStep}
        showBack={true}
        isLoading={isSubmitting}
        loadingText="Saving..."
      />
    </form>
  );
}
