import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, totalSteps }) => {
  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 px-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const status = getStepStatus(step);
          
          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center 
                    font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out
                    ${status === 'current' 
                      ? "bg-orange-600 text-white scale-110 shadow-lg ring-4 ring-orange-100 animate-in zoom-in duration-300" 
                      : status === 'completed'
                      ? "bg-green-500 text-white shadow-md hover:scale-105"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 animate-in zoom-in duration-200" />
                  ) : (
                    <span className={status === 'current' ? 'animate-pulse' : ''}>{step}</span>
                  )}
                </div>
                
                {/* Step Label - Hidden on mobile */}
                <span 
                  className={`
                    hidden sm:block absolute -bottom-6 text-xs font-medium whitespace-nowrap
                    ${status === 'current' 
                      ? 'text-orange-600' 
                      : status === 'completed' 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                    }
                  `}
                >
                  {step === 1 && 'Personal'}
                  {step === 2 && 'OTP Verify'}
                  {step === 3 && 'Location'}
                  {step === 4 && 'Video'}
                  {step === 5 && 'Review'}
                </span>
              </div>

              {/* Connector Line */}
              {step < totalSteps && (
                <div className="relative flex items-center mx-1 sm:mx-2">
                  <div className="w-8 sm:w-16 h-1 shrink-0 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-500 ease-in-out rounded-full
                        ${status === 'completed' ? 'w-full bg-green-500' : 'w-0 bg-gray-200'}
                      `}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current Step Description */}
      {/* <div className="text-center mt-10 sm:mt-12">
        <p className="text-xs sm:text-sm text-gray-600">
          Step <span className="font-semibold text-orange-600">{currentStep}</span> of {totalSteps}
        </p>
      </div> */}
    </div>
  );
};

export default StepIndicator;
