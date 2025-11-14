import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { FileCheck, User } from "lucide-react";

const Step5Review = ({ formData }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <FileCheck className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
        <p className="text-sm text-gray-600">
          Please review your information before submitting
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-center mb-4">
          {formData.profileImagePreview ? (
            <Avatar className="w-24 h-24 border-4 border-blue-200">
              <AvatarImage src={formData.profileImagePreview} alt="Profile" />
              <AvatarFallback>
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="border-b pb-2">
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium">
              {formData.firstName} {formData.lastName}
            </p>
          </div>

          <div className="border-b pb-2">
            <p className="text-xs text-gray-500">Phone</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{formData.phone}</p>
              {formData.phoneVerified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="border-b pb-2">
            <p className="text-xs text-gray-500">Account Type</p>
            <p className="font-medium">{formData.accountType}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium text-sm">
              {formData.location.address || "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your profile will be submitted for verification.
          You will receive a notification once the verification is complete.
        </p>
      </div>
    </div>
  );
};

export default Step5Review;
