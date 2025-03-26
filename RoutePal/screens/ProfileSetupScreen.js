import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_PHOTOS = 6;
const { width } = Dimensions.get('window');

const slides = [0, 1, 2, 3];

const ProfileSetupScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [travelStyle, setTravelStyle] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('');
  const [socialPrefs, setSocialPrefs] = useState({
    alcohol: '',
    smoking: '',
    religion: '',
    zodiac: '',
  });
  const [about, setAbout] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const addPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const newPhoto = result.assets[0];
      setPhotos([...photos, newPhoto]);
    }
  };

  const handleSelect = (field, value) => {
    if (field === 'travelStyle') setTravelStyle(value);
    else if (field === 'travelPurpose') setTravelPurpose(value);
    else setSocialPrefs({ ...socialPrefs, [field]: value });
  };

  const renderOptions = (label, field, options, selected) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => handleSelect(field, opt)}
            style={{
              backgroundColor: selected === opt ? '#ff3366' : '#eee',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              margin: 4,
            }}
          >
            <Text style={{ color: selected === opt ? '#fff' : '#000' }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleSave = async () => {
    const payload = {
      photos,
      travelStyle,
      travelPurpose,
      alcohol: socialPrefs.alcohol,
      smoking: socialPrefs.smoking,
      religion: socialPrefs.religion,
      zodiac: socialPrefs.zodiac,
      about,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profil başarıyla kaydedildi', res.data);
      alert('Profiliniz kaydedildi!');
    } catch (err) {
      console.error('Profil kaydedilemedi:', err);
      alert('Bir hata oluştu.');
    }
  };

  const renderSlide = ({ item }) => {
    switch (item) {
      case 0:
        return (
          <View style={{ width, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Profil Fotoğrafları</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {photos.map((p, i) => (
                <Image key={i} source={{ uri: p.uri }} style={{ width: 80, height: 80, margin: 5, borderRadius: 10 }} />
              ))}
              {photos.length < MAX_PHOTOS && (
                <TouchableOpacity onPress={addPhoto} style={{ width: 80, height: 80, margin: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 10 }}>
                  <MaterialIcons name="add-a-photo" size={24} color="#888" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={{ width, padding: 20 }}>
            {renderOptions('Seyahat Tarzı', 'travelStyle', ['Lüks', 'Sırt Çantalı', 'Macera', 'Rahat'], travelStyle)}
            {renderOptions('Seyahat Amacı', 'travelPurpose', ['Keşif', 'Dinlenme', 'Eğlence', 'Arkadaşlık'], travelPurpose)}
          </View>
        );

      case 2:
        return (
          <View style={{ width, padding: 20 }}>
            {renderOptions('Alkol Kullanımı', 'alcohol', ['Evet', 'Hayır', 'Sosyal İçici'], socialPrefs.alcohol)}
            {renderOptions('Sigara Kullanımı', 'smoking', ['Evet', 'Hayır', 'Nadiren'], socialPrefs.smoking)}
            {renderOptions('Dini İnanç', 'religion', ['Müslüman', 'Hristiyan', 'Musevi', 'Agnostik', 'Belirtmek istemiyorum'], socialPrefs.religion)}
            {renderOptions('Burç', 'zodiac', ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'], socialPrefs.zodiac)}
          </View>
        );

      case 3:
        return (
          <View style={{ width, padding: 20 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Kısa Biyografi</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                marginTop: 5,
                textAlignVertical: 'top',
                height: 120,
              }}
              multiline
              numberOfLines={4}
              maxLength={300}
              placeholder="Kendinizden kısaca bahsedin (maks. 300 karakter)"
              value={about}
              onChangeText={setAbout}
            />
            <TouchableOpacity onPress={handleSave} style={{ marginTop: 20, backgroundColor: '#ff3366', padding: 12, borderRadius: 8 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={slides}
      renderItem={renderSlide}
      keyExtractor={(item) => item.toString()}
    />
  );
};

export default ProfileSetupScreen;
