import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // true = събитието е обработено, не прави нищо
    });
    return () => subscription.remove();
  }, []);
  return (
    <>
    <SystemBars style={{ statusBar: 'light', navigationBar: 'light' }} />
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#3b6861' }, // ← това е ключовото
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
    </>
  );
}
