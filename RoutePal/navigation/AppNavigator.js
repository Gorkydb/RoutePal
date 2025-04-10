import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import MainScreen from '../screens/MainScreen';
import TravelAssistantScreen from '../screens/TravelAssistantScreen';
import TravelMapScreen from '../screens/TravelMapScreen';
import SavedPlansScreen from '../screens/SavedPlansScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, isProfileComplete }) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        !isLoggedIn ? "Login" : !isProfileComplete ? "ProfileSetup" : "Main"
      }
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="TravelAssistant" component={TravelAssistantScreen} />
      <Stack.Screen name="TravelMap" component={TravelMapScreen} />
      <Stack.Screen name="SavedPlans" component={SavedPlansScreen} />
    </Stack.Navigator>
  );
}
