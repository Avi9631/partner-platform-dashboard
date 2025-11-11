import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Briefcase, TrendingUp, MapPin, Plus, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Field,
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
import { cn } from '@/lib/utils';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import projectsPortfolioSchema from '../../../schemas/projectsPortfolioSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const projectTypeOptions = [
  'Residential Apartments',
  'Villas',
  'Plotted Development',
  'Commercial Offices',
  'Retail Spaces',
  'Mixed-Use Development',
  'Townships',
  'Affordable Housing',
  'Luxury Housing',
  'Industrial Parks',
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
  'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior',
];

export default function ProjectsPortfolioStepV2() {
  const { saveAndContinue, previousStep, formData } = useDeveloperFormV2();

  const form = useForm({
    resolver: zodResolver(projectsPortfolioSchema),
    mode: 'onChange',
    defaultValues: {
      totalExperience: formData?.totalExperience || '',
      totalProjectsCompleted: formData?.totalProjectsCompleted || '',
      totalProjectsOngoing: formData?.totalProjectsOngoing || '',
      totalUnitsDelivered: formData?.totalUnitsDelivered || '',
      projectTypes: formData?.projectTypes || [],
      operatingCities: formData?.operatingCities || [],
      notableProjects: formData?.notableProjects || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'notableProjects',
  });

  const projectTypes = form.watch('projectTypes') || [];
  const operatingCities = form.watch('operatingCities') || [];

  const toggleProjectType = (type) => {
    const current = projectTypes;
    if (current.includes(type)) {
      form.setValue('projectTypes', current.filter(t => t !== type));
    } else {
      form.setValue('projectTypes', [...current, type]);
    }
  };

  const toggleCity = (city) => {
    const current = operatingCities;
    if (current.includes(city)) {
      form.setValue('operatingCities', current.filter(c => c !== city));
    } else {
      form.setValue('operatingCities', [...current, city]);
    }
  };

  const onSubmit = (data) => {
    saveAndContinue(data);
  };

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
          Projects & Portfolio
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Showcase your experience and notable projects
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Experience & Project Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Controller
                  name="totalExperience"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        Total Experience (Years) <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 15"
                        className={`h-10 text-sm border-2 focus:border-orange-500 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Controller
                  name="totalUnitsDelivered"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Total Units Delivered <span className="text-xs text-muted-foreground">(Optional)</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 5000"
                        className="h-10 text-sm border-2 focus:border-orange-500"
                      />
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Controller
                  name="totalProjectsCompleted"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-600" />
                        Completed Projects <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 25"
                        className={`h-10 text-sm border-2 focus:border-orange-500 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Controller
                  name="totalProjectsOngoing"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-orange-600" />
                        Ongoing Projects <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 8"
                        className={`h-10 text-sm border-2 focus:border-orange-500 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                      )}
                    </Field>
                  )}
                />
              </motion.div>
            </div>

            {/* Project Types */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Controller
                name="projectTypes"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Project Types <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {projectTypeOptions.map((type) => {
                        const isSelected = projectTypes.includes(type);
                        return (
                          <Badge
                            key={type}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              'cursor-pointer px-3 py-1.5 text-xs transition-all',
                              isSelected
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'hover:bg-orange-50 hover:border-orange-500'
                            )}
                            onClick={() => toggleProjectType(type)}
                          >
                            {isSelected && <Check className="w-3 h-3 mr-1" />}
                            {type}
                          </Badge>
                        );
                      })}
                    </div>
                    {fieldState.invalid && (
                      <p className="text-xs text-red-500 mt-2">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Operating Cities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Controller
                name="operatingCities"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      Operating Cities <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="max-h-48 overflow-y-auto border-2 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {indianCities.map((city) => {
                          const isSelected = operatingCities.includes(city);
                          return (
                            <Badge
                              key={city}
                              variant={isSelected ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer px-2.5 py-1 text-xs transition-all',
                                isSelected
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'hover:bg-green-50 hover:border-green-500'
                              )}
                              onClick={() => toggleCity(city)}
                            >
                              {isSelected && <Check className="w-3 h-3 mr-1" />}
                              {city}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <p className="text-xs text-red-500 mt-2">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Notable Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Notable Projects <span className="text-xs text-muted-foreground">(Optional - Add 3-5 major projects)</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ projectName: '', location: '', projectType: '', status: 'completed', unitsCount: '', completionYear: '' })}
                    className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Project
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
                    No notable projects added yet. Click &ldquo;Add Project&rdquo; to showcase your best work.
                  </div>
                )}

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border-2 border-purple-100 rounded-lg bg-purple-50/30 dark:bg-purple-950/10 dark:border-purple-900"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-sm">Project #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name={`notableProjects.${index}.projectName`}
                          control={form.control}
                          render={({ field: nameField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Project Name</FieldLabel>
                              <Input
                                {...nameField}
                                placeholder="e.g., Green Valley Residency"
                                className={`h-9 text-sm border-2 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}
                              />
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`notableProjects.${index}.location`}
                          control={form.control}
                          render={({ field: locationField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Location</FieldLabel>
                              <Input
                                {...locationField}
                                placeholder="e.g., Pune, Maharashtra"
                                className={`h-9 text-sm border-2 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}
                              />
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`notableProjects.${index}.projectType`}
                          control={form.control}
                          render={({ field: typeField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Project Type</FieldLabel>
                              <Select
                                value={typeField.value}
                                onValueChange={typeField.onChange}
                              >
                                <SelectTrigger className={`h-9 text-xs border-2 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {projectTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs">
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`notableProjects.${index}.status`}
                          control={form.control}
                          render={({ field: statusField }) => (
                            <Field>
                              <FieldLabel className="text-xs">Status</FieldLabel>
                              <Select
                                value={statusField.value}
                                onValueChange={statusField.onChange}
                              >
                                <SelectTrigger className="h-9 text-xs border-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                                  <SelectItem value="ongoing" className="text-xs">Ongoing</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                          )}
                        />

                        <Controller
                          name={`notableProjects.${index}.unitsCount`}
                          control={form.control}
                          render={({ field: unitsField }) => (
                            <Field>
                              <FieldLabel className="text-xs">Units Count <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                              <Input
                                {...unitsField}
                                type="number"
                                min="0"
                                placeholder="e.g., 200"
                                className="h-9 text-sm border-2"
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name={`notableProjects.${index}.completionYear`}
                          control={form.control}
                          render={({ field: yearField }) => (
                            <Field>
                              <FieldLabel className="text-xs">Completion Year <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                              <Input
                                {...yearField}
                                placeholder="e.g., 2022"
                                maxLength={4}
                                className="h-9 text-sm border-2"
                              />
                            </Field>
                          )}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </FieldGroup>

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onBack={previousStep}
            nextDisabled={!form.formState.isValid}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}
