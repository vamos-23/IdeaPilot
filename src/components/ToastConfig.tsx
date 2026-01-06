import { BaseToast, ErrorToast } from "react-native-toast-message";
import type { BaseToastProps } from "react-native-toast-message";
import useThemeStore from "@/src/store/useThemeStore";

export const toastConfig = {
  success: (props: BaseToastProps) => {
    const { theme } = useThemeStore.getState();
    const isDark = theme === "dark";

    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#22C55E",
          backgroundColor: isDark ? "#052e1a" : "#ECFDF5",
        }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: isDark ? "#bbf7d0" : "#065F46",
        }}
        text2Style={{
          fontSize: 13,
          color: isDark ? "#86efac" : "#047857",
          flexWrap: 'wrap'
        }}
      />
    );
  },

  error: (props: BaseToastProps) => {
    const { theme } = useThemeStore.getState();
    const isDark = theme === "dark";

    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#EF4444",
          backgroundColor: isDark ? "#3f0d0d" : "#FEF2F2",
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: isDark ? "#fecaca" : "#7F1D1D",
        }}
        text2Style={{
          fontSize: 13,
          color: isDark ? "#fca5a5" : "#991B1B",
          flexWrap: 'wrap'
        }}
      />
    );
  },

  info: (props: BaseToastProps) => {
    const { theme } = useThemeStore.getState();
    const isDark = theme === "dark";

    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#3B82F6",
          backgroundColor: isDark ? "#0a1e3a" : "#EFF6FF",
        }}
        contentContainerStyle={{ paddingHorizontal: 14 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: isDark ? "#bfdbfe" : "#1E3A8A",
        }}
        text2Style={{
          fontSize: 13,
          color: isDark ? "#93c5fd" : "#1D4ED8",
        }}
      />
    );
  },
};
