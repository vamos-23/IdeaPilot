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
} from "react-native";
import Toast from "react-native-toast-message";
import { sc, vs } from "../constants/responsive";
import { updateUserEmail } from "../lib/auth/updateUserEmail";
import useThemeStore from "../store/useThemeStore";
import SubmitButton from "./SubmitButton";

type PasswordInputProps = {
  onClose: () => void;
  action: () => void;
  pendingEmail: string;
};
export default function PasswordInputPopup({
  onClose,
  action,
  pendingEmail,
}: PasswordInputProps) {
  const { theme } = useThemeStore();
  const [password, setPassword] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const updateEmailWithPassword = async (currentPassword: string) => {
    const password = currentPassword.trim();
    if (!password) {
      Toast.show({
        type: "error",
        text1: "Password Missing",
        text2: "Please enter current password",
        topOffset: sc(45),
      });
      Keyboard.dismiss();
      return;
    }
    try {
      setLoading(true);
      await updateUserEmail(pendingEmail, password);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      Toast.show({
        type: "success",
        text1: "Email Updated",
        text2: "Your email has been updated successfully!",
        topOffset: sc(45),
      });
      action();
      setPassword("");
      Keyboard.dismiss();
    } catch (error: any) {
      console.log(error.message);
      Toast.show({
        type: "error",
        text1: "Email Update Failed",
        text2: "Email could not be updated.",
        topOffset: sc(45),
      });
    } finally {
      setLoading(false);
    }
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
              className="bg-[#F5F5F5] dark:bg-[#03154c] border-blue-500 dark:border-gray-500"
            >
              <View className="flex-row justify-between">
                <Text
                  className="text-black dark:text-white font-nata-sans-bold"
                  style={styles.title}
                >
                  Enter Current Password
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
                  cursorColor={theme === "light" ? "green" : "tomato"}
                  placeholder="Enter current password"
                  placeholderTextColor={
                    theme === "light" ? "dimgrey" : "silver"
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <SubmitButton
                buttonText="Update Email"
                isDisabled={false}
                isLoading={isLoading}
                loadingText="Updating email..."
                onSubmit={() => updateEmailWithPassword(password)}
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
  },
});
