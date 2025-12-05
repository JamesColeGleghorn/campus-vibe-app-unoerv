
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/User';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    console.log('Checking for existing session...');
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log('Found existing session for:', user.email);
        setAuthState({
          isAuthenticated: true,
          user: {
            ...user,
            joinedDate: new Date(user.joinedDate),
          },
        });
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Logging in user:', email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: '1',
      name: 'John Doe',
      email,
      avatar: undefined,
      bio: 'Love exploring new places and sharing vibes!',
      personalVibe: 'Coffee enthusiast and study buddy',
      vibePreferences: ['quiet', 'cozy', 'friendly', 'good-wifi'],
      joinedDate: new Date('2024-01-01'),
      totalReviews: 12,
      totalLocationsAdded: 3,
      friends: ['friend1', 'friend2', 'friend3'],
      friendRequests: ['req1', 'req2'],
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      user,
    });

    console.log('Login successful');
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('Signing up user:', email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: undefined,
      bio: '',
      personalVibe: '',
      vibePreferences: [],
      joinedDate: new Date(),
      totalReviews: 0,
      totalLocationsAdded: 0,
      friends: [],
      friendRequests: [],
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      user,
    });

    console.log('Signup successful');
  };

  const logout = async () => {
    console.log('Logging out user');
    await AsyncStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      console.error('No user to update');
      return;
    }

    console.log('Updating profile:', updates);
    
    const updatedUser = {
      ...authState.user,
      ...updates,
    };

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    
    setAuthState({
      isAuthenticated: true,
      user: updatedUser,
    });

    console.log('Profile updated successfully');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
