import { useState } from "react";

export const usePhoneVerification = (toast) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const sendOtp = (phone, onOtpGenerated) => {
    if (!phone?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);

    // Simulate OTP generation (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, you would call an API here to send the OTP via SMS
    setTimeout(() => {
      onOtpGenerated(otp);
      setOtpSent(true);
      setOtpLoading(false);

      toast({
        title: "OTP Sent",
        description: `Verification code: ${otp} (For testing only)`,
        duration: 10000,
      });

      console.log("Generated OTP (for testing):", otp);
    }, 1000);
  };

  const verifyOtp = (inputOtp, generatedOtp, onVerified, onError) => {
    if (!inputOtp?.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    if (inputOtp === generatedOtp) {
      onVerified();
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
    } else {
      onError();
      toast({
        title: "Error",
        description: "Invalid OTP. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const resendOtp = (phone, onReset) => {
    onReset();
    setOtpSent(false);
    sendOtp(phone, onReset);
  };

  return {
    otpSent,
    otpLoading,
    sendOtp,
    verifyOtp,
    resendOtp,
  };
};
