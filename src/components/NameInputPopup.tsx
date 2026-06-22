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
import { updateDisplayName } from "../lib/auth/updateDisplayName";

import useAuthStore from "../store/useAuthStore";
import SubmitButton from "./SubmitButton";

type NameInputProps = {
  onClose: () => void;
  action: () => void;
  appTheme: string;
};

export default function NameInputPopup({
  onClose,
  action,
  appTheme,
}: NameInputProps) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const updateName = async (newName: string) => {
    const normalizedNewName = newName.trim();
    const currentName = user?.userName?.trim();

    if (!normalizedNewName) {
      Toast.show({
        type: "error",
        text1: "Invalid name",
        text2: "Display name cannot be empty.",
        topOffset: sc(45),
      });
      return;
    }

    if (
      currentName &&
      normalizedNewName.toLowerCase() === currentName.toLowerCase()
    ) {
      Toast.show({
        type: "info",
        text1: "No changes detected",
        text2: "This is already your current display name.",
        topOffset: sc(45),
      });
      setName("");
      Keyboard.dismiss();
      return;
    }

    try {
      setLoading(true);
      await updateDisplayName(normalizedNewName);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Toast.show({
        type: "success",
        text1: "Display name updated",
        text2: "Your display name was updated successfully.",
        topOffset: sc(45),
      });

      setName("");
      Keyboard.dismiss();
      action();
    } catch (error: any) {
      console.error(error.message);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Please try again.",
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
                  Update Name
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
                  placeholder="Enter new display name"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <SubmitButton
                buttonText="Update Display Name"
                isLoading={isLoading}
                isDisabled={false}
                onSubmit={() => updateName(name)}
                loadingText="Updating name..."
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
