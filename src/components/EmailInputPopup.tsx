import { clsx } from "clsx";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { sc, vs } from "../constants/responsive";
import useThemeStore from "../store/useThemeStore";
import useAuthStore from "../store/useAuthStore";
import SubmitButton from "./SubmitButton";
import Toast from "react-native-toast-message";

type EmailInputProps = {
  onClose: () => void;
  action: (new_email: string) => void;
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export default function EmailInputPopup({ onClose, action }: EmailInputProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const storeNewEmail = (new_email: string) => {
    const email = new_email.toLowerCase().trim();
    if (email === user?.userEmail?.toLowerCase()) {
      Toast.show({
        type: "info",
        text1: "Email Status",
        text2: "Email already in use.",
        topOffset: sc(45),
      });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email!",
        text2: "Please enter valid email.",
        topOffset: sc(45),
      });
      return;
    }
    action(email);
    setEmail("");
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          contentContainerStyle={styles.overView}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "android" ? 60 : 120}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={styles.popup}
              className="bg-[#F5F5F5] dark:bg-[#03154c] border-blue-500 
              dark:border-gray-500"
            >
              <View className="flex-row justify-between">
                <Text
                  className="text-black dark:text-white font-nata-sans-bold"
                  style={styles.title}
                >
                  Enter New Email
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <X
                    stroke={theme === "dark" ? "#ffffff" : "#000000"}
                    size={sc(20)}
                    strokeWidth={sc(3)}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={styles.input}
                className={clsx(
                  "bg-slate-300 dark:bg-[#293253] mb-5",
                  isFocus
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-[#307ae8b5] dark:border-blue-800"
                )}
              >
                <TextInput
                  className="text-black dark:text-textDark font-semibold"
                  cursorColor={theme === "light" ? "black" : "tomato"}
                  placeholder="Enter new email"
                  placeholderTextColor={
                    theme === "light" ? "dimgrey" : "silver"
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <SubmitButton
                buttonText="Proceed"
                isDisabled={!email.trim()}
                onSubmit={() => storeNewEmail(email)}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  overView: {
    flex: 1,
  },
  popup: {
    width: sc(285),
    padding: sc(20),
    borderRadius: sc(12),
    borderWidth: sc(1.7),
  },
  input: {
    width: "100%",
    height: vs(38),
    borderRadius: sc(7),
    borderWidth: sc(2),
    paddingHorizontal: sc(5),
  },
  title: {
    fontSize: sc(16),
    textAlign: "center",
    marginBottom: sc(16),
    paddingHorizontal: sc(5),
  },
});
