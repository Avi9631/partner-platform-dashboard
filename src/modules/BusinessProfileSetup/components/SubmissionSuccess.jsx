import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  CheckCircle2,
  Home,
  Clock,
  Loader2,
  ArrowLeft,
  Mail,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/hooks/use-toast";

const SubmissionSuccess = ({ onGoHome, workflowId }) => {
  const { checkAuthStatus, user } = useAuth();
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [initialVerificationStatus] = useState(user?.verificationStatus); // Capture initial status

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Poll auth status every 10 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      setIsChecking(true);
      await checkAuthStatus();
      setIsChecking(false);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [checkAuthStatus]);

  // Watch for verification status change
  useEffect(() => {
    // Only trigger if status changed from non-APPROVED to APPROVED
    if (
      initialVerificationStatus !== "APPROVED" &&
      user?.verificationStatus === "APPROVED" &&
      !isVerified
    ) {
      setIsVerified(true);

      // Show success toast
      toast({
        title: "Business Verified! 🎉",
        description:
          "Your business profile has been successfully verified. Welcome aboard!",
        variant: "default",
      });

      // Redirect after 60 seconds
      setTimeout(() => {
        onGoHome();
      }, 60000);
    }
  }, [
    user?.verificationStatus,
    initialVerificationStatus,
    isVerified,
    onGoHome,
    toast,
  ]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-white/90 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="space-y-4 pb-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50/50 flex-shrink-0 border-b relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoHome}
          className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center text-center">
          <div className="relative inline-block">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4 transition-all duration-500 ${
                isVerified
                  ? "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 animate-bounce"
                  : "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 animate-in zoom-in"
              }`}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            {isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-900 bg-clip-text text-transparent">
            {isVerified ? "Business Verified!" : "Business Profile Submitted!"}
          </CardTitle>
          <CardDescription className="text-base mt-2 max-w-md">
            {isVerified
              ? "Your business profile has been verified. Redirecting to dashboard..."
              : "Your business profile has been successfully submitted for verification. Our team will review your information and contact you soon."}
          </CardDescription>
          {/* <div className="flex justify-center pt-3">
            <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-green-600 hover:bg-green-700" : ""}>
              {isVerified ? 'Verified ✓' : 'Under Review'}
            </Badge>
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6 flex-1 overflow-y-auto">
 

        {/* Verification Status Section */}
        {!isVerified ? (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 hover:border-purple-300 transition-colors duration-200 shadow-sm">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-purple-600 animate-pulse" />
                <span className="text-sm font-medium text-purple-900">
                  Checking verification status...
                </span>
              </div>
              <div className="text-4xl font-bold text-purple-700 tabular-nums">
                {formatTime(timeRemaining)}
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                {isChecking && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Polling for updates...</span>
                  </>
                )}
                {!isChecking && timeRemaining > 0 && (
                  <span>Auto-checking status every 10 seconds</span>
                )}
                {timeRemaining === 0 && (
                  <span className="text-amber-600">
                    Timer complete - Still checking...
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top duration-500">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 animate-pulse" />
                <span className="text-lg font-semibold text-green-900">
                  Verification Complete!
                </span>
              </div>
              <p className="text-sm text-green-700 text-center">
                Auto-redirecting in 60 seconds or click Dashboard button below
              </p>
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="h-5 w-5" />
                <span className="text-sm">
                  You can now access your dashboard
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <div className="bg-yellow-100 rounded-full p-1.5 shrink-0">
              <Mail className="w-4 h-4 text-yellow-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-yellow-900 mb-0.5">
                Important Notice
              </p>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Please ensure your email notifications are enabled and check
                your spam folder for updates from our team.
              </p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center border-t pt-4">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@partner-platform.com"
              className="text-orange-600 hover:underline font-medium"
            >
              support@partner-platform.com
            </a>
          </p>
        </div>
      </CardContent>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 border-t px-6 py-4 bg-gray-50/80">
        <div className="flex justify-between items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onGoHome}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={onGoHome}
            disabled={!isVerified}
            className={`flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isVerified ? "animate-pulse hover:scale-105" : ""
            }`}
          >
            <Home className="h-4 w-4" />
            {isVerified ? "Go to Dashboard" : "Dashboard"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionSuccess;
