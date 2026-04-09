import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const PlaceholderImage = require('@/assets/images/banknote.png');

  return (
    <><Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b4d47' }}>
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />

      <Text style={styles.title}>Създай акаунт</Text>

      <TextInput
        style={styles.input}
        placeholder="Име"
        placeholderTextColor="white"
        value={name}
        onChangeText={setName}/>

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
        onPress={() => console.log(name, email, password)}>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});