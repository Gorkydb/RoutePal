import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../config";
import { loginEventEmitter } from "../App";

export default function ProfileSetupScreen() {
  const [traits, setTraits] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleSubmit = async () => {
    if (!traits || !usagePurpose) {
      Alert.alert("Eksik Alan", "Lütfen tüm bilgileri doldurun.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/profile/update`,
        {
          traits,
          usage_purpose: usagePurpose,
          profile_picture: profileImage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loginEventEmitter.emit("loginSuccess");
    } catch (error) {
      console.error("Profil güncellenemedi:", error);
      Alert.alert("Hata", "Profil güncellenirken bir hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>

      {profileImage && <Image source={{ uri: profileImage }} style={styles.image} />}
      <TouchableOpacity style={styles.imageButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.imageButtonText}>Fotoğraf Seç</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Seyahat tarzın (örnek: Maceracı)"
        value={traits}
        onChangeText={setTraits}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Seyahat amacın"
        value={usagePurpose}
        onChangeText={setUsagePurpose}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Kaydet ve Devam Et</Text>
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
  submitButton: { backgroundColor: "#FF4500", padding: 15, borderRadius: 8, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  modal: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", bottom: 0, width: "100%" },
  modalText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
});
