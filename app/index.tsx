
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles, colors } from '../styles/commonStyles';

export default function Index() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('Index screen - checking auth status:', isAuthenticated);
    
    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('User authenticated, redirecting to tabs');
        router.replace('/(tabs)/home');
      } else {
        console.log('User not authenticated, redirecting to login');
        router.replace('/auth/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={[commonStyles.wrapper, commonStyles.center]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
