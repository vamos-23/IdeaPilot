import { clsx } from "clsx";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import { sc, vs } from "../constants/responsive";
import useAuthStore from "../store/useAuthStore";
import SubmitButton from "./SubmitButton";

type EmailInputProps = {
  onClose: () => void;
  action: (new_email: string) => void;
  appTheme: string;
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailInputPopup({
  onClose,
  action,
  appTheme,
}: EmailInputProps) {
  const user = useAuthStore((s) => s.user);
  const [email, setEmail] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const storeNewEmail = (new_email: string) => {
    const emailStr = new_email.toLowerCase().trim();
    if (emailStr === user?.userEmail?.toLowerCase()) {
      Toast.show({
        type: "info",
        text1: "Email Status",
        text2: "Email already in use.",
        topOffset: sc(45),
      });
      return;
    }
    if (!EMAIL_REGEX.test(emailStr)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email!",
        text2: "Please enter valid email address.",
        topOffset: sc(45),
      });
      return;
    }
    action(emailStr);
    setEmail("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          contentContainerStyle={styles.overView}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "android" ? 30 : 120}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={styles.popup}
              className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark shadow-xl"
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text
                  className="text-textLight dark:text-white font-nata-sans-bold"
                  style={styles.title}
                >
                  Enter New Email
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-brandLight dark:bg-brandDark p-1.5 rounded-full"
                >
                  <X
                    stroke={appTheme === "dark" ? "#F8FAFC" : "#0F172A"}
                    size={sc(18)}
                    strokeWidth={sc(2.5)}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={styles.input}
                className={clsx(
                  "bg-brandLight dark:bg-brandDark mb-6",
                  isFocus
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="text-textLight dark:text-white font-nata-sans-medium flex-1"
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  placeholder="Enter new email"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  overView: {
    flex: 1,
    justifyContent: "center",
  },
  popup: {
    width: sc(310),
    padding: sc(24),
    borderRadius: sc(20),
  },
  input: {
    width: "100%",
    height: vs(42),
    borderRadius: sc(10),
    paddingHorizontal: sc(12),
  },
  title: {
    fontSize: sc(18),
  },
});
