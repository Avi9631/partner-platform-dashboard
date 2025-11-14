import { Button } from "../../../components/ui/button";
import { Loader2, MapPin } from "lucide-react";

const Step3Location = ({ formData, errors, locationLoading, captureLocation }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Capture Your Location</h3>
        <p className="text-sm text-gray-600">
          We need your location to provide better services
        </p>
      </div>

      {formData.location.latitude ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-900 mb-1">Location Captured</p>
              <p className="text-sm text-green-700">{formData.location.address}</p>
              <p className="text-xs text-green-600 mt-2">
                Coordinates: {formData.location.latitude.toFixed(6)},{" "}
                {formData.location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No location captured yet
          </p>
        </div>
      )}

      {errors.location && (
        <p className="text-sm text-red-500 text-center">{errors.location}</p>
      )}

      <Button
        type="button"
        onClick={captureLocation}
        disabled={locationLoading}
        className="w-full"
        variant="outline"
      >
        {locationLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Capturing Location...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            {formData.location.latitude ? "Recapture Location" : "Capture Location"}
          </>
        )}
      </Button>
    </div>
  );
};

export default Step3Location;
