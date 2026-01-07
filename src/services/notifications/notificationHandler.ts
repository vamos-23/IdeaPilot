import * as Notifications from "expo-notifications";

//controls notification handling when app is foregrounded (receive notifications even while using the app)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
