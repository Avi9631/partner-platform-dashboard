import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { User, Phone, CheckCircle2, AlertCircle, UserCircle } from "lucide-react";

const Step1PersonalInfo = ({ formData, errors, handleChange }) => {
  // Validation helpers
  const isFirstNameValid = formData.firstName && !errors.firstName;
  const isLastNameValid = formData.lastName && !errors.lastName;
  const isPhoneValid = formData.phone && !errors.phone;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {/* <div className="text-center mb-6">
        <div className="relative inline-block">
          <UserCircle className="w-16 h-16 mx-auto text-orange-600 mb-4" />
          <div className="absolute -top-1 -right-1 bg-orange-100 rounded-full p-1">
            <User className="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">
          Let's start with your basic details
        </p>
        <Badge variant="secondary" className="mt-3">
          <span className="text-xs">All fields are required</span>
        </Badge>
      </div> */}

      {/* First Name Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="firstName" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <User className="w-4 h-4 text-gray-500" />
          First Name 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.firstName 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isFirstNameValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.firstName && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isFirstNameValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.firstName && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.firstName}</p>
          </div>
        )}
        {isFirstNameValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Last Name Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="lastName" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <User className="w-4 h-4 text-gray-500" />
          Last Name 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.lastName 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isLastNameValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.lastName && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isLastNameValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.lastName && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.lastName}</p>
          </div>
        )}
        {isLastNameValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            Looks good!
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2 group">
        <Label 
          htmlFor="phone" 
          className="text-sm font-medium flex items-center gap-2"
        >
          <Phone className="w-4 h-4 text-gray-500" />
          Phone Number 
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`
              pl-3 pr-10 transition-all duration-200
              ${errors.phone 
                ? "border-red-500 focus:ring-red-200 bg-red-50/50" 
                : isPhoneValid
                ? "border-green-500 focus:ring-green-200 bg-green-50/20"
                : "focus:ring-orange-200"
              }
            `}
          />
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {errors.phone && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
            )}
            {isPhoneValid && (
              <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
            )}
          </div>
        </div>
        {errors.phone && (
          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.phone}</p>
          </div>
        )}
        {isPhoneValid && (
          <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            We'll send a verification code to this number
          </p>
        )}
        {!errors.phone && !isPhoneValid && (
          <p className="text-xs text-gray-500">
            Include country code (e.g., +1 for US)
          </p>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 rounded-full p-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm text-orange-800">
            <p className="font-medium mb-1">Why do we need this?</p>
            <p className="text-xs text-orange-700">
              Your personal information helps us verify your identity and provide better service.
              We take your privacy seriously and will never share your data without permission.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="accountType">
          Account Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.accountType}
          onValueChange={(value) => handleChange("accountType", value)}
        >
          <SelectTrigger id="accountType">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
            <SelectItem value="BUSINESS">Agency</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
    </div>
  );
};

export default Step1PersonalInfo;
