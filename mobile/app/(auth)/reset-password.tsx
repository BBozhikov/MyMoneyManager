import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Feather from '@expo/vector-icons/build/Feather';

const API_BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

type Step = 'form' | 'success';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const router = useRouter();

  const handleReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Грешка', 'Моля, попълни и двете полета.');
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
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });
      setStep('success');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Нещо се обърка. Опитай отново.';
      Alert.alert('Грешка', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Stack.Screen options={{ headerShown: false, animation: 'slide_from_left' }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b4d47' }} edges={['top', 'bottom']}>
    <View style={styles.container}>
      {step === 'form' ? (
        <>
          <Text style={styles.title}>Нова парола</Text>
          <Text style={styles.subtitle}>
            Въведи новата си парола. Тя трябва да съдържа поне 8 символа, главна и малка буква, цифра и специален символ.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Нова парола"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoFocus
          />

          <TextInput
            style={styles.input}
            placeholder="Потвърди парола"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            activeOpacity={0.7}
            onPress={handleReset}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Смени паролата</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Обратно към вход</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.successIcon}><Feather name="check-square" size={24} color="white" /></Text>
          <Text style={styles.title}>Паролата е сменена</Text>
          <Text style={styles.subtitle}>
            Паролата ти беше сменена успешно. Вече можеш да влезеш с новата си парола.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Обратно към вход</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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