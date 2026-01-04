import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiCall } from "@/lib/apiClient";
import { ArrowLeft, Save, User, Phone, MapPin, Briefcase, AlertCircle, Info } from "lucide-react";
import LocationPicker from "@/components/maps/LocationPicker";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [originalPhone, setOriginalPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      try {
        const phoneNumber = user.phone || "";
        setOriginalPhone(phoneNumber);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: phoneNumber,
          latitude: user.latitude || "",
          longitude: user.longitude || "",
          address: user.address || "",
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, user, toast]);



  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset OTP states if phone number changes
    if (field === "phone" && value !== originalPhone) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
    } else if (field === "phone" && value === originalPhone) {
      // If phone is changed back to original, no OTP needed
      setOtpSent(false);
      setOtpVerified(true);
      setOtp("");
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lon,
      address: location.address || prev.address,
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "Please select a valid video file",
        });
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Video file must be less than 50MB",
        });
        return;
      }

      setVideoFile(file);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a phone number",
      });
      return;
    }

    try {
      setSendingOtp(true);
      await apiCall(`${backendUrl}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the OTP",
      });
      return;
    }

    try {
      setVerifyingOtp(true);
      
      // Simulate verification (remove this and uncomment below for real verification)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpVerified(true);
      
      // Real verification (commented out for simulation)
      // await apiCall(`${backendUrl}/api/otp/verify`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ phone: formData.phone, otp }),
      // });
      // setOtpVerified(true);

      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      });
      return;
    }

    // Check if phone number changed and OTP verification is required
    if (formData.phone !== originalPhone && !otpVerified) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please verify your new phone number with OTP",
      });
      return;
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (videoFile) {
        formDataToSend.append("profileVideo", videoFile);
      }

      await apiCall(`${backendUrl}/partnerUser/update`, {
        method: "PATCH",
        body: formDataToSend,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")}
              className="hover:bg-white/20 text-white h-12 w-12 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 border border-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">Edit Profile</h1>
              <p className="text-orange-100 text-lg md:text-xl font-medium">Update your personal information and settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={`h-12 ${errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={`h-12 ${errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`h-12 flex-1 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {formData.phone !== originalPhone && !otpVerified && (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !formData.phone.trim()}
                    className="h-12 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    {sendingOtp ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Sending...
                      </>
                    ) : (
                      otpSent ? "Resend OTP" : "Send OTP"
                    )}
                  </Button>
                )}
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
              
              {/* OTP Verification Section */}
              {formData.phone !== originalPhone && otpSent && !otpVerified && (
                <div className="mt-4 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Label htmlFor="otp" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Enter OTP
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="h-12 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || !otp.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      {verifyingOtp ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Verification Success Message */}
              {formData.phone !== originalPhone && otpVerified && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Phone number verified successfully
                  </p>
                </div>
              )}
            </div>

     
          </CardContent>
        </Card>

        {/* Location Information Section */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Location Information</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Note:</strong> Location fields are read-only and cannot be edited from this page. They are automatically populated based on your profile setup.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="e.g., 40.7128"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  className="h-12 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70"
                  readOnly
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.latitude}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="e.g., -74.0060"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  className="h-12 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70"
                  readOnly
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
            disabled={saving}
            className="h-12 px-8 text-base font-semibold"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="h-12 px-10 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
