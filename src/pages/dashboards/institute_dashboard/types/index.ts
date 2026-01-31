export type RequestStatus = 'Pending' | 'Processing' | 'Delivered' | 'Completed';

export type RequestCategory = 'Food' | 'Medical Supplies' | 'Education Material';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DonationRequest {
  id: string;
  category: RequestCategory;
  itemName: string;
  quantity: number;
  urgencyLevel: UrgencyLevel;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  specifications?: string;
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

export interface DashboardStats {
  pending: number;
  processing: number;
  delivered: number;
  completed: number;
  totalRequests: number;
}