import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "IdeaPilot",
  slug: "ideapilot",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "ideapilot",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  /*
  ios: {
    supportsTablet: true,
    splash: {
      image: "./assets/images/logo.svg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      // Dark mode configuration
      dark: {
        image: "./assets/images/logo-dark.svg",
        backgroundColor: "#000000"
      }
    },
  },
  */
  android: {
    package: process.env.ANDROID_PACKAGE || "com.vamos23.ideapilot",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundColor: "#ffffff",
      // Dark mode configuration
      dark: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#060C1C",
      },
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-asset",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        imageWidth: 300,
        resizeMode: "contain",
        backgroundColor: "#000000",
        dark: {
          image: "./assets/images/logo.png",
          imageWidth: 300,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    enabled: true,
    fallbackToCacheTimeout: 0,
    // url: "https://u.expo.dev/d2314c7c-0cb1-4d1b-81af-dbe2fbd05019",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    // eas: {
    //   projectId: "d2314c7c-0cb1-4d1b-81af-dbe2fbd05019",
    // },
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
});
