import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: process.env.APP_NAME || "IdeaPilot",
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
      dark: {
        image: "./assets/images/logo-dark.svg",
        backgroundColor: "#000000"
      }
    },
  },
  */
  android: {
    package: process.env.ANDROID_PACKAGE || "com.vamos23.ideapilot",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    softwareKeyboardLayoutMode: "resize",
    launchMode: "singleTask",

    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
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
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        imageWidth: 300,
        resizeMode: "contain",
        backgroundColor: "#5C50CF",
        dark: {
          image: "./assets/images/logo.png",
          imageWidth: 300,
          resizeMode: "contain",
          backgroundColor: "#3A1B67",
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
    url: "https://u.expo.dev/37955152-0da1-41b9-a735-dfc819e7f784",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    eas: {
      projectId: "37955152-0da1-41b9-a735-dfc819e7f784",
    },
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
});
