import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Building2 } from "lucide-react";

const Step1BusinessInfo = ({ formData, errors, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Building2 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Business Details</h3>
        <p className="text-sm text-gray-600">
          Please provide accurate business information for verification
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">
          Business Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessName"
          placeholder="Enter your business name"
          value={formData.businessName}
          onChange={(e) => handleChange("businessName", e.target.value)}
          className={errors.businessName ? "border-red-500" : ""}
        />
        {errors.businessName && (
          <p className="text-sm text-red-500">{errors.businessName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationNumber">
          Registration Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="registrationNumber"
          placeholder="Enter business registration number"
          value={formData.registrationNumber}
          onChange={(e) => handleChange("registrationNumber", e.target.value)}
          className={errors.registrationNumber ? "border-red-500" : ""}
        />
        {errors.registrationNumber && (
          <p className="text-sm text-red-500">{errors.registrationNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress">
          Business Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="businessAddress"
          placeholder="Enter complete business address"
          value={formData.businessAddress}
          onChange={(e) => handleChange("businessAddress", e.target.value)}
          className={errors.businessAddress ? "border-red-500" : ""}
          rows={3}
        />
        {errors.businessAddress && (
          <p className="text-sm text-red-500">{errors.businessAddress}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessEmail">
          Business Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessEmail"
          type="email"
          placeholder="business@example.com"
          value={formData.businessEmail}
          onChange={(e) => handleChange("businessEmail", e.target.value)}
          className={errors.businessEmail ? "border-red-500" : ""}
        />
        {errors.businessEmail && (
          <p className="text-sm text-red-500">{errors.businessEmail}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> All information will be verified. Please ensure 
          all details match your official business registration documents.
        </p>
      </div>
    </div>
  );
};

export default Step1BusinessInfo;
