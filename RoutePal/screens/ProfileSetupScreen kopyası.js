// ProfileSetupScreen.js (API destekli autocomplete ve konum bazlı seçim)

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput,
  Image, Alert, Animated, Easing, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import steps from '../assets/steps.json';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen({ navigation }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const visibleSteps = steps.filter(step => {
    if (!step.condition) return true;
    try {
      const conditionFunc = new Function('formData', `return ${step.condition}`);
      return conditionFunc(formData);
    } catch {
      return false;
    }
  });

  const currentStep = visibleSteps[stepIndex];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (stepIndex + 1) / visibleSteps.length,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [stepIndex]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (schoolQuery.length > 1) fetchSchools(schoolQuery);
    else setFilteredSchools([]);
  }, [schoolQuery]);

  const fetchCountries = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      const countryNames = res.data.map(c => c.name.common).sort();
      setCountryList(countryNames);
    } catch (e) {
      console.error('Ülkeler alınamadı:', e);
    }
  };

  const fetchCities = async (country) => {
    try {
      const res = await axios.get(`http://localhost:5001/cities?country=${country}`);
      setCityList(res.data);
    } catch (e) {
      console.error('Şehirler alınamadı:', e);
    }
  };

  const fetchSchools = async (query) => {
    try {
      const res = await axios.get(`http://localhost:5001/schools?q=${query}`);
      setFilteredSchools(res.data);
    } catch (e) {
      console.error('Okullar alınamadı:', e);
    }
  };


  const currentStep = visibleSteps[stepIndex];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (stepIndex + 1) / visibleSteps.length,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [stepIndex]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(loc.coords);
        const { city, country } = geocode[0];
        if (countryList.includes(country)) {
          setFormData(prev => ({ ...prev, country, city }));
          setCityList(cityData[country]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredSchools(
      schoolList.filter(school =>
        school.toLowerCase().includes(schoolQuery.toLowerCase())
      )
    );
  }, [schoolQuery]);

    const handleNext = async () => {
      if (stepIndex < visibleSteps.length - 1) {
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
          Alert.alert('Hata', 'Profil kaydedilemedi.');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const handleSelect = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
      if (key === 'country') fetchCities(value);
      handleNext();
    };

    const renderAutocomplete = () => (
      <View style={styles.card}>
        <Text style={styles.title}>{currentStep.question}</Text>
        <TextInput
          style={styles.input}
          placeholder="Okulunuzu yazın"
          value={schoolQuery}
          onChangeText={setSchoolQuery}
        />
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setFormData(prev => ({ ...prev, schoolName: item }));
                setSchoolQuery(item);
                handleNext();
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
        />
      </View>
    );

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{currentStep.question}</Text>
        <TextInput style={styles.input} placeholder="Adınız"
          onChangeText={text => setFormData(prev => ({ ...prev, name: text }))} />
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{formData.birthDate || 'Doğum Tarihinizi Seçin'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setShowDatePicker(false)}
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAutocomplete = () => (
    <View style={styles.card}>
      <Text style={styles.title}>{currentStep.question}</Text>
      <TextInput
        style={styles.input}
        placeholder="Okulunuzu yazın"
        value={schoolQuery}
        onChangeText={setSchoolQuery}
      />
      <FlatList
        data={filteredSchools}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setFormData(prev => ({ ...prev, schoolName: item }));
              setSchoolQuery(item);
              handleNext();
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );

  const renderOption = () => (
    <View style={styles.card}>
      <Text style={styles.title}>{currentStep.question}</Text>
      <View style={styles.tagsContainer}>
        {currentStep.options.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.tag, formData[currentStep.key] === option && styles.tagSelected]}
            onPress={() => handleSelect(currentStep.key, option)}
          >
            <Text style={styles.tagText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMulti = () => {
    const selected = formData[currentStep.key] || [];
    const toggleSelect = (option) => {
      const newSelection = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      setFormData(prev => ({ ...prev, [currentStep.key]: newSelection }));
    };

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{currentStep.question}</Text>
        <View style={styles.tagsContainer}>
          {currentStep.options.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.tag, selected.includes(option) && styles.tagSelected]}
              onPress={() => toggleSelect(option)}
            >
              <Text style={styles.tagText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'welcome':
        return (
          <View style={styles.card}>
            <Text style={styles.title}>{currentStep.question}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Başla</Text>
            </TouchableOpacity>
          </View>
        );
      case 'inputGroup': return renderInputGroup();
      case 'autocomplete': return renderAutocomplete();
      case 'option': return currentStep.allowMultiple ? renderMulti() : renderOption();
      case 'multi': return renderMulti();
      case 'countrySelect': return renderCountrySelect();
      case 'citySelect': return renderCitySelect();
      case 'photo': return renderPhoto();
        case 'complete':
          return (
            <View style={styles.card}>
              <Text style={styles.title}>Tebrikler 🎉</Text>
              <Text style={{ marginBottom: 16, fontSize: 16, textAlign: 'center' }}>
                Profilin tamamlandı!
              </Text>
              {isSubmitting ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextText}>Başla</Text>
                </TouchableOpacity>
              )}
            </View>
          );


      default:
        return (
          <View style={styles.card}>
            <Text style={styles.title}>Tanımsız adım: {currentStep.type}</Text>
          </View>
        );
    }
  };
    
const renderCountrySelect = () => (
  <View style={styles.card}>
    <Text style={styles.title}>{currentStep.question}</Text>
    <View style={styles.tagsContainer}>
      {countryList.map(country => (
        <TouchableOpacity
          key={country}
          style={[styles.tag, formData.country === country && styles.tagSelected]}
          onPress={() => handleSelect('country', country)}
        >
          <Text style={styles.tagText}>{country}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const renderCitySelect = () => (
  <View style={styles.card}>
    <Text style={styles.title}>{currentStep.question}</Text>
    <View style={styles.tagsContainer}>
      {(cityList.length > 0 ? cityList : ['Manuel Giriş']).map(city => (
        <TouchableOpacity
          key={city}
          style={[styles.tag, formData.city === city && styles.tagSelected]}
          onPress={() => handleSelect('city', city)}
        >
          <Text style={styles.tagText}>{city}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
    
    const renderPhoto = () => (
      <View style={styles.card}>
        <Text style={styles.title}>{currentStep.question}</Text>
        <TouchableOpacity
          style={styles.photoBox}
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
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

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );


  const animatedWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

return (
  <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.container}>
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
    {renderStep()}
  </LinearGradient>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    progressBarContainer: {
        width: '80%', height: 8, borderRadius: 4, backgroundColor: '#ffffff50', marginTop: 60, overflow: 'hidden'
    },
    progressBar: {
        height: '100%', backgroundColor: '#fff', borderRadius: 4
    },
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
        width: '100%', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#ccc', marginBottom: 16, backgroundColor: '#fff'
    },
    nextButton: {
        backgroundColor: '#f67280', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 20, marginTop: 20
    },
    nextText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    tagsContainer: {
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginVertical: 16
    },
    tag: {
        paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#ffffff70', borderRadius: 30, margin: 6
    },
    tagSelected: { backgroundColor: '#355c7d' },
    tagText: { fontSize: 14, color: '#333' },
    optionButton: {
        padding: 12,
        backgroundColor: '#ffffff70',
        borderRadius: 10,
        marginBottom: 8
    },
    photoBox: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginVertical: 20,
    },
    photoImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
    }
});
