import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const TravelMapScreen = ({ route }) => {
  const { places } = route.params; // AI'dan gelen yer isimleri
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const results = await Promise.all(
          places.map(async (place) => {
            const res = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json`,
              {
                params: {
                  address: place,
                  key: GOOGLE_API_KEY
                }
              }
            );
            const location = res.data.results[0]?.geometry.location;
            return location
              ? {
                  name: place,
                  latitude: location.lat,
                  longitude: location.lng
                }
              : null;
          })
        );
        setLocations(results.filter(Boolean));
      } catch (error) {
        console.error('Yerler alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Yerler bulunamadı.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }}
    >
      {locations.map((loc, idx) => (
        <Marker
          key={idx}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title={loc.name}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TravelMapScreen;
