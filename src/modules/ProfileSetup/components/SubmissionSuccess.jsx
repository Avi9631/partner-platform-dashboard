import { CheckCircle2, Clock, Mail, Home } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const SubmissionSuccess = ({ onGoHome, workflowId }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Profile Submitted Successfully!
          </CardTitle>
          <CardDescription className="text-base">
            Your profile has been submitted for verification
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

          {/* Action Button */}
          <Button 
            onClick={onGoHome} 
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>

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
