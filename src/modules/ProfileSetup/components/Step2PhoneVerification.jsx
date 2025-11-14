import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Loader2, RefreshCw } from "lucide-react";

const Step2PhoneVerification = ({
  formData,
  errors,
  otpSent,
  otpLoading,
  handleChange,
  sendOtp,
  verifyOtp,
  resendOtp,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">📱</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Verify Phone Number</h3>
        <p className="text-sm text-gray-600">
          We&apos;ll send a verification code to {formData.phone}
        </p>
      </div>

      {formData.phoneVerified ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <p className="font-medium text-green-900">Phone Number Verified</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 text-center">
                  Click the button below to receive a verification code
                </p>
              </div>
              <Button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading}
                className="w-full"
              >
                {otpLoading ? (
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => handleChange("otp", e.target.value.replace(/\D/g, ""))}
                  className={errors.otp ? "border-red-500" : ""}
                />
                {errors.otp && (
                  <p className="text-sm text-red-500">{errors.otp}</p>
                )}
              </div>

              <Button type="button" onClick={verifyOtp} className="w-full">
                Verify Code
              </Button>

              <Button
                type="button"
                onClick={resendOtp}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2PhoneVerification;
