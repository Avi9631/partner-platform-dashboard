import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Mail, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/hooks/use-toast";

const SubmissionSuccess = ({ onGoHome, workflowId }) => {
  const { checkAuthStatus, user } = useAuth();
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [initialProfileStatus] = useState(user?.profileCompleted); // Capture initial status

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

  // Watch for profile completion status change
  useEffect(() => {
    // Only trigger redirect if profile was NOT completed initially but is now completed
    if (!initialProfileStatus && user?.profileCompleted && !isVerified) {
      setIsVerified(true);
      
      // Show success toast
      toast({
        title: "Account Verified! 🎉",
        description: "Your profile has been successfully verified. Welcome aboard!",
        variant: "default",
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        onGoHome();
      }, 3000);
    }
  }, [user?.profileCompleted, initialProfileStatus, isVerified, onGoHome, toast]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`rounded-full p-3 ${isVerified ? 'bg-green-100' : 'bg-green-100'}`}>
              <CheckCircle2 className={`h-16 w-16 ${isVerified ? 'text-green-600 animate-bounce' : 'text-green-600'}`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            {isVerified ? 'Verification Successful!' : 'Profile Submitted Successfully!'}
          </CardTitle>
          <CardDescription className="text-base">
            {isVerified 
              ? 'Your profile has been verified. Redirecting to dashboard...' 
              : 'Your profile has been submitted for verification'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What's Next Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              What happens next?
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Our team will review your profile and verification video</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>You&apos;ll receive an email notification within 24-48 hours</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Once approved, you&apos;ll have full access to all partner features</span>
              </li>
            </ol>
          </div>

          {/* Current Status */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Mail className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-amber-900">Current Status</h3>
            </div>
            <p className="text-sm text-amber-800">
              <span className="font-medium">Pending Verification</span>
              <br />
              Your profile is currently under review by our verification team.
            </p>
            {workflowId && (
              <p className="text-xs text-amber-600 mt-2">
                Tracking ID: {workflowId}
              </p>
            )}
          </div>

          {/* Email Notification */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>
              📧 A confirmation email has been sent to your registered email address
            </p>
          </div>

          {/* Verification Timer or Success Message */}
          {!isVerified ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
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
                    <span className="text-amber-600">Timer complete - Still checking...</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600 animate-pulse" />
                  <span className="text-lg font-semibold text-green-900">
                    Verification Complete!
                  </span>
                </div>
                <p className="text-sm text-green-700 text-center">
                  Redirecting you to the dashboard in 3 seconds...
                </p>
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              </div>
            </div>
          )}

          {/* Help Text */}
          <p className="text-xs text-center text-gray-500">
            Need help? Contact our support team at support@partner-platform.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;
