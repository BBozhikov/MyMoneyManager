import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';

const API_BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;
type Step = 'form' | 'success';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const router = useRouter();

  const handleReset = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Грешка', 'Моля, попълни всички полета.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Грешка', 'Паролите не съвпадат.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Грешка', 'Паролата трябва да е поне 8 символа.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');

      await axios.post(
        `${API_BASE_URL}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStep('success');
    } catch (error: any) {
      console.log('Change password error:', JSON.stringify(error?.response?.data));
      const message = error?.response?.data?.message || 'Нещо се обърка. Опитай отново.';
      Alert.alert('Грешка', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Смяна на парола' }} />
      <SafeAreaView style={styles.container}>
        {step === 'form' ? (
          <>
            <Text style={styles.title}>Смяна на парола</Text>
            <Text style={styles.subtitle}>
              Новата парола трябва да съдържа поне 8 символа, главна и малка буква, цифра и специален символ.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Текуща парола"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Нова парола"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Потвърди нова парола"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Смени паролата</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.link}>Обратно към профил</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.successIcon}><Feather name="check-square" size={24} color="white" /></Text>
            <Text style={styles.title}>Паролата е сменена</Text>
            <Text style={styles.subtitle}>Паролата ти беше сменена успешно.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.buttonText}>Обратно към профил</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#2b4d47' },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  successIcon: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: 'white' },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#007AFF', textAlign: 'center', fontSize: 14, marginTop: 8 },
});