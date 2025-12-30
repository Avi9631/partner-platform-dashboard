import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Loader2, RefreshCw, Phone, Plus, Trash2, CheckCircle2 } from "lucide-react";

const Step2MultiPhoneVerification = ({
  formData,
  errors,
  handleChange,
  phoneVerification,
}) => {
  const [newPhone, setNewPhone] = useState("");
  const [currentVerifying, setCurrentVerifying] = useState(null); // Index of phone being verified

  const handleAddPhone = () => {
    if (!newPhone.trim()) {
      return;
    }

    // Validate phone format
    if (!/^[+]?[\d\s\-()]+$/.test(newPhone)) {
      return;
    }

    // Check if phone already exists
    const exists = formData.phoneNumbers.some(p => p.phone === newPhone);
    if (exists) {
      return;
    }

    const updatedPhones = [
      ...formData.phoneNumbers,
      {
        phone: newPhone,
        verified: false,
        otp: "",
        generatedOtp: "",
        otpSent: false,
      },
    ];

    handleChange("phoneNumbers", updatedPhones);
    setNewPhone("");
  };

  const handleRemovePhone = (index) => {
    const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
    handleChange("phoneNumbers", updatedPhones);
    if (currentVerifying === index) {
      setCurrentVerifying(null);
    }
  };

  const handleSendOtp = (index) => {
    const phone = formData.phoneNumbers[index];
    phoneVerification.sendOtp(phone.phone, (otp) => {
      const updatedPhones = [...formData.phoneNumbers];
      updatedPhones[index] = {
        ...updatedPhones[index],
        generatedOtp: otp,
        otpSent: true,
      };
      handleChange("phoneNumbers", updatedPhones);
      setCurrentVerifying(index);
    });
  };

  const handleVerifyOtp = (index) => {
    const phone = formData.phoneNumbers[index];
    phoneVerification.verifyOtp(
      phone.phone,
      phone.otp,
      () => {
        const updatedPhones = [...formData.phoneNumbers];
        updatedPhones[index] = {
          ...updatedPhones[index],
          verified: true,
        };
        handleChange("phoneNumbers", updatedPhones);
        setCurrentVerifying(null);
      },
      () => {
        // Error callback handled by hook
      }
    );
  };

  const handleResendOtp = (index) => {
    const phone = formData.phoneNumbers[index];
    phoneVerification.resendOtp(phone.phone, (otp) => {
      const updatedPhones = [...formData.phoneNumbers];
      updatedPhones[index] = {
        ...updatedPhones[index],
        otp: "",
        generatedOtp: otp,
        otpSent: true,
      };
      handleChange("phoneNumbers", updatedPhones);
    });
  };

  const handleOtpChange = (index, value) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index] = {
      ...updatedPhones[index],
      otp: value.replace(/\D/g, ""),
    };
    handleChange("phoneNumbers", updatedPhones);
  };

  return (
    <div className="space-y-4">
      {/* <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Verify Business Phone Numbers</h3>
        <p className="text-sm text-gray-600">
          Add and verify all business phone numbers
        </p>
      </div> */}

      {/* Add New Phone */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <Label htmlFor="newPhone">Add Phone Number</Label>
        <div className="flex gap-2">
          <Input
            id="newPhone"
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
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="space-y-3">
        {formData.phoneNumbers.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              No phone numbers added yet. Add at least one phone number to continue.
            </p>
          </div>
        ) : (
          formData.phoneNumbers.map((phone, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 space-y-3 ${
                phone.verified
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Phone Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{phone.phone}</span>
                  {phone.verified && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
                {!phone.verified && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePhone(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              {/* Verification Section */}
              {phone.verified ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Verified
                    </p>
                  </div>
                </div>
              ) : !phone.otpSent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
                  <p className="text-sm text-blue-800 text-center">
                    Click below to receive a verification code
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleSendOtp(index)}
                    disabled={phoneVerification.otpLoading}
                    className="w-full"
                    size="sm"
                  >
                    {phoneVerification.otpLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <Label htmlFor={`otp-${index}`} className="text-sm font-medium">
                    Enter Verification Code
                  </Label>
                  <Input
                    id={`otp-${index}`}
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={phone.otp}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="bg-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleVerifyOtp(index)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      size="sm"
                      disabled={!phone.otp?.trim()}
                    >
                      Verify Code
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleResendOtp(index)}
                      variant="outline"
                      size="sm"
                      title="Resend OTP"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {errors.phoneNumbers && (
        <p className="text-sm text-red-500 text-center">{errors.phoneNumbers}</p>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> You can add multiple phone numbers for your business. 
          All numbers must be verified before proceeding.
        </p>
      </div>
    </div>
  );
};

export default Step2MultiPhoneVerification;
