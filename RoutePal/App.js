import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';
import { navigationRef } from './navigationRef';
import { loginEventEmitter, logoutEventEmitter } from './constants/eventEmitters';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const profile = await AsyncStorage.getItem('profileComplete');
    setIsLoggedIn(!!token);
    setIsProfileComplete(profile === 'true');
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();

    const loginSub = loginEventEmitter.addListener('login', checkLoginStatus);
    const logoutSub = logoutEventEmitter.addListener('logout', checkLoginStatus);

    return () => {
      loginSub.remove();
      logoutSub.remove();
    };
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator isLoggedIn={isLoggedIn} isProfileComplete={isProfileComplete} />
    </NavigationContainer>
  );
}
