import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#2b4d47' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{
        gestureEnabled: false,
      }} />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="forgot-password"
        options={{
          //headerShown: false,
          //title: 'Забравена парола',
          //headerStyle: { backgroundColor: '#2b4d47' },
          //headerTintColor: 'white',
          //headerTitleStyle: { fontWeight: 'bold' },
          //contentStyle: { backgroundColor: '#2b4d47' },
        }}
      />
    </Stack>
  );
}