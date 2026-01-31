// First, let's define proper types
export interface InstituteDetails {
  id: string;
  basicInfo: {
    instituteName: string;
    instituteType: string;
    yearEstablished: string;
    website: string;
    email: string;
    password: string;
    description: string;
    category: string;
    institutionId: string;
    beneficiaryCount: string;
  };
  contactInfo: {
    phone: string;
    alternatePhone: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    preferredDeliveryTime: string;
  };
  legalInfo: {
    registrationNumber: string;
    registrationDate: string;
    registrationAuthority: string;
    taxIdentificationNumber: string;
    previousDonations: string;
    previousDonationDetails: string;
    specialRequirements: string;
    termsAccepted: boolean;
  };
  documents: {
    registrationCertificate: string;
    taxCertificate: string;
    authorityLetter: string;
    instituteLogo: string;
    identityProof: string;
    institutionLetter: string;
  };
  representative: {
    name: string;
    designation: string;
    department: string;
    email: string;
    phone: string;
    alternateContact: string;
    idProof: string;
    identityType: string;
    identityNumber: string;
    photo: string;
  };
  requestDetails: {
    itemName: string;
    quantity: string;
    urgency: string;
    specifications: string;
    expectedDeliveryDate: string;
    purpose: string;
    deliveryAddress: string;
  };
  institutionDetails: {
    category: ("Education" | "Medical" | "Both")[];
    studentStrength?: number;
    bedStrength?: number;
    facilities: string[];
    accreditations: string[];
  };
  status: "active" | "pending" | "suspended";
  createdAt: string;
  updatedAt: string;
}
