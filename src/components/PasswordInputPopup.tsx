import { clsx } from "clsx";
import { Eye, EyeOff, X } from "lucide-react-native";
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
import SubmitButton from "./SubmitButton";

type PasswordInputProps = {
  onClose: () => void;
  action: () => void;
  pendingEmail: string;
  appTheme: string;
};

export default function PasswordInputPopup({
  onClose,
  action,
  pendingEmail,
  appTheme
}: PasswordInputProps) {
  const [password, setPassword] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const updateEmailWithPassword = async (currentPassword: string) => {
    const pw = currentPassword.trim();
    if (!pw) {
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
      await updateUserEmail(pendingEmail, pw);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      Toast.show({
        type: "success",
        text1: "Email Updated",
        text2: "Your email has been updated successfully!",
        topOffset: sc(45),
      });
      action();
      setPassword("");
      setShowPassword(false);
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
                  Enter Password
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
                  "flex-row items-center bg-brandLight dark:bg-brandDark mb-6", 
                  isFocus
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="text-textLight dark:text-white font-nata-sans-medium flex-1"
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  placeholder="Enter current password"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  secureTextEntry={!showPassword}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1 ml-1"
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff
                      size={sc(18)}
                      stroke={appTheme === "dark" ? "#94A3B8" : "#64748B"}
                    />
                  ) : (
                    <Eye
                      size={sc(18)}
                      stroke={appTheme === "dark" ? "#94A3B8" : "#64748B"}
                    />
                  )}
                </TouchableOpacity>
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
