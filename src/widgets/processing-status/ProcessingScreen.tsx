import { useEffect, useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { CircleCheckBig, Loader2 } from 'lucide-react';

export const ProcessingScreen = () => {
  const uploadMode = useAppStore((state) => state.uploadMode);

  const [currentStep, setCurrentStep] = useState(1);
  const [statusText, setStatusText] = useState(
    uploadMode === 'pdf' ? 'Uploading PDF...' : 'Uploading image...'
  );

  const steps = [
    {
      id: 1,
      label: uploadMode === 'pdf' ? 'PDF uploaded' : 'Image uploaded'
    },
    { id: 2, label: 'Gemini Vision API' },
  ];

  useEffect(() => {
    // Just update the status text to show AI is analyzing
    const timer = setTimeout(() => {
      setCurrentStep(2);
      setStatusText('Analyzing with Gemini AI...');
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">

        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-20 h-20 sm:w-24 sm:h-24">
              <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#adc9e6ff"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4d76b0ff"
                  strokeWidth="8"
                  strokeDasharray="70 200"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            {/* Center sparkle icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center">
                <h1>🦷</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-3 tracking-tight">
          AI Processing...
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-text-secondary text-center mb-10 font-medium">
          {statusText}
        </p>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50/50 border border-gray-100"
            >
              {/* Step Icon */}
              <div className="flex-shrink-0">
                {currentStep > step.id ? (
                  <div className="">
                    <CircleCheckBig className="w-3 h-3 text-green-500" />
                  </div>
                ) : currentStep === step.id ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-sm sm:text-base font-semibold ${currentStep >= step.id
                  ? 'text-gray-400'
                  : 'text-gray-400'
                  }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};