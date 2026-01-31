import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  completedSteps: number[];
}

const RegistrationStepper: React.FC<StepperProps> = ({ currentStep, steps, completedSteps }) => {
  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 h-1 w-full bg-gray-200 -z-1"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500 -z-1"
          style={{ 
            width: `${(completedSteps.length / (steps.length - 1)) * 100}%`
          }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white
                ${
                  completedSteps.includes(index)
                    ? 'border-green-500 text-green-500'
                    : index === currentStep
                    ? 'border-[#070530] text-[#070530]'
                    : 'border-gray-300 text-gray-300'
                }
                transition-all duration-300 ease-in-out
              `}
            >
              {completedSteps.includes(index) ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className={`text-sm font-medium block ${
                index === currentStep ? 'text-[#070530]' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              <span className="text-xs text-gray-400">
                {step.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationStepper; 