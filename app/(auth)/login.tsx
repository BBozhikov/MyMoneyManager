import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const PlaceholderImage = require('@/assets/images/banknote.png');

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedRemember = await AsyncStorage.getItem('rememberMe');
        if (savedRemember === 'true' && savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (_) {}
    };
    loadSaved();
  }, []);

  const handleLogin = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.setItem('rememberMe', 'false');
      }
    } catch (_) {}
    // TODO: Логика за автентикация
    console.log(email, password);
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
          style={styles.checkboxRow}
          activeOpacity={0.7}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Запомни ме</Text>
        </TouchableOpacity>

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

      <TouchableOpacity style={{ marginTop: 50 }} activeOpacity={0.7} onPress={() => router.push('/(tabs)/main')}>
        <Text style={styles.link2}>Искаш без акаунт? Използвай локално приложението</Text>
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
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#ccc', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  checkmark: { color: 'white', fontSize: 13, fontWeight: 'bold', lineHeight: 16 },
  rememberText: { color: 'white', fontSize: 14 },
  forgotText: { color: '#007AFF', fontSize: 14 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#007AFF', textAlign: 'center', fontSize: 14 },
  link2: { color: '#007AFF', textAlign: 'center', fontSize: 14 },
  image: { alignSelf: 'center', marginBottom: 20, height: 78, width: 102 },
});
