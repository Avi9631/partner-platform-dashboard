import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Mail, Loader2, Home, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/hooks/use-toast";

const SubmissionSuccess = ({ onGoHome, workflowId }) => {
  const { checkAuthStatus, user } = useAuth();
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
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
      
      // Redirect after 60 seconds
      setTimeout(() => {
        onGoHome();
      }, 60000);
    }
  }, [user?.profileCompleted, initialProfileStatus, isVerified, onGoHome, toast]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full h-full sm:h-full flex flex-col overflow-hidden sm:rounded-lg sm:shadow-lg">
        {/* Fixed Header */}
        <CardHeader className="space-y-4 flex-shrink-0 text-center border-b">
          <div className="flex justify-center">
            <div className="relative inline-block">
              <div className={`rounded-full p-3 ${isVerified ? 'bg-green-100' : 'bg-green-100'}`}>
                <CheckCircle2 className={`h-16 w-16 ${isVerified ? 'text-green-600 animate-bounce' : 'text-green-600'}`} />
              </div>
              {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerified ? 'Verification Successful!' : 'Profile Submitted Successfully!'}
          </CardTitle>
          <CardDescription className="text-base">
            {isVerified 
              ? 'Your profile has been verified. Redirecting to dashboard...' 
              : 'Your profile has been submitted for verification'}
          </CardDescription>
          <div className="flex justify-center pt-2">
            <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-green-600" : ""}>
              {isVerified ? 'Verified' : 'Under Review'}
            </Badge>
          </div>
        </CardHeader>
        
        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-y-auto space-y-6 pt-6">
          {/* What's Next Section */}
         

          {/* Current Status */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 hover:border-amber-300 transition-colors duration-200">
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
              <p className="text-xs text-amber-600 mt-2 font-mono">
                Tracking ID: {workflowId}
              </p>
            )}
          </div>

          {/* Email Notification */}
         

          {/* Verification Timer or Success Message */}
          {!isVerified ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 hover:border-purple-300 transition-colors duration-200">
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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
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
                  <span className="text-sm">You can now access your dashboard</span>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center border-t pt-4">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@partner-platform.com" className="text-orange-600 hover:underline">
                support@partner-platform.com
              </a>
            </p>
          </div>
        </CardContent>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={onGoHome}
              disabled={!isFailed}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={onGoHome}
              disabled={!isVerified}
              className={`flex items-center gap-2 ${isVerified ? 'animate-pulse' : ''}`}
            >
              <Home className="h-4 w-4" />
              {isVerified ? 'Go to Dashboard' : 'Dashboard'}
            </Button>
          </div>
        </div>
      </Card>
  );
};

export default SubmissionSuccess;
