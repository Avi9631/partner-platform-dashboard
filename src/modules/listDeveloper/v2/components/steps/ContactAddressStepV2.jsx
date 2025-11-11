import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { MapPin, User, Mail, Phone, Plus, X, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import contactAddressSchema from '../../../schemas/contactAddressSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function ContactAddressStepV2() {
  const { saveAndContinue, previousStep, formData } = useDeveloperFormV2();

  const form = useForm({
    resolver: zodResolver(contactAddressSchema),
    mode: 'onChange',
    defaultValues: {
      registeredAddress: formData?.registeredAddress || {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
      isCorporateSameAsRegistered: formData?.isCorporateSameAsRegistered ?? true,
      corporateAddress: formData?.corporateAddress || {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
      primaryContact: formData?.primaryContact || {
        name: '',
        designation: '',
        email: '',
        phone: '',
      },
      alternateContacts: formData?.alternateContacts || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'alternateContacts',
  });

  const isSameAddress = form.watch('isCorporateSameAsRegistered');

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
          Contact & Address Details
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Provide office addresses and contact information
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
            {/* Registered Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-2 border-orange-100 rounded-lg bg-orange-50/30 dark:bg-orange-950/10 dark:border-orange-900"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Registered Office Address <span className="text-red-500">*</span>
              </h3>
              
              <div className="space-y-4">
                <Controller
                  name="registeredAddress.addressLine1"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs">Address Line 1 *</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Building/House No., Street Name"
                        className={`h-9 text-sm border-2 focus:border-orange-500 ${
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
                  name="registeredAddress.addressLine2"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs">Address Line 2</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Area, Landmark (Optional)"
                        className="h-9 text-sm border-2 focus:border-orange-500"
                      />
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Controller
                    name="registeredAddress.city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">City *</FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Mumbai"
                          className={`h-9 text-sm border-2 focus:border-orange-500 ${
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
                    name="registeredAddress.state"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">State *</FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Maharashtra"
                          className={`h-9 text-sm border-2 focus:border-orange-500 ${
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
                    name="registeredAddress.pincode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">Pincode *</FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., 400001"
                          maxLength={6}
                          className={`h-9 text-sm border-2 focus:border-orange-500 ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldState.invalid && (
                          <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* Corporate Address Same Checkbox */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="isCorporateSameAsRegistered"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sameAddress"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="sameAddress"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Corporate office address is same as registered address
                    </label>
                  </div>
                )}
              />
            </motion.div>

            {/* Corporate Address (if different) */}
            {!isSameAddress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-2 border-purple-100 rounded-lg bg-purple-50/30 dark:bg-purple-950/10 dark:border-purple-900"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Corporate Office Address
                </h3>
                
                <div className="space-y-4">
                  <Controller
                    name="corporateAddress.addressLine1"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">Address Line 1</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Building/House No., Street Name"
                          className="h-9 text-sm border-2 focus:border-purple-500"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="corporateAddress.addressLine2"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="text-xs">Address Line 2</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Area, Landmark (Optional)"
                          className="h-9 text-sm border-2 focus:border-purple-500"
                        />
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Controller
                      name="corporateAddress.city"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel className="text-xs">City</FieldLabel>
                          <Input
                            {...field}
                            placeholder="e.g., Mumbai"
                            className="h-9 text-sm border-2 focus:border-purple-500"
                          />
                        </Field>
                      )}
                    />

                    <Controller
                      name="corporateAddress.state"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel className="text-xs">State</FieldLabel>
                          <Input
                            {...field}
                            placeholder="e.g., Maharashtra"
                            className="h-9 text-sm border-2 focus:border-purple-500"
                          />
                        </Field>
                      )}
                    />

                    <Controller
                      name="corporateAddress.pincode"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel className="text-xs">Pincode</FieldLabel>
                          <Input
                            {...field}
                            placeholder="e.g., 400001"
                            maxLength={6}
                            className="h-9 text-sm border-2 focus:border-purple-500"
                          />
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Primary Contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 border-2 border-green-100 rounded-lg bg-green-50/30 dark:bg-green-950/10 dark:border-green-900"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Primary Contact Person <span className="text-red-500">*</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="primaryContact.name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs">Full Name *</FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., John Doe"
                        className={`h-9 text-sm border-2 focus:border-green-500 ${
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
                  name="primaryContact.designation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs">Designation *</FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., Managing Director"
                        className={`h-9 text-sm border-2 focus:border-green-500 ${
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
                  name="primaryContact.email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email *
                      </FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john.doe@example.com"
                        className={`h-9 text-sm border-2 focus:border-green-500 ${
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
                  name="primaryContact.phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone *
                      </FieldLabel>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        className={`h-9 text-sm border-2 focus:border-green-500 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                      )}
                    </Field>
                  )}
                />
              </div>
            </motion.div>

            {/* Alternate Contacts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    Alternate Contact Persons <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', designation: '', email: '', phone: '' })}
                    className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Contact
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
                    No alternate contacts added. Click &ldquo;Add Contact&rdquo; to include additional contact persons.
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
                      className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50/30 dark:bg-gray-950/10 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-sm">Contact #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Controller
                          name={`alternateContacts.${index}.name`}
                          control={form.control}
                          render={({ field: nameField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Full Name</FieldLabel>
                              <Input
                                {...nameField}
                                placeholder="e.g., Jane Smith"
                                className={`h-8 text-xs border-2 ${
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
                          name={`alternateContacts.${index}.designation`}
                          control={form.control}
                          render={({ field: designationField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Designation</FieldLabel>
                              <Input
                                {...designationField}
                                placeholder="e.g., Sales Manager"
                                className={`h-8 text-xs border-2 ${
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
                          name={`alternateContacts.${index}.email`}
                          control={form.control}
                          render={({ field: emailField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Email</FieldLabel>
                              <Input
                                {...emailField}
                                type="email"
                                placeholder="jane.smith@example.com"
                                className={`h-8 text-xs border-2 ${
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
                          name={`alternateContacts.${index}.phone`}
                          control={form.control}
                          render={({ field: phoneField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Phone</FieldLabel>
                              <Input
                                {...phoneField}
                                type="tel"
                                placeholder="9876543210"
                                maxLength={10}
                                className={`h-8 text-xs border-2 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}
                              />
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
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
