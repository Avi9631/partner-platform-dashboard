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
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiCall } from "@/lib/apiClient";
import { ArrowLeft, Save, Building2, Mail, Phone, MapPin, FileText, AlertCircle, Info, Plus, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export default function EditBusiness() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newPhone, setNewPhone] = useState("");
  const [originalPhones, setOriginalPhones] = useState([]); // Track original verified phones
  const [otpLoading, setOtpLoading] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyRegistrationNumber: "",
    agencyAddress: "",
    agencyEmail: "",
    phoneNumbers: [], // Array of objects: {phone: string, verified: boolean, otp: string, generatedOtp: string, otpSent: boolean}
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      try {
        setLoading(true);

        if (!user.business) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "No business profile found. Please create one first.",
          });
          navigate("/profile");
          return;
        }

        if (user.business) {
          const business = user.business;
          
          // Parse phone numbers from API response with verification state
          let phoneNumbers = [];
          if (business.businessPhone) {
            if (Array.isArray(business.businessPhone)) {
              phoneNumbers = business.businessPhone.map(p => ({
                phone: p.phone || p,
                verified: true, // Existing phones are already verified
                otp: "",
                generatedOtp: "",
                otpSent: false,
              }));
            } else if (typeof business.businessPhone === "object") {
              phoneNumbers = [{
                phone: business.businessPhone.number || business.businessPhone.phone,
                verified: true,
                otp: "",
                generatedOtp: "",
                otpSent: false,
              }];
            } else {
              phoneNumbers = [{
                phone: business.businessPhone,
                verified: true,
                otp: "",
                generatedOtp: "",
                otpSent: false,
              }];
            }
          }
          
          const validPhones = phoneNumbers.filter(p => p.phone);
          setOriginalPhones(validPhones.map(p => p.phone)); // Store original phones
          
          setFormData({
            agencyName: business.businessName || "",
            agencyRegistrationNumber: business.registrationNumber || "",
            agencyAddress: business.businessAddress || "",
            agencyEmail: business.businessEmail || "",
            phoneNumbers: validPhones,
          });
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, user, toast, navigate]);



  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddPhone = () => {
    if (!newPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a phone number",
      });
      return;
    }

    // Validate phone format
    if (!/^[+]?[\d\s\-()]+$/.test(newPhone)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Invalid phone number format",
      });
      return;
    }

    // Check if phone already exists
    const exists = formData.phoneNumbers.some(p => p.phone === newPhone);
    if (exists) {
      toast({
        variant: "destructive",
        title: "Duplicate Phone",
        description: "This phone number is already added",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...prev.phoneNumbers,
        {
          phone: newPhone,
          verified: false,
          otp: "",
          generatedOtp: "",
          otpSent: false,
        },
      ],
    }));
    setNewPhone("");
    
    // Clear error
    if (errors.phoneNumbers) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumbers;
        return newErrors;
      });
    }
  };

  const handleRemovePhone = (index) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
    }));
  };

  const handleSendOtp = (index) => {
    const phoneObj = formData.phoneNumbers[index];
    setOtpLoading(true);

    // Simulate OTP generation (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, call your API to send OTP via SMS
    setTimeout(() => {
      setFormData((prev) => {
        const updatedPhones = [...prev.phoneNumbers];
        updatedPhones[index] = {
          ...updatedPhones[index],
          generatedOtp: otp,
          otpSent: true,
        };
        return { ...prev, phoneNumbers: updatedPhones };
      });
      setOtpLoading(false);

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phoneObj.phone}. Code: ${otp} (For testing)`,
        duration: 10000,
      });
    }, 1000);
  };

  const handleVerifyOtp = (index) => {
    const phoneObj = formData.phoneNumbers[index];

    if (!phoneObj.otp?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the OTP",
      });
      return;
    }

    if (phoneObj.otp === phoneObj.generatedOtp) {
      setFormData((prev) => {
        const updatedPhones = [...prev.phoneNumbers];
        updatedPhones[index] = {
          ...updatedPhones[index],
          verified: true,
        };
        return { ...prev, phoneNumbers: updatedPhones };
      });

      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid OTP. Please check and try again.",
      });
    }
  };

  const handleResendOtp = (index) => {
    const phoneObj = formData.phoneNumbers[index];
    toast({
      title: "Resending OTP",
      description: `Sending new verification code to ${phoneObj.phone}`,
    });
    handleSendOtp(index);
  };

  const handleOtpChange = (index, value) => {
    setFormData((prev) => {
      const updatedPhones = [...prev.phoneNumbers];
      updatedPhones[index] = {
        ...updatedPhones[index],
        otp: value.replace(/\D/g, ""),
      };
      return { ...prev, phoneNumbers: updatedPhones };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Business name is required";
    }

    if (!formData.agencyAddress.trim()) {
      newErrors.agencyAddress = "Business address is required";
    }

    if (!formData.agencyEmail.trim()) {
      newErrors.agencyEmail = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agencyEmail)) {
      newErrors.agencyEmail = "Invalid email format";
    }

    if (formData.phoneNumbers.length === 0) {
      newErrors.phoneNumbers = "At least one phone number is required";
    }

    // Check if all phone numbers are verified
    const unverifiedPhones = formData.phoneNumbers.filter(p => !p.verified);
    if (unverifiedPhones.length > 0) {
      newErrors.phoneNumbers = `${unverifiedPhones.length} phone number(s) need verification`;
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

    try {
      setSaving(true);

      // Format phone numbers for API (only send verified phones)
      const formattedPhones = formData.phoneNumbers
        .filter(p => p.verified)
        .map(p => ({ phone: p.phone }));

      // Update business profile using the new dedicated endpoint
      await apiCall(`${backendUrl}/partnerUser/updateBusiness`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: formData.agencyName,
          registrationNumber: formData.agencyRegistrationNumber,
          businessAddress: formData.agencyAddress,
          businessEmail: formData.agencyEmail,
          businessPhones: formattedPhones,
        }),
      });

      toast({
        title: "Success",
        description: "Business profile updated successfully",
      });

      navigate("/business-profile");
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update business profile. Please try again.",
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

  // If no business profile (shouldn't reach here due to redirect in useEffect)
  if (!user || !user.business) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/business-profile")}
              className="hover:bg-white/20 text-white h-12 w-12 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 border border-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">Edit Business Profile</h1>
              <p className="text-orange-100 text-lg md:text-xl font-medium">Update your business information and details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit} className=" mx-auto space-y-8">
        {/* Business Information Section */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Business Information</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agencyName" className="text-sm font-medium">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="agencyName"
                placeholder="Enter your business name"
                value={formData.agencyName}
                onChange={(e) => handleChange("agencyName", e.target.value)}
                className={errors.agencyName ? "border-destructive" : ""}
              />
              {errors.agencyName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyRegistrationNumber" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Registration Number (Optional)
              </Label>
              <Input
                id="agencyRegistrationNumber"
                placeholder="e.g., 12345678"
                value={formData.agencyRegistrationNumber}
                onChange={(e) =>
                  handleChange("agencyRegistrationNumber", e.target.value)
                }
              />
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Your official business registration or tax ID number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Contact Information</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agencyEmail" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Business Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="agencyEmail"
                type="email"
                placeholder="contact@yourbusiness.com"
                value={formData.agencyEmail}
                onChange={(e) => handleChange("agencyEmail", e.target.value)}
                className={errors.agencyEmail ? "border-destructive" : ""}
              />
              {errors.agencyEmail && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyEmail}
                </p>
              )}
            </div>

            {/* Phone Numbers Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Business Phone Numbers <span className="text-destructive">*</span>
              </Label>
              
              {/* Add New Phone */}
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPhone();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddPhone}
                  disabled={!newPhone.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Phone Numbers List */}
              {formData.phoneNumbers.length === 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-orange-800">
                    No phone numbers added yet. Add at least one to continue.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.phoneNumbers.map((phoneObj, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border ${
                        phoneObj.verified
                          ? "border-green-300 bg-green-50"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Phone Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{phoneObj.phone}</span>
                          {phoneObj.verified && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        {!phoneObj.verified && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePhone(index)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      {/* Verification Section */}
                      {phoneObj.verified ? (
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <p className="text-sm font-medium text-green-800">
                              Verified
                            </p>
                          </div>
                        </div>
                      ) : !phoneObj.otpSent ? (
                        <Button
                          type="button"
                          onClick={() => handleSendOtp(index)}
                          disabled={otpLoading}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          size="sm"
                        >
                          {otpLoading ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Sending...
                            </>
                          ) : (
                            "Send Verification Code"
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor={`otp-${index}`} className="text-sm">
                            Enter Verification Code
                          </Label>
                          <Input
                            id={`otp-${index}`}
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            value={phoneObj.otp}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => handleVerifyOtp(index)}
                              className="flex-1 bg-orange-600 hover:bg-orange-700"
                              size="sm"
                            >
                              Verify
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleResendOtp(index)}
                              variant="outline"
                              size="sm"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {errors.phoneNumbers && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phoneNumbers}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyAddress" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="agencyAddress"
                placeholder="Enter your complete business address"
                value={formData.agencyAddress}
                onChange={(e) => handleChange("agencyAddress", e.target.value)}
                rows={4}
                className={errors.agencyAddress ? "border-destructive" : ""}
              />
              {errors.agencyAddress && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyAddress}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Notice */}
        <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Info className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">Verification Required</p>
                <p className="text-xs sm:text-sm text-orange-800 leading-relaxed">
                  Your business profile will be submitted for verification after saving. You&apos;ll be notified once the verification process is complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/business-profile")}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
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
