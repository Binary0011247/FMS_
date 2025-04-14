import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
    <Stack.Screen 
      name="index" 
      options={{ 
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="login" 
      options={{ 
        headerShown: false,
      }}
    />
     <Stack.Screen 
        name="signup" 
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="calculator"
        options={{
          headerShown: false,
        }}
      />
  </Stack>
);
}
   