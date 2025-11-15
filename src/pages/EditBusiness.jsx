import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { apiCall } from "@/lib/apiClient";
import { ArrowLeft, Save, Building2 } from "lucide-react";

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

        if (userData.accountType !== "AGENCY") {
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
          accountType: "AGENCY",
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
  if (!user || user.accountType !== "AGENCY") {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/business-profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Edit Business Profile</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agencyName"
                placeholder="Enter your business name"
                value={formData.agencyName}
                onChange={(e) => handleChange("agencyName", e.target.value)}
                className={errors.agencyName ? "border-red-500" : ""}
              />
              {errors.agencyName && (
                <p className="text-sm text-red-500">{errors.agencyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyRegistrationNumber">
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
              <p className="text-sm text-muted-foreground">
                Your official business registration or tax ID number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyEmail">
                Business Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agencyEmail"
                type="email"
                placeholder="contact@yourbusiness.com"
                value={formData.agencyEmail}
                onChange={(e) => handleChange("agencyEmail", e.target.value)}
                className={errors.agencyEmail ? "border-red-500" : ""}
              />
              {errors.agencyEmail && (
                <p className="text-sm text-red-500">{errors.agencyEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyPhone">Business Phone (Optional)</Label>
              <Input
                id="agencyPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.agencyPhone}
                onChange={(e) => handleChange("agencyPhone", e.target.value)}
                className={errors.agencyPhone ? "border-red-500" : ""}
              />
              {errors.agencyPhone && (
                <p className="text-sm text-red-500">{errors.agencyPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyAddress">
                Business Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="agencyAddress"
                placeholder="Enter your complete business address"
                value={formData.agencyAddress}
                onChange={(e) => handleChange("agencyAddress", e.target.value)}
                rows={4}
                className={errors.agencyAddress ? "border-red-500" : ""}
              />
              {errors.agencyAddress && (
                <p className="text-sm text-red-500">{errors.agencyAddress}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Verification Required</p>
                <p>
                  Your business profile will be submitted for verification after
                  saving. You&apos;ll be notified once the verification process is
                  complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/business-profile")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
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
  );
}
