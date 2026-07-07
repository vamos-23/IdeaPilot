import { clsx } from "clsx";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Eye, EyeOff, X } from "lucide-react-native";
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
import { auth } from "@/config/FirebaseConfig";
import { sc, vs } from "../constants/responsive";
import SubmitButton from "./SubmitButton";

type ConfirmPasswordModalProps = {
  visible: boolean;
  appTheme: string;
  title: string;
  description?: string;
  confirmButtonText: string;
  loadingText: string;
  onClose: () => void;
  onAuthenticated: () => Promise<void>;
};

export default function ConfirmPasswordModal({
  visible,
  appTheme,
  title,
  description,
  confirmButtonText,
  loadingText,
  onClose,
  onAuthenticated,
}: ConfirmPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setFocused] = useState(false);

  if (!visible) return null;

  const handleVerify = async () => {
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      Toast.show({
        type: "error",
        text1: "Password Required",
        text2: "Please enter your current password.",
        topOffset: sc(45),
      });
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error("No authenticated user.");
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        trimmedPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await onAuthenticated();

      setPassword("");
      setShowPassword(false);

      Keyboard.dismiss();

      onClose();
    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/wrong-password") {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: "The password you entered is incorrect.",
          topOffset: sc(45),
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: "Please try again.",
          topOffset: sc(45),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "android" ? 30 : 120}
          contentContainerStyle={styles.keyboardContainer}
        >
          <TouchableWithoutFeedback>
            <View
              style={styles.popup}
              className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark shadow-xl"
            >
              <View className="flex-row justify-between items-center mb-5">
                <Text
                  style={styles.title}
                  className="text-textLight dark:text-white font-nata-sans-bold"
                >
                  {title}
                </Text>

                <TouchableOpacity
                  className="bg-brandLight dark:bg-brandDark rounded-full p-1.5"
                  onPress={onClose}
                >
                  <X
                    size={sc(18)}
                    strokeWidth={2.5}
                    stroke={appTheme === "dark" ? "#F8FAFC" : "#0F172A"}
                  />
                </TouchableOpacity>
              </View>

              {description && (
                <Text className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mb-5">
                  {description}
                </Text>
              )}

              <View
                style={styles.input}
                className={clsx(
                  "flex-row items-center bg-brandLight dark:bg-brandDark",
                  isFocused
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="flex-1 text-textLight dark:text-white font-nata-sans-medium"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Current Password"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      stroke={appTheme === "dark" ? "#94A3B8" : "#64748B"}
                    />
                  ) : (
                    <Eye
                      size={18}
                      stroke={appTheme === "dark" ? "#94A3B8" : "#64748B"}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View className="mt-6">
                <SubmitButton
                  buttonText={confirmButtonText}
                  loadingText={loadingText}
                  isLoading={loading}
                  isDisabled={false}
                  onSubmit={handleVerify}
                />
              </View>
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
    backgroundColor: "rgba(15,23,42,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
  },

  popup: {
    width: sc(310),
    borderRadius: sc(20),
    padding: sc(24),
  },

  title: {
    fontSize: sc(18),
  },

  input: {
    width: "100%",
    height: vs(42),
    borderRadius: sc(10),
    paddingHorizontal: sc(12),
  },
});
