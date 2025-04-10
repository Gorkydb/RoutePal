import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { navigationRef } from './navigation/navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const profileComplete = await AsyncStorage.getItem('profileComplete');
    setIsLoggedIn(!!token);
    setIsProfileComplete(profileComplete === 'true');
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator isLoggedIn={isLoggedIn} isProfileComplete={isProfileComplete} />
    </NavigationContainer>
  );
}
