import { FileCheck, User, Phone, Mail, Building2, MapPin, Video, CheckCircle2, Shield } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";

const Step5Review = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <FileCheck className="w-16 h-16 mx-auto text-orange-600 mb-4" />
          <div className="absolute -top-1 -right-1 bg-orange-100 rounded-full p-1.5">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Review & Submit</h3>
        <p className="text-sm text-gray-600">
          Please review your information before submitting
        </p>
        <Badge variant="secondary" className="mt-3">
          <span className="text-xs">Almost done!</span>
        </Badge>
      </div>

      {/* Profile Video/Image Preview */}
      <div className="flex justify-center mb-6">
        {formData.profileVideoPreview ? (
          <div className="relative group">
            <video
              src={formData.profileVideoPreview}
              className="w-32 h-32 rounded-full border-4 border-orange-300 shadow-xl object-cover hover:scale-105 transition-transform duration-300"
              muted
              loop
              autoPlay
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-500 text-white shadow-md">
                <Video className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-gray-300 shadow-lg">
            <User className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Information Cards */}
      <div className="space-y-3">
        {/* Personal Information Card */}
        <Card className="border-2 hover:border-orange-200 transition-colors duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-100 rounded-full p-2">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Personal Information</h4>
            </div>
            <div className="space-y-2 ml-10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-medium text-gray-900">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="border-2 hover:border-orange-200 transition-colors duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Contact Details</h4>
            </div>
            <div className="space-y-2 ml-10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Phone</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{formData.phone}</span>
                  {formData.phoneVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agency Information Card (if exists) */}
        {formData.agencyName && (
          <Card className="border-2 hover:border-orange-200 transition-colors duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Agency Information</h4>
              </div>
              <div className="space-y-2 ml-10">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Agency Name</span>
                  <span className="font-medium text-gray-900 text-right">{formData.agencyName}</span>
                </div>
                {formData.agencyEmail && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="font-medium text-gray-900 text-right">{formData.agencyEmail}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Card */}
        <Card className="border-2 hover:border-orange-200 transition-colors duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-100 rounded-full p-2">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Location</h4>
            </div>
            <div className="ml-10">
              <p className="text-sm text-gray-700">
                {formData.location.address || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submission Notice */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 rounded-full p-2 shrink-0">
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-900 mb-1">Ready for Verification</p>
            <p className="text-xs text-orange-700">
              Your profile will be submitted for verification. You will receive a notification 
              once the verification is complete. This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-green-800">Profile Complete</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <Phone className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-orange-800">Phone Verified</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <Video className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-purple-800">Video Added</p>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
