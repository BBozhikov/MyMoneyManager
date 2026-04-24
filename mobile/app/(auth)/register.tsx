import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.6:8080';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const PlaceholderImage = require('@/assets/images/banknote.png');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim() || !confirmPassword.trim()) {
      Alert.alert('Грешка', 'Моля, попълни всички полета');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Грешка', 'Паролите не съвпадат');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Register response:', data);
      Alert.alert(
        'Успех', 
        `Регистрацията е успешна за ${email}. Трябвя да си потвърдиш имейла преди да влезеш.`,
        [{ text: 'Разбрах!', onPress: () => router.push('/(auth)/login') }]
      );

    } catch (error: any) {
      console.log('Register error:', error?.response?.data || error.message);

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
    <><Stack.Screen options={{ headerShown: false, animation: 'slide_from_left'}} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b4d47' }} edges={['top', 'bottom']}>
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />

      <Text style={styles.title}>Създай акаунт</Text>

      <TextInput
        style={styles.input}
        placeholder="Пълно име"
        placeholderTextColor="white"
        value={fullName}
        onChangeText={setFullName}/>

      <TextInput
        style={styles.input}
        placeholder="Имейл"
        placeholderTextColor="white"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"/>

      <TextInput
        style={styles.input}
        placeholder="Парола"
        placeholderTextColor="white"
        value={password}
        onChangeText={setPassword}
        secureTextEntry/>

      <TextInput
        style={styles.input}
        placeholder="Потвърди паролата"
        placeholderTextColor="white"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry/>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#005ecb' : '#007AFF' }
        ]}
        onPress={handleRegister}>
        <Text style={styles.buttonText}>Регистрирай се</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/login')}>
        {({ pressed }) => (
          <Text style={[styles.link, { opacity: pressed ? 0.7 : 1 }]}>
            Вече имаш акаунт? Влез
          </Text>
        )}
      </Pressable>

    </View>
    </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#2b4d47',},
  title: {fontSize: 28,fontWeight: 'bold',marginBottom: 32,textAlign: 'center',color: 'white',},
  image: {alignSelf: 'center',marginBottom: 20,height: 78,width: 102,},
  input: {borderWidth: 1,borderColor: '#ccc',borderRadius: 8,padding: 12,marginBottom: 16,fontSize: 16,color: 'white',},
  button: {borderRadius: 8,padding: 14,alignItems: 'center',marginBottom: 16,},
  buttonText: {color: '#fff',fontSize: 16,fontWeight: '600',},
  link: {color: '#007AFF',textAlign: 'center',fontSize: 14,},
});