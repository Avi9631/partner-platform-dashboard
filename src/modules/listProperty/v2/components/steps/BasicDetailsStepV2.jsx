import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Building2, Calendar, FileText, Plus, X, Check, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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
import basicDetailsSchema from '../../../schemas/basicDetailsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import { createStepLogger } from '../../../utils/validationLogger';

const STEP_ID = 'basic-details';

export default function BasicDetailsStepV2() {
  const { saveAndContinue, previousStep, getStepData, setCurrentStepSubmitHandler, setCurrentStepIsValid } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);

  // Create logger instance (memoized to prevent recreation)
  const logger = useMemo(() => createStepLogger('Basic Details Step'), []);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(basicDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: stepData?.listingType || 'sale',
      ownershipType: stepData?.ownershipType || 'freehold',
      projectName: stepData?.projectName || '',
      customPropertyName: stepData?.customPropertyName || '',
      reraIds: stepData?.reraIds || [],
      ageOfProperty: stepData?.ageOfProperty || '',
      possessionStatus: stepData?.possessionStatus || 'ready',
      possessionDate: stepData?.possessionDate || '',
      availableFrom: stepData?.availableFrom || '',
    },
  });

  // Field array for multiple RERA IDs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'reraIds',
  });

  // State for project name search
  const [projectNameOpen, setProjectNameOpen] = useState(false);
  const [projectNameSearch, setProjectNameSearch] = useState('');
  const [projectNames, setProjectNames] = useState([]);
  const [loadingProjectNames, setLoadingProjectNames] = useState(false);
  const [hasMoreProjectNames, setHasMoreProjectNames] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Log validation errors when they change
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Simulated API call to fetch project names
  const fetchProjectNames = useCallback(async (search = '', page = 0) => {
    setLoadingProjectNames(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock project names data
    const allProjectNames = [
      'Green Valley Apartments',
      'Sunrise Residency',
      'Blue Pearl Heights',
      'Golden Gate Complex',
      'Silver Oak Towers',
      'Emerald City',
      'Diamond Plaza',
      'Royal Gardens',
      'Paradise Heights',
      'Crystal Palace',
      'Platinum Residency',
      'Sapphire Towers',
      'Ruby Heights',
      'Pearl Gardens',
      'Amber Apartments',
      'Ivory Towers',
      'Jade Residency',
      'Opal Heights',
      'Topaz Plaza',
      'Garnet Gardens',
      'Coral Heights',
      'Azure Apartments',
      'Crimson Towers',
      'Indigo Residency',
      'Violet Heights',
      'Orchid Gardens',
      'Magnolia Plaza',
      'Lotus Towers',
      'Jasmine Heights',
      'Rose Gardens',
      'Tulip Apartments',
      'Lily Residency',
      'Marigold Heights',
      'Sunflower Plaza',
      'Lavender Towers',
      'Cedar Heights',
      'Pine Gardens',
      'Oak Apartments',
      'Maple Residency',
      'Willow Heights',
      'Birch Plaza',
      'Elm Towers',
      'Ashwood Gardens',
    ];

    // Filter by search
    const filtered = search
      ? allProjectNames.filter(name => 
          name.toLowerCase().includes(search.toLowerCase())
        )
      : allProjectNames;

    // Paginate - 10 items per page
    const startIndex = page * 10;
    const endIndex = startIndex + 10;
    const paginatedNames = filtered.slice(startIndex, endIndex);

    setLoadingProjectNames(false);
    return {
      items: paginatedNames,
      hasMore: endIndex < filtered.length,
    };
  }, []);

  // Load initial project names
  useEffect(() => {
    if (projectNameOpen && projectNames.length === 0) {
      fetchProjectNames('', 0).then(result => {
        setProjectNames(result.items);
        setHasMoreProjectNames(result.hasMore);
        setCurrentPage(0);
      });
    }
  }, [projectNameOpen, projectNames.length, fetchProjectNames]);

  // Handle project name search
  const handleProjectNameSearch = useCallback(async (search) => {
    setProjectNameSearch(search);
    setCurrentPage(0);
    const result = await fetchProjectNames(search, 0);
    setProjectNames(result.items);
    setHasMoreProjectNames(result.hasMore);
  }, [fetchProjectNames]);

  // Load more project names
  const loadMoreProjectNames = useCallback(async () => {
    if (!hasMoreProjectNames || loadingProjectNames) return;
    
    const nextPage = currentPage + 1;
    const result = await fetchProjectNames(projectNameSearch, nextPage);
    setProjectNames(prev => [...prev, ...result.items]);
    setHasMoreProjectNames(result.hasMore);
    setCurrentPage(nextPage);
  }, [currentPage, projectNameSearch, hasMoreProjectNames, loadingProjectNames, fetchProjectNames]);

  // Handle form submission
  const onSubmit = useCallback((data) => {
    logger.logSubmission(data, form.formState.errors);
    
    // If "Not Listed" is selected, use customPropertyName as the projectName
    const submissionData = {
      ...data,
      projectName: data.projectName === 'Not Listed' ? data.customPropertyName : data.projectName,
      isNewProperty: data.projectName === 'Not Listed',
    };
    
    // Pass data to context
    saveAndContinue(submissionData);
  }, [logger, form.formState.errors, saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [form, onSubmit, setCurrentStepSubmitHandler]);

  // Track validation state
  useEffect(() => {
    setCurrentStepIsValid(form.formState.isValid);
  }, [form.formState.isValid, setCurrentStepIsValid]);

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

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
          Property Basic Information
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Provide ownership, project details, and property status
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <FieldGroup>
            {/* Listing Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="listingType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Listing Type <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {['sale', 'rent', 'lease'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={`p-3 border-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            field.value === type
                              ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                              : 'border-muted hover:border-orange-500/50 hover:scale-105'
                          }`}
                        >
                          For {type}
                        </button>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {!fieldState.invalid && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Select whether this property is for sale, rent, or lease
                      </p>
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Ownership Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="ownershipType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Ownership Type <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`h-10 text-sm border-2 ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freehold">Freehold</SelectItem>
                        <SelectItem value="leasehold">Leasehold</SelectItem>
                        <SelectItem value="poa">Power of Attorney (POA)</SelectItem>
                        <SelectItem value="co_operative">Co-operative Society</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Project Name - Searchable */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="projectName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-600" />
                      Project Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover open={projectNameOpen} onOpenChange={setProjectNameOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={projectNameOpen}
                          className={cn(
                            "w-full justify-between h-10 text-sm border-2 font-normal",
                            !field.value && "text-muted-foreground",
                            fieldState.invalid && "border-red-500"
                          )}
                        >
                          {field.value || "Search project name..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search project name..."
                            value={projectNameSearch}
                            onValueChange={handleProjectNameSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {loadingProjectNames ? "Loading..." : "No project found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {/* Always show "Not Listed" option at the top */}
                              <CommandItem
                                value="not_listed"
                                onSelect={() => {
                                  field.onChange('Not Listed');
                                  setProjectNameOpen(false);
                                }}
                                className="font-medium text-orange-600"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === 'Not Listed' ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Not Listed
                              </CommandItem>
                              
                              {projectNames.map((projectName) => (
                                <CommandItem
                                  key={projectName}
                                  value={projectName}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    setProjectNameOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === projectName ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {projectName}
                                </CommandItem>
                              ))}
                              
                              {hasMoreProjectNames && (
                                <div className="px-2 py-1.5">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={loadMoreProjectNames}
                                    disabled={loadingProjectNames}
                                    className="w-full text-xs text-orange-600 hover:text-orange-700"
                                  >
                                    {loadingProjectNames ? "Loading..." : "Load more..."}
                                  </Button>
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Custom Property Name - Shown when "Not Listed" is selected */}
            {form.watch('projectName') === 'Not Listed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Controller
                  name="customPropertyName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-600" />
                        Enter New Property Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Enter property/project name"
                        className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will create a new property in the system
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>
            )}

            {/* RERA IDs - Multiple */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    RERA Registration Numbers <span className="text-xs text-muted-foreground">(If applicable)</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ id: '' })}
                    className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add RERA
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
                    No RERA IDs added. Click &ldquo;Add RERA&rdquo; to add registration numbers.
                  </div>
                )}

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2"
                    >
                      <Controller
                        name={`reraIds.${index}.id`}
                        control={form.control}
                        render={({ field: reraField, fieldState }) => (
                          <div className="flex-1">
                            <Input
                              {...reraField}
                              placeholder={`e.g., RERA${123456 + index}`}
                              className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                                fieldState.invalid ? 'border-red-500' : ''
                              }`}
                            />
                            {fieldState.invalid && (
                              <p className="text-xs text-red-500 mt-1">
                                {fieldState.error?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Age of Property & Possession Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Controller
                  name="ageOfProperty"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Age of Property (years) <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 2"
                        className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Controller
                  name="possessionStatus"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Possession Status <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`h-10 text-sm border-2 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ready">Ready to Move</SelectItem>
                          <SelectItem value="under_construction">Under Construction</SelectItem>
                          <SelectItem value="resale">Resale</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>
            </div>

            {/* Possession Date (if under construction) */}
            {form.watch('possessionStatus') === 'under_construction' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Controller
                  name="possessionDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Expected Possession Date <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="date"
                        className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>
            )}

            {/* Available From */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Controller
                name="availableFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      Available From
                    </FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      When will this property be available for occupancy?
                    </p>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>
          </FieldGroup>

        </form>
      </motion.div>
    </div>
  );
}


