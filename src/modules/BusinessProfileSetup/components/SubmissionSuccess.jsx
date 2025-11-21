import { Button } from "../../../components/ui/button";
import { CheckCircle2, Home, Clock } from "lucide-react";

const SubmissionSuccess = ({ onGoHome, workflowId }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 text-center">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Business Profile Submitted!
      </h2>

      <p className="text-gray-600 mb-6 max-w-md">
        Your business profile has been successfully submitted for verification. 
        Our team will review your information and contact you soon.
      </p>

      {workflowId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md w-full">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Verification in Progress
              </p>
              <p className="text-xs text-blue-700 mb-2">
                Your submission is being processed. Reference ID:
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 text-blue-800 block break-all">
                {workflowId}
              </code>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          What happens next?
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Our team will verify your business documents and information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>We&apos;ll validate the provided phone numbers and owner identity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>You&apos;ll receive an email notification once verification is complete</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>This process typically takes 1-3 business days</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md w-full">
        <p className="text-xs text-yellow-800">
          <strong>Important:</strong> Please ensure your email notifications are enabled 
          and check your spam folder for updates from our team.
        </p>
      </div>

      <Button onClick={onGoHome} size="lg" className="w-full max-w-xs">
        <Home className="mr-2 h-5 w-5" />
        Go to Dashboard
      </Button>
    </div>
  );
};

export default SubmissionSuccess;
