import "dotenv/config";

const isDev = process.env.ANDROID_PACKAGE === "com.vamos23.ideapilot.dev";

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

  android: {
    package: process.env.ANDROID_PACKAGE || "com.vamos23.ideapilot",
    googleServicesFile: isDev
      ? (process.env.GOOGLE_SERVICES_JSON_DEV || "./google-services-dev.json")
      : (process.env.GOOGLE_SERVICES_JSON_PROD || "./google-services-prod.json"),
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
    [
      "@sentry/react-native",
      {
        url: "https://sentry.io",
        project: "ideapilot",
        organization: "adrij-samanta",
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
  },
});