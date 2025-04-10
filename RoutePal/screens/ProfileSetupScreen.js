import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProfileSetupScreen = ({ navigation }) => {
  const [travelStyle, setTravelStyle] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('');
  const [smoking, setSmoking] = useState('');
  const [drinking, setDrinking] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setPhotos([...photos, { uri: result.assets[0].uri }]);
    }
  };

  const handleSubmit = async () => {
    if (!travelStyle || !travelPurpose || !bio) {
      Alert.alert("Eksik Alanlar", "Lütfen tüm gerekli bilgileri doldurun.");
      return;
    }

    const payload = {
      travelStyle,
      travelPurpose,
      smoking,
      drinking,
      birthDate,
      bio,
      photos
    };

    try {
      const token = 'KULLANICI_TOKEN'; // token auth sistemine göre alınmalı
      await axios.post('http://localhost:5000/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Başarılı", "Profiliniz kaydedildi.");
      navigation.navigate('Main');
    } catch (error) {
      console.error("Profil kaydedilemedi:", error);
      Alert.alert("Hata", "Profil kaydedilirken bir hata oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Seyahat Tarzı</Text>
      <TextInput style={styles.input} value={travelStyle} onChangeText={setTravelStyle} />

      <Text style={styles.label}>Seyahat Amacı</Text>
      <TextInput style={styles.input} value={travelPurpose} onChangeText={setTravelPurpose} />

      <Text style={styles.label}>Sigara</Text>
      <TextInput style={styles.input} value={smoking} onChangeText={setSmoking} />

      <Text style={styles.label}>Alkol</Text>
      <TextInput style={styles.input} value={drinking} onChangeText={setDrinking} />

      <Text style={styles.label}>Doğum Tarihi</Text>
      <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Biyografi</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={bio} onChangeText={setBio} multiline />

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Fotoğraf Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Kaydet ve Devam Et</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5
  },
  button: {
    backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 20
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default ProfileSetupScreen;
