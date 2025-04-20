// ProfileSetupScreen.js (tam hali - hook hatası giderildi ve stil kısmı dahil)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Image, TextInput, ScrollView, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import steps from '../assets/steps.json';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const countryList = ['Türkiye', 'Almanya', 'Fransa', 'İngiltere', 'ABD', 'İtalya'];
const schoolList = ['ODTÜ', 'Bilkent', 'Boğaziçi', 'Hacettepe', 'İTÜ', 'Koç Üniversitesi'];

export default function ProfileSetupScreen({ navigation }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [locationGranted, setLocationGranted] = useState(false);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        const loc = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(loc.coords);
        const { city, country } = geocode[0];
        setFormData(prev => ({ ...prev, location: country, city }));
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredSchools(
      schoolList.filter((school) =>
        school.toLowerCase().includes(schoolQuery.toLowerCase())
      )
    );
  }, [schoolQuery]);

  const currentStep = steps[stepIndex];

  const handleNext = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await axios.post('http://localhost:5001/profile', formData);
        if (response.status === 200 || response.status === 201) {
          await AsyncStorage.setItem('profileComplete', 'true');
          Alert.alert('Başarılı', 'Profilin başarıyla oluşturuldu.');
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        } else {
          Alert.alert('Hata', 'Sunucudan beklenmeyen bir cevap alındı.');
        }
      } catch (error) {
        console.error('Profil gönderim hatası:', error);
        Alert.alert('Hata', 'Profil kaydedilemedi. Lütfen tekrar deneyin.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('profileComplete');
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  const handleSelect = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    handleNext();
  };

  const renderWelcome = () => (
    <View style={styles.welcomeCard}>
      <Text style={styles.title}>Sizi daha iyi tanımamıza yardımcı olun</Text>
      <Text style={styles.subtitle}>Profilinizi oluşturarak RoutePal deneyimini kişiselleştirin.</Text>
      <TouchableOpacity style={styles.nextButton} onPress={() => setStepIndex(1)}>
        <Text style={styles.nextText}>Başla</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummary = () => (
    <View style={{ width: '100%' }}>
      {Object.entries(formData).map(([key, value]) => (
        <View key={key} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
          <Text>{Array.isArray(value) ? value.join(', ') : value}</Text>
        </View>
      ))}
      {isSubmitting ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Gönder ve Başla</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInputGroup = () => (
    <View style={{ width: '100%' }}>
      <TextInput
        placeholder="Ad"
        style={styles.input}
        onChangeText={(text) => setFormData(prev => ({ ...prev, ad: text }))}
      />
      <TextInput
        placeholder="Soyad"
        style={styles.input}
        onChangeText={(text) => setFormData(prev => ({ ...prev, soyad: text }))}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOptions = (step) => (
    <View style={styles.optionsContainer}>
      {step.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionButton}
          onPress={() => handleSelect(step.key, option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMultiOptions = (step) => {
    const selected = formData[step.key] || [];
    const toggleSelect = (option) => {
      const newSelection = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      setFormData(prev => ({ ...prev, [step.key]: newSelection }));
    };
    return (
      <View style={styles.optionsContainer}>
        {step.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, selected.includes(option) && styles.optionSelected]}
            onPress={() => toggleSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPhotoPicker = () => (
    <TouchableOpacity
      style={styles.photoBox}
      onPress={async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
          setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
      }}
    >
      {formData.photo ? (
        <Image source={{ uri: formData.photo }} style={styles.photoImage} />
      ) : (
        <Text>Fotoğraf Seç</Text>
      )}
    </TouchableOpacity>
  );

  const renderTextInput = (step) => (
    <View style={{ width: '100%' }}>
      <TextInput
        placeholder={step.placeholder || ''}
        style={styles.input}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [step.key]: text }))}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCountrySelect = () => (
    <View style={styles.optionsContainer}>
      {countryList.map((country) => (
        <TouchableOpacity key={country} style={styles.optionButton} onPress={() => handleSelect('country', country)}>
          <Text style={styles.optionText}>{country}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCitySelect = () => (
    <TextInput
      placeholder="Şehir"
      style={styles.input}
      onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
    />
  );


    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: 'center' },
      card: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.9)'
      },
      title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
      subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
      optionsContainer: { width: '100%', marginBottom: 24 },
      optionButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 16, marginBottom: 10 },
      optionSelected: { backgroundColor: '#34C759' },
      optionText: { color: '#fff', fontSize: 16, textAlign: 'center' },
      nextButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 20, marginTop: 20 },
      nextText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
      photoBox: { width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
      photoImage: { width: '100%', height: '100%', borderRadius: 75 },
      input: { width: '100%', padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, marginBottom: 16, fontSize: 16 },
      logoutButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
      welcomeCard: { alignItems: 'center', marginTop: 16 }
    });
