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
import Step2PhoneVerification from "./components/Step2PhoneVerification";
import Step3Location from "./components/Step3Location";
import Step4ProfileImage from "./components/Step4ProfileImage";
import Step5Review from "./components/Step5Review";

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

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    accountType: user?.accountType || "INDIVIDUAL",
    phoneVerified: false,
    otp: "",
    generatedOtp: "",
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    profileImage: null,
    profileImagePreview: null,
  });
  const [errors, setErrors] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const totalSteps = 5;

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

    if (step === 2) {
      if (!formData.phoneVerified) {
        newErrors.otp = "Please verify your phone number";
      }
    }

    if (step === 3) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Please capture your current location";
      }
    }

    if (step === 4) {
      if (!formData.profileImage) {
        newErrors.profileImage = "Please capture a profile image";
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

    if (!validateStep(5)) {
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

      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      const response = await fetch(`${backendUrl}/partnerUser/update`, {
        method: "PATCH",
        credentials: "include",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile submitted for verification!",
        });

        await checkAuthStatus();
        navigate("/", { replace: true });
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
  const handleCapturePhoto = () => {
    camera.capturePhoto((file, previewUrl) => {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: previewUrl,
      }));

      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: undefined }));
      }
    });
  };

  const handleStartRecording = () => {
    camera.startRecording();
  };

  const handleStopRecording = async () => {
    const result = await camera.stopRecording();
    if (result) {
      setFormData((prev) => ({
        ...prev,
        profileImage: result.file,
        profileImagePreview: result.previewUrl,
      }));

      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: undefined }));
      }
    }
  };

  const handleRetakePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null,
    }));
    camera.startCamera();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Phone Verification";
      case 3:
        return "Location";
      case 4:
        return "Profile Image";
      case 5:
        return "Review & Submit";
      default:
        return "";
    }
  };

  const renderCurrentStep = () => {
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
      case 5:
        return <Step5Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

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
