import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const TravelAssistantScreen = () => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState('');
  const [interest, setInterest] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const handleGeneratePlan = async () => {
    if (!city || !days || !interest) {
      Alert.alert("Eksik bilgi", "Lütfen şehir, gün ve ilgi alanı girin.");
      return;
    }

    const prompt = customPrompt || 
      `Ben şu an ${city} şehrindeyim. ${days} günlük bir seyahat planlıyorum. ${interest} temalı bir rota istiyorum. Sabah-akşam detaylı önerilerle bir gezi planı sun.`

    try {
      setLoading(true);
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Sen deneyimli bir seyahat planlayıcısın.' },
          { role: 'user', content: prompt }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = res.data.choices[0].message.content;
      setResponseText(aiResponse);
    } catch (error) {
      console.error("OpenAI API Hatası:", error);
      Alert.alert("Hata", "Rota oluşturulurken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yapay Zeka Seyahat Asistanı</Text>

      <TextInput
        placeholder="Şehir (örn: Roma)"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />

      <TextInput
        placeholder="Kaç gün?"
        value={days}
        onChangeText={setDays}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="İlgi alanı (kültürel, doğa, gastronomi...)"
        value={interest}
        onChangeText={setInterest}
        style={styles.input}
      />

      <TextInput
        placeholder="Opsiyonel özel istek (örn: Tarihi yerler odaklı rota)"
        value={customPrompt}
        onChangeText={setCustomPrompt}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <TouchableOpacity style={styles.button} onPress={handleGeneratePlan}>
        <Text style={styles.buttonText}>Rota Oluştur</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {responseText ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{responseText}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  responseBox: {
    marginTop: 30,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8
  },
  responseText: {
    fontSize: 16,
    lineHeight: 22
  }
});

export default TravelAssistantScreen;
