import React, { useState } from 'react';
import {
  View, Text, Button, Image, TouchableOpacity,
  ScrollView, Alert, FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const travelStyles = ['Solo', 'Grup', 'Macera', 'Lüks'];
const travelPurposes = ['Keşif', 'Dinlenme', 'İş', 'Eğlence'];
const hobbiesOptions = ['Müzik', 'Kamp', 'Fotoğrafçılık', 'Yürüyüş'];

export default function ProfileSetupScreen() {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedTravelStyle, setSelectedTravelStyle] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [base64Photo, setBase64Photo] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setPhotoUri(manipulated.uri);
      setBase64Photo(manipulated.base64);
    }
  };

  const toggleHobby = (hobby) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('user_id');

      const profileData = {
        user_id: userId,
        hobbies: selectedHobbies,
        travel_style: selectedTravelStyle,
        purpose: selectedPurpose,
        photo: base64Photo,
      };

      const response = await axios.post('http://localhost:5001/profile/update', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('profileComplete', 'true');
        Alert.alert('Başarılı', 'Profiliniz kaydedildi.');
      } else {
        Alert.alert('Hata', 'Profil kaydedilemedi.');
      }
    } catch (error) {
      console.error('Profil güncellenemedi:', error);
      Alert.alert('Hata', 'Profil güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Hobiler</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {hobbiesOptions.map((hobby) => (
          <TouchableOpacity
            key={hobby}
            onPress={() => toggleHobby(hobby)}
            style={{
              margin: 5,
              padding: 10,
              backgroundColor: selectedHobbies.includes(hobby) ? 'skyblue' : 'lightgray',
            }}>
            <Text>{hobby}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Seyahat Tarzı</Text>
      {travelStyles.map((style) => (
        <TouchableOpacity key={style} onPress={() => setSelectedTravelStyle(style)}>
          <Text style={{
            backgroundColor: selectedTravelStyle === style ? 'skyblue' : 'lightgray',
            margin: 5, padding: 10
          }}>{style}</Text>
        </TouchableOpacity>
      ))}

      <Text>Seyahat Amacı</Text>
      {travelPurposes.map((purpose) => (
        <TouchableOpacity key={purpose} onPress={() => setSelectedPurpose(purpose)}>
          <Text style={{
            backgroundColor: selectedPurpose === purpose ? 'skyblue' : 'lightgray',
            margin: 5, padding: 10
          }}>{purpose}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={pickImage} style={{ marginVertical: 10 }}>
        <Text style={{ color: 'blue' }}>Fotoğraf Seç</Text>
      </TouchableOpacity>

      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}

      <Button title={loading ? 'Kaydediliyor...' : 'Profili Kaydet'} onPress={handleSubmit} disabled={loading} />
    </ScrollView>
  );
}
