import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../config";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// API İsteklerine Token Kontrolü Ekleyelim
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🚨 Token süresi doldu! Kullanıcı çıkış yapacak...");

      try {
        await AsyncStorage.removeItem("jwt_token"); // 🔥 AsyncStorage'i async fonksiyon içinde çağırıyoruz
        Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapın.");
        const navigation = useNavigation(); // Navigasyonu içeriye aldık
        navigation.replace("Login"); // Kullanıcıyı giriş ekranına yönlendir
      } catch (err) {
        console.error("🚨 Token temizleme hatası:", err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
k
