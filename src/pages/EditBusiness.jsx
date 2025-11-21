import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { apiCall } from "@/lib/apiClient";
import { ArrowLeft, Save, Building2, Mail, Phone, MapPin, FileText, AlertCircle, Info } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function EditBusiness() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyRegistrationNumber: "",
    agencyAddress: "",
    agencyEmail: "",
    agencyPhone: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        setLoading(true);

        const userResponse = await apiCall(`${backendUrl}/partnerUser/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userData = userResponse.data.user;
        setUser(userData);

        if (userData.accountType !== "BUSINESS") {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Business profile is only available for Agency accounts",
          });
          navigate("/profile");
          return;
        }

        if (userResponse.data.business) {
          const business = userResponse.data.business;
          setFormData({
            agencyName: business.businessName || "",
            agencyRegistrationNumber: business.registrationNumber || "",
            agencyAddress: business.businessAddress || "",
            agencyEmail: business.businessEmail || "",
            agencyPhone:
              typeof business.businessPhone === "object"
                ? business.businessPhone.number || ""
                : business.businessPhone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadBusinessProfile();
  }, [toast, navigate]);



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

    if (formData.agencyPhone && !/^[+]?[\d\s\-()]+$/.test(formData.agencyPhone)) {
      newErrors.agencyPhone = "Invalid phone number format";
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

      // Update user with business info
      await apiCall(`${backendUrl}/partnerUser/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountType: "BUSINESS",
          ...formData,
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

  // If not an agency account (shouldn't reach here due to redirect in useEffect)
  if (!user || user.accountType !== "BUSINESS") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/business-profile")}
              className="hover:bg-white/20 text-white h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Edit Business Profile</h1>
              <p className="text-blue-100 text-sm md:text-base">Update your business information and details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        {/* Business Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Information</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agencyName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agencyName"
                placeholder="Enter your business name"
                value={formData.agencyName}
                onChange={(e) => handleChange("agencyName", e.target.value)}
                className={`h-12 ${errors.agencyName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.agencyName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyRegistrationNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
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
                className="h-12"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Your official business registration or tax ID number
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agencyEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Business Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agencyEmail"
                type="email"
                placeholder="contact@yourbusiness.com"
                value={formData.agencyEmail}
                onChange={(e) => handleChange("agencyEmail", e.target.value)}
                className={`h-12 ${errors.agencyEmail ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.agencyEmail && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyEmail}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Business Phone (Optional)
              </Label>
              <Input
                id="agencyPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.agencyPhone}
                onChange={(e) => handleChange("agencyPhone", e.target.value)}
                className={`h-12 ${errors.agencyPhone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.agencyPhone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyPhone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyAddress" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="agencyAddress"
                placeholder="Enter your complete business address"
                value={formData.agencyAddress}
                onChange={(e) => handleChange("agencyAddress", e.target.value)}
                rows={4}
                className={`${errors.agencyAddress ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.agencyAddress && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agencyAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Verification Required</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  Your business profile will be submitted for verification after saving. You&apos;ll be notified once the verification process is complete. This ensures the authenticity and credibility of all business profiles on our platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/business-profile")}
            disabled={saving}
            className="h-12 px-8 text-base font-semibold"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="h-12 px-10 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50"
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
  );
}
