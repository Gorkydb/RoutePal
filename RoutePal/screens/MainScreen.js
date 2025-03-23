
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import NearbyPlacesScreen from "./NearbyPlacesScreen";
import MatchScreen from "./MatchScreen";
import HomeScreen from "./HomeScreen";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#ccc",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Keşfet") iconName = "location";
          else if (route.name === "Arkadaşlık") iconName = "heart";
          else iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#1e1e1e" },
      })}
    >
      <Tab.Screen name="Keşfet" component={NearbyPlacesScreen} />
      <Tab.Screen name="Arkadaşlık" component={MatchScreen} />
      <Tab.Screen name="Profil" component={HomeScreen} />
    </Tab.Navigator>
  );
}
