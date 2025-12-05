
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  personalVibe?: string; // New: User's personal vibe description
  vibePreferences?: string[]; // New: Tags describing their vibe preferences
  joinedDate: Date;
  totalReviews: number;
  totalLocationsAdded: number;
  friends?: string[]; // New: Array of friend user IDs
  friendRequests?: string[]; // New: Pending friend request IDs
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  personalVibe?: string;
  vibePreferences?: string[];
  recentActivity?: {
    locationId: string;
    locationName: string;
    vibeRating: number;
    timestamp: Date;
  }[];
}
