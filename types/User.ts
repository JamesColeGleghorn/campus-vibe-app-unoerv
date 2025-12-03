
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedDate: Date;
  totalReviews: number;
  totalLocationsAdded: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
