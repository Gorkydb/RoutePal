import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedPlansScreen = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const saved = await AsyncStorage.getItem('saved_plans');
        setPlans(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error('Kayıtlı rotalar yüklenemedi:', e);
      }
    };

    const unsubscribe = loadPlans();
    return () => unsubscribe;
  }, []);

  const handleShare = async (plan) => {
    try {
      await Share.share({
        message: `Şehir: ${plan.city}
Gün: ${plan.days}
İlgi: ${plan.interest}

Plan:
${plan.plan}`
      });
    } catch (error) {
      Alert.alert('Paylaşım Hatası', 'Plan paylaşılırken bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    const filtered = plans.filter(p => p.id !== id);
    setPlans(filtered);
    await AsyncStorage.setItem('saved_plans', JSON.stringify(filtered));
  };

  const renderItem = ({ item }) => (
    <View style={styles.planCard}>
      <Text style={styles.planTitle}>{item.city} ({item.days} gün) - {item.interest}</Text>
      <Text style={styles.planText} numberOfLines={4}>{item.plan}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item)}>
          <Text style={styles.btnText}>Paylaş</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.emptyText}>Kayıtlı rota bulunamadı.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  planCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10
  },
  planTitle: {
    fontWeight: 'bold',
    marginBottom: 6
  },
  planText: {
    fontSize: 14,
    marginBottom: 10
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  shareBtn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5
  },
  deleteBtn: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5
  },
  btnText: {
    color: '#fff'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic'
  }
});

export default SavedPlansScreen;
