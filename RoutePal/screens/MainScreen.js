import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';

const features = [
  {
    title: 'RouteMatch',
    subtitle: 'Birlikte seyahat et',
    icon: <Ionicons name="heart-circle" size={36} color="white" />,
    color: '#FF6B6B',
  },
  {
    title: 'GroupMatch',
    subtitle: 'Grup gezilerine katıl',
    icon: <FontAwesome5 name="users" size={32} color="white" />,
    color: '#FFB830',
  },
  {
    title: 'SmartExplore',
    subtitle: 'Yapay zekadan öneriler al',
    icon: <MaterialCommunityIcons name="robot-excited" size={36} color="white" />,
    color: '#6A89CC',
  },
  {
    title: 'RoutePlanner',
    subtitle: 'Gezini baştan sona oluştur',
    icon: <FontAwesome5 name="route" size={32} color="white" />,
    color: '#38ADA9',
  },
  {
    title: 'RouteShare',
    subtitle: 'Rotanı arkadaşlarınla paylaş',
    icon: <MaterialCommunityIcons name="share-variant" size={36} color="white" />,
    color: '#F8C291',
  },
  {
    title: 'MemoryWall',
    subtitle: 'Seyahat anılarını kaydet',
    icon: <Ionicons name="images" size={36} color="white" />,
    color: '#786FA6',
  },
  {
    title: 'NearbyPlaces',
    subtitle: 'Yakındaki en iyi yerleri keşfet',
    icon: <Ionicons name="map" size={36} color="white" />,
    color: '#60A3BC',
  },
];

export default function MainScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {features.map((feature, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: feature.color }]}
          onPress={() => navigation.navigate(feature.title)}
        >
          {feature.icon}
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.subtitle}>{feature.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 12,
  },
  card: {
    width: '45%',
    aspectRatio: 1.2,
    borderRadius: 16,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    padding: 10,
  },
  title: {
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
});
