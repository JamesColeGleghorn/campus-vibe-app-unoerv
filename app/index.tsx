
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  console.log('Index - Auth state:', isAuthenticated, user?.name);

  // Show loading while checking auth state
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/auth/login" />;
}
