import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Loader2,
  Video,
  VideoOff,
  RefreshCw,
  User,
  ArrowRight,
  ArrowLeft,
  Shield,
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Step4ProfileImage = ({
  formData,
  errors,
  isCameraActive,
  cameraLoading,
  cameraError,
  videoRef,
  canvasRef,
  startCamera,
  stopCamera,
  retakePhoto,
  isRecording,
  recordingTime,
  startRecording,
  stopRecording,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left side: Camera/Video */}
        <div className="flex-1">
          {formData.profileVideoPreview ? (
            // Show recorded video preview
            <div className="relative group">
              <div className="w-64 h-64 rounded-2xl overflow-hidden border-3 border-green-400 bg-gray-900 shadow-xl transition-transform hover:scale-105 duration-300">
                <video
                  src={formData.profileVideoPreview}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
            </div>
          ) : isCameraActive ? (
            // Show live camera feed
            <div className="relative">
              <div className="  h-64 rounded-2xl overflow-hidden border-3 border-orange-400 bg-gray-900 shadow-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {isRecording && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                    REC {formatTime(recordingTime)}
                  </span>
                </div>
              )}

              {!isRecording && (
                <div className="mt-3 text-center">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg py-1.5 px-3 inline-block">
                    <p className="text-sm text-orange-600 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      {cameraLoading
                        ? "Loading camera..."
                        : "Position yourself in the frame"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show placeholder when camera is not active
            <div className="  h-64 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-3 border-dashed border-gray-300 shadow-inner">
              <div className="text-center">
                <User className="w-24 h-24 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">
                  Camera not started
                </p>
              </div>
            </div>
          )}

          <Alert className="mt-4 " variant="destructive">
            <Shield />
            <AlertTitle  className="text-sm">Privacy & Security</AlertTitle>
            <AlertDescription className="text-xs">
              Used only for verification. Stored securely with encryption.
            </AlertDescription>
          </Alert>
        </div>

        {/* Right side: Demo Video */}
        <div className="flex-1">

             <div className="  h-64 rounded-2xl overflow-hidden border-3 border-blue-400 bg-gray-900 shadow-xl mb-4">
              <div className="w-full h-full flex items-center justify-center">
                {/* Replace this with actual demo video URL */}
                <div className="text-center p-8">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                      <Video className="w-10 h-10 text-blue-300" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-ping"></div>
                  </div>
                  <p className="text-blue-200 text-sm font-semibold">
                    Demo Video
                  </p>
                  <p className="text-blue-300/70 text-xs mt-1">Coming soon</p>
                </div>
                {/* Uncomment and use when demo video is available:
                <video
                  src="/demo/head-movement-verification.mp4"
                  className="w-full h-full object-cover"
                  controls
                  poster="/demo/video-thumbnail.jpg"
                />
                */}
              </div>
            </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
        
         

            {/* Instructions */}
           

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-900 mb-2">
                Requirements:
              </p>
              <ul className="text-xs text-gray-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>Good lighting and clear face visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>Smooth head movements as shown</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>Keep face centered in frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>Video duration: 5-10 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Errors Section */}
      {(cameraError || errors.profileVideo) && (
        <div className="space-y-3">
          {cameraError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 w-full animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2 shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {cameraError}
                </p>
              </div>
            </div>
          )}

          {errors.profileVideo && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 w-full animate-in fade-in duration-200">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600 font-medium">
                  {errors.profileVideo}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {!formData.profileVideoPreview && !isCameraActive && (
          <Button
            type="button"
            onClick={startCamera}
            className="w-full h-10 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
            disabled={cameraLoading}
          >
            {cameraLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Camera...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        )}

        {isCameraActive && !isRecording && !formData.profileVideoPreview && (
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={startRecording}
              className="w-full h-10 text-sm font-medium bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={cameraLoading}
            >
              <Video className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
            <Button
              type="button"
              onClick={stopCamera}
              variant="outline"
              className="w-full h-10 text-sm font-medium"
            >
              <VideoOff className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}

        {isRecording && (
          <Button
            type="button"
            onClick={stopRecording}
            className="w-full h-10 text-sm font-medium bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 animate-pulse"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}

        {formData.profileVideoPreview && (
          <Button
            type="button"
            onClick={retakePhoto}
            variant="outline"
            className="w-full h-10 text-sm font-medium border-2 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Step4ProfileImage;
