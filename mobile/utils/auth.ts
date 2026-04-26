import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const BASE_URL = 'http://192.168.0.6:8080';

export function redirectToLogin2() {
  router.replace('/(auth)/login')
}

export function redirectToLogin(message: string) {
  Alert.alert(
    'Сесията изтече',
    message,
    [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
    { cancelable: false }
  );
}

export async function tryRefreshToken(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
      refreshToken,
    });

    const newToken: string = response.data.accessToken;
    const newRefreshToken: string = response.data.refreshToken;

    await AsyncStorage.setItem('accessToken', newToken);
    await AsyncStorage.setItem('refreshToken', newRefreshToken);

    return newToken;
  } catch {
    return null;
  }
}

export async function validateWithRefresh(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return false;

    await axios.get(`${BASE_URL}/api/auth/validate-token`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });

    return true;
  } catch (error: any) {
    console.log('Validate status:', error?.response?.status);

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      const newToken = await tryRefreshToken();
      if (newToken) return true; 
    }
    if (!error?.response) {

      console.log('Мрежова грешка');
      return false;
    }

    return false;
  }
}

export async function requireAuth(message = 'Сесията ви е изтекла. Моля влезте отново.'): Promise<string | null> {
  const isValid = await validateWithRefresh();

  if (!isValid) {
    redirectToLogin(message);
    return null;
  }

  return await AsyncStorage.getItem('accessToken');
}