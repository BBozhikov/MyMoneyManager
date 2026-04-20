import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export default function Index() {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Retrieved token:', token); // Debug
        
        if (!token) {
          setAuthState('unauthenticated');
          return;
        }
        console.log('Validating token with backend...'); // Debug
        const response = await axios.get(
          'http://192.168.0.6:8080/api/user/validate',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Status:', response.status);
        if (response.status === 200) {
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
        }
      } catch (error:any) {
        console.log('Грешка:', error?.response?.status);
        console.log('Съобщение:', error?.message);
        console.log('URL достъпен ли е:', error?.code); // ECONNREFUSED = не достига сървъра
        setAuthState('unauthenticated');
      }
    };

    validateToken();
  }, []);

  if (authState === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b6861' }}>
        <ActivityIndicator size="large" color="#3ecf8e" />
      </View>
    );
  }

  if (authState === 'authenticated') {
    return <Redirect href="/(tabs)/main" />;
  }

  return <Redirect href="/(auth)/login" />;
}
