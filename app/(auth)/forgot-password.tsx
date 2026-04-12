import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'email' | 'success';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const router = useRouter();

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Грешка', 'Моля, въведи имейл адрес.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Грешка', 'Моля, въведи валиден имейл адрес.');
      return;
    }
    setLoading(true);
    try {
      // TODO: await sendPasswordResetEmail(auth, email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep('success');
    } catch {
      Alert.alert('Грешка', 'Нещо се обърка. Опитай отново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Stack.Screen options={{ headerShown: false, animation: 'slide_from_left'}} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b4d47' }} edges={['top', 'bottom']}>
    <View style={styles.container}>
      {step === 'email' ? (
        <>
          <Text style={styles.title}>Нулиране на парола</Text>
          <Text style={styles.subtitle}>
            Въведи своя имейл адрес и ще ти изпратим линк за нулиране на паролата.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Имейл"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            activeOpacity={0.7}
            onPress={handleSend}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Изпрати линк</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Обратно към вход</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.title}>Провери имейла си</Text>
          <Text style={styles.subtitle}>
            {`Изпратихме линк за нулиране на паролата до\n`}
            <Text style={styles.emailHighlight}>{email}</Text>
            {`\n\nПровери папката с нежелана поща, ако не виждаш имейла.`}
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Обратно към вход</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => setStep('email')}>
            <Text style={styles.link}>Не получи имейл? Опитай отново</Text>
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
  emailHighlight: { color: 'white', fontWeight: '600' },
  successIcon: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: 'white' },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#007AFF', textAlign: 'center', fontSize: 14, marginTop: 8 },
});