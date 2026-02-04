export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'institute' | 'donor' | 'shopkeeper';
  status: 'active' | 'pending' | 'blocked';
  createdAt: string;
  lastLogin?: string;
}

export interface DonationRequest {
  id: string;
  instituteId: string;
  instituteName: string;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  createdAt: string;
  updatedAt: string;
  flagged: boolean;
  flagReason?: string;
  assignedShopId?: string;
}

export interface RequestItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface Transaction {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  instituteId: string;
  instituteName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface Feedback {
  id: string;
  transactionId: string;
  instituteId: string;
  instituteName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDonations: number;
  pendingRequests: number;
  completedRequests: number;
  totalUsers: {
    institutes: number;
    donors: number;
    shopkeepers: number;
  };
  flaggedRequests: number;
  monthlyDonations: MonthlyDonation[];
}

export interface MonthlyDonation {
  month: string;
  amount: number;
}