
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import MainScreen from "../screens/MainScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ isLoggedIn, isProfileComplete }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : !isProfileComplete ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainScreen} />
      )}
    </Stack.Navigator>
  );
}
