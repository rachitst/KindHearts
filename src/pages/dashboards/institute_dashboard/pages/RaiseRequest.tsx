import React, { useState } from "react";
import {
  Upload,
  AlertCircle,
  Send,
  FileText,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  CheckCircle,
  Calendar,
  Info,
  Package,
  Clock,
} from "lucide-react";
import { addNewRequest } from "../data/mockData";
import { config } from "../../../../config/env";

type RequestCategory =
  | "Food"
  | "Medical"
  | "Education"
  | "Clothing"
  | "Hygiene";
type UrgencyLevel = "Low" | "Medium" | "High";

interface RequestForm {
  // Basic Information
  name: string; // Institution name
  email: string; // Institution email
  phone: string; // Institution phone
  address: string; // Institution address
  description: string; // Institution description
  category: string;
  itemName: string;
  quantity: number;
  urgency: UrgencyLevel;
  specifications: string;
  expectedDeliveryDate: string;

  // Requester Information
  requesterName: string;
  designation: string;
  department: string;
  contactNumber: string;
  alternateContact: string;
  institutionId: string;

  // Delivery Information
  deliveryAddress: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  preferredDeliveryTime: string;

  // Identity Verification
  identityType: string;
  identityNumber: string;
  identityProof: File | null;
  institutionLetter: File | null;

  // Additional Details
  purpose: string;
  beneficiaryCount: number;
  previousDonations: boolean | string;
  previousDonationDetails: string;
  specialRequirements: string;
  termsAccepted: boolean;
}

interface MockRequest {
  category: RequestCategory;
  itemName: string;
  quantity: number;
  urgencyLevel: UrgencyLevel;
  status: string;
  createdAt: string;
  updatedAt: string;
  specifications: string;
}

// Demo data for quick form filling
const DEMO_DATA: RequestForm = {
  // Basic Information
  name: "St. Mary's High School",
  email: "admin@stmarys.edu",
  phone: "9876543210",
  address: "123 Education Street, Knowledge Park",
  description: "A premier educational institution serving since 1995",
  category: "Education",
  itemName: "Textbooks and School Supplies",
  quantity: 100,
  urgency: "Medium",
  specifications:
    "Standard textbooks for grades 6-8, notebooks, pens, and basic stationery items",
  expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],

  // Requester Information
  requesterName: "Dr. Sarah Johnson",
  designation: "Head of Department",
  department: "Academic Affairs",
  contactNumber: "9876543210",
  alternateContact: "9876543211",
  institutionId: "SCH123456",

  // Delivery Information
  deliveryAddress: "123 Education Street, Knowledge Park",
  landmark: "Near Central Library",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  preferredDeliveryTime: "9:00 AM - 5:00 PM",

  // Identity Verification
  identityType: "Aadhar Card",
  identityNumber: "1234-5678-9012",
  identityProof: null,
  institutionLetter: null,

  // Additional Details
  purpose:
    "To provide essential educational materials to underprivileged students",
  beneficiaryCount: 250,
  previousDonations: true,
  previousDonationDetails: "Received educational supplies in 2022",
  specialRequirements: "Need items to be delivered during school hours",
  termsAccepted: true,
};

const RaiseRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [fileToConfirm, setFileToConfirm] = useState<{
    file: File;
    type: "identityProof" | "institutionLetter";
  } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{
    identityProof: { name: string; url: string } | null;
    institutionLetter: { name: string; url: string } | null;
  }>({
    identityProof: null,
    institutionLetter: null,
  });
  const [formData, setFormData] = useState<RequestForm>({
    // Basic Information
    category: "",
    itemName: "",
    quantity: 0,
    urgency: "Low",
    specifications: "",
    expectedDeliveryDate: "",

    // Requester Information
    requesterName: "",
    designation: "",
    department: "",
    contactNumber: "",
    alternateContact: "",
    email: "",
    institutionId: "",

    // Delivery Information
    deliveryAddress: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    preferredDeliveryTime: "",

    // Identity Verification
    identityType: "",
    identityNumber: "",
    identityProof: null,
    institutionLetter: null,

    // Additional Details
    purpose: "",
    beneficiaryCount: 0,
    previousDonations: false,
    previousDonationDetails: "",
    specialRequirements: "",
    termsAccepted: false,

    // Additional Required Fields from API
    name: "",
    phone: "",
    address: "",
    description: "",
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleFileConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "identityProof" | "institutionLetter"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToConfirm({ file, type: fieldName });
      setShowUploadConfirm(true);
    }
  };

  const confirmFileUpload = () => {
    if (fileToConfirm) {
      const { file, type } = fileToConfirm;
      // Create temporary URL for preview
      const fileUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: { name: file.name, url: fileUrl },
      }));
      setFormData((prev) => ({ ...prev, [type]: file }));
      setShowUploadConfirm(false);
      setFileToConfirm(null);
    }
  };

  const handleReupload = (fieldName: "identityProof" | "institutionLetter") => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields according to API requirements
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "category",
      "itemName",
      "quantity",
      "urgency",
      "expectedDeliveryDate",
      "requesterName",
      "designation",
      "department",
      "contactNumber",
      "institutionId",
      "deliveryAddress",
      "city",
      "state",
      "pincode",
      "identityType",
      "identityNumber",
      "purpose",
      "beneficiaryCount",
      "termsAccepted",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setAlert({
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all the form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "identityProof" || key === "institutionLetter") {
          if (value instanceof File) {
            formDataToSend.append(key, value);
          }
        } else if (typeof value === "boolean") {
          formDataToSend.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Make the API call using environment variable - changed to institutes endpoint
      const response = await fetch(
        `${config.apiBaseUrl}${config.apiEndpoints.institutes}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request");
      }

      const data = await response.json();
      setIsSuccess(true);
      setAlert({
        message: "Request submitted successfully!",
        type: "success",
      });

      // Reset form after successful submission
      setFormData({
        category: "",
        itemName: "",
        quantity: 0,
        urgency: "Low",
        specifications: "",
        expectedDeliveryDate: "",
        requesterName: "",
        designation: "",
        department: "",
        contactNumber: "",
        alternateContact: "",
        email: "",
        institutionId: "",
        deliveryAddress: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        preferredDeliveryTime: "",
        identityType: "",
        identityNumber: "",
        identityProof: null,
        institutionLetter: null,
        purpose: "",
        beneficiaryCount: 0,
        previousDonations: false,
        previousDonationDetails: "",
        specialRequirements: "",
        termsAccepted: false,
        name: "",
        phone: "",
        address: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      setAlert({
        message: error.message || "Failed to submit request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fill form with demo data
  const fillDemoData = () => {
    setFormData(DEMO_DATA);
    setAlert({
      message: "Demo data loaded successfully!",
      type: "success",
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fadeIn">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#100e92]">
              Raise a Donation Request
            </h1>
            <p className="mt-2 text-gray-600">
              Please fill in all the required details to submit your request
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Info size={16} />
              <span>
                Fields marked with <span className="text-red-500">*</span> are
                required
              </span>
            </div>
          </div>
          <button
            onClick={fillDemoData}
            className="px-4 py-2 bg-[#100e92] text-white rounded-lg hover:bg-[#0d0b7a] 
            transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <FileText size={16} />
            Fill Demo Data
          </button>
        </div>
      </div>

      {isSuccess ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your request has been received and is being processed.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-[#100e92] text-white border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">Basic Information</h2>
              <Info size={20} />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-[#100e92] focus:border-[#100e92] 
                    bg-white appearance-none pr-10"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Medical">Medical Supplies</option>
                    <option value="Education">Education Materials</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Hygiene">Hygiene Products</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Package className="ml-2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specifications
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter any specific requirements or details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="ml-2 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Requester Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-[#100e92] text-white border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} />
                <h2 className="text-lg font-medium">Requester Information</h2>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                <span className="text-white/80">Step</span>
                <span className="font-medium">2/5</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="requesterName"
                    value={formData.requesterName}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Contact
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="alternateContact"
                    value={formData.alternateContact}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-[#100e92] text-white border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">Delivery Information</h2>
              <Building size={20} />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Delivery Time
                </label>
                <input
                  type="text"
                  name="preferredDeliveryTime"
                  value={formData.preferredDeliveryTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter preferred delivery time"
                />
              </div>
            </div>
          </div>

          {/* Identity Verification Section - Updated Upload Styling */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-[#100e92] text-white border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">Identity Verification</h2>
              <AlertCircle size={20} />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identity Type *
                  </label>
                  <input
                    type="text"
                    name="identityType"
                    value={formData.identityType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Aadhar Card, PAN Card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identity Number *
                  </label>
                  <input
                    type="text"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter identity number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Identity Proof *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <Upload size={18} className="text-gray-400 mr-2" />
                        <input
                          type="file"
                          name="identityProof"
                          onChange={(e) => handleFileChange(e, "identityProof")}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-gray-500 text-sm">
                          Upload Identity Proof
                        </span>
                      </div>
                    </div>
                    {formData.identityProof && (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        File selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, JPG, PNG (Max size: 5MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Institution Letter *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <Upload size={18} className="text-gray-400 mr-2" />
                        <input
                          type="file"
                          name="institutionLetter"
                          onChange={(e) =>
                            handleFileChange(e, "institutionLetter")
                          }
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-gray-500 text-sm">
                          Upload Institution Letter
                        </span>
                      </div>
                    </div>
                    {formData.institutionLetter && (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        File selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, JPG, PNG (Max size: 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-[#100e92] text-white border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">Additional Details</h2>
              <Info size={20} />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Request *
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the purpose of this donation request"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Beneficiaries *
                  </label>
                  <input
                    type="number"
                    name="beneficiaryCount"
                    value={formData.beneficiaryCount}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number of beneficiaries"
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      name="previousDonations"
                      checked={formData.previousDonations}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#100e92] focus:ring-[#100e92] border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Have you received similar donations before?
                    </label>
                  </div>

                  {formData.previousDonations && (
                    <textarea
                      name="previousDonationDetails"
                      value={formData.previousDonationDetails}
                      onChange={handleChange}
                      rows={2}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide details about previous donations received"
                    />
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements or Notes
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requirements or additional notes for the request"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, termsAccepted: e.target.checked })
                }
                className="h-4 w-4 text-[#100e92] focus:ring-[#100e92] border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-[#100e92] hover:text-[#0d0b7a]">
                  terms and conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !formData.termsAccepted}
              className={`
                inline-flex items-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-lg shadow-sm text-white 
                bg-[#100e92] hover:bg-[#0d0b7a] focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-[#100e92] transition-all
                ${
                  isSubmitting || !formData.termsAccepted
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Clock className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Upload Confirmation Modal */}
      {showUploadConfirm && fileToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm File Upload
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Do you want to upload this file?
              <br />
              <span className="font-medium">{fileToConfirm.file.name}</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadConfirm(false);
                  setFileToConfirm(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmFileUpload}
                className="px-4 py-2 text-sm font-medium text-white bg-[#100e92] rounded-md hover:bg-[#0d0b7a]"
              >
                Yes, Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaiseRequest;
