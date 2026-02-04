import React, { useState } from 'react';
import { 
  Heart, 
  Target, 
  Globe, 
  HandHeart, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  Gift,
  Users,
  Coins,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UserData {
  donationType: string[];
  preferredCauses: string[];
  donationFrequency: string;
  monthlyBudget: string;
  preferredLocation: string[];
  agreeToTerms: boolean;
}

const OnboardingForm: React.FC<{ onComplete: (userData: UserData) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserData>({
    donationType: [],
    preferredCauses: [],
    donationFrequency: '',
    monthlyBudget: '',
    preferredLocation: [],
    agreeToTerms: false
  });

  const donationTypes = [
    { id: 'monetary', label: 'Monetary Support', icon: <Coins className="w-6 h-6" /> },
    { id: 'resources', label: 'Essential Resources', icon: <Gift className="w-6 h-6" /> },
    { id: 'volunteer', label: 'Time & Skills', icon: <Clock className="w-6 h-6" /> }
  ];

  const causes = [
    { id: 'healthcare', label: 'Healthcare', icon: <AlertCircle className="w-6 h-6" /> },
    { id: 'education', label: 'Education', icon: <Users className="w-6 h-6" /> },
    { id: 'environment', label: 'Environment', icon: <Globe className="w-6 h-6" /> },
    { id: 'children', label: 'Child Welfare', icon: <Heart className="w-6 h-6" /> },
    { id: 'elderly', label: 'Elder Care', icon: <HandHeart className="w-6 h-6" /> },
    { id: 'disaster', label: 'Disaster Relief', icon: <Target className="w-6 h-6" /> }
  ];

  const locations = [
    'Pan India', 'North India', 'South India', 'East India', 'West India', 'Local Community'
  ];

  const frequencies = [
    { id: 'monthly', label: 'Monthly', icon: <Calendar className="w-6 h-6" /> },
    { id: 'quarterly', label: 'Quarterly', icon: <Clock className="w-6 h-6" /> },
    { id: 'yearly', label: 'Yearly', icon: <Target className="w-6 h-6" /> },
    { id: 'oneTime', label: 'One-time', icon: <Gift className="w-6 h-6" /> }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(formData));
    onComplete(formData);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900">How would you like to help?</h2>
              <p className="text-gray-600 mt-2">Choose one or more ways to contribute</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {donationTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    const newTypes = formData.donationType.includes(type.id)
                      ? formData.donationType.filter(t => t !== type.id)
                      : [...formData.donationType, type.id];
                    setFormData({ ...formData, donationType: newTypes });
                  }}
                  className={`p-6 rounded-xl text-left transition-all ${
                    formData.donationType.includes(type.id)
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-white text-indigo-900 border-2 border-indigo-100 hover:border-indigo-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg inline-block ${
                    formData.donationType.includes(type.id) ? 'bg-white/20' : 'bg-indigo-50'
                  }`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold mt-4">{type.label}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900">What causes inspire you?</h2>
              <p className="text-gray-600 mt-2">Select the areas you're passionate about</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {causes.map((cause) => (
                <button
                  key={cause.id}
                  type="button"
                  onClick={() => {
                    const newCauses = formData.preferredCauses.includes(cause.id)
                      ? formData.preferredCauses.filter(c => c !== cause.id)
                      : [...formData.preferredCauses, cause.id];
                    setFormData({ ...formData, preferredCauses: newCauses });
                  }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    formData.preferredCauses.includes(cause.id)
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-white text-indigo-900 border-2 border-indigo-100 hover:border-indigo-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg inline-block ${
                    formData.preferredCauses.includes(cause.id) ? 'bg-white/20' : 'bg-indigo-50'
                  }`}>
                    {cause.icon}
                  </div>
                  <h3 className="font-medium mt-2">{cause.label}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900">Almost there!</h2>
              <p className="text-gray-600 mt-2">Let's set up your donation preferences</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-indigo-900 mb-3">How often would you like to contribute?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, donationFrequency: freq.id })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.donationFrequency === freq.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {freq.icon}
                      <span className="block mt-2">{freq.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-indigo-50 rounded-xl">
                <h3 className="font-medium text-indigo-900 mb-4">Terms and Privacy</h3>
                <p className="text-sm text-indigo-700 mb-4">
                  By proceeding, you agree to our terms of service and privacy policy. We're committed to transparency
                  and will keep you updated about the impact of your contributions.
                </p>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-indigo-900">I agree to the terms and conditions</span>
                </label>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-8">
          <HandHeart className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-indigo-900">KindHearts</h1>
        </div>

        <div className="mb-12">
          <div className="relative">
            <div className="flex justify-between mb-2 relative z-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center w-24">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${step >= i 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                  >
                    {step > i ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-medium">{i}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors duration-300
                    ${step >= i ? 'text-indigo-600' : 'text-gray-400'}`}
                  >
                    {i === 1 ? 'Contribution' : i === 2 ? 'Causes' : 'Preferences'}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-5 left-0 right-0 flex items-center px-12">
              <div className="w-full h-[2px] bg-gray-200">
                <motion.div 
                  className="h-full bg-indigo-600 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: (step - 1) / 2 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="group px-6 py-3 text-indigo-600 font-medium hover:bg-indigo-50 
                  rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto group flex items-center gap-2 px-6 py-3 bg-indigo-600 
                  text-white font-medium rounded-xl hover:bg-indigo-700 
                  transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200"
              >
                Next
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.agreeToTerms}
                className="ml-auto group flex items-center gap-2 px-6 py-3 bg-indigo-600 
                  text-white font-medium rounded-xl hover:bg-indigo-700 
                  transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Start Making Impact
                <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingForm; 