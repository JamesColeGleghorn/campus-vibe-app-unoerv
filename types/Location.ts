
export interface Location {
  id: string;
  name: string;
  category: 'restaurant' | 'gym' | 'park' | 'library' | 'cafe' | 'other';
  address: string;
  description: string;
  averageRating: number;
  totalRatings: number;
  imageUrl?: string;
  distance?: number; // in miles
}

export interface Rating {
  id: string;
  locationId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  vibeRating: number; // 1-5 stars for vibe specifically
  comment: string;
  createdAt: Date;
  tags: string[]; // e.g., ['quiet', 'crowded', 'friendly', 'clean']
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
