import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Building2, FileText, MapPin, Mail, CheckCircle2, AlertCircle } from "lucide-react";

const Step1BusinessInfo = ({ formData, errors, handleChange }) => {
  // Validation helpers
  const isBusinessNameValid = formData.businessName && !errors.businessName;
  const isRegistrationValid = formData.registrationNumber && !errors.registrationNumber;
  const isAddressValid = formData.businessAddress && !errors.businessAddress;
  const isEmailValid = formData.businessEmail && !errors.businessEmail;

  return (
    <div className="space-y-6">
      {/* Business Name Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="businessName" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <Building2 className="w-4 h-4 text-gray-500" />
          Business Name 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.businessName 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isBusinessNameValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-blue-200"
              }
            `}
          />
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.businessName && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isBusinessNameValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.businessName && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.businessName}</p>
          </div>
        )}
        {isBusinessNameValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Registration Number Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="registrationNumber" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          Registration Number 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="registrationNumber"
            placeholder="Enter business registration number"
            value={formData.registrationNumber}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.registrationNumber 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isRegistrationValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-blue-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.registrationNumber && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isRegistrationValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.registrationNumber && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.registrationNumber}</p>
          </div>
        )}
        {isRegistrationValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Business Address Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="businessAddress" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-gray-500" />
          Business Address 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Textarea
            id="businessAddress"
            placeholder="Enter complete business address"
            value={formData.businessAddress}
            onChange={(e) => handleChange("businessAddress", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.businessAddress 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isAddressValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-blue-200"
              }
            `}
            rows={3}
          />
          <div className="absolute right-3 top-3">
            {errors.businessAddress && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isAddressValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.businessAddress && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.businessAddress}</p>
          </div>
        )}
        {isAddressValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Business Email Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="businessEmail" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <Mail className="w-4 h-4 text-gray-500" />
          Business Email 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="businessEmail"
            type="email"
            placeholder="business@example.com"
            value={formData.businessEmail}
            onChange={(e) => handleChange("businessEmail", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.businessEmail 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isEmailValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-blue-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.businessEmail && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isEmailValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.businessEmail && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.businessEmail}</p>
          </div>
        )}
        {isEmailValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2 shrink-0">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Verification Required</p>
            <p className="text-xs text-blue-700">
              All information will be verified. Please ensure all details match 
              your official business registration documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BusinessInfo;
