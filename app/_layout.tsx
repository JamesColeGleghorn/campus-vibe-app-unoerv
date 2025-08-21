
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { commonStyles } from '../styles/commonStyles';
import { setupErrorLogging } from '../utils/errorLogger';

const STORAGE_KEY = 'natively_app_state';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    console.log('App started');
    setupErrorLogging();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: commonStyles.wrapper,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="location/[id]" />
          <Stack.Screen name="add-location" />
          <Stack.Screen name="add-review/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
