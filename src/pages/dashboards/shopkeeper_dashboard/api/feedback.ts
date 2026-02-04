import { Feedback } from '../types';

// Mock data for feedback
const mockFeedback: Feedback[] = [
  {
    id: '1',
    orderId: '6',
    instituteName: 'Youth Center',
    rating: 5,
    comment: 'Excellent service! The items were exactly what we needed and arrived on time.',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '2',
    orderId: '5',
    instituteName: 'Senior Center',
    rating: 4,
    comment: 'Good quality products. Our seniors are enjoying the games and books.',
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: '3',
    orderId: '3',
    instituteName: 'Community College',
    rating: 5,
    comment: 'The textbooks and laptops were in perfect condition. Thank you!',
    createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  },
  {
    id: '4',
    orderId: '2',
    instituteName: 'Hope Orphanage',
    rating: 3,
    comment: 'The blankets were great, but some of the toys were missing parts.',
    createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
  }
];

// Simulate API call to fetch feedback
export const fetchFeedback = async (): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFeedback);
    }, 500);
  });
};