
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@viberater_auth';

// Mock user for demo purposes
const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  bio: 'Love exploring new places and sharing vibes!',
  joinedDate: new Date('2024-01-01'),
  totalReviews: 12,
  totalLocationsAdded: 5,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState({
          isAuthenticated: true,
          user: {
            ...parsed.user,
            joinedDate: new Date(parsed.user.joinedDate),
          },
        });
        console.log('Auth state loaded:', parsed.user.name);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  };

  const saveAuthState = async (state: AuthState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('Auth state saved');
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', email);
    
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      const user = { ...mockUser, email };
      const newState = {
        isAuthenticated: true,
        user,
      };
      setAuthState(newState);
      await saveAuthState(newState);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('Signup attempt:', name, email);
    
    // Mock signup - in real app, this would call an API
    if (name && email && password.length >= 6) {
      const user: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        joinedDate: new Date(),
        totalReviews: 0,
        totalLocationsAdded: 0,
      };
      const newState = {
        isAuthenticated: true,
        user,
      };
      setAuthState(newState);
      await saveAuthState(newState);
      return true;
    }
    return false;
  };

  const logout = async () => {
    console.log('Logging out');
    const newState = {
      isAuthenticated: false,
      user: null,
    };
    setAuthState(newState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      console.log('No user to update');
      return;
    }
    
    console.log('Updating profile:', updates);
    const updatedUser = { ...authState.user, ...updates };
    const newState = {
      isAuthenticated: true,
      user: updatedUser,
    };
    setAuthState(newState);
    await saveAuthState(newState);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
