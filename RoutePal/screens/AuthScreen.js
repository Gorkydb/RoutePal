// AuthScreen.js (ProfileSetup UI uyumlu versiyon)

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/navigationRef';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleMode = () => setMode(mode === 'login' ? 'register' : 'login');

  const handleAuth = async () => {
    if (mode === 'register' && password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    try {
      const url = `http://localhost:5001/auth/${mode}`;
      const payload = { email, password };
      const response = await axios.post(url, payload);

      if (mode === 'login') {
        const token = response.data.token;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('profileComplete', 'false');

        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'ProfileSetup' }]
          });
        }
      } else {
        Alert.alert('Başarılı', 'Kayıt tamamlandı. Giriş yapabilirsiniz.');
        setMode('login');
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert('Hata', error?.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.container}>
      <View style={styles.card}>
        <AntDesign name="user" size={60} color="#007AFF" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Şifre (Tekrar)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleAuth}>
          <Text style={styles.nextText}>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.toggleText}>
            {mode === 'login' ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: width * 0.85,
    backgroundColor: '#ffffff90',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  nextButton: {
    backgroundColor: '#f67280',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20
  },
  nextText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  toggleText: {
    color: '#007AFF',
    marginTop: 15,
    fontWeight: '500'
  }
});
