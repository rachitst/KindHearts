import React, { useState, useEffect } from "react";
import { InstituteDetails } from "../types/institute";
import { saveInstituteData } from "../utils/localStorage";
import RegistrationStepper from "../components/registration/RegistrationStepper";
import BasicInfoForm from "../components/registration/BasicInfoForm";
import ContactInfoForm from "../components/registration/ContactInfoForm";
import LegalInfoForm from "../components/registration/LegalInfoForm";
import RepresentativeForm from "../components/registration/RepresentativeForm";
import VerificationForm from "../components/registration/VerificationForm";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { useUser } from "@clerk/clerk-react";
import { config } from "../../../../config/env";

interface RegisterProps {
  onLogin: () => void;
}

const REGISTRATION_STEPS = [
  { title: "Basic Info", description: "Institute details" },
  { title: "Contact", description: "Contact information" },
  { title: "Legal", description: "Legal documents" },
  { title: "Representative", description: "Authority details" },
  { title: "Verification", description: "Final review" },
];

// Demo data for quick form filling
const DEMO_DATA: Partial<InstituteDetails> = {
  basicInfo: {
    instituteName: "St. Mary's High School",
    instituteType: "Private",
    yearEstablished: "1995",
    website: "www.stmarys.edu",
    email: "admin@stmarys.edu",
    password: "",
    description: "A premier educational institution serving since 1995",
    category: "Educational Institution",
    institutionId: "SCH123456",
    beneficiaryCount: "1000",
  },
  contactInfo: {
    phone: "9876543210",
    alternatePhone: "9876543211",
    address: "123, Education Street, School Area",
    landmark: "Near Central Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    preferredDeliveryTime: "10:00 AM - 5:00 PM",
  },
  legalInfo: {
    registrationNumber: "SCH/2023/123456",
    registrationDate: "1995-06-15",
    registrationAuthority: "Maharashtra State Education Board",
    taxIdentificationNumber: "ABCDE1234F",
    previousDonations: "Yes",
    previousDonationDetails: "Received educational supplies in 2022",
    specialRequirements: "Need items to be delivered during school hours",
    termsAccepted: true,
  },
  documents: {
    registrationCertificate: "cert_123.pdf",
    taxCertificate: "tax_123.pdf",
    authorityLetter: "auth_123.pdf",
    instituteLogo: "logo_123.jpg",
    identityProof: "id_proof_123.pdf",
    institutionLetter: "institution_letter_123.pdf",
  },
  representative: {
    name: "John Doe",
    designation: "Principal",
    department: "Administration",
    email: "principal@stmarys.edu",
    phone: "9876543212",
    alternateContact: "9876543213",
    idProof: "ADHAAR123456",
    identityType: "Aadhaar",
    identityNumber: "1234 5678 9012",
    photo: "profile_photo.jpg",
  },
  requestDetails: {
    itemName: "School Supplies",
    quantity: "100",
    urgency: "Medium",
    specifications: "Notebooks, pens, and basic stationery items",
    expectedDeliveryDate: "2024-04-30",
    purpose: "For underprivileged students",
    deliveryAddress: "123, Education Street, School Area",
  },
};

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const { registerAndLogin } = useAuth();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<InstituteDetails>>({
    basicInfo: {
      instituteName: "",
      instituteType: "Private",
      yearEstablished: "",
      website: "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      password: "",
    },
    contactInfo: {
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    legalInfo: {
      registrationNumber: "",
      registrationDate: "",
      registrationAuthority: "",
      taxIdentificationNumber: "",
    },
    documents: {
      registrationCertificate: "",
      taxCertificate: "",
      authorityLetter: "",
    },
    representative: {
      name: user?.fullName || "",
      designation: "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: "",
      idProof: "",
    },
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Function to fill form with demo data
  const fillDemoData = () => {
    const demoDataWithUserInfo = {
      ...DEMO_DATA,
      basicInfo: {
        ...DEMO_DATA.basicInfo!,
        email:
          user?.primaryEmailAddress?.emailAddress ||
          DEMO_DATA.basicInfo?.email ||
          "",
      },
      representative: {
        ...DEMO_DATA.representative!,
        name: user?.fullName || DEMO_DATA.representative?.name || "",
        email:
          user?.primaryEmailAddress?.emailAddress ||
          DEMO_DATA.representative?.email ||
          "",
      },
    } as InstituteDetails;

    setFormData(demoDataWithUserInfo);

    // Mark all steps as completed
    setCompletedSteps([0, 1, 2, 3]);
    setAlert({
      message: "Demo data loaded successfully!",
      type: "success",
    });
  };

  // Load draft data if exists
  useEffect(() => {
    const savedData = localStorage.getItem("registration_draft");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem("registration_draft", JSON.stringify(formData));
  }, [formData]);

  const handleStepDataChange = (data: Partial<InstituteDetails>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps((prev) => [...prev, stepIndex]);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return formData.basicInfo?.instituteName && formData.basicInfo?.email;
      case 1:
        return formData.contactInfo?.phone && formData.contactInfo?.address;
      case 2:
        return formData.legalInfo?.registrationNumber;
      case 3:
        return formData.representative?.name && formData.representative?.email;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // ... form data preparation ...

      const response = await fetch(
        `${config.apiBaseUrl}${config.apiEndpoints.institutes}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // ... rest of the code ...
    } catch (error) {
      // ... error handling ...
    }
  };

  const handleNext = async () => {
    if (currentStep === REGISTRATION_STEPS.length - 1) {
      setIsSubmitting(true);
      try {
        // Save the complete institute data
        localStorage.setItem(
          "institute_data",
          JSON.stringify({
            ...formData,
            userId: user?.id,
            createdAt: new Date().toISOString(),
            status: "pending_verification",
          })
        );

        // Clear the draft data
        localStorage.removeItem("registration_draft");

        // Show success message
        setAlert({
          message: "Registration completed successfully!",
          type: "success",
        });

        // Wait for 2 seconds to show the success message
        setTimeout(() => {
          onLogin();
        }, 2000);
      } catch (error) {
        setAlert({
          message: "Registration failed. Please try again.",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleStepComplete(currentStep);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm data={formData} onChange={handleStepDataChange} />
        );
      case 1:
        return (
          <ContactInfoForm data={formData} onChange={handleStepDataChange} />
        );
      case 2:
        return (
          <LegalInfoForm data={formData} onChange={handleStepDataChange} />
        );
      case 3:
        return (
          <RepresentativeForm data={formData} onChange={handleStepDataChange} />
        );
      case 4:
        return <VerificationForm data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Complete Your Institute Profile
        </h2>
        <p className="mt-2 text-gray-600">
          Please provide the required information to access the dashboard
        </p>

        {/* Demo Data Button */}
        <button
          onClick={fillDemoData}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent 
          text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-indigo-500 transition-colors duration-200"
        >
          Fill with Demo Data
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <RegistrationStepper
            steps={REGISTRATION_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        <div className="p-6">{renderCurrentStep()}</div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!validateCurrentStep() || isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors
              ${
                validateCurrentStep() && !isSubmitting
                  ? "bg-[#0f0b52] hover:bg-[#0d0940]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : currentStep === REGISTRATION_STEPS.length - 1 ? (
              "Complete Registration"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
