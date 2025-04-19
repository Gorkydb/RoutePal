import React, { useState, useRef } from 'react';
import { BlurView } from 'expo-blur';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Animated, PanResponder } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const steps = [
  { key: 'travelStyle', question: 'Seyahat tarzını nasıl tanımlarsın?', options: ['Macera', 'Rahat', 'Kültürel'] },
  { key: 'travelPurpose', question: 'Seyahat amacın nedir?', options: ['Keşfetmek', 'Dinlenmek', 'Arkadaşlık'] },
  { key: 'smoking', question: 'Sigara kullanıyor musun?', options: ['Evet', 'Hayır', 'Bazen'] },
  { key: 'alcohol', question: 'Alkol tercihin nedir?', options: ['Evet', 'Hayır', 'Bazen'] },
  { key: 'birthDate', question: 'Doğum tarihin nedir?', input: true },
  { key: 'zodiac', question: 'Burcun nedir?', options: ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'] },
  { key: 'bio', question: 'Kendini kısaca tanıtır mısın?', input: true },
  { key: 'photo', question: 'Kendini en iyi yansıtan fotoğrafı seç.' },
  { key: 'complete', question: 'Profiliniz başarıyla oluşturuldu 🎉' }
];

export default function ProfileSetupScreen({ navigation }) {
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleSelect = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    handleNext();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!result.canceled) {
      setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
      handleNext();
    }
  };

  const handleNext = async () => {
    if (step === steps.length + 1) return;

    if (step < steps.length - 1) {
      Animated.spring(slideAnim, {
        toValue: -1 * width * Math.min(step + 1, steps.length - 1),
        useNativeDriver: true
      }).start();
      setStep(step + 1);
    } else if (step === steps.length - 1) {
      Animated.spring(slideAnim, {
        toValue: -(step + 1) * width,
        useNativeDriver: true
      }).start();
      setStep(step + 1);
    } else if (step === steps.length) {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.post('/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200 || response.status === 201) {
          Animated.sequence([
            Animated.timing(confettiAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true
            }),
            Animated.delay(800)
          ]).start(() => {
            Alert.alert('Tebrikler!', 'Profiliniz başarıyla oluşturuldu.', [
              {
                text: 'Devam Et',
                onPress: () => {
                  navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                }
              }
            ]);
          });
        } else {
          throw new Error('Sunucu beklenmeyen bir yanıt verdi');
        }
      } catch (err) {
        console.log('Profil kaydedilemedi:', err);
        Alert.alert('Hata', 'Profil kaydedilemedi');
      }
        Alert.alert('Tebrikler!', 'Profiliniz başarıyla oluşturuldu.', [
          {
            text: 'Devam Et',
            onPress: async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                await api.post('/profile/create', formData, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
              } catch (err) {
                console.log('Profil kaydedilemedi:', err);
                Alert.alert('Hata', 'Profil kaydedilemedi');
              }
            }
          }
        ]);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50 && step > 0) {
          Animated.spring(slideAnim, {
            toValue: -1 * width * Math.max(step - 1, 0),
            useNativeDriver: true
          }).start();
          setStep(step - 1);
        }
      }
    })
  ).current;

  const cardColors = ['#FFDEE9', '#B5FFFC', '#FFE7BA', '#C5E1A5', '#F3E5F5', '#B3E5FC', '#FFCDD2', '#E1F5FE'];

const renderStep = (item, index) => {
  if (item.key === 'complete') {
    return (
      <Animated.View key={index} style={[styles.card, {
        width,
        backgroundColor: cardColors[index % cardColors.length],
        justifyContent: 'center'
      }]}>
        <Text style={styles.title}>{item.question}</Text>
        <Text style={styles.optionText}>Uygulamayı kullanmaya hazırsınız!</Text>
        <TouchableOpacity onPress={handleNext} style={[styles.optionBtn, styles.successButton]}>
          <Text style={styles.successButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View key={index} style={[styles.card, {
      width,
      backgroundColor: cardColors[index % cardColors.length]
    }]}>
      <Text style={styles.title}>{item.question}</Text>
      {item.input ? (
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => Alert.prompt('Bilgi Gir', item.question, text => handleSelect(item.key, text))}
        >
          <Text style={styles.inputText}>{formData[item.key] || 'Yanıtla'}</Text>
        </TouchableOpacity>
      ) : item.key === 'photo' ? (
        <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
          {formData.photo ? (
            <Image source={{ uri: formData.photo }} style={styles.image} />
          ) : (
            <Text style={styles.inputText}>Fotoğraf Seç</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.optionsContainer}>
          {item.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionBtn}
              onPress={() => handleSelect(item.key, opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};


return (
    <View style={styles.root}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.wrapper}>
        <View style={styles.progressBarWrapper}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === step && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <Animated.View
          style={{
              width: width * steps.length,
            flexDirection: 'row',
            transform: [{ translateX: slideAnim }]
          }}
          {...panResponder.panHandlers}
        >
        {steps.map((item, index) => (
        <View key={index} style={{ width }}>
        {renderStep(item, index)}
        </View>
        ))}
        </Animated.View>
      </View>
    </View>
  );
  }


const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative'
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffeaa7',
    zIndex: 5,
    opacity: 0.8
  },
  successButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  gradientBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  swipeHintWrapper: {
    position: 'absolute',
    top: height * 0.5 - 20,
    left: 20,
    right: 20,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  swipeHint: {
    fontSize: 30,
    opacity: 0.2
  },

  wrapper: {
    flex: 1,
    backgroundColor: '#fefefe',
    justifyContent: 'center'
  },
  progressBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    gap: 8
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc'
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.4 }]
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fefefe'
  },
  card: {
    paddingHorizontal: 30,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  optionsContainer: { gap: 16 },
  optionBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, marginVertical: 6, minWidth: 200 },
  successButton: { marginTop: 20, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  optionText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  inputBox: { borderWidth: 1, borderColor: '#ccc', padding: 14, borderRadius: 10 },
  inputText: { fontSize: 16 },
  photoBox: { width: width * 0.7, height: width * 0.7, borderRadius: 14, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%', borderRadius: 14 },
  
});
