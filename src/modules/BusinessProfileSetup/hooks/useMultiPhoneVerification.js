import { useState } from "react";
import { apiCall } from "../../../lib/apiClient";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export const useMultiPhoneVerification = (toast) => {
  const [otpLoading, setOtpLoading] = useState(false);

  const sendOtp = async (phone, onOtpGenerated) => {
    if (!phone?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);

    try {
      // Call backend API to send OTP
      await apiCall(`${backendUrl}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      // For simulation, generate a dummy OTP
      const otp = "123456"; // In production, this won't be needed
      onOtpGenerated(otp);

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
        duration: 5000,
      });

      console.log(`OTP sent to ${phone}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async (phone, inputOtp, onVerified, onError) => {
    if (!inputOtp?.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate verification for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, uncomment this:
      // await apiCall(`${backendUrl}/api/otp/verify`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ phone, otp: inputOtp }),
      // });

      onVerified();
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      onError();
      toast({
        title: "Error",
        description: error.message || "Invalid OTP. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const resendOtp = async (phone, onReset) => {
    toast({
      title: "Resending OTP",
      description: `Sending new verification code to ${phone}`,
    });
    await sendOtp(phone, onReset);
  };

  return {
    otpLoading,
    sendOtp,
    verifyOtp,
    resendOtp,
  };
};
