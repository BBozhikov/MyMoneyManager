import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { backgroundColor: '#3b6861' },
        sceneStyle: { backgroundColor: '#3b6861' },
      }}>
      <Tabs.Screen name="index" options={{href: null,}}/>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Начало',
          tabBarIcon: ({ color }) => <AntDesign name="pie-chart" size={28} color={color} />,
        }}/>

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Сметки',
          tabBarIcon: ({ color }) => <AntDesign name="account-book" size={28} color={color} />,
        }}/>

      <Tabs.Screen name="reports" options={{ href: null, }}/>
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Категории',
          tabBarIcon: ({ color }) => <MaterialIcons name="category" size={28} color={color} />,
        }}/>

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профил',
          tabBarIcon: ({ color }) => <Feather name="user" size={28} color={color} />,
        }}/>
      <Tabs.Screen name="add-transaction" options={{ href: null, }}/>
      <Tabs.Screen name="transactions" options={{ href: null, }}/>
      <Tabs.Screen name="add-account" options={{ href: null, }}/>
      <Tabs.Screen name="add-transfer" options={{ href: null, }}/>
      <Tabs.Screen name="transfer-history" options={{ href: null,}}/>
      <Tabs.Screen name="add-category" options={{ href:null,}}/>
      <Tabs.Screen name="edit-category" options={{ href:null,}}/>
      <Tabs.Screen name="edit-account" options={{ href:null,}}/>
      <Tabs.Screen name="view-transaction" options={{ href:null,}}/>
      <Tabs.Screen
        name="camera"
        options={{
          tabBarStyle: { display: 'none' },
          href:null,
        }}
        />
    </Tabs>
  );
}
