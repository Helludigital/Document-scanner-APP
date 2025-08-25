import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../styles/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cardBackground },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ title: 'Scan Document', headerShown: false }} />
      <Stack.Screen name="doc/[id]" options={{ title: 'Document Details' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Quick Action' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}
