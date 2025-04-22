import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { navigationRef } from '../navigation/navigationRef';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

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
    <View style={styles.container}>
      <AntDesign name="user" size={60} color="#007AFF" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"           // 👈 büyük harf engeli kalkar
            autoCorrect={false}             // 👈 otomatik düzeltme kapanır
          />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />

      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Şifre (Tekrar)" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleMode}>
        <Text style={styles.toggleText}>
          {mode === 'login' ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    width: width * 0.85,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f9f9f9'
  },
  button: {
    width: width * 0.85,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  toggleText: {
    color: '#007AFF',
    marginTop: 15,
    fontWeight: '500'
  }
});
