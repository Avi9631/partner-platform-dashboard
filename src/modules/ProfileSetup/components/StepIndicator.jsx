const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center mb-4 space-x-2 w-max px-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-semibold transition-all ${
              step === currentStep
                ? "bg-blue-600 text-white scale-110"
                : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-1 shrink-0 ${
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
