import { format, subDays } from 'date-fns';

const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Types
export type RequestStatus = 'Pending' | 'Processing' | 'Delivered' | 'Completed' | 'Cancelled';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RequestCategory = 'Books' | 'Stationery' | 'Sports' | 'Electronics' | 'Other' | 'Medical Supplies' | 'Education Material' | 'Food';

export interface DonationRequest {
  id: string;
  itemName: string;
  category: RequestCategory;
  quantity: number;
  urgencyLevel: UrgencyLevel;
  status: RequestStatus;
  specifications?: string;
  createdAt: string;
  updatedAt: string;
  shopAssigned?: {
    id: string;
    name: string;
    address: string;
    contactPerson: string;
    phone: string;
  };
  deliveryDate?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
}

// Mock data
const mockRequests: DonationRequest[] = [
  {
    id: 'REQ-001',
    itemName: 'Science Textbooks',
    category: 'Books',
    quantity: 50,
    urgencyLevel: 'High',
    status: 'Completed',
    specifications: 'Class 10 NCERT Science Textbooks',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-20',
    shopAssigned: {
      id: 'SHOP-001',
      name: 'City Book Store',
      address: '123 Main St, City',
      contactPerson: 'John Doe',
      phone: '1234567890'
    },
    deliveryDate: '2024-02-20',
    feedback: {
      rating: 5,
      comment: 'Excellent service and quality',
      submittedAt: '2024-02-21'
    }
  },
  {
    id: 'REQ-002',
    itemName: 'Sports Equipment',
    category: 'Sports',
    quantity: 20,
    urgencyLevel: 'Medium',
    status: 'Processing',
    specifications: 'Basketball and Volleyball sets',
    createdAt: formatDate(subDays(today, 2)),
    updatedAt: formatDate(today),
    shopAssigned: {
      id: 'SHOP-002',
      name: 'Sports World',
      address: '456 Sports Ave, City',
      contactPerson: 'Jane Smith',
      phone: '0987654321'
    }
  },
  {
    id: 'REQ-003',
    itemName: 'Medical Supplies Kit',
    category: 'Medical Supplies',
    quantity: 30,
    urgencyLevel: 'Critical',
    status: 'Processing',
    specifications: 'First aid supplies and basic medical equipment',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-21',
    shopAssigned: {
      id: 'SHOP-003',
      name: 'HealthCare Supplies',
      address: '789 Medical Ave, City',
      contactPerson: 'Dr. Sarah Wilson',
      phone: '5556667777'
    }
  },
  {
    id: 'REQ-004',
    itemName: 'Food Packages',
    category: 'Food',
    quantity: 100,
    urgencyLevel: 'High',
    status: 'Delivered',
    specifications: 'Non-perishable food items for student meals',
    createdAt: '2024-02-18',
    updatedAt: '2024-02-19',
    shopAssigned: {
      id: 'SHOP-004',
      name: 'FoodMart Plus',
      address: '321 Food Street, City',
      contactPerson: 'Mike Brown',
      phone: '9998887777'
    }
  },
  {
    id: 'REQ-005',
    itemName: 'Educational Tablets',
    category: 'Education Material',
    quantity: 25,
    urgencyLevel: 'Medium',
    status: 'Pending',
    specifications: 'Basic tablets for digital learning',
    createdAt: '2024-02-22',
    updatedAt: '2024-02-22'
  },
  {
    id: 'REQ-006',
    itemName: 'School Uniforms',
    category: 'Other',
    quantity: 50,
    urgencyLevel: 'Low',
    status: 'Completed',
    specifications: 'Various sizes for primary students',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-18',
    shopAssigned: {
      id: 'SHOP-005',
      name: 'Uniform Hub',
      address: '444 Fashion St, City',
      contactPerson: 'Lisa Taylor',
      phone: '3334445555'
    }
  }
];

// In-memory storage
let userRequests = [...mockRequests];

// Functions to interact with mock data
export const getAllRequests = (): DonationRequest[] => {
  return userRequests;
};

export const getRequestsByStatus = (status: RequestStatus): DonationRequest[] => {
  return userRequests.filter(request => request.status === status);
};

export const getRequestById = (id: string): DonationRequest | undefined => {
  return userRequests.find(request => request.id === id);
};

export const addNewRequest = (request: Partial<DonationRequest>): DonationRequest => {
  const newRequest: DonationRequest = {
    ...request,
    id: `REQ-${String(userRequests.length + 1).padStart(3, '0')}`,
    status: 'Pending',
    createdAt: formatDate(today),
    updatedAt: formatDate(today)
  } as DonationRequest;
  
  userRequests = [newRequest, ...userRequests];
  return newRequest;
};

export const getDashboardStats = () => {
  const stats = userRequests.reduce((acc, request) => {
    const status = request.status.toLowerCase();
    if (acc[status] !== undefined) {
      acc[status]++;
    }
    return acc;
  }, {
    pending: 0,
    processing: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0
  });

  return {
    ...stats,
    totalRequests: userRequests.length
  };
};

// Feedback types and functions
export interface FeedbackData {
  id: string;
  rating: number;
  category: string;
  comment: string;
  submittedAt: string;
  userId: string;
}

let feedbackStore: FeedbackData[] = [];

export const storeFeedback = (feedback: Omit<FeedbackData, 'id' | 'submittedAt' | 'userId'>) => {
  const newFeedback: FeedbackData = {
    id: `FB-${Date.now()}`,
    ...feedback,
    submittedAt: new Date().toISOString(),
    userId: 'USER-001' // Simulated user ID
  };
  
  feedbackStore.push(newFeedback);
  return newFeedback;
};

export const getAllFeedback = () => {
  return [...feedbackStore];
};

export const getFeedbackById = (id: string) => {
  return feedbackStore.find(feedback => feedback.id === id);
};

export const getAllUserRequests = (): DonationRequest[] => {
  return userRequests;
};