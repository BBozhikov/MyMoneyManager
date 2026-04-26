import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const PlaceholderImage = require('@/assets/images/banknote.png');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Грешка', 'Моля, попълни имейл и парола');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: email.trim(),
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Login response:', data);
      console.log('JWT accessToken:', data.accessToken);
  
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('fullName', data.fullName);
      await AsyncStorage.setItem('email', data.email);

      router.push('/(tabs)/main');

    } catch (error: any) {
      console.log('Login error:', error?.response?.data || error.message);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Неуспешно логване';

      Alert.alert('Грешка', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b4d47' }} edges={['top', 'bottom']}>
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Text style={styles.title}>Добре дошъл отново в My Money Manager</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Имейл"
        placeholderTextColor="white"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Парола"
        placeholderTextColor="white"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgotText}>Забравена парола?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleLogin}>
        <Text style={styles.buttonText}>Влез</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Нямаш акаунт? Регистрирай се</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#2b4d47' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: 'white' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: 'white' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  forgotText: { color: '#007AFF', fontSize: 14},
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#007AFF', textAlign: 'center', fontSize: 14 },
  image: { alignSelf: 'center', marginBottom: 20, height: 78, width: 102 },
});
