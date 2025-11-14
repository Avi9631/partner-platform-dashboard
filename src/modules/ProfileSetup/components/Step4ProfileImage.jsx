import { Button } from "../../../components/ui/button";
import { Loader2, Video, VideoOff, RefreshCw, User, ArrowRight, ArrowLeft } from "lucide-react";

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Video className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Record Verification Video</h3>
        <p className="text-sm text-gray-600">
          Record a short video following the instructions
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {formData.profileVideoPreview ? (
          // Show recorded video preview
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-green-400 bg-gray-900 shadow-lg">
              <video
                src={formData.profileVideoPreview}
                className="w-full h-full object-cover"
                controls
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                ✓ Recorded
              </span>
            </div>
          </div>
        ) : isCameraActive ? (
          // Show live camera feed in circular frame
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 bg-gray-900 shadow-lg">
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
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  REC {formatTime(recordingTime)}
                </span>
              </div>
            )}
            
            <div className="mt-3 text-center">
              {!isRecording ? (
                <p className="text-xs text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-200">
                  {cameraLoading ? "Loading camera..." : "Position yourself in the circle"}
                </p>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full max-w-sm">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Follow these steps:</p>
                  <div className="space-y-2 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>1. Move your head from <strong>left to right</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      <span>2. Move your head from <strong>right to left</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show placeholder when camera is not active
          <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
            <User className="w-24 h-24 text-gray-400" />
          </div>
        )}

        {cameraError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
            <p className="text-sm text-red-700 text-center">{cameraError}</p>
          </div>
        )}

        {errors.profileVideo && (
          <p className="text-sm text-red-500 text-center">{errors.profileVideo}</p>
        )}

        <div className="w-full space-y-2">
          {!formData.profileVideoPreview && !isCameraActive && (
            <Button
              type="button"
              onClick={startCamera}
              className="w-full"
              disabled={cameraLoading}
            >
              {cameraLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Camera...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Start Camera
                </>
              )}
            </Button>
          )}

          {isCameraActive && !isRecording && (
            <>
              <Button type="button" onClick={startRecording} className="w-full bg-red-600 hover:bg-red-700">
                <Video className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
              <Button
                type="button"
                onClick={stopCamera}
                variant="outline"
                className="w-full"
              >
                <VideoOff className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}

          {isRecording && (
            <Button type="button" onClick={stopRecording} className="w-full bg-green-600 hover:bg-green-700">
              <Video className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}

          {formData.profileVideoPreview && (
            <Button
              type="button"
              onClick={retakePhoto}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Record Again
            </Button>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 w-full">
          <p className="text-xs text-gray-600 text-center mb-2">
            <strong>Instructions:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Ensure your face is clearly visible and well-lit</li>
            <li>• Follow the head movement instructions during recording</li>
            <li>• Recording will be approximately 5-10 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step4ProfileImage;
