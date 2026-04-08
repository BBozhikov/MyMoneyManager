import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const PlaceholderImage = require('@/assets/images/banknote.png');

  return (
    <><Stack.Screen options={{
        headerShown:false,
    }} />
    
    <View style={styles.container}>
        <Image source={PlaceholderImage} style={styles.image}></Image>
          <Text style={styles.title}>Добре дошъл отново в My Money Manager</Text>

          <TextInput
              style={styles.input}
              placeholder="Имейл"
              placeholderTextColor={"white"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address" />

          <TextInput
              style={styles.input}
              placeholder="Парола"
              placeholderTextColor={"white"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry />

          <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => console.log(email, password)}>

            <Text style={styles.buttonText}>Влез</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Нямаш акаунт? Регистрирай се</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop:50}} activeOpacity={0.7} onPress={() => router.push('/(tabs)/main')}>
            <Text style={styles.link2}>Искаш без акаунт? Използвай локално приложението</Text>
        </TouchableOpacity>
    </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color:"white",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color:"white",
    
  },
  button: {
    backgroundColor: '#007AFF',
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
    link2: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
  image:{
    alignSelf:"center",
    marginBottom: 20, 
    height: 78,
    width: 102,
  },
});
