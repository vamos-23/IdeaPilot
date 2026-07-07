import { clsx } from "clsx";
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
import SubmitButton from "./SubmitButton";
import { sc, vs } from "../constants/responsive";
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from "../constants/auth";

type ChangePasswordModalProps = {
  visible: boolean;
  appTheme: string;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
};

export default function ChangePasswordModal({
  visible,
  appTheme,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const reset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    Keyboard.dismiss();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const password = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!password || !confirm) {
      Toast.show({
        type: "error",
        text1: "Missing Password",
        text2: "Please fill in both password fields.",
        topOffset: sc(45),
      });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: PASSWORD_MESSAGE,
        topOffset: sc(45),
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Passwords Don't Match",
        text2: "Please enter the same password in both fields.",
        topOffset: sc(45),
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit(password);

      Toast.show({
        type: "success",
        text1: "Password Updated",
        text2: "Your password has been changed successfully.",
        topOffset: sc(45),
      });

      handleClose();
    } catch (error: any) {
      console.warn(error);

      Toast.show({
        type: "error",
        text1: "Password Update Failed",
        text2: "Please try again.",
        topOffset: sc(45),
      });
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
                  className="text-textLight dark:text-white font-nata-sans-bold"
                  style={styles.title}
                >
                  Change Password
                </Text>

                <TouchableOpacity
                  onPress={handleClose}
                  className="bg-brandLight dark:bg-brandDark rounded-full p-1.5"
                >
                  <X
                    size={sc(18)}
                    strokeWidth={2.5}
                    stroke={appTheme === "dark" ? "#F8FAFC" : "#0F172A"}
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mb-5">
                Enter your new password below.
              </Text>

              <View
                style={styles.input}
                className={clsx(
                  "flex-row items-center bg-brandLight dark:bg-brandDark mb-4",
                  newFocused
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="flex-1 text-textLight dark:text-white font-nata-sans-medium"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="New Password"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  onFocus={() => setNewFocused(true)}
                  onBlur={() => setNewFocused(false)}
                />

                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
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

              <View
                style={styles.input}
                className={clsx(
                  "flex-row items-center bg-brandLight dark:bg-brandDark",
                  confirmFocused
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="flex-1 text-textLight dark:text-white font-nata-sans-medium"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                  buttonText="Update Password"
                  loadingText="Updating Password..."
                  isLoading={loading}
                  isDisabled={false}
                  onSubmit={handleSubmit}
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
    padding: sc(24),
    borderRadius: sc(20),
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
