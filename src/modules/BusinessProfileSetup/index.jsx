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
import StepIndicator from "../ProfileSetup/components/StepIndicator";
import Step1BusinessInfo from "./components/Step1BusinessInfo";
import Step2MultiPhoneVerification from "./components/Step2MultiPhoneVerification";
import Step3OwnerVideoVerification from "./components/Step3OwnerVideoVerification";
import SubmissionSuccess from "./components/SubmissionSuccess";

// Import custom hooks
import { useCamera } from "../ProfileSetup/hooks/useCamera";
import { useMultiPhoneVerification } from "./hooks/useMultiPhoneVerification";

const BusinessProfileSetup = () => {
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    registrationNumber: "",
    businessAddress: "",
    businessEmail: "",
    phoneNumbers: [], // Array of {phone, verified, otp, generatedOtp}
    ownerVideo: null,
    ownerVideoPreview: null,
  });
  const [errors, setErrors] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const totalSteps = 3;

  // Custom hooks
  const camera = useCamera(toast);
  const phoneVerification = useMultiPhoneVerification(toast);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName?.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.registrationNumber?.trim()) {
        newErrors.registrationNumber = "Registration number is required";
      }
      if (!formData.businessAddress?.trim()) {
        newErrors.businessAddress = "Business address is required";
      }
      if (!formData.businessEmail?.trim()) {
        newErrors.businessEmail = "Business email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
        newErrors.businessEmail = "Invalid email format";
      }
    }

    // Multi-Phone Verification Step
    if (step === 2) {
      if (formData.phoneNumbers.length === 0) {
        newErrors.phoneNumbers = "At least one phone number is required";
      } else {
        const unverified = formData.phoneNumbers.filter(p => !p.verified);
        if (unverified.length > 0) {
          newErrors.phoneNumbers = "All phone numbers must be verified";
        }
      }
    }

    // Owner Video Verification Step
    if (step === 3) {
      if (!formData.ownerVideo) {
        newErrors.ownerVideo = "Owner/POC verification video is required";
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

    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("businessName", formData.businessName);
      submitData.append("registrationNumber", formData.registrationNumber);
      submitData.append("businessAddress", formData.businessAddress);
      submitData.append("businessEmail", formData.businessEmail);
      
      // Add verified phone numbers as JSON
      const verifiedPhones = formData.phoneNumbers
        .filter(p => p.verified)
        .map(p => ({ phone: p.phone }));
      submitData.append("businessPhones", JSON.stringify(verifiedPhones));

      if (formData.ownerVideo) {
        submitData.append("ownerVideo", formData.ownerVideo);
      }

      const response = await fetch(`${backendUrl}/partnerUser/businessOnboarding`, {
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

        toast({
          title: "Success",
          description: "Business profile submitted for verification",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit business profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Business profile submission error:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your business profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  // Camera handlers for owner video verification
  const handleStartRecording = () => {
    camera.startRecording();
  };

  const handleStopRecording = async () => {
    const result = await camera.stopRecording();
    if (result) {
      setFormData((prev) => ({
        ...prev,
        ownerVideo: result.file,
        ownerVideoPreview: result.previewUrl,
      }));

      if (errors.ownerVideo) {
        setErrors((prev) => ({ ...prev, ownerVideo: undefined }));
      }
    }
  };

  const handleRetakeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      ownerVideo: null,
      ownerVideoPreview: null,
    }));
    camera.startCamera();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information";
      case 2:
        return "Phone Verification";
      case 3:
        return "Owner/POC Verification";
      default:
        return "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BusinessInfo
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <Step2MultiPhoneVerification
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            phoneVerification={phoneVerification}
          />
        );
      case 3:
        return (
          <Step3OwnerVideoVerification
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
            retakeVideo={handleRetakeVideo}
          />
        );
      default:
        return null;
    }
  };

  // Show success screen after submission
  if (isSubmitted) {
    return (
      <div className="h-screen overflow-y-auto p-0 sm:p-4">
        <div className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto">
          <SubmissionSuccess onGoHome={handleGoHome} workflowId={workflowId} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen   p-0 sm:p-4">
      <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto sm:rounded-lg sm:shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Business Profile Setup
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

export default BusinessProfileSetup;
