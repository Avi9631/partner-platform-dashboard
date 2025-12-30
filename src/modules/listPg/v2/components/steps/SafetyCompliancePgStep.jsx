export { SafetyCompliancePgStep as default } from './PlaceholderSteps';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield,
  Flame,
  Heart,
  DoorOpen,
  UserCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Building,
  Eye,
  Clock,
  Users,
  AlertCircle,
  Info,
  Award,
  Zap,
  Settings
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import safetyCompliancePgSchema, { SAFETY_MEASURES, CCTV_COVERAGE_OPTIONS, COMPLIANCE_LEVELS } from '../../../schemas/safetyCompliancePgSchema';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Icon mapping
const ICON_MAP = {
  Flame,
  Shield,
  Heart,
  DoorOpen,
  UserCheck,
  Camera,
  Eye,
  Clock,
  Users
};

export function SafetyCompliancePgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const logger = useMemo(() => createStepLogger('Safety & Compliance PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(safetyCompliancePgSchema),
    mode: 'onChange',
    defaultValues: {
      safety: {
        fireSafetyCertificate: formData?.safety?.fireSafetyCertificate || false,
        policeVerification: formData?.safety?.policeVerification || false,
        firstAidKit: formData?.safety?.firstAidKit || false,
        cctvCoverage: formData?.safety?.cctvCoverage || '0%',
        emergencyExit: formData?.safety?.emergencyExit || false,
        nightGuard: formData?.safety?.nightGuard || false,
      },
      safetyDetails: formData?.safetyDetails || {},
      // Legacy fields for backward compatibility
      hasFireSafetyCertificate: formData?.hasFireSafetyCertificate || false,
      fireSafetyCertificate: formData?.fireSafetyCertificate || false,
      fireSafetyCertificateUrl: formData?.fireSafetyCertificateUrl || '',
      fireSafetyCertificateNumber: formData?.fireSafetyCertificateNumber || '',
      policeVerificationRequired: formData?.policeVerificationRequired || false,
      policeVerification: formData?.policeVerification || false,
      policeVerificationDetails: formData?.policeVerificationDetails || '',
      hasFirstAidKit: formData?.hasFirstAidKit || false,
      firstAidKit: formData?.firstAidKit || false,
      cctvCoveragePercentage: formData?.cctvCoveragePercentage || 0,
      cctvCoverage: formData?.cctvCoverage || '',
      hasEmergencyExit: formData?.hasEmergencyExit || false,
      emergencyExit: formData?.emergencyExit || false,
      emergencyExitCount: formData?.emergencyExitCount || 0,
      hasNightGuard: formData?.hasNightGuard || false,
      nightGuard: formData?.nightGuard || false,
      nightGuardTimings: formData?.nightGuardTimings || '',
      additionalSafetyMeasures: formData?.additionalSafetyMeasures || '',
    },
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Calculate safety compliance score
  const safetyScore = useMemo(() => {
    const safety = form.watch('safety');
    let score = 0;
    
    if (safety?.fireSafetyCertificate) score++;
    if (safety?.policeVerification) score++;
    if (safety?.firstAidKit) score++;
    if (safety?.emergencyExit) score++;
    if (safety?.nightGuard) score++;
    
    return score;
  }, [form.watch('safety')]);

  // Get compliance level
  const complianceLevel = useMemo(() => {
    const levels = Object.values(COMPLIANCE_LEVELS);
    return levels.reverse().find(level => safetyScore >= level.score) || COMPLIANCE_LEVELS.BASIC;
  }, [safetyScore]);

  // Update safety measure
  const updateSafetyMeasure = (key, value) => {
    const currentSafety = form.getValues('safety');
    form.setValue('safety', {
      ...currentSafety,
      [key]: value
    });
  };

  // Load sample safety configuration
  const loadSampleSafety = () => {
    form.setValue('safety', {
      fireSafetyCertificate: true,
      policeVerification: true,
      firstAidKit: true,
      cctvCoverage: '95%',
      emergencyExit: true,
      nightGuard: true,
    });
    
    form.setValue('safetyDetails', {
      fireSafetyCertificate: {
        certificateNumber: 'FSC-2024-001',
        issueDate: '2024-01-15',
        expiryDate: '2025-01-15',
        issuingAuthority: 'Municipal Fire Department',
      },
      emergencyExit: {
        exitCount: 2,
        exitLocations: ['Main Staircase', 'Emergency Staircase'],
        evacuationPlan: true,
        emergencyLighting: true,
      },
      cctvDetails: {
        cameraCount: 12,
        recordingRetention: '30 days',
        monitoringSystem: true,
        nightVision: true,
        coverageAreas: ['Entrance', 'Common Areas', 'Corridors', 'Parking'],
      },
    });
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

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
        className="mb-6"
      >
        <h2 className="text-2xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Safety & Compliance
        </h2>
        <p className="text-muted-foreground text-sm">
          Ensure your property meets safety standards and regulatory requirements
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Safety Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Safety Compliance Score
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadSampleSafety}
                >
                  Load Sample Configuration
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {safetyScore}/5 Safety Measures
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Compliance Level: 
                      <Badge className={`ml-2 bg-${complianceLevel.color}-100 text-${complianceLevel.color}-800`}>
                        {complianceLevel.label}
                      </Badge>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{Math.round((safetyScore / 5) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                </div>
                
                <Progress value={(safetyScore / 5) * 100} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                  {SAFETY_MEASURES.map((measure) => {
                    const Icon = ICON_MAP[measure.icon] || Shield;
                    const isEnabled = form.watch(`safety.${measure.key}`);
                    
                    return (
                      <div
                        key={measure.key}
                        className={`text-center p-3 border rounded-lg transition-all cursor-pointer ${
                          isEnabled 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-muted hover:border-orange-500'
                        }`}
                        onClick={() => {
                          setSelectedMeasure(measure);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          isEnabled ? 'text-green-600' : 'text-muted-foreground'
                        }`} />
                        <div className="text-xs font-medium">{measure.name}</div>
                        {isEnabled && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Configuration Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Safety Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  {/* Safety Measures Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SAFETY_MEASURES.map((measure) => {
                      const Icon = ICON_MAP[measure.icon] || Shield;
                      const fieldName = `safety.${measure.key}`;
                      
                      return (
                        <Controller
                          key={measure.key}
                          name={fieldName}
                          control={form.control}
                          render={({ field }) => (
                            <Card className={`border-2 transition-all ${
                              field.value ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-muted hover:border-orange-500'
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3">
                                    <Icon className={`w-5 h-5 mt-0.5 ${
                                      field.value ? 'text-green-600' : 'text-muted-foreground'
                                    }`} />
                                    <div>
                                      <h4 className="font-medium text-sm">{measure.name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {measure.description}
                                      </p>
                                      <Badge variant="outline" className="mt-2 text-xs">
                                        {measure.category}
                                      </Badge>
                                      {measure.required && (
                                        <Badge variant="destructive" className="ml-1 text-xs">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                                
                                {field.value && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                  >
                                    <Separator className="my-3" />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedMeasure(measure);
                                        setShowDetailsDialog(true);
                                      }}
                                      className="w-full"
                                    >
                                      <Settings className="w-4 h-4 mr-2" />
                                      Configure Details
                                    </Button>
                                  </motion.div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        />
                      );
                    })}
                  </div>

                  {/* CCTV Coverage */}
                  <Controller
                    name="safety.cctvCoverage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-orange-600" />
                          CCTV Coverage
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CCTV_COVERAGE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6">
                  <div className="space-y-6">
                    {/* Fire Safety Certificate Details */}
                    <AnimatePresence>
                      {form.watch('safety.fireSafetyCertificate') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Flame className="w-4 h-4 text-red-600" />
                                Fire Safety Certificate Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                  name="safetyDetails.fireSafetyCertificate.certificateNumber"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Certificate Number</FieldLabel>
                                      <Input
                                        {...field}
                                        placeholder="e.g., FSC-2024-001"
                                      />
                                    </Field>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.fireSafetyCertificate.issuingAuthority"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Issuing Authority</FieldLabel>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Municipal Fire Department"
                                      />
                                    </Field>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.fireSafetyCertificate.issueDate"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Issue Date</FieldLabel>
                                      <Input
                                        {...field}
                                        type="date"
                                      />
                                    </Field>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.fireSafetyCertificate.expiryDate"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Expiry Date</FieldLabel>
                                      <Input
                                        {...field}
                                        type="date"
                                      />
                                    </Field>
                                  )}
                                />
                              </div>

                              <Controller
                                name="safetyDetails.fireSafetyCertificate.documentUrl"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Document URL (Optional)</FieldLabel>
                                    <Input
                                      {...field}
                                      type="url"
                                      placeholder="https://example.com/certificate.pdf"
                                    />
                                  </Field>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Police Verification Details */}
                    <AnimatePresence>
                      {form.watch('safety.policeVerification') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-600" />
                                Police Verification Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                  name="safetyDetails.policeVerification.stationName"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Police Station</FieldLabel>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Powai Police Station"
                                      />
                                    </Field>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.policeVerification.referenceNumber"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Reference Number</FieldLabel>
                                      <Input
                                        {...field}
                                        placeholder="e.g., PV-2024-001"
                                      />
                                    </Field>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.policeVerification.verificationDate"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Verification Date</FieldLabel>
                                      <Input
                                        {...field}
                                        type="date"
                                      />
                                    </Field>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  {/* CCTV Details */}
                  <AnimatePresence>
                    {form.watch('safety.cctvCoverage') !== '0%' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Camera className="w-4 h-4 text-purple-600" />
                              CCTV System Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Controller
                                name="safetyDetails.cctvDetails.cameraCount"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Number of Cameras</FieldLabel>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      max="100"
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </Field>
                                )}
                              />

                              <Controller
                                name="safetyDetails.cctvDetails.recordingRetention"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Recording Retention</FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., 30 days"
                                    />
                                  </Field>
                                )}
                              />

                              <div className="space-y-3">
                                <Controller
                                  name="safetyDetails.cctvDetails.monitoringSystem"
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Live Monitoring</Label>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </div>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.cctvDetails.nightVision"
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Night Vision</Label>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Night Guard Details */}
                  <AnimatePresence>
                    {form.watch('safety.nightGuard') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-green-600" />
                              Night Security Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Controller
                                name="safetyDetails.nightGuard.schedule"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Guard Schedule</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select schedule" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="24x7">24x7</SelectItem>
                                        <SelectItem value="night_only">Night Only (9 PM - 6 AM)</SelectItem>
                                        <SelectItem value="peak_hours">Peak Hours</SelectItem>
                                        <SelectItem value="weekends_only">Weekends Only</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </Field>
                                )}
                              />

                              <Controller
                                name="safetyDetails.nightGuard.agencyName"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Security Agency</FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., SecureTech Services"
                                    />
                                  </Field>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="emergency" className="space-y-6">
                  {/* Emergency Exit Details */}
                  <AnimatePresence>
                    {form.watch('safety.emergencyExit') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <DoorOpen className="w-4 h-4 text-orange-600" />
                              Emergency Exit Configuration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Controller
                                name="safetyDetails.emergencyExit.exitCount"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Number of Emergency Exits</FieldLabel>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="1"
                                      max="10"
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                    />
                                  </Field>
                                )}
                              />

                              <div className="space-y-3">
                                <Controller
                                  name="safetyDetails.emergencyExit.evacuationPlan"
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Evacuation Plan Available</Label>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </div>
                                  )}
                                />

                                <Controller
                                  name="safetyDetails.emergencyExit.emergencyLighting"
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Emergency Lighting</Label>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* First Aid Kit Details */}
                  <AnimatePresence>
                    {form.watch('safety.firstAidKit') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-600" />
                              First Aid Kit Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Controller
                                name="safetyDetails.firstAidKit.location"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Kit Location</FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., Reception Desk"
                                    />
                                  </Field>
                                )}
                              />

                              <Controller
                                name="safetyDetails.firstAidKit.lastUpdated"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Last Updated</FieldLabel>
                                    <Input
                                      {...field}
                                      type="date"
                                    />
                                  </Field>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Safety Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Additional Safety Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="additionalSafetyMeasures"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Additional Safety Information (Optional)
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Describe any additional safety measures, protocols, or equipment not covered above..."
                      rows={4}
                      className={fieldState.invalid ? 'border-red-500' : ''}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Safety Compliance Tips
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Fire safety certificate and police verification are mandatory for most PG properties</li>
                    <li>• Ensure emergency exits are clearly marked and unobstructed</li>
                    <li>• Regular maintenance of safety equipment is crucial</li>
                    <li>• Consider getting safety insurance for better tenant confidence</li>
                    <li>• Display emergency contact numbers in common areas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </form>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMeasure && (
                <span className="flex items-center gap-2">
                  {selectedMeasure.icon && ICON_MAP[selectedMeasure.icon] && (
                    React.createElement(ICON_MAP[selectedMeasure.icon], { className: "w-5 h-5" })
                  )}
                  {selectedMeasure.name} Details
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMeasure && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedMeasure.description}</p>
              </div>
              
              {selectedMeasure.documents && (
                <div>
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeasure.documents.map((doc) => (
                      <Badge key={doc} variant="outline">{doc}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMeasure.items && (
                <div>
                  <h4 className="font-medium mb-2">Recommended Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeasure.items.map((item) => (
                      <Badge key={item} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMeasure.features && (
                <div>
                  <h4 className="font-medium mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeasure.features.map((feature) => (
                      <Badge key={feature} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMeasure.schedules && (
                <div>
                  <h4 className="font-medium mb-2">Schedule Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeasure.schedules.map((schedule) => (
                      <Badge key={schedule} variant="outline">{schedule}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}