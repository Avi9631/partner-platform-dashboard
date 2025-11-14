import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Building2 } from "lucide-react";

const Step2AgencyInfo = ({ formData, errors, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Building2 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Agency Information</h3>
        <p className="text-sm text-gray-600">
          Please provide your agency details
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyName">
          Agency Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="agencyName"
          placeholder="Enter your agency name"
          value={formData.agencyName || ""}
          onChange={(e) => handleChange("agencyName", e.target.value)}
          className={errors.agencyName ? "border-red-500" : ""}
        />
        {errors.agencyName && (
          <p className="text-sm text-red-500">{errors.agencyName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyRegistrationNumber">
          Registration Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="agencyRegistrationNumber"
          placeholder="Enter registration/license number"
          value={formData.agencyRegistrationNumber || ""}
          onChange={(e) => handleChange("agencyRegistrationNumber", e.target.value)}
          className={errors.agencyRegistrationNumber ? "border-red-500" : ""}
        />
        {errors.agencyRegistrationNumber && (
          <p className="text-sm text-red-500">{errors.agencyRegistrationNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyAddress">
          Agency Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="agencyAddress"
          placeholder="Enter your agency's complete address"
          value={formData.agencyAddress || ""}
          onChange={(e) => handleChange("agencyAddress", e.target.value)}
          className={errors.agencyAddress ? "border-red-500" : ""}
          rows={3}
        />
        {errors.agencyAddress && (
          <p className="text-sm text-red-500">{errors.agencyAddress}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyEmail">
          Agency Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="agencyEmail"
          type="email"
          placeholder="agency@example.com"
          value={formData.agencyEmail || ""}
          onChange={(e) => handleChange("agencyEmail", e.target.value)}
          className={errors.agencyEmail ? "border-red-500" : ""}
        />
        {errors.agencyEmail && (
          <p className="text-sm text-red-500">{errors.agencyEmail}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyPhone">
          Agency Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="agencyPhone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.agencyPhone || ""}
          onChange={(e) => handleChange("agencyPhone", e.target.value)}
          className={errors.agencyPhone ? "border-red-500" : ""}
        />
        {errors.agencyPhone && (
          <p className="text-sm text-red-500">{errors.agencyPhone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyWebsite">
          Agency Website (Optional)
        </Label>
        <Input
          id="agencyWebsite"
          type="url"
          placeholder="https://www.example.com"
          value={formData.agencyWebsite || ""}
          onChange={(e) => handleChange("agencyWebsite", e.target.value)}
          className={errors.agencyWebsite ? "border-red-500" : ""}
        />
        {errors.agencyWebsite && (
          <p className="text-sm text-red-500">{errors.agencyWebsite}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> All information will be verified during the approval process. 
          Please ensure all details are accurate and match your official agency documents.
        </p>
      </div>
    </div>
  );
};

export default Step2AgencyInfo;
