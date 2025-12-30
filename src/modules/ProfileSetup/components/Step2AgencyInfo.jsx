import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Building2, FileText, MapPin, Mail, Phone as PhoneIcon, Globe, CheckCircle2, AlertCircle } from "lucide-react";

const Step2AgencyInfo = ({ formData, errors, handleChange }) => {
  // Validation helpers
  const isAgencyNameValid = formData.agencyName && !errors.agencyName;
  const isRegistrationValid = formData.agencyRegistrationNumber && !errors.agencyRegistrationNumber;
  const isAddressValid = formData.agencyAddress && !errors.agencyAddress;
  const isEmailValid = formData.agencyEmail && !errors.agencyEmail;
  const isPhoneValid = formData.agencyPhone && !errors.agencyPhone;

  return (
    <div className="space-y-6">
      {/* <div className="text-center mb-6">
        <div className="relative inline-block">
          <Building2 className="w-16 h-16 mx-auto text-orange-600 mb-4" />
          <div className="absolute -top-1 -right-1 bg-orange-100 rounded-full p-1.5">
            <FileText className="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Agency Information</h3>
        <p className="text-sm text-gray-600">
          Tell us about your real estate agency
        </p>
        <Badge variant="secondary" className="mt-3">
          <span className="text-xs">Business verification required</span>
        </Badge>
      </div> */}

      <div className="space-y-2 group">
        <Label htmlFor="agencyName" className="text-sm font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          Agency Name <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="agencyName"
            placeholder="ABC Real Estate LLC"
            value={formData.agencyName || ""}
            onChange={(e) => handleChange("agencyName", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.agencyName 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isAgencyNameValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.agencyName && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isAgencyNameValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.agencyName && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyName}</p>
          </div>
        )}
        {isAgencyNameValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Agency name looks good!
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="agencyRegistrationNumber" className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          Registration Number <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="agencyRegistrationNumber"
            placeholder="REG-123456789"
            value={formData.agencyRegistrationNumber || ""}
            onChange={(e) => handleChange("agencyRegistrationNumber", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.agencyRegistrationNumber 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isRegistrationValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.agencyRegistrationNumber && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isRegistrationValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.agencyRegistrationNumber && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyRegistrationNumber}</p>
          </div>
        )}
        {isRegistrationValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Valid registration number
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="agencyAddress" className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          Agency Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="agencyAddress"
          placeholder="123 Main Street, Suite 100&#10;City, State, ZIP Code&#10;Country"
          value={formData.agencyAddress || ""}
          onChange={(e) => handleChange("agencyAddress", e.target.value)}
          className={`
            transition-all duration-200
            ${errors.agencyAddress 
              ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
              : isAddressValid
              ? "border-green-500 focus:ring-green-200 bg-green-50/20"
              : "focus:ring-orange-200"
            }
          `}
          rows={3}
        />
        {errors.agencyAddress && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyAddress}</p>
          </div>
        )}
        {isAddressValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Complete address provided
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="agencyEmail" className="text-sm font-medium flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          Agency Email <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="agencyEmail"
            type="email"
            placeholder="contact@youragency.com"
            value={formData.agencyEmail || ""}
            onChange={(e) => handleChange("agencyEmail", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.agencyEmail 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isEmailValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.agencyEmail && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isEmailValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.agencyEmail && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyEmail}</p>
          </div>
        )}
        {isEmailValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Valid email format
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="agencyPhone" className="text-sm font-medium flex items-center gap-2">
          <PhoneIcon className="w-4 h-4 text-gray-500" />
          Agency Phone <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="agencyPhone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.agencyPhone || ""}
            onChange={(e) => handleChange("agencyPhone", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.agencyPhone 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isPhoneValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.agencyPhone && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isPhoneValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.agencyPhone && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyPhone}</p>
          </div>
        )}
        {isPhoneValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Valid phone number
          </p>
        )}
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="agencyWebsite" className="text-sm font-medium flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          Agency Website
          <Badge variant="outline" className="ml-1 text-xs">Optional</Badge>
        </Label>
        <div className="relative">
          <Input
            id="agencyWebsite"
            type="url"
            placeholder="https://www.youragency.com"
            value={formData.agencyWebsite || ""}
            onChange={(e) => handleChange("agencyWebsite", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.agencyWebsite 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : formData.agencyWebsite && !errors.agencyWebsite
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.agencyWebsite && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {formData.agencyWebsite && !errors.agencyWebsite && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.agencyWebsite && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.agencyWebsite}</p>
          </div>
        )}
        {formData.agencyWebsite && !errors.agencyWebsite && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Valid URL format
          </p>
        )}
      </div>

      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 rounded-full p-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm text-orange-800">
            <p className="font-medium mb-1">Verification Required</p>
            <p className="text-xs text-orange-700">
              All information will be verified during the approval process. 
              Please ensure all details are accurate and match your official agency documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2AgencyInfo;
