import { useState, useRef, useEffect } from "react";

export const useCamera = (toast) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const startCamera = async () => {
    console.log("=== startCamera function called ===");
    setCameraError(null);
    setCameraLoading(true);

    // Force a re-render by updating state immediately
    setTimeout(() => {
      console.log("Setting isCameraActive to true");
      setIsCameraActive(true);
    }, 0);

    try {
      console.log("Starting camera...");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported by this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      console.log("Camera stream obtained:", stream);
      console.log("Video ref current:", videoRef.current);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        console.log("Stream assigned to video element");

        // Wait for video to be ready and play
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current
            .play()
            .then(() => {
              console.log("Video playing successfully");
              setCameraLoading(false);
              toast({
                title: "Camera Active",
                description: "Camera started successfully",
              });
            })
            .catch((err) => {
              console.error("Error playing video:", err);
              setCameraLoading(false);
              toast({
                title: "Error",
                description: "Failed to play video stream",
                variant: "destructive",
              });
            });
        };
      } else {
        console.error("Video ref is null - video element not mounted!");
        setCameraLoading(false);
        setIsCameraActive(false);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraLoading(false);
      setIsCameraActive(false);

      let errorMessage =
        "Unable to access camera. Please ensure camera permissions are granted.";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Camera access denied. Please allow camera permissions in your browser.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on your device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application.";
      }

      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = (onCapture) => {
    if (!videoRef.current || !canvasRef.current) {
      toast({
        title: "Error",
        description: "Camera not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if video is actually playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      toast({
        title: "Error",
        description: "Video not ready. Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create file from blob
          const file = new File([blob], `profile-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          // Create preview URL
          const previewUrl = URL.createObjectURL(blob);

          onCapture(file, previewUrl);

          // Stop camera after capture
          stopCamera();

          toast({
            title: "Success",
            description: "Photo captured successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to capture photo. Please try again.",
            variant: "destructive",
          });
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      toast({
        title: "Error",
        description: "Camera not active. Please start camera first.",
        variant: "destructive",
      });
      return;
    }

    try {
      recordedChunksRef.current = [];
      
      const options = { mimeType: "video/webm;codecs=vp9" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = "video/mp4";
        }
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Follow the instructions on screen",
      });
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        title: "Error",
        description: "Failed to start recording: " + error.message,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        
        const file = new File([blob], `verification-${Date.now()}.webm`, {
          type: "video/webm",
        });

        const previewUrl = URL.createObjectURL(blob);

        // Clear recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        setIsRecording(false);
        stopCamera();

        toast({
          title: "Success",
          description: "Video recorded successfully!",
        });

        resolve({ file, previewUrl });
      };

      mediaRecorderRef.current.stop();
    });
  };

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  return {
    isCameraActive,
    cameraLoading,
    cameraError,
    isRecording,
    recordingTime,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    startRecording,
    stopRecording,
  };
};
