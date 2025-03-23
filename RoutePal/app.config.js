// app.config.js
import "dotenv/config";

export default {
  expo: {
    name: "RoutePal",
    slug: "RoutePal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    sdkVersion: "52.0.0",
    platforms: ["ios", "android"],
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gorky.routepal"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.gorky.routepal"
    },
    web: {
      favicon: "./assets/icon.png"
    },
    plugins: ["expo-router", "expo-dev-client"],
    extra: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
    }
  }
};

