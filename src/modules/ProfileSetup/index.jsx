import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../components/hooks/use-toast";
import { Loader2, FileCheck } from "lucide-react";

// Import step components
import StepIndicator from "./components/StepIndicator";
import Step1PersonalInfo from "./components/Step1PersonalInfo";
import Step2AgencyInfo from "./components/Step2AgencyInfo";
import Step2PhoneVerification from "./components/Step2PhoneVerification";
import Step3Location from "./components/Step3Location";
import Step4ProfileImage from "./components/Step4ProfileImage";
import SubmissionSuccess from "./components/SubmissionSuccess";

// Import custom hooks
import { useCamera } from "./hooks/useCamera";
import { useLocation } from "./hooks/useLocation";
import { usePhoneVerification } from "./hooks/usePhoneVerification";

const ProfileSetup = () => {
  const { user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);

  // If verification is pending, show only the success screen
  const isVerificationPending = user?.verificationStatus === 'PENDING';

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    accountType: user?.accountType || "INDIVIDUAL",
    phoneVerified: false,
    otp: "",
    generatedOtp: "",
    // Agency fields
    agencyName: "",
    agencyRegistrationNumber: "",
    agencyAddress: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyWebsite: "",
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    profileVideo: null,
    profileVideoPreview: null,
  });
  const [errors, setErrors] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const isAgency = formData.accountType === "AGENCY";
  const totalSteps = isAgency ? 5 : 4;

  // Custom hooks
  const camera = useCamera(toast);
  const location = useLocation(toast);
  const phoneVerification = usePhoneVerification(toast);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number format";
      }
    }

    // Agency Information Step (only for AGENCY account type)
    if (step === 2 && isAgency) {
      if (!formData.agencyName?.trim()) {
        newErrors.agencyName = "Agency name is required";
      }
      if (!formData.agencyRegistrationNumber?.trim()) {
        newErrors.agencyRegistrationNumber = "Registration number is required";
      }
      if (!formData.agencyAddress?.trim()) {
        newErrors.agencyAddress = "Agency address is required";
      }
      if (!formData.agencyEmail?.trim()) {
        newErrors.agencyEmail = "Agency email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agencyEmail)) {
        newErrors.agencyEmail = "Invalid email format";
      }
      if (!formData.agencyPhone?.trim()) {
        newErrors.agencyPhone = "Agency phone is required";
      } else if (!/^[+]?[\d\s\-()]+$/.test(formData.agencyPhone)) {
        newErrors.agencyPhone = "Invalid phone number format";
      }
      if (formData.agencyWebsite?.trim() && !/^https?:\/\/.+/.test(formData.agencyWebsite)) {
        newErrors.agencyWebsite = "Invalid website URL";
      }
    }

    // Phone Verification Step
    const phoneVerificationStep = isAgency ? 3 : 2;
    if (step === phoneVerificationStep) {
      if (!formData.phoneVerified) {
        newErrors.otp = "Please verify your phone number";
      }
    }

    // Location Step
    const locationStep = isAgency ? 4 : 3;
    if (step === locationStep) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Please capture your current location";
      }
    }

    // Profile Video Step
    const profileVideoStep = isAgency ? 5 : 4;
    if (step === profileVideoStep) {
      if (!formData.profileVideo) {
        newErrors.profileVideo = "Please record a verification video";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Reset to step 1 if account type changes and user is past step 1
    if (field === "accountType" && currentStep > 1) {
      setCurrentStep(1);
      toast({
        title: "Account Type Changed",
        description: "Please review all steps with your new account type.",
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalStep = isAgency ? 5 : 4;
    if (!validateStep(finalStep)) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("phone", formData.phone);
      submitData.append("accountType", formData.accountType);
      submitData.append("latitude", formData.location.latitude);
      submitData.append("longitude", formData.location.longitude);
      submitData.append("address", formData.location.address);
      submitData.append("completeProfile", "true");

      // Add agency data if account type is AGENCY
      if (isAgency) {
        submitData.append("agencyName", formData.agencyName);
        submitData.append("agencyRegistrationNumber", formData.agencyRegistrationNumber);
        submitData.append("agencyAddress", formData.agencyAddress);
        submitData.append("agencyEmail", formData.agencyEmail);
        submitData.append("agencyPhone", formData.agencyPhone);
        if (formData.agencyWebsite) {
          submitData.append("agencyWebsite", formData.agencyWebsite);
        }
      }

      if (formData.profileVideo) {
        submitData.append("profileVideo", formData.profileVideo);
      }

      const response = await fetch(`${backendUrl}/partnerUser/onboarding`, {
        method: "POST",
        credentials: "include",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        // Store workflow ID if available
        if (data.data?.workflowId) {
          setWorkflowId(data.data.workflowId);
        }

        // Show success screen
        setIsSubmitted(true);

        // Update auth status in background
        await checkAuthStatus();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to complete profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile completion error:", error);
      toast({
        title: "Error",
        description: "An error occurred while completing your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  // Phone verification handlers
  const handleSendOtp = () => {
    phoneVerification.sendOtp(formData.phone, (otp) => {
      setFormData((prev) => ({ ...prev, generatedOtp: otp }));
    });
  };

  const handleVerifyOtp = () => {
    phoneVerification.verifyOtp(
      formData.otp,
      formData.generatedOtp,
      () => {
        setFormData((prev) => ({ ...prev, phoneVerified: true }));
        setErrors({});
      },
      () => {
        setErrors({ otp: "Invalid OTP. Please try again." });
      }
    );
  };

  const handleResendOtp = () => {
    phoneVerification.resendOtp(formData.phone, (otp) => {
      setFormData((prev) => ({ ...prev, otp: "", generatedOtp: otp }));
    });
  };

  // Location handler
  const handleCaptureLocation = () => {
    location.captureLocation((locationData) => {
      setFormData((prev) => ({
        ...prev,
        location: locationData,
      }));

      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: undefined }));
      }
    });
  };

  // Camera handlers
  const handleStartRecording = () => {
    camera.startRecording();
  };

  const handleStopRecording = async () => {
    const result = await camera.stopRecording();
    if (result) {
      setFormData((prev) => ({
        ...prev,
        profileVideo: result.file,
        profileVideoPreview: result.previewUrl,
      }));

      if (errors.profileVideo) {
        setErrors((prev) => ({ ...prev, profileVideo: undefined }));
      }
    }
  };

  const handleRetakePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profileVideo: null,
      profileVideoPreview: null,
    }));
    camera.startCamera();
  };

  const getStepTitle = () => {
    if (isAgency) {
      switch (currentStep) {
        case 1:
          return "Personal Information";
        case 2:
          return "Agency Information";
        case 3:
          return "Phone Verification";
        case 4:
          return "Location";
        case 5:
          return "Profile Image";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 1:
          return "Personal Information";
        case 2:
          return "Phone Verification";
        case 3:
          return "Location";
        case 4:
          return "Profile Image";
        default:
          return "";
      }
    }
  };

  const renderCurrentStep = () => {
    if (isAgency) {
      // Agency flow: Personal Info -> Agency Info -> Phone -> Location -> Profile Image
      switch (currentStep) {
        case 1:
          return (
            <Step1PersonalInfo
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          );
        case 2:
          return (
            <Step2AgencyInfo
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          );
        case 3:
          return (
            <Step2PhoneVerification
              formData={formData}
              errors={errors}
              otpSent={phoneVerification.otpSent}
              otpLoading={phoneVerification.otpLoading}
              handleChange={handleChange}
              sendOtp={handleSendOtp}
              verifyOtp={handleVerifyOtp}
              resendOtp={handleResendOtp}
            />
          );
        case 4:
          return (
            <Step3Location
              formData={formData}
              errors={errors}
              locationLoading={location.locationLoading}
              captureLocation={handleCaptureLocation}
            />
          );
        case 5:
          return (
            <Step4ProfileImage
              formData={formData}
              errors={errors}
              isCameraActive={camera.isCameraActive}
              cameraLoading={camera.cameraLoading}
              cameraError={camera.cameraError}
              isRecording={camera.isRecording}
              recordingTime={camera.recordingTime}
              videoRef={camera.videoRef}
              canvasRef={camera.canvasRef}
              startCamera={camera.startCamera}
              stopCamera={camera.stopCamera}
              startRecording={handleStartRecording}
              stopRecording={handleStopRecording}
              retakePhoto={handleRetakePhoto}
            />
          );
        default:
          return null;
      }
    } else {
      // Individual flow: Personal Info -> Phone -> Location -> Profile Image
      switch (currentStep) {
        case 1:
          return (
            <Step1PersonalInfo
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          );
        case 2:
          return (
            <Step2PhoneVerification
              formData={formData}
              errors={errors}
              otpSent={phoneVerification.otpSent}
              otpLoading={phoneVerification.otpLoading}
              handleChange={handleChange}
              sendOtp={handleSendOtp}
              verifyOtp={handleVerifyOtp}
              resendOtp={handleResendOtp}
            />
          );
        case 3:
          return (
            <Step3Location
              formData={formData}
              errors={errors}
              locationLoading={location.locationLoading}
              captureLocation={handleCaptureLocation}
            />
          );
        case 4:
          return (
            <Step4ProfileImage
              formData={formData}
              errors={errors}
              isCameraActive={camera.isCameraActive}
              cameraLoading={camera.cameraLoading}
              cameraError={camera.cameraError}
              isRecording={camera.isRecording}
              recordingTime={camera.recordingTime}
              videoRef={camera.videoRef}
              canvasRef={camera.canvasRef}
              startCamera={camera.startCamera}
              stopCamera={camera.stopCamera}
              startRecording={handleStartRecording}
              stopRecording={handleStopRecording}
              retakePhoto={handleRetakePhoto}
            />
          );
        default:
          return null;
      }
    }
  };

  // Show success screen if verification is pending or after submission
  if (isVerificationPending || isSubmitted) {
    return (
      <div className="h-screen overflow-y-auto p-0 sm:p-4">
        <div className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto">
          <SubmissionSuccess onGoHome={handleGoHome} workflowId={workflowId || user?.workflowId} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto p-0 sm:p-4">
      <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto sm:rounded-lg sm:shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="flex justify-center mb-4">
            <div className="overflow-x-auto max-w-full scrollbar-thin">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}

            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
