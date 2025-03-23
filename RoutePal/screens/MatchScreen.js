
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MatchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Arkadaşlık Özelliği Çok Yakında 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1e1e1e" },
  text: { color: "#FFD700", fontSize: 18, fontWeight: "bold" },
});
