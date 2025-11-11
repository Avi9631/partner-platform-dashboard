import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Edit,
  Building2,
  FileText,
  MapPin,
  Users,
  Briefcase,
  Upload,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';

export default function ReviewAndSubmitV2() {
  const { previousStep, goToStep, developerType, formData } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    business: true,
    contact: true,
    portfolio: true,
    documents: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = (step) => {
    goToStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const payload = {
      developerType,
      ...formData
    };
    console.log('=== DEVELOPER LISTING PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('==================================');
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Developer Profile Submitted! 🎉
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your developer profile has been submitted successfully and is now under review.
          </p>
          <div className="space-y-4">
            <Button
              size="lg"
              className="px-10 py-6 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              View My Profile
            </Button>
            <p className="text-sm text-muted-foreground">
              You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Review Your Developer Profile
        </h2>
        <p className="text-muted-foreground text-base">
          Please verify all details before submitting. Click Edit to make changes.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('basic')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span>Basic Information</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(1);
                  }}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.basic ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.basic && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Developer Type</p>
                    <Badge className="capitalize">{developerType?.replace('_', ' ')}</Badge>
                  </div>
                  {formData.developerName && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company Name</p>
                      <p className="font-semibold">{formData.developerName}</p>
                    </div>
                  )}
                  {formData.brandName && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Brand Name</p>
                      <p className="font-semibold">{formData.brandName}</p>
                    </div>
                  )}
                  {formData.establishedYear && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Established</p>
                      <p className="font-semibold">{formData.establishedYear}</p>
                    </div>
                  )}
                </div>
                {formData.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Business Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('business')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span>Business Details</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(2);
                  }}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.business ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.business && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.registrationNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Registration No.</p>
                      <p className="font-semibold font-mono text-xs">{formData.registrationNumber}</p>
                    </div>
                  )}
                  {formData.panNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">PAN Number</p>
                      <p className="font-semibold font-mono">{formData.panNumber}</p>
                    </div>
                  )}
                  {formData.gstNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">GST Number</p>
                      <p className="font-semibold font-mono text-xs">{formData.gstNumber}</p>
                    </div>
                  )}
                  {formData.incorporationDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Incorporation Date</p>
                      <p className="font-semibold">{formData.incorporationDate}</p>
                    </div>
                  )}
                </div>
                {formData.reraRegistrations && formData.reraRegistrations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">RERA Registrations ({formData.reraRegistrations.length})</p>
                    <div className="space-y-2">
                      {formData.reraRegistrations.map((rera, index) => (
                        <div key={index} className="p-2 bg-gray-50 dark:bg-gray-900 rounded border">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{rera.state}</span>
                            <span className="font-mono text-xs">{rera.reraNumber}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Valid till: {rera.validUpto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Contact & Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('contact')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span>Contact & Address</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(3);
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.contact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.contact && (
              <CardContent className="space-y-4">
                {formData.registeredAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registered Address</p>
                    <p className="text-sm">
                      {formData.registeredAddress.addressLine1}, {formData.registeredAddress.addressLine2}, {formData.registeredAddress.city}, {formData.registeredAddress.state} - {formData.registeredAddress.pincode}
                    </p>
                  </div>
                )}
                <Separator />
                {formData.primaryContact && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Primary Contact
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-semibold">{formData.primaryContact.name}</p>
                        <p className="text-muted-foreground text-xs">{formData.primaryContact.designation}</p>
                      </div>
                      <div>
                        <p>{formData.primaryContact.email}</p>
                        <p>{formData.primaryContact.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('portfolio')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span>Portfolio & Experience</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(4);
                  }}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.portfolio ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.portfolio && (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.totalExperience && (
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{formData.totalExperience}</p>
                      <p className="text-xs text-muted-foreground">Years Experience</p>
                    </div>
                  )}
                  {formData.totalProjectsCompleted && (
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{formData.totalProjectsCompleted}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  )}
                  {formData.totalProjectsOngoing && (
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{formData.totalProjectsOngoing}</p>
                      <p className="text-xs text-muted-foreground">Ongoing</p>
                    </div>
                  )}
                  {formData.totalUnitsDelivered && (
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{formData.totalUnitsDelivered}</p>
                      <p className="text-xs text-muted-foreground">Units Delivered</p>
                    </div>
                  )}
                </div>
                {formData.projectTypes && formData.projectTypes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Project Types</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.projectTypes.map((type) => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('documents')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <span>Documents</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(5);
                  }}
                  className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.documents ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.documents && (
              <CardContent>
                <div className="space-y-2">
                  {formData.documents && Object.keys(formData.documents).length > 0 ? (
                    Object.entries(formData.documents).map(([key, doc]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{(doc.size / 1024).toFixed(2)} KB</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No documents uploaded</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Submit Button - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t-2 border-green-200 dark:border-green-900 p-6 z-50 shadow-lg"
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={previousStep}
            disabled={isSubmitting}
            className="px-8 py-6 text-base border-2"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-16 py-6 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Profile
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
