import { canOpenURL, openURL } from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export const openLink = async (webUrl: string, type: "youtube" | "github") => {
  let appSchemeUrl = webUrl;
  if (type === "youtube") {
    const videoId = webUrl.split("v=")[1];
    appSchemeUrl = Platform.select({
      android: `vnd.youtube:${videoId}`,
      default: webUrl,
    });
  }
  try {
    const canOpenApp = await canOpenURL(appSchemeUrl);
    if (canOpenApp) {
      await openURL(appSchemeUrl);
    } else {
      throw new Error("App not installed");
    }
  } catch {
    await WebBrowser.openBrowserAsync(webUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: type === "youtube" ? "#ea580c" : "#0ea5e9",
      dismissButtonStyle: "close",
    });
  }
};
