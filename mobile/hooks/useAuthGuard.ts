import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Href, router } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const API_URL = 'http://192.168.0.6:8080/api/user/validate';

function redirectToLogin(message: string) {
  Alert.alert(
    'Сесията изтече',
    message,
    [
      {
        text: 'OK',
        onPress: () => router.replace('/(auth)/login'),
      },
    ],
    { cancelable: false }
  );
}

export function useAuthGuard(redirectOnSuccess: Href = '/(tabs)/main') {
  useEffect(() => {
    const validate = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          redirectToLogin('Моля влезте в профила си.');
          return;
        }

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          router.replace(redirectOnSuccess);
        } else {
          redirectToLogin('Сесията ви е изтекла. Моля влезте отново.');
        }
      } catch {
        redirectToLogin('Сесията ви е изтекла. Моля влезте отново.');
      }
    };

    validate();
  }, []);
}