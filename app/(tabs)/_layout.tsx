import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}/>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Начало',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="pie-chart" color={color} />,
          tabBarIcon: ({ color }) => <AntDesign name="pie-chart" size={28} color={color} />,
        }}/>

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Сметки',
          tabBarIcon: ({ color }) => <AntDesign name="account-book" size={28} color={color} />,
        }}/>

      <Tabs.Screen
        name="reports"
        options={{
          title: 'Анализ',
          tabBarIcon: ({ color }) => <AntDesign name="area-chart" size={28} color={color} />,
        }}/>

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профил',
          tabBarIcon: ({ color }) => <Feather name="user" size={28} color={color} />,
        }}/>
      <Tabs.Screen
        name="add-transaction"
        options={{
          href: null,
        }}/>

      <Tabs.Screen
        name="transactions"
        options={{
          href: null,
        }}/>

      <Tabs.Screen
        name="add-account"
        options={{
          href: null,
        }}/>

      <Tabs.Screen
        name="add-transfer"
        options={{
          href: null,
        }}/>

      <Tabs.Screen
        name="transfer-history"
        options={{
          href: null,
        }}/>
    </Tabs>
  );
}
