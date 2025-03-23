
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AppNavigator from "./navigation/AppNavigator";
import API_BASE_URL from "./config";
import { EventEmitter } from "fbemitter";

export const navigationRef = React.createRef();
export const loginEventEmitter = new EventEmitter();
export const logoutEventEmitter = new EventEmitter();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("✅ AsyncStorage Token:", token);

      if (!token) {
        setIsLoggedIn(false);
        setIsProfileComplete(false);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.profile;

      setIsLoggedIn(true);
      setIsProfileComplete(Boolean(profile?.traits && profile?.usage_purpose));
    } catch (error) {
      console.error("❌ Giriş kontrol hatası:", error);
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const loginSub = loginEventEmitter.addListener("loginSuccess", checkLoginStatus);
    const logoutSub = logoutEventEmitter.addListener("logout", checkLoginStatus);

    return () => {
      loginSub.remove();
      logoutSub.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E" }}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator isLoggedIn={isLoggedIn} isProfileComplete={isProfileComplete} />
    </NavigationContainer>
  );
}
