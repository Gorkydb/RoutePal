import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import API_BASE_URL from "../config";

export default function ProfileEditScreen() {
  const [traits, setTraits] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.profile;
      setTraits(profile.traits || "");
      setUsagePurpose(profile.usage_purpose || "");
      setProfileImage(profile.profile_picture || null);
    } catch (error) {
      console.error("🚨 Profil bilgileri alınamadı:", error);
      Alert.alert("Hata", "Profil bilgileri yüklenemedi!");
    }
  };

  const handleImagePick = async (source) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("İzin Gerekli", "Fotoğraflara erişim izni verin.");
        return;
      }

      const pickerResult =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({ base64: true })
          : await ImagePicker.launchImageLibraryAsync({ base64: true });

      if (!pickerResult.canceled) {
        const manipResult = await ImageManipulator.manipulateAsync(
          pickerResult.assets[0].uri,
          [{ resize: { width: 600 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        const base64 = `data:image/jpeg;base64,${manipResult.base64}`;
        if (base64.length > 2_000_000) {
          Alert.alert("Hata", "Fotoğraf boyutu çok büyük.");
          return;
        }

        setProfileImage(base64);
      }
    } catch (error) {
      Alert.alert("Hata", "Fotoğraf yüklenemedi.");
    } finally {
      setModalVisible(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/profile/me`,
        {
          traits,
          usage_purpose: usagePurpose,
          profile_picture: profileImage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Başarılı", "Profil güncellendi.");
    } catch (error) {
      console.error("🚨 Profil güncelleme hatası:", error);
      Alert.alert("Hata", "Profil güncellenemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profili Düzenle</Text>

      {profileImage && <Image source={{ uri: profileImage }} style={styles.image} />}
      <TouchableOpacity style={styles.imageButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.imageButtonText}>Fotoğraf Değiştir</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={traits}
        onChangeText={setTraits}
        placeholder="Seyahat tarzınız"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={usagePurpose}
        onChangeText={setUsagePurpose}
        placeholder="Seyahat amacınız"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Güncelle</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => handleImagePick("camera")}>
            <Text style={styles.modalText}>📷 Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePick("gallery")}>
            <Text style={styles.modalText}>🖼️ Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={[styles.modalText, { color: "red" }]}>İptal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFD700", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#333", color: "#fff", padding: 10, borderRadius: 8, marginVertical: 10 },
  image: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 10 },
  imageButton: { backgroundColor: "#555", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  imageButtonText: { color: "#fff" },
  updateButton: { backgroundColor: "#32CD32", padding: 15, borderRadius: 8, alignItems: "center" },
  updateButtonText: { color: "#fff", fontWeight: "bold" },
  modal: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", bottom: 0, width: "100%" },
  modalText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
});

