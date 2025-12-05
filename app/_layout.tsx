
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { commonStyles } from '../styles/commonStyles';
import { setupErrorLogging } from '../utils/errorLogger';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    console.log('VibeRater 2.0 started');
    setupErrorLogging();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: commonStyles.wrapper,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="location/[id]" />
            <Stack.Screen name="add-location" />
            <Stack.Screen name="add-review/[id]" />
            <Stack.Screen name="search" />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
