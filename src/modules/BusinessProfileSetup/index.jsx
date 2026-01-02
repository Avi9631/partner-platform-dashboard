import { useState, useEffect } from "react";
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
import { Loader2, FileCheck, X } from "lucide-react";

// Import step components
import StepIndicator from "../ProfileSetup/components/StepIndicator";
import Step1BusinessInfo from "./components/Step1BusinessInfo";
import Step2MultiPhoneVerification from "./components/Step2MultiPhoneVerification";
import Step3BusinessLocation from "./components/Step3BusinessLocation";
import SubmissionSuccess from "./components/SubmissionSuccess";

// Import custom hooks
import { useCamera } from "../ProfileSetup/hooks/useCamera";
import { useLocation } from "../ProfileSetup/hooks/useLocation";
import { useMultiPhoneVerification } from "./hooks/useMultiPhoneVerification";

const BusinessProfileSetup = () => {
  const { checkAuthStatus, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const [formData, setFormData] = useState({
    businessName: "",
    registrationNumber: "",
    businessAddress: "",
    businessEmail: "",
    phoneNumbers: [], // Array of {phone, verified, otp, generatedOtp}
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
  });
  const [errors, setErrors] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const totalSteps = 3;

  // Custom hooks
  const camera = useCamera(toast);
  const location = useLocation(toast);
  const phoneVerification = useMultiPhoneVerification(toast);

  // Check business status on mount
  useEffect(() => {
    const checkBusinessStatus = async () => {
      try {
        setIsCheckingStatus(true);
        await checkAuthStatus();
      } catch (error) {
        console.error("Error checking business status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkBusinessStatus();
  }, []); // Run only once on mount

  // Monitor user business status changes
  useEffect(() => {
    if (!isCheckingStatus && user?.business && user.business.verificationStatus === "PENDING") {
      setIsSubmitted(true);
      if (user.business.businessId) {
        setWorkflowId(user.business.businessId);
      }
    }

        if (user?.business && user.business.verificationStatus === "APPROVED") {
          navigate("/", { replace: true });
        }

  }, [user?.business?.verificationStatus, user?.business?.businessId, isCheckingStatus]);

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

    // Business Location Step
    if (step === 3) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Please capture your business location";
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
      
      // Add location data
      submitData.append("latitude", formData.location.latitude);
      submitData.append("longitude", formData.location.longitude);
      submitData.append("address", formData.location.address);
      
      // Add verified phone numbers as JSON
      const verifiedPhones = formData.phoneNumbers
        .filter(p => p.verified)
        .map(p => ({ phone: p.phone }));
      submitData.append("businessPhones", JSON.stringify(verifiedPhones));

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

  // Location capture handler
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information";
      case 2:
        return "Phone Verification";
      case 3:
        return "Business Location";
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
          <Step3BusinessLocation
            formData={formData}
            errors={errors}
            locationLoading={location.locationLoading}
            captureLocation={handleCaptureLocation}
          />
        );
      default:
        return null;
    }
  };

  // Show success screen after submission
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 overflow-hidden p-0 sm:p-4 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <div className="w-full h-full sm:max-w-2xl sm:mx-auto">
          <SubmissionSuccess onGoHome={handleGoHome} workflowId={workflowId} />
        </div>
      </div>
    );
  }

  // Show loading state while checking business status
  if (isCheckingStatus) {
    return (
      <div className="fixed inset-0 overflow-hidden p-0 sm:p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-700">Checking business status...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden p-0 sm:p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <Card className="w-full h-full sm:max-w-2xl sm:mx-auto sm:rounded-lg sm:shadow-lg flex flex-col overflow-hidden">
        <CardHeader className="space-y-1 flex-shrink-0 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoHome}
            className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">
            Business Profile Setup
          </CardTitle>
          {/* <CardDescription className="text-center">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </CardDescription> */}
          <div className="flex justify-center pt-4">
            <div className="overflow-x-auto max-w-full scrollbar-thin">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto px-6">
          {renderCurrentStep()}
        </CardContent>

        <div className="flex-shrink-0 border-t px-6 py-4">
          <div className="flex justify-between">
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
              <Button type="button" onClick={handleSubmit} className="ml-auto" disabled={isLoading}>
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
        </div>
      </Card>
    </div>
  );
};

export default BusinessProfileSetup;
